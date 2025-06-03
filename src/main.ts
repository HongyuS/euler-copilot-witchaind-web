import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';

import opendesign2 from '@computing/opendesign2';
import 'element-plus/dist/index.css';
import '@/assets/base.css';
import '@computing/opendesign2/themes/es/css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import App from './App.vue';
import setupPlugins from '@/plugins';

// 本地SVG图标
import 'virtual:svg-icons-register';

// 样式
import 'element-plus/theme-chalk/dark/css-vars.css';
import '@/styles/index.scss';
import 'uno.css';
import '@/styles/theme.scss';
import 'animate.css';
import router from './router';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const app = createApp(App);

app.use(createPinia().use(piniaPluginPersistedstate));
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(setupPlugins);
app.use(opendesign2);
app.mount('#app');
