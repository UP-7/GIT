<template>
  <div>
    <el-table
      :data="PermissionArr"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作">
        <!-- row:即为已有的菜单对象|按钮的对象的数据 -->
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            :disabled="row.level == 4 ? true : false"
            @click="addPermission(row)"
          >
            {{ row.level == 3 ? "添加功能" : "添加菜单" }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            :disabled="row.level == 1 ? true : false"
            @click="updatePermission(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.name}?`"
            width="260px"
            @confirm="removeMenu(row.id)"
          >
            <template #reference>
              <el-button
                type="primary"
                size="small"
                :disabled="row.level == 1 ? true : false"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框组件:添加或者更新已有的菜单的数据结构 -->
    <el-dialog v-model="dialogVisible">
      <!-- 表单组件:收集新增与已有的菜单的数据 -->
      <el-form>
        <el-form-item label="名称">
          <el-input
            v-model="menuData.name"
            placeholder="请你输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-input
            v-model="menuData.code"
            placeholder="请你输入权限数值"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import {
  reqAllPermission,
  reqAddOrUpdateMenu,
  reqRemoveMenu,
} from "@/api/acl/permission";
import type {
  PermissionResponseData,
  PermissionList,
  Permission,
  MenuParams,
} from "@/api/acl/permission/type";
import { ElMessage } from "element-plus";
//存储菜单的数据
let PermissionArr = ref<PermissionList>([]);
//对话框显示
let dialogVisible = ref<any>(false);
//携带的参数
let menuData = reactive<MenuParams>({
  code: "",
  level: 0,
  name: "",
  pid: 0,
});
//组件挂载完毕
onMounted(() => {
  getHasPermisstion();
});
//获取菜单数据的方法
const getHasPermisstion = async () => {
  let result: PermissionResponseData = await reqAllPermission();
  if (result.code == 200) {
    PermissionArr.value = result.data;
  }
};
//添加菜单按钮的回调
const addPermission = (row: Permission) => {
  //清空数据
  Object.assign(menuData, {
    id: 0,
    code: "",
    level: 0,
    name: "",
    pid: 0,
  });
  //对话框显示出来
  dialogVisible.value = true;
  //收集新增的菜单的level数值:已有菜单的level加1
  menuData.level = row.level + 1;
  //给谁新增子菜单
  menuData.pid = row.id as number;
};
//编辑已有的菜单
const updatePermission = (row: Permission) => {
  dialogVisible.value = true;
  //点击修改按钮:收集已有的菜单的数据进行更新
  Object.assign(menuData, row);
};
//确定按钮的回调
const save = async () => {
  //发请求:新增子菜单|更新某一个已有的菜单的数据
  let result: any = await reqAddOrUpdateMenu(menuData);
  if (result.code == 200) {
    //对话框隐藏
    dialogVisible.value = false;
    //提示信息
    ElMessage({
      type: "success",
      message: menuData.id ? "更新成功" : "添加成功",
    });
    //再次获取全部最新的菜单的数据
    getHasPermisstion();
  } else {
    //对话框隐藏
    dialogVisible.value = false;
    ElMessage({
      type: "error",
      message: menuData.id ? "更新失败" : "添加失败",
    });
  }
};
//删除按钮回调
const removeMenu = async (id: number) => {
  let result: any = await reqRemoveMenu(id);
  if (result.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHasPermisstion();
  }
};
</script>

<style scoped></style>
