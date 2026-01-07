import { useParams } from 'react-router-dom';
import { Card, Descriptions, Progress, Tag, Tabs } from 'antd';

const ProjectDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>專案詳情 #{id}</h1>
      <Card style={{ marginBottom: '16px' }}>
        <Descriptions title="基本資訊" bordered>
          <Descriptions.Item label="專案名稱">AI工具推廣專案</Descriptions.Item>
          <Descriptions.Item label="狀態">
            <Tag color="green">進行中</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="優先級">
            <Tag color="orange">高</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="負責人">張經理</Descriptions.Item>
          <Descriptions.Item label="開始日期">2026-01-01</Descriptions.Item>
          <Descriptions.Item label="預計完成">2026-06-30</Descriptions.Item>
          <Descriptions.Item label="進度" span={3}>
            <Progress percent={75} status="active" />
          </Descriptions.Item>
          <Descriptions.Item label="描述" span={3}>
            推廣AI工具在企業內部的應用，提升工作效率和創新能力。
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Tabs
        items={[
          { key: '1', label: '任務列表', children: <div>任務列表內容...</div> },
          { key: '2', label: '里程碑', children: <div>里程碑內容...</div> },
          { key: '3', label: '風險管理', children: <div>風險管理內容...</div> },
          { key: '4', label: '團隊成員', children: <div>團隊成員內容...</div> },
        ]}
      />
    </div>
  );
};

export default ProjectDetail;
