export interface Ticket {
  id: string;
  device: string;
  customer: string;
  issue: string;
  status: 'Analysis' | 'Critical' | 'Assigned' | 'Resolved' | 'Waiting';
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
  updatedAt: string;
  warranty: boolean;
  confidence?: number;
  telemetry?: {
    readErrorRate: number;
    temperature: number;
    reallocatedSectors: number;
    spinRetryCount: number;
    powerOnHours: number;
    smartStatus: string;
  };
}

export interface Device {
  id: string;
  name: string;
  model: string;
  serial: string;
  customer: string;
  location: string;
  healthScore: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  lastSeen: string;
  warranty: {
    status: boolean;
    expiryDate: string;
  };
  telemetry: {
    temperature: number;
    diskUsage: number;
    cpuUsage: number;
    memoryUsage: number;
    powerConsumption: number;
  };
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  location: string;
  supportLevel: 'Basic' | 'Premium' | 'Enterprise';
  deviceCount: number;
}

export interface Analytics {
  ticketsUnderAnalysis: number;
  closedToday: number;
  assignedToday: number;
  avgResponseTime: string;
  processingTimeStats: {
    avgAnalysisTime: number;
    avgResolutionTime: number;
    aiDiagnosisAccuracy: number;
  };
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  ticketCategorization: {
    diskFailures: number;
    controllerIssues: number;
    powerSupply: number;
    coolingProblems: number;
  };
}

export const dummyData = {
  tickets: [
    // Realistic sample tickets
    {
      id: 'T-2367',
      device: 'Server #SRV-2245',
      customer: 'Acme Corp.',
      issue: 'Disk error prediction',
      status: 'Analysis' as const,
      priority: 'High' as const,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:45:00Z',
      warranty: true,
      confidence: 87,
      telemetry: {
        readErrorRate: 78,
        temperature: 62,
        reallocatedSectors: 42,
        spinRetryCount: 15,
        powerOnHours: 12450,
        smartStatus: 'Failing'
      }
    },
    {
      id: 'T-2366',
      device: 'NAS #NAS-112',
      customer: 'Global Finance',
      issue: 'Multiple disk failures',
      status: 'Critical' as const,
      priority: 'High' as const,
      createdAt: '2024-01-15T09:15:00Z',
      updatedAt: '2024-01-15T13:30:00Z',
      warranty: false,
      confidence: 94
    },
    {
      id: 'T-2365',
      device: 'Workstation #WS-6678',
      customer: 'Design Studios Ltd',
      issue: 'SSD degradation',
      status: 'Assigned' as const,
      priority: 'Medium' as const,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T12:15:00Z',
      warranty: true
    },
    {
      id: 'T-2364',
      device: 'Storage Array #ST-443',
      customer: 'TechSolutions Inc.',
      issue: 'Disk replacement',
      status: 'Resolved' as const,
      priority: 'Low' as const,
      createdAt: '2024-01-14T16:20:00Z',
      updatedAt: '2024-01-15T11:00:00Z',
      warranty: true
    },
    {
      id: 'T-2363',
      device: 'Server #SRV-1198',
      customer: 'HealthCare Plus',
      issue: 'RAID controller failure',
      status: 'Waiting' as const,
      priority: 'Medium' as const,
      createdAt: '2024-01-14T14:10:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      warranty: false
    },
    // --- Generated demo tickets ---
    ...Array.from({ length: 100 }, (_, i) => {
      const priorities = ['High', 'Medium', 'Low'] as const;
      const statuses = ['Analysis', 'Critical', 'Assigned', 'Resolved', 'Waiting'] as const;
      const customers = ['Acme Corp.', 'Global Finance', 'Design Studios Ltd', 'TechSolutions Inc.', 'HealthCare Plus', 'NextGen IT', 'DataWorks', 'CloudNet', 'SecureSys', 'MediTech'];
      const devices = ['Server', 'NAS', 'Workstation', 'Storage Array', 'Firewall', 'Router', 'Switch', 'Backup Appliance'];
      const issues = ['Disk error prediction', 'Multiple disk failures', 'SSD degradation', 'Disk replacement', 'RAID controller failure', 'Power supply issue', 'Cooling problem', 'Firmware update', 'Network latency', 'Unauthorized access'];
      const idx = i + 10;
      return {
        id: `T-${2400 + i}`,
        device: `${devices[i % devices.length]} #${1000 + idx}`,
        customer: customers[i % customers.length],
        issue: issues[i % issues.length],
        status: statuses[i % statuses.length],
        priority: priorities[i % priorities.length],
        createdAt: `2024-01-${String(10 + (i % 20)).padStart(2, '0')}T${String(8 + (i % 10)).padStart(2, '0')}:00:00Z`,
        updatedAt: `2024-01-${String(10 + (i % 20)).padStart(2, '0')}T${String(10 + (i % 10)).padStart(2, '0')}:30:00Z`,
        warranty: i % 2 === 0,
        confidence: 60 + (i % 40),
        telemetry: {
          readErrorRate: 10 + (i % 90),
          temperature: 30 + (i % 40),
          reallocatedSectors: i % 50,
          spinRetryCount: i % 20,
          powerOnHours: 1000 + (i * 10),
          smartStatus: (i % 5 === 0) ? 'Failing' : 'OK'
        }
      };
    })
  ] as Ticket[],

  devices: [
    {
      id: 'SRV-2245',
      name: 'Primary Database Server',
      model: 'PowerEdge R740',
      serial: 'SN78932145',
      customer: 'Acme Corporation',
      location: 'Data Center 3',
      healthScore: 23,
      riskLevel: 'High' as const,
      lastSeen: '2024-01-15T14:45:00Z',
      warranty: {
        status: true,
        expiryDate: '2023-12-31'
      },
      telemetry: {
        temperature: 62,
        diskUsage: 89,
        cpuUsage: 67,
        memoryUsage: 84,
        powerConsumption: 450
      }
    },
    {
      id: 'NAS-112',
      name: 'Finance Department NAS',
      model: 'Synology DS920+',
      serial: 'SN45621789',
      customer: 'Global Finance Ltd',
      location: 'Branch Office',
      healthScore: 78,
      riskLevel: 'Medium' as const,
      lastSeen: '2024-01-15T13:30:00Z',
      warranty: {
        status: false,
        expiryDate: '2023-08-15'
      },
      telemetry: {
        temperature: 45,
        diskUsage: 73,
        cpuUsage: 34,
        memoryUsage: 56,
        powerConsumption: 65
      }
    }
  ] as Device[],

  customers: [
    {
      id: 'CUST-001',
      name: 'Acme Corporation',
      contact: 'John Smith',
      location: 'Data Center 3',
      supportLevel: 'Premium' as const,
      deviceCount: 45
    },
    {
      id: 'CUST-002',
      name: 'Global Finance Ltd',
      contact: 'Sarah Johnson',
      location: 'Branch Office',
      supportLevel: 'Enterprise' as const,
      deviceCount: 128
    }
  ] as Customer[],

  analytics: {
    ticketsUnderAnalysis: 24,
    closedToday: 18,
    assignedToday: 12,
    avgResponseTime: '1.4h',
    processingTimeStats: {
      avgAnalysisTime: 2.3,
      avgResolutionTime: 4.7,
      aiDiagnosisAccuracy: 92
    },
    riskDistribution: {
      high: 25,
      medium: 45,
      low: 30
    },
    ticketCategorization: {
      diskFailures: 64,
      controllerIssues: 18,
      powerSupply: 12,
      coolingProblems: 6
    }
  } as Analytics
};