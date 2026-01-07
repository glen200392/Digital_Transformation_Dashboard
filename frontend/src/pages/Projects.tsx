import { useState } from 'react';
import { Table, Button, Tag, Space, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const mockData = [
    {
      key: '1',
      name: 'AI工具推廣專案',
      category: 'AI Tools',
      status: 'in_progress',
      progress: 75,
      priority: 'high',
    },
    {
      key: '2',
      name: 'HR系統整合',
      category: 'HR Collaboration',
      status: 'in_progress',
      progress: 60,
      priority: 'medium',
    },
    {
      key: '3',
      name: 'AI治理框架建立',
      category: 'AI Governance',
      status: 'planning',
      progress: 20,
      priority: 'critical',
    },
  ];

  const columns = [
    { title: '專案名稱', dataIndex: 'name', key: 'name' },
    { title: '類別', dataIndex: 'category', key: 'category' },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          planning: 'blue',
          in_progress: 'green',
          completed: 'default',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    { title: '進度', dataIndex: 'progress', key: 'progress', render: (progress: number) => `${progress}%` },
    {
      title: '優先級',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const colorMap: Record<string, string> = {
          low: 'default',
          medium: 'blue',
          high: 'orange',
          critical: 'red',
        };
        return <Tag color={colorMap[priority]}>{priority.toUpperCase()}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/projects/${record.key}`)}>
            查看
          </Button>
          <Button type="link">編輯</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1>專案管理</h1>
        <Button type="primary" icon={<PlusOutlined />}>
          新增專案
        </Button>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Input
          placeholder="搜尋專案..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: '300px' }}
        />
      </div>
      <Table columns={columns} dataSource={mockData} />
    </div>
  );
};

export default Projects;
