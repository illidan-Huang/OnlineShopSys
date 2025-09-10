import {
  AlipayOutlined,
  HomeOutlined,
  PlusCircleOutlined,
  RightOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Col, Divider, Flex, Row, Space } from "antd";
import InfoCalendar from "../../components/InfoCalendar";
import { useEffect, useState } from "react";
import { get } from "../../utils/request";

function Dashboard() {
  const [yesterdayData, setYesterdayData] = useState({
    id: 1,
    type: "yesterday",
    paidMoney: 0,
    visitors: 0,
    paidOrder: 0,
    pageView: 0,
  });
  const [todayData, setTodayData] = useState({
    id: 2,
    type: "today",
    paidMoney: 0,
    visitors: 0,
    paidOrder: 0,
    pageView: 0,
  });
  useEffect(() => {
    get("/dashboarddata", { type: "yesterday" }).then((res) => {
      if(res.status===200){
        setYesterdayData((res.data)[0])
      }
    });
    get("/dashboarddata", { type: "today" }).then((res) => {
      if(res.status===200){
        setTodayData((res.data)[0])
      }
    });
  }, []);
  const formatter = new Intl.NumberFormat('en-US',{minimumFractionDigits:0})
  return (
    <>
      <Row>
        <Col span={16} style={{ paddingRight: "20px" }}>
          {/* 待处理 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "18px" }}>待处理</span>
              <span className="header-menu-btn" style={{ lineHeight: "26px" }}>
                <span style={{ color: "gray" }}>暂无待处理任务，查看全部</span>
                <div style={{ display: "inline-block", width: "6px" }} />
                <RightOutlined />
              </span>
            </div>
          </div>
          {/* 店铺数据 */}
          <div style={{ paddingTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                <span style={{ fontSize: "18px" }}>店铺数据</span>
                <div style={{ display: "inline-block", width: "20px" }} />
                <span style={{ color: "gray" }}>
                  数据更新时间：{" "}
                  {new Date().toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false, // 24小时制
                  })}
                </span>
              </span>
              <span className="header-menu-btn" style={{ lineHeight: "26px" }}>
                <PlusCircleOutlined />
                <div style={{ display: "inline-block", width: "6px" }} />
                <span>指标</span>
                <div style={{ display: "inline-block", width: "6px" }} />
                <RightOutlined />
              </span>
            </div>
          </div>
          {/* 数据展示面板 */}
          <div style={{ paddingTop: "20px" }}>
            <Flex justify="space-between">
              <Space direction="vertical" className="dataShow">
                <span>支付金额</span>
                <span style={{ fontSize: "25px", fontWeight: "bold" }}>
                  {todayData.paidMoney.toLocaleString('en-US',{minimumFractionDigits:2})}
                </span>
                <span>昨日 {yesterdayData.paidMoney.toLocaleString('en-US',{minimumFractionDigits:2})}</span>
              </Space>
              <Space direction="vertical" className="dataShow">
                <span>访客数</span>
                <span style={{ fontSize: "25px", fontWeight: "bold" }}>
                  {formatter.format(todayData.visitors)}
                </span>
                <span>昨日 {formatter.format(yesterdayData.visitors)}</span>
              </Space>
              <Space direction="vertical" className="dataShow">
                <span>支付订单数</span>
                <span style={{ fontSize: "25px", fontWeight: "bold" }}>
                  {formatter.format(todayData.paidOrder)}
                </span>
                <span>昨日 {formatter.format(yesterdayData.paidOrder)}</span>
              </Space>
              <Space direction="vertical" className="dataShow">
                <span>浏览量</span>
                <span style={{ fontSize: "25px", fontWeight: "bold" }}>
                  {formatter.format(todayData.pageView)}
                </span>
                <span>昨日 {formatter.format(yesterdayData.pageView)}</span>
              </Space>
            </Flex>
          </div>
          {/* 商家日历 */}
          <div style={{ paddingTop: "20px" }}>
            <InfoCalendar />
          </div>
        </Col>
        <Col span={8}>
          <Flex
            style={{
              border: "1px solid #c7c7c7",
              borderRadius: "5px",
              padding: "20px",
            }}
            vertical
          >
            <Flex justify="space-between" style={{ width: "100%" }}>
              <div style={{ fontSize: "20px" }}>OnlineShop</div>
              <Space>
                <AlipayOutlined />
                <HomeOutlined />
              </Space>
            </Flex>
            <Divider />
            <div
              style={{
                width: "100%",
                height: "20px",
              }}
            >
              <span style={{ fontWeight: "bold" }}>真实体验分 </span>
              <span>暂无</span>
            </div>
            <div
              style={{
                width: "100%",
                height: "80px",
                // backgroundColor: "yellow",
                padding: "25px 0px",
              }}
            >
              <Flex justify="space-between">
                <Space
                  align="center"
                  direction="vertical"
                  style={{ lineHeight: "10px" }}
                  className="header-menu-btn"
                >
                  <span className="shopInfo-title">宝贝质量</span>
                  <span>暂无</span>
                </Space>
                <Space
                  align="center"
                  direction="vertical"
                  style={{ lineHeight: "10px" }}
                  className="header-menu-btn"
                >
                  <span className="shopInfo-title">物流速度</span>
                  <span>暂无</span>
                </Space>
                <Space
                  align="center"
                  direction="vertical"
                  style={{ lineHeight: "10px" }}
                  className="header-menu-btn"
                >
                  <span className="shopInfo-title">服务保障</span>
                  <span>暂无</span>
                </Space>
              </Flex>
            </div>
            <div>
              <span style={{ color: "red" }}>预警 </span>
              <span>有效订单数量不足30</span>
            </div>
            <Divider />
            <div
              style={{
                width: "100%",
                // height: "50px",
                // backgroundColor: "yellow",
              }}
            >
              <Flex justify="space-between">
                <Space
                  align="center"
                  direction="vertical"
                  style={{ lineHeight: "10px" }}
                  className="header-menu-btn"
                >
                  <span className="shopInfo-title">店铺成长层级</span>
                  <span>暂无</span>
                </Space>
                <Space
                  align="center"
                  direction="vertical"
                  style={{ lineHeight: "10px" }}
                  className="header-menu-btn"
                >
                  <span className="shopInfo-title">信用等级</span>
                  <span style={{ color: "orange" }}>新开店铺</span>
                </Space>
                <Space
                  align="center"
                  direction="vertical"
                  style={{ lineHeight: "10px" }}
                  className="header-menu-btn"
                >
                  <span className="shopInfo-title">店铺保证金</span>
                  <span style={{ color: "green" }}>无需缴纳</span>
                </Space>
              </Flex>
            </div>
            <Divider />
            <div>
              <UserAddOutlined style={{ color: "blue" }} /> 订阅服务号
              <div
                style={{
                  textAlign: "end",
                  display: "inline-block",
                  width: "68%",
                }}
              >
                <span className="shopInfo-title header-menu-btn">
                  及时获取平台咨询，请添加
                </span>{" "}
                <RightOutlined />
              </div>
            </div>
          </Flex>
        </Col>
      </Row>
    </>
  );
}

export default Dashboard;
