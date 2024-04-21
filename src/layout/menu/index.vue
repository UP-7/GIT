<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item.children">
      <el-menu-item
        :index="item.path"
        v-if="!item.meta.hidden"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 只有一个子路由 -->
    <template v-if="item.children && item.children.length == 1">
      <el-menu-item
        :index="item.children[0].path"
        v-if="!item.meta.hidden"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 不止一个子路由，折叠 -->
    <el-sub-menu
      :index="item.path"
      v-if="item.children && item.children.length > 1"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menuList="item.children"></Menu>
      <!-- 组件递归,把路由的孩子给自己遍历三个孩子 -->
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
//获取路由对象
import { useRouter } from "vue-router";
//获取父组件传递过来的全部路由信息
defineProps(["menuList"]);

let $router = useRouter();
const goRoute = (vc: any) => {
  //路由跳转
  $router.push(vc.index);
};
</script>
<script lang="ts">
export default {
  name: "Menu",
}; //递归组件必须有名字
</script>

<style scoped></style>
