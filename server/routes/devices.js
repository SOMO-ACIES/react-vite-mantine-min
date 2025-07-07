const express = require('express');
const { body, query, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const _ = require('lodash');
const { getRahulCases } = require('../services/rahulCaseService');

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
    const cases = await getRahulCases();
    // In-memory filtering
    let filtered = cases;
    if (brand) filtered = filtered.filter(d => d.deviceManufacturer?.toLowerCase().includes(brand.toLowerCase()));
    if (channel) filtered = filtered.filter(d => d.osName?.toLowerCase().includes(channel.toLowerCase()));
    if (riskLevel) filtered = filtered.filter(d => {
      if (riskLevel === 'HIGH') return d.riskProbability >= 0.7;
      if (riskLevel === 'MEDIUM') return d.riskProbability >= 0.4 && d.riskProbability < 0.7;
      if (riskLevel === 'LOW') return d.riskProbability < 0.4;
      return true;
    });
    if (healthScore) filtered = filtered.filter(d => d.riskProbability * 100 <= parseInt(healthScore));
    if (search) filtered = filtered.filter(d =>
      d.deviceModel?.toLowerCase().includes(search.toLowerCase()) ||
      d.deviceId?.toLowerCase().includes(search.toLowerCase()) ||
      d.employeeName?.toLowerCase().includes(search.toLowerCase())
    );
    // Pagination
    const totalCount = filtered.length;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const paged = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    // Stats (example: risk distribution)
    const riskStats = { high: 0, medium: 0, low: 0 };
    filtered.forEach(d => {
      if (d.riskProbability >= 0.7) riskStats.high++;
      else if (d.riskProbability >= 0.4) riskStats.medium++;
      else riskStats.low++;
    });
    const stats = {
      total: totalCount,
      riskDistribution: riskStats
    };
    res.json({
      success: true,
      data: paged,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage: pageNum * limitNum < totalCount,
        hasPrevPage: pageNum > 1
      },
      stats,
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
    const device = await getRahulCases();
    
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
    const device = await getRahulCases();
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: { message: 'Device not found' },
        timestamp: new Date().toISOString()
      });
    }
    
    const hours = parseInt(req.query.hours) || 24;
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const telemetryData = await getRahulCases();
    
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
    const device = await getRahulCases();
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: { message: 'Device not found' },
        timestamp: new Date().toISOString()
      });
    }
    
    const { message, priority = 'MEDIUM', recipients = [] } = req.body;
    
    // Create system event for the notification
    await getRahulCases();
    
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
    const totalDevices = await getRahulCases();
    const onlineDevices = await getRahulCases();

    const riskDistribution = await getRahulCases();

    const brandDistribution = await getRahulCases();

    const channelDistribution = await getRahulCases();

    const healthStats = await getRahulCases();

    const warrantyStats = await getRahulCases();

    const expiringSoon = await getRahulCases();

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