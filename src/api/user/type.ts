//登录接口需要的参数ts类型
//用户登录接口携带参数的ts类型
export interface loginFormData {
  username: string;
  password: string;
}
//全部接口返回的数据都有ts类型
export interface ResponseData {
  code: number;
  message: string;
  ok: boolean;
}
//登录接口返回数据类型
export interface loginResponseData extends ResponseData {
  data: string;
}
//定义服务器返回用户信息相关的数据类型
export interface userInfoResponseData extends ResponseData {
  data: {
    buttons: any;
    routes: string[];
    button: string[];
    roles: string[];
    name: string;
    avatar: string;
  };
}
