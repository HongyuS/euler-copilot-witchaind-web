<template>
  <div
    class="customLoading"
    v-loading="loading"
    :class="loading ? 'customLoading' : 'loadingNone'"
    :element-loading-text="loadingText || `${$t('pageTipText.Loading')}...`"
    :element-loading-background="dark?'rgba(122, 122, 122, 0.5)':'rgba(255, 255, 255, 0.7)'"></div>
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
  dark:{
    type: Boolean,
    default: true,
    required: false,
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
