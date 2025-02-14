<template>
  <el-header class="platform-header">
    <div class="header-container">
      <span class="platform-title">
    <!-- 因嵌入copilot页面暂时注释 -->
        <!-- <img src="/src/assets/svg/euler_copilot_logo.svg" /> -->
        <!-- <span class="project-name">witChainD</span> -->
      </span>
      <div class="top-bar">
        <!-- <lang-select class="ml-2 cursor-pointer" /> -->
        <el-dropdown
          popper-class="dropdown-container userDro"
          class="userDroContainer"
          trigger="click"
          @visible-change="handleBatchDownBth"
        >
          <span class="el-dropdown-link">
            {{ userInfo.name }}
            <el-icon class="el-icon--right" v-if="!batchDownBth">
              <IconCaretDown />
            </el-icon>
            <el-icon
              class="el-icon--right el-icon--caretup"
              v-if="batchDownBth"
            >
              <IconCaretUp />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handlLogout">
                {{ $t("login.logOut") }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="custom-vertical"></div>
        <el-tooltip
          class="box-item"
          effect="light"
          :content="
            `${$t('model.modelName')}：${ruleForm?.model_name}` ||
            `${$t('model.modelName')}`
          "
          placement="left"
        >
          <el-icon class="setting-icon" @click="handleModelVisible(true)">
            <Setting />
          </el-icon>
        </el-tooltip>
      </div>
    </div>
  </el-header>
  <el-dialog
    align-center
    v-if="modelVisible"
    v-model="modelVisible"
    class="model-dialog"
    width="560"
    @close="handleModelDialog"
    :title="$t('model.modelConfig')"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="left"
      :label-width="userLanguage === 'zh' ? '92px' : 'auto'"
      @validate="handleFormValidate"
    >
      <el-form-item
        :label="$t('API KEY')"
        prop="openai_api_key"
        class="docName"
      >
        <el-input
          v-model="ruleForm.openai_api_key"
          :placeholder="$t('model.pleasePlace')"
        >
          <template #suffix>
            <el-icon
              class="warning-icon"
              v-if="!formValidateStatus.openai_api_key"
            >
              <WarningFilled />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('Base-Url')" prop="openai_api_base">
        <el-input
          v-model="ruleForm.openai_api_base"
          :placeholder="$t('model.pleasePlace')"
        >
          <template #suffix>
            <el-icon
              class="warning-icon"
              v-if="!formValidateStatus.openai_api_base"
            >
              <WarningFilled />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('model.modelType')" prop="model_name">
        <el-input
          v-model="ruleForm.model_name"
          :placeholder="$t('model.pleasePlace')"
        >
          <template #suffix>
            <el-icon class="warning-icon" v-if="!formValidateStatus.model_name">
              <WarningFilled />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('model.maxToken')" prop="max_tokens">
        <el-input-number
          class="token-size"
          v-model="ruleForm.max_tokens"
          :min="1024"
          :max="8096"
        />
        <span class="form-right-tip">（1024~8096）</span>
      </el-form-item>
      <el-form-item class="model-ops-btn">
        <el-button
          class="resetBtn"
          type="primary"
          :disabled="isSubmitDisabled"
          @click="handleConfirmCreateModel(ruleFormRef)"
        >
          {{ $t("btnText.confirm") }}
        </el-button>
        <el-button
          class="resetBtn cancelBtn"
          @click="handleModelVisible(false)"
        >
          {{ $t("btnText.cancel") }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
// 内部依赖
import { useUserStore } from "@/store";
import "@/styles/headerBar.scss";
import {
  IconCaretDown,
  IconCaretUp,
  IconSuccess,
} from "@computing/opendesign-icons";
import { ModelForm } from "./modelConfig";
import { FormInstance, FormItemProp } from "element-plus";
import KbAppAPI from "@/api/kbApp";
import defaultSettings from "@/settings";

const userStore = useUserStore();
const { t } = useI18n();
const ruleFormRef = ref<FormInstance>();
const userLanguage = ref();
const isSubmitDisabled = ref(true);
const batchDownBth = ref(false);
const modelVisible = ref(false);
const ruleForm = ref<ModelForm>({
  openai_api_key: "",
  openai_api_base: "",
  max_tokens: 1024,
  model_name: "",
});

const rules = ref({
  openai_api_key: [
    {
      required: true,
      message: t("model.pleasePlace"),
      trigger: ["blur", "change"],
    },
  ],
  openai_api_base: [
    {
      required: true,
      message: t("model.pleasePlace"),
      trigger: ["blur", "change"],
    },
  ],
  max_tokens: [
    {
      required: true,
      message: t("model.pleasePlace"),
      trigger: ["blur", "change"],
    },
  ],
  model_name: [
    {
      required: true,
      message: t("model.pleasePlace"),
      trigger: ["blur", "change"],
    },
  ],
});

const formValidateStatus = ref<any>({
  openai_api_key: true,
  openai_api_base: true,
  max_tokens: true,
  model_name: true,
});

const userInfo = ref<any>({});

onMounted(() => {
  userInfo.value = JSON.parse(localStorage.getItem("userInfo") || "{}");
  userLanguage.value = userInfo.value?.language;
  KbAppAPI.getdUserModel().then((res) => {
    ruleForm.value = res;
  });
});

watch(
  ruleForm,
  () => {
    let flag = false;
    Object.keys(ruleForm.value).forEach((item) => {
      if (rules.value?.[item]?.[0]?.required) {
        if (!ruleForm.value?.[item]?.toString()?.length) {
          flag = true;
        }
      }
    });

    isSubmitDisabled.value = flag;
  },
  { deep: true }
);

watch(
  () => useStorage("language", defaultSettings.language).value,
  () => {
    userLanguage.value = useStorage("language", defaultSettings.language).value;
  },
  {
    deep: true,
    immediate: true,
  }
);

const handleBatchDownBth = (e) => {
  batchDownBth.value = e;
};

const handlLogout = () => {
  userStore.logout().then((res: any) => {
    if (res && !Object.keys(res).length) {
      localStorage.removeItem("userInfo");
      userStore.resetToken();
    }
  });
};

const handleFormValidate = (prop: any, isValid: boolean, message: string) => {
  formValidateStatus.value[prop] = isValid;
};

const handleConfirmCreateModel = async (formData: FormInstance | undefined) => {
  if (!formData) return;
  await formData.validate((valid, fields) => {
    if (valid) {
      KbAppAPI.addUserModel({
        max_tokens: ruleForm.value.max_tokens || 1024,
        model_name: ruleForm.value.model_name,
        openai_api_base: ruleForm.value.openai_api_base,
        openai_api_key: ruleForm.value.openai_api_key,
      }).then((res) => {
        modelVisible.value = false;
        ElMessage({
          showClose: true,
          message: t("opsMessage.modifSuccess"),
          icon: IconSuccess,
          customClass: "o-message--success",
          duration: 3000,
        });
      });
    }
  });
};

const handleModelDialog = () => {
  ruleFormRef.value.resetFields();
  formValidateStatus.value = {
    openai_api_key: true,
    openai_api_base: true,
    max_tokens: true,
    model_name: true,
  };
};

const handleModelVisible = (visible: boolean) => {
  KbAppAPI.getdUserModel().then((res) => {
    ruleForm.value = {
      ...res,
      max_tokens: res?.max_tokens || 1024,
    };
  });
  modelVisible.value = visible;
};
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
<style lang="scss">
.userDro {
  width: 160px;
  height: 46px !important;
  padding: 4px 0 !important;
  transform: translateX(-50px);
  .el-dropdown-menu {
    height: 38px !important;
    padding: unset !important;
  }
  .el-dropdown-menu__item {
    display: flex;
    height: 38px !important;
    justify-content: center;
  }
  border: unset !important;
}
.userDroContainer {
  margin-left: 16px;
  height: 26px;
}
.el-dropdown-menu__item:not(.is-disabled):focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: unset;
  color: #606266;
}
.top-bar {
  .el-icon.el-icon--right {
    font-size: 16px;
    color: rgb(141 152 170);
  }

  .setting-icon {
    color: rgb(141 152 170);
    font-size: 24px;
  }

  .custom-vertical {
    width: 1px;
    height: 16px;
    margin: 0 16px;
    background: rgb(195, 206, 223);
  }
  .setting-icon {
    cursor: pointer;
  }
  .setting-icon:hover {
    color: rgb(50, 145, 254);
  }
}

.model-dialog {
  padding: 0 !important;
  .el-dialog__title {
    font-family: "HarmonyOS Sans SC Bold", sans-serif !important;
    font-weight: 800;
  }
  .el-input {
    width: 100%;
  }
  .el-dialog__body {
    padding: 24px 43px 0 16px;
    margin-right: 0 !important;
  }
  .model-ops-btn {
    height: 24px !important;
    min-height: unset !important;
    margin-bottom: 24px;
    margin-top: 32px !important;
    .el-form-item__content {
      margin-left: 0 !important;
      height: 24px !important;
      display: flex;
      min-height: unset !important;
      justify-content: center;
      transform: translateX(14px);
      .el-button {
        height: 24px !important;
        min-height: unset !important;
      }
    }
  }
  .el-form-item {
    gap: 24px;
    margin-bottom: 24px !important;
    .el-form-item__label,
    .el-input__inner {
      font-size: 12px;
    }
    label {
      min-width: 78px !important;
      width: unset !important;
      max-width: unset !important;
    }
  }
  .form-right-tip {
    font-size: 12px;
  }
  .el-form-item__label {
    padding: 0 !important;
  }
  .el-input-number__increase,
  .el-input-number__decrease {
    background: transparent !important;
    .el-icon {
      color: #8d98aa;
    }
  }

  .token-size {
    width: 111px !important;
    .el-input__wrapper {
      width: 50px !important;
      overflow: hidden !important;
      padding-left: 30px !important;
      padding-right: 30px !important;
    }
    .el-input__inner {
      width: 50px !important;
      overflow: hidden !important;
      padding-left: 5px !important;
      padding-right: 5px !important;
    }
  }

  .warning-icon {
    svg {
      color: rgb(228, 33, 33) !important;
    }
    path {
      background: rgb(228, 33, 33) !important;
    }
  }
}
</style>
