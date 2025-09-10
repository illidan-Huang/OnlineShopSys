import {
  ClearOutlined,
  DeleteOutlined,
  EditOutlined,
  InfoCircleFilled,
  UpOutlined,
} from "@ant-design/icons";
import adLogo from "../../assets/advertisementLogo.png";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tabs,
} from "antd";
import { useEffect, useState } from "react";
import { del, get, patch } from "../../utils/request";

// 自定义一个将dayjs对象转换为固定格式的字符后再转为数字
const formatDateToOrderNum = (date: any) => {
  return parseInt(date.format("YYYYMMDDHHmm"), 10);
};

function Sold() {
  const [open, setOpen] = useState(true); //筛选项开关
  const [queryForm] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false); //modal开关
  const [pageSize, setPageSize] = useState({ page: 1, size: 5 }); //查询页码
  const [query, setQuery] = useState({}); //查询条件
  const [data, setData] = useState<any>([]); //表格数据
  const [currentId, setCurrentId] = useState(""); //当前Id
  const [total, setTotal] = useState(0); //总数据条目

  // 监听query
  useEffect(() => {
    get("/orders", { ...query, ...pageSize }).then((res: any) => {
      console.log(res);
      if (res.status === 200) {
        setData(res.data);
        setTotal(parseInt(res.headers["x-total-count"]));
      }
    });
  }, [query, pageSize]);
  // 监听isOpen
  useEffect(() => {
    // 关闭modal时，将currentId重置，并清空modalForm内容
    if (!modalOpen) {
      setCurrentId("");
      modalForm.resetFields();
    }
  }, [modalOpen]);

  return (
    <>
      {/* 广告 */}
      <a href="">
        <div
          style={{
            height: "50px", // 固定高度
            borderRadius: "10px",
            overflow: "hidden", // 超出隐藏
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f0f0f0", // 可选背景色
          }}
        >
          <img
            src={adLogo}
            style={{
              height: "100%", // 高度撑满容器
              width: "auto", // 宽度自适应
              objectFit: "cover", // 关键属性（实际会生效）
            }}
          />
        </div>
      </a>
      {/* 满意度调研 */}
      <div
        style={{
          height: "42px",
          backgroundColor: "rgba(61,127,255,0.06)",
          margin: "10px 0px",
          padding: "12px",
        }}
      >
        <InfoCircleFilled style={{ color: "#5584ff" }} />{" "}
        <span>已卖出宝贝满意度调研，请留下您的宝贵意见。</span>
        <a href="">
          <span style={{ color: "#5584ff" }} className="header-menu-btn">
            去反馈
          </span>
        </a>
      </div>
      {/* 订单快速查询 */}
      <Tabs
        items={[
          {
            key: "pendingPayment",
            label: "待付款",
          },
          {
            key: "pendingDelivery",
            label: "待发货",
          },
          {
            key: "1",
            label: "即将超时",
          },
          {
            key: "2",
            label: "发货已超时",
          },
          {
            key: "3",
            label: "已发货",
          },
          {
            key: "4",
            label: "退款中",
          },
          {
            key: "5",
            label: "待评价",
          },
          {
            key: "6",
            label: "已成功",
          },
          {
            key: "7",
            label: "已关闭",
          },
          {
            key: "8",
            label: "三个月内",
          },
        ]}
        onChange={(key) => {
          console.log(key);
          setQuery({ type: key });
        }}
      />
      {/* 订单精确查询 */}
      <Flex style={{ lineHeight: "33px" }}>
        <span>精确查询</span>
        <div style={{ paddingLeft: "20px" }}>
          <Input.Search
            allowClear
            placeholder="请输入订单编号/物流单号/商品id/买家昵称"
            style={{ width: "500px" }}
            onSearch={(value) => {
              if (value) {
                setQuery({ orderNum: value });
              } else {
                setQuery({});
              }
            }}
          />
        </div>
      </Flex>
      {/* 订单模糊查询 */}
      <Flex style={{ marginTop: "24px" }}>
        <span>搜索订单</span>
        <div style={{ paddingLeft: "20px" }}>
          <Form
            form={queryForm}
            onFinish={(value) => {
              if (value.dataRange && value.dataRange.length === 2) {
                const [start, end] = value.dataRange;
                // 加工dayjs对象格式，然后encodeURIComponent函数通过将特定字符的每个实例替换成代表字符的 UTF-8 编码
                value.dataRange = encodeURIComponent(
                  JSON.stringify([
                    formatDateToOrderNum(start),
                    formatDateToOrderNum(end),
                  ])
                );
              }
              console.log(value);
              setQuery({ ...value });
            }}
          >
            <Flex>
              <Form.Item name="type" className="formItem">
                <Select
                  prefix="订单状态"
                  allowClear
                  placeholder="请选择"
                  options={[
                    { value: "pendingPayment", label: "待付款" },
                    { value: "pendingDelivery", label: "待发货" },
                  ]}
                ></Select>
              </Form.Item>
              <Form.Item name="state" className="formItem">
                <Select
                  prefix="预售状态"
                  allowClear
                  placeholder="请选择"
                  options={[
                    { value: "notSure", label: "预付款已付未确认" },
                    { value: "sureButNoArrears", label: "已确认未付尾款" },
                    { value: "success", label: "预售成功" },
                  ]}
                ></Select>
              </Form.Item>
              <Form.Item name="after" className="formItem">
                <Select
                  prefix="售后服务"
                  allowClear
                  placeholder="请选择"
                  options={[
                    { value: "customerComplaint", label: "买家投诉" },
                    { value: "iComplaint", label: "我已投诉" },
                  ]}
                ></Select>
              </Form.Item>
            </Flex>
            <Flex style={{ display: open ? "flex" : "none" }}>
              <Form.Item name="dataRange">
                <DatePicker.RangePicker
                  // format="YYYY-MM-DD HH:mm"
                  style={{ width: "552px", marginRight: "14px" }}
                />
              </Form.Item>
              <Form.Item name="evaluate" className="formItem">
                <Select
                  prefix="评价状态"
                  allowClear
                  placeholder="请选择"
                  options={[
                    { value: "done", label: "对方已评" },
                    { value: "pending", label: "对方未评" },
                  ]}
                ></Select>
              </Form.Item>
            </Flex>
            <Flex>
              <Button htmlType="submit" type="primary">
                搜索订单
              </Button>
              <div
                style={{
                  lineHeight: "32px",
                  marginLeft: "20px",
                  color: "#00000073",
                }}
                onClick={() => {
                  setOpen(!open);
                }}
                className="header-menu-btn"
              >
                <UpOutlined />
                收起筛选项
              </div>
              <div
                style={{
                  lineHeight: "32px",
                  marginLeft: "20px",
                  color: "#00000073",
                }}
                onClick={() => {
                  queryForm.resetFields();
                }}
                className="header-menu-btn"
              >
                <ClearOutlined />
                清除筛选条件
              </div>
            </Flex>
          </Form>
        </div>
      </Flex>
      {/* 展示订单 */}
      <div style={{ marginTop: "20px" }}>
        共查询到{" "}
        <span style={{ color: "#3d7fff", fontWeight: "bold" }}>{total}</span>{" "}
        个订单
      </div>
      <Table
        columns={[
          {
            title: "订单号",
            width: "200px",
            dataIndex: "orderNum",
          },
          { title: "单价", dataIndex: "price", width: "80px" },
          {
            title: "数量",
            width: "80px",
            dataIndex: "num",
          },
          { title: "交易状态", dataIndex: "state" },
          { title: "售后状态", dataIndex: "after" },
          { title: "实收款", dataIndex: "paymentReceived" },
          {
            title: "操作",
            width: "120px",
            render(_, r: any) {
              return (
                <Space>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setModalOpen(true);
                      setCurrentId(r.id);
                      modalForm.setFieldsValue(r);
                    }}
                  ></Button>
                  <Popconfirm
                    title="确认删除此项？"
                    onConfirm={async () => {
                      await del("/orders/" + r.id);
                      setQuery((pre) => ({ ...pre }));
                    }}
                  >
                    <Button
                      type="primary"
                      icon={<DeleteOutlined />}
                      danger
                    ></Button>
                  </Popconfirm>
                </Space>
              );
            },
          },
        ]}
        dataSource={data}
        rowKey="id"
        pagination={{
          pageSize: pageSize.size,
          current: pageSize.page,
          total: total,
          onChange: (page, size) =>
            setPageSize((prev) => ({ ...prev, page, size })),
        }}
      />
      {/* modal */}
      <Modal
        title="编辑"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
        }}
        maskClosable={false}
        onOk={() => {
          modalForm.submit(); // 手动触发表单的提交事件
        }}
        destroyOnHidden={false}
        forceRender={true}
      >
        <Form
          form={modalForm}
          labelCol={{ span: 4 }}
          onFinish={async (data) => {
            console.log(data);
            // 以下代码是有执行顺序的，所以必须写在同一个async中
            if (currentId) {
              await patch("/orders/" + currentId, { ...data });
            }
            message.success("保存成功");
            setModalOpen(false);
            setQuery((pre) => ({ ...pre })); //重新让useEffect取最新的数据进行展示
          }}
        >
          <Form.Item
            label="订单号"
            name="orderNum"
            rules={[{ required: true, message: "不能为空" }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="价格"
            name="price"
            rules={[{ required: true, message: "不能为空" }]}
          >
            <Input placeholder="请输入名字" />
          </Form.Item>
          <Form.Item
            label="数量"
            name="num"
            rules={[{ required: true, message: "不能为空" }]}
          >
            <Input.TextArea placeholder="请输入简介" />
          </Form.Item>
          <Form.Item
            label="交易状态"
            name="state"
            rules={[{ required: true, message: "不能为空" }]}
          >
            <Input.TextArea placeholder="请输入交易状态" />
          </Form.Item>
          <Form.Item
            label="售后状态"
            name="after"
            rules={[{ required: true, message: "不能为空" }]}
          >
            <Input.TextArea placeholder="请输入售后状态" />
          </Form.Item>
          <Form.Item
            label="实收款"
            name="paymentReceived"
            rules={[{ required: true, message: "不能为空" }]}
          >
            <Input.TextArea placeholder="请输入实收款" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Sold;
