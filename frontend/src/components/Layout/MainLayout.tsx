import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Badge, Avatar, Dropdown } from 'antd';
import {
  DashboardOutlined,
  ProjectOutlined,
  RobotOutlined,
  BellOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../../store/useAppStore';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const alerts = useAppStore((state) => state.alerts);
  const unreadAlertsCount = alerts.filter((a) => !a.read).length;
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: '儀表板' },
    { key: '/projects', icon: <ProjectOutlined />, label: '專案管理' },
    { key: '/ai-governance', icon: <RobotOutlined />, label: 'AI治理' },
    {
      key: '/alerts',
      icon: <Badge count={unreadAlertsCount} offset={[10, 0]}><BellOutlined /></Badge>,
      label: '預警中心',
    },
    { key: '/settings', icon: <SettingOutlined />, label: '設定' },
  ];

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: '個人資料' },
    { key: 'logout', icon: <LogoutOutlined />, label: '登出', danger: true },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#1890ff',
        }}>
          {collapsed ? 'DT' : 'DT Dashboard'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header style={{
          padding: '0 24px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <div>
            {collapsed ? (
              <MenuUnfoldOutlined
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: '18px', cursor: 'pointer' }}
              />
            ) : (
              <MenuFoldOutlined
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: '18px', cursor: 'pointer' }}
              />
            )}
          </div>
          <div>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar
                style={{ cursor: 'pointer', backgroundColor: '#1890ff' }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '24px', padding: '24px', background: '#fff', minHeight: 'calc(100vh - 112px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
