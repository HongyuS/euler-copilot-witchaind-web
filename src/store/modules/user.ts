import AuthAPI, { SigninData, type LoginData } from '@/api/auth';
import { type UserInfo } from '@/api/user';
import { resetRouter } from '@/router';
import { store } from '@/store';
import { TOKEN_KEY } from '@/enums/CacheEnum';

export const useUserStore = defineStore('user', () => {
  const user = ref<UserInfo>({
    roles: [],
    perms: []
  });

  /**
   * 登录
   *
   * @param {LoginData}
   * @returns
   */
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.login(loginData)
        .then((data: any) => resolve(data))
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 注册
   *
   * @param {signinData}
   * @returns
   */
  function signin(signinData: SigninData) {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.signin(signinData)
        .then((data: any) => resolve(data))
        .catch((error) => {
          reject(error);
        });
    });
  }

  // user logout
  function logout() {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.logout()
        .then((data: any) => resolve(data))
        .catch((error) => {
          reject(error);
        });
    });
  }

  // remove token
  function resetToken() {
    return new Promise<void>((resolve) => {
      document.cookie = '';
      resetRouter();
      resolve();
    });
  }

  return {
    user,
    login,
    logout,
    resetToken,
    signin
  };
});

/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export function useUserStoreHook() {
  return useUserStore(store);
}
