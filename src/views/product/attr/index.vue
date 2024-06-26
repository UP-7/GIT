<template>
  <div>
    <Category :scene="scene" />
    <!-- 接受父组件传过来的scene -->
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addAttr"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0px" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="120px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <!-- row：已有的属性对象 -->
            <template #="{ row }">
              <el-tag
                style="margin: 5px"
                v-for="item in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <!-- row：已有的属性对象 -->
            <template #="{ row }">
              <!-- 修改已有属性的按钮 -->
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm
                :title="`你确定要删除${row.attrName}吗？`"
                width="200px"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <!-- 展示添加属性和修改属性的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请你输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          @click="addAttrValue"
          :disabled="attrParams.attrName ? false : true"
          type="primary"
          size="default"
          icon="Plus"
          >添加属性值</el-button
        >
        <el-button type="primary" size="default" @click="cancle"
          >取消</el-button
        >
        <el-table
          border
          style="margin: 10px, 0px"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            width="80px"
            type="index"
            align="center"
            label="序号"
          >
          </el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <!-- row：当前的属性对象 -->
              <el-input
                :ref="(vc: any) => (inputArr[$index] = vc)"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                placeholder="请你输入属性值名称"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ $index }">
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              >
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" size="default" @click="save">保存</el-button>
        <el-button type="primary" size="default" @click="cancle"
          >取消</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
//组合式api函数watch
import { watch, ref, reactive, nextTick, onBeforeUnmount } from "vue";
//引入获取已有属性和属性值接口
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from "@/api/product/attr";
import type {
  AttrResponseData,
  Attr,
  AttrValue,
} from "@/api/product/attr/type";
//获取分类的仓库
import useCategoryStore from "@/store/modules/category";
import { ElMessage } from "element-plus";
let categoryStore = useCategoryStore();
//存储已有属性和属性值(请求成功后返回的)
let attrArr = ref<Attr[]>([]);
//监听仓库三级分类ID变化
//定义卡片组件内容切换变量
let scene = ref<number>(0); //0显示tabale，1显示添加或者修改

//收集新增属性的数据
let attrParams = reactive<Attr>({
  attrName: "", //新增属性的名字
  attrValueList: [], //新增的属性值数组
  categoryId: "", //三级分类的id
  categoryLevel: 3, //代表的是三级分类
});
//准备一个数组:将来存储对应的组件实例el-input
let inputArr = ref<any>([]);
watch(
  () => categoryStore.c3Id,
  () => {
    //获取分类的ID
    getAttr();
  }
);
//获取已有的属性与属性值方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore;
  //获取分类下的已有的属性与属性值
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id);
  // console.log(result);

  if (result.code == 200) {
    attrArr.value = result.data;
  }
};
//添加属性按钮回调
const addAttr = () => {
  //每一次点击先清空数据,,Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象,同名属性就修改，不同名就添加
  Object.assign(attrParams, {
    attrName: "", //新增属性的名字
    attrValueList: [], //新增的属性值数组
    categoryId: categoryStore.c3Id, //三级分类的id,//点击按钮时收集当前属性的三级id
    categoryLevel: 3, //代表的是三级分类
  });
  //切换为修改或者添加属性的结构
  scene.value = 1;
  //点击按钮时收集当前属性的三级id
  // attrParams.categoryId = categoryStore.c3Id;
};
//修改属性按钮回调
const updateAttr = (row: Attr) => {
  //切换为修改或者添加属性的结构
  scene.value = 1;
  //将已有的属性对象赋值给attrParams对象即可
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)));
};
//取消按钮回调
const cancle = () => {
  //切换为修改或者添加属性的结构
  scene.value = 0;
};
//添加属性值按钮的回调
const addAttrValue = () => {
  //点击添加属性值按钮的时候,向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: "",
    flag: true, //控制每一个属性值编辑模式与切换模式的切换
  });
  //获取最后el-input组件聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus();
  });
};
//保存按钮的回调
const save = async () => {
  //发i请求
  let result = await reqAddOrUpdateAttr(attrParams);
  //添加属性成功
  if (result.code == 200) {
    //切换场景
    scene.value = 0;
    //提示信息
    ElMessage({
      type: "success",
      message: attrParams.id ? "修改成功" : "添加成功",
    });
    //获取全部已有的属性值
    getAttr();
  } else {
    ElMessage({
      type: "error",
      message: attrParams.id ? "修改失败" : "添加失败",
    });
  }
};
//属性值表单元素失去焦点的事件回调
const toLook = (row: AttrValue, $index: number) => {
  //非法情况判断1不能为空
  if (row.valueName.trim() == "") {
    //删除调用对应属性为空的元素
    attrParams.attrValueList.splice($index, 1);
    ElMessage({
      type: "error",
      message: "属性值不能为空",
    });
    return;
  }
  //非法情况2
  let repeat = attrParams.attrValueList.find((item) => {
    //切记把当前失却焦点属性值对象从当前数组扣除判断
    if (item != row) {
      return item.valueName === row.valueName;
    }
  });
  if (repeat) {
    //将重复的属性值从数组当中干掉
    attrParams.attrValueList.splice($index, 1);
    //提示信息
    ElMessage({
      type: "error",
      message: "属性值不能重复",
    });
    return;
  }
  //相应的属性值对象flag:变为false
  row.flag = false;
};
const toEdit = (row: AttrValue, $index: number) => {
  //相应的属性值对象flag:变为true
  row.flag = true;
  //nextTick:响应式数据发生变化,获取更新的DOM(组件实例)
  //使用nextTick是因为点击后，组件需要加载，没办法第一时间拿到组件实例。所以使用nextTick会等到组件加载完毕后才调用，达到聚焦效果
  nextTick(() => {
    inputArr.value[$index].focus();
  });
};
//删除某一个已有的属性方法回调
const deleteAttr = async (attrId: number) => {
  //发相应的删除已有的属性的请求
  let result: any = await reqRemoveAttr(attrId);
  //删除成功
  if (result.code == 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    //获取一次已有的属性与属性值
    getAttr();
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
};
//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  //清空仓库的数据
  categoryStore.$reset();
});
</script>

<style scoped></style>
