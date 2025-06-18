<template>
  <el-config-provider :locale="locales">
    <router-view />
    <CustomLoading loadingText="下载中" :loading="downLoading" />
  </el-config-provider>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';
import '@/styles/app.scss';
import router from './router';
import CustomLoading from '@/components/CustomLoading/index.vue';


const { locale } = useI18n();
const locales = computed(() => appStore.locale);
const appStore = useAppStore();
const {downLoading}  = storeToRefs(appStore);
// 新增路由状态标记
const isManualNavigation = ref(false);

const handleMessage = (e: MessageEvent) => {
  if(e.data?.type === 'changeLanguage') {
    const langObj = {
      'zh_cn': 'zh',
      'en': 'en',
    };
    let lang = langObj[e.data.lang as keyof typeof langObj] ?? 'zh';

    // 更新 vue-i18n locale
    locale.value = lang;
    
    // 更新 store 中的语言设置
    appStore.changeLanguage(lang);

    // 保存语言设置
    localStorage.setItem('language', lang);
  }else if(e.data?.type === 'parentToken') {
    const token = e.data.parentToken;
      if(token){
        localStorage.setItem('ECSESSION', token)
      }else{
        ElMessage({
          message: '未获取到token数据！',
          type: 'warning',
          customClass: 'o-message--warning',
        })
      }
  }else if(e.data?.type === 'changeTheme') {
    const theme = e.data.theme;
    if(theme) {
      document.body.setAttribute('theme', theme);
      localStorage.setItem('theme-witchiand', theme);
    } else {
      ElMessage({
        message: '未获取到主题数据！',
        type: 'warning',
        customClass: 'o-message--warning',
      });
    }
  }
};

onMounted(() => {
  document.body.setAttribute('theme', localStorage.getItem('theme') || 'light');
  // 监听手动导航
  router.beforeEach((to, from, next) => {
    if (from.name === undefined && to.name) {
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
  window.addEventListener('message', handleMessage);
});
onUnmounted(() => window.removeEventListener('message', handleMessage));

// 页面加载时应用存储的主题
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme-witchiand') || 'light';
  if (savedTheme) {
    document.body.setAttribute('theme', savedTheme);
  }
});
</script>

<style lang="scss"></style>