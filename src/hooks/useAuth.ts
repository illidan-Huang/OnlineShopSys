import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../service/auth";

export function useAuth() {
  const [user, setUser] = useState<any|null>(null);
  const navigate = useNavigate();
  // console.log(user);
  

  const login = async (credentials: any) => {
    const { data } = await loginAPI(credentials);
    console.log('登录res',data);

    // 模拟数据逻辑
    if (data.length > 0) {
      setUser(data[0]);
      localStorage.setItem("token", data[0].token);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    // navigate("/login");
  };

  return {
    isAuthenticated: !!user,
    userRole: user?.role,
    login,
    logout,
  };
}
