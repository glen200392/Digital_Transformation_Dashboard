import { Card, Form, Input, Switch, Button, Select, message } from 'antd';

const Settings = () => {
  const [form] = Form.useForm();

  const handleSave = () => {
    message.success('設定已儲存');
  };

  return (
    <div>
      <h1>系統設定</h1>
      <Card title="通知設定" style={{ marginBottom: '16px' }}>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label="郵件通知" name="emailNotif" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="平台通知" name="platformNotif" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="通知語言" name="language">
            <Select defaultValue="zh-TW">
              <Select.Option value="zh-TW">繁體中文</Select.Option>
              <Select.Option value="en">English</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>
      <Card title="AI設定" style={{ marginBottom: '16px' }}>
        <Form form={form} layout="vertical">
          <Form.Item label="啟用AI功能" name="aiEnabled" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="AI Provider" name="aiProvider">
            <Select placeholder="選擇AI服務商">
              <Select.Option value="openai">OpenAI</Select.Option>
              <Select.Option value="anthropic">Anthropic</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="API Key" name="apiKey">
            <Input.Password placeholder="輸入API密鑰" />
          </Form.Item>
        </Form>
      </Card>
      <Button type="primary" onClick={handleSave}>
        儲存設定
      </Button>
    </div>
  );
};

export default Settings;
