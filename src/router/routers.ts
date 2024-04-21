//对外暴露配置路由(常量路由)
import type { RouteRecordRaw } from "vue-router";
export const constantRoute: Array<RouteRecordRaw> = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    name: "login", //命名路由
    meta: {
      title: "登录", //菜单标题
      hidden: true, //路由标题在菜单中是否隐藏
      icon: "Promotion", //菜单文字左侧图标,支持element-plus全部图标
    },
  },
  {
    //登陆成功显示数据的路由
    path: "/",
    component: () => import("@/layout/index.vue"),
    name: "layout",
    meta: {
      //菜单标题
      hidden: false,
    },
    redirect: "/home",
    children: [
      {
        path: "/home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "主页", //菜单标题
          hidden: false,
          icon: "HomeFilled",
        },
      },
    ],
  },
  {
    path: "/screen",
    component: () => import("@/views/screen/index.vue"),
    name: "Screen",
    meta: {
      title: "数据大屏", //菜单标题
      hidden: false,
      icon: "DataBoard",
    },
  },

  {
    //404
    path: "/404",
    component: () => import("@/views/404/index.vue"),
    name: "404",
    meta: {
      title: "404", //菜单标题
      hidden: true,
      icon: "list",
    },
  },
];
//异步路由
export const asnycRoute: Array<RouteRecordRaw> = [
  {
    path: "/acl",
    component: () => import("@/layout/index.vue"),
    name: "Acl",
    meta: {
      title: "权限管理", //菜单标题
      hidden: false,
      icon: "Lock",
    },
    redirect: "/acl/user",
    children: [
      {
        path: "/acl/user",
        component: () => import("@/views/acl/user/index.vue"),
        name: "User",
        meta: {
          title: "用户管理", //菜单标题
          hidden: false,
          icon: "User",
        },
      },
      {
        path: "/acl/role",
        component: () => import("@/views/acl/role/index.vue"),
        name: "Role",
        meta: {
          title: "角色管理", //菜单标题
          hidden: false,
          icon: "UserFilled",
        },
      },
      {
        path: "/acl/permissiom",
        component: () => import("@/views/acl/permission/index.vue"),
        name: "Permission",
        meta: {
          title: "菜单管理", //菜单标题
          hidden: false,
          icon: "Check",
        },
      },
    ],
  },
  {
    path: "/product",
    component: () => import("@/layout/index.vue"),
    name: "Product",
    meta: {
      title: "商品管理", //菜单标题
      hidden: false,
      icon: "Goods",
    },
    redirect: "/product/trademark",
    children: [
      {
        path: "/product/trademark",
        component: () => import("@/views/product/trademark/index.vue"),
        name: "Trademark",
        meta: {
          title: "品牌管理", //菜单标题
          hidden: false,
          icon: "ShoppingCart",
        },
      },
      {
        path: "/product/attr",
        component: () => import("@/views/product/attr/index.vue"),
        name: "Attr",
        meta: {
          title: "属性管理", //菜单标题
          hidden: false,
          icon: "Setting",
        },
      },
      {
        path: "/product/spu",
        component: () => import("@/views/product/spu/index.vue"),
        name: "Spu",
        meta: {
          title: "SPU管理", //菜单标题
          hidden: false,
          icon: "Tools",
        },
      },
      {
        path: "/product/sku",
        component: () => import("@/views/product/sku/index.vue"),
        name: "Sku",
        meta: {
          title: "SKU管理", //菜单标题
          hidden: false,
          icon: "Tools",
        },
      },
    ],
  },
];
//任意路由
export const anyRoute: Array<RouteRecordRaw> = [
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
    name: "any",
    meta: {
      title: "任意路由", //菜单标题
      hidden: true,
      icon: "DataLine",
    },
  },
];
