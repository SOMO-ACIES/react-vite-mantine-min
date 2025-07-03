const { PrismaClient } = require('@prisma/client');
const moment = require('moment');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create customers first
  const customers = [
    {
      customer_id: 'CUST-001',
      name: 'Acme Corporation',
      contact: 'John Smith',
      email: 'john.smith@acme.com',
      phone: '+1-555-0101',
      location: 'Data Center 3',
      supportLevel: 'PREMIUM',
      deviceCount: 45,
      contractStart: moment().subtract(1, 'year').toDate(),
      contractEnd: moment().add(1, 'year').toDate(),
      accountManager: 'Sarah Johnson',
      status: 'ACTIVE'
    },
    {
      customer_id: 'CUST-002',
      name: 'Global Finance Ltd',
      contact: 'Sarah Johnson',
      email: 'sarah.johnson@globalfinance.com',
      phone: '+1-555-0102',
      location: 'Branch Office',
      supportLevel: 'ENTERPRISE',
      deviceCount: 128,
      contractStart: moment().subtract(2, 'years').toDate(),
      contractEnd: moment().add(6, 'months').toDate(),
      accountManager: 'Mike Chen',
      status: 'ACTIVE'
    },
    {
      customer_id: 'CUST-003',
      name: 'TechSolutions Inc.',
      contact: 'Mike Chen',
      email: 'mike.chen@techsolutions.com',
      phone: '+1-555-0103',
      location: 'HQ Building',
      supportLevel: 'BASIC',
      deviceCount: 67,
      contractStart: moment().subtract(6, 'months').toDate(),
      contractEnd: moment().add(18, 'months').toDate(),
      accountManager: 'Emma Wilson',
      status: 'ACTIVE'
    },
    {
      customer_id: 'CUST-004',
      name: 'Design Studios Ltd',
      contact: 'Emma Wilson',
      email: 'emma.wilson@designstudios.com',
      phone: '+1-555-0104',
      location: 'Creative Hub',
      supportLevel: 'PREMIUM',
      deviceCount: 34,
      contractStart: moment().subtract(8, 'months').toDate(),
      contractEnd: moment().add(16, 'months').toDate(),
      accountManager: 'Robert Smith',
      status: 'ACTIVE'
    },
    {
      customer_id: 'CUST-005',
      name: 'HealthCare Plus',
      contact: 'Dr. Robert Smith',
      email: 'robert.smith@healthcareplus.com',
      phone: '+1-555-0105',
      location: 'Medical Center',
      supportLevel: 'ENTERPRISE',
      deviceCount: 189,
      contractStart: moment().subtract(3, 'years').toDate(),
      contractEnd: moment().add(9, 'months').toDate(),
      accountManager: 'Lisa Davis',
      status: 'ACTIVE'
    }
  ];

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { customer_id: customer.customer_id },
      update: customer,
      create: customer
    });
  }

  console.log('✅ Created customers');

  // Create devices
  const devices = [
    {
      device_id: 'DEV001',
      customer_id: 'CUST-001',
      context_id: 'CTX001',
      dataset_id: 'DS001',
      device_context_datetime: new Date('2024-01-01T10:00:00Z'),
      device_context_id: 'DCTX001',
      device_bios_version: '1.2.3',
      device_brand: 'Dell',
      device_ec_version: 'EC1.0',
      device_enclosuretype: 'Laptop',
      device_family: 'Inspiron',
      device_id2: 'DEV001_ALT',
      device_info_datetime: new Date('2024-01-01T10:00:00Z'),
      device_manufacturer: 'Dell Inc.',
      device_modeltype: 'Laptop',
      device_name: 'Dell Inspiron 15',
      device_purchase_date: new Date('2023-12-01T00:00:00Z'),
      device_smbios_version: '3.0',
      device_subbrand: 'Inspiron 15',
      os_country: 'US',
      os_language: 'en-US',
      os_name: 'Windows 11',
      os_update_description: 'Windows 11 22H2 Update',
      os_update_title: 'Windows 11 Update',
      os_version: '22H2',
      country_code: 'US',
      country_name: 'United States',
      language_code: 'en',
      language_name: 'English',
      region_info_datetime: new Date('2024-01-01T10:00:00Z'),
      region_name: 'Americas',
      report_time: new Date('2024-01-01T10:00:00Z'),
      schema_ver: '1.0',
      subscription_id: 'SUB001',
      subscription_ids: '["SUB001", "SUB002"]',
      udc_channel: 'RETAIL',
      udc_id: 'UDC001',
      udc_info_datetime: new Date('2024-01-01T10:00:00Z'),
      udc_key: 'KEY001',
      udc_name: 'Consumer Channel',
      udc_version: '1.0',
      healthScore: 23,
      riskLevel: 'HIGH',
      lastSeen: new Date('2024-01-15T14:45:00Z'),
      warrantyStatus: true,
      warrantyExpiryDate: new Date('2024-12-01'),
      temperature: 62,
      diskUsage: 89,
      cpuUsage: 67,
      memoryUsage: 84,
      powerConsumption: 450
    },
    {
      device_id: 'DEV002',
      customer_id: 'CUST-002',
      context_id: 'CTX002',
      dataset_id: 'DS002',
      device_context_datetime: new Date('2024-01-02T11:00:00Z'),
      device_context_id: 'DCTX002',
      device_bios_version: '2.1.0',
      device_brand: 'HP',
      device_ec_version: 'EC2.0',
      device_enclosuretype: 'Desktop',
      device_family: 'Pavilion',
      device_id2: 'DEV002_ALT',
      device_info_datetime: new Date('2024-01-02T11:00:00Z'),
      device_manufacturer: 'HP Inc.',
      device_modeltype: 'Desktop',
      device_name: 'HP Pavilion Desktop',
      device_purchase_date: new Date('2023-11-15T00:00:00Z'),
      device_smbios_version: '3.1',
      device_subbrand: 'Pavilion Gaming',
      os_country: 'US',
      os_language: 'en-US',
      os_name: 'Windows 11',
      os_update_description: 'Windows 11 23H2 Update',
      os_update_title: 'Windows 11 Update',
      os_version: '23H2',
      country_code: 'US',
      country_name: 'United States',
      language_code: 'en',
      language_name: 'English',
      region_info_datetime: new Date('2024-01-02T11:00:00Z'),
      region_name: 'Americas',
      report_time: new Date('2024-01-02T11:00:00Z'),
      schema_ver: '1.0',
      subscription_id: 'SUB003',
      subscription_ids: '["SUB003"]',
      udc_channel: 'RETAIL',
      udc_id: 'UDC002',
      udc_info_datetime: new Date('2024-01-02T11:00:00Z'),
      udc_key: 'KEY002',
      udc_name: 'Consumer Channel',
      udc_version: '1.0',
      healthScore: 78,
      riskLevel: 'MEDIUM',
      lastSeen: new Date('2024-01-15T13:30:00Z'),
      warrantyStatus: false,
      warrantyExpiryDate: new Date('2023-11-15'),
      temperature: 45,
      diskUsage: 73,
      cpuUsage: 34,
      memoryUsage: 56,
      powerConsumption: 280
    },
    {
      device_id: 'DEV003',
      customer_id: 'CUST-003',
      context_id: 'CTX003',
      dataset_id: 'DS003',
      device_context_datetime: new Date('2024-01-03T12:00:00Z'),
      device_context_id: 'DCTX003',
      device_bios_version: '1.5.2',
      device_brand: 'Lenovo',
      device_ec_version: 'EC1.5',
      device_enclosuretype: 'Laptop',
      device_family: 'ThinkPad',
      device_id2: 'DEV003_ALT',
      device_info_datetime: new Date('2024-01-03T12:00:00Z'),
      device_manufacturer: 'Lenovo Group',
      device_modeltype: 'Laptop',
      device_name: 'Lenovo ThinkPad X1',
      device_purchase_date: new Date('2023-10-20T00:00:00Z'),
      device_smbios_version: '3.2',
      device_subbrand: 'ThinkPad X1 Carbon',
      os_country: 'US',
      os_language: 'en-US',
      os_name: 'Windows 11',
      os_update_description: 'Windows 11 22H2 Update',
      os_update_title: 'Windows 11 Update',
      os_version: '22H2',
      country_code: 'US',
      country_name: 'United States',
      language_code: 'en',
      language_name: 'English',
      region_info_datetime: new Date('2024-01-03T12:00:00Z'),
      region_name: 'Americas',
      report_time: new Date('2024-01-03T12:00:00Z'),
      schema_ver: '1.0',
      subscription_id: 'SUB004',
      subscription_ids: '["SUB004", "SUB005"]',
      udc_channel: 'BUSINESS',
      udc_id: 'UDC003',
      udc_info_datetime: new Date('2024-01-03T12:00:00Z'),
      udc_key: 'KEY003',
      udc_name: 'Business Channel',
      udc_version: '1.0',
      healthScore: 92,
      riskLevel: 'LOW',
      lastSeen: new Date('2024-01-15T14:20:00Z'),
      warrantyStatus: true,
      warrantyExpiryDate: new Date('2024-10-20'),
      temperature: 38,
      diskUsage: 45,
      cpuUsage: 25,
      memoryUsage: 42,
      powerConsumption: 65
    },
    {
      device_id: 'DEV004',
      customer_id: 'CUST-004',
      context_id: 'CTX004',
      dataset_id: 'DS004',
      device_context_datetime: new Date('2024-01-04T13:00:00Z'),
      device_context_id: 'DCTX004',
      device_bios_version: '2.0.1',
      device_brand: 'ASUS',
      device_ec_version: 'EC2.1',
      device_enclosuretype: 'Laptop',
      device_family: 'ZenBook',
      device_id2: 'DEV004_ALT',
      device_info_datetime: new Date('2024-01-04T13:00:00Z'),
      device_manufacturer: 'ASUSTeK Computer',
      device_modeltype: 'Laptop',
      device_name: 'ASUS ZenBook 14',
      device_purchase_date: new Date('2023-09-10T00:00:00Z'),
      device_smbios_version: '3.0',
      device_subbrand: 'ZenBook Pro',
      os_country: 'US',
      os_language: 'en-US',
      os_name: 'Windows 11',
      os_update_description: 'Windows 11 23H2 Update',
      os_update_title: 'Windows 11 Update',
      os_version: '23H2',
      country_code: 'US',
      country_name: 'United States',
      language_code: 'en',
      language_name: 'English',
      region_info_datetime: new Date('2024-01-04T13:00:00Z'),
      region_name: 'Americas',
      report_time: new Date('2024-01-04T13:00:00Z'),
      schema_ver: '1.0',
      subscription_id: 'SUB006',
      subscription_ids: '["SUB006"]',
      udc_channel: 'RETAIL',
      udc_id: 'UDC004',
      udc_info_datetime: new Date('2024-01-04T13:00:00Z'),
      udc_key: 'KEY004',
      udc_name: 'Consumer Channel',
      udc_version: '1.0',
      healthScore: 45,
      riskLevel: 'HIGH',
      lastSeen: new Date('2024-01-15T13:20:00Z'),
      warrantyStatus: true,
      warrantyExpiryDate: new Date('2024-09-10'),
      temperature: 58,
      diskUsage: 92,
      cpuUsage: 78,
      memoryUsage: 85,
      powerConsumption: 320
    },
    {
      device_id: 'DEV005',
      customer_id: 'CUST-005',
      context_id: 'CTX005',
      dataset_id: 'DS005',
      device_context_datetime: new Date('2024-01-05T14:00:00Z'),
      device_context_id: 'DCTX005',
      device_bios_version: '1.8.3',
      device_brand: 'Acer',
      device_ec_version: 'EC1.8',
      device_enclosuretype: 'Laptop',
      device_family: 'Aspire',
      device_id2: 'DEV005_ALT',
      device_info_datetime: new Date('2024-01-05T14:00:00Z'),
      device_manufacturer: 'Acer Inc.',
      device_modeltype: 'Laptop',
      device_name: 'Acer Aspire 5',
      device_purchase_date: new Date('2023-08-25T00:00:00Z'),
      device_smbios_version: '2.8',
      device_subbrand: 'Aspire 5',
      os_country: 'US',
      os_language: 'en-US',
      os_name: 'Windows 11',
      os_update_description: 'Windows 11 22H2 Update',
      os_update_title: 'Windows 11 Update',
      os_version: '22H2',
      country_code: 'US',
      country_name: 'United States',
      language_code: 'en',
      language_name: 'English',
      region_info_datetime: new Date('2024-01-05T14:00:00Z'),
      region_name: 'Americas',
      report_time: new Date('2024-01-05T14:00:00Z'),
      schema_ver: '1.0',
      subscription_id: 'SUB007',
      subscription_ids: '["SUB007", "SUB008"]',
      udc_channel: 'RETAIL',
      udc_id: 'UDC005',
      udc_info_datetime: new Date('2024-01-05T14:00:00Z'),
      udc_key: 'KEY005',
      udc_name: 'Consumer Channel',
      udc_version: '1.0',
      healthScore: 72,
      riskLevel: 'MEDIUM',
      lastSeen: new Date('2024-01-15T14:30:00Z'),
      warrantyStatus: false,
      warrantyExpiryDate: new Date('2023-08-25'),
      temperature: 42,
      diskUsage: 68,
      cpuUsage: 45,
      memoryUsage: 62,
      powerConsumption: 180
    }
  ];

  for (const device of devices) {
    await prisma.device.upsert({
      where: { device_id: device.device_id },
      update: device,
      create: device
    });
  }

  console.log('✅ Created devices');

  // Create tickets
  const tickets = [
    {
      ticket_id: 'T-2367',
      device_id: 'DEV001',
      customer_id: 'CUST-001',
      issue: 'Disk error prediction',
      description: 'AI detected potential disk failure based on SMART data analysis',
      status: 'ANALYSIS',
      priority: 'HIGH',
      confidence: 87,
      warranty: true,
      assignedTo: 'Tech Support Team',
      estimatedResolution: moment().add(4, 'hours').toDate()
    },
    {
      ticket_id: 'T-2366',
      device_id: 'DEV002',
      customer_id: 'CUST-002',
      issue: 'High temperature warning',
      description: 'Device operating at elevated temperatures consistently',
      status: 'CRITICAL',
      priority: 'HIGH',
      confidence: 94,
      warranty: false,
      assignedTo: 'Field Operations',
      estimatedResolution: moment().add(2, 'hours').toDate()
    },
    {
      ticket_id: 'T-2365',
      device_id: 'DEV004',
      customer_id: 'CUST-004',
      issue: 'SSD degradation',
      description: 'Solid state drive showing signs of wear and performance degradation',
      status: 'ASSIGNED',
      priority: 'MEDIUM',
      confidence: 76,
      warranty: true,
      assignedTo: 'Hardware Team',
      estimatedResolution: moment().add(24, 'hours').toDate()
    },
    {
      ticket_id: 'T-2364',
      device_id: 'DEV005',
      customer_id: 'CUST-005',
      issue: 'Memory usage spike',
      description: 'Unusual memory consumption patterns detected',
      status: 'RESOLVED',
      priority: 'LOW',
      confidence: 68,
      warranty: false,
      resolvedAt: moment().subtract(2, 'hours').toDate()
    }
  ];

  for (const ticket of tickets) {
    await prisma.ticket.upsert({
      where: { ticket_id: ticket.ticket_id },
      update: ticket,
      create: ticket
    });
  }

  console.log('✅ Created tickets');

  // Create ticket telemetry for the first ticket
  await prisma.ticketTelemetry.upsert({
    where: { ticket_id: 'T-2367' },
    update: {},
    create: {
      ticket_id: 'T-2367',
      readErrorRate: 78,
      temperature: 62,
      reallocatedSectors: 42,
      spinRetryCount: 15,
      powerOnHours: 12450,
      smartStatus: 'Failing'
    }
  });

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