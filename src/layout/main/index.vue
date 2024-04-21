<template>
  <!-- 路由组件出口的位置 -->
  <router-view v-slot="{ Component }">
    <!-- 点击时注入到Component -->
    <transition name="fade">
      <!-- transition可以写一些动画 -->
      <component :is="Component" v-if="flag" />
      <!-- 渲染layout一级路由组件的子路由 -->
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import useLayourSettingStore from "@/store/modules/setting";
import { watch, ref, nextTick } from "vue";
let layOutSettingStore = useLayourSettingStore();

//控制当前组件是否销毁重建
let flag = ref(true);
//监听仓库内部数据是否发生变化，说明用户点击过刷新按钮
watch(
  () => layOutSettingStore.refsh,
  () => {
    //点击刷新按钮，路由组件销毁
    flag.value = false;
    //dom更新后，销毁后，在执行
    nextTick(() => {
      flag.value = true;
    });
  }
);
</script>

<script lang="ts">
export default {
  name: "Main",
};
</script>
<style scoped>
/* 动画 */
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.5s;
}
.fade-enter-to {
  opacity: 1;
}
</style>
