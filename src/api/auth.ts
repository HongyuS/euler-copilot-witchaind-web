import request from "@/utils/request";

class AuthAPI {
  /** 登录 接口*/
  static login(data: LoginData) {
    return request({
      url: `/user/login`,
      method: "get",
      params: data,
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

export interface userUpade {
  account?: string;
  language?: string;
  name?: string;
  passwd?: string;
  role?: string;
  status?: string;
  [property: string]: any;
}
