import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from "vue-router";

import NProgress from "@/utils/nprogress";
import { TOKEN_KEY } from "@/enums/CacheEnum";
import router from "@/router";

export function setupPermission() {
  // 白名单路由
  const whiteList = ["/login", "/NotFoundPage"];

  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const hasToken = document.cookie;
    if (hasToken?.length === 0 && !["/login", "/"].includes(to.path)) {
      next({ path: "/login" });
      NProgress.done();
    } else {
      // 未登录
      if (whiteList.includes(to.path)) {
        next(); // 在白名单，直接进入
      } else {
        // 不在白名单，重定向到登录页
        next();
      }
    }
  });

  router.afterEach(() => {
    NProgress.done();
  });
}

/** 重定向到登录页 */
function redirectToLogin(
  to: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  next(`/login`);
}
