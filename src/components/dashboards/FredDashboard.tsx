import React, { useEffect, useState } from 'react';
import {
  IconBrain,
  IconBuilding,
  IconEye,
  IconMail,
  IconMapPin,
  IconPhone,
  IconRefresh,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Modal,
  Progress,
  ScrollArea,
  Select,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { Customer } from '../../data/dummyData';

interface FredDashboardProps {
  data: any;
}

interface CustomerActivity {
  id: number;
  type: 'resolved' | 'new' | 'escalation' | 'followup' | 'maintenance' | 'upgrade';
  title: string;
  customer: string;
  description: string;
  time: string;
  priority: 'High' | 'Medium' | 'Low';
  status: string;
  assignedTo?: string;
  satisfaction?: number;
}

const FredDashboard: React.FC<FredDashboardProps> = ({ data }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [supportLevelFilter, setSupportLevelFilter] = useState<string>('All Support Levels');
  const [locationFilter, setLocationFilter] = useState<string>('All Locations');
  const [activePage, setActivePage] = useState(1);
  const [agentErrors, setAgentErrors] = useState([
    { time: '14:22:18', message: 'Agent service timeout on device 82f7d9e5a3c2' },
    { time: '14:21:45', message: 'Failed to analyze telemetry for device a3b2c1d4e5f6' },
    { time: '14:21:12', message: 'Connection lost to monitoring service' },
    { time: '14:20:58', message: 'Disk prediction model inference timeout' },
    { time: '14:20:33', message: 'Unable to create ticket for device 7f8e9d0c1b2a' },
  ]);

  // Recent Customer Activities dummy data
  const customerActivities: CustomerActivity[] = [
    {
      id: 1,
      type: 'resolved',
      title: 'Case Resolved',
      customer: 'Acme Corporation',
      description: 'Storage issue resolved successfully',
      time: '5 min ago',
      priority: 'High',
      status: 'Completed',
      satisfaction: 5,
    },
    {
      id: 2,
      type: 'new',
      title: 'New Case',
      customer: 'Global Finance Ltd',
      description: 'Network connectivity issue reported',
      time: '23 min ago',
      priority: 'Medium',
      status: 'In Progress',
      assignedTo: 'Technical Support',
    },
    {
      id: 3,
      type: 'escalation',
      title: 'Escalation',
      customer: 'HealthCare Plus',
      description: 'Critical system outage - immediate attention required',
      time: '1 hour ago',
      priority: 'High',
      status: 'Escalated',
      assignedTo: 'Senior Engineering',
    },
    {
      id: 4,
      type: 'followup',
      title: 'Follow-up',
      customer: 'Design Studios Ltd',
      description: 'Post-maintenance check scheduled',
      time: '2 hours ago',
      priority: 'Low',
      status: 'Scheduled',
    },
    {
      id: 5,
      type: 'maintenance',
      title: 'Maintenance Completed',
      customer: 'TechSolutions Inc.',
      description: 'Routine server maintenance completed',
      time: '3 hours ago',
      priority: 'Medium',
      status: 'Completed',
      satisfaction: 4,
    },
    {
      id: 6,
      type: 'upgrade',
      title: 'System Upgrade',
      customer: 'Acme Corporation',
      description: 'Database server upgrade initiated',
      time: '4 hours ago',
      priority: 'Medium',
      status: 'In Progress',
      assignedTo: 'Infrastructure Team',
    },
    {
      id: 7,
      type: 'resolved',
      title: 'Issue Resolved',
      customer: 'Global Finance Ltd',
      description: 'Email server configuration fixed',
      time: '5 hours ago',
      priority: 'Low',
      status: 'Completed',
      satisfaction: 5,
    },
    {
      id: 8,
      type: 'new',
      title: 'New Request',
      customer: 'HealthCare Plus',
      description: 'Additional storage capacity requested',
      time: '6 hours ago',
      priority: 'Medium',
      status: 'Under Review',
      assignedTo: 'Sales Team',
    },
    {
      id: 9,
      type: 'followup',
      title: 'Customer Check-in',
      customer: 'Design Studios Ltd',
      description: 'Quarterly business review scheduled',
      time: '1 day ago',
      priority: 'Low',
      status: 'Scheduled',
    },
    {
      id: 10,
      type: 'escalation',
      title: 'Priority Escalation',
      customer: 'TechSolutions Inc.',
      description: 'Performance degradation requires immediate attention',
      time: '1 day ago',
      priority: 'High',
      status: 'Escalated',
      assignedTo: 'Performance Team',
    },
  ];

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

  const handleCustomerView = (customer: Customer) => {
    setSelectedCustomer(customer);
    open();
  };

  const getSupportLevelColor = (level: string) => {
    switch (level) {
      case 'Enterprise':
        return 'violet';
      case 'Premium':
        return 'blue';
      case 'Basic':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'resolved':
        return 'green';
      case 'new':
        return 'blue';
      case 'escalation':
        return 'red';
      case 'followup':
        return 'orange';
      case 'maintenance':
        return 'teal';
      case 'upgrade':
        return 'violet';
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

  const expandedCustomers = [
    ...data.customers,
    {
      id: 'CUST-003',
      name: 'TechSolutions Inc.',
      contact: 'Mike Chen',
      location: 'HQ Building',
      supportLevel: 'Basic' as const,
      deviceCount: 67,
    },
    {
      id: 'CUST-004',
      name: 'Design Studios Ltd',
      contact: 'Emma Wilson',
      location: 'Creative Hub',
      supportLevel: 'Premium' as const,
      deviceCount: 34,
    },
    {
      id: 'CUST-005',
      name: 'HealthCare Plus',
      contact: 'Dr. Robert Smith',
      location: 'Medical Center',
      supportLevel: 'Enterprise' as const,
      deviceCount: 189,
    },
  ];

  // Filter customers based on selected filters
  const filteredCustomers = expandedCustomers.filter((customer) => {
    const supportLevelMatch =
      supportLevelFilter === 'All Support Levels' || customer.supportLevel === supportLevelFilter;
    const locationMatch =
      locationFilter === 'All Locations' ||
      customer.location.includes(
        locationFilter
          .replace('Data Center 3', 'Data Center')
          .replace('Branch Office', 'Branch')
          .replace('HQ', 'HQ')
      );
    return supportLevelMatch && locationMatch;
  });

  return (
    <Stack gap="lg" className="fred-dashboard-stack">
      {/* Header */}
      <Group justify="space-between" className="fred-dashboard-header-group">
        <Group className="fred-dashboard-title-group">
          <Text size="xl" fw={700} className="fred-dashboard-title-text">
            Customer Success Dashboard
          </Text>
          <Select
            data={["Rahul's Dashboard", "Tina's Dashboard", "Fred's Dashboard"]}
            defaultValue="Fred's Dashboard"
            leftSection={<IconUsers size={16} />}
            className="fred-dashboard-select"
          />
        </Group>
        <Group className="fred-dashboard-updated-group">
          <Text size="sm" className="fred-dashboard-updated-text">
            Last updated: Today, 10:45 AM
          </Text>
          <ActionIcon variant="light" className="fred-dashboard-refresh-icon">
            <IconRefresh size={16} />
          </ActionIcon>
        </Group>
      </Group>

      {/* Stats Cards */}
      <Grid className="fred-dashboard-stats-grid">
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="lg" className="fred-dashboard-stats-card">
            <Text size="sm" className="fred-dashboard-stats-label" mb="xs">
              Total Customers
            </Text>
            <Text size="xl" fw={700} className="fred-dashboard-stats-value">
              127
            </Text>
            <Group gap="xs" mt="xs" className="fred-dashboard-stats-growth-group">
              <IconTrendingUp size={16} color="green" />
              <Text size="sm" c="green">
                +5 this month
              </Text>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="lg" className="fred-dashboard-stats-card">
            <Text size="sm" className="fred-dashboard-stats-label" mb="xs">
              Enterprise Clients
            </Text>
            <Text size="xl" fw={700} className="fred-dashboard-stats-value">
              23
            </Text>
            <Group gap="xs" mt="xs" className="fred-dashboard-stats-growth-group">
              <Text size="sm" c="blue">
                18% of total
              </Text>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="lg" className="fred-dashboard-stats-card">
            <Text size="sm" className="fred-dashboard-stats-label" mb="xs">
              Active Support Cases
            </Text>
            <Text size="xl" fw={700} className="fred-dashboard-stats-value">
              42
            </Text>
            <Group gap="xs" mt="xs" className="fred-dashboard-stats-growth-group">
              <Text size="sm" c="orange">
                12 high priority
              </Text>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="lg" className="fred-dashboard-stats-card">
            <Text size="sm" className="fred-dashboard-stats-label" mb="xs">
              Customer Satisfaction
            </Text>
            <Text size="xl" fw={700} className="fred-dashboard-stats-value">
              94%
            </Text>
            <Group gap="xs" mt="xs" className="fred-dashboard-stats-growth-group">
              <Text size="sm" c="green">
                +2% from last month
              </Text>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Customer Overview - Full Width */}
      <Card withBorder p="lg" className="fred-dashboard-overview-card">
        <Group justify="space-between" mb="md" className="fred-dashboard-overview-header-group">
          <Text fw={600} className="fred-dashboard-overview-title">
            Customer Overview
          </Text>
          <Group className="fred-dashboard-overview-filters-group">
            <Select
              data={['All Support Levels', 'Enterprise', 'Premium', 'Basic']}
              value={supportLevelFilter}
              onChange={(value) => setSupportLevelFilter(value || 'All Support Levels')}
              size="sm"
              className="fred-dashboard-overview-support-select"
            />
            <Select
              data={[
                'All Locations',
                'Data Center 3',
                'Branch Office',
                'HQ Building',
                'Creative Hub',
                'Medical Center',
              ]}
              value={locationFilter}
              onChange={(value) => setLocationFilter(value || 'All Locations')}
              size="sm"
              className="fred-dashboard-overview-location-select"
            />
          </Group>
        </Group>

        <DataTable
          columns={[
            {
              accessor: 'name',
              title: 'Customer',
              render: (customer) => (
                <Group gap="sm" className="fred-dashboard-customer-avatar-group">
                  <Avatar size="sm" color="indigo">
                    {customer.name.charAt(0)}
                  </Avatar>
                  <Text size="sm" fw={500} className="fred-dashboard-customer-name">
                    {customer.name}
                  </Text>
                </Group>
              ),
            },
            {
              accessor: 'contact',
              title: 'Contact',
              render: (customer) => (
                <Text className="fred-dashboard-customer-contact">{customer.contact}</Text>
              ),
            },
            {
              accessor: 'supportLevel',
              title: 'Support Level',
              render: (customer) => (
                <Badge
                  color={getSupportLevelColor(customer.supportLevel)}
                  size="sm"
                  className="fred-dashboard-customer-support-badge"
                >
                  {customer.supportLevel}
                </Badge>
              ),
            },
            {
              accessor: 'deviceCount',
              title: 'Devices',
              render: (customer) => (
                <Text size="sm" fw={500} className="fred-dashboard-customer-device-count">
                  {customer.deviceCount}
                </Text>
              ),
            },
            {
              accessor: 'location',
              title: 'Location',
              render: (customer) => (
                <Text size="sm" className="fred-dashboard-customer-location">
                  {customer.location}
                </Text>
              ),
            },
            {
              accessor: 'actions',
              title: 'Actions',
              render: (customer) => (
                <ActionIcon
                  variant="light"
                  size="sm"
                  onClick={() => handleCustomerView(customer)}
                  className="fred-dashboard-customer-view-icon"
                >
                  <IconEye size={14} />
                </ActionIcon>
              ),
            },
          ]}
          records={filteredCustomers}
          highlightOnHover
          borderRadius="md"
          withTableBorder
          striped
          verticalSpacing="md"
          page={activePage}
          onPageChange={setActivePage}
          recordsPerPage={10}
          totalRecords={filteredCustomers.length}
          className="fred-dashboard-overview-table"
        />
      </Card>

      {/* AI Console and Recent Activities */}
      <Grid className="fred-dashboard-metrics-grid">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder p="lg" className="fred-dashboard-activities-card">
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

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder p="lg" className="fred-dashboard-activities-card" h={480}>
            <Text fw={600} mb="md" className="fred-dashboard-activities-title">
              Recent Customer Activities
            </Text>
            <ScrollArea
              h={400}
              className="fred-dashboard-activities-scroll"
              styles={{
                scrollbar: {
                  '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
                    width: '6px',
                  },
                  '&[data-orientation="vertical"]': {
                    width: '8px',
                  },
                },
              }}
            >
              <Stack gap="md" className="fred-dashboard-activities-stack">
                {customerActivities.map((activity) => (
                  <Card
                    key={activity.id}
                    withBorder
                    p="sm"
                    className="fred-dashboard-activity-card"
                  >
                    <Group justify="space-between" mb="xs">
                      <Group gap="xs">
                        <Badge color={getActivityTypeColor(activity.type)} size="sm">
                          {activity.title}
                        </Badge>
                        <Badge
                          color={getPriorityColor(activity.priority)}
                          size="xs"
                          variant="light"
                        >
                          {activity.priority}
                        </Badge>
                      </Group>
                      <Text size="xs" className="fred-dashboard-activity-time">
                        {activity.time}
                      </Text>
                    </Group>

                    <Text size="sm" fw={500} mb="xs" className="fred-dashboard-activity-customer">
                      {activity.customer}
                    </Text>

                    <Text size="sm" mb="xs" className="fred-dashboard-activity-desc">
                      {activity.description}
                    </Text>

                    <Group justify="space-between">
                      <Text size="xs" c="dimmed" className="fred-dashboard-activity-status">
                        Status: {activity.status}
                      </Text>
                      {activity.assignedTo && (
                        <Text size="xs" c="dimmed" className="fred-dashboard-activity-assigned">
                          Assigned: {activity.assignedTo}
                        </Text>
                      )}
                      {activity.satisfaction && (
                        <Text size="xs" c="green" className="fred-dashboard-activity-satisfaction">
                          Rating: {activity.satisfaction}/5
                        </Text>
                      )}
                    </Group>
                  </Card>
                ))}
              </Stack>
            </ScrollArea>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Customer Detail Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={selectedCustomer ? `${selectedCustomer.name} - Customer Details` : ''}
        size="xl"
        className="fred-dashboard-modal"
      >
        {selectedCustomer && (
          <Stack gap="lg" className="fred-dashboard-modal-stack">
            <Grid className="fred-dashboard-modal-grid">
              <Grid.Col span={6}>
                <Stack gap="sm" className="fred-dashboard-modal-contact-stack">
                  <Text fw={600} className="fred-dashboard-modal-contact-title">
                    Contact Information
                  </Text>
                  <Group gap="sm" className="fred-dashboard-modal-contact-name-group">
                    <IconBuilding size={16} />
                    <Text size="sm" className="fred-dashboard-modal-contact-name">
                      {selectedCustomer.name}
                    </Text>
                  </Group>
                  <Group gap="sm" className="fred-dashboard-modal-contact-person-group">
                    <IconUsers size={16} />
                    <Text size="sm" className="fred-dashboard-modal-contact-person">
                      {selectedCustomer.contact}
                    </Text>
                  </Group>
                  <Group gap="sm" className="fred-dashboard-modal-contact-location-group">
                    <IconMapPin size={16} />
                    <Text size="sm" className="fred-dashboard-modal-contact-location">
                      {selectedCustomer.location}
                    </Text>
                  </Group>
                  <Group gap="sm" className="fred-dashboard-modal-contact-support-group">
                    <Text size="sm" className="fred-dashboard-modal-contact-support-label">
                      <strong>Support Level:</strong>
                    </Text>
                    <Badge
                      color={getSupportLevelColor(selectedCustomer.supportLevel)}
                      className="fred-dashboard-modal-contact-support-badge"
                    >
                      {selectedCustomer.supportLevel}
                    </Badge>
                  </Group>
                </Stack>
              </Grid.Col>

              <Grid.Col span={6}>
                <Stack gap="sm" className="fred-dashboard-modal-account-stack">
                  <Text fw={600} className="fred-dashboard-modal-account-title">
                    Account Overview
                  </Text>
                  <Text size="sm" className="fred-dashboard-modal-account-device-count">
                    <strong>Device Count:</strong> {selectedCustomer.deviceCount}
                  </Text>
                  <Text size="sm" className="fred-dashboard-modal-account-manager">
                    <strong>Account Manager:</strong> Fred Johnson
                  </Text>
                  <Text size="sm" className="fred-dashboard-modal-account-contract-start">
                    <strong>Contract Start:</strong> Jan 2023
                  </Text>
                  <Text size="sm" className="fred-dashboard-modal-account-next-review">
                    <strong>Next Review:</strong> Dec 2024
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>

            <Tabs
              value={activeTab}
              onChange={(value) => setActiveTab(value || 'overview')}
              className="fred-dashboard-modal-tabs"
            >
              <Tabs.List>
                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                <Tabs.Tab value="devices">Devices</Tabs.Tab>
                <Tabs.Tab value="support">Support History</Tabs.Tab>
                <Tabs.Tab value="billing">Billing</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="overview">
                <Stack gap="lg" pt="lg" className="fred-dashboard-modal-overview-stack">
                  <Grid className="fred-dashboard-modal-overview-grid">
                    <Grid.Col span={6}>
                      <Card withBorder p="md" className="fred-dashboard-modal-overview-health-card">
                        <Text
                          fw={600}
                          mb="md"
                          className="fred-dashboard-modal-overview-health-title"
                        >
                          Health Summary
                        </Text>
                        <Stack gap="sm" className="fred-dashboard-modal-overview-health-stack">
                          <div className="fred-dashboard-modal-overview-health-item">
                            <Group justify="space-between" mb="xs">
                              <Text
                                size="sm"
                                className="fred-dashboard-modal-overview-health-label"
                              >
                                Overall Health
                              </Text>
                              <Text
                                size="sm"
                                fw={500}
                                className="fred-dashboard-modal-overview-health-value"
                              >
                                87%
                              </Text>
                            </Group>
                            <Progress
                              value={87}
                              color="green"
                              className="fred-dashboard-modal-overview-health-progress"
                            />
                          </div>

                          <div className="fred-dashboard-modal-overview-health-item">
                            <Group justify="space-between" mb="xs">
                              <Text
                                size="sm"
                                className="fred-dashboard-modal-overview-health-label"
                              >
                                High Risk Devices
                              </Text>
                              <Text
                                size="sm"
                                fw={500}
                                className="fred-dashboard-modal-overview-health-value"
                              >
                                2 of {selectedCustomer.deviceCount}
                              </Text>
                            </Group>
                            <Progress
                              value={(2 / selectedCustomer.deviceCount) * 100}
                              color="red"
                              className="fred-dashboard-modal-overview-health-progress"
                            />
                          </div>
                        </Stack>
                      </Card>
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Card
                        withBorder
                        p="md"
                        className="fred-dashboard-modal-overview-support-card"
                      >
                        <Text
                          fw={600}
                          mb="md"
                          className="fred-dashboard-modal-overview-support-title"
                        >
                          Support Stats
                        </Text>
                        <Stack gap="xs" className="fred-dashboard-modal-overview-support-stack">
                          <Group justify="space-between">
                            <Text size="sm" className="fred-dashboard-modal-overview-support-label">
                              Open Cases
                            </Text>
                            <Text
                              size="sm"
                              fw={500}
                              className="fred-dashboard-modal-overview-support-value"
                            >
                              3
                            </Text>
                          </Group>
                          <Group justify="space-between">
                            <Text size="sm" className="fred-dashboard-modal-overview-support-label">
                              Resolved This Month
                            </Text>
                            <Text
                              size="sm"
                              fw={500}
                              className="fred-dashboard-modal-overview-support-value"
                            >
                              12
                            </Text>
                          </Group>
                          <Group justify="space-between">
                            <Text size="sm" className="fred-dashboard-modal-overview-support-label">
                              Avg Response Time
                            </Text>
                            <Text
                              size="sm"
                              fw={500}
                              className="fred-dashboard-modal-overview-support-value"
                            >
                              45 min
                            </Text>
                          </Group>
                          <Group justify="space-between">
                            <Text size="sm" className="fred-dashboard-modal-overview-support-label">
                              Satisfaction Rating
                            </Text>
                            <Text
                              size="sm"
                              fw={500}
                              className="fred-dashboard-modal-overview-support-value"
                            >
                              4.8/5.0
                            </Text>
                          </Group>
                        </Stack>
                      </Card>
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="devices">
                <Stack gap="lg" pt="lg" className="fred-dashboard-modal-devices-stack">
                  <Text className="fred-dashboard-modal-devices-desc">
                    Device inventory and health status for this customer would be displayed here.
                  </Text>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="support">
                <Stack gap="lg" pt="lg" className="fred-dashboard-modal-support-stack">
                  <Text className="fred-dashboard-modal-support-desc">
                    Support case history and resolution details would be shown here.
                  </Text>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="billing">
                <Stack gap="lg" pt="lg" className="fred-dashboard-modal-billing-stack">
                  <Text className="fred-dashboard-modal-billing-desc">
                    Billing information and contract details would be displayed here.
                  </Text>
                </Stack>
              </Tabs.Panel>
            </Tabs>

            <Group justify="flex-end" gap="md" className="fred-dashboard-modal-actions-group">
              <Button
                variant="outline"
                leftSection={<IconPhone size={16} />}
                className="fred-dashboard-modal-call-btn"
              >
                Call Customer
              </Button>
              <Button
                variant="outline"
                leftSection={<IconMail size={16} />}
                className="fred-dashboard-modal-email-btn"
              >
                Send Email
              </Button>
              <Button className="fred-dashboard-modal-review-btn">Schedule Review</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
};

export default FredDashboard;
