<template>
  <div
    class="customLoading"
    v-loading="loading"
    :class="loading ? 'customLoading' : 'loadingNone'"
    :element-loading-text="loadingText || `${$t('pageTipText.Loading')}...`"
    :element-loading-background="backgroundColor"></div>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps({
  loading: {
    type: Boolean
  },
  loadingText: {
    type: String
  },
});

const backgroundColor = ref('rgba(122,122,122,0.1)');

const updateBackgroundColor = () => {
  const isDark = document.body.getAttribute('theme') === 'dark';
  backgroundColor.value = isDark ? 'var(--o-bg-color-mask)' : 'rgba(122,122,122,0.1)';
};

// 使用 MutationObserver 监听 theme 属性的变化
let observer: MutationObserver | null = null;

onMounted(() => {
  updateBackgroundColor(); // 初始化背景色

  observer = new MutationObserver(() => {
    updateBackgroundColor();
  });

  observer.observe(document.body, {
    attributes: true, // 监听属性变化
    attributeFilter: ['theme'], // 只监听 theme 属性
  });
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect(); // 停止监听
    observer = null;
  }
});
</script>
<style>
.customLoading {
  position: absolute;
  inset: 0;
  z-index: 999999;
}

.loadingNone {
  display: none;
}
</style>
