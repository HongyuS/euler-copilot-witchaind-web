import type { App } from 'vue';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: '/',
    redirect: '/group',
  },
  {
    path: '/group',
    name: 'Group',
    component: () => import('@/views/group/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/groupInfo',
    name: 'GroupInfo',
    component: () => import('@/views/group/groupInfo.vue'),
    meta: { hidden: true },
  },
  {
    path: '/libraryInfo',
    name: 'libraryInfo',
    component: () => import('@/views/knowledgeLibrary/libraryInfo.vue'),
    meta: { hidden: true },
  },
  {
    path: '/documentInfo',
    name: 'documentInfo',
    component: () => import('@/views/knowledgeFile/documentInfo.vue'),
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
    path: '/NotFoundPage',
    component: () => import('@/views/notFoundPage/index.vue'),
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

router.beforeEach((to, from, next) => {
  sessionStorage.setItem('routerName', to.fullPath); //存储当前路由
  next();
});

export default router;
