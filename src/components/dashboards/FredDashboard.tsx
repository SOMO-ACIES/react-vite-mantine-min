import React, { useState } from 'react';
import {
  IconBuilding,
  IconEye,
  IconMail,
  IconMapPin,
  IconPhone,
  IconRefresh,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react';
import { PieChart } from '@mantine/charts';
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
  Table,
  Tabs,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { Customer } from '../../data/dummyData';

interface FredDashboardProps {
  data: any;
}

const FredDashboard: React.FC<FredDashboardProps> = ({ data }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

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

      {/* Customer Overview and Support Level Distribution */}
      <Grid className="fred-dashboard-overview-grid">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder p="lg" className="fred-dashboard-overview-card">
            <Group justify="space-between" mb="md" className="fred-dashboard-overview-header-group">
              <Text fw={600} className="fred-dashboard-overview-title">
                Customer Overview
              </Text>
              <Group className="fred-dashboard-overview-filters-group">
                <Select
                  data={['All Support Levels', 'Enterprise', 'Premium', 'Basic']}
                  defaultValue="All Support Levels"
                  size="sm"
                  className="fred-dashboard-overview-support-select"
                />
                <Select
                  data={['All Locations', 'Data Center 3', 'Branch Office', 'HQ']}
                  defaultValue="All Locations"
                  size="sm"
                  className="fred-dashboard-overview-location-select"
                />
              </Group>
            </Group>

            <Table
              highlightOnHover
              className="fred-dashboard-overview-table"
              styles={{
                tr: {
                  '&:hover': {
                    // backgroundColor will be handled by CSS
                  },
                },
              }}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Customer</Table.Th>
                  <Table.Th>Contact</Table.Th>
                  <Table.Th>Support Level</Table.Th>
                  <Table.Th>Devices</Table.Th>
                  <Table.Th>Location</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {expandedCustomers.map((customer: Customer) => (
                  <Table.Tr key={customer.id} className="fred-dashboard-customer-row">
                    <Table.Td>
                      <Group gap="sm" className="fred-dashboard-customer-avatar-group">
                        <Avatar size="sm" color="indigo">
                          {customer.name.charAt(0)}
                        </Avatar>
                        <Text size="sm" fw={500} className="fred-dashboard-customer-name">
                          {customer.name}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text className="fred-dashboard-customer-contact">{customer.contact}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getSupportLevelColor(customer.supportLevel)}
                        size="sm"
                        className="fred-dashboard-customer-support-badge"
                      >
                        {customer.supportLevel}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500} className="fred-dashboard-customer-device-count">
                        {customer.deviceCount}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" className="fred-dashboard-customer-location">
                        {customer.location}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        variant="light"
                        size="sm"
                        onClick={() => handleCustomerView(customer)}
                        className="fred-dashboard-customer-view-icon"
                      >
                        <IconEye size={14} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder p="lg" h="400" className="fred-dashboard-support-distribution-card">
            <Text fw={600} mb="md" className="fred-dashboard-support-distribution-title">
              Support Level Distribution
            </Text>
            <PieChart
              data={[
                { name: 'Enterprise', value: 23, color: '#8b5cf6' },
                { name: 'Premium', value: 45, color: '#3b82f6' },
                { name: 'Basic', value: 59, color: '#6b7280' },
              ]}
              withLabelsLine
              labelsPosition="outside"
              labelsType="percent"
              withTooltip
              size={200}
              className="fred-dashboard-support-distribution-pie"
            />

            <Stack gap="sm" mt="md" className="fred-dashboard-support-distribution-legend">
              <Group justify="space-between">
                <Group gap="xs">
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: '#8b5cf6',
                      borderRadius: '50%',
                    }}
                  />
                  <Text size="sm" className="fred-dashboard-support-distribution-label">
                    Enterprise
                  </Text>
                </Group>
                <Text size="sm" fw={500} className="fred-dashboard-support-distribution-value">
                  23
                </Text>
              </Group>
              <Group justify="space-between">
                <Group gap="xs">
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: '#3b82f6',
                      borderRadius: '50%',
                    }}
                  />
                  <Text size="sm" className="fred-dashboard-support-distribution-label">
                    Premium
                  </Text>
                </Group>
                <Text size="sm" fw={500} className="fred-dashboard-support-distribution-value">
                  45
                </Text>
              </Group>
              <Group justify="space-between">
                <Group gap="xs">
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: '#6b7280',
                      borderRadius: '50%',
                    }}
                  />
                  <Text size="sm" className="fred-dashboard-support-distribution-label">
                    Basic
                  </Text>
                </Group>
                <Text size="sm" fw={500} className="fred-dashboard-support-distribution-value">
                  59
                </Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Support Metrics and Recent Activities */}
      <Grid className="fred-dashboard-metrics-grid">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder p="lg" className="fred-dashboard-metrics-card">
            <Text fw={600} mb="md" className="fred-dashboard-metrics-title">
              Support Metrics
            </Text>
            <Stack gap="lg" className="fred-dashboard-metrics-stack">
              <div className="fred-dashboard-metrics-item">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" className="fred-dashboard-metrics-label">
                    Average Response Time
                  </Text>
                  <Text size="sm" fw={500} className="fred-dashboard-metrics-value">
                    1.2 hours
                  </Text>
                </Group>
                <Progress value={85} color="green" className="fred-dashboard-metrics-progress" />
                <Text
                  size="xs"
                  className="fred-dashboard-metrics-target"
                  mt="xs"
                >{`Target: <2 hours`}</Text>
              </div>

              <div className="fred-dashboard-metrics-item">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" className="fred-dashboard-metrics-label">
                    Case Resolution Rate
                  </Text>
                  <Text size="sm" fw={500} className="fred-dashboard-metrics-value">
                    94%
                  </Text>
                </Group>
                <Progress value={94} color="blue" className="fred-dashboard-metrics-progress" />
                <Text
                  size="xs"
                  className="fred-dashboard-metrics-target"
                  mt="xs"
                >{`Target: >90%`}</Text>
              </div>

              <div className="fred-dashboard-metrics-item">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" className="fred-dashboard-metrics-label">
                    Customer Satisfaction
                  </Text>
                  <Text size="sm" fw={500} className="fred-dashboard-metrics-value">
                    4.7/5.0
                  </Text>
                </Group>
                <Progress value={94} color="violet" className="fred-dashboard-metrics-progress" />
                <Text size="xs" className="fred-dashboard-metrics-target" mt="xs">
                  Based on 1,247 reviews
                </Text>
              </div>

              <div className="fred-dashboard-metrics-item">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" className="fred-dashboard-metrics-label">
                    First Contact Resolution
                  </Text>
                  <Text size="sm" fw={500} className="fred-dashboard-metrics-value">
                    78%
                  </Text>
                </Group>
                <Progress value={78} color="teal" className="fred-dashboard-metrics-progress" />
                <Text
                  size="xs"
                  className="fred-dashboard-metrics-target"
                  mt="xs"
                >{`Target: >75%`}</Text>
              </div>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder p="lg" className="fred-dashboard-activities-card">
            <Text fw={600} mb="md" className="fred-dashboard-activities-title">
              Recent Customer Activities
            </Text>
            <ScrollArea
              h={320}
              className="fred-dashboard-activities-scroll"
              styles={{
                scrollbar: {
                  '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
                    // backgroundColor will be handled by CSS
                    width: '6px',
                  },
                  '&[data-orientation="vertical"]': {
                    width: '8px',
                  },
                },
              }}
            >
              <Stack gap="md" className="fred-dashboard-activities-stack">
                <Card
                  withBorder
                  p="sm"
                  className="fred-dashboard-activity-card fred-dashboard-activity-resolved"
                >
                  <Group justify="space-between">
                    <Text size="sm" c="green" fw={500}>
                      Case Resolved
                    </Text>
                    <Text size="xs" className="fred-dashboard-activity-time">
                      5 min ago
                    </Text>
                  </Group>
                  <Text size="sm" className="fred-dashboard-activity-desc">
                    Acme Corp. - Storage issue resolved
                  </Text>
                  <Text size="xs" className="fred-dashboard-activity-satisfaction">
                    Customer satisfaction: 5/5
                  </Text>
                </Card>

                <Card
                  withBorder
                  p="sm"
                  className="fred-dashboard-activity-card fred-dashboard-activity-new"
                >
                  <Group justify="space-between">
                    <Text size="sm" c="blue" fw={500}>
                      New Case
                    </Text>
                    <Text size="xs" className="fred-dashboard-activity-time">
                      23 min ago
                    </Text>
                  </Group>
                  <Text size="sm" className="fred-dashboard-activity-desc">
                    Global Finance - Network connectivity issue
                  </Text>
                  <Text size="xs" className="fred-dashboard-activity-assigned">
                    Assigned to: Technical Support
                  </Text>
                </Card>

                <Card
                  withBorder
                  p="sm"
                  className="fred-dashboard-activity-card fred-dashboard-activity-escalation"
                >
                  <Group justify="space-between">
                    <Text size="sm" c="violet" fw={500}>
                      Escalation
                    </Text>
                    <Text size="xs" className="fred-dashboard-activity-time">
                      1 hour ago
                    </Text>
                  </Group>
                  <Text size="sm" className="fred-dashboard-activity-desc">
                    HealthCare Plus - Critical system outage
                  </Text>
                  <Text size="xs" className="fred-dashboard-activity-escalated">
                    Escalated to: Senior Engineering
                  </Text>
                </Card>

                <Card
                  withBorder
                  p="sm"
                  className="fred-dashboard-activity-card fred-dashboard-activity-followup"
                >
                  <Group justify="space-between">
                    <Text size="sm" c="orange" fw={500}>
                      Follow-up
                    </Text>
                    <Text size="xs" className="fred-dashboard-activity-time">
                      2 hours ago
                    </Text>
                  </Group>
                  <Text size="sm" className="fred-dashboard-activity-desc">
                    Design Studios - Post-maintenance check
                  </Text>
                  <Text size="xs" className="fred-dashboard-activity-scheduled">
                    Scheduled for: Tomorrow 2:00 PM
                  </Text>
                </Card>
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
