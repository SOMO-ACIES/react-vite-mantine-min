const express = require('express');
const { body, query, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const prisma = require('../lib/prisma');
const _ = require('lodash');

const router = express.Router();

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: Get all devices
 *     tags: [Devices]
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
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand
 *       - in: query
 *         name: channel
 *         schema:
 *           type: string
 *         description: Filter by channel
 *       - in: query
 *         name: riskLevel
 *         schema:
 *           type: string
 *         description: Filter by risk level
 *       - in: query
 *         name: healthScore
 *         schema:
 *           type: integer
 *         description: Filter by health score
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: List of devices
 */
// GET /api/v1/devices - Get all devices with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('brand').optional().isString().withMessage('Brand must be a string'),
  query('channel').optional().isString().withMessage('Channel must be a string'),
  query('riskLevel').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Risk level must be LOW, MEDIUM, or HIGH'),
  query('healthScore').optional().isInt({ min: 0, max: 100 }).withMessage('Health score must be between 0 and 100'),
  query('search').optional().isString().withMessage('Search must be a string'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { brand, channel, riskLevel, healthScore, search, page = 1, limit = 20 } = req.query;
    
    // Build where clause
    const where = {};
    
    if (brand) {
      where.device_brand = { contains: brand, mode: 'insensitive' };
    }
    
    if (channel) {
      where.udc_channel = { contains: channel, mode: 'insensitive' };
    }
    
    if (riskLevel) {
      where.riskLevel = riskLevel;
    }
    
    if (healthScore) {
      where.healthScore = { lte: parseInt(healthScore) };
    }
    
    if (search) {
      where.OR = [
        { device_name: { contains: search, mode: 'insensitive' } },
        { device_brand: { contains: search, mode: 'insensitive' } },
        { device_id: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count
    const totalCount = await prisma.device.count({ where });
    
    // Get paginated devices
    const devices = await prisma.device.findMany({
      where,
      include: {
        customer: {
          select: {
            name: true,
            supportLevel: true
          }
        }
      },
      orderBy: [
        { riskLevel: 'desc' },
        { healthScore: 'asc' },
        { updatedAt: 'desc' }
      ],
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit)
    });

    // Calculate statistics
    const stats = await prisma.device.aggregate({
      where,
      _count: {
        id: true
      },
      _avg: {
        healthScore: true
      }
    });

    const riskStats = await prisma.device.groupBy({
      by: ['riskLevel'],
      where,
      _count: {
        riskLevel: true
      }
    });

    const warrantyExpiring = await prisma.device.count({
      where: {
        ...where,
        warrantyStatus: true,
        warrantyExpiryDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }
      }
    });

    const deviceStats = {
      total: stats._count.id,
      online: await prisma.device.count({
        where: {
          ...where,
          lastSeen: {
            gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
          }
        }
      }),
      avgHealthScore: Math.round(stats._avg.healthScore || 0),
      warrantyExpiring,
      riskDistribution: riskStats.reduce((acc, item) => {
        acc[item.riskLevel?.toLowerCase() || 'unknown'] = item._count.riskLevel;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: devices,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) * parseInt(limit) < totalCount,
        hasPrevPage: parseInt(page) > 1
      },
      stats: deviceStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch devices' },
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /devices/{id}:
 *   get:
 *     summary: Get device by ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID
 *     responses:
 *       200:
 *         description: Device details
 *       404:
 *         description: Device not found
 */
// GET /api/v1/devices/:id - Get device by ID
router.get('/:id', [
  param('id').isString().withMessage('Device ID must be a string'),
  handleValidationErrors
], async (req, res) => {
  try {
    const device = await prisma.device.findUnique({
      where: { device_id: req.params.id },
      include: {
        customer: true,
        tickets: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        telemetryData: {
          orderBy: { timestamp: 'desc' },
          take: 100
        }
      }
    });
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: { message: 'Device not found' },
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      data: device,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching device:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch device' },
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /devices/{id}/telemetry:
 *   get:
 *     summary: Get device telemetry
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID
 *       - in: query
 *         name: hours
 *         schema:
 *           type: integer
 *         description: Number of hours
 *     responses:
 *       200:
 *         description: Device telemetry data
 *       404:
 *         description: Device not found
 */
// GET /api/v1/devices/:id/telemetry - Get device telemetry
router.get('/:id/telemetry', [
  param('id').isString().withMessage('Device ID must be a string'),
  query('hours').optional().isInt({ min: 1, max: 168 }).withMessage('Hours must be between 1 and 168'),
  handleValidationErrors
], async (req, res) => {
  try {
    const device = await prisma.device.findUnique({
      where: { device_id: req.params.id }
    });
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: { message: 'Device not found' },
        timestamp: new Date().toISOString()
      });
    }
    
    const hours = parseInt(req.query.hours) || 24;
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const telemetryData = await prisma.telemetryData.findMany({
      where: {
        device_id: req.params.id,
        timestamp: {
          gte: startTime
        }
      },
      orderBy: { timestamp: 'asc' }
    });
    
    // Calculate summary statistics
    const summary = {
      avgTemperature: _.meanBy(telemetryData, 'temperature')?.toFixed(1) || '0',
      avgCpuUsage: _.meanBy(telemetryData, 'cpuUsage')?.toFixed(1) || '0',
      avgMemoryUsage: _.meanBy(telemetryData, 'memoryUsage')?.toFixed(1) || '0',
      avgDiskUsage: _.meanBy(telemetryData, 'diskUsage')?.toFixed(1) || '0',
      avgPowerConsumption: _.meanBy(telemetryData, 'powerConsumption')?.toFixed(1) || '0'
    };
    
    res.json({
      success: true,
      data: {
        device_id: device.device_id,
        device_name: device.device_name,
        telemetry: telemetryData,
        summary
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching telemetry data:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch telemetry data' },
      timestamp: new Date().toISOString()
    });
  }
});

// POST /api/v1/devices/:id/actions/notify - Send notification for device
router.post('/:id/actions/notify', [
  param('id').isString().withMessage('Device ID must be a string'),
  body('message').isString().notEmpty().withMessage('Message is required'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Priority must be LOW, MEDIUM, or HIGH'),
  body('recipients').optional().isArray().withMessage('Recipients must be an array'),
  handleValidationErrors
], async (req, res) => {
  try {
    const device = await prisma.device.findUnique({
      where: { device_id: req.params.id },
      include: { customer: true }
    });
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: { message: 'Device not found' },
        timestamp: new Date().toISOString()
      });
    }
    
    const { message, priority = 'MEDIUM', recipients = [] } = req.body;
    
    // Create system event for the notification
    await prisma.systemEvent.create({
      data: {
        type: 'ALERT',
        title: 'Device Notification Sent',
        message: `Notification sent for device ${device.device_name}`,
        details: message,
        severity: priority,
        source: 'NOTIFICATION_SYSTEM',
        metadata: JSON.stringify({
          device_id: device.device_id,
          recipients,
          timestamp: new Date().toISOString()
        })
      }
    });
    
    const notification = {
      id: `NOTIF-${Date.now()}`,
      device_id: device.device_id,
      device_name: device.device_name,
      customer: device.customer.name,
      message,
      priority,
      recipients,
      status: 'sent',
      sentAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: notification,
      message: 'Notification sent successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to send notification' },
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/v1/devices/stats/summary - Get device statistics summary
router.get('/stats/summary', async (req, res) => {
  try {
    const totalDevices = await prisma.device.count();
    const onlineDevices = await prisma.device.count({
      where: {
        lastSeen: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
        }
      }
    });

    const riskDistribution = await prisma.device.groupBy({
      by: ['riskLevel'],
      _count: {
        riskLevel: true
      }
    });

    const brandDistribution = await prisma.device.groupBy({
      by: ['device_brand'],
      _count: {
        device_brand: true
      }
    });

    const channelDistribution = await prisma.device.groupBy({
      by: ['udc_channel'],
      _count: {
        udc_channel: true
      }
    });

    const healthStats = await prisma.device.aggregate({
      _avg: { healthScore: true },
      _min: { healthScore: true },
      _max: { healthScore: true }
    });

    const warrantyStats = await prisma.device.groupBy({
      by: ['warrantyStatus'],
      _count: {
        warrantyStatus: true
      }
    });

    const expiringSoon = await prisma.device.count({
      where: {
        warrantyStatus: true,
        warrantyExpiryDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const stats = {
      total: totalDevices,
      online: onlineDevices,
      offline: totalDevices - onlineDevices,
      riskDistribution: riskDistribution.reduce((acc, item) => {
        acc[item.riskLevel?.toLowerCase() || 'unknown'] = item._count.riskLevel;
        return acc;
      }, {}),
      brandDistribution: brandDistribution.reduce((acc, item) => {
        acc[item.device_brand] = item._count.device_brand;
        return acc;
      }, {}),
      channelDistribution: channelDistribution.reduce((acc, item) => {
        acc[item.udc_channel] = item._count.udc_channel;
        return acc;
      }, {}),
      healthScoreStats: {
        average: healthStats._avg.healthScore?.toFixed(1) || '0',
        minimum: healthStats._min.healthScore || 0,
        maximum: healthStats._max.healthScore || 0
      },
      warrantyStats: {
        active: warrantyStats.find(w => w.warrantyStatus)?._count.warrantyStatus || 0,
        expired: warrantyStats.find(w => !w.warrantyStatus)?._count.warrantyStatus || 0,
        expiringSoon
      }
    };
    
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching device statistics:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch device statistics' },
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;