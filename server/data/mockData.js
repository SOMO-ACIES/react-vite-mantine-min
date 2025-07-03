const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

// Generate mock devices with realistic data
const generateMockDevices = (count = 50) => {
  const brands = ['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Samsung', 'Surface', 'Alienware', 'Razer'];
  const channels = ['RETAIL', 'BUSINESS', 'GAMING'];
  const modelTypes = ['Laptop', 'Desktop', 'Tablet', 'Server'];
  const riskLevels = ['Low', 'Medium', 'High'];
  const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France'];
  
  const devices = [];
  
  for (let i = 1; i <= count; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const modelType = modelTypes[Math.floor(Math.random() * modelTypes.length)];
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    
    // Generate health score based on risk level
    let healthScore;
    switch (riskLevel) {
      case 'High':
        healthScore = Math.floor(Math.random() * 40) + 10; // 10-50
        break;
      case 'Medium':
        healthScore = Math.floor(Math.random() * 30) + 50; // 50-80
        break;
      default:
        healthScore = Math.floor(Math.random() * 20) + 80; // 80-100
    }
    
    const device = {
      device_id: `DEV${String(i).padStart(3, '0')}`,
      customer_id: `CUST${String(Math.floor(i / 5) + 1).padStart(3, '0')}`,
      context_id: `CTX${String(i).padStart(3, '0')}`,
      dataset_id: `DS${String(i).padStart(3, '0')}`,
      device_context_datetime: moment().subtract(Math.floor(Math.random() * 30), 'days').toISOString(),
      device_context_id: `DCTX${String(i).padStart(3, '0')}`,
      device_bios_version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      device_brand: brand,
      device_ec_version: `EC${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}`,
      device_enclosuretype: modelType,
      device_family: `${brand} ${modelType} Series`,
      device_id2: `${device.device_id}_ALT`,
      device_info_datetime: moment().subtract(Math.floor(Math.random() * 30), 'days').toISOString(),
      device_manufacturer: `${brand} Inc.`,
      device_modeltype: modelType,
      device_name: `${brand} ${modelType} ${Math.floor(Math.random() * 1000) + 1000}`,
      device_purchase_date: moment().subtract(Math.floor(Math.random() * 365) + 30, 'days').toISOString(),
      device_smbios_version: `${Math.floor(Math.random() * 2) + 2}.${Math.floor(Math.random() * 5)}`,
      device_subbrand: `${brand} Pro Series`,
      os_country: country.replace(' ', ''),
      os_language: 'en-US',
      os_name: 'Windows 11',
      os_update_description: 'Windows 11 23H2 Update',
      os_update_title: 'Windows 11 Update',
      os_version: Math.random() > 0.5 ? '23H2' : '22H2',
      country_code: country === 'United States' ? 'US' : country.substring(0, 2).toUpperCase(),
      country_name: country,
      language_code: 'en',
      language_name: 'English',
      region_info_datetime: moment().subtract(Math.floor(Math.random() * 30), 'days').toISOString(),
      region_name: 'Americas',
      report_time: moment().subtract(Math.floor(Math.random() * 24), 'hours').toISOString(),
      schema_ver: '1.0',
      subscription_id: `SUB${String(i).padStart(3, '0')}`,
      subscription_ids: `["SUB${String(i).padStart(3, '0')}"]`,
      udc_channel: channel,
      udc_id: `UDC${String(i).padStart(3, '0')}`,
      udc_info_datetime: moment().subtract(Math.floor(Math.random() * 30), 'days').toISOString(),
      udc_key: `KEY${String(i).padStart(3, '0')}`,
      udc_name: `${channel.toLowerCase().charAt(0).toUpperCase() + channel.toLowerCase().slice(1)} Channel`,
      udc_version: '1.0',
      // Computed fields
      healthScore,
      riskLevel,
      lastSeen: moment().subtract(Math.floor(Math.random() * 60), 'minutes').toISOString(),
      warranty: {
        status: Math.random() > 0.3,
        expiryDate: moment().add(Math.floor(Math.random() * 365), 'days').toISOString()
      },
      telemetry: {
        temperature: Math.floor(Math.random() * 40) + 30,
        diskUsage: Math.floor(Math.random() * 80) + 20,
        cpuUsage: Math.floor(Math.random() * 70) + 10,
        memoryUsage: Math.floor(Math.random() * 80) + 20,
        powerConsumption: Math.floor(Math.random() * 400) + 100
      }
    };
    
    devices.push(device);
  }
  
  return devices;
};

