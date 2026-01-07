import { List, Tag, Button } from 'antd';
import { WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';

const Alerts = () => {
  const mockAlerts = [
    {
      id: 1,
      type: 'deadline_warning',
      title: '專案即將到期',
      message: 'HR系統整合專案將於7天後到期',
      severity: 'warning',
      date: '2026-01-07',
    },
    {
      id: 2,
      type: 'budget_exceeded',
      title: '預算超支警告',
      message: 'AI工具推廣專案預算使用率已達95%',
      severity: 'error',
      date: '2026-01-06',
    },
    {
      id: 3,
      type: 'status_change',
      title: '專案狀態變更',
      message: 'IT系統升級專案已進入測試階段',
      severity: 'info',
      date: '2026-01-05',
    },
  ];

  return (
    <div>
      <h1>預警中心</h1>
      <List
        dataSource={mockAlerts}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button type="link">查看</Button>,
              <Button type="link">標記已讀</Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                item.severity === 'error' ? (
                  <WarningOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
                ) : (
                  <InfoCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                )
              }
              title={
                <>
                  {item.title}
                  <Tag color={item.severity === 'error' ? 'red' : 'orange'} style={{ marginLeft: '8px' }}>
                    {item.severity.toUpperCase()}
                  </Tag>
                </>
              }
              description={
                <>
                  <div>{item.message}</div>
                  <div style={{ marginTop: '8px', color: '#999' }}>{item.date}</div>
                </>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Alerts;
