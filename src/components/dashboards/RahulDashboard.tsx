import React, { useState } from 'react';
import {
  IconActivity,
  IconBrain,
  IconDevices,
  IconExclamationMark,
  IconEye,
  IconInfoCircle,
  IconMail,
  IconPointerCog,
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
import { useDisclosure } from '@mantine/hooks';
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

  const handleDeviceView = (device: Device) => {
    setSelectedDevice(device);
    open();
  };

  const handleNotifyOwner = () => {
    const subject = `Device Alert: ${selectedDevice?.device_name}`;
    const body = `Device ${selectedDevice?.device_name} (${selectedDevice?.device_modeltype}) requires attention.\n\nSerial: ${selectedDevice?.device_id}\nBrand: ${selectedDevice?.device_brand}\nLocation: ${selectedDevice?.region_name}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleGenerateTicket = () => {
    // This would typically create a new ticket in the system
    console.log('Generating ticket for device:', selectedDevice?.device_name);
    close();
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
  const getHealthScore = (device: Device) => {
    const purchase = new Date(device.device_purchase_date).getTime();
    const now = Date.now();
    const months = (now - purchase) / (1000 * 60 * 60 * 24 * 30);
    if (months < 6) {
      return 95;
    }
    if (months < 12) {
      return 80;
    }
    if (months < 18) {
      return 65;
    }
    return 50;
  };
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'yellow';
      case 'Low':
        return 'green';
      default:
        return 'gray';
    }
  };
  const getHealthScoreColor = (score: number) => {
    if (score >= 80) {
      return 'green';
    }
    if (score >= 60) {
      return 'yellow';
    }
    if (score >= 40) {
      return 'orange';
    }
    return 'red';
  };
  const getSystemEventIcon = (type: string) => {
    switch (type) {
      case 'defect':
        return <IconExclamationMark size={16} color="red" />;
      case 'analysis':
        return <IconPointerCog size={16} color="orange" />;
      case 'ticket':
        return <IconTicket size={16} color="blue" />;
      default:
        return <IconInfoCircle size={16} />;
    }
  };

  // Filtering logic
  const filteredDevices = mockDevices.filter((device) => {
    const locationMatch =
      locationFilter === 'All Locations' || device.region_name === locationFilter;
    const brandMatch = brandFilter === 'All Brands' || device.device_brand === brandFilter;
    return locationMatch && brandMatch;
  });

  // For at-risk, use our getRiskLevel logic
  const atRiskDevices = filteredDevices.filter(
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
      timestamp: '14:22:18',
      type: 'error',
      message: 'Agent service timeout on device 82f7d9e5a3c2 - could not start health scan',
    },
    {
      id: 2,
      timestamp: '14:22:17',
      type: 'error',
      message: 'Ticket creation failed for device 63f1b3d9d54a - database write error',
    },
    {
      id: 3,
      timestamp: '14:22:17',
      type: 'warning',
      message: 'Device 63f1b3d9d54a returned partial telemetry - memory stats missing',
    },
    {
      id: 4,
      timestamp: '14:22:16',
      type: 'error',
      message: 'Agent not found on device 10e3ac847b - reinstallation required',
    },
    {
      id: 5,
      timestamp: '14:22:15',
      type: 'info',
      message: 'Heartbeat received from 1,050 devices in last minute',
    },
    {
      id: 6,
      timestamp: '14:22:14',
      type: 'error',
      message: 'Failed to analyze disk health for device a87fd2309b - corrupt SMART data',
    },
    {
      id: 7,
      timestamp: '14:22:13',
      type: 'warning',
      message: 'Device a87fd2309b has been offline for 48 hours',
    },
    {
      id: 8,
      timestamp: '14:22:12',
      type: 'info',
      message: 'Telemetry batch #3912 processed - 982 devices',
    },
    {
      id: 9,
      timestamp: '14:22:11',
      type: 'error',
      message: 'Agent crash detected on device 2483dks837 - exit code 137',
    },
    {
      id: 10,
      timestamp: '14:22:10',
      type: 'success',
      message: 'Ticket #55892 successfully created for device 2483dks837',
    },
    {
      id: 11,
      timestamp: '14:22:09',
      type: 'warning',
      message: 'High latency in device response from device 1098dfkd92 - 1,203 ms',
    },
    {
      id: 12,
      timestamp: '14:22:08',
      type: 'info',
      message: 'Initiated agent upgrade to version 2.4.1 on 152 devices',
    },
    {
      id: 13,
      timestamp: '14:22:07',
      type: 'error',
      message: 'AI model failed to classify device 8129djsk48 - missing CPU metrics',
    },
    {
      id: 14,
      timestamp: '14:22:06',
      type: 'warning',
      message: 'Device 8129djsk48 sending delayed packets - 2-minute lag observed',
    },
    {
      id: 15,
      timestamp: '14:22:05',
      type: 'error',
      message: 'Authorization failure while accessing logs for device 47dfk2847c',
    },
    {
      id: 16,
      timestamp: '14:22:04',
      type: 'warning',
      message: 'Unusual spike in CPU usage on device 47dfk2847c - 94% sustained',
    },
    {
      id: 17,
      timestamp: '14:22:03',
      type: 'success',
      message: 'Agent successfully reinstalled on device 10e3ac847b',
    },
    {
      id: 18,
      timestamp: '14:22:02',
      type: 'info',
      message: 'Analyzing anomaly cluster for 11 flagged devices',
    },
    {
      id: 19,
      timestamp: '14:22:01',
      type: 'error',
      message: 'Ticket escalation failed for device 22dbfa2384 - Slack webhook error',
    },
    {
      id: 20,
      timestamp: '14:22:00',
      type: 'warning',
      message: 'Multiple failed ticket creation attempts detected in last 5 mins',
    },
  ];
  const systemEvents = [
    {
      id: 1,
      type: 'defect',
      title: 'A defect has been detected',
      message: 'Server SRV-2245: Disk failure imminent',
      timestamp: '2 min ago',
      details: 'Health score dropped to 23%',
      riskLevel: 'High',
    },
    {
      id: 2,
      type: 'analysis',
      title: 'Analysis has been done',
      message: 'NAS-112: High temperature analysis completed',
      timestamp: '15 min ago',
      details: 'Operating at 68°C - within acceptable range',
      riskLevel: 'Medium',
    },
    {
      id: 3,
      type: 'ticket',
      title: 'Ticket Opened',
      message: 'Maintenance ticket created for WS-6678',
      timestamp: '1 hour ago',
      details: 'Scheduled maintenance completed successfully',
      riskLevel: 'Low',
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
  const getEventCardColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High':
        return '#ffe5e5'; // light red
      case 'Medium':
        return '#fffbe5'; // light yellow
      case 'Low':
        return '#e6ffe5'; // light green
      default:
        return 'white';
    }
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
          <Group>
            <ActionIcon variant="light">
              <IconSearch size={16} />
            </ActionIcon>
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
                  accessor: 'brand',
                  title: 'Brand',
                  render: (device: Device) => (
                    <Text size="sm" className="dashboard-table-customer">
                      {device.device_brand}
                    </Text>
                  ),
                },
                {
                  accessor: 'region',
                  title: 'Region',
                  render: (device: Device) => (
                    <Text size="sm" className="dashboard-table-location">
                      {device.region_name}
                    </Text>
                  ),
                },
                {
                  accessor: 'healthScore',
                  title: 'Health Score',
                  render: (device: Device) => {
                    const score = getHealthScore(device);
                    return (
                      <Group gap="xs">
                        <RingProgress
                          size={40}
                          thickness={4}
                          sections={[
                            {
                              value: score,
                              color: getHealthScoreColor(score),
                            },
                          ]}
                        />
                        <Text size="sm" fw={500} className="dashboard-table-healthscore">
                          {score}%
                        </Text>
                      </Group>
                    );
                  },
                },
                {
                  accessor: 'riskLevel',
                  title: 'Risk Level',
                  render: (device: Device) => (
                    <Badge color={getRiskColor(getRiskLevel(device))} size="sm">
                      {getRiskLevel(device)}
                    </Badge>
                  ),
                },
                {
                  accessor: 'lastSeen',
                  title: 'Last Seen',
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
                  accessor: 'brand',
                  title: 'Brand',
                  render: (device: Device) => (
                    <Text className="dashboard-table-customer">{device.device_brand}</Text>
                  ),
                },
                {
                  accessor: 'region',
                  title: 'Region',
                  render: (device: Device) => (
                    <Text className="dashboard-table-location">{device.region_name}</Text>
                  ),
                },
                {
                  accessor: 'healthScore',
                  title: 'Health Score',
                  render: (device: Device) => {
                    const score = getHealthScore(device);
                    return (
                      <Group gap="xs">
                        <RingProgress
                          size={40}
                          thickness={4}
                          sections={[
                            {
                              value: score,
                              color: getHealthScoreColor(score),
                            },
                          ]}
                        />
                        <Text size="sm" fw={500} className="dashboard-table-healthscore">
                          {score}%
                        </Text>
                      </Group>
                    );
                  },
                },
                {
                  accessor: 'riskLevel',
                  title: 'Risk Level',
                  render: (device: Device) => (
                    <Badge color={getRiskColor(getRiskLevel(device))} size="sm">
                      {getRiskLevel(device)}
                    </Badge>
                  ),
                },
                {
                  accessor: 'lastSeen',
                  title: 'Last Seen',
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
              records={filteredDevices.slice((allDevicesPage - 1) * 10, allDevicesPage * 10)}
              totalRecords={filteredDevices.length}
              recordsPerPage={10}
              page={allDevicesPage}
              onPageChange={setAllDevicesPage}
              noRecordsText="No devices found."
            />
            <Group justify="space-between" mt="md">
              <Text size="sm" c="dimmed">
                Showing {filteredDevices.length} of {mockDevices.length} devices
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
                {systemEvents.map((event) => (
                  <Card
                    key={event.id}
                    p="sm"
                    className={`dashboard-system-event-card dashboard-system-event-card-${event.type}`}
                    style={{ background: getEventCardColor(event.riskLevel) }}
                  >
                    <Group justify="space-between" mb="xs">
                      <Group gap="xs">
                        {getSystemEventIcon(event.type)}
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
                    <Text size="xs" c="dimmed">
                      {event.details}
                    </Text>
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
                    <strong>Customer:</strong> {selectedDevice.customer_id}
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
                      <strong>Health Score:</strong>
                    </Text>
                    <RingProgress
                      size={40}
                      thickness={4}
                      sections={[
                        {
                          value: getHealthScore(selectedDevice),
                          color: getHealthScoreColor(getHealthScore(selectedDevice)),
                        },
                      ]}
                    />
                    <Text size="sm" fw={500} className="dashboard-device-status-healthscore">
                      {getHealthScore(selectedDevice)}%
                    </Text>
                  </Group>
                  <Text size="sm" className="dashboard-device-status-risk">
                    <strong>Risk Level:</strong>{' '}
                    <Badge color={getRiskColor(getRiskLevel(selectedDevice))} size="sm">
                      {getRiskLevel(selectedDevice)}
                    </Badge>
                  </Text>
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
                Notify Owner
              </Button>
              <Button
                leftSection={<IconTicket size={16} />}
                onClick={handleGenerateTicket}
                className="dashboard-device-modal-ticket-btn"
              >
                Generate Ticket
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
};

export default RahulDashboard;
