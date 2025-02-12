import request from "@/utils/request";
import CryptoJS from "crypto-js"; // 导入 CryptoJS

class AuthAPI {
  /** 注册 接口*/
  static signin(data: SigninData) {
    const hashPwd = CryptoJS.SHA256(data.passwd).toString();
    const newData = { ...data, passwd: hashPwd };
    return request({
      url: `/user/add`,
      method: "post",
      data: newData,
    });
  }
  
  /** 登录 接口*/
  static login(data: LoginData) {
    const hashPwd = CryptoJS.SHA256(data.password).toString();
    const newData = { ...data, password: hashPwd };
    return request({
      url: `/user/login`,
      method: "get",
      params: newData,
    });
  }

  /** 注销 接口*/
  static logout() {
    return request({
      url: `/user/logout`,
      method: "get",
    });
  }

  /** 注销 接口*/
  static userUpdate(data: userUpade) {
    return request({
      url: `/user/update`,
      method: "post",
      data: data,
    });
  }
}

export default AuthAPI;
/** 登录请求参数 */
export interface LoginData {
  /** 用户名 */
  account: string;
  /** 密码 */
  password: string;
}
export interface SigninData {
  /** 用户名 */
  account: string;
  /** 密码 */
  passwd: string;
  /** 昵称 */
  name: string;
  /** 邮箱 */
  email:string;
}

export interface userUpade {
  account?: string;
  language?: string;
  name?: string;
  passwd?: string;
  role?: string;
  status?: string;
  [property: string]: any;
}
