import React, { useEffect, useState } from 'react';
import {
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
  Pagination,
  Progress,
  ScrollArea,
  Select,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { Ticket } from '../../data/dummyData';

interface TinaDashboardProps {
  data: any;
}

const TinaDashboard: React.FC<TinaDashboardProps> = ({ data }) => {
  const [opened, { open }] = useDisclosure(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>('All Priorities');
  const [warrantyFilter, setWarrantyFilter] = useState<string>('All Warranty');
  const [activePage, setActivePage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>('disk-crash');
  const [agentErrors, setAgentErrors] = useState([
    { time: '14:22:18', message: 'Agent service timeout on device 82f7d9e5a3c2' },
  ]);

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
          message: 'Simulated error while assigning ticket to Fred.',
        },
      ]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredTickets = data.tickets.filter(
    (ticket) =>
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
          <Card withBorder p="lg" h="600" style={{ display: 'flex', flexDirection: 'column' }}>
            <Group justify="space-between" mb="md">
              <Text fw={600}>Live Ticket Events</Text>
              <Badge color="green" variant="light">
                Live
              </Badge>
            </Group>
            <ScrollArea style={{ flex: 1 }}>
              <Stack gap="md">
                {/* Example cards, replace with real data */}
                <Card withBorder p="sm">
                  <Group justify="space-between">
                    <Text size="sm">Just now</Text>
                    <Badge color="blue" size="xs">
                      New
                    </Badge>
                  </Group>
                  <Text size="sm" fw={500}>
                    Server #SRV-2245 reported disk errors
                  </Text>
                  <Text size="xs" c="dimmed">
                    Acme Corp. - Data Center 3
                  </Text>
                </Card>
              </Stack>
            </ScrollArea>

            <Card withBorder mt="md" p="sm" h={180} style={{ overflowY: 'auto' }}>
              <Text fw={600} mb="sm">
                Agent Error Console
              </Text>
              <Stack gap="xs">
                {agentErrors.map((err, idx) => (
                  <Text key={idx} size="xs" c="red">
                    [{err.time}] {err.message}
                  </Text>
                ))}
              </Stack>
            </Card>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder p="lg">
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
                { accessor: 'id', title: 'ID' },
                { accessor: 'device', title: 'Device' },
                { accessor: 'customer', title: 'Customer' },
                { accessor: 'issue', title: 'Issue' },
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
                    <ActionIcon onClick={() => handleTicketView(r)} variant="light" size="sm">
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
              page={activePage}
              onPageChange={setActivePage}
              recordsPerPage={7}
              totalRecords={filteredTickets.length}
            />
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default TinaDashboard;
