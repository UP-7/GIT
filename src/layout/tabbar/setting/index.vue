<template>
  <div>
    <el-button
      type="primary"
      size="small"
      icon="Refresh"
      circle
      @click="updateRefsh"
    ></el-button>
    <el-button
      type="primary"
      size="small"
      icon="FullScreen"
      circle
      @click="fullScreen"
    ></el-button>
    <el-popover
      placement="bottom"
      title="主题设置"
      :width="260"
      trigger="click"
    >
      <!-- 表单组件 -->
      <el-form>
        <el-form-item label="主题颜色">
          <el-color-picker
            @change="setColor"
            v-model="color"
            show-alpha
            size="small"
            :predefine="predefineColors"
        /></el-form-item>
        <el-form-item label="暗黑模式">
          <el-switch
            @change="changeDark"
            v-model="dark"
            size="small"
            active-icon="Moon"
            inactive-icon="Sunny"
            inline-prompt
          />
        </el-form-item>
      </el-form>
      <template #reference>
        <el-button
          type="primary"
          size="small"
          icon="Setting"
          circle
        ></el-button>
      </template>
    </el-popover>

    <img
      :src="userStore.avatar"
      style="
        height: 24px;
        width: 24px;
        margin-left: 10px;
        margin-right: 10px;
        vertical-align: middle;
        border-radius: 50%;
      "
    />
    <!-- 下拉菜单 -->
    <el-dropdown>
      <span class="el-dropdown-link">
        {{ userStore.username }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
//获取骨架小仓库
import useLayourSettingStore from "@/store/modules/setting";
//获取用户相关小仓库
import userUserStore from "@/store/modules/user";
import { useRouter, useRoute } from "vue-router";
let userStore = userUserStore();
let layoutSettingStore = useLayourSettingStore();
//获取路由器对象
let $router = useRouter();
//获取路由对象
let $route = useRoute();

//刷新按钮点击回调
const updateRefsh = () => {
  layoutSettingStore.refsh = !layoutSettingStore.refsh;
};
//全屏
const fullScreen = () => {
  //dom对象的一个属性，判断当前是不是全屏，全屏true，不是false
  let full = document.fullscreenElement;
  if (!full) {
    //利用文档根节点方法，实现全屏模式
    document.documentElement.requestFullscreen();
  } else {
    //退出全屏模式
    document.exitFullscreen();
  }
};
//退出登录点击回调
const logout = async () => {
  //一，向服务器发请求（退出登录接口）目前mock没接口
  // 二，仓库中相关的数据情况名字等
  //三,跳转登陆页面,await是等请求全部完成后，再退出
  await userStore.userLogout();
  //跳转登陆页面
  $router.push({ path: "/login", query: { redirect: $route.path } });
};
</script>
<script lang="ts">
export default {
  name: "Setting",
};
// 颜色需要
const color = ref("rgba(255, 69, 0, 0.68)");
const predefineColors = ref([
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94, 0.5)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577",
]);
// 开关打开或关闭
let dark = ref<boolean>(false);
//switch开关的chang事件进行暗黑模式的切换
const changeDark = () => {
  //获取HTML根节点
  let html = document.documentElement;
  //判断HTML标签是否有类名dark
  dark.value ? (html.className = "dark") : (html.className = "");
};
//主题颜色的设置
const setColor = () => {
  //通过js修改根节点的样式对象的属性与属性值
  //获取html根节点
  const html = document.documentElement;
  html.style.setProperty("--el-color-primary", color.value);
};
</script>
<style scoped></style>
