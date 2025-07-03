import React, { useState } from 'react';
import {
  IconActivity,
  IconBrain,
  IconCopy,
  IconDevices,
  IconExclamationMark,
  IconEye,
  IconMail,
  IconRefresh,
  IconSearch,
  IconTicket,
  IconTrendingUp,
} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Modal,
  RingProgress,
  ScrollArea,
  Select,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { mockDevices } from '../../data/mockDataO';

import './Dashboard.module.css';
import 'mantine-datatable/styles.css';

interface RahulDashboardProps {
  // data: any; // No longer needed
}

type Device = (typeof mockDevices)[number];

const RahulDashboard: React.FC<RahulDashboardProps> = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [deviceTab, setDeviceTab] = useState<string>('at-risk');
  const [activePage, setActivePage] = useState(1);
  const [allDevicesPage, setAllDevicesPage] = useState(1);
  const [locationFilter, setLocationFilter] = useState<string>('All Locations');
  const [brandFilter, setBrandFilter] = useState<string>('All Brands');
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const ticketForm = useForm({
    initialValues: {
      deviceId: '',
      deviceName: '',
      deviceModel: '',
      issueType: '',
      description: '',
      priority: '',
    },
    validate: {
      deviceId: (v: string) => (v ? null : 'Device ID is required'),
      deviceName: (v: string) => (v ? null : 'Device Name is required'),
      issueType: (v: string) => (v ? null : 'Issue Type is required'),
      description: (v: string) => (v ? null : 'Description is required'),
      priority: (v: string) => (v ? null : 'Priority is required'),
    },
  });

  const handleDeviceView = (device: Device) => {
    setSelectedDevice(device);
    open();
  };

  const handleNotifyOwner = () => {
    const subject = `Device Alert: ${selectedDevice?.device_name}`;
    const body = `Device ${selectedDevice?.device_name} (${selectedDevice?.device_modeltype}) requires attention.\n\nSerial: ${selectedDevice?.device_id}\nBrand: ${selectedDevice?.device_brand}\nLocation: ${selectedDevice?.region_name}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  // For demonstration, let's define a simple risk and health score logic
  const getRiskLevel = (device: Device) => {
    if (device.device_enclosuretype === 'Laptop' && device.device_bios_version < '2.0.0') {
      return 'High';
    }
    if (device.device_enclosuretype === 'Desktop') {
      return 'Medium';
    }
    return 'Low';
  };

  // Calculate Failure Probability (0-100) based on device age, bios version, and a random factor
  const getFailureProbability = (device: Device) => {
    const purchase = new Date(device.device_purchase_date).getTime();
    const now = Date.now();
    const months = (now - purchase) / (1000 * 60 * 60 * 24 * 30);
    // Lower BIOS version increases risk
    const biosRisk = device.device_bios_version < '2.0.0' ? 20 : 0;
    // Age increases risk
    let base = Math.min(100, Math.round(months * 3 + biosRisk));
    // Add a random factor for demo
    base += Math.floor(Math.random() * 10);
    return Math.max(5, Math.min(100, base));
  };

  // Reverse color order for Failure Probability: high=red, low=green
  const getFailureProbabilityColor = (prob: number) => {
    if (prob >= 80) {
      return 'red';
    }
    if (prob >= 60) {
      return 'orange';
    }
    if (prob >= 40) {
      return 'yellow';
    }
    if (prob >= 20) {
      return 'green';
    }
    return 'teal';
  };

  // Sorting state
  const [sortBy, setSortBy] = useState<'failureProbability' | 'lastSeen'>('failureProbability');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Filtering logic
  const filteredDevices = mockDevices.filter((device) => {
    const locationMatch =
      locationFilter === 'All Locations' || device.region_name === locationFilter;
    const brandMatch = brandFilter === 'All Brands' || device.device_brand === brandFilter;
    const nameMatch = device.device_name.toLowerCase().includes(searchTerm.toLowerCase());
    return locationMatch && brandMatch && nameMatch;
  });

  // Sorting logic
  const sortedDevices = [...filteredDevices].sort((a, b) => {
    if (sortBy === 'failureProbability') {
      const fa = getFailureProbability(a);
      const fb = getFailureProbability(b);
      return sortDir === 'desc' ? fb - fa : fa - fb;
    }
    const da = new Date(a.device_context_datetime || 0).getTime();
    const db = new Date(b.device_context_datetime || 0).getTime();
    return sortDir === 'desc' ? db - da : da - db;
  });

  // For at-risk, use our getRiskLevel logic
  const atRiskDevices = sortedDevices.filter(
    (device) => getRiskLevel(device) === 'High' || getRiskLevel(device) === 'Medium'
  );

  // For filter dropdowns
  const locationOptions = [
    'All Locations',
    ...Array.from(new Set(mockDevices.map((d) => d.region_name))).sort(),
  ];
  const brandOptions = [
    'All Brands',
    ...Array.from(new Set(mockDevices.map((d) => d.device_brand))).sort(),
  ];

  // Demo notifications/events (unchanged)
  const consoleNotifications = [
    {
      id: 1,
      timestamp: '14:23:18',
      type: 'info',
      message: 'AI Agent started device analysis for 1,200 devices.',
    },
    {
      id: 2,
      timestamp: '14:23:17',
      type: 'success',
      message: 'Ticket #55901 created for device 63f1b3d9d54a (Battery health warning).',
    },
    {
      id: 3,
      timestamp: '14:23:16',
      type: 'warning',
      message: 'Battery health below threshold on device 82f7d9e5a3c2 (Cycle count: 1,200).',
    },
    {
      id: 4,
      timestamp: '14:23:15',
      type: 'info',
      message: 'AI Agent completed anomaly detection for 1,200 devices.',
    },
    {
      id: 5,
      timestamp: '14:23:14',
      type: 'warning',
      message: 'Device 10e3ac847b reported battery temperature spike (45°C).',
    },
    {
      id: 6,
      timestamp: '14:23:13',
      type: 'info',
      message: 'Device health check completed for device 2483dks837.',
    },
    {
      id: 7,
      timestamp: '14:23:12',
      type: 'success',
      message: 'Ticket #55902 created for device 8129djsk48 (Performance issue).',
    },
    {
      id: 8,
      timestamp: '14:23:11',
      type: 'warning',
      message: 'Battery replacement recommended for device a87fd2309b.',
    },
    {
      id: 9,
      timestamp: '14:23:10',
      type: 'info',
      message: 'AI Agent is monitoring battery metrics for all laptops.',
    },
    {
      id: 10,
      timestamp: '14:23:09',
      type: 'info',
      message: 'Device 47dfk2847c passed all health checks.',
    },
    {
      id: 11,
      timestamp: '14:23:08',
      type: 'warning',
      message: 'Device 22dbfa2384: Battery charge cycles exceeded safe limit.',
    },
    {
      id: 12,
      timestamp: '14:23:07',
      type: 'info',
      message: 'AI Agent initiated firmware update on 50 devices.',
    },
    {
      id: 13,
      timestamp: '14:23:06',
      type: 'success',
      message: 'Ticket #55903 created for device 22dbfa2384 (Battery replacement scheduled).',
    },
    {
      id: 14,
      timestamp: '14:23:05',
      type: 'info',
      message: 'AI Agent is learning from new device telemetry patterns.',
    },
    {
      id: 15,
      timestamp: '14:23:04',
      type: 'warning',
      message: 'Device 1098dfkd92: Sudden battery drain detected.',
    },
    {
      id: 16,
      timestamp: '14:23:03',
      type: 'info',
      message: 'AI Agent is optimizing device scan intervals.',
    },
    {
      id: 17,
      timestamp: '14:23:02',
      type: 'info',
      message: 'Device 8129djsk48: No battery issues detected.',
    },
    {
      id: 18,
      timestamp: '14:23:01',
      type: 'info',
      message: 'AI Agent is preparing daily device health report.',
    },
    {
      id: 19,
      timestamp: '14:23:00',
      type: 'info',
      message: 'All device logs synchronized with central server.',
    },
    {
      id: 20,
      timestamp: '14:22:59',
      type: 'info',
      message: 'AI Agent is ready for new device onboarding.',
    },
  ];
  const aiErrorEvents = [
    {
      id: 1,
      type: 'agentic-error',
      title: 'Agentic AI: Device Classification Failure',
      message: 'AI agent failed to classify device type for device 8129djsk48.',
      timestamp: '2 min ago',
      details: 'Manual review required. Device metrics missing.',
      deviceId: '8129djsk48',
    },
    {
      id: 2,
      type: 'agentic-error',
      title: 'Agentic AI: Anomaly Detection Stalled',
      message: 'AI anomaly detection did not complete for device 47dfk2847c.',
      timestamp: '8 min ago',
      details: 'Manual intervention needed. CPU metrics unavailable.',
      deviceId: '47dfk2847c',
    },
    {
      id: 3,
      type: 'agentic-error',
      title: 'Agentic AI: Telemetry Data Gap',
      message: 'AI agent detected missing telemetry for device a87fd2309b.',
      timestamp: '15 min ago',
      details: 'Manual check required. Memory stats missing.',
      deviceId: 'a87fd2309b',
    },
    {
      id: 4,
      type: 'agentic-error',
      title: 'Agentic AI: Ticket Escalation Blocked',
      message: 'AI failed to escalate ticket for device 22dbfa2384.',
      timestamp: '22 min ago',
      details: 'Manual escalation required. Slack webhook error.',
      deviceId: '22dbfa2384',
    },
    {
      id: 5,
      type: 'agentic-error',
      title: 'Agentic AI: Health Scan Timeout',
      message: 'Agent service timeout on device 82f7d9e5a3c2.',
      timestamp: '30 min ago',
      details: 'Manual scan needed. Could not start health scan.',
      deviceId: '82f7d9e5a3c2',
    },
  ];
  const getConsoleColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#10b981'; // green
      case 'warning':
        return '#f59e0b'; // yellow
      case 'error':
        return '#ef4444'; // red
      case 'info':
        return '#3b82f6'; // blue
      default:
        return '#6b7280'; // gray
    }
  };

  // Open ticket modal with pre-populated or empty fields
  const openTicketModal = (device?: any) => {
    if (device) {
      ticketForm.setValues({
        deviceId: device.deviceId || device.device_id || '',
        deviceName: device.deviceName || device.device_name || '',
        deviceModel: device.deviceModel || device.device_modeltype || '',
        issueType: '',
        description: '',
        priority: '',
      });
    } else {
      ticketForm.setValues({
        deviceId: '',
        deviceName: '',
        deviceModel: '',
        issueType: '',
        description: '',
        priority: '',
      });
    }
    setTicketModalOpen(true);
  };

  const handleTicketSubmit = (values: any) => {
    showNotification({
      title: 'Ticket Created',
      message: `Ticket for device ${values.deviceId} created successfully!`,
      color: 'green',
      icon: <IconTicket size={16} />,
    });
    setTicketModalOpen(false);
  };

  // Handler to create a ticket for a device (manual)
  const handleManualTicket = (deviceId: string) => {
    // Find device details from mockDevices if available
    const device = mockDevices.find((d) => d.device_id === deviceId);
    openTicketModal({
      deviceId,
      deviceName: device?.device_name || '',
      deviceModel: device?.device_modeltype || '',
    });
  };

  // Handler to copy device ID to clipboard
  const handleCopyDeviceId = (deviceId: string) => {
    navigator.clipboard.writeText(deviceId);
  };

  return (
    <Stack gap="lg" className="dashboard-stack">
      {/* Header */}
      <Group justify="space-between" className="dashboard-header-group">
        <Group className="dashboard-header-title-group">
          <Text size="xl" fw={700} className="dashboard-title">
            Device Management Dashboard
          </Text>
          <Select
            data={["Rahul's Dashboard", "Tina's Dashboard", "Fred's Dashboard"]}
            defaultValue="Rahul's Dashboard"
            leftSection={<IconDevices size={16} />}
            className="dashboard-select"
          />
        </Group>
        <Group className="dashboard-header-meta-group">
          <Text size="sm" c="dimmed">
            Last updated: Today, 10:45 AM
          </Text>
          <ActionIcon variant="light">
            <IconRefresh size={16} />
          </ActionIcon>
        </Group>
      </Group>

      {/* Stats Cards */}
      <Grid className="dashboard-stats-grid" align="stretch">
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }} h="100%">
          <Card withBorder p="lg" className="dashboard-card" h="100%">
            <Text size="sm" c="dimmed" mb="xs">
              Total Devices
            </Text>
            <Text size="xl" fw={700} className="dashboard-card-value">
              {/* {mockDevices.length} */}
              20,000
            </Text>
            <Group gap="xs" mt="xs">
              <IconTrendingUp size={16} color="green" />
              <Text size="sm" c="green">
                +{Math.floor(Math.random() * 20) + 1} this month
              </Text>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }} h="100%">
          <Card withBorder p="lg" className="dashboard-card" style={{ height: '135px' }}>
            <Text size="sm" c="dimmed" mb="xs">
              Brands
            </Text>
            <Text size="xl" fw={700} className="dashboard-card-value">
              {brandOptions.length - 1}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }} h="100%">
          <Card withBorder p="lg" className="dashboard-card" h="100%">
            <Text size="sm" c="dimmed" mb="xs">
              At Risk
            </Text>
            <Text size="xl" fw={700} c="red">
              {atRiskDevices.length}
            </Text>
            <Group gap="xs" mt="xs">
              <Text size="sm" c="red">
                Requires attention
              </Text>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }} h="100%">
          <Card withBorder p="lg" className="dashboard-card" h="100%">
            <Text size="sm" c="dimmed" mb="xs">
              Locations
            </Text>
            <Text size="xl" fw={700} c="orange">
              {locationOptions.length - 1}
            </Text>
            <Group gap="xs" mt="xs">
              <Text size="sm" c="orange">
                Unique regions
              </Text>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Device Management Table */}
      <Card p="lg" className="dashboard-table-card">
        <Group justify="space-between" mb="md" className="dashboard-table-header-group">
          <Text fw={600} className="dashboard-table-title">
            Device Risk Management
          </Text>
          <Group gap="xs">
            <Button
              leftSection={<IconTicket size={16} />}
              onClick={() => openTicketModal()}
              variant="outline"
              size="xs"
            >
              Create Ticket
            </Button>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: 4,
                padding: '2px 6px',
                background: '#f8f9fa',
                minWidth: 220,
                maxWidth: 260,
                height: 30,
              }}
            >
              <IconSearch size={16} color="#888" style={{ marginRight: 4 }} />
              <input
                type="text"
                placeholder="Search by device name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 14,
                  width: 180,
                  height: 24,
                  padding: 0,
                }}
              />
            </div>
          </Group>
        </Group>
        <Tabs
          value={deviceTab}
          onChange={(value) => setDeviceTab(value || 'at-risk')}
          className="dashboard-tabs"
        >
          <Tabs.List>
            <Tabs.Tab value="at-risk">Devices at Risk</Tabs.Tab>
            <Tabs.Tab value="all-devices">All Devices</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="at-risk">
            <DataTable
              mt="md"
              highlightOnHover
              borderRadius="md"
              withTableBorder
              minHeight={400}
              striped
              className="dashboard-datatable"
              columns={[
                {
                  accessor: 'device',
                  title: 'Device',
                  render: (device: Device) => (
                    <Stack gap={0} className="dashboard-table-device-stack">
                      <Text size="sm" fw={500} className="dashboard-table-device-name">
                        {device.device_name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {device.device_modeltype}
                      </Text>
                    </Stack>
                  ),
                },
                {
                  accessor: 'department',
                  title: 'Department',
                  render: (device: Device) => (
                    <Text size="sm" className="dashboard-table-location">
                      {device.department}
                    </Text>
                  ),
                },
                {
                  accessor: 'failureProbability',
                  title: 'Failure Probability',
                  sortable: true,
                  render: (device: Device) => {
                    const probability = getFailureProbability(device);
                    return (
                      <Group gap="xs">
                        <RingProgress
                          size={40}
                          thickness={4}
                          sections={[
                            {
                              value: probability,
                              color: getFailureProbabilityColor(probability),
                            },
                          ]}
                        />
                        <Text size="sm" fw={500} className="dashboard-table-healthscore">
                          {probability}%
                        </Text>
                      </Group>
                    );
                  },
                },
                {
                  accessor: 'lastSeen',
                  title: 'Last Seen',
                  sortable: true,
                  render: (device: Device) => (
                    <Text size="sm" className="dashboard-table-lastseen">
                      {device.device_context_datetime
                        ? new Date(device.device_context_datetime).toLocaleString()
                        : '-'}
                    </Text>
                  ),
                },
                {
                  accessor: 'actions',
                  title: 'Actions',
                  textAlign: 'right',
                  render: (device: Device) => (
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        size="sm"
                        onClick={() => handleDeviceView(device)}
                      >
                        <IconEye size={14} />
                      </ActionIcon>
                      <ActionIcon variant="light" size="sm" color="blue">
                        <IconMail size={14} />
                      </ActionIcon>
                      <ActionIcon variant="light" size="sm" color="orange">
                        <IconTicket size={14} />
                      </ActionIcon>
                    </Group>
                  ),
                },
              ]}
              records={atRiskDevices.slice((activePage - 1) * 10, activePage * 10)}
              totalRecords={atRiskDevices.length}
              recordsPerPage={10}
              verticalSpacing="lg"
              page={activePage}
              onPageChange={setActivePage}
              noRecordsText="No devices at risk."
              sortStatus={{ columnAccessor: sortBy, direction: sortDir }}
              onSortStatusChange={({ columnAccessor, direction }) => {
                setSortBy(columnAccessor as 'failureProbability' | 'lastSeen');
                setSortDir(direction);
              }}
            />
            <Group justify="space-between" mt="md">
              <Text size="sm" c="dimmed">
                Showing {atRiskDevices.length} devices at risk
              </Text>
            </Group>
          </Tabs.Panel>
          <Tabs.Panel value="all-devices">
            <Group gap="md" mt="md" mb="md" className="dashboard-table-filters-group">
              <Select
                data={locationOptions}
                value={locationFilter}
                onChange={(value) => setLocationFilter(value || 'All Locations')}
                placeholder="Filter by Location"
                size="sm"
                className="dashboard-table-filter-select"
              />
              <Select
                data={brandOptions}
                value={brandFilter}
                onChange={(value) => setBrandFilter(value || 'All Brands')}
                placeholder="Filter by Brand"
                size="sm"
                className="dashboard-table-filter-select"
              />
            </Group>
            <DataTable
              highlightOnHover
              borderRadius="md"
              withTableBorder
              minHeight={392}
              striped
              verticalSpacing="lg"
              noHeader={false}
              className="dashboard-datatable"
              scrollAreaProps={{ style: { maxHeight: 392, overflowY: 'auto' } }}
              columns={[
                {
                  accessor: 'device',
                  title: 'Device',
                  render: (device: Device) => (
                    <Stack gap={0} className="dashboard-table-device-stack">
                      <Text size="sm" fw={500} className="dashboard-table-device-name">
                        {device.device_name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {device.device_modeltype}
                      </Text>
                    </Stack>
                  ),
                },
                {
                  accessor: 'department',
                  title: 'Department',
                  render: (device: Device) => (
                    <Text className="dashboard-table-location">{device.department}</Text>
                  ),
                },
                {
                  accessor: 'failureProbability',
                  title: 'Failure Probability',
                  sortable: true,
                  render: (device: Device) => {
                    const probability = getFailureProbability(device);
                    return (
                      <Group gap="xs">
                        <RingProgress
                          size={40}
                          thickness={4}
                          sections={[
                            {
                              value: probability,
                              color: getFailureProbabilityColor(probability),
                            },
                          ]}
                        />
                        <Text size="sm" fw={500} className="dashboard-table-healthscore">
                          {probability}%
                        </Text>
                      </Group>
                    );
                  },
                },
                {
                  accessor: 'lastSeen',
                  title: 'Last Seen',
                  sortable: true,
                  render: (device: Device) => (
                    <Text size="sm" className="dashboard-table-lastseen">
                      {device.device_context_datetime
                        ? new Date(device.device_context_datetime).toLocaleString()
                        : '-'}
                    </Text>
                  ),
                },
                {
                  accessor: 'actions',
                  title: 'Actions',
                  textAlign: 'right',
                  render: (device: Device) => (
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        size="sm"
                        onClick={() => handleDeviceView(device)}
                      >
                        <IconEye size={14} />
                      </ActionIcon>
                      <ActionIcon variant="light" size="sm" color="blue">
                        <IconMail size={14} />
                      </ActionIcon>
                      <ActionIcon variant="light" size="sm" color="orange">
                        <IconTicket size={14} />
                      </ActionIcon>
                    </Group>
                  ),
                },
              ]}
              records={sortedDevices.slice((allDevicesPage - 1) * 10, allDevicesPage * 10)}
              totalRecords={sortedDevices.length}
              recordsPerPage={10}
              page={allDevicesPage}
              onPageChange={setAllDevicesPage}
              noRecordsText="No devices found."
              sortStatus={{ columnAccessor: sortBy, direction: sortDir }}
              onSortStatusChange={({ columnAccessor, direction }) => {
                setSortBy(columnAccessor as 'failureProbability' | 'lastSeen');
                setSortDir(direction);
              }}
            />
            <Group justify="space-between" mt="md">
              <Text size="sm" c="dimmed">
                Showing {sortedDevices.length} of {mockDevices.length} devices
              </Text>
            </Group>
          </Tabs.Panel>
        </Tabs>
      </Card>

      {/* AI Notifications and System Events */}
      <Grid className="dashboard-notifications-grid">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card
            withBorder
            p="lg"
            className="dashboard-ai-console-card"
            bg="light-dark(red, ##2E2E2E)"
          >
            <Group justify="space-between" mb="md" className="dashboard-ai-console-header-group">
              <Group>
                <IconBrain size={20} color="#6366f1" />
                <Text fw={600} className="dashboard-ai-console-title">
                  AI Agent Live Feed
                </Text>
              </Group>
              <Badge color="blue" variant="light">
                Live
              </Badge>
            </Group>
            <ScrollArea h={400} className="dashboard-ai-console-scrollarea">
              <div className="dashboard-ai-console-log">
                {consoleNotifications.map((notification) => (
                  <div key={notification.id} className="dashboard-ai-console-log-entry">
                    <span className="dashboard-ai-console-log-timestamp">
                      [{notification.timestamp}]
                    </span>{' '}
                    <span style={{ color: getConsoleColor(notification.type) }}>
                      {notification.message}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder p="lg" className="dashboard-system-events-card">
            <Group justify="space-between" mb="md" className="dashboard-system-events-header-group">
              <Group>
                <IconActivity size={20} color="#8b5cf6" />
                <Text fw={600} className="dashboard-system-events-title">
                  AI Error Console
                </Text>
              </Group>
              <Badge color="green" variant="light">
                Live
              </Badge>
            </Group>
            <ScrollArea h={400} className="dashboard-system-events-scrollarea">
              <Stack gap="md">
                {aiErrorEvents.map((event) => (
                  <Card
                    withBorder
                    key={event.id}
                    p="sm"
                    className={`dashboard-system-event-card dashboard-system-event-card-${event.type}`}
                  >
                    <Group justify="space-between" mb="xs">
                      <Group gap="xs">
                        <IconExclamationMark size={16} color="red" />
                        <Text
                          size="sm"
                          fw={500}
                          className={`dashboard-system-event-title dashboard-system-event-title-${event.type}`}
                        >
                          {event.title}
                        </Text>
                      </Group>
                      <Text size="xs" c="dimmed">
                        {event.timestamp}
                      </Text>
                    </Group>
                    <Text size="sm" mb="xs">
                      {event.message}
                    </Text>
                    <Text size="xs" c="dimmed" mb="xs">
                      {event.details}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        size="sm"
                        color="orange"
                        onClick={() => handleManualTicket(event.deviceId)}
                        title="Create Ticket"
                      >
                        <IconTicket size={14} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        size="sm"
                        color="blue"
                        onClick={() => handleCopyDeviceId(event.deviceId)}
                        title="Copy Device ID"
                      >
                        <IconCopy size={14} />
                      </ActionIcon>
                      <Text size="xs" c="dimmed">
                        {event.deviceId}
                      </Text>
                    </Group>
                  </Card>
                ))}
              </Stack>
            </ScrollArea>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Device Detail Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={selectedDevice ? `${selectedDevice.device_name} - Details` : ''}
        size="xl"
        className="dashboard-device-modal"
      >
        {selectedDevice && (
          <Stack gap="lg" className="dashboard-device-modal-stack">
            <Grid>
              <Grid.Col span={6}>
                <Stack gap="sm" className="dashboard-device-info-stack">
                  <Text fw={600} className="dashboard-device-info-title">
                    Device Information
                  </Text>
                  <Text size="sm" className="dashboard-device-info-model">
                    <strong>Model:</strong> {selectedDevice.device_modeltype}
                  </Text>
                  <Text size="sm" className="dashboard-device-info-serial">
                    <strong>Serial:</strong> {selectedDevice.device_id}
                  </Text>
                  <Text size="sm" className="dashboard-device-info-customer">
                    <strong>Employee:</strong> {selectedDevice.employee_id}
                  </Text>
                  <Text size="sm" className="dashboard-device-info-location">
                    <strong>Location:</strong> {selectedDevice.region_name}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack gap="sm" className="dashboard-device-status-stack">
                  <Text fw={600} className="dashboard-device-status-title">
                    Status
                  </Text>
                  <Group>
                    <Text size="sm" className="dashboard-device-status-health-label">
                      <strong>Failure Probability:</strong>
                    </Text>
                    <RingProgress
                      size={40}
                      thickness={4}
                      sections={[
                        {
                          value: getFailureProbability(selectedDevice),
                          color: getFailureProbabilityColor(getFailureProbability(selectedDevice)),
                        },
                      ]}
                    />
                    <Text size="sm" fw={500} className="dashboard-device-status-healthscore">
                      {getFailureProbability(selectedDevice)}%
                    </Text>
                  </Group>
                  <Text size="sm" className="dashboard-device-status-warranty">
                    <strong>BIOS Version:</strong>{' '}
                    <Badge color="blue" size="sm">
                      {selectedDevice.device_bios_version}
                    </Badge>
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>
            <Tabs
              value={activeTab}
              onChange={(value) => setActiveTab(value || 'overview')}
              className="dashboard-device-modal-tabs"
            >
              <Tabs.List>
                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                <Tabs.Tab value="os">OS</Tabs.Tab>
                {/* <Tabs.Tab value="history">History</Tabs.Tab> */}
              </Tabs.List>
              <Tabs.Panel value="overview">
                <Stack gap="lg" pt="lg" className="dashboard-device-modal-overview-stack">
                  <Card p="md" className="dashboard-device-modal-overview-card">
                    <Text fw={600} mb="md" className="dashboard-device-modal-overview-title">
                      Current Info
                    </Text>
                    <Grid>
                      <Grid.Col span={6}>
                        <Stack gap="sm">
                          <Text size="sm">
                            <strong>Brand:</strong> {selectedDevice.device_brand}
                          </Text>
                          <Text size="sm">
                            <strong>Family:</strong> {selectedDevice.device_family}
                          </Text>
                          <Text size="sm">
                            <strong>Enclosure:</strong> {selectedDevice.device_enclosuretype}
                          </Text>
                          <Text size="sm">
                            <strong>Purchase Date:</strong> {selectedDevice.device_purchase_date}
                          </Text>
                        </Stack>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Stack gap="sm">
                          <Text size="sm">
                            <strong>BIOS Version:</strong> {selectedDevice.device_bios_version}
                          </Text>
                          <Text size="sm">
                            <strong>EC Version:</strong> {selectedDevice.device_ec_version}
                          </Text>
                          <Text size="sm">
                            <strong>SMBIOS Version:</strong> {selectedDevice.device_smbios_version}
                          </Text>
                          <Text size="sm">
                            <strong>Subbrand:</strong> {selectedDevice.device_subbrand}
                          </Text>
                        </Stack>
                      </Grid.Col>
                    </Grid>
                  </Card>
                </Stack>
              </Tabs.Panel>
              <Tabs.Panel value="os">
                <Stack gap="lg" pt="lg" className="dashboard-device-modal-os-stack">
                  <Card p="md">
                    <Text fw={600} mb="md">
                      Operating System
                    </Text>
                    <Text size="sm" mb="xs">
                      <strong>OS Name:</strong> {selectedDevice.os_name}
                    </Text>
                    <Text size="sm" mb="xs">
                      <strong>OS Version:</strong> {selectedDevice.os_version}
                    </Text>
                    <Text size="sm" mb="xs">
                      <strong>OS Language:</strong> {selectedDevice.os_language}
                    </Text>
                    <Text size="sm">
                      <strong>OS Update:</strong> {selectedDevice.os_update_title} -{' '}
                      {selectedDevice.os_update_description}
                    </Text>
                  </Card>
                </Stack>
              </Tabs.Panel>
              {/* <Tabs.Panel value="history">
                <Stack gap="lg" pt="lg" className="dashboard-device-modal-history-stack">
                  <Text className="dashboard-device-modal-history-placeholder">
                    Historical data and maintenance records would be shown here.
                  </Text>
                </Stack>
              </Tabs.Panel> */}
            </Tabs>
            <Group justify="flex-end" gap="md" className="dashboard-device-modal-actions-group">
              <Button
                variant="outline"
                leftSection={<IconMail size={16} />}
                onClick={handleNotifyOwner}
                className="dashboard-device-modal-notify-btn"
              >
                Notify Employee
              </Button>
              <Button
                leftSection={<IconTicket size={16} />}
                onClick={undefined}
                disabled
                className="dashboard-device-modal-ticket-btn"
              >
                Generate Ticket
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Ticket Modal */}
      <Modal
        opened={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        title="Create Ticket"
        size="lg"
      >
        <form onSubmit={ticketForm.onSubmit(handleTicketSubmit)}>
          <Stack gap="md">
            <Group grow>
              <Stack gap={0} style={{ flex: 1 }}>
                <Text size="sm" fw={500} mb={2}>
                  Device ID
                </Text>
                <input
                  type="text"
                  {...ticketForm.getInputProps('deviceId')}
                  disabled={!!ticketForm.values.deviceId}
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                />
              </Stack>
              <Stack gap={0} style={{ flex: 1 }}>
                <Text size="sm" fw={500} mb={2}>
                  Device Name
                </Text>
                <input
                  type="text"
                  {...ticketForm.getInputProps('deviceName')}
                  disabled={!!ticketForm.values.deviceName}
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                />
              </Stack>
              <Stack gap={0} style={{ flex: 1 }}>
                <Text size="sm" fw={500} mb={2}>
                  Device Model
                </Text>
                <input
                  type="text"
                  {...ticketForm.getInputProps('deviceModel')}
                  disabled={!!ticketForm.values.deviceModel}
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                />
              </Stack>
            </Group>
            <Group grow>
              <Stack gap={0} style={{ flex: 1 }}>
                <Text size="sm" fw={500} mb={2}>
                  Issue Type
                </Text>
                <select
                  {...ticketForm.getInputProps('issueType')}
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                >
                  <option value="">Select Issue Type</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Network">Network</option>
                  <option value="Performance">Performance</option>
                  <option value="Other">Other</option>
                </select>
              </Stack>
              <Stack gap={0} style={{ flex: 1 }}>
                <Text size="sm" fw={500} mb={2}>
                  Priority
                </Text>
                <select
                  {...ticketForm.getInputProps('priority')}
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </Stack>
            </Group>
            <Stack gap={0}>
              <Text size="sm" fw={500} mb={2}>
                Description
              </Text>
              <textarea
                {...ticketForm.getInputProps('description')}
                rows={3}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </Stack>
            <Group justify="flex-end">
              <Button type="submit" leftSection={<IconTicket size={16} />}>
                Submit Ticket
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
};

export default RahulDashboard;
