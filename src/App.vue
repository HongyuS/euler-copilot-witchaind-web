<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { useAppStore, useSettingsStore } from "@/store";
import { ThemeEnum } from "@/enums/ThemeEnum";
const appStore = useAppStore();
const settingsStore = useSettingsStore();
import "@/styles/app.scss";

const locale = computed(() => appStore.locale);
 
</script>
<style lang="scss"></style>
