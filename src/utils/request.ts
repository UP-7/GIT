//进行axios二次封装：使用请求与响应拦截器
import axios from "axios";
import { ElMessage } from "element-plus";
//引入用户相关的仓库
import useUserStore from "@/store/modules/user";
//第一步：使用axios对象的create方法，去创造axios实例（其他的配置：基础路径、超过的时间）
let request = axios.create({
  //基础路径
  baseURL: import.meta.env.VITE_APP_BASE_API, //基础路径上会携带/api
  timeout: 5000, //超时时间设置（请求必须在五秒内完成）
});
//第二步：request实例添加请求和响应拦截器
request.interceptors.request.use((config) => {
  //获取用户相关的小仓库：获取仓库内部token，登录成功后携带给服务器
  let userStore = useUserStore();
  if (userStore.token) {
    config.headers.token = userStore.token; //携带上token给服务器，告诉服务器我要找哪个
  }
  //返回配置对象，config配置对象有一个叫headers属性，就是请求头，经常给服务器端携带公共参数
  return config;
});
//第三步：响应拦截器
request.interceptors.response.use(
  (response) => {
    //成功回调,简化数据
    return response.data;
  },
  (error) => {
    //失败回调：处理http网络错误
    //定义一个变量：存储网络错误信息
    let message = "";
    //http状态码
    let status = error.response.status;
    switch (status) {
      case 401:
        message = "TOKEN过期";
        break;
      case 403:
        message = "无权访问";
        break;
      case 404:
        message = "请求地址错误";
        break;
      case 500:
        message = "服务器出现问题";
        break;
      default:
        message = "网络出现问题";
        break;
    }
    //提示错误信息
    ElMessage({
      type: "error",
      message,
    });
    return Promise.reject(error); //返回失败的对象，终结失败
  }
);
//对外暴露

export default request;
