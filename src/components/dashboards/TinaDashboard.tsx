import React, { useEffect, useState } from 'react';
import {
  IconBrain,
  IconEye,
  IconRefresh,
  IconTicket,
  IconTrendingDown,
  IconTrendingUp,
  IconX,
} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { PieChart } from '@mantine/charts';
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
import { mockIssues } from '../../data/mockDataO';
import TelemetryTrendLine from '../TelemetryTrendLine';
import './Dashboard.module.css';

interface TinaDashboardProps {
  // data: any; // No longer needed
  darkMode?: boolean;
}

type Issue = (typeof mockIssues)[number];

const TinaDashboard: React.FC<TinaDashboardProps> = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All Statuses');
  const [typeFilter, setTypeFilter] = useState<string>('All Types');
  const [activePage, setActivePage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>('disk-crash');
  const [agentErrors, setAgentErrors] = useState([
    { time: '14:22:18', message: 'Agent service timeout on device 82f7d9e5a3c2' },
    { time: '14:21:45', message: 'Failed to analyze telemetry for device a3b2c1d4e5f6' },
    { time: '14:21:12', message: 'Connection lost to monitoring service' },
    { time: '14:20:58', message: 'Disk prediction model inference timeout' },
    { time: '14:20:33', message: 'Unable to create ticket for device 7f8e9d0c1b2a' },
  ]);

  // Live issue events data
  const liveIssueEvents = [
    {
      id: 1,
      time: 'Just now',
      badge: { text: 'New', color: 'blue' },
      title: 'Battery draining rapidly on device DEV001',
      subtitle: 'Dell Inspiron 15 - User reported sudden power loss',
    },
    {
      id: 2,
      time: '3 minutes ago',
      badge: { text: 'Under Analysis', color: 'yellow' },
      title: 'Driver update failed on device DEV004',
      subtitle: 'ASUS ZenBook 14 - Network adapter not detected',
    },
    {
      id: 3,
      time: '10 minutes ago',
      badge: { text: 'Closed', color: 'green' },
      title: 'Device crash resolved on device DEV006',
      subtitle: 'MSI Gaming Desktop - System rebooted successfully',
    },
    {
      id: 4,
      time: '20 minutes ago',
      badge: { text: 'Forwarded', color: 'purple' },
      title: 'Thermal issue escalated for device DEV003',
      subtitle: 'Lenovo ThinkPad X1 - Overheating during gaming',
    },
    {
      id: 5,
      time: '1 hour ago',
      badge: { text: 'Closed', color: 'green' },
      title: 'Screen flickering fixed on device DEV002',
      subtitle: 'HP Pavilion Desktop - Display driver reinstalled',
    },
  ];

  // Device crash statistics data
  const deviceCrashData = {
    riskProbability: 87,
    customerInfo: {
      customerId: 'CUST-120144',
      contactedBefore: 'Yes',
      lastContactDate: '2024-11-15',
    },
    deviceInfo: {
      modelType: '20NX',
      osVersion: '10.0.19044.2604',
      manufacturer: 'LENOVO',
      manufacturingDate: '2023-02-22',
    },
    telemetryMetrics: {
      avgCpuUsage: 48.99,
      avgFreeMemory: 16004.33,
      avgDiskFreePercentage: 51.1,
    },
    crashTypeDistribution: [
      { name: 'Hardware Failure', value: 45, color: '#ef4444' },
      { name: 'Software Crash', value: 30, color: '#f59e0b' },
      { name: 'Power Issues', value: 15, color: '#8b5cf6' },
      { name: 'Overheating', value: 10, color: '#06b6d4' },
    ],
    failureComponents: [
      { name: 'Hard Drive', value: 40, color: '#ef4444' },
      { name: 'Memory', value: 25, color: '#f59e0b' },
      { name: 'CPU', value: 20, color: '#8b5cf6' },
      { name: 'Power Supply', value: 15, color: '#06b6d4' },
    ],
    riskFactors: [
      { name: 'Age Factor', value: 35, color: '#ef4444' },
      { name: 'Usage Pattern', value: 30, color: '#f59e0b' },
      { name: 'Environmental', value: 20, color: '#8b5cf6' },
      { name: 'Maintenance', value: 15, color: '#06b6d4' },
    ],
  };

  // Generate sample trend data for telemetry
  const generateTrendData = (baseValue: number, trend: 'up' | 'down' | 'stable') => {
    const data = [];
    let current = baseValue;

    for (let i = 0; i < 12; i++) {
      if (trend === 'up') {
        current += Math.random() * 5 + 1;
      } else if (trend === 'down') {
        current -= Math.random() * 3 + 0.5;
      } else {
        current += (Math.random() - 0.5) * 2;
      }
      data.push(Math.max(0, current));
    }
    return data;
  };

  const handleIssueView = (issue: Issue) => {
    setSelectedIssue(issue);
    open();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'yellow';
      case 'In Progress':
        return 'blue';
      case 'Resolved':
        return 'green';
      case 'Closed':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BATTERY_DRAIN':
      case 'THERMAL_ISSUE':
      case 'SYSTEM_CRASH':
        return 'red';
      case 'DISPLAY_ISSUE':
      case 'NETWORK_ISSUE':
      case 'PERFORMANCE_ISSUE':
        return 'yellow';
      case 'INPUT_ISSUE':
      case 'AUDIO_ISSUE':
      case 'TOUCH_ISSUE':
      case 'LIGHTING_ISSUE':
        return 'blue';
      default:
        return 'gray';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAgentErrors((prev) => [
        ...prev.slice(-20),
        {
          time: new Date().toLocaleTimeString(),
          message: `Error ${Math.floor(Math.random() * 1000)}: Failed to process device telemetry`,
        },
      ]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Filtering logic
  const filteredIssues = mockIssues.filter(
    (issue) =>
      (statusFilter === 'All Statuses' || issue.issue_status === statusFilter) &&
      (typeFilter === 'All Types' || issue.issue_type_id === typeFilter)
  );

  // For filter dropdowns
  const statusOptions = [
    'All Statuses',
    ...Array.from(new Set(mockIssues.map((i) => i.issue_status))).sort(),
  ];
  const typeOptions = [
    'All Types',
    ...Array.from(new Set(mockIssues.map((i) => i.issue_type_id))).sort(),
  ];

  // Analytics calculations
  const analytics = {
    ticketsUnderAnalysis: mockIssues.filter(
      (i) => i.issue_status === 'Open' || i.issue_status === 'In Progress'
    ).length,
    closedToday: mockIssues.filter(
      (i) => i.issue_status === 'Resolved' || i.issue_status === 'Closed'
    ).length,
    assignedToday: mockIssues.filter((i) => i.issue_status === 'In Progress').length,
    avgResponseTime: '1.4h',
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Group>
          <Text size="xl" fw={700}>
            Issue Management Dashboard
          </Text>
          <Select
            data={["Rahul's Dashboard", "Tina's Dashboard", "Fred's Dashboard"]}
            defaultValue="Tina's Dashboard"
            leftSection={<IconTicket size={16} />}
          />
        </Group>
        <Group>
          <Text size="sm" c="dimmed">
            Last updated: Today, 10:45 AM
          </Text>
          <ActionIcon variant="light">
            <IconRefresh size={16} />
          </ActionIcon>
        </Group>
      </Group>

      <Grid align="stretch">
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }} h="100%">
          <Card withBorder p="lg" className="dashboard-card">
            <Text size="sm" c="dimmed" mb="xs">
              Issues Under Analysis
            </Text>
            <Text size="xl" fw={700}>
              {analytics.ticketsUnderAnalysis}
            </Text>
            <Group gap="xs" mt="xs">
              <IconTrendingUp size={16} color="green" />
              <Text size="sm" c="green">
                +3 from yesterday
              </Text>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="lg">
            <Text size="sm" c="dimmed" mb="xs">
              Resolved Today
            </Text>
            <Text size="xl" fw={700}>
              {analytics.closedToday}
            </Text>
            <Text size="sm" c="green">
              94% resolution rate
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="lg">
            <Text size="sm" c="dimmed" mb="xs">
              In Progress
            </Text>
            <Text size="xl" fw={700}>
              {analytics.assignedToday}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="lg">
            <Text size="sm" c="dimmed" mb="xs">
              Avg. Response Time
            </Text>
            <Text size="xl" fw={700}>
              {analytics.avgResponseTime}
            </Text>
            <Group gap="xs" mt="xs">
              <IconTrendingDown size={16} color="green" />
              <Text size="sm" c="green">
                -15min from last week
              </Text>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder p="lg" h="500" style={{ display: 'flex', flexDirection: 'column' }}>
            <Group justify="space-between" mb="md">
              <Text fw={600}>Live Issue Events</Text>
              <Badge color="green" variant="light">
                Live
              </Badge>
            </Group>
            <ScrollArea style={{ flex: 1 }}>
              <Stack gap="md">
                {liveIssueEvents.map((event) => (
                  <Card key={event.id} withBorder p="sm">
                  <Group justify="space-between">
                      <Text size="sm">{event.time}</Text>
                      <Badge color={event.badge.color} size="xs">
                        {event.badge.text}
                    </Badge>
                  </Group>
                  <Text size="sm" fw={500}>
                      {event.title}
                  </Text>
                  <Text size="xs" c="dimmed">
                      {event.subtitle}
                  </Text>
                </Card>
                ))}
              </Stack>
            </ScrollArea>
          </Card>

          <Card withBorder p="lg" mt="md" h={500}>
            <Group justify="space-between" mb="md">
              <Group>
                <IconBrain size={20} color="#6366f1" />
                <Text fw={600}>AI Agent Console</Text>
              </Group>
              <Badge color="blue" variant="light">
                Live
              </Badge>
            </Group>
            <ScrollArea mih={400}>
              <div
                style={{
                  minHeight: '400px',
                  backgroundColor: '#0f172a',
                  borderRadius: '6px',
                  padding: '12px',
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  fontSize: '12px',
                  lineHeight: '1.4',
                }}
              >
                {agentErrors.map((notification, idx) => (
                  <div key={idx} style={{ marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>[{notification.time}]</span>{' '}
                    <span style={{ color: '#ef4444' }}>{notification.message}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder p="lg" h="1015">
            <Group justify="space-between" mb="md">
              <Text fw={600}>Issue Queue</Text>
              <Group>
                <Select
                  data={statusOptions}
                  value={statusFilter}
                  onChange={(val) => setStatusFilter(val || 'All Statuses')}
                  size="sm"
                />
                <Select
                  data={typeOptions}
                  value={typeFilter}
                  onChange={(val) => setTypeFilter(val || 'All Types')}
                  size="sm"
                />
              </Group>
            </Group>

            <DataTable
              columns={[
                {
                  accessor: 'id',
                  title: 'ID',
                  render: (r) => <Text>{r.item_id}</Text>,
                },
                {
                  accessor: 'device',
                  title: 'Device',
                  render: (r) => <Text>{r.device_id}</Text>,
                },
                {
                  accessor: 'title',
                  title: 'Issue Title',
                  render: (r) => <Text>{r.issue_title}</Text>,
                },
                {
                  accessor: 'type',
                  title: 'Type',
                  render: (r) => <Text>{r.item_name}</Text>,
                },
                {
                  accessor: 'status',
                  title: 'Status',
                  render: (r) => (
                    <Badge color={getStatusColor(r.issue_status)}>{r.issue_status}</Badge>
                  ),
                },
                // {
                //   accessor: 'priority',
                //   title: 'Priority',
                //   render: (r) => <Badge color={getTypeColor(r.issue_type_id)}>{r.issue_type_id}</Badge>,
                // },
                {
                  accessor: 'actions',
                  title: 'Actions',
                  render: (r) => (
                    <ActionIcon onClick={() => handleIssueView(r)} variant="light" size="sm">
                      <IconEye size={14} />
                    </ActionIcon>
                  ),
                },
              ]}
              records={filteredIssues}
              mt="md"
              highlightOnHover
              borderRadius="md"
              withTableBorder
              minHeight={400}
              striped
              verticalSpacing="lg"
              page={activePage}
              onPageChange={setActivePage}
              recordsPerPage={15}
              totalRecords={filteredIssues.length}
            />
          </Card>
        </Grid.Col>
      </Grid>

      {/* Issue Detail Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={selectedIssue ? `Issue ${selectedIssue.item_id} - Analysis` : ''}
        size="xl"
      >
        {selectedIssue && (
          <Stack gap="lg">
            <Group justify="space-between">
              <Group>
                <Badge color={getStatusColor(selectedIssue.issue_status)}>
                  {selectedIssue.issue_status}
                </Badge>
                <Badge color={getTypeColor(selectedIssue.issue_type_id)} variant="light">
                  {selectedIssue.issue_type_id}
                  </Badge>
              </Group>
              <ActionIcon onClick={close} variant="light">
                <IconX size={16} />
              </ActionIcon>
            </Group>

            <Grid>
              <Grid.Col span={6}>
                <Stack gap="sm">
                  <Text fw={600}>Issue Information</Text>
                  <Text size="sm">
                    <strong>Title:</strong> {selectedIssue.issue_title}
                  </Text>
                  <Text size="sm">
                    <strong>Type:</strong> {selectedIssue.item_name}
                  </Text>
                  <Text size="sm">
                    <strong>Device ID:</strong> {selectedIssue.device_id}
                  </Text>
                  <Text size="sm">
                    <strong>Reported:</strong> {new Date(selectedIssue.timestamp).toLocaleString()}
                  </Text>
                </Stack>
              </Grid.Col>

              <Grid.Col span={6}>
                <Stack gap="sm">
                  <Text fw={600}>Technical Details</Text>
                  <Text size="sm">
                    <strong>Dataset ID:</strong> {selectedIssue.dataset_id}
                  </Text>
                  <Text size="sm">
                    <strong>Subscription ID:</strong> {selectedIssue.subscription_id}
                  </Text>
                  <Text size="sm">
                    <strong>Schema Version:</strong> {selectedIssue.schema_ver}
                  </Text>
                  <Text size="sm">
                    <strong>Context ID:</strong> {selectedIssue.item_context_id}
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>

            <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'disk-crash')}>
              <Tabs.List>
                <Tabs.Tab value="disk-crash">Issue Analysis</Tabs.Tab>
                <Tabs.Tab value="device-crash">Device Statistics</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="disk-crash">
                <Stack gap="lg" pt="lg">
                  <Card withBorder p="md">
                    <Text fw={600} mb="md">
                      AI Analysis
                    </Text>
                    <Text size="sm" mb="sm">
                      <strong>Issue:</strong> {selectedIssue.issue_title}
                    </Text>
                    <Text size="sm" mb="sm">
                      <strong>Confidence:</strong> 87%
                    </Text>
                    <Text size="sm" mb="sm">
                      <strong>Suggested Action:</strong>{' '}
                      {selectedIssue.issue_type_id === 'BATTERY_DRAIN'
                        ? 'Battery replacement recommended'
                        : 'System diagnostics required'}
                    </Text>
                    <Text size="sm">
                      <strong>Part Required:</strong>{' '}
                      {selectedIssue.issue_type_id === 'BATTERY_DRAIN'
                        ? 'Lithium-ion Battery Pack'
                        : 'Diagnostic tools'}
                    </Text>
                  </Card>

                  <Card withBorder p="md">
                    <Text fw={600} mb="md">
                      Issue Metrics
                    </Text>
                    <Grid gutter="md">
                      <Grid.Col span={6}>
                        <Card withBorder p="md" style={{ position: 'relative' }}>
                          <Badge
                            color="red"
                            size="sm"
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                            }}
                          >
                            Critical
                          </Badge>
                          <Text size="sm" fw={500} mb="sm">
                            Issue Severity
                          </Text>
                          <TelemetryTrendLine
                            data={generateTrendData(75, 'up')}
                            color="#ef4444"
                            trend="up"
                            width={120}
                            height={40}
                          />
                        </Card>
                      </Grid.Col>

                      <Grid.Col span={6}>
                        <Card withBorder p="md" style={{ position: 'relative' }}>
                          <Badge
                            color="yellow"
                            size="sm"
                      style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                            }}
                          >
                            Warning
                          </Badge>
                          <Text size="sm" fw={500} mb="sm">
                            Response Time
                          </Text>
                          <TelemetryTrendLine
                            data={generateTrendData(45, 'stable')}
                            color="#f59e0b"
                            trend="stable"
                            width={120}
                            height={40}
                          />
                        </Card>
                      </Grid.Col>
                    </Grid>
                  </Card>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="device-crash">
                <Stack gap="lg" pt="lg">
                  {/* Risk Probability Gauge */}
                  <Card withBorder p="md">
                    <Text fw={600} mb="md">
                      Issue Resolution Probability
                    </Text>
                    <Group justify="center" mb="md">
                      <RingProgress
                        size={200}
                        thickness={20}
                        sections={[
                          {
                            value: deviceCrashData.riskProbability,
                            color:
                              deviceCrashData.riskProbability > 80
                                ? 'red'
                                : deviceCrashData.riskProbability > 60
                                  ? 'yellow'
                                  : 'green',
                          },
                        ]}
                        label={
                          <Text size="xl" fw={700} ta="center">
                            {deviceCrashData.riskProbability}%
                          </Text>
                        }
                      />
                    </Group>
                    <Text size="sm" ta="center" c="dimmed">
                      High probability of issue resolution within next 24 hours
                    </Text>
                  </Card>

                  {/* Customer, Device, and Telemetry Information */}
                  <Grid>
                    <Grid.Col span={4}>
                      <Card withBorder p="md">
                        <Text fw={600} mb="md">
                          Issue Information
                        </Text>
                        <Stack gap="sm">
                          <Text size="sm">
                            <strong>Issue ID:</strong> {selectedIssue.item_id}
                          </Text>
                          <Text size="sm">
                            <strong>Type:</strong> {selectedIssue.issue_type_id}
                          </Text>
                          <Text size="sm">
                            <strong>Status:</strong> {selectedIssue.issue_status}
                          </Text>
                        </Stack>
                      </Card>
                    </Grid.Col>

                    <Grid.Col span={4}>
                      <Card withBorder p="md">
                        <Text fw={600} mb="md">
                          Device Information
                        </Text>
                        <Stack gap="sm">
                          <Text size="sm">
                            <strong>Device ID:</strong> {selectedIssue.device_id}
                          </Text>
                          <Text size="sm">
                            <strong>Dataset ID:</strong> {selectedIssue.dataset_id}
                          </Text>
                          <Text size="sm">
                            <strong>Context ID:</strong> {selectedIssue.device_context_id}
                          </Text>
                        </Stack>
                      </Card>
                    </Grid.Col>

                    <Grid.Col span={4}>
                      <Card withBorder p="md">
                        <Text fw={600} mb="md">
                          System Metrics
                        </Text>
                        <Stack gap="sm">
                          <Text size="sm">
                            <strong>Avg CPU Usage:</strong>{' '}
                            {deviceCrashData.telemetryMetrics.avgCpuUsage}%
                          </Text>
                          <Text size="sm">
                            <strong>Avg Free Memory:</strong>{' '}
                            {deviceCrashData.telemetryMetrics.avgFreeMemory} MB
                          </Text>
                          <Text size="sm">
                            <strong>Avg Disk Free Percentage:</strong>{' '}
                            {deviceCrashData.telemetryMetrics.avgDiskFreePercentage}%
                          </Text>
                        </Stack>
                      </Card>
                    </Grid.Col>
                  </Grid>

                  {/* Pie Charts */}
                  <Grid>
                    <Grid.Col span={4}>
                      <Card withBorder p="md">
                        <Text fw={600} mb="md">
                          Issue Type Distribution
                        </Text>
                        <PieChart
                          data={deviceCrashData.crashTypeDistribution}
                          size={200}
                          withLabelsLine
                          labelsPosition="outside"
                          labelsType="percent"
                          withTooltip
                          tooltipDataSource="segment"
                          mx="auto"
                        />
                      </Card>
                    </Grid.Col>

                    <Grid.Col span={4}>
                      <Card withBorder p="md">
                        <Text fw={600} mb="md">
                          Resolution Components
                        </Text>
                        <PieChart
                          data={deviceCrashData.failureComponents}
                          size={200}
                          withLabelsLine
                          labelsPosition="outside"
                          labelsType="percent"
                          withTooltip
                          tooltipDataSource="segment"
                          mx="auto"
                        />
                      </Card>
                    </Grid.Col>

                    <Grid.Col span={4}>
                      <Card withBorder p="md">
                        <Text fw={600} mb="md">
                          Risk Factors
                        </Text>
                        <PieChart
                          data={deviceCrashData.riskFactors}
                          size={200}
                          withLabelsLine
                          labelsPosition="outside"
                          labelsType="percent"
                          withTooltip
                          tooltipDataSource="segment"
                          mx="auto"
                        />
                      </Card>
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Tabs.Panel>
            </Tabs>

            <Group justify="flex-end" gap="md">
              <Button variant="outline" color="red">
                Close Issue
              </Button>
              <Button variant="outline">Assign to Field Ops</Button>
              <Button>Attempt Resolution</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
};

export default TinaDashboard;
