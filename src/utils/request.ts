import axios from "axios";
// @ts-ignore
import Nprogress from "nprogress";
import "nprogress/nprogress.css";
import { baseURL } from "./tools";

// 创建一个axios实例，设置基础配置
const instance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  // 允许服务端向客户端写入Cookie
  withCredentials: true,
});
// 设置请求拦截器，内第一个函数是请求前设置信息，第二个函数是出现错误时调用的函数
instance.interceptors.request.use(
  (config) => {
    // 根据接口文档设置相关信息（此处为在请求头中加入一个自定义属性）
    const token = localStorage.getItem("token");
    token && (config.headers.Authorization = `Bearer ${token}`);
    // Nprogress弹出loading
    Nprogress.start();
    // 设置完必须返回config对象
    return config;
  },
  (error) => {
    // 如果请求有误，则返回一个promise对象给调用请求者，需要修改代码
    return Promise.reject(error);
  }
);

// 设置响应拦截器，内第一个函数是响应2xx时执行的函数，第二个函数是出现错误时调用的函数
instance.interceptors.response.use(
  (response) => {
    // 可以对response设置（例如直接将data设置为result）
    // response = response.data;
    // Nprogress结束loading
    Nprogress.done();
    // 设置完了必须return
    return response;
  },
  (error) => {
    Nprogress.done();
    // console.log(error);
    // 例如对401身份验证失败做统一处理
    if (error?.response?.status === 401) {
      alert("登录状态过期，请重新登录");
      // 清除本地失效的token并跳转网页至登录
      localStorage.removeItem("token");
      location.href = "../login/index.html";
    }
    // 必须返回一个promise对象给调用请求者，否则调用者接收不到结果
    return Promise.reject(error);
  }
);
// 暴露请求方法
/**
 * get请求，下post、put等类似，不重复注释
 * @param url 拼接地址
 * @param params 参数
 */
export const get = (url: string, params: any) => instance.get(url, { params });

export const post = (url: string, data: any) => instance.post(url, data);

export const put = (url: string, data: any) => instance.put(url, data);

export const patch = (url: string, data: any) => instance.patch(url, data);

export const del = (url: string) => instance.delete(url);
