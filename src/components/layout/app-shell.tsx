import { useState } from 'react';
import { IconBell, IconChevronDown, IconLogout } from '@tabler/icons-react';
import clsx from 'clsx';
import {
  ActionIcon,
  AppShell,
  Avatar,
  Group,
  Menu,
  Text,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import { ActionToggle } from '@/components/action-toggle/action-toggle';
import { Navbar } from './navbar';
import classes from './navbar.module.css';

export function AuthenticatedAppShell({ children }: { children: React.ReactNode }) {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  // const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  // const orgIdForLocaleProvider = acessControls ? acessControls.orgId : null;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm' }}
      padding="md"
      data-testid="layouts-authenticated-app-shell"
    >
      <AppShell.Header
        className={classes.headerNav}
        data-testid="layouts-authenticated-app-shell-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
          height: 60,
        }}
      >
        {/* Left section - logo or app name */}
        <Group
          h="100%"
          wrap="nowrap"
          data-testid="layouts-authenticated-app-shell-header-logo-group"
        >
          {/* Optional: Add logo or name */}
          <Text fw={700} fz="lg">
            AI Agent Dashboard
          </Text>
        </Group>

        {/* Right section - theme toggle and notification */}
        <Group h="100%">
          <Tooltip
            label={colorScheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            position="bottom"
            color="gray"
            data-testid="layouts-authenticated-app-shell-theme-toggle-tooltip"
          >
            <ActionIcon
              data-testid="layouts-authenticated-app-shell-theme-toggle-icon-action-icon"
              variant="subtle"
              size="lg"
              c="light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-2))"
            >
              <ActionToggle data-testid="layouts-authenticated-app-shell-action-toggle" />
            </ActionIcon>
          </Tooltip>

          <ActionIcon variant="subtle" size="lg">
            <IconBell
              style={{ width: '70%', height: '70%' }}
              stroke={1.5}
              data-testid="layouts-authenticated-app-shell-bell-icon"
            />
          </ActionIcon>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        style={{
          borderInlineEnd: 'none',
        }}
        w="60px"
      >
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main className={clsx(classes.mainContent, classes.mainContentWithSidebar)}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
