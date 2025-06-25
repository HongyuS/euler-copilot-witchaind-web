<template>
  <div class="user-platform-header">
    <el-header />
    <div class="knowledge-welcome">
      <div class="knowledge-welcome-text">
        <div>{{ `${$t('assetLibrary.welcomeUsePro')}` }}</div>
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
  font-family:'HarmonyOS Sans SC';
  position: absolute;
  top: 64px;
  padding-left: 24px;

  .knowledge-welcome-text {
    margin-bottom: 24px;
    color: var(--o-text-color-primary);
    font-size: 32px;
    line-height: 40px;
    font-weight: 700;
    font-family: 'HarmonyOS Sans SC';
  }

  .knowledge-show-text {
    width: 824px;
    font-size: 16px;
    line-height: 24px;
    color: var(--o-text-color-secondary);
    word-break: break-all;
    font-family: 'HarmonyOS Sans SC';
  }
}
</style>
