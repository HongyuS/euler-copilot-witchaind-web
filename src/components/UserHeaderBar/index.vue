<template>
  <div class="user-platform-header">
    <el-header />
    <div class="knowledge-welcome">
      <div class="knowledge-welcome-text">
        <h1>{{ `Hi, ${$t('assetLibrary.welcomeUsePro')}` }}</h1>
      </div>
      <div class="knowledge-show-text">
        {{ $t('assetLibrary.profile') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 内部依赖
import '@/styles/headerBar.scss';
</script>
<style lang="scss" scoped>
.knowledge-welcome {
  width: 832px;
  padding-left: 24px;

  .knowledge-welcome-text {
    margin-top: 56px;
    margin-bottom: 24px;
    color: var(--o-text-color-primary);
  }

  .knowledge-show-text {
    font-size: 16px;
    line-height: 21px;
    color: var(--o-text-color-secondary);
  }
}
</style>
