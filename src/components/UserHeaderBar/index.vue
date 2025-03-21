<template>
  <div class="user-platform-header">
    <HeaderCom />
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
import { useSettingsStore, useUserStore } from '@/store';
import { ThemeEnum } from '@/enums/ThemeEnum';
import '@/styles/headerBar.scss';
import HeaderCom from './headerCom.vue';
import { TOKEN_KEY } from '@/enums/CacheEnum';
const settingsStore = useSettingsStore();
const { t } = useI18n();
</script>
<style lang="scss" scoped>
.knowledge-welcome {
  width: 832px;
  padding-left: 24px;

  .knowledge-welcome-text {
    margin-top: 56px;
    margin-bottom: 24px;
  }

  .knowledge-show-text {
    font-size: 16px;
    line-height: 24px;
    color: rgb(78 88 101);
  }
}
</style>
