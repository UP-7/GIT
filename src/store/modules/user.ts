//用户相关的小仓库
import { defineStore } from "pinia";
//引入接口
import { reqLogin, reqUserInfo, reqLogout } from "@/api/user";
//引入数据类型
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from "@/api/user/type";
import type { UserState } from "./types/type";
//引入操作本地存储和读取的方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from "@/utils/token";
//引入常量路由
import { constantRoute, asnycRoute, anyRoute } from "@/router/routers";
import router from "@/router";
//引入深拷贝方法
import cloneDeep from "lodash/cloneDeep";
//用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asnycRoute: any, routes: any) {
  return asnycRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes);
      }
      return true;
    }
  });
}
let useUserStore = defineStore("User", {
  //小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), //用户唯一标识token,持久化token
      menuRoutes: constantRoute, //仓库存储生成菜单需要的数组（路由）
      username: "",
      avatar: "",
      buttons: [],
    };
  },
  actions: {
    //用户登录的方法
    async userLogin(data: loginFormData) {
      //登陆请求，成功200->token,失败201
      let reslut: loginResponseData = await reqLogin(data);
      if (reslut.code == 200) {
        //pinia存储token
        this.token = reslut.data as string;
        //本地存储持久化一份token
        SET_TOKEN(reslut.data as string);
        return "ok";
      } else {
        return Promise.reject(new Error(reslut.data));
      }
    },
    //获取用户信息方法
    async userInfo() {
      //获取用户信息进行存储
      const result: userInfoResponseData = await reqUserInfo();
      if (result.code == 200) {
        this.username = result.data.name;
        this.avatar = result.data.avatar;
        this.buttons = result.data.buttons;
        //计算当前用户需要展示的异步路由
        const userAsyncRoute = filterAsyncRoute(
          cloneDeep(asnycRoute),
          result.data.routes
        );
        //菜单需要的数据整理完毕
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, ...anyRoute];
        //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
        [...userAsyncRoute, anyRoute].forEach((route: any) => {
          router.addRoute(route);
        });
        return "ok";
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
    //退出登录
    async userLogout() {
      let result: any = await reqLogout();
      //推出成功，清空
      if (result.code == 200) {
        this.token = "";
        this.username = "";
        this.avatar = "";
        REMOVE_TOKEN();
        return "ok";
      } else {
        return Promise.reject(new Error(result.message));
      }
      //跳转到登陆页面
    },
  },
  getters: {},
});
//对外暴露
export default useUserStore;
