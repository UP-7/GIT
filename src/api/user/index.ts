//统一管理项目用户相关接口
import request from "@/utils/request";
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from "./type";
//统一管理接口
//项目用户相关的请求地址
enum API {
  LOGIN_URL = "http://114.115.179.162:8022/prod-api/admin/acl/index/login",
  USERINFO_URL = "http://114.115.179.162:8022/prod-api/admin/acl/index/info",
  LOGOUT_URL = "http://114.115.179.162:8022/prod-api/admin/acl/index/logout",
}
//暴露请求函数，登录接口方法
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data);
//获取用户信息接口方法
export const reqUserInfo = () =>
  request.get<any, userInfoResponseData>(API.USERINFO_URL);
//退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL);
