<template>
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="LayoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon style="magin: 0px, 5px; vertical-align: top">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
// import { ref } from "vue";
import useLayoutSettingStore from "@/store/modules/setting";
//获取路由对象
let $route = useRoute();
//定义一个响应式数据控制图标变换

//获取layout配置相关的仓库
let LayoutSettingStore = useLayoutSettingStore();
//用于控制菜单折叠还是打开切换变量
const changeIcon = () => {
  LayoutSettingStore.fold = !LayoutSettingStore.fold;
};
</script>
<script lang="ts">
export default {
  name: "Bread",
};
</script>

<style scoped></style>
