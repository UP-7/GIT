<template>
  <div class="login_container">
    <el-row>
      <!-- xs是小于768px时右侧占全部 -->
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到岩棋甄选</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              type="password"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login_btn"
              type="primary"
              :loading="loading"
              size="default"
              @click="login"
              >登陆</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from "@element-plus/icons-vue";
//收集账号与密码的数据
import { reactive, ref } from "vue";
//引入小仓库
import useUserStore from "@/store/modules/user";
import { useRouter, useRoute } from "vue-router";
import { ElNotification } from "element-plus";
//引入上午下午晚上
import { getTime } from "@/utils/time";
//获取el-form组件
let loginForms = ref();
let useStore = useUserStore();
//获取路由器
let $router = useRouter();
//获取路由
let $route = useRoute();
//控制按钮加载
let loading = ref(false);
let loginForm = reactive({ username: "admin", password: "111111" });
//登录按钮
const login = async () => {
  //保证表单校验通过再发请求
  await loginForms.value.validate();
  //开始加载效果
  loading.value = true;
  //点击后，通知仓库去发登录请求，若成功——展示首页，若失败——弹出登陆失败信息
  try {
    //可以用.then写法
    //保证登陆成功
    await useStore.userLogin(loginForm);
    //编程式导航跳转到展示数据的首页
    //判断登录时路由路径中是否有query,有跳转query，没有首页
    let redirect: any = $route.query.redirect;
    $router.push({ path: redirect || "/" });
    //登陆成功的提示信息
    ElNotification({
      type: "success",
      message: "欢迎回来",
      title: `HI,${getTime()}好！`,
    });
    //登陆成功加载效果消失
    loading.value = false;
  } catch (error) {
    //登陆失败加载效果消失
    loading.value = false;
    ElNotification({
      type: "error",
      message: (error as Error).message,
    });
  }
};
//自定义校验
const validatorUsername = (_rule: any, value: any, callback: any) => {
  //rule：校验规则对象，value：表单元素文本内容,callback:返回函数：如果符合条件callback放行通过，不符合注入错误提示信息
  if (value.length >= 5) {
    callback();
  } else {
    callback(new Error("账号长度不少于5位"));
  }
};
const validatorPassword = (_rule: any, value: any, callback: any) => {
  //rule：校验规则对象，value：表单元素文本内容,callback:返回函数：如果符合条件callback放行通过，不符合注入错误提示信息
  if (value.length >= 6) {
    callback();
  } else {
    callback(new Error("密码长度不少于6位"));
  }
};
//定义表单校验需要的对象
const rules = {
  username: [
    //规则对象属性：required:字段必须校验；
    // { required: true, min: 5, max: 10, message: "账号长度必须为6-10位", trriger: "change"},
    { trriger: "change", validator: validatorUsername },
  ],
  password: [
    // { required: true, min: 6, max: 12,  message: "密码长度必须为6-12位", trriger: "change",},
    { trriger: "change", validator: validatorPassword },
  ],
};
</script>

<style scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background: url("@/assets/images/background.jpg") no-repeat;
  background-size: cover;
}
.login_form {
  position: relative;
  width: 80%;
  top: 30vh;
  background: url("@/assets/images/login_form.png") no-repeat;
  background-size: cover;
  padding: 40px;
}
h1 {
  color: white;
  font-size: 40px;
}
h2 {
  font-size: 20px;
  color: white;
  margin: 20px 0px;
}
.login_btn {
  width: 100%;
}
</style>
