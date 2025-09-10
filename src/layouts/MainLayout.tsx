import { useContext, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  MessageOutlined,
  CustomerServiceOutlined,
  FormOutlined,
  ShopOutlined,
  DownloadOutlined,
  FileExclamationOutlined,
  RobotOutlined,
  LineOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
  Dropdown,
  message,
  Flex,
  Breadcrumb,
  Input,
  Space,
  Row,
  Col,
} from "antd";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../store/AuthProvider";

const { Header, Sider, Content } = Layout;
/**
 * 从data数据源中查找符合key的项（本案用于从siderData中查找与location.pathname一致的项）
 * @param key 查找项
 * @param data 数据源
 * @returns 符合项的数组
 */
const findSiderData = (key: string, data: Array<any>) => {
  const res: string[] = [];
  // 用递归查找形参key包含的data中item.key，添加到res数组中
  const find = (arr: Array<any>) => {
    arr.forEach((item: any) => {
      if (key.includes(item.key)) {
        res.push(item.key);
        if (item.children) {
          find(item.children);
        }
      }
    });
  };
  // 传入被查找的数据源
  find(data);
  return res;
};

// console.log('abc'.split('/'));

/**
 *
 * @param menu 加工原始menu的数据获取中英文对照表
 * @returns res对照表
 */
const getEngToCn = (menu: Array<any>) => {
  const res: any = { admin: "首页" };
  const handle = (menu: Array<any>) => {
    menu.forEach((item) => {
      const engKey = item.key.split("/").slice(-1);
      res[engKey] = item.label;
      if (item.children) {
        handle(item.children);
      }
    });
  };
  handle(menu);
  return res;
};

const MainLayout = ({ routes }: { routes: any }) => {
  const auth = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  // location中的pathname和search比较常用
  const location = useLocation();
  // 根据最新的routes加工为菜单数据源
  const siderData = routes
    .filter((item: any) => !item.hideInMenu)
    .map((item: any) => {
      if (item.children) {
        return {
          key: item.path,
          label: item.meta.title,
          icon: item.meta.icon,
          children: item.children.map((child: any) => {
            return {
              key: child.path,
              label: child.meta.title,
            };
          }),
        };
      }
      return {
        key: item.path,
        label: item.meta.title,
        icon: item.meta.icon,
      };
    });
  console.log(siderData);

  // 在刷新页面时，根据location.pathname查找之前被选中的sider的项，并用于menu的默认展开及选中
  const selectedSiderOption = findSiderData(location.pathname, siderData);
  // location对照中文表
  const engToCn = getEngToCn(siderData);
  // 将pathname分割，作为breadcrumb的数据
  const breadcrumbData = location.pathname
    .slice(1)
    .split("/")
    .map((item) => ({ title: engToCn[item] }));

  // 组件展示内容
  return (
    <Layout
      style={{
        maxWidth: "1440px",
        margin: "0px auto",
        height: "98vh",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          className="demo-logo-vertical"
          style={{ textAlign: "center", marginBottom: "10px" }}
        >
          {/* <img src={Logo} alt="Logo" className="logo" /> */}
          <ShopOutlined
            style={{
              fontSize: "50px",
              color: "white",
              display: "block",
              margin: "10px auto",
              marginTop: "20px",
            }}
          />
          <span className="title" style={{ color: "white" }}>
            OnlineShop
          </span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={selectedSiderOption}
          defaultSelectedKeys={selectedSiderOption}
          // 通过Menu组件的点击事件navigate不同的location
          onClick={({ key }) => {
            navigate(key);
          }}
          items={siderData}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            minWidth: "950px",
          }}
        >
          <Row align="middle">
            <Col span={2}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
            </Col>
            <Col span={5} style={{ display: "flex", alignItems: "center" }}>
              <Input.Search
                placeholder="请输入搜索关键字"
                onSearch={() => {
                  message.info("后补");
                }}
                style={{ marginRight: "10px" }}
              />
            </Col>
            <Col span={5}></Col>
            <Col span={4}>
              <Flex justify="space-around">
                <Space
                  align="center"
                  direction="vertical"
                  style={{ lineHeight: "10px" }}
                  className="header-menu-btn"
                >
                  <RobotOutlined />
                  管家
                </Space>
                <Space
                  align="center"
                  direction="vertical"
                  className="header-menu-btn"
                  style={{ lineHeight: "10px" }}
                >
                  <DownloadOutlined />
                  下载
                </Space>
                <Space
                  align="center"
                  direction="vertical"
                  className="header-menu-btn"
                  style={{ lineHeight: "10px" }}
                >
                  <FileExclamationOutlined />
                  规则
                </Space>
              </Flex>
            </Col>
            <Col span={1} style={{ display: "flex", justifyContent: "center" }}>
              <LineOutlined rotate={90} />
            </Col>
            <Col span={4}>
              <Flex justify="space-around">
                <Space
                  align="center"
                  direction="vertical"
                  className="header-menu-btn"
                  style={{ lineHeight: "10px" }}
                >
                  <MessageOutlined />
                  消息
                </Space>
                <Space
                  align="center"
                  direction="vertical"
                  className="header-menu-btn"
                  style={{ lineHeight: "10px" }}
                >
                  <FormOutlined />
                  反馈
                </Space>
                <Space
                  align="center"
                  direction="vertical"
                  className="header-menu-btn"
                  style={{ lineHeight: "10px" }}
                >
                  <CustomerServiceOutlined />
                  客服
                </Space>
              </Flex>
            </Col>
            <Col span={1} style={{ display: "flex", justifyContent: "center" }}>
              <LineOutlined rotate={90} />
            </Col>
            <Col span={2}>
              <div>
                <Dropdown
                  menu={{
                    items: [
                      { key: "userCenter", label: "个人中心" },
                      { key: "logOut", label: "退出" },
                    ],
                    onClick: ({ key }) => {
                      if (key === "logOut") {
                        navigate("/");
                        auth.logout();
                      } else message.info("后补");
                    },
                  }}
                  overlayStyle={{ marginTop: 4 }} // 可选：微调菜单与触发器的距离
                  placement="bottom"
                >
                  <span
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    管理员 <DownOutlined style={{ marginLeft: 4 }} />
                  </span>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minWidth: "950px",
            overflow: "auto",
          }}
        >
          {/* 面包屑 */}
          <Breadcrumb items={breadcrumbData} style={{ marginBottom: "20px" }} />
          {/* router中/admin的children展示内容 */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
