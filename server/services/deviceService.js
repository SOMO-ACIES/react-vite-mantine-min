const prisma = require('../lib/prisma');
const _ = require('lodash');

/**
 * Fetch devices with filtering, pagination, and stats.
 * @param {Object} params - Filtering and pagination params
 * @returns {Promise<Object>} - Devices, pagination, and stats
 */
async function getDevices({ brand, channel, riskLevel, healthScore, search, page = 1, limit = 20 }) {
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
    _count: { id: true },
    _avg: { healthScore: true }
  });

  const riskStats = await prisma.device.groupBy({
    by: ['riskLevel'],
    where,
    _count: { riskLevel: true }
  });

  const warrantyExpiring = await prisma.device.count({
    where: {
      ...where,
      warrantyStatus: true,
      warrantyExpiryDate: {
        gte: new Date(),
        lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    }
  });

  const deviceStats = {
    total: stats._count.id,
    online: await prisma.device.count({
      where: {
        ...where,
        lastSeen: {
          gte: new Date(Date.now() - 60 * 60 * 1000)
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

  return {
    devices,
    totalCount,
    deviceStats
  };
}

/**
 * Fetch a device by ID, including customer, tickets, telemetryData.
 */
async function getDeviceById(id) {
  const device = await prisma.device.findUnique({
    where: { device_id: id },
    include: {
      customer: true,
      tickets: { orderBy: { createdAt: 'desc' }, take: 10 },
      telemetryData: { orderBy: { timestamp: 'desc' }, take: 100 }
    }
  });
  return device;
}

/**
 * Fetch telemetry for a device, with summary.
 */
async function getDeviceTelemetry(id, hours = 24) {
  const device = await prisma.device.findUnique({ where: { device_id: id } });
  if (!device) return null;
  const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
  const telemetryData = await prisma.telemetryData.findMany({
    where: { device_id: id, timestamp: { gte: startTime } },
    orderBy: { timestamp: 'asc' }
  });
  const summary = {
    avgTemperature: _.meanBy(telemetryData, 'temperature')?.toFixed(1) || '0',
    avgCpuUsage: _.meanBy(telemetryData, 'cpuUsage')?.toFixed(1) || '0',
    avgMemoryUsage: _.meanBy(telemetryData, 'memoryUsage')?.toFixed(1) || '0',
    avgDiskUsage: _.meanBy(telemetryData, 'diskUsage')?.toFixed(1) || '0',
    avgPowerConsumption: _.meanBy(telemetryData, 'powerConsumption')?.toFixed(1) || '0'
  };
  return {
    device_id: device.device_id,
    device_name: device.device_name,
    telemetry: telemetryData,
    summary
  };
}

/**
 * Send notification for a device, create system event, return notification object.
 */
async function notifyDevice(id, { message, priority = 'MEDIUM', recipients = [] }) {
  const device = await prisma.device.findUnique({
    where: { device_id: id },
    include: { customer: true }
  });
  if (!device) return null;
  await prisma.systemEvent.create({
    data: {
      type: 'ALERT',
      title: 'Device Notification Sent',
      message: `Notification sent for device ${device.device_name}`,
      details: message,
      severity: priority,
      source: 'NOTIFICATION_SYSTEM',
      metadata: JSON.stringify({ device_id: device.device_id, recipients, timestamp: new Date().toISOString() })
    }
  });
  return {
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
}

/**
 * Fetch device statistics summary.
 */
async function getDeviceStatsSummary() {
  const totalDevices = await prisma.device.count();
  const onlineDevices = await prisma.device.count({
    where: { lastSeen: { gte: new Date(Date.now() - 60 * 60 * 1000) } }
  });
  const riskDistribution = await prisma.device.groupBy({ by: ['riskLevel'], _count: { riskLevel: true } });
  const brandDistribution = await prisma.device.groupBy({ by: ['device_brand'], _count: { device_brand: true } });
  const channelDistribution = await prisma.device.groupBy({ by: ['udc_channel'], _count: { udc_channel: true } });
  const healthStats = await prisma.device.aggregate({ _avg: { healthScore: true }, _min: { healthScore: true }, _max: { healthScore: true } });
  const warrantyStats = await prisma.device.groupBy({ by: ['warrantyStatus'], _count: { warrantyStatus: true } });
  const expiringSoon = await prisma.device.count({
    where: {
      warrantyStatus: true,
      warrantyExpiryDate: {
        gte: new Date(),
        lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    }
  });
  return {
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
}

module.exports = {
  getDevices,
  getDeviceById,
  getDeviceTelemetry,
  notifyDevice,
  getDeviceStatsSummary
}; 