import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Login from "./components/pages/Login";
import Tasks from "./components/pages/Tasks";
import Sprint from "./components/pages/Sprint";
import PullRequests from "./components/pages/PullRequests";
import Bugs from "./components/pages/Bugs";
import Dashboard from "./components/pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Login },
      { path: "dashboard", Component: Dashboard },
      { path: "tasks", Component: Tasks },
      { path: "sprint", Component: Sprint },
      { path: "pull-requests", Component: PullRequests },
      { path: "bugs", Component: Bugs },
    ],
  },
]);
