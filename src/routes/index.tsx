import * as React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import SuspenseLayout from "./components/SuspenseLayout";
import NoAuthLayout from "@/components/layout/NoAuthLayout";
import RootLayout from "@/components/layout/RootLayout";

// Lazy load pages for code splitting
const Login = React.lazy(() => import("@/pages/login/Login"));
const Home = React.lazy(() => import("@/pages/home/Home"));
const List = React.lazy(() => import("@/pages/list/List"));
const Single = React.lazy(() => import("@/pages/single/Single"));
const New = React.lazy(() => import("@/pages/new/New"));

export const router = createBrowserRouter([
  {
    Component: NoAuthLayout,
    errorElement: <ErrorBoundary />,
    children: [{
      path: "/login",
      element: (
        <SuspenseLayout>
          <Login />
        </SuspenseLayout>
      )
    }]
  },
  {
    Component: RootLayout,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: (
          <SuspenseLayout>
            <Home />
          </SuspenseLayout>
        )
      },
      {
        path: "/users",
        children: [
          {
            index: true,
            element: (
              <SuspenseLayout>
                <List />
              </SuspenseLayout>
            ),
          },
          {
            path: ":userId",
            element: (
              <SuspenseLayout>
                <Single />
              </SuspenseLayout>
            ),
          },
          {
            path: "new",
            element: (
              <SuspenseLayout>
                <New title="Create New User" />
              </SuspenseLayout>
            ),
          }
        ]
      },
      {
        path: "/products",
        children: [
          {
            index: true,
            element: (
              <SuspenseLayout>
                <List />
              </SuspenseLayout>
            ),
          },
          {
            path: ":productId",
            element: (
              <SuspenseLayout>
                <Single />
              </SuspenseLayout>
            ),
          },
          {
            path: "new",
            element: (
              <SuspenseLayout>
                <New title="Create New Product" />
              </SuspenseLayout>
            ),
          }
        ]
      },
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);
