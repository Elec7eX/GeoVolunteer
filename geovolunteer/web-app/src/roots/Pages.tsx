import { Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routes";
import React, { JSX } from "react";
import { ProtectedRoute } from "./ProtectedRoute";

const Pages: React.FC = () => {
  console.log(publicRoutes);
  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <CheckAuth>
              {typeof route.element === "function"
                ? route.element()
                : route.element}
            </CheckAuth>
          }
        />
      ))}
      {privateRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <ProtectedRoute>
              {typeof route.element === "function"
                ? route.element()
                : route.element}
            </ProtectedRoute>
          }
        />
      ))}
    </Routes>
  );
};

const CheckAuth = ({ children }: { children: JSX.Element }) => {
  return children;
};

export default Pages;
