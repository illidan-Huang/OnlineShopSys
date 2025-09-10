import { createContext, ReactNode, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.ts";

export const AuthContext = createContext<any | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  // 向服务端发送localStorage中token信息验证有效性
  
  useEffect(() => {
    const localToken = localStorage.getItem("token")? localStorage.getItem("token"):'null'
    auth.login({ token: localToken });
  }, []);
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
