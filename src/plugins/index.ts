import { setupI18n } from '@/lang';
import { setupRouter } from '@/router';
import { setupStore } from '@/store';
import type { App } from 'vue';
import { setupElIcons } from './icons';

export default {
  install(app: App<Element>) {
    // 路由(router)
    setupRouter(app);
    // 国际化
    setupI18n(app);
    // Element-plus图标
    setupElIcons(app);
    // 状态管理(store)
    setupStore(app);
  },
};
