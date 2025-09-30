/**
 * 静态资源解析插件
 * 用于解决 iframe 环境下的跨域静态资源访问问题
 */
import type { App } from 'vue';
import { resolveAssetUrl } from '@/utils';

export default {
  install(app: App) {
    // 全局属性：解析静态资源 URL
    app.config.globalProperties.$resolveAsset = resolveAssetUrl;
    
    // 全局方法：提供给组合式 API 使用
    app.provide('resolveAsset', resolveAssetUrl);
  }
};

// 导出工具函数供直接使用
export { resolveAssetUrl };
