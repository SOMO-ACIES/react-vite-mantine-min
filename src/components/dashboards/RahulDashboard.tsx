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
  Progress,
  RingProgress,
  ScrollArea,
  Select,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
// import { DataTable } from '@mantine/datatable';
import { useDisclosure } from '@mantine/hooks';
import type { Device } from '../../data/dummyData';

import './Dashboard.module.css';
import 'mantine-datatable/styles.css';

interface RahulDashboardProps {
  data: any;
}

const RahulDashboard: React.FC<RahulDashboardProps> = ({ data }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [deviceTab, setDeviceTab] = useState<string>('at-risk');
  const [activePage, setActivePage] = useState(1);
  const [allDevicesPage, setAllDevicesPage] = useState(1);
  const [locationFilter, setLocationFilter] = useState<string>('All Locations');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All Departments');

  const handleDeviceView = (device: Device) => {
    setSelectedDevice(device);
    open();
  };

  const handleNotifyOwner = () => {
    const subject = `Device Alert: ${selectedDevice?.name}`;
    const body = `Device ${selectedDevice?.name} (${selectedDevice?.model}) requires attention.\n\nHealth Score: ${selectedDevice?.healthScore}%\nRisk Level: ${selectedDevice?.riskLevel}\nLocation: ${selectedDevice?.location}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleGenerateTicket = () => {
    // This would typically create a new ticket in the system
    console.log('Generating ticket for device:', selectedDevice?.name);
    close();
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

  // Extended device data for demonstration
  const allDevices = [
    ...data.devices,
    {
      id: 'WS-3456',
      name: 'Design Workstation',
      model: 'Dell Precision 7760',
      serial: 'SN98765432',
      customer: 'Creative Studios',
      location: 'Design Department',
      healthScore: 45,
      riskLevel: 'High',
      lastSeen: '2024-01-15T13:20:00Z',
      warranty: { status: true, expiryDate: '2024-06-30' },
      telemetry: {
        temperature: 58,
        diskUsage: 92,
        cpuUsage: 78,
        memoryUsage: 85,
        powerConsumption: 320,
      },
    },
    {
      id: 'SRV-7890',
      name: 'Email Server',
      model: 'HP ProLiant DL380',
      serial: 'SN11223344',
      customer: 'Corporate IT',
      location: 'Data Center 1',
      healthScore: 72,
      riskLevel: 'Medium',
      lastSeen: '2024-01-15T14:30:00Z',
      warranty: { status: false, expiryDate: '2023-11-15' },
      telemetry: {
        temperature: 42,
        diskUsage: 68,
        cpuUsage: 45,
        memoryUsage: 62,
        powerConsumption: 280,
      },
    },
    // Additional demo devices
    {
      id: 'LT-1001',
      name: 'Finance Laptop',
      model: 'Lenovo ThinkPad X1',
      serial: 'SN55667788',
      customer: 'Finance Dept',
      location: 'Branch Office',
      healthScore: 88,
      riskLevel: 'Low',
      lastSeen: '2024-01-15T09:10:00Z',
      warranty: { status: true, expiryDate: '2025-03-12' },
      telemetry: {
        temperature: 36,
        diskUsage: 55,
        cpuUsage: 22,
        memoryUsage: 40,
        powerConsumption: 65,
      },
    },
    {
      id: 'SRV-2222',
      name: 'Backup Server',
      model: 'Dell PowerEdge R740',
      serial: 'SN99887766',
      customer: 'Corporate IT',
      location: 'Data Center 3',
      healthScore: 61,
      riskLevel: 'Medium',
      lastSeen: '2024-01-15T12:00:00Z',
      warranty: { status: true, expiryDate: '2024-12-01' },
      telemetry: {
        temperature: 48,
        diskUsage: 80,
        cpuUsage: 55,
        memoryUsage: 70,
        powerConsumption: 210,
      },
    },
    {
      id: 'WS-7891',
      name: 'Graphics Workstation',
      model: 'Apple Mac Studio',
      serial: 'SN44556677',
      customer: 'Creative Studios',
      location: 'Design Department',
      healthScore: 95,
      riskLevel: 'Low',
      lastSeen: '2024-01-15T15:45:00Z',
      warranty: { status: true, expiryDate: '2026-01-20' },
      telemetry: {
        temperature: 40,
        diskUsage: 30,
        cpuUsage: 18,
        memoryUsage: 25,
        powerConsumption: 120,
      },
    },
    {
      id: 'SRV-3333',
      name: 'Web Server',
      model: 'Supermicro SYS-1029U',
      serial: 'SN22334455',
      customer: 'Web Team',
      location: 'Data Center 1',
      healthScore: 77,
      riskLevel: 'Medium',
      lastSeen: '2024-01-15T11:25:00Z',
      warranty: { status: false, expiryDate: '2023-08-10' },
      telemetry: {
        temperature: 50,
        diskUsage: 60,
        cpuUsage: 35,
        memoryUsage: 50,
        powerConsumption: 180,
      },
    },
    {
      id: 'LT-2002',
      name: 'HR Laptop',
      model: 'HP EliteBook 840',
      serial: 'SN33445566',
      customer: 'HR Dept',
      location: 'Branch Office',
      healthScore: 82,
      riskLevel: 'Low',
      lastSeen: '2024-01-15T10:05:00Z',
      warranty: { status: true, expiryDate: '2025-07-18' },
      telemetry: {
        temperature: 34,
        diskUsage: 40,
        cpuUsage: 20,
        memoryUsage: 35,
        powerConsumption: 60,
      },
    },
    {
      id: 'SRV-4444',
      name: 'Database Server',
      model: 'Cisco UCS C220',
      serial: 'SN66778899',
      customer: 'Corporate IT',
      location: 'Data Center 3',
      healthScore: 54,
      riskLevel: 'High',
      lastSeen: '2024-01-15T16:00:00Z',
      warranty: { status: false, expiryDate: '2022-10-05' },
      telemetry: {
        temperature: 62,
        diskUsage: 95,
        cpuUsage: 85,
        memoryUsage: 90,
        powerConsumption: 350,
      },
    },
  ];

  const atRiskDevices = allDevices.filter(
    (device) => device.riskLevel === 'High' || device.riskLevel === 'Medium'
  );

  // Console-style AI Notifications data (last 50 notifications)
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

  // System Events data
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
      <Grid className="dashboard-stats-grid">
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="lg" className="dashboard-card">
            <Text size="sm" c="dimmed" mb="xs">
              Total Devices
            </Text>
            <Text size="xl" fw={700} className="dashboard-card-value">
              1,247
            </Text>
            <Group gap="xs" mt="xs">
              <IconTrendingUp size={16} color="green" />
              <Text size="sm" c="green">
                +12 this week
              </Text>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder  p="lg" className="dashboard-card">
            <Text size="sm" c="dimmed" mb="xs">
              Devices Online
            </Text>
            <Text size="xl" fw={700} className="dashboard-card-value">
              1,198
            </Text>
            <Group gap="xs" mt="xs">
              <Text size="sm" c="green">
                96.1% uptime
              </Text>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder  p="lg" className="dashboard-card">
            <Text size="sm" c="dimmed" mb="xs">
              Devices at High Risk
            </Text>
            <Text size="xl" fw={700} c="red">
              23
            </Text>
            <Group gap="xs" mt="xs">
              <Text size="sm" c="red">
                Requires attention
              </Text>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder  p="lg" className="dashboard-card">
            <Text size="sm" c="dimmed" mb="xs">
              Warranty Expiring
            </Text>
            <Text size="xl" fw={700} c="orange">
              87
            </Text>
            <Group gap="xs" mt="xs">
              <Text size="sm" c="orange">
                Next 30 days
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
                        {device.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {device.model}
                      </Text>
                    </Stack>
                  ),
                },
                {
                  accessor: 'customer',
                  title: 'Customer',
                  render: (device: Device) => (
                    <Text size="sm" className="dashboard-table-customer">
                      {device.customer}
                    </Text>
                  ),
                },
                {
                  accessor: 'healthScore',
                  title: 'Health Score',
                  render: (device: Device) => (
                    <Group gap="xs">
                      <RingProgress
                        size={40}
                        thickness={4}
                        sections={[
                          {
                            value: device.healthScore,
                            color: getHealthScoreColor(device.healthScore),
                          },
                        ]}
                      />
                      <Text size="sm" fw={500} className="dashboard-table-healthscore">
                        {device.healthScore}%
                      </Text>
                    </Group>
                  ),
                },
                {
                  accessor: 'riskLevel',
                  title: 'Risk Level',
                  render: (device: Device) => (
                    <Badge color={getRiskColor(device.riskLevel)} size="sm">
                      {device.riskLevel}
                    </Badge>
                  ),
                },
                {
                  accessor: 'lastSeen',
                  title: 'Last Seen',
                  render: (device: Device) => (
                    <Text size="sm" className="dashboard-table-lastseen">
                      {new Date(device.lastSeen).toLocaleTimeString()}
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
                data={[
                  'All Locations',
                  'Data Center 1',
                  'Data Center 3',
                  'Design Department',
                  'Branch Office',
                ]}
                value={locationFilter}
                onChange={(value) => setLocationFilter(value || 'All Locations')}
                placeholder="Filter by Location"
                size="sm"
                className="dashboard-table-filter-select"
              />
              <Select
                data={['All Departments', 'IT Operations', 'Design', 'Finance', 'Corporate']}
                value={departmentFilter}
                onChange={(value) => setDepartmentFilter(value || 'All Departments')}
                placeholder="Filter by Department"
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
                        {device.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {device.model}
                      </Text>
                    </Stack>
                  ),
                },
                {
                  accessor: 'customer',
                  title: 'Customer',
                  render: (device: Device) => (
                    <Text className="dashboard-table-customer">{device.customer}</Text>
                  ),
                },
                {
                  accessor: 'location',
                  title: 'Location',
                  render: (device: Device) => (
                    <Text className="dashboard-table-location">{device.location}</Text>
                  ),
                },
                {
                  accessor: 'healthScore',
                  title: 'Health Score',
                  render: (device: Device) => (
                    <Group gap="xs">
                      <RingProgress
                        size={40}
                        thickness={4}
                        sections={[
                          {
                            value: device.healthScore,
                            color: getHealthScoreColor(device.healthScore),
                          },
                        ]}
                      />
                      <Text size="sm" fw={500} className="dashboard-table-healthscore">
                        {device.healthScore}%
                      </Text>
                    </Group>
                  ),
                },
                {
                  accessor: 'riskLevel',
                  title: 'Risk Level',
                  render: (device: Device) => (
                    <Badge color={getRiskColor(device.riskLevel)} size="sm">
                      {device.riskLevel}
                    </Badge>
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
              records={allDevices.slice((allDevicesPage - 1) * 10, allDevicesPage * 10)}
              totalRecords={allDevices.length}
              recordsPerPage={10}
              page={allDevicesPage}
              onPageChange={setAllDevicesPage}
              noRecordsText="No devices found."
            />
            <Group justify="space-between" mt="md">
              <Text size="sm" c="dimmed">
                Showing {allDevices.length} of 1,247 devices
              </Text>
            </Group>
          </Tabs.Panel>
        </Tabs>
      </Card>

      {/* AI Notifications and System Events */}
      <Grid className="dashboard-notifications-grid">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder  p="lg" className="dashboard-ai-console-card" bg="light-dark(red, ##2E2E2E)">
            <Group justify="space-between" mb="md" className="dashboard-ai-console-header-group">
              <Group>
                <IconBrain size={20} color="#6366f1" />
                <Text fw={600} className="dashboard-ai-console-title">
                  AI Agent Console
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
          <Card withBorder  p="lg" className="dashboard-system-events-card">
            <Group justify="space-between" mb="md" className="dashboard-system-events-header-group">
              <Group>
                <IconActivity size={20} color="#8b5cf6" />
                <Text fw={600} className="dashboard-system-events-title">
                  Recent System Events
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
        title={selectedDevice ? `${selectedDevice.name} - Details` : ''}
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
                    <strong>Model:</strong> {selectedDevice.model}
                  </Text>
                  <Text size="sm" className="dashboard-device-info-serial">
                    <strong>Serial:</strong> {selectedDevice.serial}
                  </Text>
                  <Text size="sm" className="dashboard-device-info-customer">
                    <strong>Customer:</strong> {selectedDevice.customer}
                  </Text>
                  <Text size="sm" className="dashboard-device-info-location">
                    <strong>Location:</strong> {selectedDevice.location}
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
                          value: selectedDevice.healthScore,
                          color: getHealthScoreColor(selectedDevice.healthScore),
                        },
                      ]}
                    />
                    <Text size="sm" fw={500} className="dashboard-device-status-healthscore">
                      {selectedDevice.healthScore}%
                    </Text>
                  </Group>
                  <Text size="sm" className="dashboard-device-status-risk">
                    <strong>Risk Level:</strong>{' '}
                    <Badge color={getRiskColor(selectedDevice.riskLevel)} size="sm">
                      {selectedDevice.riskLevel}
                    </Badge>
                  </Text>
                  <Text size="sm" className="dashboard-device-status-warranty">
                    <strong>Warranty:</strong>{' '}
                    <Badge color={selectedDevice.warranty.status ? 'green' : 'red'} size="sm">
                      {selectedDevice.warranty.status ? 'Active' : 'Expired'}
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
                <Tabs.Tab value="telemetry">Telemetry</Tabs.Tab>
                <Tabs.Tab value="history">History</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="overview">
                <Stack gap="lg" pt="lg" className="dashboard-device-modal-overview-stack">
                  <Card p="md" className="dashboard-device-modal-overview-card">
                    <Text fw={600} mb="md" className="dashboard-device-modal-overview-title">
                      Current Performance
                    </Text>
                    <Grid>
                      <Grid.Col span={6}>
                        <Stack gap="sm">
                          <div>
                            <Group justify="space-between" mb="xs">
                              <Text size="sm" className="dashboard-device-modal-overview-cpu-label">
                                CPU Usage
                              </Text>
                              <Text
                                size="sm"
                                fw={500}
                                className="dashboard-device-modal-overview-cpu-value"
                              >
                                {selectedDevice.telemetry.cpuUsage}%
                              </Text>
                            </Group>
                            <Progress value={selectedDevice.telemetry.cpuUsage} color="blue" />
                          </div>
                          <div>
                            <Group justify="space-between" mb="xs">
                              <Text
                                size="sm"
                                className="dashboard-device-modal-overview-memory-label"
                              >
                                Memory Usage
                              </Text>
                              <Text
                                size="sm"
                                fw={500}
                                className="dashboard-device-modal-overview-memory-value"
                              >
                                {selectedDevice.telemetry.memoryUsage}%
                              </Text>
                            </Group>
                            <Progress value={selectedDevice.telemetry.memoryUsage} color="orange" />
                          </div>
                        </Stack>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Stack gap="sm">
                          <div>
                            <Group justify="space-between" mb="xs">
                              <Text
                                size="sm"
                                className="dashboard-device-modal-overview-disk-label"
                              >
                                Disk Usage
                              </Text>
                              <Text
                                size="sm"
                                fw={500}
                                className="dashboard-device-modal-overview-disk-value"
                              >
                                {selectedDevice.telemetry.diskUsage}%
                              </Text>
                            </Group>
                            <Progress value={selectedDevice.telemetry.diskUsage} color="teal" />
                          </div>
                          <div>
                            <Group justify="space-between" mb="xs">
                              <Text
                                size="sm"
                                className="dashboard-device-modal-overview-temp-label"
                              >
                                Temperature
                              </Text>
                              <Text
                                size="sm"
                                fw={500}
                                className="dashboard-device-modal-overview-temp-value"
                              >
                                {selectedDevice.telemetry.temperature}°C
                              </Text>
                            </Group>
                            <Progress
                              value={(selectedDevice.telemetry.temperature / 100) * 100}
                              color="red"
                            />
                          </div>
                        </Stack>
                      </Grid.Col>
                    </Grid>
                  </Card>
                </Stack>
              </Tabs.Panel>
              <Tabs.Panel value="telemetry">
                <Stack gap="lg" pt="lg" className="dashboard-device-modal-telemetry-stack">
                  <Text className="dashboard-device-modal-telemetry-placeholder">
                    Real-time telemetry data and metrics would be displayed here.
                  </Text>
                </Stack>
              </Tabs.Panel>
              <Tabs.Panel value="history">
                <Stack gap="lg" pt="lg" className="dashboard-device-modal-history-stack">
                  <Text className="dashboard-device-modal-history-placeholder">
                    Historical data and maintenance records would be shown here.
                  </Text>
                </Stack>
              </Tabs.Panel>
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
