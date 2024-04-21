//通过vue-router 插件实现模板路由配置
import { createRouter, createWebHashHistory } from "vue-router";
import { constantRoute } from "./routers";
let router = createRouter({
  //路由模式hash
  history: createWebHashHistory(),
  routes: constantRoute,
});
export default router;
