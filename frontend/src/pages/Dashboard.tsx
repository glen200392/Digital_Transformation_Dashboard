import { Card, Row, Col, Statistic, Progress } from 'antd';
import {
  ProjectOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const Dashboard = () => {
  return (
    <div>
      <h1>數位轉型儀表板</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="總專案數"
              value={50}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="進行中專案"
              value={32}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="高風險專案"
              value={5}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="團隊成員"
              value={5}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={12}>
          <Card title="整體進度">
            <Progress percent={68} status="active" />
            <div style={{ marginTop: '16px' }}>
              <p>已完成任務: 682 / 1000</p>
              <p>預計完成時間: 2026年Q2</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="最新動態">
            <div>
              <p>• 專案 "AI工具推廣" 已進入測試階段</p>
              <p>• 專案 "HR系統整合" 即將到期</p>
              <p>• 新增 3 個高優先級任務</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
