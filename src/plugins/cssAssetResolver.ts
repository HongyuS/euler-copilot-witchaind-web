/**
 * CSS 静态资源解析插件
 * 用于在 iframe 环境下动态替换 CSS 中的静态资源 URL
 */
import type { Plugin } from 'vite';

export function cssAssetResolverPlugin(): Plugin {
  return {
    name: 'css-asset-resolver',
    generateBundle(options, bundle) {
      // 在生产构建时处理 CSS 文件
      Object.keys(bundle).forEach(fileName => {
        const chunk = bundle[fileName];
        if (chunk.type === 'asset' && fileName.endsWith('.css')) {
          let cssContent = chunk.source as string;
          
          // 替换 CSS 中的静态资源路径
          cssContent = cssContent.replace(
            /url\(['"]?\/src\/assets\/(.*?)['"]?\)/g,
            "url('#{INTEGRATION_ORIGIN}#{BASE_URL}assets/$1')"
          );
          
          cssContent = cssContent.replace(
            /url\(['"]?@\/assets\/(.*?)['"]?\)/g,
            "url('#{INTEGRATION_ORIGIN}#{BASE_URL}assets/$1')"
          );
          
          chunk.source = cssContent;
        }
      });
    },
    transformIndexHtml: {
      enforce: 'post',
      transform(html) {
        // 在 HTML 中注入动态替换脚本
        const script = `
<script>
(function() {
  function replaceAssetUrls() {
    // 检测是否在 iframe 环境中
    const isInIframe = window.self !== window.top;
    const isIframeMode = '${process.env.VITE_IS_IFRAME_MODE}' === 'true';
    
    if (!isInIframe && !isIframeMode) return;
    
    // 获取集成来源
    let integrationOrigin = '${process.env.VITE_INTEGRATION_ORIGIN || ''}';
    if (!integrationOrigin) {
      try {
        integrationOrigin = isInIframe ? window.parent.location.origin : window.location.origin;
      } catch (e) {
        if (document.referrer) {
          const url = new URL(document.referrer);
          integrationOrigin = url.origin;
        } else {
          integrationOrigin = window.location.origin;
        }
      }
    }
    
    const baseUrl = '${process.env.BASE_URL || '/witchaind/'}';
    
    // 替换所有样式表中的占位符
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach(element => {
      if (element.tagName === 'STYLE') {
        element.textContent = element.textContent
          .replace(/#{INTEGRATION_ORIGIN}/g, integrationOrigin)
          .replace(/#{BASE_URL}/g, baseUrl);
      } else if (element.tagName === 'LINK' && element.sheet) {
        try {
          const rules = element.sheet.cssRules || element.sheet.rules;
          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (rule.style && rule.style.cssText) {
              rule.style.cssText = rule.style.cssText
                .replace(/#{INTEGRATION_ORIGIN}/g, integrationOrigin)
                .replace(/#{BASE_URL}/g, baseUrl);
            }
          }
        } catch (e) {
          // 跨域样式表无法访问，忽略错误
        }
      }
    });
  }
  
  // DOM 加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', replaceAssetUrls);
  } else {
    replaceAssetUrls();
  }
  
  // 监听动态添加的样式
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1 && (node.tagName === 'STYLE' || (node.tagName === 'LINK' && node.rel === 'stylesheet'))) {
          setTimeout(replaceAssetUrls, 100);
        }
      });
    });
  });
  
  observer.observe(document.head, { childList: true });
})();
</script>`;
        
        return html.replace('</head>', script + '</head>');
      }
    }
  };
}
