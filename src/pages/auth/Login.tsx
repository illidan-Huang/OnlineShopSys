import { Row, Col, Card, Form, Input, Button, message, Flex } from "antd";
import Logo from "../../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";

function Login() {
  const [form] = Form.useForm();
  const auth = useContext(AuthContext);

  const { login } = auth;
  const navigate = useNavigate();
  return (
    <>
      <Row>
        <Col span={8} push={8}>
          <img
            src={Logo}
            style={{ width: "200px", display: "block", margin: "20px auto" }}
          />
          <Card
            title={
              <div style={{ textAlign: "center", fontSize: "20px" }}>
                OnlineShopSys
              </div>
            }
          >
            <Form
              form={form}
              labelCol={{
                xs: { span: 24 },
                sm: { span: 10 },
                md: { span: 8 },
                lg: { span: 5 },
                xl: { span: 5 },
              }}
              onFinish={async (data) => {
                console.log(data);
                const res = await login(data);
                console.log("res", res);
                let info: any = {};
                if (res) {
                  info = {
                    data: "tokenMessage",
                    message: "登陆成功",
                    success: true,
                  };
                  navigate("/dashboard");
                } else {
                  info = {
                    data: "",
                    message: "账号密码错误",
                    success: false,
                  };
                }
                if (info.success) {
                  message.success("登陆成功");
                } else {
                  message.error(info.message);
                }
              }}
            >
              <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: "请输入用户名" }]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password placeholder="请输入密码" />
              </Form.Item>
              <Flex gap="middle" justify="center">
                <Form.Item>
                  <Button
                    htmlType="submit"
                    type="primary"
                    style={{
                      width: "100px",
                    }}
                  >
                    登录
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType="reset"
                    style={{
                      width: "100px",
                    }}
                    onClick={() => {
                      form.resetFields();
                    }}
                  >
                    重置
                  </Button>
                </Form.Item>
              </Flex>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Login;
