import React, { useEffect, useState } from 'react';
import {
  IconBell,
  IconBrain,
  IconCheck,
  IconCopy,
  IconEye,
  IconMail,
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
  Flex,
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
import { showNotification } from '@mantine/notifications';
import { mockCustomers } from '../../data/mockDataO';

interface FredDashboardProps {}

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

const FredDashboard: React.FC<FredDashboardProps> = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [locationFilter, setLocationFilter] = useState<string>('All Locations');
  const [activePage, setActivePage] = useState(1);
  const [agentErrors, setAgentErrors] = useState([
    {
      time: '14:22:18',
      message: 'Agent service timeout on device 82f7d9e5a3c2',
      customer_id: 'CUST001',
      ticket_id: 'TICK1001',
    },
    {
      time: '14:21:45',
      message: 'Failed to analyze telemetry for device a3b2c1d4e5f6',
      customer_id: 'CUST002',
      ticket_id: 'TICK1002',
    },
    {
      time: '14:21:12',
      message: 'Connection lost to monitoring service',
      customer_id: 'CUST003',
      ticket_id: 'TICK1003',
    },
    {
      time: '14:20:58',
      message: 'Disk prediction model inference timeout',
      customer_id: 'CUST004',
      ticket_id: 'TICK1004',
    },
    {
      time: '14:20:33',
      message: 'Unable to create ticket for device 7f8e9d0c1b2a',
      customer_id: 'CUST005',
      ticket_id: 'TICK1005',
    },
  ]);

  // State to track copied fields for check icon feedback
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [key]: false }));
    }, 1500);
  };

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
          customer_id: '',
          ticket_id: '',
        },
      ]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCustomerView = (customer: any) => {
    setSelectedCustomer(customer);
    open();
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

  // Map mockCustomers to the structure expected by the table (no ticket_id)
  const expandedCustomers = mockCustomers.map((cust) => ({
    id: cust.customer_id,
    name: cust.customer_name,
    email: cust.customer_email,
    phone: cust.customer_phone,
    location: `${cust.customer_location_state}, ${cust.customer_location_country}`,
    customer_id: cust.customer_id,
  }));

  // Get unique locations for the filter
  const locationOptions = [
    'All Locations',
    ...Array.from(new Set(expandedCustomers.map((c) => c.location))).sort(),
  ];

  const filteredCustomers = expandedCustomers.filter((customer) => {
    return locationFilter === 'All Locations' || customer.location === locationFilter;
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
          <Flex gap="xs">
            <Button
              leftSection={<IconPhone size={16} />}
              onClick={() =>
                showNotification({
                  title: 'Schedule Call',
                  message: 'Schedule call feature coming soon!',
                  color: 'blue',
                  icon: <IconPhone size={16} />,
                })
              }
              variant="outline"
              size="sm"
              style={{ marginLeft: 8 }}
            >
              Schedule Call
            </Button>
            <Group className="fred-dashboard-overview-filters-group">
              <Select
                data={locationOptions}
                value={locationFilter}
                onChange={(value) => setLocationFilter(value || 'All Locations')}
                size="sm"
                searchable
                className="fred-dashboard-overview-location-select"
                placeholder="Filter by Location"
              />
            </Group>
          </Flex>
        </Group>

        <DataTable
          columns={[
            {
              accessor: 'name',
              title: 'Customer',
              render: (customer) => (
                <Group gap="xs" className="fred-dashboard-customer-avatar-group">
                  <Avatar size="sm" color="indigo">
                    {customer.name.charAt(0)}
                  </Avatar>
                  <Text size="sm" fw={500} className="fred-dashboard-customer-name">
                    {customer.name}
                  </Text>
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    onClick={() => handleCopy(`table-id-${customer.id}`, customer.customer_id)}
                    title="Copy Customer ID"
                  >
                    {copied[`table-id-${customer.id}`] ? (
                      <IconCheck size={14} color="green" />
                    ) : (
                      <IconCopy size={14} />
                    )}
                  </ActionIcon>
                  <Text size="xs" c="dimmed">
                    ID: {customer.customer_id}
                  </Text>
                </Group>
              ),
            },
            {
              accessor: 'email',
              title: 'Email',
              render: (customer) => (
                <Group gap={4}>
                  <Text size="sm">{customer.email}</Text>
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    onClick={() => handleCopy(`table-email-${customer.id}`, customer.email)}
                    title="Copy Email"
                  >
                    {copied[`table-email-${customer.id}`] ? (
                      <IconCheck size={14} color="green" />
                    ) : (
                      <IconCopy size={14} />
                    )}
                  </ActionIcon>
                </Group>
              ),
            },
            {
              accessor: 'phone',
              title: 'Phone',
              render: (customer) => (
                <Group gap={4}>
                  <Text size="sm">{customer.phone}</Text>
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    onClick={() => handleCopy(`table-phone-${customer.id}`, customer.phone)}
                    title="Copy Phone"
                  >
                    {copied[`table-phone-${customer.id}`] ? (
                      <IconCheck size={14} color="green" />
                    ) : (
                      <IconCopy size={14} />
                    )}
                  </ActionIcon>
                </Group>
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
                <Group gap={2}>
                  <ActionIcon
                    variant="light"
                    size="sm"
                    onClick={() => handleCustomerView(customer)}
                    className="fred-dashboard-customer-view-icon"
                    title="View Details"
                  >
                    <IconEye size={14} />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    component="a"
                    href={`mailto:${customer.email}`}
                    title="Send Email"
                  >
                    <IconMail size={14} />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    component="a"
                    href={`tel:${customer.phone}`}
                    title="Call Customer"
                  >
                    <IconPhone size={14} />
                  </ActionIcon>
                </Group>
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
                <Text fw={600}>AI Agent Error Console</Text>
              </Group>
              <Badge color="blue" variant="light">
                Live
              </Badge>
            </Group>
            <ScrollArea h={400}>
              <Stack gap="md" className="fred-dashboard-activities-stack">
                {agentErrors.map((notification, idx) => (
                  <Card key={idx} withBorder p="sm" className="fred-dashboard-activity-card">
                    <Group justify="space-between" mb="xs">
                      <Group gap="xs">
                        <Badge color="red" size="sm">
                          Error
                        </Badge>
                        <Text size="xs" c="dimmed">
                          {notification.time}
                        </Text>
                      </Group>
                      <Group gap={2}>
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          onClick={() => {
                            const text = `Customer ID: ${notification.customer_id}\nTicket ID: ${notification.ticket_id}`;
                            handleCopy(`error-msg-${idx}`, text);
                          }}
                          title="Copy Customer & Ticket ID"
                        >
                          {copied[`error-msg-${idx}`] ? (
                            <IconCheck size={14} color="blue" />
                          ) : (
                            <IconCopy size={14} color="blue" />
                          )}
                        </ActionIcon>
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          onClick={() =>
                            showNotification({
                              title: 'Notify Customer',
                              message: 'Manual customer notification triggered.',
                              color: 'orange',
                              icon: <IconBell size={14} />,
                            })
                          }
                          title="Notify Customer"
                        >
                          <IconBell size={14} />
                        </ActionIcon>
                      </Group>
                    </Group>
                    <Text size="sm" fw={500} mb="xs">
                      {notification.message}
                    </Text>
                  </Card>
                ))}
              </Stack>
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
                    Customer Information
                  </Text>
                  <Group gap="xs" align="center">
                    <Text size="sm" fw={500}>
                      {selectedCustomer.name}
                    </Text>
                    <ActionIcon
                      size="xs"
                      variant="subtle"
                      onClick={() =>
                        handleCopy(
                          `modal-id-${selectedCustomer.customer_id}`,
                          selectedCustomer.customer_id
                        )
                      }
                      title="Copy Customer ID"
                    >
                      {copied[`modal-id-${selectedCustomer.customer_id}`] ? (
                        <IconCheck size={14} color="green" />
                      ) : (
                        <IconCopy size={14} />
                      )}
                    </ActionIcon>
                    <Text size="xs" c="dimmed">
                      ID: {selectedCustomer.customer_id}
                    </Text>
                  </Group>
                  <Group gap="xs" align="center">
                    <Text size="sm">Email: {selectedCustomer.email}</Text>
                    <ActionIcon
                      size="xs"
                      variant="subtle"
                      onClick={() =>
                        handleCopy(
                          `modal-email-${selectedCustomer.customer_id}`,
                          selectedCustomer.email
                        )
                      }
                      title="Copy Email"
                    >
                      {copied[`modal-email-${selectedCustomer.customer_id}`] ? (
                        <IconCheck size={14} color="green" />
                      ) : (
                        <IconCopy size={14} />
                      )}
                    </ActionIcon>
                  </Group>
                  <Group gap="xs" align="center">
                    <Text size="sm">Phone: {selectedCustomer.phone}</Text>
                  </Group>
                  <Group gap="xs" align="center">
                    <Text size="sm">Location: {selectedCustomer.location}</Text>
                  </Group>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack gap="sm" className="fred-dashboard-modal-account-stack">
                  <Text fw={600} className="fred-dashboard-modal-account-title">
                    Account Details
                  </Text>
                  <Text size="sm">
                    <strong>Created At:</strong> {selectedCustomer.created_at}
                  </Text>
                  <Text size="sm">
                    <strong>Updated At:</strong> {selectedCustomer.updated_at}
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
