<template>
  <el-card class="box-card">
    <!-- 卡片顶部添加品牌按钮 -->
    <el-button
      type="primary"
      size="default"
      icon="Plus"
      @click="addTrademark"
      v-has="`btn.Trademark.add`"
      >添加品牌</el-button
    >
    <!-- 表格组件，用于展示已有的数据 -->
    <!-- 
      table
      ---border:是否有纵向的边框
      table-column
      ---lable：某一个列表
      ---width：设置这一列的宽度
      ---align：设置这一列对齐方式
     -->
    <el-table style="margin: 10px 0px" border :data="trademarkArr">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <!-- 默认用div展示内容,若用其他不能用div,则需要用template插槽 -->
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template #="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="(_$event) => updateTrademark(row)"
            v-has="`btn.Trademark.update`"
          ></el-button>
          <el-popconfirm
            :title="`您确定要删除${row.tmName}吗？`"
            @confirm="removeTradeMark(row.id)"
            icon="Delete"
            width="250px"
          >
            <template #reference>
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                v-has="`btn.Trademark.remove`"
              ></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件 -->
    <!-- 
      pagination
      ---v-model:current-page：设置当前分页器页码
      ---v-model:page-size:设置每一也展示数据条数
      ---page-sizes：每页显示个数选择器的选项设置
      ---background:背景颜色
      ---layout：分页器6个子组件布局的调整 "->"把后面的子组件顶到右侧
     -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout=" prev, pager, next, jumper,->,total, sizes,"
      :total="total"
      @current-change="getHasTrademark"
      @size-change="sizeChange"
    />
  </el-card>
  <!-- 对话框组件,添加品牌和修改品牌时使用的结构 -->
  <!-- v-model用于控制对话框显示和隐藏true/false
  title:对话框左上角标题 -->
  <div>
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
      width="500"
    >
      <el-form
        style="width: 80%"
        :model="trademarkParams"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="品牌名称" label-width="80px" prop="tmName">
          <el-input
            placeholder="请您输入品牌名称"
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="80px" prop="logoUrl">
          <!-- upload属性：
                  action图片上传路径书写/api，否则代理服务器不会发送请求
                  beforeupload上传文件之前可以约束上传的类型和大小等
                 -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽:footer -->
      <template #footer>
        <el-button type="primary" size="default" @click="cancel"
          >取消</el-button
        >
        <el-button type="primary" size="default" @click="confirm"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from "@/api/product/trademark";
