import type { App } from 'vue';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/NotFoundPage',
    component: () => import('@/views/notFoundPage/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/knowledge/library',
    component: () => import('@/views/knowledgeLibrary/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/knowledge/file',
    component: () => import('@/views/knowledgeFile/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/knowledge/fileSection',
    component: () => import('@/views/knowledgeFileSection/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/NotFoundPage',
  },
];
/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory('/witchaind/'),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 全局注册 router
export function setupRouter(app: App<Element>) {
  app.use(router);
}

/**
 * 重置路由
 */
export function resetRouter() {
  window.open(`${window.origin}/witchaind/#/login`, '_self');
}

router.beforeEach((to, from, next) => {
  sessionStorage.setItem('routerName', to.fullPath); //存储当前路由
  next();
});

export default router;
