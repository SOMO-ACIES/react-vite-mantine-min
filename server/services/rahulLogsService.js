const RAHUL_LOGS_API_URL =
  'https://known-racer.dataos.app/agentic-chain/v2/api/logs?agent_name=Rahul';

async function getRahulLogs() {
  try {
    const response = await fetch(RAHUL_LOGS_API_URL);
    if (!response.ok) throw new Error('Failed to fetch Rahul logs');
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching Rahul logs:', error);
    return [];
  }
}

module.exports = { getRahulLogs };
