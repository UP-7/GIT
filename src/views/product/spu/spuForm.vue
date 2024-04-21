<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请你输入SPU名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId">
        <el-option
          v-for="item in MyAllTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请你输入SPU描述"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <!-- v-model:file-list="fileList"展示默认图片
      action:上传图片的接口
    list-type：文件列表的类型
  on-preview：点击文件列表中已上传的钩子（预览） -->
      <el-upload
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <!-- 查看图片，放大删除等 -->
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性" size="default">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select
        v-model="saleAttrIdAndValuename"
        :placeholder="
          unSalectSaleAttr.length
            ? `还有${unSalectSaleAttr.length}个未选择`
            : '无'
        "
      >
        <el-option
          v-for="item in unSalectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        :disabled="saleAttrIdAndValuename ? false : true"
        style="margin-left: 10px; margin-top: 10px"
        type="primary"
        size="default"
        icon="Plus"
        @click="addSaleAttr"
      >
        添加属性
      </el-button>
      <!-- table展示销售属性与属性值的地方 -->
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="销售属性名字"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="销售属性值">
          <!-- row:即为当前SPU已有的销售属性对象 -->
          <template #="{ row }">
            <el-tag
              class="mx-1"
              closable
              style="margin: 0px 5px"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="row.id"
            >
              <!-- @close="row.spuSaleAttrValueList.splice(index, 1)"删掉点叉的内容 -->
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              v-model="row.saleAttrValue"
              @blur="toLook(row)"
              v-if="row.flag == true"
              placeholder="请你输入属性值"
              size="small"
              style="width: 100px"
            ></el-input>
            <el-button
              @click="toEdit(row)"
              v-else
              type="primary"
              size="small"
              icon="Plus"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ $index }">
            <el-button
              type="primary"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        :disabled="saleAttr.length ? false : true"
        type="primary"
        size="default"
        @click="save"
        >保存</el-button
      >
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type {
  SpuData,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  TradeMark,
  SpuImg,
  SaleAttr,
  HasSaleAttr,
  SaleAttrValue,
} from "@/api/product/spu/type";
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from "@/api/product/spu";

import { ElMessage } from "element-plus";
//存储已有的spu这些数据
let MyAllTradeMark = ref<TradeMark[]>([]);
//所有的照片墙数据
let imgList = ref<SpuImg[]>([]);
//已有spu销售属性
let saleAttr = ref<SaleAttr[]>([]);
//全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([]);

