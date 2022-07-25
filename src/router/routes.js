import { NotFound, HomePage, DashboardPage, LoginPage } from "../pages";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardPage,
    meta: { requiresAuth: true },
  },

  // Auth
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },

  // 404 catch all
  {
    path: "/404",
    name: "PageNotExist",
    component: NotFound,
  },
  {
    path: "/:catchAll(.*)", // Unrecognized path automatically matches 404
    redirect: "/404",
  },
];

export default routes;
