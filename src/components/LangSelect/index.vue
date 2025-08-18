<template>
  <el-dropdown
    trigger="click"
    :popper-class="
      !userInfo?.name?.length ? 'dropdown-container notUserDrop' : 'dropdown-container languageDrop'
    ">
    <div class="language-container">
      <div>
        <img
          v-if="language === 'zh'"
          src="/src/assets/images/language-zh.svg" />
        <img
          v-else
          src="/src/assets/images/language-en.svg" />
      </div>
      <div class="laguageChecd">
        {{ languageText }}
      </div>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in langOptions"
          :key="item.value"
          :command="item.value"
          @click="handleLanguageChange(item.value)">
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/store/modules/app';
import { LanguageEnum } from '@/enums/LanguageEnum';
import defaultSettings from '@/settings';
import AuthAPI from '@/api/auth';
import { IconSuccess } from '@computing/opendesign-icons';
const languageText = ref();
const language = ref();
const userInfo = ref();
defineProps({
  size: {
    type: String,
    required: false,
  },
});

const langOptions = [
  { label: '简体中文', value: LanguageEnum.ZH },
  { label: 'English', value: LanguageEnum.EN },
];

const appStore = useAppStore();
const { locale, t } = useI18n();

const handeQueryLanguage = () => {
  setTimeout(() => {
    language.value = useStorage('language', defaultSettings.language).value;
    languageText.value = language.value === 'zh' ? '简体中文' : 'English';
  });
};
onMounted(() => {
  userInfo.value = JSON.parse(localStorage.getItem('userInfo') || '{}');
  handeQueryLanguage();
});

const handleLanguageChange = (lang: string) => {
  locale.value = lang;
  appStore.changeLanguage(lang);
  language.value = lang;
  languageText.value = lang === 'zh' ? '简体中文' : 'English';
  if (userInfo.value.name) {
    localStorage.setItem('userInfo', JSON.stringify({ name: userInfo.value.name, language: lang }));
    AuthAPI.userUpdate({
      language: lang,
    });
  }
  ElMessage({
    showClose: true,
    message: t('langSelect.message.success'),
    icon: IconSuccess,
    customClass: 'o-message--success',
    duration: 3000,
  });
};
</script>
<style lang="scss" scoped>
.language-container {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
<style lang="scss">
.languageDrop {
  width: 160px;
  margin-left: 35px;
  .el-dropdown-menu {
    padding: 4px 0 !important;
  }
  .el-dropdown-menu__item {
    display: flex;
    justify-content: center;
    height: 38px !important;
  }
  border: unset !important;
}

.notUserDrop {
  width: 160px;
  .el-dropdown-menu__item {
    display: flex;
    justify-content: center;
  }
  border: unset !important;
}
.language-dro {
  border: unset !important;
  border-color: unset !important;

  .el-dropdown-menu__item {
    justify-content: center;
  }

  .el-dropdown-menu__item:not(.is-disabled):hover {
    color: rgb(255 255 255);
    background: rgb(82 163 255);
  }
}

.laguageChecd {
  font-size: 16px !important;
}
</style>
