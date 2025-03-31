import { RouteRecordRaw } from 'vue-router';
import { constantRoutes } from '@/router';
import { store } from '@/store';
import MenuAPI, { RouteVO } from '@/api/menu';

const modules = import.meta.glob('../../views/**/**.vue');

export const usePermissionStore = defineStore('permission', () => {
  /** 所有路由，包括静态和动态路由 */
  const routes = ref<RouteRecordRaw[]>([]);

  /**
   * 生成动态路由
   */
  function generateRoutes() {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      MenuAPI.getRoutes()
        .then((data) => {
          const dynamicRoutes = transformRoutes(data);
          routes.value = constantRoutes.concat(dynamicRoutes);
          resolve(dynamicRoutes);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  return {
    routes,
    generateRoutes,
  };
});

/**
 * 转换路由数据为组件
 */
const transformRoutes = (routes: RouteVO[]) => {
  const asyncRoutes: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    const tmpRoute = { ...route } as RouteRecordRaw;
    // 顶级目录，替换为 Layout 组件
    // 其他菜单，根据组件路径动态加载组件
    const component = modules[`../../views/${tmpRoute.component}.vue`];
    if (component) {
      tmpRoute.component = component;
    } else {
      tmpRoute.component = modules[`../../views/error-page/404.vue`];
    }

    if (tmpRoute.children) {
      tmpRoute.children = transformRoutes(route.children);
    }

    asyncRoutes.push(tmpRoute);
  });

  return asyncRoutes;
};

export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
