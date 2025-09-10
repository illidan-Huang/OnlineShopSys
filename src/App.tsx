import "./App.css";
import { Suspense, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { baseRoutes } from "./routes/routes";
import Mainlayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import { AuthContext } from "./store/AuthProvider";

function App() {
  const auth = useContext(AuthContext);
  const { isAuthenticated, userRole } = auth;

  const filterRoutes = (routes: any[], role: any) => {
    return routes.filter((route) => {
      if (route.roles?.includes("*") || route.roles?.includes(role)) {
        if (route.children) {
          route.children = filterRoutes(route.children, role);
        }
        return true;
      }
      return false;
    });
  };

  const authorizedRoutes = isAuthenticated
    ? filterRoutes(baseRoutes, userRole)
    : baseRoutes.filter((route) => route.path === "/login");

  console.log(auth);
  console.log(authorizedRoutes);

  return (
    <Suspense>
      <Routes>
        {/* 条件渲染路由 */}
        {isAuthenticated ? (
          <Route element={<Mainlayout routes={authorizedRoutes} />}>
            {authorizedRoutes.map((route: any) => (
              <Route key={route.path} path={route.path} element={route.element}>
                {route.children?.map((child: any) => (
                  <Route
                    key={child.path}
                    path={child.path}
                    element={child.element}
                  />
                ))}
              </Route>
            ))}
          </Route>
        ) : (
          <Route element={<AuthLayout />}>
            {authorizedRoutes.map((route: any) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        )}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