//引入组合式API函数
import { ref, onMounted, reactive, nextTick } from "vue";
import type {
  Records,
  TradeMark,
  TradeMarkResponseData,
} from "@/api/product/trademark/type";
import { ElMessage, UploadProps } from "element-plus";
//当前页码
let pageNo = ref<number>(1);
//每一页展示的数据
let limit = ref<number>(3);
//存储已有品牌数据总数
let total = ref<number>(0);
//存储已有品牌的数据
let trademarkArr = ref<Records>([]);
//控制对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false);
//定义一个收集新增品牌的数据
let trademarkParams = reactive<TradeMark>({
  tmName: "",
  logoUrl: "",
});
//获取el-form组件实例
let formRef = ref();
//获取已有品牌的接口封装为一个函数:在任何情况下向获取数据,调用次函数即可
const getHasTrademark = async (pager = 1) => {
  //当前页码,若调用此方法时,没有传参,则pager默认为1,给事件注入回调了
  pageNo.value = pager;
  let result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value
  );
  // console.log(result);
  if (result.code == 200) {
    //存储已有品牌总个数
    total.value = result.data.total;
    trademarkArr.value = result.data.records;
    // console.log(trademarkArr);
  }
};
//组件挂载完毕钩子---发一次请求,获取第一页、一页三个已有品牌数据
onMounted(() => {
  getHasTrademark();
});
//分页器当前页码发生变化时触发
//对于当前页码发生变化自定义事件,组件pagination父组件回传了数据,当前页码数据回传
// const changePageNo = () => {
//   //当前页码发生变化时,再次发请求获取对应的已有品牌数据展示
//   getHasTrademark();
// };
//当下拉菜单发生变化时触发方法
const sizeChange = () => {
  //当前页码发生变化时,页码回归到第一页
  // pageNo.value = 1;

  getHasTrademark();
};
//添加品牌按钮回调
const addTrademark = () => {
  dialogFormVisible.value = true;
  //清空原有收集数据
  trademarkParams.tmName = "";
  trademarkParams.logoUrl = "";
  trademarkParams.id = 0;
  //清空提示信息
  nextTick(() => {
    formRef.value.clearValidate("tmName");
    formRef.value.clearValidate("logoUrl");
  });
};
//修改品牌按钮回调
const updateTrademark = (row) => {
  //清空提示信息
  nextTick(() => {
    formRef.value.clearValidate("tmName");
    formRef.value.clearValidate("logoUrl");
  });
  dialogFormVisible.value = true;
  //row为当前的品牌,展示已有品牌数据
  Object.assign(trademarkParams, row);
  // trademarkParams.tmName = row.tmName;
  // trademarkParams.logoUrl = row.logoUrl;
  // //收集id
  // trademarkParams.id = row.id;
};
//对话框隐藏
const cancel = () => {
  dialogFormVisible.value = false;
};
const confirm = async () => {
  //在你发请求之前,要对于整个表单进行校验
  //调用这个方法进行全部表单相校验,如果校验全部通过，在执行后面的语法await
  await formRef.value.validate();
  let result: any = await reqAddOrUpdateTrademark(trademarkParams);
  //添加|修改已有品牌
  if (result.code == 200) {
    //关闭对话框
    dialogFormVisible.value = false;
    //弹出提示信息
    ElMessage({
      type: "success",
      message: trademarkParams.id ? "修改品牌成功" : "添加品牌成功",
    });
    //再次发请求获取已有全部的品牌数据
    getHasTrademark(trademarkParams.id ? pageNo.value : 1);
  } else {
    //添加品牌失败
    ElMessage({
      type: "error",
      message: trademarkParams.id ? "修改品牌失败" : "添加品牌失败",
    });
    //关闭对话框
    dialogFormVisible.value = false;
  }
};
//上传图片成功前，触发的钩子函数，注入文件，上传文件之前可以约束上传的类型和大小等
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  //钩子是在图片上传成功之前触发,上传文件之前可以约束文件类型与大小
  //要求:上传文件格式png|jpg|gif 4M
  if (
    rawFile.type == "image/png" ||
    rawFile.type == "image/jpeg" ||
    rawFile.type == "image/gif"
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true;
    } else {
      ElMessage({
        type: "error",
        message: "上传文件大小小于4M",
      });
      return false;
    }
  } else {
    ElMessage({
      type: "error",
      message: "上传文件格式务必PNG|JPG|GIF",
    });
    return false;
  }
};
//图片上传成功钩子
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  _uploadFile
) => {
  //response:即为当前这次上传图片post请求服务器返回的数据
  //收集上传图片的地址,添加一个新的品牌的时候带给服务器
  trademarkParams.logoUrl = response.data;
  //图片上传成功,清除掉对应图片校验结果
  formRef.value.clearValidate("logoUrl");
};
//品牌自定义校验规则方法
const validatorTmName = (_rule: any, value: any, callBack: any) => {
  //是当表单元素触发blur时候,会触发此方法
  //自定义校验规则
  if (value.trim().length >= 2) {
    callBack();
  } else {
    //校验未通过返回的错误的提示信息
    callBack(new Error("品牌名称位数大于等于两位"));
  }
};
//品牌LOGO图片的自定义校验规则方法
const validatorLogoUrl = (_rule: any, value: any, callBack: any) => {
  //如果图片上传
  if (value) {
    callBack();
  } else {
    callBack(new Error("LOGO图片务必上传"));
  }
};
//表单校验规则对象
const rules = {
  tmName: [
    //required:这个字段务必校验,表单项前面出来五角星
    //trigger:代表触发校验规则时机[blur、change]
    { required: true, trigger: "blur", validator: validatorTmName },
  ],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
};
//气泡确认框确定按钮的回调
const removeTradeMark = async (id: number) => {
  //点击确定按钮删除已有品牌请求
  let result = await reqDeleteTrademark(id);
  if (result.code == 200) {
    //删除成功提示信息
    ElMessage({
      type: "success",
      message: "删除品牌成功",
    });
    //再次获取已有的品牌数据
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1 //若当前页数数据长度大于1，回到当前页，否则-1回到上一页
    );
  } else {
    ElMessage({
      type: "error",
      message: "删除品牌失败",
    });
  }
};
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
