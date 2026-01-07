import { Card, Row, Col, List, Tag } from 'antd';

const AIGovernance = () => {
  const mockLogs = [
    { id: 1, feature: 'AI報告生成', user: '張三', cost: 0.05, date: '2026-01-07' },
    { id: 2, feature: '風險預測', user: '李四', cost: 0.03, date: '2026-01-06' },
    { id: 3, feature: '智能推薦', user: '王五', cost: 0.02, date: '2026-01-05' },
  ];

  return (
    <div>
      <h1>AI治理中心</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="AI使用統計">
            <p>本月調用次數: 156</p>
            <p>總費用: $8.52</p>
            <p>活躍用戶: 5</p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="配置的AI服務">
            <Tag color="blue">OpenAI GPT-4</Tag>
            <Tag color="green">Claude 3</Tag>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="合規狀態">
            <p>✓ 數據隱私合規</p>
            <p>✓ 使用限制設定</p>
            <p>✓ 審計日誌啟用</p>
          </Card>
        </Col>
      </Row>
      <Card title="AI使用記錄" style={{ marginTop: '16px' }}>
        <List
          dataSource={mockLogs}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.feature}
                description={`使用者: ${item.user} | 費用: $${item.cost} | 日期: ${item.date}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default AIGovernance;
