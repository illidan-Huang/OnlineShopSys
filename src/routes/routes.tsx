import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard.tsx"));
const Login = lazy(() => import("../pages/auth/Login.tsx"));
const Trade = lazy(() => import("../pages/trade/Trade.tsx"));
const Sold = lazy(() => import("../pages/trade/Sold.tsx"));
const Refund = lazy(() => import("../pages/trade/Refund.tsx"));
const AftermarketService = lazy(
  () => import("../pages/trade/AftermarketService.tsx")
);
const Goods = lazy(() => import("../pages/goods/Goods.tsx"));
const AddGood = lazy(() => import("../pages/goods/AddGood.tsx"));
const MyGoods = lazy(() => import("../pages/goods/MyGoods.tsx"));

import {
  DashboardOutlined,
  ShoppingOutlined,
  TrademarkCircleOutlined,
} from "@ant-design/icons";

export const baseRoutes = [
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
    roles: ["*"], // 所有角色可访问
    hideInMenu: true,
  },
  {
    path: "/login",
    element: <Login />,
    hideInMenu: true,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    roles: ["admin", "user"],
    meta: {
      title: "首页",
      icon: <DashboardOutlined />,
    },
  },
  {
    path: "/trade",
    element: <Trade />,
    roles: ["admin", "user"],
    meta: {
      title: "交易",
      icon: <TrademarkCircleOutlined />,
    },
    children: [
      {
        path: "/trade/sold",
        element: <Sold />,
        roles: ["admin", "user"],
        meta: {
          title: "已售宝贝",
        },
      },
      {
        path: "/trade/refund",
        element: <Refund />,
        roles: ["admin", "user"],
        meta: {
          title: "退款管理",
        },
      },
      {
        path: "/trade/aftermarketservice",
        element: <AftermarketService />,
        roles: ["admin", "user"],
        meta: {
          title: "售后服务",
        },
      },
    ],
  },
  {
    path: "/goods",
    element: <Goods />,
    roles: ["admin", "user"],
    meta: {
      title: "商品",
      icon: <ShoppingOutlined />,
    },
    children: [
      {
        path: "/goods/addgood",
        element: <AddGood />,
        roles: ["admin", "user"],
        meta: {
          title: "发布商品",
        },
      },
      {
        path: "/goods/mygoods",
        element: <MyGoods />,
        roles: ["admin", "user"],
        meta: {
          title: "我的商品",
        },
      },
    ],
  },
];
