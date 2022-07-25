import { createRouter, createWebHistory } from "vue-router";
import { store } from "../store";
import routes from "./routes";

export const router = new createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters["auth/isLoggedIn"]()) {
      next();
    } else {
      next({ name: "login" });
      store.dispatch("auth/logout");
    }
  } else {
    next();
  }
});
