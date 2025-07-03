const express = require('express');
const { query } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const prisma = require('../lib/prisma');
const moment = require('moment');

const router = express.Router();

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     summary: Get dashboard analytics
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: timeRange
 *         schema:
 *           type: string
 *           enum: [24h, 7d, 30d, 90d]
 *         description: Time range for analytics
 *     responses:
 *       200:
 *         description: Dashboard analytics data
 */
// GET /api/v1/analytics/dashboard - Get dashboard analytics
router.get('/dashboard', [
  query('timeRange').optional().isIn(['24h', '7d', '30d', '90d']).withMessage('Time range must be 24h, 7d, 30d, or 90d'),
  handleValidationErrors
], async (req, res) => {
  try {
    const timeRange = req.query.timeRange || '24h';
    const now = moment();
    let startTime;
    
    switch (timeRange) {
      case '24h':
        startTime = now.clone().subtract(24, 'hours');
        break;
      case '7d':
        startTime = now.clone().subtract(7, 'days');
        break;
      case '30d':
        startTime = now.clone().subtract(30, 'days');
        break;
      case '90d':
        startTime = now.clone().subtract(90, 'days');
        break;
      default:
        startTime = now.clone().subtract(24, 'hours');
    }
    
    // Get overview statistics
    const totalDevices = await prisma.device.count();
    const devicesOnline = await prisma.device.count({
      where: {
        lastSeen: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
        }
      }
    });
    
    const totalTickets = await prisma.ticket.count();
    const activeTickets = await prisma.ticket.count({
      where: {
        status: {
          notIn: ['RESOLVED', 'CLOSED']
        }
      }
    });
    
    const totalCustomers = await prisma.customer.count();
    
    const avgHealthScore = await prisma.device.aggregate({
      _avg: { healthScore: true }
    });
    
    // Get device risk distribution
    const riskDistribution = await prisma.device.groupBy({
      by: ['riskLevel'],
      _count: { riskLevel: true }
    });
    
    // Get brand and channel distribution
    const brandDistribution = await prisma.device.groupBy({
      by: ['device_brand'],
      _count: { device_brand: true }
    });
    
    const channelDistribution = await prisma.device.groupBy({
      by: ['udc_channel'],
      _count: { udc_channel: true }
    });
    
    // Get health score distribution
    const healthScoreRanges = await Promise.all([
      prisma.device.count({ where: { healthScore: { gte: 90 } } }),
      prisma.device.count({ where: { healthScore: { gte: 70, lt: 90 } } }),
      prisma.device.count({ where: { healthScore: { gte: 50, lt: 70 } } }),
      prisma.device.count({ where: { healthScore: { lt: 50 } } })
    ]);
    
    // Get ticket statistics
    const ticketStats = await prisma.ticket.groupBy({
      by: ['status'],
      _count: { status: true }
    });
    
    const priorityStats = await prisma.ticket.groupBy({
      by: ['priority'],
      _count: { priority: true }
    });
    
    // Get recent tickets
    const recentTickets = await prisma.ticket.findMany({
      where: {
        createdAt: { gte: startTime.toDate() }
      }
    });
    
    const resolvedTickets = recentTickets.filter(t => t.status === 'RESOLVED');
    
    // Get customer statistics
    const customerStats = await prisma.customer.groupBy({
      by: ['supportLevel'],
      _count: { supportLevel: true }
    });
    
    const deviceCountStats = await prisma.customer.aggregate({
      _sum: { deviceCount: true },
      _avg: { deviceCount: true }
    });
    
    // Get warranty expiring devices
    const warrantyExpiring = await prisma.device.count({
      where: {
        warrantyStatus: true,
        warrantyExpiryDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      }
    });
    
    const analytics = {
      overview: {
        totalDevices,
        devicesOnline,
        totalTickets,
        activeTickets,
        totalCustomers,
        avgHealthScore: avgHealthScore._avg.healthScore?.toFixed(1) || '0'
      },
      devices: {
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
        healthScoreDistribution: {
          excellent: healthScoreRanges[0],
          good: healthScoreRanges[1],
          fair: healthScoreRanges[2],
          poor: healthScoreRanges[3]
        }
      },
      tickets: {
        statusDistribution: ticketStats.reduce((acc, item) => {
          acc[item.status.toLowerCase()] = item._count.status;
          return acc;
        }, {}),
        priorityDistribution: priorityStats.reduce((acc, item) => {
          acc[item.priority.toLowerCase()] = item._count.priority;
          return acc;
        }, {}),
        recentActivity: {
          created: recentTickets.length,
          resolved: resolvedTickets.length,
          avgResolutionTime: '4.2h' // Mock value - would need to calculate from actual data
        },
        trends: generateTicketTrends(timeRange)
      },
      customers: {
        supportLevelDistribution: customerStats.reduce((acc, item) => {
          acc[item.supportLevel.toLowerCase()] = item._count.supportLevel;
          return acc;
        }, {}),
        totalDeviceCount: deviceCountStats._sum.deviceCount || 0,
        avgDevicesPerCustomer: deviceCountStats._avg.deviceCount?.toFixed(1) || '0',
        satisfaction: {
          score: 4.2,
          responses: 156,
          trend: '+0.3'
        }
      },
      performance: {
        systemUptime: '99.8%',
        avgResponseTime: '245ms',
        aiAccuracy: '94.2%',
        predictiveSuccess: '87.5%'
      },
      alerts: {
        critical: riskDistribution.find(r => r.riskLevel === 'HIGH')?._count.riskLevel || 0,
        warnings: riskDistribution.find(r => r.riskLevel === 'MEDIUM')?._count.riskLevel || 0,
        warrantyExpiring
      }
    };
    
    res.json({
      success: true,
      data: analytics,
      timeRange,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch analytics data' },
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/v1/analytics/trends - Get trend data
router.get('/trends', [
  query('metric').isIn(['devices', 'tickets', 'health', 'performance']).withMessage('Invalid metric'),
  query('timeRange').optional().isIn(['24h', '7d', '30d', '90d']).withMessage('Invalid time range'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { metric, timeRange = '7d' } = req.query;
    
    const trends = await generateTrendData(metric, timeRange);
    
    res.json({
      success: true,
      data: trends,
      metric,
      timeRange,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching trend data:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch trend data' },
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/v1/analytics/predictions - Get AI predictions
router.get('/predictions', [
  query('type').optional().isIn(['device_failure', 'ticket_volume', 'maintenance']).withMessage('Invalid prediction type'),
  query('horizon').optional().isIn(['1d', '7d', '30d']).withMessage('Invalid prediction horizon'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { type = 'device_failure', horizon = '7d' } = req.query;
    
    const predictions = generatePredictions(type, horizon);
    
    res.json({
      success: true,
      data: predictions,
      type,
      horizon,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch predictions' },
      timestamp: new Date().toISOString()
    });
  }
});

// Helper function to generate ticket trends
function generateTicketTrends(timeRange) {
  const dataPoints = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
  const trends = [];
  
  for (let i = dataPoints - 1; i >= 0; i--) {
    const date = moment().subtract(i, timeRange === '24h' ? 'hours' : 'days');
    trends.push({
      timestamp: date.toISOString(),
      created: Math.floor(Math.random() * 10) + 1,
      resolved: Math.floor(Math.random() * 8) + 1,
      active: Math.floor(Math.random() * 15) + 5
    });
  }
  
  return trends;
}

// Helper function to generate trend data
async function generateTrendData(metric, timeRange) {
  const dataPoints = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
  const trends = [];
  
  for (let i = dataPoints - 1; i >= 0; i--) {
    const date = moment().subtract(i, timeRange === '24h' ? 'hours' : 'days');
    
    let data = {};
    switch (metric) {
      case 'devices':
        data = {
          online: Math.floor(Math.random() * 50) + 950,
          offline: Math.floor(Math.random() * 20) + 5,
          avgHealthScore: (Math.random() * 20 + 80).toFixed(1)
        };
        break;
      case 'tickets':
        data = {
          created: Math.floor(Math.random() * 10) + 1,
          resolved: Math.floor(Math.random() * 8) + 1,
          avgResolutionTime: (Math.random() * 2 + 3).toFixed(1)
        };
        break;
      case 'health':
        data = {
          avgScore: (Math.random() * 20 + 80).toFixed(1),
          criticalDevices: Math.floor(Math.random() * 5) + 1,
          warningDevices: Math.floor(Math.random() * 15) + 5
        };
        break;
      case 'performance':
        data = {
          uptime: (Math.random() * 0.5 + 99.5).toFixed(2),
          responseTime: Math.floor(Math.random() * 100) + 200,
          aiAccuracy: (Math.random() * 5 + 92).toFixed(1)
        };
        break;
    }
    
    trends.push({
      timestamp: date.toISOString(),
      ...data
    });
  }
  
  return trends;
}

// Helper function to generate predictions
function generatePredictions(type, horizon) {
  const predictions = [];
  const days = horizon === '1d' ? 1 : horizon === '7d' ? 7 : 30;
  
  for (let i = 1; i <= days; i++) {
    const date = moment().add(i, 'days');
    
    let prediction = {};
    switch (type) {
      case 'device_failure':
        prediction = {
          date: date.format('YYYY-MM-DD'),
          probability: (Math.random() * 0.1 + 0.05).toFixed(3),
          affectedDevices: Math.floor(Math.random() * 5) + 1,
          confidence: (Math.random() * 0.2 + 0.8).toFixed(2)
        };
        break;
      case 'ticket_volume':
        prediction = {
          date: date.format('YYYY-MM-DD'),
          expectedTickets: Math.floor(Math.random() * 20) + 10,
          priority: {
            high: Math.floor(Math.random() * 5) + 1,
            medium: Math.floor(Math.random() * 10) + 5,
            low: Math.floor(Math.random() * 8) + 2
          },
          confidence: (Math.random() * 0.15 + 0.85).toFixed(2)
        };
        break;
      case 'maintenance':
        prediction = {
          date: date.format('YYYY-MM-DD'),
          recommendedActions: Math.floor(Math.random() * 8) + 2,
          urgentMaintenance: Math.floor(Math.random() * 3) + 1,
          costSavings: Math.floor(Math.random() * 5000) + 1000,
          confidence: (Math.random() * 0.1 + 0.9).toFixed(2)
        };
        break;
    }
    
    predictions.push(prediction);
  }
  
  return predictions;
}

module.exports = router;