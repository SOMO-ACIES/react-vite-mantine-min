import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { AuthenticatedAppShell } from './components/layout/app-shell';
import { Router } from './Router';
import { theme } from './theme';

// import { RouterProvider } from 'react-router-dom';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <AuthenticatedAppShell>
        <Router />
      </AuthenticatedAppShell>
    </MantineProvider>
  );
}
