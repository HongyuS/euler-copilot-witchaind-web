<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';
const appStore = useAppStore();
import '@/styles/app.scss';
import router from './router';

const locale = computed(() => appStore.locale);
// 新增路由状态标记
const isManualNavigation = ref(false);
onMounted(() => {
  // 监听手动导航
  router.beforeEach((to, from, next) => {
    if (from.name === undefined && to.name !== 'root') {
      isManualNavigation.value = true;
    }
    next();
  });
  window.addEventListener('beforeunload', () => {
    if (!isManualNavigation.value) {
      sessionStorage.setItem('routerName', router.currentRoute.value.name?.toString() || '');
    }
    sessionStorage.setItem('beforeunload', 'true');
  });
  // 监听页面刷新
  const beforeUnload = sessionStorage.getItem('beforeunload');
  if (beforeUnload === 'true') {
    if (!isManualNavigation.value) {
    const name = sessionStorage.getItem('routerName');
    if (name) {
      router.push(name); // 如果sessionStorage存在路由，去缓存的路由
    } else {
      router.push('/'); // 不存在存储，去主页
    }
  }
    sessionStorage.removeItem('beforeunload'); // 清除标记
    sessionStorage.removeItem('routerName');
    isManualNavigation.value = false;
  }
});
</script>

<style lang="scss"></style>
