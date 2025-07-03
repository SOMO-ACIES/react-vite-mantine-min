const express = require('express');
const { body, query, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const prisma = require('../lib/prisma');

const router = express.Router();

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
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
 *         name: supportLevel
 *         schema:
 *           type: string
 *         description: Filter by support level
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: List of customers
 */
// GET /api/v1/customers - Get all customers with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('supportLevel').optional().isIn(['BASIC', 'PREMIUM', 'ENTERPRISE']).withMessage('Invalid support level'),
  query('status').optional().isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']).withMessage('Invalid status'),
  query('search').optional().isString().withMessage('Search must be a string'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { supportLevel, status, search, page = 1, limit = 20 } = req.query;
    
    // Build where clause
    const where = {};
    
    if (supportLevel) {
      where.supportLevel = supportLevel;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { contact: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { customer_id: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count
    const totalCount = await prisma.customer.count({ where });
    
    // Get paginated customers
    const customers = await prisma.customer.findMany({
      where,
      include: {
        _count: {
          select: {
            devices: true,
            tickets: true
          }
        }
      },
      orderBy: [
        { supportLevel: 'desc' },
        { name: 'asc' }
      ],
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit)
    });

    res.json({
      success: true,
      data: customers,
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
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch customers' },
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer details
 *       404:
 *         description: Customer not found
 */
// GET /api/v1/customers/:id - Get customer by ID
router.get('/:id', [
  param('id').isString().withMessage('Customer ID must be a string'),
  handleValidationErrors
], async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { customer_id: req.params.id },
      include: {
        devices: {
          orderBy: { updatedAt: 'desc' },
          take: 10
        },
        tickets: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            devices: true,
            tickets: true
          }
        }
      }
    });
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: { message: 'Customer not found' },
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      data: customer,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch customer' },
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *               supportLevel:
 *                 type: string
 *               accountManager:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created
 *       400:
 *         description: Invalid input
 */
// POST /api/v1/customers - Create new customer
router.post('/', [
  body('name').isString().notEmpty().withMessage('Customer name is required'),
  body('contact').isString().notEmpty().withMessage('Contact person is required'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().isString().withMessage('Phone must be a string'),
  body('location').isString().notEmpty().withMessage('Location is required'),
  body('supportLevel').isIn(['BASIC', 'PREMIUM', 'ENTERPRISE']).withMessage('Support level must be BASIC, PREMIUM, or ENTERPRISE'),
  body('accountManager').optional().isString().withMessage('Account manager must be a string'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { name, contact, email, phone, location, supportLevel, accountManager } = req.body;
    
    const newCustomer = await prisma.customer.create({
      data: {
        customer_id: `CUST-${Date.now()}`,
        name,
        contact,
        email: email || null,
        phone: phone || null,
        location,
        supportLevel,
        deviceCount: 0,
        contractStart: new Date(),
        contractEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        accountManager: accountManager || 'Unassigned',
        status: 'ACTIVE'
      }
    });
    
    res.status(201).json({
      success: true,
      data: newCustomer,
      message: 'Customer created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create customer' },
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Update a customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *               supportLevel:
 *                 type: string
 *               accountManager:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Customer not found
 */
// PUT /api/v1/customers/:id - Update customer
router.put('/:id', [
  param('id').isString().withMessage('Customer ID must be a string'),
  body('name').optional().isString().notEmpty().withMessage('Customer name cannot be empty'),
  body('contact').optional().isString().notEmpty().withMessage('Contact person cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().isString().withMessage('Phone must be a string'),
  body('location').optional().isString().notEmpty().withMessage('Location cannot be empty'),
  body('supportLevel').optional().isIn(['BASIC', 'PREMIUM', 'ENTERPRISE']).withMessage('Invalid support level'),
  body('accountManager').optional().isString().withMessage('Account manager must be a string'),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']).withMessage('Invalid status'),
  handleValidationErrors
], async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { customer_id: req.params.id }
    });
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: { message: 'Customer not found' },
        timestamp: new Date().toISOString()
      });
    }
    
    const updatedCustomer = await prisma.customer.update({
      where: { customer_id: req.params.id },
      data: req.body
    });
    
    res.json({
      success: true,
      data: updatedCustomer,
      message: 'Customer updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update customer' },
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/v1/customers/stats/summary - Get customer statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const totalCustomers = await prisma.customer.count();
    
    const supportLevelStats = await prisma.customer.groupBy({
      by: ['supportLevel'],
      _count: {
        supportLevel: true
      }
    });
    
    const statusStats = await prisma.customer.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });
    
    const deviceStats = await prisma.customer.aggregate({
      _sum: { deviceCount: true },
      _avg: { deviceCount: true }
    });
    
    const contractsExpiringSoon = await prisma.customer.count({
      where: {
        contractEnd: {
          gte: new Date(),
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }
      }
    });
    
    const stats = {
      total: totalCustomers,
      bySupportLevel: supportLevelStats.reduce((acc, item) => {
        acc[item.supportLevel.toLowerCase()] = item._count.supportLevel;
        return acc;
      }, {}),
      byStatus: statusStats.reduce((acc, item) => {
        acc[item.status.toLowerCase()] = item._count.status;
        return acc;
      }, {}),
      totalDevices: deviceStats._sum.deviceCount || 0,
      avgDevicesPerCustomer: deviceStats._avg.deviceCount?.toFixed(1) || '0',
      contractsExpiringSoon
    };
    
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching customer statistics:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch customer statistics' },
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;