import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import FredDashboard from './components/dashboards/FredDashboard';
import RahulDashboard from './components/dashboards/RahulDashboard';
import TinaDashboard from './components/dashboards/TinaDashboard';
import { dummyData } from './data/dummyData';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RahulDashboard data={dummyData} />,
  },
  {
    path: '/tina',
    element: <TinaDashboard data={dummyData} />,
  },
  {
    path: '/fred',
    element: <FredDashboard data={dummyData} />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
