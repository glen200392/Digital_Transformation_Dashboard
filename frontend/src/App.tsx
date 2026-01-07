/**
 * Main Application Component
 * Sets up routing, providers, and global layout
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider, theme, App as AntApp } from 'antd';
import zhTW from 'antd/locale/zh_TW';
import { useAppStore } from './store/useAppStore';
import MainLayout from './components/Layout/MainLayout';

// Pages (to be implemented)
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import AIGovernance from './pages/AIGovernance';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

import './styles/global.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { uiState } = useAppStore();

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={zhTW}
        theme={{
          algorithm:
            uiState.theme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
            fontSize: 14,
          },
          components: {
            Layout: {
              headerBg: uiState.theme === 'dark' ? '#001529' : '#ffffff',
              siderBg: uiState.theme === 'dark' ? '#001529' : '#ffffff',
            },
          },
        }}
      >
        <AntApp>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:id" element={<ProjectDetail />} />
                <Route path="ai-governance" element={<AIGovernance />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
