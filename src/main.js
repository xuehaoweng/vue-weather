import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
//引入tailwind.css的样式
import "./assets/tailwind.css";
import { Toast, Notify } from "vant";
import "vant/es/toast/style";
import "vant/es/notify/style";
//引入和风天气图标
import "../node_modules/qweather-icons/font/qweather-icons.css";
const app = createApp(App);

app.use(router);
app.use(Toast);
app.use(Notify);

app.mount("#app");
