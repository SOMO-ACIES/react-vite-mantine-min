// const fetch = require('node-fetch');

const RAHUL_API_URL = 'https://known-racer.dataos.app/agentic-chain/v2/api/cases/rahul';

/**
 * Transform the external API data to your internal format if needed.
 * @param {Object} item
 * @returns {Object}
 */
function transformRahulCase(item) {
  // Example: just return as-is, or map fields if needed
  return {
    ticketId: item.ticket_id,
    deviceId: item.device_id,
    deviceModel: item.device_model,
    employeeId: item.employee_id,
    employeeName: item.employee_name,
    issueDescription: item.issue_description,
    status: item.status,
    assignedAgent: item.assigned_agent,
    updatedAt: item.updated_at,
    timestamp: item.timestamp,
    deviceBiosVersion: item.device_bios_version,
    deviceEcVersion: item.device_ec_version,
    osVersion: item.os_version,
    deviceManufacturer: item.device_manufacturer,
    osName: item.os_name,
    reportTime: item.report_time,
    rahulStatus: item.rahul_status,
    tinaStatus: item.tina_status,
    fredStatus: item.fred_status,
    assignedFieldAgent: item.assigned_field_agent,
    riskProbability: item.risk_probability,
    employeeLocationCountry: item.employee_location_country,
    employeeLocationState: item.employee_location_state,
    issueTitle: item.issue_title,
    issueStatus: item.issue_status,
    issueTypeId: item.issue_type_id
  };
}

/**
 * Fetch and transform Rahul cases from the external API.
 * @returns {Promise<Array>} Array of transformed cases
 */
async function getRahulCases() {
  const response = await fetch(RAHUL_API_URL);
  if (!response.ok) throw new Error('Failed to fetch Rahul cases');
  const data = await response.json();
  return Array.isArray(data) ? data.map(transformRahulCase) : [];
}

module.exports = {
  getRahulCases
}; 