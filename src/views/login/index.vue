<template>
  <div class="euler-copilot-container">
    <HeaderBar />
    <CustomLoading :loading="loading" />

    <div class="main-container">
      <div class="login-container">
        <el-card class="login-card">
          <div class="platform-login-text">{{ $t("login.welcomeToUse") }}</div>
          <div class="relative">
            <div class="login-title">{{ $t("login.appName") }}</div>
          </div>

          <!-- 登录页面 -->
          <el-form
            v-if="!isSigIn"
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
                >
                </el-input>
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
            <!-- 去注册按钮 -->
            <el-button
              size="large"
              class="w-full sigin-btn"
              @click="handleSigIn"
            >
              {{ $t("login.signin") }}
            </el-button>
          </el-form>

          <!-- 注册页面 -->
          <el-form
            v-else
            ref="signinFormRef"
            :model="signinData"
            :rules="signinRules"
            class="login-form"
          >
          <div style="min-height:220px">
            <!-- 昵称 -->
            <el-form-item prop="name" class="username-from">
              <div class="input-wrapper">
                <el-popover
                  placement="top-end"
                  :width="500"
                  trigger="hover"
                  :content="t('login.message.name.popoverMsg')"
                  popper-class="custom-popover"
                >
                  <template #reference>
                    <el-input
                      ref="name"
                      v-model="signinData.name"
                      :placeholder="$t('login.message.name.required')"
                      name="name"
                      size="large"
                      class="h-[48px]"
                    />
                  </template>
                </el-popover>
              </div>
            </el-form-item>
            <!-- 用户名 -->
            <el-form-item prop="account" class="username-from">
              <div class="input-wrapper">
                <el-popover
                  placement="top-end"
                  :width="500"
                  trigger="hover"
                  :content="t('login.message.username.popoverMsg')"
                  popper-class="custom-popover"
                >
                  <template #reference>
                    <el-input
                      ref="account"
                      v-model="signinData.account"
                      :placeholder="$t('login.message.username.required')"
                      name="account"
                      size="large"
                      class="h-[48px]"
                    />
                  </template>
                </el-popover>
              </div>
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item prop="email" class="username-from">
              <div class="input-wrapper">
                <el-popover
                  placement="top-end"
                  :width="500"
                  trigger="hover"
                  :content="t('login.message.email.popoverMsg')"
                  popper-class="custom-popover"
                >
                  <template #reference>
                    <el-input
                      ref="email"
                      v-model="signinData.email"
                      :placeholder="$t('login.message.email.required')"
                      name="email"
                      size="large"
                      class="h-[48px]"
                    />
                  </template>
                </el-popover>
              </div>
            </el-form-item>

            <!-- 密码 -->
            <el-form-item prop="passwd" class="password-from">
              <div class="input-wrapper">
                <el-popover
                  placement="top-end"
                  :width="500"
                  trigger="hover"
                  :content="t('login.message.passwd.popoverMsg')"
                  popper-class="custom-popover"
                >
                  <template #reference>
                    <el-input
                      v-model="signinData.passwd"
                      :placeholder="$t('login.message.passwd.required')"
                      name="passwd"
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
                  </template>
                </el-popover>
              </div>
            </el-form-item>
          </div>
            <!-- 注册按钮 -->
            <el-button
              :loading="signinLoding"
              type="primary"
              size="large"
              class="w-full sigin-btn !mt-[28px]"
              @click.prevent="handleSigInSubmit"
            >
              {{ $t("login.signin") }}
            </el-button>
            <!-- 返回按钮 -->
            <div
              class="backToLogin"
              :class="signinLoding ? 'not-click' : ''"
              @click.prevent="handleBackLogin"
            >
              {{ $t("login.backToLogin") }}
            </div>
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
import { useRoute } from "vue-router";
import { useUserStore } from "@/store";
import { SigninData, type LoginData } from "@/api/auth";
import HeaderBar from "@/components/HeaderBar/index.vue";
import {
  IconInvisible,
  IconSuccess,
  IconVisible,
} from "@computing/opendesign-icons";
import CustomLoading from "@/components/CustomLoading/index.vue";
import { useAppStore } from "@/store";

const userStore = useUserStore();
const appStore = useAppStore();
const { t,locale } = useI18n();
const passwordType = ref("password");
const inputRef = ref();
// 按钮 loading 状态
const loading = ref(false);
// 注册按钮状态
const signinLoding = ref(false);
// 登录表单ref
const loginFormRef = ref<FormInstance>();
const signinFormRef = ref<FormInstance>();

