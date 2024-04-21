<template>
  <div>
    <!-- 三级分类组件 -->
    <el-card>
      <el-form :inline="true">
        <el-form-item label="一级分类">
          <el-select
            :disabled="scene == 0 ? false : true"
            v-model="categoryStore.c1Id"
            style="width: 200px"
            @change="handler"
          >
            <!-- option组件，label为显示文字，value为select下拉菜单收集数据 -->
            <el-option
              v-for="c1 in categoryStore.c1Arr"
              :key="c1.id"
              :label="c1.name"
              :value="c1.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            :disabled="scene == 0 ? false : true"
            v-model="categoryStore.c2Id"
            style="width: 200px"
            @change="handler1"
          >
            <el-option
              v-for="c2 in categoryStore.c2Arr"
              :key="c2.id"
              :label="c2.name"
              :value="c2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            :disabled="scene == 0 ? false : true"
            v-model="categoryStore.c3Id"
            style="width: 200px"
          >
            <el-option
              v-for="c3 in categoryStore.c3Arr"
              :key="c3.id"
              :label="c3.name"
              :value="c3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
//引入分类相关的仓库
import useCategoryStore from "@/store/modules/category";
//引入组件挂载完毕方法
import { onMounted } from "vue";
let categoryStore = useCategoryStore();
//分类全局组件挂载完毕,通知仓库发请求获取一级分类的数据
onMounted(() => {
  getC1();
});
//通知仓库获取一级分类的方法
const getC1 = () => {
  //通知分类仓库发请求获取一级分类的数据
  categoryStore.getC1();
};
//此方法即为一级分类下拉菜单的change事件，(当选中某一值时会触发,保证一级分类id有了)
const handler = () => {
  //将二级三级数据清空
  categoryStore.c2Id = "";
  categoryStore.c3Arr = [];
  categoryStore.c3Id = "";
  //通知仓库区获取二级分类数据
  categoryStore.getC2();
};
//此方法即为2级分类下拉菜单的change事件，(当选中某一值时会触发,保证一级分类id有了)
const handler1 = () => {
  //将三级数据清空
  categoryStore.c3Id = "";
  //通知仓库区获取3级分类数据
  categoryStore.getC3();
};
//接受父组件传过来的scene,用于禁用，当scene=1时禁用category
defineProps(["scene"]);
</script>

<style scoped></style>
