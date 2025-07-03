const express = require('express');
const { body, query, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const prisma = require('../lib/prisma');
const moment = require('moment');

const router = express.Router();

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Get all tickets
 *     tags: [Tickets]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: Filter by priority
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *         description: Filter by assigned user
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: List of tickets
 */
// GET /api/v1/tickets - Get all tickets with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['ANALYSIS', 'CRITICAL', 'ASSIGNED', 'RESOLVED', 'WAITING', 'CLOSED']).withMessage('Invalid status'),
  query('priority').optional().isIn(['HIGH', 'MEDIUM', 'LOW']).withMessage('Invalid priority'),
  query('assignedTo').optional().isString().withMessage('AssignedTo must be a string'),
  query('search').optional().isString().withMessage('Search must be a string'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { status, priority, assignedTo, search, page = 1, limit = 20 } = req.query;
    
    // Build where clause
    const where = {};
    
    if (status) {
      where.status = status;
    }
    
    if (priority) {
      where.priority = priority;
    }
    
    if (assignedTo) {
      where.assignedTo = { contains: assignedTo, mode: 'insensitive' };
    }
    
    if (search) {
      where.OR = [
        { ticket_id: { contains: search, mode: 'insensitive' } },
        { issue: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { device: { device_name: { contains: search, mode: 'insensitive' } } },
        { customer: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Get total count
    const totalCount = await prisma.ticket.count({ where });
    
    // Get paginated tickets
    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        device: {
          select: {
            device_name: true,
            device_brand: true,
            healthScore: true,
            riskLevel: true
          }
        },
        customer: {
          select: {
            name: true,
            supportLevel: true
          }
        },
        telemetrySnapshot: true
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit)
    });

    res.json({
      success: true,
      data: tickets,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) * parseInt(limit) < totalCount,
        hasPrevPage: parseInt(page) > 1
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch tickets' },
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get ticket by ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket details
 *       404:
 *         description: Ticket not found
 */
// GET /api/v1/tickets/:id - Get ticket by ID
router.get('/:id', [
  param('id').isString().withMessage('Ticket ID must be a string'),
  handleValidationErrors
], async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { ticket_id: req.params.id },
      include: {
        device: true,
        customer: true,
        telemetrySnapshot: true
      }
    });
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: { message: 'Ticket not found' },
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      data: ticket,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch ticket' },
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               device_id:
 *                 type: string
 *               customer_id:
 *                 type: string
 *               issue:
 *                 type: string
 *               priority:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *               description:
 *                 type: string
 *               confidence:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Ticket created
 *       400:
 *         description: Invalid input
 */
// POST /api/v1/tickets - Create new ticket
router.post('/', [
  body('device_id').isString().notEmpty().withMessage('Device ID is required'),
  body('customer_id').isString().notEmpty().withMessage('Customer ID is required'),
  body('issue').isString().notEmpty().withMessage('Issue description is required'),
  body('priority').isIn(['HIGH', 'MEDIUM', 'LOW']).withMessage('Priority must be HIGH, MEDIUM, or LOW'),
  body('assignedTo').optional().isString().withMessage('AssignedTo must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('confidence').optional().isInt({ min: 0, max: 100 }).withMessage('Confidence must be between 0 and 100'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { device_id, customer_id, issue, priority, assignedTo, description, confidence } = req.body;
    
    // Verify device and customer exist
    const device = await prisma.device.findUnique({
      where: { device_id },
      include: { customer: true }
    });
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: { message: 'Device not found' },
        timestamp: new Date().toISOString()
      });
    }
    
    if (device.customer_id !== customer_id) {
      return res.status(400).json({
        success: false,
        error: { message: 'Device does not belong to specified customer' },
        timestamp: new Date().toISOString()
      });
    }
    
    const newTicket = await prisma.ticket.create({
      data: {
        ticket_id: `T-${Date.now()}`,
        device_id,
        customer_id,
        issue,
        description: description || '',
        status: 'ANALYSIS',
        priority,
        confidence: confidence || Math.floor(Math.random() * 30) + 70,
        warranty: device.warrantyStatus,
        assignedTo: assignedTo || null,
        estimatedResolution: moment().add(Math.floor(Math.random() * 72), 'hours').toDate()
      },
      include: {
        device: {
          select: {
            device_name: true,
            device_brand: true
          }
        },
        customer: {
          select: {
            name: true
          }
        }
      }
    });
    
    // Create system event
    await prisma.systemEvent.create({
      data: {
        type: 'TICKET',
        title: 'New Ticket Created',
        message: `Ticket ${newTicket.ticket_id} created for device ${device.device_name}`,
        details: issue,
        severity: priority,
        source: 'TICKET_SYSTEM'
      }
    });
    
    res.status(201).json({
      success: true,
      data: newTicket,
      message: 'Ticket created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create ticket' },
      timestamp: new Date().toISOString()
    });
  }
});