const loginData = ref<LoginData>({
  account: "",
  password: "",
});
const signinData = ref<SigninData>({
  name: "",
  account: "",
  passwd: "",
  email: null,
});

// 是否是注册页面
const isSigIn = ref(false);

const loginRules = computed(() => {
  return {
    account: [
      {
        required: true,
        trigger: ["blur", "change"],
        message: t("login.message.username.usernameMsg"),
      },
      {
        min: 5,
        message: t("login.message.username.notMinThan"),
        trigger: "blur",
      },
      {
        max: 20,
        message: t("login.message.username.notMaxThan"),
        trigger: "change",
      },
      {
        pattern: /^[a-z0-9]+$/,
        message: t("login.message.username.regxMsg"),
        trigger: ["blur", "change"],
      },
    ],
    password: [
      {
        required: true,
        trigger: ["blur", "change"],
        message: t("login.message.password.passwordMsg"),
      },
      {
        min: 6,
        message: t("login.message.password.notMinThan"),
        trigger: "blur",
      },
      {
        max: 20,
        message: t("login.message.password.notMaxThan"),
        trigger: "change",
      },
    ],
  };
});
const signinRules = computed(() => {
  return {
    name: [
      {
        required: true,
        trigger: ["blur", "change"],
        message: t("login.message.name.nameMsg"),
      },
      {
        max: 10,
        message: t("login.message.name.notMinThan"),
        trigger: "change",
      },
    ],
    account: [
      {
        required: true,
        trigger: ["blur", "change"],
        message: t("login.message.username.usernameMsg"),
      },
      {
        min: 5,
        message: t("login.message.username.notMinThan"),
        trigger: "blur",
      },
      {
        max: 20,
        message: t("login.message.username.notMaxThan"),
        trigger: "change",
      },
      {
        pattern: /^[a-z0-9]+$/,
        message: t("login.message.username.regxMsg"),
        trigger: ["blur", "change"],
      },
    ],
    passwd: [
      {
        required: true,
        trigger: ["blur", "change"],
        message: t("login.message.password.passwordMsg"),
      },
      {
        min: 6,
        message: t("login.message.password.notMinThan"),
        trigger: "blur",
      },
      {
        max: 20,
        message: t("login.message.password.notMaxThan"),
        trigger: "change",
      },
      {
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        message: t("login.message.password.regxMsg"),
        trigger: "blur",
      },
    ],
    email: [
      {
        required: false,
        trigger: ["blur", "change"],
        message: t("login.message.email.emailMsg"),
      },
      {
        min: 5,
        message: t("login.message.email.notMinThan"),
        trigger: "blur",
      },
      {
        max: 20,
        message: t("login.message.email.notMaxThan"),
        trigger: "change",
      },
      {
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: t("login.message.email.regxMsg"),
        trigger: "blur",
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
          window.open(`${window.origin}/witchaind/#/knowledge/library`, "_self");
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};

/**
 * 跳转到注册
 */
const handleSigIn = () => {
  isSigIn.value = true;
  loginFormRef.value?.resetFields();
};

/**
 * 返回登录
 */
const handleBackLogin = () => {
  if (signinLoding.value) {
    return;
  }
  signinFormRef.value?.resetFields();
  isSigIn.value = false;
};

/**
 * 注册请求
 */
const handleSigInSubmit = () => {
  console.log(signinData.value,signinFormRef);
  signinFormRef.value?.validate((valid) => {
    if (valid) {
      signinLoding.value = true;
      userStore
        .signin(signinData.value)
        .then(() => {
          ElMessage({
            showClose: true,
            message: t("login.signinSuccessful"),
            icon: IconSuccess,
            customClass: "o-message--success",
            duration: 3000,
          });
          signinFormRef.value?.resetFields();
          isSigIn.value = false;
        })
        .finally(() => {
          signinLoding.value = false;
        });
    }
  });
};


/**
 * 处理接postmessage收到的数据，根据消息中的语言设置应用语言。
 * 该函数会根据接收到的语言代码更新应用的语言设置，并将其存储在本地存储中。
 */
 const handleMessage = (e: Event)=> {

const langObj={
  'CN': 'zh',
  'EN': 'en'
};
let lang = langObj[e.data.lang];
locale.value = lang;
appStore.changeLanguage(lang);
localStorage.setItem("language", lang);

};

onMounted(() => {
window.addEventListener('message', handleMessage)
});
onUnmounted(() => window.removeEventListener('message', handleMessage));
</script>

<style lang="scss" scoped></style>
