const { PrismaClient } = require('@prisma/client');
const moment = require('moment');
// const { mockDevices, mockCustomers, mockIssues, mockTicketTelemetry, mockSystemEvents, mockAnalytics  } = require('../src/data/mockDataO.ts');
const mockDevices = require('./mockDevices.json');
const mockCustomers = require('./mockCustomers.json');
const mockIssues = require('./mockIssues.json');
// const mockTicketTelemetry = require('./mockTicketTelemetry.json');
// const mockSystemEvents = require('./mockSystemEvents.json');
// const mockAnalytics = require('./mockAnalytics.json');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create customers first

  for (const customer of mockCustomers) {
    await prisma.customer.create({
      data: {
        customer_id: customer.customer_id,
        customer_name: customer.customer_name,
        customer_location_country: customer.customer_location_country,
        customer_location_state: customer.customer_location_state,
        customer_email: customer.customer_email,
        customer_phone: customer.customer_phone,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
        name: customer.customer_name,
        contact: customer.customer_email || customer.customer_phone || '',
        email: customer.customer_email,
        phone: customer.customer_phone,
        location: `${customer.customer_location_state}, ${customer.customer_location_country}`,
        supportLevel: 'BASIC',
        deviceCount: 0,
        status: 'ACTIVE',
        // contractStart, contractEnd, accountManager will use defaults
      }
    });
  }

  console.log('✅ Created customers');

  // Create devices
  
  for (const device of mockDevices) {
    await prisma.device.create({
      data: {
        device_id: device.device_id,
        customer_id: device.customer_id,
        context_id: device.context_id,
        dataset_id: device.dataset_id,
        device_context_datetime: device.device_context_datetime,
        device_context_id: device.device_context_id,
        device_bios_version: device.device_bios_version,
        device_brand: device.device_brand,
        device_ec_version: device.device_ec_version,
        device_enclosuretype: device.device_enclosuretype,
        device_family: device.device_family,
        device_id2: device.device_id2,
        device_info_datetime: device.device_info_datetime,
        device_manufacturer: device.device_manufacturer,
        device_modeltype: device.device_modeltype,
        device_name: device.device_name,
        device_purchase_date: device.device_purchase_date,
        device_smbios_version: device.device_smbios_version,
        device_subbrand: device.device_subbrand,
        os_country: device.os_country,
        os_language: device.os_language,
        os_name: device.os_name,
        os_update_description: device.os_update_description,
        os_update_title: device.os_update_title,
        os_version: device.os_version,
        country_code: device.country_code,
        country_name: device.country_name,
        language_code: device.language_code,
        language_name: device.language_name,
        region_info_datetime: device.region_info_datetime,
        region_name: device.region_name,
        report_time: device.report_time,
        schema_ver: device.schema_ver,
        subscription_id: device.subscription_id,
        subscription_ids: device.subscription_ids,
        udc_channel: device.udc_channel,
        udc_id: device.udc_id,
        udc_info_datetime: device.udc_info_datetime,
        udc_key: device.udc_key,
        udc_name: device.udc_name,
        udc_version: device.udc_version,
        employee_id: device.employee_id,
        department: device.department,
        riskLevel: device.riskLevel || 'LOW',
        // Computed/optional fields
        healthScore: device.healthScore || null,
        lastSeen: device.lastSeen || null,
        warrantyStatus: device.warrantyStatus || false,
        warrantyExpiryDate: device.warrantyExpiryDate || null,
        temperature: device.temperature || null,
        diskUsage: device.diskUsage || null,
        cpuUsage: device.cpuUsage || null,
        memoryUsage: device.memoryUsage || null,
        powerConsumption: device.powerConsumption || null,
        // createdAt/updatedAt will use defaults
      }
    });
  }

  console.log('✅ Created devices');

  // Create tickets
 
  for (const ticket of mockIssues) {
    await prisma.ticket.create({
      data: {
        ticket_id: ticket.item_id,
        device_id: ticket.device_id,
        customer_id: ticket.device_id ? (mockDevices.find(d => d.device_id === ticket.device_id)?.customer_id || '') : '',
        issue: ticket.issue_title,
        description: ticket.item_name,
        status: ticket.issue_status,
        priority: ticket.issue_type_id || 'LOW',
        confidence: ticket.confidence || null,
        warranty: ticket.warranty || false,
        assignedTo: ticket.assignedTo || null,
        estimatedResolution: ticket.estimatedResolution || null,
        // createdAt/updatedAt/resolvedAt will use defaults
      }
    });
  }

  console.log('✅ Created tickets');

  // Create ticket telemetry for the first ticket
  const firstTicketId = mockIssues[0]?.item_id;
  if (firstTicketId) {
    await prisma.ticketTelemetry.upsert({
      where: { ticket_id: firstTicketId },
      update: {},
      create: {
        ticket_id: firstTicketId,
        readErrorRate: 78,
        temperature: 62,
        reallocatedSectors: 42,
        spinRetryCount: 15,
        powerOnHours: 12450,
        smartStatus: 'Failing'
      }
    });
  }

  console.log('✅ Created ticket telemetry');

  // Create system events
  const systemEvents = [
    {
      type: 'DEFECT',
      title: 'A defect has been detected',
      message: 'Dell Inspiron 15: Disk failure imminent',
      details: 'Health score dropped to 23%',
      severity: 'HIGH',
      source: 'AI_ANALYSIS'
    },
    {
      type: 'ANALYSIS',
      title: 'Analysis has been done',
      message: 'HP Pavilion Desktop: High temperature analysis completed',
      details: 'Operating at 45°C - within acceptable range',
      severity: 'MEDIUM',
      source: 'THERMAL_MONITOR'
    },
    {
      type: 'TICKET',
      title: 'Ticket Opened',
      message: 'Maintenance ticket created for ASUS ZenBook 14',
      details: 'Scheduled maintenance for disk optimization',
      severity: 'LOW',
      source: 'TICKET_SYSTEM'
    }
  ];

  for (const event of systemEvents) {
    await prisma.systemEvent.create({
      data: event
    });
  }

  console.log('✅ Created system events');

  // Create analytics data for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = moment().subtract(i, 'days').startOf('day').toDate();
    
    await prisma.analytics.upsert({
      where: { date },
      update: {},
      create: {
        date,
        totalDevices: Math.floor(Math.random() * 50) + 950,
        devicesOnline: Math.floor(Math.random() * 50) + 900,
        devicesOffline: Math.floor(Math.random() * 20) + 5,
        highRiskDevices: Math.floor(Math.random() * 10) + 5,
        mediumRiskDevices: Math.floor(Math.random() * 30) + 20,
        lowRiskDevices: Math.floor(Math.random() * 50) + 800,
        totalTickets: Math.floor(Math.random() * 20) + 10,
        openTickets: Math.floor(Math.random() * 15) + 5,
        resolvedTickets: Math.floor(Math.random() * 10) + 5,
        avgResponseTime: Math.random() * 2 + 1,
        avgResolutionTime: Math.random() * 8 + 4
      }
    });
  }

  console.log('✅ Created analytics data');

  // Create admin user
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@deviceguard.ai' },
    update: {},
    create: {
      email: 'admin@deviceguard.ai',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN'
    }
  });

  console.log('✅ Created admin user');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });