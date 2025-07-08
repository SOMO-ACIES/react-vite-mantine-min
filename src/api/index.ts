// Central API utility for backend calls

const API_BASE = 'http://localhost:3001/api/v1';

export async function getDevices(params = {}) {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_BASE}/devices${query ? `?${query}` : ''}`);
  if (!res.ok) { throw new Error('Failed to fetch devices'); }
  return res.json();
}

export async function getDeviceById(id: string) {
  const res = await fetch(`${API_BASE}/devices/${id}`);
  if (!res.ok) { throw new Error('Failed to fetch device'); }
  return res.json();
}

export async function getTickets(params = {}) {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_BASE}/tickets${query ? `?${query}` : ''}`);
  if (!res.ok) { throw new Error('Failed to fetch tickets'); }
  return res.json();
}

export async function getCustomers(params = {}) {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_BASE}/customers${query ? `?${query}` : ''}`);
  if (!res.ok) { throw new Error('Failed to fetch customers'); }
  return res.json();
}

export async function getAnalytics(params = {}) {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_BASE}/analytics/dashboard${query ? `?${query}` : ''}`);
  if (!res.ok) { throw new Error('Failed to fetch analytics'); }
  return res.json();
}

export async function getHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) { throw new Error('Failed to fetch health'); }
  return res.json();
}

export interface RahulLogRoot {
  id: number;
  timestamp: string;
  agent_name: string;
  log_level: string;
  message: string;
  ticket_id: string;
  device_id: string;
}

export async function getRahulLogs(params: { page?: number; limit?: number } = {}): Promise<{ data: RahulLogRoot[]; pagination?: any }> {
  const query = new URLSearchParams();
  if (params.page) { query.append('page', params.page.toString()); }
  if (params.limit) { query.append('limit', params.limit.toString()); }
  const res = await fetch(`${API_BASE}/rahulLogs?${query.toString()}`);
  if (!res.ok) { throw new Error('Failed to fetch Rahul logs'); }
  return await res.json();
} 