// Generate mock tickets
const generateMockTickets = (devices, count = 25) => {
  const statuses = ['Analysis', 'Critical', 'Assigned', 'Resolved', 'Waiting'];
  const priorities = ['High', 'Medium', 'Low'];
  const issues = [
    'Disk failure prediction',
    'High temperature warning',
    'Memory degradation',
    'CPU performance issues',
    'Network connectivity problems',
    'Power supply irregularities',
    'BIOS update required',
    'Driver compatibility issues'
  ];
  
  const tickets = [];
  
  for (let i = 1; i <= count; i++) {
    const device = devices[Math.floor(Math.random() * devices.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const issue = issues[Math.floor(Math.random() * issues.length)];
    
    const ticket = {
      id: `T-${String(2000 + i).padStart(4, '0')}`,
      device: device.device_name,
      device_id: device.device_id,
      customer: `Customer ${device.customer_id}`,
      issue,
      status,
      priority,
      createdAt: moment().subtract(Math.floor(Math.random() * 168), 'hours').toISOString(),
      updatedAt: moment().subtract(Math.floor(Math.random() * 24), 'hours').toISOString(),
      warranty: device.warranty.status,
      confidence: Math.floor(Math.random() * 30) + 70,
      assignedTo: status === 'Assigned' ? `Tech-${Math.floor(Math.random() * 10) + 1}` : null,
      estimatedResolution: moment().add(Math.floor(Math.random() * 72), 'hours').toISOString()
    };
    
    tickets.push(ticket);
  }
  
  return tickets;
};

// Generate mock customers
const generateMockCustomers = (count = 20) => {
  const companies = [
    'Acme Corporation', 'Global Finance Ltd', 'TechSolutions Inc.', 'Design Studios Ltd',
    'HealthCare Plus', 'Manufacturing Corp', 'Retail Giants', 'Education Systems',
    'Government Services', 'Logistics Pro', 'Energy Solutions', 'Media Group',
    'Construction Co.', 'Food Services', 'Transportation Hub', 'Security Systems',
    'Real Estate Group', 'Insurance Partners', 'Consulting Firm', 'Research Institute'
  ];
  
  const supportLevels = ['Basic', 'Premium', 'Enterprise'];
  const locations = [
    'Data Center 1', 'Data Center 2', 'Data Center 3', 'Branch Office',
    'Headquarters', 'Regional Office', 'Remote Site', 'Cloud Infrastructure'
  ];
  
  const customers = [];
  
  for (let i = 1; i <= count; i++) {
    const customer = {
      id: `CUST-${String(i).padStart(3, '0')}`,
      name: companies[i - 1] || `Company ${i}`,
      contact: `Contact Person ${i}`,
      email: `contact${i}@company${i}.com`,
      phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      supportLevel: supportLevels[Math.floor(Math.random() * supportLevels.length)],
      deviceCount: Math.floor(Math.random() * 200) + 10,
      contractStart: moment().subtract(Math.floor(Math.random() * 730), 'days').toISOString(),
      contractEnd: moment().add(Math.floor(Math.random() * 365), 'days').toISOString(),
      accountManager: `Manager ${Math.floor(Math.random() * 5) + 1}`,
      status: 'Active'
    };
    
    customers.push(customer);
  }
  
  return customers;
};

// Initialize mock data
const mockDevices = generateMockDevices(100);
const mockTickets = generateMockTickets(mockDevices, 50);
const mockCustomers = generateMockCustomers(25);

module.exports = {
  mockDevices,
  mockTickets,
  mockCustomers,
  generateMockDevices,
  generateMockTickets,
  generateMockCustomers
};