//控制dialog的显示与隐藏
let dialogVisible = ref<boolean>(false);
//存储预览图片的地址
let dialogImageUrl = ref<string>("");
//存储已有的spu对象
let SpuParams = ref<SpuData>({
  category3Id: "", //收集三级分类的ID
  spuName: "", //SPU的名字
  tmId: "", //品牌的ID
  description: "", //SPU的描述
  spuImageList: [],
  spuSaleAttrList: [],
});
//将来收集还未选择的销售属性的id,name
let saleAttrIdAndValuename = ref<string>("");
//自定义事件
let $emit = defineEmits(["changeScene"]);
//取消按钮的回调
const cancel = () => {
  $emit("changeScene", { flag: 0, params: "" });
};
//子组件书写一个方法
const initHasSpuData = async (spu: SpuData) => {
  //存储已有的spu对象，将来展示
  SpuParams.value = spu;
  //spu:即为父组件传递过来的已有的spu对象（不完整）
  //获取全部品牌数据
  let result: AllTradeMark = await reqAllTradeMark();
  //获取某一个品牌旗下的全部售卖商品的图片
  let result1: SpuHasImg = await reqSpuImageList(spu.id);
  //获取已有的spu数据的销售属性
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id);
  //获取整个项目全部的spu销售属性
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr();
  //存储全部品牌的数据
  MyAllTradeMark.value = result.data;
  //存储spu对应的商品图片,将照片对象中的imgName和imgUrl修改为name，url,，照片墙v-model:file-list="fileList"才能显示默认图片
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    };
  });
  //存储已有的SPU的销售属性
  saleAttr.value = result2.data;
  //存储全部的销售属性
  allSaleAttr.value = result3.data;
};
//照片墙点击预览按钮的回调
const handlePictureCardPreview = (file: any) => {
  //对话框出现
  dialogVisible.value = true;
  //file是要预览的图片对象
  dialogImageUrl.value = file.url;
};
//照片墙删除文件钩子
const handleRemove = () => {};
//照片墙上传成功之前的钩子(约束上传文件的大小类型等等)
//照片钱上传成功之前的钩子约束文件的大小与类型
const handlerUpload = (file: any) => {
  if (
    file.type == "image/png" ||
    file.type == "image/jpeg" ||
    file.type == "image/gif"
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true;
    } else {
      ElMessage({
        type: "error",
        message: "上传文件务必小于3M",
      });
      return false;
    }
  } else {
    ElMessage({
      type: "error",
      message: "上传文件务必PNG|JPG|GIF",
    });
    return false;
  }
};
//当前spu还为拥有的销售属性,所有的减去已有的
let unSalectSaleAttr = computed(() => {
  //全部销售属性一共三个：颜色，版本，尺码
  //已有俩过滤出一个
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName;
    });
    //every联合filter计算，every全真才行
  });
  return unSelectArr;
});
//添加销售属性的方法回调
const addSaleAttr = () => {
  //这些属性要有
  //  baseSaleAttrId: number | string;
  //   saleAttrName: string;
  //   spuSaleAttrValueList: SpuSaleAttrValueList;
  const [baseSaleAttrId, saleAttrName] =
    saleAttrIdAndValuename.value.split(":"); //解构一下未选择的id和name
  //准备一个新的销售属性对象，带给服务器
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  };
  //追加到数组当中
  saleAttr.value.push(newSaleAttr);
  //清空收集的数据
  saleAttrIdAndValuename.value = "";
};
//属性值按钮的点击事件
const toEdit = (row: SaleAttr) => {
  row.flag = true;
  row.saleAttrValue = ""; //追加一个销售属性值
};
//表单元素失却焦点的事件回调
const toLook = (row: SaleAttr) => {
  //整理收集的属性的ID与属性值的名字
  const { baseSaleAttrId, saleAttrValue } = row;
  //整理成服务器需要的属性值形式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  };

  //非法情况判断
  if ((saleAttrValue as string).trim() == "") {
    ElMessage({
      type: "error",
      message: "属性值不能为空的",
    });
    row.flag = false;
    return;
  }
  //判断属性值是否在数组当中存在
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue;
  });

  if (repeat) {
    ElMessage({
      type: "error",
      message: "属性值重复",
    });
    return;
  }
  //追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue);
  //切换为查看模式
  row.flag = false;
};
//保存按钮的回调
const save = async () => {
  //整理参数
  //1照片墙数据，把name和url改回imgName和imgUrl
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name, //图片的名字
      imgUrl: (item.response && item.response.data) || item.url, //新增的要用response里的||已有的直接传
    };
  });
  //2:整理销售属性的数据
  SpuParams.value.spuSaleAttrList = saleAttr.value;
  //发请求：添加或更新SPU，

  let result = await reqAddOrUpdateSpu(SpuParams.value);
  //成功
  if (result.code == 200) {
    ElMessage({
      type: "success",
      message: SpuParams.value.id ? "更新成功" : "添加成功",
    });
    //通知父组件切换场景为0
    $emit("changeScene", {
      flag: 0,
      params: SpuParams.value.id ? "update" : "add",
    });
  } else {
    //失败
    ElMessage({
      type: "error",
      message: SpuParams.value.id ? "更新失败" : "添加失败",
    });
  }
};
//添加一个新的SPU初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
  //清空数据
  Object.assign(SpuParams.value, {
    category3Id: "", //收集三级分类的ID
    spuName: "", //SPU的名字
    tmId: "", //品牌的ID
    description: "", //SPU的描述
    spuImageList: [],
    spuSaleAttrList: [],
  });
  //清空照片
  imgList.value = [];
  //清空销售属性
  saleAttr.value = [];
  //清空
  saleAttrIdAndValuename.value = "";
  //存储三级分类的ID
  SpuParams.value.category3Id = c3Id;
  //获取全部品牌数据
  let result: AllTradeMark = await reqAllTradeMark();
  //获取整个项目全部的spu销售属性
  let result1: HasSaleAttrResponseData = await reqAllSaleAttr();
  //存储全部品牌的数据
  MyAllTradeMark.value = result.data;
  //存储所有的销售属性
  allSaleAttr.value = result1.data;
};
//对外暴露
defineExpose({ initHasSpuData, initAddSpu });
</script>

<style scoped></style>
