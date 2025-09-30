/**
 * CSS 静态资源动态解析工具
 * 在运行时动态替换 CSS 变量中的静态资源路径
 */
import { isInIframe, getIntegrationOrigin } from './index';

/**
 * 初始化 CSS 静态资源解析
 * 在应用启动时调用，动态设置 CSS 变量
 */
export function initCssAssetResolver() {
  // 检测是否需要处理静态资源
  const isIframeMode = String(import.meta.env.VITE_IS_IFRAME_MODE) === 'true' || isInIframe();
  
  if (!isIframeMode) {
    return;
  }
  
  const integrationOrigin = getIntegrationOrigin();
  const basePath = import.meta.env.BASE_URL || '/witchaind/';
  
  // 构建静态资源基础路径
  const assetBaseUrl = `${integrationOrigin}${basePath.replace(/\/$/, '')}/assets`;
  
  // 设置 CSS 变量
  const root = document.documentElement;
  
  // 设置图片资源路径
  root.style.setProperty('--asset-base-url', assetBaseUrl);
  root.style.setProperty('--asset-images-url', `${assetBaseUrl}/images`);
  root.style.setProperty('--asset-svg-url', `${assetBaseUrl}/svg`);
  root.style.setProperty('--asset-icons-url', `${assetBaseUrl}/icons`);
  
  // 设置具体的静态资源路径
  root.style.setProperty('--bg-light', `url('${assetBaseUrl}/images/light_bg_1.webp')`);
  root.style.setProperty('--bg-dark', `url('${assetBaseUrl}/images/dark_bg_1.webp')`);
  
  // 空状态图标
  root.style.setProperty('--empty-pending-light', `url('${assetBaseUrl}/images/empty_pending.svg')`);
  root.style.setProperty('--empty-pending-dark', `url('${assetBaseUrl}/images/empty_pending_dark.svg')`);
  root.style.setProperty('--empty-failed-light', `url('${assetBaseUrl}/images/empty_failed.svg')`);
  root.style.setProperty('--empty-failed-dark', `url('${assetBaseUrl}/images/empty_failed_dark.svg')`);
  root.style.setProperty('--empty-running-light', `url('${assetBaseUrl}/images/empty_running.svg')`);
  root.style.setProperty('--empty-running-dark', `url('${assetBaseUrl}/images/empty_running_dark.svg')`);
  
  // 任务图标
  root.style.setProperty('--task-list-light', `url('${assetBaseUrl}/svg/light_taskList.svg')`);
  root.style.setProperty('--task-list-dark', `url('${assetBaseUrl}/svg/dark_taskList.svg')`);
  root.style.setProperty('--task-score-light', `url('${assetBaseUrl}/svg/light_taskScore.svg')`);
  root.style.setProperty('--task-score-dark', `url('${assetBaseUrl}/svg/dark_taskScore.svg')`);
  
  // 加载图标
  root.style.setProperty('--task-loading', `url('${assetBaseUrl}/icons/taskLoading.png')`);
  
  // 更多操作图标
  root.style.setProperty('--more-icon', `url('${assetBaseUrl}/svg/more.svg')`);
  root.style.setProperty('--more-hover-icon', `url('${assetBaseUrl}/svg/more_hover.svg')`);
  root.style.setProperty('--more-active-icon', `url('${assetBaseUrl}/svg/more_active.svg')`);
  
  // 登录背景
  root.style.setProperty('--login-bg-light', `url('${assetBaseUrl}/images/login-background-light.webp')`);
  root.style.setProperty('--login-bg-dark', `url('${assetBaseUrl}/images/login-background-dark.jpg')`);
  
  // 信息图标
  root.style.setProperty('--info-icon', `url('${assetBaseUrl}/svg/icon_info.svg')`);
  
  // 字体文件
  root.style.setProperty('--font-harmony-woff2', `url('${assetBaseUrl}/fonts/HarmonyOS/HarmonyOS_Sans_SC/HarmonyOS_Sans_SC_Regular.woff2')`);
  root.style.setProperty('--font-harmony-woff', `url('${assetBaseUrl}/fonts/HarmonyOS/HarmonyOS_Sans_SC/HarmonyOS_Sans_SC_Regular.woff')`);
  
  console.log('CSS 静态资源路径已动态设置:', assetBaseUrl);
}
