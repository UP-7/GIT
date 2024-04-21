//路由鉴权：鉴权：项目当中路由能不能被访问的权限
import router from "@/router";
import setting from "./setting";
import nprogress from "nprogress";
//引入进度条样式
import "nprogress/nprogress.css";
//进度条的加载圆圈不要
nprogress.configure({ showSpinner: false });
//获取用户相关的小仓库内部token数据，去判断用户是否登陆成功
import useUserStore from "./store/modules/user";
//为什么要引pinia
import pinia from "./store";
const userStore = useUserStore(pinia);

//全局前置守卫
router.beforeEach(async (to: any, _from: any, next: any) => {
  //网页的名字
  document.title = `${setting.title}-${to.meta.title}`;
  //访问某一个路由之前的守卫
  nprogress.start();
  //获取token，去判断用户登录、还是未登录
  const token = userStore.token;
  //获取用户名字
  let username = userStore.username;
  //用户登录判断
  if (token) {
    //登陆成功，访问login。指向首页
    if (to.path == "/login") {
      next("/home");
    } else {
      //登陆成功访问其余的，放行
      //有用户信息
      if (username) {
        //放行
        next();
      } else {
        //如果没有用户信息，在收尾这里发请求获取到了用户信息再放行
        try {
          //获取用户信息
          await userStore.userInfo();
          //万一刷新的时候是异步路由，有可能获取到用户信息但是异步路由没有加载完毕，出现空白效果
          // next();
          next({ ...to });
        } catch (error) {
          //token过期|用户手动处理token
          //退出登陆->用户相关的数据清空
          userStore.userLogout();
          next({ path: "/login", query: { redirect: to.path } });
        }
      }
    }
  } else {
    //用户未登录
    if (to.path == "/login") {
      next();
    } else {
      next({ path: "/login", query: { redirect: to.path } });
    }
  }
  next();
});

//全局后置守卫
router.afterEach((_to: any, _from: any) => {
  // to and from are both route objects.
  nprogress.done();
});

//第一个问题：任意路由切换实现进度条业务 ----nprogress
//第二个问题：路由鉴权
//全部路由组件 ：登录|404|任意路由|首页|数据大屏|权限管理（三个子路由）|商品管理（4个子路由）

//用户未登录 ：可以访问login 其余都不行
//登陆成功：不可以访问login 其余都可以
