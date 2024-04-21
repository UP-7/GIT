<template>
  <div class="tabbar">
    <div class="tabbar-left">
      <Breadcrump />
    </div>
    <div class="tabbar-right">
      <Setting />
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrump from "./breadcrumb/index.vue";
import Setting from "./setting/index.vue";
</script>
<script lang="ts">
export default {
  name: "Tabbar",
};
</script>
<style scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  /* background-image: linear-gradient(to right, white, rgb(189, 216, 251), white); */
  .tabbar-left {
    display: flex;
    align-items: center;
    margin: 20px;
  }
  .tabbar-right {
    display: flex;
    align-items: center;
    margin: 20px;
  }
}
</style>
