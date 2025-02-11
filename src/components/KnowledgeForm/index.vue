<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    :rules="rules"
    label-width="auto"
    class="kl-ruleForm"
    :size="formSize"
    label-position="left"
  >
    <el-form-item
      :label="$t('assetLibrary.assetId')"
      prop="id"
      class="assetIdClass"
      :id="props.configInfo ? 'asset-box-id' : null"
      v-if="ruleForm.id?.length > 0"
    >
      <el-input
        v-model="ruleForm.id"
        minlength="1"
        :disabled="true"
        maxlength="50"
        :placeholder="$t('assetLibrary.message.pleasePlace')"
      />
      <el-icon
        v-if="props.configInfo"
        class="copydocument"
        @click="handleCopyTextToclipboard(ruleForm.id)"
      >
        <CopyDocument />
      </el-icon>
    </el-form-item>
    <el-form-item :label="$t('assetLibrary.name')" prop="name">
      <el-input
        v-model="ruleForm.name"
        minlength="1"
        maxlength="50"
        :placeholder="$t('assetLibrary.message.pleasePlace')"
      />
    </el-form-item>
    <el-form-item
      :label="$t('assetLibrary.desc')"
      prop="description"
      class="config-size-desc"
    >
      <el-input
        v-model="ruleForm.description"
        maxlength="150"
        show-word-limit
        type="textarea"
        :placeholder="$t('assetLibrary.message.pleasePlace')"
      />
    </el-form-item>
    <el-form-item :label="$t('assetLibrary.language')" prop="language">
      <el-select
        v-model="ruleForm.language"
        :placeholder="$t('assetLibrary.message.pleaseChoose')"
        :suffix-icon="IconCaretDown"
        :teleported="false"
        class="select-container"
      >
        <el-option
          v-for="item in languageOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      :label="$t('assetLibrary.embeddedModel')"
      prop="embedding_model"
    >
      <template #label>
        {{ $t("assetLibrary.embeddedModel") }}
        <el-tooltip
          :content="$t('formTipText.analyticTip')"
          placement="top"
          popper-class="analyticTipBox"
          effect="light"
        >
          <el-icon>
            <IconHelpCircle />
          </el-icon>
        </el-tooltip>
      </template>

      <el-select
        v-model="ruleForm.embedding_model"
        :placeholder="$t('assetLibrary.message.pleaseChoose')"
        :teleported="false"
        class="select-container"
        :disabled="props.formData.id"
        :suffix-icon="IconCaretDown"
      >
        <el-option
          v-for="item in emBeddingModelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      :label="$t('assetLibrary.analyticMethod')"
      prop="default_parser_method"
    >
      <el-select
        v-model="ruleForm.default_parser_method"
        :placeholder="$t('assetLibrary.message.pleaseChoose')"
        :suffix-icon="IconCaretDown"
        popper-class="analyticMethodSelect"
      >
        <el-option
          v-for="item in parserMethodOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      :label="$t('assetLibrary.fileChunkSize')"
      prop="default_chunk_size"
    >
      <template #label>
        {{ $t("assetLibrary.fileChunkSize") }}
        <el-tooltip
          :content="$t('formTipText.fileChunkSizeTip')"
          placement="top"
          popper-class="fileChunkSizeTip"
          effect="light"
        >
          <el-icon>
            <IconHelpCircle />
          </el-icon>
        </el-tooltip>
      </template>
      <el-input-number
        class="config-size"
        v-model="ruleForm.default_chunk_size"
        :min="512"
        :max="1024"
      />
      <span class="form-right-tip">（512~1024）</span>
    </el-form-item>
    <el-form-item
      :label="
        props.configInfo
          ? $t('assetLibrary.fileConfigCategory')
          : $t('assetLibrary.configCategory')
      "
      class="config-form"
    >
      <el-button
        class="resetBtn addDocuType"
        :disabled="ruleForm?.document_type_list?.length >= 10"
        @click="handleAddDocType"
      >
        {{ $t("btnText.add") }}
      </el-button>
      <el-button
        class="resetBtn delAllCocuType"
        @click="handleRemoveAllDocType"
      >
        {{ $t("btnText.delAll") }}
      </el-button>
      <div class="supAddCategoris">
        <TextTooltip :content="$t('assetLibrary.supAddCategoris')" />
      </div>
    </el-form-item>

    <el-form-item
      v-for="(item, index) in ruleForm.document_type_list"
      :key="`documentType${index}`"
      label="domain"
      class="domain-config"
    >
      <el-input
        v-model="ruleForm.document_type_list[index].type"
        :placeholder="$t('assetLibrary.message.categoryInfo')"
      />
      <el-icon class="deleteConfig" @click="handleRemoveDocType(index)">
        <IconDelete />
      </el-icon>
    </el-form-item>
    <el-form-item
      class="kl-ops-btn"
      :class="!props.configInfo ? 'kl-create-ops-btn' : null"
    >
      <el-button
        class="resetBtn"
        type="primary"
        :disabled="isSubmitDisabled"
        :loading="createLoading"
        @click="submitForm(ruleFormRef)"
      >
        {{ props.configInfo ? $t("btnText.save") : $t("btnText.confirm") }}
      </el-button>
      <el-button class="resetBtn cancelBtn" @click="handleCancelForm()">
        {{ $t("btnText.cancel") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import {
  ElLoading,
  type ComponentSize,
  type FormInstance,
  type FormRules,
} from "element-plus";
import {
  IconCaretDown,
  IconDelete,
  IconSuccess,
  IconHelpCircle,
} from "@computing/opendesign-icons";
import "@/styles/knowledgeForm.scss";
import TextTooltip from "@/components/TextSingleTootip/index.vue";
import { v4 as uuidv4 } from "uuid";
import KbAppAPI from "@/api/kbApp";

const { t } = useI18n();
const loading = ElLoading.service({
  visible: false,
  text: `${t("pageTipText.Loading")}...`,
  background: "rgba(122, 122, 122, 0.5)",
});
interface RuleForm {
  default_chunk_size: number;
  default_parser_method: string;
  description: string;
  document_type_list: any[];
  embedding_model: string;
  language: string;
  name: string;
  [property: string]: any;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const createLoading = ref(false);
const isSubmitDisabled = ref(true);
const ruleForm = ref<RuleForm>({
  name: "",
  language: "",
  default_chunk_size: 1024,
  embedding_model: "",
  default_parser_method: "",
  document_type_list: [],
  description: "",
});
const languageOptions = ref();
const emBeddingModelOptions = ref();
const parserMethodOptions = ref();

const props = defineProps({
  handelResetForm: {
    type: Function,
    default: () => {},
  },
  handleCloseCreateKb: {
    type: Function,
    default: () => {},
  },
  handleOpsKbForm: {
    type: Function,
    default: () => {},
  },
  formData: {
    type: <any>{},
  },
  configInfo: {
    type: Boolean,
  },
  handleQueryKbData: {
    type: Function,
    default: () => {},
  },
});

onMounted(() => {
  loading.visible.value = false;
  ruleForm.value = props.formData
    ? JSON.parse(
        JSON.stringify(
          ({
            ...props.formData,
            document_type_list: props.formData?.document_type_list.filter(
              (item) => item?.type?.length
            ),
            default_chunk_size: props.formData.default_chunk_size || 1024,
          } as RuleForm) || "{}"
        )
      )
    : ruleForm.value;

  KbAppAPI.queryLanguageList().then((res: any) => {
    languageOptions.value = res?.map((item: any) => {
      if (item === "English") {
        return { label: item, value: "en" };
      }
      return { label: item, value: "zh" };
    });
  });

  KbAppAPI.queryEmbeddingModelList().then((res: any) => {
    emBeddingModelOptions.value = res?.map((item: any) => {
      return { label: item, value: item };
    });
  });

  KbAppAPI.queryParseMethodList().then((res: any) => {
    parserMethodOptions.value = res?.map((item: any) => {
      return { label: item, value: item };
    });
  });
});

watch(
  ruleForm,
  () => {
    let flag = false;
    Object.keys(ruleForm.value).forEach((item) => {
      if (rules?.[item]?.[0]?.required) {
        if (!ruleForm.value?.[item]?.toString().length) {
          flag = true;
        }
      }
    });

    isSubmitDisabled.value = flag;
  },
  { deep: true }
);

const rules = reactive<FormRules<RuleForm>>({
  id: [
    {
      required: true,
    },
  ],
  name: [
    {
      required: true,
      message: t("assetLibrary.message.name"),
      trigger: ["blur", "change"],
    },
    {
      min: 1,
      message: t("assetLibrary.message.libraryNameLen"),
      trigger: ["blur", "change"],
    },
  ],
  language: [
    {
      required: true,
      message: t("assetLibrary.message.languagePlace"),
      trigger: ["blur", "chanblurge"],
    },
  ],
  embedding_model: [
    {
      required: true,
      message: t("assetLibrary.message.modelPlace"),
      trigger: ["blur", "change"],
    },
  ],
  default_parser_method: [
    {
      required: true,
      message: t("assetLibrary.message.analyticMethodPlace"),
      trigger: ["blur", "change"],
    },
  ],
  default_chunk_size: [
    {
      message: t("assetLibrary.message.pleasePlace"),
      trigger: ["blur", "change"],
      required: true,
    },
  ],
});

const handleCopyTextToclipboard = (text) => {
  const input = document.createElement("input");
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  ElMessage({
    showClose: true,
    message: t("assetLibrary.copySuccessFul"),
    icon: IconSuccess,
    customClass: "o-message--success",
    duration: 3000,
  });
  document.body.removeChild(input);
};

onMounted(() => {
  const isTransList = document.querySelectorAll(".is-transparent");
  isTransList?.forEach((el) => {
    const span = el.querySelector("span");
    if (span?.innerHTML === t("assetLibrary.message.pleaseChoose")) {
      el.classList.add("removeIsTrans");
    }
  });
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    let payload = {
      name: ruleForm.value.name,
      language: ruleForm.value?.language?.toLocaleLowerCase(),
      description: ruleForm.value.description,
      embedding_model: ruleForm.value.embedding_model,
      default_parser_method: ruleForm.value.default_parser_method,
      default_chunk_size: ruleForm.value.default_chunk_size,
      document_type_list: ruleForm.value.document_type_list.filter(
        (item) => item.type.length > 0
      ),
    };
    if (valid) {
      loading.visible.value = true;
      createLoading.value = true;
      if (ruleForm.value?.id) {
        KbAppAPI.updateKbLibrary({
          id: ruleForm.value.id,
          ...payload,
        })
          .then((res) => {
            props.handleOpsKbForm();
            if (props.configInfo) {
              props.handleQueryKbData();
            }
            ElMessage({
              showClose: true,
              message: t("opsMessage.modifSuccess"),
              icon: IconSuccess,
              customClass: "o-message--success",
              duration: 3000,
            });
            ruleForm.value.document_type_list = res.document_type_list;
          })
          .finally(() => {
            loading.visible.value = false;
            createLoading.value = false;
          });
      } else {
        KbAppAPI.createKbLibrary({
          ...payload,
          document_type_list: ruleForm.value.document_type_list.map(
            (item) => item.type
          ),
        })
          .then((res) => {
            props.handleOpsKbForm();
          })
          .finally(() => {
            loading.visible.value = false;
            createLoading.value = false;
          });
      }
      if (!props.configInfo) {
        props.handelResetForm();
      }
    }
  });
};

const handleCancelForm = () => {
  props.handleCloseCreateKb();
};

const formRef = ref<FormInstance>();

const handleRemoveDocType = (index: number) => {
  ruleForm.value.document_type_list.splice(index, 1);
};

const handleRemoveAllDocType = () => {
  ruleForm.value.document_type_list.splice(0);
};

const handleAddDocType = () => {
  ruleForm.value.document_type_list.push({
    id: uuidv4(),
    type: "",
  });
};
</script>