// PUT /api/v1/tickets/:id - Update ticket
router.put('/:id', [
  param('id').isString().withMessage('Ticket ID must be a string'),
  body('status').optional().isIn(['ANALYSIS', 'CRITICAL', 'ASSIGNED', 'RESOLVED', 'WAITING', 'CLOSED']).withMessage('Invalid status'),
  body('priority').optional().isIn(['HIGH', 'MEDIUM', 'LOW']).withMessage('Invalid priority'),
  body('assignedTo').optional().isString().withMessage('AssignedTo must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
  handleValidationErrors
], async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { ticket_id: req.params.id }
    });
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: { message: 'Ticket not found' },
        timestamp: new Date().toISOString()
      });
    }
    
    const updateData = { ...req.body };
    
    // Set resolvedAt if status is being changed to RESOLVED or CLOSED
    if (req.body.status && ['RESOLVED', 'CLOSED'].includes(req.body.status) && !ticket.resolvedAt) {
      updateData.resolvedAt = new Date();
    }
    
    const updatedTicket = await prisma.ticket.update({
      where: { ticket_id: req.params.id },
      data: updateData,
      include: {
        device: {
          select: {
            device_name: true,
            device_brand: true
          }
        },
        customer: {
          select: {
            name: true
          }
        }
      }
    });
    
    res.json({
      success: true,
      data: updatedTicket,
      message: 'Ticket updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update ticket' },
      timestamp: new Date().toISOString()
    });
  }
});

// DELETE /api/v1/tickets/:id - Delete ticket
router.delete('/:id', [
  param('id').isString().withMessage('Ticket ID must be a string'),
  handleValidationErrors
], async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { ticket_id: req.params.id },
      include: {
        telemetrySnapshot: true
      }
    });
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: { message: 'Ticket not found' },
        timestamp: new Date().toISOString()
      });
    }
    
    // Delete telemetry snapshot if exists
    if (ticket.telemetrySnapshot) {
      await prisma.ticketTelemetry.delete({
        where: { ticket_id: req.params.id }
      });
    }
    
    // Delete the ticket
    const deletedTicket = await prisma.ticket.delete({
      where: { ticket_id: req.params.id }
    });
    
    res.json({
      success: true,
      data: deletedTicket,
      message: 'Ticket deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete ticket' },
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/v1/tickets/stats/summary - Get ticket statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const totalTickets = await prisma.ticket.count();
    
    const statusStats = await prisma.ticket.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });
    
    const priorityStats = await prisma.ticket.groupBy({
      by: ['priority'],
      _count: {
        priority: true
      }
    });
    
    const confidenceStats = await prisma.ticket.aggregate({
      _avg: { confidence: true }
    });
    
    const warrantyStats = await prisma.ticket.groupBy({
      by: ['warranty'],
      _count: {
        warranty: true
      }
    });
    
    const today = moment().startOf('day').toDate();
    const recentActivity = {
      createdToday: await prisma.ticket.count({
        where: {
          createdAt: { gte: today }
        }
      }),
      updatedToday: await prisma.ticket.count({
        where: {
          updatedAt: { gte: today }
        }
      }),
      resolvedToday: await prisma.ticket.count({
        where: {
          status: 'RESOLVED',
          resolvedAt: { gte: today }
        }
      })
    };
    
    const stats = {
      total: totalTickets,
      byStatus: statusStats.reduce((acc, item) => {
        acc[item.status.toLowerCase()] = item._count.status;
        return acc;
      }, {}),
      byPriority: priorityStats.reduce((acc, item) => {
        acc[item.priority.toLowerCase()] = item._count.priority;
        return acc;
      }, {}),
      avgConfidence: confidenceStats._avg.confidence?.toFixed(1) || '0',
      warrantyStats: {
        inWarranty: warrantyStats.find(w => w.warranty)?._count.warranty || 0,
        outOfWarranty: warrantyStats.find(w => !w.warranty)?._count.warranty || 0
      },
      recentActivity
    };
    
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching ticket statistics:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch ticket statistics' },
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;