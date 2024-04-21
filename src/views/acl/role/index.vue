<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索">
        <el-input
          placeholder="请你输入搜索职位关键字"
          v-model="keyword"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="keyword ? false : true"
          @click="search"
          type="primary"
          size="default"
          >搜索</el-button
        >
        <el-button @click="reset" type="primary" size="default">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card>
    <el-button type="primary" size="default" icon="Plus" @click="addRole"
      >添加职位</el-button
    >
    <el-table border style="margin: 10px 0px" :data="allRole">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="职位名称"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        show-overflow-tooltip
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        show-overflow-tooltip
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <!-- row:已有的职位对象 -->
        <template #="{ row }">
          <el-button
            @click="setPermission(row)"
            type="primary"
            size="small"
            icon="User"
          >
            分配权限
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateRole(row)"
            >编辑</el-button
          >
          <el-popconfirm
            @confirm="removeRole(row.id)"
            :title="`你确定要删除${row.roleName}?`"
            width="260px"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <el-pagination
    v-model:current-page="pageNo"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 30, 40]"
    :background="true"
    layout="prev, pager, next, jumper,->,sizes,total"
    :total="total"
    @current-change="getHasRole"
    @size-change="sizeChange"
  />
  <!-- 添加职位与更新已有职位的结构:对话框 -->
  <el-dialog v-model="dialogVisite" title="添加职位">
    <el-form :model="RoleParams" :rules="rules" ref="form">
      <el-form-item label="职位名称" prop="roleName">
        <el-input
          v-model="RoleParams.roleName"
          placeholder="请你输入职位名称"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="dialogVisite = false">
        取消
      </el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-dialog>
  <!-- 抽屉组件：分配职位的菜单权限与按钮的权限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 
      data：展示的数据
      show-checkbox：节点是否可被选择
      node-key：每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
      default-expand-all：默认展开所有节点
      default-checked-keys：默认勾选的节点的 key 的数组
      props：属性： label：指定节点标签为节点对象的某个属性值 children:指定子树为节点对象的某个属性值-->
      <el-tree
        style="max-width: 600px"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
        ref="tree"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from "vue";
import {
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermisstion,
  reqRemoveRole,
} from "@/api/acl/role";
import type {
  RoleResponseData,
  Records,
  RoleData,
  MenuResponseData,
} from "@/api/acl/role/type";
import useLayOutSettingStore from "@/store/modules/setting";
import { ElMessage } from "element-plus";
//获取模板setting仓库
let settingStore = useLayOutSettingStore();
//当前页码
let pageNo = ref<number>(1);
//一页展示几条数据
let pageSize = ref<number>(10);
//搜索职位关键字
let keyword = ref<string>("");
let total = ref<number>(0);
let allRole = ref<Records>([]);
//对话框显示与隐藏
let dialogVisite = ref<boolean>(false);
//收集新增职位数据
let RoleParams = reactive<any>({
  roleName: "",
});
//抽屉
let drawer = ref<boolean>(false);
// 获取form组件实例
let form = ref<any>();
//定义数组去存储用户权限的数据
let menuArr = ref<any>([]);
//存储勾选的四级节点id的数组
let selectArr = ref<any>([]);
//获取tree树形控件组件实例
let tree = ref<any>();
//组件挂载完毕
onMounted(() => {
  //获取职位请求
  getHasRole();
});
//获取全部用户信息的方法|分页器当前页码发生变化的回调
const getHasRole = async (pager = 1) => {
  //修改当前页码
  pageNo.value = pager;
  let result: RoleResponseData = await reqAllRoleList(
    pageNo.value,
    pageSize.value,
    keyword.value
  );
  if (result.code == 200) {
    total.value = result.data.total;
    allRole.value = result.data.records;
  }
};
//分页器
const sizeChange = () => {
  getHasRole();
};
//搜索按钮回调
const search = () => {
  getHasRole();
  keyword.value = "";
};
//重置按钮回调
const reset = () => {
  settingStore.refsh = !settingStore.refsh;
};
//添加职位按钮的回调
const addRole = () => {
  //对话框显示出来
  dialogVisite.value = true;
  //清空数据
  Object.assign(RoleParams, {
    roleName: "",
    id: 0,
  });
  //清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate("roleName");
  });
};
//更新已有的职位按钮的回调
const updateRole = (row: RoleData) => {
  //显示出对话框
  dialogVisite.value = true;
  //存储已有的职位----带有ID的
  Object.assign(RoleParams, row);
  //清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate("roleName");
  });
};
//自定义校验规则的回调
const validatorRoleName = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack();
  } else {
    callBack(new Error("职位名称至少两位"));
  }
};
//职位校验规则
const rules = {
  roleName: [{ required: true, trigger: "blur", validator: validatorRoleName }],
};
//保存按钮的回调
const save = async () => {
  //表单校验结果，结果通过发送请求，没有的话不发请求
  await form.value.validate(); //返回promise对象
  //添加职位|更新职位的请求
  let result: any = await reqAddOrUpdateRole(RoleParams);
  if (result.code == 200) {
    ElMessage({
      type: "success",
      message: RoleParams.id ? "更新成功" : "添加成功",
    });
    //对话框消失
    dialogVisite.value = false;
    //再次获取全部已有的职位
    getHasRole(RoleParams.id ? pageNo.value : 1);
  } else {
    ElMessage({
      type: "error",
      message: RoleParams.id ? "更新失败" : "添加失败",
    });
  }
};
//分配权限按钮回调:row已有职位的数组
const setPermission = async (row: RoleData) => {
  //抽屉显示
  drawer.value = true;
  //收集当前要分配权限的职位数组
  Object.assign(RoleParams, row);
  //根据职位获取权限的数据
  let result: MenuResponseData = await reqAllMenuList(RoleParams.id);
  if (result.code == 200) {
    menuArr.value = result.data;
    selectArr.value = filterSelectArr(menuArr.value, []);
  }
};
const defaultProps = {
  children: "children",
  label: "name",
};
//过滤四级id
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id);
    }
    //递归，继续判断孩子，是否满足条件
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr);
    }
  });

  return initArr;
};
//抽屉确定按钮的回调
const handler = async () => {
  //职位的id
  const roleId = RoleParams.id;
  //选中节点的id
  let arr = tree.value.getCheckedKeys();
  //半选的id
  let arr1 = tree.value.getHalfCheckedKeys();
  //合并两个id
  let permissionId = arr.concat(arr1);
  //下发权限
  let result: any = await reqSetPermisstion(roleId, permissionId);
  if (result.code == 200) {
    //抽屉关闭
    drawer.value = false;
    ElMessage({ type: "success", message: "分配权限成功" });
    //页面刷新:为了重新获取用户信息，重新分配权限了所以重新登陆
    window.location.reload();
  }
};
//删除已有的职位
const removeRole = async (id: number) => {
  let result: any = await reqRemoveRole(id);
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: "success", message: "删除成功" });
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }
};
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>
