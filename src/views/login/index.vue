<template>
  <div class="euler-copilot-container">
    <HeaderBar />
    <CustomLoading :loading="loading" />

    <div class="main-container">
      <div class="login-container">
        <el-card class="login-card">
          <div class="platform-login-text">{{ $t("login.welcomeToUse") }}</div>
          <div class="relative">
            <div class="login-title">{{ defaultSettings.title }}</div>
          </div>

          <el-form
            ref="loginFormRef"
            :model="loginData"
            :rules="loginRules"
            class="login-form"
          >
            <!-- 用户名 -->
            <el-form-item prop="account" class="username-from">
              <div class="input-wrapper">
                <el-input
                  ref="account"
                  v-model="loginData.account"
                  :placeholder="$t('login.message.username.required')"
                  name="account"
                  size="large"
                  class="h-[48px]"
                />
              </div>
            </el-form-item>

            <!-- 密码 -->
            <el-form-item prop="password" class="password-from">
              <div class="input-wrapper">
                <el-input
                  v-model="loginData.password"
                  :placeholder="$t('login.message.password.required')"
                  name="password"
                  :type="passwordType"
                  @keyup.enter="handleLoginSubmit"
                  size="large"
                  class="h-[48px]"
                  autocomplete="off"
                  ref="inputRef"
                >
                  <template #suffix>
                    <el-icon
                      class="el-input__icon el-input__password"
                      @click="handleShowPassword"
                    >
                      <IconInvisible v-if="passwordType === 'password'" />
                      <IconVisible v-else />
                    </el-icon>
                  </template>
                </el-input>
              </div>
            </el-form-item>
            <!-- 登录按钮 -->
            <el-button
              :loading="loading"
              type="primary"
              size="large"
              class="w-full login-btn"
              @click.prevent="handleLoginSubmit"
            >
              {{ $t("login.login") }}
            </el-button>
          </el-form>
        </el-card>
        <div class="icp-info">
          {{ $t("copyright") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@/styles/login.scss";
import type { FormInstance } from "element-plus";
import { LocationQuery, useRoute } from "vue-router";
import { useUserStore } from "@/store";
import AuthAPI, { type LoginData } from "@/api/auth";
import router from "@/router";
import defaultSettings from "@/settings";
import HeaderBar from "@/components/HeaderBar/index.vue";
import {
  IconInvisible,
  IconSuccess,
  IconVisible,
} from "@computing/opendesign-icons";
import CustomLoading from "@/components/CustomLoading/index.vue";

const userStore = useUserStore();
const route = useRoute();
const { t } = useI18n();
const passwordType = ref("password");
const inputRef = ref();
// 按钮 loading 状态
const loading = ref(false);
// 登录表单ref
const loginFormRef = ref<FormInstance>();

const loginData = ref<LoginData>({
  account: "",
  password: "",
});

const loginRules = computed(() => {
  return {
    account: [
      {
        required: true,
        trigger: ["blur", "change"],
        message: t("login.message.username.usernameMsg"),
      },
    ],
    password: [
      {
        required: true,
        trigger: ["blur", "change"],
        message: t("login.message.password.passwordMsg"),
      },
    ],
  };
});

const handleShowPassword = () => {
  passwordType.value = passwordType.value === "password" ? "text" : "password";
  nextTick(() => {
    // 使用$refs访问DOM元素
    inputRef.value.$el.querySelector(".el-input__inner").scrollLeft = 10000;
  });
};

/** 登录表单提交 */
const handleLoginSubmit = () => {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      userStore
        .login(loginData.value)
        .then((res) => {
          ElMessage({
            showClose: true,
            message: t("login.loginSuccessful"),
            icon: IconSuccess,
            customClass: "o-message--success",
            duration: 3000,
          });
          localStorage.setItem("userInfo", JSON.stringify(res));
          window.open(`${window.origin}/#/knowledge/library`, "_self");
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};
</script>

<style lang="scss" scoped></style>
