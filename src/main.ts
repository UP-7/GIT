import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
//@ts-ignore
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
//svg需要的配置文件
import "virtual:svg-icons-register";
//引入自定义插件对象：注册整个项目的全局组件
import globalComponent from "@/components";
//引入模板的全局样式
import "@/styles/index.scss";
//注册路由
import router from "./router";
//引入仓库
import pinia from "./store";
//引入路由鉴权
import "./permisstion";
// 暗黑模式需要的样式
import "element-plus/theme-chalk/dark/css-vars.css";

const app = createApp(App);

app.use(ElementPlus, {
  locale: zhCn,
});
// app.component('SvgIcon',SvgIcon)
// console.log(import.meta.env)
app.use(globalComponent);
app.use(router);
app.use(pinia);
//引入自定义指令
import { isHasButton } from "./directive/has";
isHasButton(app);
app.mount("#app");
