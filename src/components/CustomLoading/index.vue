<template>
  <div
    class="customLoading"
    v-loading="loading"
    :class="loading ? 'customLoading' : 'loadingNone'"
    :element-loading-text="loadingText || `${$t('pageTipText.Loading')}...`"
    element-loading-background="rgba(122, 122, 122, 0.5)"
  ></div>
</template>
<script lang="ts" setup>
import { defineProps } from "vue";
const { t } = useI18n();

const props = defineProps({
  loading: {
    type: Boolean,
  },
  loadingText: {
    type: String,
  },
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
