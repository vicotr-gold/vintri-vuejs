import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { router } from "./router";
import { store } from "./store";
import "./assets/style.scss";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "@mdi/font/css/materialdesignicons.css";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

loadFonts();
const options = {
  // You can set your default options here
};
const app = createApp(App);
app.use(router);
app.use(vuetify);
app.use(store);
app.use(Toast, options);
app.mount("#app");

// createApp(App).use(vuetify).mount("#app");
