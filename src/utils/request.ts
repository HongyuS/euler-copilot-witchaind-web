import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { useUserStoreHook } from "@/store/modules/user";
import { ResultEnum } from "@/enums/ResultEnum";
import { TOKEN_KEY } from "@/enums/CacheEnum";
import qs from "qs";
import i18n from "@/lang/index";
import { IconError } from "@computing/opendesign-icons";

// 创建 axios 实例
const service = axios.create({
  baseURL: "/api",
  timeout: 90000,
  withCredentials: true,
  headers: {
    "Access-control-allow-origin": "*",
  },
  paramsSerializer: (params) => {
    return qs.stringify(params);
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem(TOKEN_KEY);
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 检查配置的响应类型是否为二进制类型（'blob' 或 'arraybuffer'）, 如果是，直接返回响应对象
    if (
      response.config.responseType === "blob" ||
      response.config.responseType === "arraybuffer"
    ) {
      return response;
    }

    const { retcode, data, retmsg } = response?.data;
    if (retcode?.toString() === ResultEnum.SUCCESS) {
      return data;
    }
    ElMessage({
      showClose: true,
      message: retmsg || i18n.global.t("pageTipText.systemError"),
      icon: IconError,
      customClass: "o-message--error",
      duration: 3000,
    });
    return Promise.reject(new Error(retmsg || "Error"));
  },
  (error: any) => {
    // 异常处理
    if (error?.response?.data) {
      const { retcode, retmsg } = error.response.data;
      if (retcode?.toString() === ResultEnum.TOKEN_INVALID) {
        if (error?.config?.url === "/user/login") {
          ElMessage({
            showClose: true,
            message: i18n.global.t("login.message.loginTip"),
            icon: IconError,
            customClass: "o-message--error",
            duration: 3000,
          });
        } else {
          ElNotification({
            title: i18n.global.t("dialogTipText.tipsText"),
            message: i18n.global.t("login.message.loginToken"),
            type: "info",
          });
          useUserStoreHook()
            .resetToken()
            .then(() => {
              location.reload();
            });
        }
      } else {
        ElMessage({
          showClose: true,
          message: retmsg || error?.message,
          icon: IconError,
          customClass: "o-message--error",
          duration: 3000,
        });
      }
    } else {
      ElMessage({
        showClose: true,
        message: error?.message,
        icon: IconError,
        customClass: "o-message--error",
        duration: 3000,
      });
    }
    return Promise.reject(error.message);
  }
);

// 导出 axios 实例
export default service;
