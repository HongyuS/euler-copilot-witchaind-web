<template>
  <div
    class="customLoading"
    v-loading="loading"
    :class="loading ? 'customLoading' : 'loadingNone'"
    :element-loading-text="loadingText || `${$t('pageTipText.Loading')}...`"
    element-loading-background="rgba(122, 122, 122, 0.5)"></div>
</template>

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
