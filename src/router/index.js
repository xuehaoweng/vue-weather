import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: "天气",
        intercept: true,
      },
    },
  ],
});
// 切换页面换title 全局的前置守卫
router.afterEach((to, next) => {
  //获取 document.querySelector title = 直接改掉 这么简单
  document.querySelector("title").innerText = to.meta.title;
});
export default router;
