import { get } from "../utils/request";
type loginData = {
  username: string;
  password: string;
};
/**
 * 管理员登陆接口，用JSONserver简化，get方式了，实际应该是POST后台验证后返回验证数据
 * @param data 
 * @returns 
 */
export const loginAPI = (data:loginData) => get("/auth", data);
