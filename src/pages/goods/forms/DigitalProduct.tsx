import { useEffect, useMemo, useState } from "react";
import style from "./form.module.css";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

function DigitalProduct() {
  const [data, setData] = useState<any>({
    type: "new",
    attributes: {},
    salesAttributes: { ram: [""] },
    delivery: [
      {
        id: 0,
        nation: "中国",
        location: "浙江",
        freeShipping: true,
        time: 2,
      },
      {
        id: 1,
        nation: "中国",
        location: "广东",
        freeShipping: false,
        time: 3,
      },
      {
        id: 2,
        nation: "中国",
        location: "新疆",
        freeShipping: false,
        time: 5,
      },
      {
        id: 3,
        nation: "日本",
        location: "东京",
        freeShipping: true,
        time: 5,
      },
      {
        id: 4,
        nation: "日本",
        location: "大阪",
        freeShipping: false,
        time: 5,
      }, {
        id: 5,
        nation: "美国",
        location: "纽约",
        freeShipping: false,
        time: 5,
      },
    ],
  });
  const [form] = Form.useForm();
  const [showBatchMode, setShowBatchMode] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  useEffect(() => {
    form.setFieldsValue(data);
  }, [data]);

  // 预处理table数据，可进行同字段同值添加rowSpan属性
  // 需要对应修改字段名
  const processedData = useMemo(() => {
    const rawData = data.delivery;
    const result = [];
    let i = 0;

    while (i < rawData.length) {
      let j = i;
      while (
        j < rawData.length - 1 &&
        rawData[j].nation === rawData[j + 1].nation
      ) {
        j++;
      }

      const rowSpan = j - i + 1;
      result.push({ ...rawData[i], _rowSpan: rowSpan });

      for (let k = 1; k < rowSpan; k++) {
        result.push({ ...rawData[i + k], _rowSpan: 0 });
      }

      i = j + 1;
    }
    console.log(result);

    return result;
  }, [data.delivery]);

  const attributesItems = [
    {
      label: "CPU型号",
      name: ["attributes", "cpu"],
      key: "cpu",
      options: [
        { label: "Intel", value: "intel" },
        { label: "AMD", value: "amd" },
      ],
    },
    {
      label: "显存容量",
      name: ["attributes", "memoryCapacity"],
      key: "memoryCapacity",
      options: [
        { label: "2G", value: "2G" },
        { label: "4G", value: "4G" },
        { label: "8G", value: "8G" },
        { label: "16G", value: "16G" },
      ],
    },
    {
      label: "显卡型号",
      name: ["attributes", "graphicsCard"],
      key: "graphicsCard",
      options: [
        { label: "NVIDIA", value: "nvidia" },
        { label: "AMD", value: "amd" },
      ],
    },
    {
      label: "电源功率",
      name: ["attributes", "power"],
      key: "power",
    },
    {
      label: "主板结构",
      name: ["attributes", "motherboard"],
      key: "motherboard",
      options: [
        { label: "ITX", value: "ITX" },
        { label: "MATX", value: "MATX" },
        { label: "ATX", value: "ATX" },
        { label: "EATX", value: "EATX" },
      ],
    },
    {
      label: "散热方式",
      name: ["attributes", "heatDissipation"],
      key: "heatDissipation",
      options: [
        { label: "风冷", value: "wind" },
        { label: "水冷", value: "water" },
      ],
    },
  ];

  // 添加 RAM 选项
  const addRamOption = () => {
    setData((prev: any) => ({
      ...prev,
      salesAttributes: {
        ...prev.salesAttributes,
        ram: [...prev.salesAttributes.ram, ""], // 添加空值
      },
    }));
  };

  // 删除指定索引的选项
  const removeRamOption = (index: number) => {
    if (data.salesAttributes.ram.length <= 1) return; // 至少保留一个
    setData((prev: any) => {
      const newRam = [...prev.salesAttributes.ram];
      newRam.splice(index, 1);
      return {
        ...prev,
        salesAttributes: {
          ...prev.salesAttributes,
          ram: newRam,
        },
      };
    });
  };

  // 在组件顶部定义操作函数
  const handleRamChange = async (index: number, value: string) => {
    console.log("验证前data:", data);
    try {
      await form.validateFields([["salesAttributes", "ram", index]]);
      setData((prev: any) => ({
        ...prev,
        salesAttributes: {
          ...prev.salesAttributes,
          ram: prev.salesAttributes.ram.map((item: any, i: number) =>
            i === index ? value : item
          ),
        },
      }));
    } catch (err) {
      console.log("验证失败时data:", data); // 检查此时data状态
      console.error("验证错误:", err);
    }
  };

  // 批量删除执行
  const handleBatchDelete = () => {
    setData((prev: any) => ({
      ...prev,
      salesAttributes: {
        ...prev.salesAttributes,
        ram: prev.salesAttributes.ram.filter(
          (_: any, index: number) => !selectedIndices.includes(index)
        ),
      },
    }));
    setSelectedIndices([]);
  };

  // 更新函数
  const updateSpecification = (index: number, field: string, value: any) => {
    setData((pre: any) => ({
      ...pre,
      delivery: pre.delivery.map((item: any, i: number) => {
        if (i === index) {
          return { ...item, [field]: value };
        }
        return item;
      }),
    }));
  };

  return (
    <>
      <div>
        <Form form={form} labelCol={{ span: 2 }} colon={false}>
          {/* 基础信息 */}
          <div className={style.box}>
            <h3>基础信息</h3>
            <Form.Item
              label="商品类型"
              name="type"
              rules={[{ required: true, message: "不能为空" }]}
            >
              <Radio.Group
                options={[
                  { value: "new", label: "全新" },
                  { value: "old", label: "二手" },
                ]}
                onChange={({ target }) => {
                  console.log(target.value);
                  setData((pre: any) => ({ ...pre, type: target.value }));
                }}
              />
            </Form.Item>
            <Form.Item
              label="商品标题"
              required //这个required只负责label前面展示一个红*
            >
              <Form.Item
                name="title"
                noStyle // 关键：隐藏自身布局
                rules={[{ required: true, message: "不能为空" }]}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {/* 有name的formitem内部有数组组件及其他展示内容时，必须用一个div或者容器将这些都包裹起来，否则验证规则将失效 */}
                  <Input
                    onBlur={({ target }) => {
                      console.log(target.value);
                      form.validateFields(["title"]).then(() => {
                        setData((pre: any) => ({
                          ...pre,
                          title: target.value,
                        }));
                      });
                    }}
                    placeholder="最多允许输入30个汉字（60字符）"
                  />
                  <span className={style.desc}>
                    即日起，标题中请勿使用制表符、换行符。若填入制表符、换行符，系统将自动替换成空格
                  </span>
                </div>
              </Form.Item>
            </Form.Item>
            <Form.Item label="类目属性" required>
              {/* 只用于布局的label属性的formitem不具备name属性，里面的包裹的所有元素可以不用div统一包裹 */}
              <div className={style.desc} style={{ marginTop: "5px" }}>
                请根据实际情况填写产品的重要属性，填写属性越完整，越有可能影响搜索流量，越有机会被消费者购买。
              </div>
              <Row gutter={20}>
                {attributesItems.map((item) => {
                  return item.key === "power" ? (
                    <Col span={12} key={item.key}>
                      <Form.Item
                        label={item.label}
                        name={item.name}
                        rules={[
                          { required: true, message: "不能为空" },
                          {
                            validator: (_, value) => {
                              return value > 0
                                ? Promise.resolve()
                                : Promise.reject("数字必须大于0");
                            },
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          suffix="W"
                          onBlur={({ target }) => {
                            console.log(target.value);
                            form.validateFields([item.name]).then(() => {
                              setData((pre: any) => ({
                                ...pre,
                                attributes: {
                                  ...pre.attributes,
                                  power: target.value,
                                },
                              }));
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                  ) : (
                    <Col span={12} key={item.key}>
                      <Form.Item
                        label={item.label}
                        name={item.name}
                        rules={[{ required: true, message: "不能为空" }]}
                      >
                        <Select
                          options={item.options}
                          onChange={(value) => {
                            console.log(value);
                            form.validateFields([item.name]).then(() => {
                              setData((pre: any) => ({
                                ...pre,
                                attributes: {
                                  ...pre.attributes,
                                  [item.name[1]]: value, // 新增或更新指定属性
                                },
                              }));
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                  );
                })}
              </Row>
            </Form.Item>
          </div>
          {/* 销售信息 */}
          <div className={style.box}>
            <h3>销售信息</h3>
            <Form.Item label="销售属性" required>
              <div className={style.desc} style={{ marginTop: "5px" }}>
                该商品下可添加的SKU上限为600个，规范配置销售属性有助于商品转化。
              </div>
              <Form.Item label="内存" required>
                <Row gutter={5}>
                  {data.salesAttributes.ram.map((_: any, index: number) => (
                    <Col key={index} span={8}>
                      <Space align="start">
                        <Form.Item
                          name={["salesAttributes", "ram", index]}
                          rules={[
                            { required: true, message: "请选择内存配置" },
                            {
                              validator: (_, value) => {
                                const allValues = form.getFieldValue([
                                  "salesAttributes",
                                  "ram",
                                ]);
                                // debugger
                                if (
                                  allValues.filter((v: string) => v === value)
                                    .length > 1
                                ) {
                                  return Promise.reject("内存配置不能重复！");
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <Select
                            options={[
                              { label: "8G*2", value: "8G*2" },
                              { label: "8G", value: "8G" },
                              { label: "16G*2", value: "16G*2" },
                              { label: "16G", value: "16G" },
                              { label: "32G*2", value: "32G*2" },
                              { label: "32G", value: "32G" },
                            ]}
                            onChange={(value) => handleRamChange(index, value)}
                            placeholder="请选择内存"
                            style={{ width: "150px" }}
                          />
                        </Form.Item>
                        {showBatchMode ? (
                          <div
                            style={{
                              height: "32px",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Checkbox
                              checked={selectedIndices.includes(index)}
                              onChange={(e) =>
                                setSelectedIndices((prev) =>
                                  e.target.checked
                                    ? [...prev, index]
                                    : prev.filter((i) => i !== index)
                                )
                              }
                            />
                          </div>
                        ) : (
                          <Button danger onClick={() => removeRamOption(index)}>
                            删除
                          </Button>
                        )}
                      </Space>
                    </Col>
                  ))}
                  {/* 点击此按钮，可以动态增加“内存”中select的个数，从而达成修改ram属性值的数组长度，且要求，只有当现有的selec选中值后，该增加按钮才生效 */}
                  <Col span={6}>
                    <Button
                      type="primary"
                      onClick={addRamOption}
                      disabled={!data.salesAttributes.ram.every(Boolean)}
                      icon={<PlusOutlined />}
                    >
                      添加
                    </Button>
                  </Col>
                </Row>
                {/* 批量删除 */}
                <div style={{ margin: "20px 0px" }}>
                  <Button
                    onClick={() => setShowBatchMode(!showBatchMode)}
                    style={{ marginRight: "20px" }}
                  >
                    {showBatchMode ? "退出批量删除模式" : "批量删除"}
                  </Button>

                  {showBatchMode && selectedIndices.length > 0 && (
                    <Button danger onClick={handleBatchDelete}>
                      确认删除选中项 ({selectedIndices.length})
                    </Button>
                  )}
                </div>
              </Form.Item>
            </Form.Item>
            <Form.Item label="发货信息" required>
              <Table
                dataSource={processedData}
                rowKey="id"
                columns={[
                  {
                    title: "国内国际",
                    align: "center",
                    dataIndex: "nation",
                    onCell: (record) => {
                      return record._rowSpan === 0
                        ? { rowSpan: 0, colSpan: 0 }
                        : { rowSpan: record._rowSpan };
                    },
                  },
                  {
                    title: "发货地址",
                    align: "center",
                    render(_, r: any, i) {
                      return (
                        <Input
                          value={r.location}
                          onChange={(e) => {
                            if (e.target.value) {
                              updateSpecification(
                                i,
                                "location",
                                e.target.value
                              );
                            }
                          }}
                        />
                      );
                    },
                  },
                  {
                    title: "是否包邮",
                    align: "center",
                    render(_, r: any, i) {
                      return (
                        <Checkbox
                          checked={r.freeShipping}
                          onChange={(e) => {
                            console.log(e.target.checked);
                            updateSpecification(
                              i,
                              "freeShipping",
                              e.target.checked
                            );
                          }}
                        />
                      );
                    },
                  },
                  {
                    title: "时间预估",
                    align: "center",
                    render(_, r, i) {
                      return (
                        <Select
                          options={[
                            { label: "1天", value: 1 },
                            { label: "2天", value: 2 },
                            { label: "3天", value: 3 },
                            { label: "4天", value: 4 },
                            { label: "5天", value: 5 },
                            { label: "6天", value: 6 },
                          ]}
                          value={r.time}
                          onChange={(value) => {
                            console.log(value);
                            updateSpecification(i, "time", value);
                          }}
                        />
                      );
                    },
                  },
                ]}
              ></Table>
            </Form.Item>
          </div>
        </Form>
        <Button
          type="primary"
          onClick={() => {
            console.log(data);
          }}
        >
          提交
        </Button>
      </div>
    </>
  );
}

export default DigitalProduct;
