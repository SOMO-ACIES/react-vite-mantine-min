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
import type { Ticket } from '../../data/dummyData';
import TelemetryTrendLine from '../TelemetryTrendLine';

interface TinaDashboardProps {
  data: any;
  darkMode?: boolean;
}

const TinaDashboard: React.FC<TinaDashboardProps> = ({ data }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>('All Priorities');
  const [warrantyFilter, setWarrantyFilter] = useState<string>('All Warranty');
  const [activePage, setActivePage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>('disk-crash');
  const [agentErrors, setAgentErrors] = useState([
    { time: '14:22:18', message: 'Agent service timeout on device 82f7d9e5a3c2' },
    { time: '14:21:45', message: 'Failed to analyze telemetry for device a3b2c1d4e5f6' },
    { time: '14:21:12', message: 'Connection lost to monitoring service' },
    { time: '14:20:58', message: 'Disk prediction model inference timeout' },
    { time: '14:20:33', message: 'Unable to create ticket for device 7f8e9d0c1b2a' },
  ]);

  // Live ticket events data
  const liveTicketEvents = [
    {
      id: 1,
      time: 'Just now',
      badge: { text: 'New', color: 'blue' },
      title: 'Server #SRV-2245 reported disk errors',
      subtitle: 'Acme Corp. - Data Center 3',
    },
    {
      id: 2,
      time: '5 minutes ago',
      badge: { text: 'Updated', color: 'purple' },
      title: 'Storage Array #ST-443 disk replacement confirmed',
      subtitle: 'TechSolutions Inc. - HQ',
    },
    {
      id: 3,
      time: '15 minutes ago',
      badge: { text: 'Critical', color: 'red' },
      title: 'NAS Device #NAS-112 multiple disk failures',
      subtitle: 'Global Finance - Branch Office',
    },
    {
      id: 4,
      time: '1 hour ago',
      badge: { text: 'Resolved', color: 'green' },
      title: 'Workstation #WS-6678 maintenance completed',
      subtitle: 'Creative Studios - Design Dept',
    },
    {
      id: 5,
      time: '2 hours ago',
      badge: { text: 'Assigned', color: 'yellow' },
      title: 'Database Server #DB-001 performance issues',
      subtitle: 'Corporate IT - Data Center 1',
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

  const handleTicketView = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    open();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Analysis':
        return 'yellow';
      case 'Critical':
        return 'red';
      case 'Assigned':
        return 'blue';
      case 'Resolved':
        return 'green';
      case 'Waiting':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const filteredTickets = data.tickets.filter(
    (ticket: any) =>
      (priorityFilter === 'All Priorities' || ticket.priority === priorityFilter) &&
      (warrantyFilter === 'All Warranty' ||
        (warrantyFilter === 'In Warranty' ? ticket.warranty : !ticket.warranty))
  );

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Group>
          <Text size="xl" fw={700}>
            Ticket Management Dashboard
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

      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="lg">
            <Text size="sm" c="dimmed" mb="xs">
              Tickets Under Analysis
            </Text>
            <Text size="xl" fw={700}>
              {data.analytics.ticketsUnderAnalysis}
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
              Closed Today
            </Text>
            <Text size="xl" fw={700}>
              {data.analytics.closedToday}
            </Text>
            <Text size="sm" c="green">
              94% resolution rate
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="lg">
            <Text size="sm" c="dimmed" mb="xs">
              Assigned Today
            </Text>
            <Text size="xl" fw={700}>
              {data.analytics.assignedToday}
            </Text>
            <Text size="sm" c="red">
              3 high priority
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="lg">
            <Text size="sm" c="dimmed" mb="xs">
              Avg. Response Time
            </Text>
            <Text size="xl" fw={700}>
              {data.analytics.avgResponseTime}
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
              <Text fw={600}>Live Ticket Events</Text>
              <Badge color="green" variant="light">
                Live
              </Badge>
            </Group>
            <ScrollArea style={{ flex: 1 }}>
              <Stack gap="md">
                {liveTicketEvents.map((event) => (
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
            <ScrollArea h={400}>
              <div
                style={{
                  height: '420px',
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
              <Text fw={600}>Ticket Queue</Text>
              <Group>
                <Select
                  data={['All Priorities', 'High', 'Medium', 'Low']}
                  value={priorityFilter}
                  onChange={(val) => setPriorityFilter(val || 'All Priorities')}
                  size="sm"
                />
                <Select
                  data={['All Warranty', 'In Warranty', 'Out of Warranty']}
                  value={warrantyFilter}
                  onChange={(val) => setWarrantyFilter(val || 'All Warranty')}
                  size="sm"
                />
              </Group>
            </Group>

            <DataTable
              columns={[
                {
                  accessor: 'id',
                  title: 'ID',
                  render: (r) => <Text>{r.id}</Text>,
                },
                {
                  accessor: 'device',
                  title: 'Device',
                  render: (r) => <Text>{r.device}</Text>,
                },
                {
                  accessor: 'customer',
                  title: 'Customer',
                  render: (r) => <Text>{r.customer}</Text>,
                },
                {
                  accessor: 'issue',
                  title: 'Issue',
                  render: (r) => <Text>{r.issue}</Text>,
                },
                {
                  accessor: 'status',
                  title: 'Status',
                  render: (r) => <Badge color={getStatusColor(r.status)}>{r.status}</Badge>,
                },
                {
                  accessor: 'priority',
                  title: 'Priority',
                  render: (r) => <Badge color={getPriorityColor(r.priority)}>{r.priority}</Badge>,
                },
                {
                  accessor: 'actions',
                  title: 'Actions',
                  render: (r) => (
                    <ActionIcon
                      onClick={() => handleTicketView(r as unknown as Ticket)}
                      variant="light"
                      size="sm"
                    >
                      <IconEye size={14} />
                    </ActionIcon>
                  ),
                },
              ]}
              records={filteredTickets}
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
              totalRecords={filteredTickets.length}
            />
          </Card>
        </Grid.Col>
      </Grid>

      {/* Ticket Detail Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={selectedTicket ? `Ticket ${selectedTicket.id} - Analysis` : ''}
        size="xl"
      >
        {selectedTicket && (
          <Stack gap="lg">
            <Group justify="space-between">
              <Group>
                <Badge color={getStatusColor(selectedTicket.status)}>
                  In {selectedTicket.status}
                </Badge>
                {selectedTicket.warranty && (
                  <Badge color="green" variant="light">
                    In Warranty
                  </Badge>
                )}
              </Group>
              <ActionIcon onClick={close} variant="light">
                <IconX size={16} />
              </ActionIcon>
            </Group>

            <Grid>
              <Grid.Col span={6}>
                <Stack gap="sm">
                  <Text fw={600}>Customer Information</Text>
                  <Text size="sm">
                    <strong>Company:</strong> Acme Corporation
                  </Text>
                  <Text size="sm">
                    <strong>Contact:</strong> John Smith
                  </Text>
                  <Text size="sm">
                    <strong>Location:</strong> Data Center 3
                  </Text>
                  <Text size="sm">
                    <strong>Support Level:</strong> Premium
                  </Text>
                </Stack>
              </Grid.Col>

              <Grid.Col span={6}>
                <Stack gap="sm">
                  <Text fw={600}>Device Information</Text>
                  <Text size="sm">
                    <strong>Device:</strong> Server #SRV-2245
                  </Text>
                  <Text size="sm">
                    <strong>Model:</strong> PowerEdge R740
                  </Text>
                  <Text size="sm">
                    <strong>Serial:</strong> SN78932145
                  </Text>
                  <Text size="sm">
                    <strong>Warranty:</strong> Valid until Dec 2023
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>

            <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'disk-crash')}>
              <Tabs.List>
                <Tabs.Tab value="disk-crash">Disk Crash Probability</Tabs.Tab>
                <Tabs.Tab value="device-crash">Device Crash Statistics</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="disk-crash">
                <Stack gap="lg" pt="lg">
                  <Card withBorder p="md">
                    <Text fw={600} mb="md">
                      AI Analysis
                    </Text>
                    <Text size="sm" mb="sm">
                      <strong>Issue:</strong> Disk failure prediction for Disk 2 (Bay 3)
                    </Text>
                    <Text size="sm" mb="sm">
                      <strong>Confidence:</strong> 87%
                    </Text>
                    <Text size="sm" mb="sm">
                      <strong>Suggested Action:</strong> Preemptive disk replacement recommended
                    </Text>
                    <Text size="sm">
                      <strong>Part Required:</strong> 1.2TB 10K SAS 12Gbps 512n 2.5in Hot-plug Hard
                      Drive
                    </Text>
                  </Card>

                  {selectedTicket.telemetry && (
                    <Card withBorder p="md">
                      <Text fw={600} mb="md">
                        Telemetry Data
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
                              Read Error Rate
                            </Text>
                            <TelemetryTrendLine
                              data={generateTrendData(selectedTicket.telemetry.readErrorRate, 'up')}
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
                              color="red"
                              size="sm"
                              style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                              }}
                            >
                              High
                            </Badge>
                            <Text size="sm" fw={500} mb="sm">
                              Reallocated Sectors
                            </Text>
                            <TelemetryTrendLine
                              data={generateTrendData(
                                selectedTicket.telemetry.reallocatedSectors,
                                'up'
                              )}
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
                              Spin Retry Count
                            </Text>
                            <TelemetryTrendLine
                              data={generateTrendData(
                                selectedTicket.telemetry.spinRetryCount,
                                'up'
                              )}
                              color="#f59e0b"
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
                              Temperature
                            </Text>
                            <TelemetryTrendLine
                              data={generateTrendData(
                                selectedTicket.telemetry.temperature,
                                'stable'
                              )}
                              color="#f59e0b"
                              trend="stable"
                              width={120}
                              height={40}
                            />
                          </Card>
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Card withBorder p="md" style={{ position: 'relative' }}>
                            <Badge
                              color="gray"
                              size="sm"
                              style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                              }}
                            >
                              Normal
                            </Badge>
                            <Text size="sm" fw={500} mb="sm">
                              Power-On Hours
                            </Text>
                            <TelemetryTrendLine
                              data={generateTrendData(
                                selectedTicket.telemetry.powerOnHours / 1000,
                                'up'
                              )}
                              color="#6b7280"
                              trend="up"
                              width={120}
                              height={40}
                            />
                          </Card>
                        </Grid.Col>

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
                              Failing
                            </Badge>
                            <Text size="sm" fw={500} mb="sm">
                              SMART Status
                            </Text>
                            <TelemetryTrendLine
                              data={generateTrendData(80, 'down')}
                              color="#ef4444"
                              trend="down"
                              width={120}
                              height={40}
                            />
                          </Card>
                        </Grid.Col>
                      </Grid>
                    </Card>
                  )}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="device-crash">
                <Stack gap="lg" pt="lg">
                  {/* Risk Probability Gauge */}
                  <Card withBorder p="md">
                    <Text fw={600} mb="md">
                      Device Crash Risk Probability
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
                      High risk of device failure within next 30 days
                    </Text>
                  </Card>

                  {/* Customer, Device, and Telemetry Information */}
                  <Grid>
                    <Grid.Col span={4}>
                      <Card withBorder p="md">
                        <Text fw={600} mb="md">
                          Customer Information
                        </Text>
                        <Stack gap="sm">
                          <Text size="sm">
                            <strong>Customer ID:</strong> {deviceCrashData.customerInfo.customerId}
                          </Text>
                          <Text size="sm">
                            <strong>Contacted Before:</strong>{' '}
                            {deviceCrashData.customerInfo.contactedBefore}
                          </Text>
                          <Text size="sm">
                            <strong>Last Contact Date:</strong>{' '}
                            {deviceCrashData.customerInfo.lastContactDate}
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
                            <strong>Model Type:</strong> {deviceCrashData.deviceInfo.modelType}
                          </Text>
                          <Text size="sm">
                            <strong>OS Version:</strong> {deviceCrashData.deviceInfo.osVersion}
                          </Text>
                          <Text size="sm">
                            <strong>Manufacturer:</strong> {deviceCrashData.deviceInfo.manufacturer}
                          </Text>
                          <Text size="sm">
                            <strong>Manufacturing Date:</strong>{' '}
                            {deviceCrashData.deviceInfo.manufacturingDate}
                          </Text>
                        </Stack>
                      </Card>
                    </Grid.Col>

                    <Grid.Col span={4}>
                      <Card withBorder p="md">
                        <Text fw={600} mb="md">
                          Telemetry Metrics
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
                          Crash Type Distribution
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
                          Failure Components
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
                Close Ticket
              </Button>
              <Button variant="outline">Assign to Field Ops</Button>
              <Button>Attempt Reboot</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
};

export default TinaDashboard;
