<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="auto"
    class="kl-ruleForm o-form-has-require"
    :size="formSize"
    label-position="left">
    <el-form-item
      :label="$t('assetLibrary.name')"
      prop="kbName">
      <el-input
        v-model="ruleForm.kbName"
        class="o-validate-input"
        minlength="1"
        maxlength="20"
        :placeholder="$t('assetLibrary.message.pleasePlace')" >
        <template #suffix>
          <el-icon class="error-icon" >
            <img src="@/assets/svg/fail.svg" />
          </el-icon>
        </template>
        </el-input>
    </el-form-item>
    <el-form-item
      :label="$t('assetLibrary.desc')"
      prop="description"
      class="config-size-desc">
      <el-input
        v-model="ruleForm.description"
        maxlength="150"
        show-word-limit
        type="textarea"
        :placeholder="$t('assetLibrary.message.pleasePlace')" />
    </el-form-item>
    <el-form-item
      :label="$t('assetLibrary.language')"
      prop="tokenizer">
      <el-select
        v-model="ruleForm.tokenizer"
        :placeholder="$t('assetLibrary.message.pleaseChoose')"
        :suffix-icon="IconCaretDown"
        :teleported="false"
        class="select-container">
        <el-option
          v-for="item in languageOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item
      :label="$t('assetLibrary.embeddedModel')"
      prop="embeddingModel">
      <template #label>
        {{ $t('assetLibrary.embeddedModel') }}
        <el-tooltip
          :content="$t('formTipText.analyticTip')"
          placement="top"
          popper-class="analyticTipBox"
          effect="light">
          <el-icon class="icon-help">
            <IconHelpCircle />
          </el-icon>
        </el-tooltip>
      </template>

      <el-select
        v-model="ruleForm.embeddingModel"
        :placeholder="$t('assetLibrary.message.pleaseChoose')"
        :teleported="false"
        class="select-container"
        :disabled="props.formData?.id"
        :suffix-icon="IconCaretDown">
        <el-option
          v-for="item in emBeddingModelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item
      :label="$t('assetLibrary.analyticMethod')"
      prop="defaultParseMethod">
      <el-select
        v-model="ruleForm.defaultParseMethod"
        :placeholder="$t('assetLibrary.message.pleaseChoose')"
        :suffix-icon="IconCaretDown"
        popper-class="analyticMethodSelect">
        <el-option
          v-for="item in parserMethodOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item
      :label="$t('assetLibrary.fileChunkSize')"
      prop="defaultChunkSize">
      <template #label>
        {{ $t('assetLibrary.fileChunkSize') }}
        <el-tooltip
          :content="$t('formTipText.fileChunkSizeTip')"
          placement="top"
          popper-class="fileChunkSizeTip"
          effect="light">
          <el-icon class="icon-help">
            <IconHelpCircle />
          </el-icon>
        </el-tooltip>
      </template>
      <el-input-number
        class="config-size"
        v-model="ruleForm.defaultChunkSize"
        :min="128"
        :max="1024" />
      <span class="form-right-tip">（128~1024）</span>
    </el-form-item>
    <el-form-item
      :label="$t('assetLibrary.fileChunkSize')"
      prop="uploadCountLimit">
      <template #label>
        {{ $t('assetLibrary.numberUpperLimit') }}
      </template>
      <el-input-number
        class="config-size"
        v-model="ruleForm.uploadCountLimit"
        :min="128"
        :max="1024" />
      <span class="form-right-tip">（128~1024）</span>
    </el-form-item>
    <el-form-item
      :label="$t('assetLibrary.fileChunkSize')"
      prop="uploadSizeLimit">
      <template #label>
        {{ $t('assetLibrary.sizeUpperLimit') }}
      </template>
      <el-input-number
        class="config-size"
        v-model="ruleForm.uploadSizeLimit"
        :min="128"
        :max="2048" />
      <span class="form-right-tip">（128M~2048M）</span>
    </el-form-item>
    <el-form-item
      :label="
        props.configInfo ? $t('assetLibrary.fileConfigCategory') : $t('assetLibrary.configCategory')
      "
      class="config-form">
      <el-button
        class="resetBtn addDocuType"
        :disabled="ruleForm?.docTypes?.length >= 10"
        @click="handleAddDocType">
        {{ $t('btnText.add') }}
      </el-button>
      <el-button
        class="resetBtn delAllCocuType"
        @click="handleRemoveAllDocType">
        {{ $t('btnText.delAll') }}
      </el-button>
      <div class="supAddCategoris">
        <TextTooltip :content="$t('assetLibrary.supAddCategoris')" />
      </div>
    </el-form-item>
    <el-form-item
      v-for="(item, index) in ruleForm.docTypes"
      :key="`documentType${index}`"
      label="domain"
      class="domain-config">
      <el-input
        v-model="ruleForm.docTypes[index].docTypeName"
        maxlength="20"
        :placeholder="$t('assetLibrary.message.categoryInfo')" />
      <el-icon
        class="deleteConfig"
        @click="handleRemoveDocType(index)">
        <IconDelete />
      </el-icon>
    </el-form-item>
    <el-form-item
      class="kl-ops-btn"
      :class="!props.configInfo ? 'kl-create-ops-btn' : null">
      <el-button
        class="resetBtn"
        type="primary"
        :disabled="isSubmitDisabled"
        :loading="createLoading"
        @click="submitForm(ruleFormRef)">
        {{ props.configInfo ? $t('btnText.save') : $t('btnText.confirm') }}
      </el-button>
      <el-button
        class="resetBtn cancelBtn"
        @click="handleCancelForm()">
        {{ $t('btnText.cancel') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { ElLoading, type ComponentSize, type FormInstance, type FormRules } from 'element-plus';
import {
  IconCaretDown,
  IconDelete,
  IconSuccess,
  IconHelpCircle,
} from '@computing/opendesign-icons';
import '@/styles/knowledgeForm.scss';
import TextTooltip from '@/components/TextSingleTootip/index.vue';
import { v4 as uuidv4 } from 'uuid';
import KbAppAPI from '@/api/kbApp';

const route = useRoute()
const { t, locale} = useI18n();
const loading = ElLoading.service({
  visible: false,
  text: `${t('pageTipText.Loading')}...`,
  background: 'rgba(122, 122, 122, 0.5)',
});
interface RuleForm {
  defaultChunkSize: number;
  defaultParseMethod: string;
  description: string;
  docTypes: any[];
  embeddingModel: string;
  tokenizer: string;
  kbName: string;
  uploadCountLimit: number;
  uploadSizeLimit: number;
  [property: string]: any;
}

const formSize = ref<ComponentSize>('default');
const ruleFormRef = ref<FormInstance>();
const createLoading = ref(false);
const isSubmitDisabled = ref(true);
const ruleForm = ref<RuleForm>({
  kbName: '',
  tokenizer: '',
  defaultChunkSize: 512,
  embeddingModel: '',
  defaultParseMethod: '',
  docTypes: [],
  description: '',
  uploadSizeLimit: 512,
  uploadCountLimit: 128,
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
  isCreate: {
    type: Boolean,
    default: true,
  },
});

onMounted(async () => {
  loading.visible.value = false;
  ruleForm.value = props.formData
    ? JSON.parse(
        JSON.stringify({
          ...props.formData,
          docTypes: props.formData?.docTypes.filter(
            (item: any) => item?.docTypeName?.length
          ),
          defaultChunkSize: props.formData.defaultChunkSize || 512,
          uploadSizeLimit: props.formData?.uploadSizeLimit || 512,
          uploadCountLimit: props.formData?.uploadCountLimit || 128,
        } as RuleForm)
      )
    : ruleForm.value;

  // 并行请求
  const [languageRes, embeddingRes, parseMethodRes] = await Promise.all([
    KbAppAPI.queryLanguageList(),
    KbAppAPI.queryEmbeddingModelList(),
    KbAppAPI.queryParseMethodList(),
  ]);
  languageOptions.value = (languageRes as unknown as [])?.map((item: any) => ({
    label: item,
    value: item,
  }));
  emBeddingModelOptions.value = (embeddingRes as unknown as [])?.map((item: any) => ({
    label: item,
    value: item,
  }));

  parserMethodOptions.value = (parseMethodRes as unknown as [])?.map((item: any) => ({
    label: item,
    value: item,
  }));
  // 如果是创建状态，设置默认值
  if (props.isCreate) {
    ruleForm.value.kbName = t('defaultText.kbName');
    ruleForm.value.tokenizer = locale.value==='zh'?languageOptions.value?.[0].value : languageOptions.value?.[1].value
    
    ruleForm.value.embeddingModel = emBeddingModelOptions.value?.[0].value || '';
    ruleForm.value.defaultParseMethod = parserMethodOptions.value?.[0].value || '';
  }
});

watch(
  ruleForm,
  () => {
    let flag = false;
    Object.keys(ruleForm.value).forEach((item) => {
      const ruleCopy = rules?.[item];
      if ((Array.isArray(ruleCopy) ? ruleCopy[0] : ruleCopy)?.required) {
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
  kbName: [
    {
      required: true,
      message: t('assetLibrary.message.name'),
      trigger: ['blur', 'change'],
    },
    {
      min: 1,
      message: t('assetLibrary.message.libraryNameLen'),
      trigger: ['blur', 'change'],
    },
  ],
  tokenizer: [
    {
      required: true,
      message: t('assetLibrary.message.languagePlace'),
      trigger: ['blur', 'change'],
    },
  ],
  embeddingModel: [
    {
      required: true,
      message: t('assetLibrary.message.modelPlace'),
      trigger: ['blur', 'change'],
    },
  ],
  defaultParseMethod: [
    {
      required: true,
      message: t('assetLibrary.message.analyticMethodPlace'),
      trigger: ['blur', 'change'],
    },
  ],
  defaultChunkSize: [
    {
      message: t('assetLibrary.message.pleasePlace'),
      trigger: ['blur', 'change'],
      required: true,
    },
  ],
  uploadSizeLimit:[ { required: true  } ],
  uploadCountLimit:[ { required: true  } ],
});

const handleCopyTextToclipboard = (text: string) => {
  const input = document.createElement('input');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  ElMessage({
    showClose: true,
    message: t('assetLibrary.copySuccessFul'),
    icon: IconSuccess,
    customClass: 'o-message--success',
    duration: 3000,
  });
  document.body.removeChild(input);
};

onMounted(() => {
  const isTransList = document.querySelectorAll('.is-transparent');
  isTransList?.forEach((el) => {
    const span = el.querySelector('span');
    if (span?.innerHTML === t('assetLibrary.message.pleaseChoose')) {
      el.classList.add('removeIsTrans');
    }
  });
});
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    let payload = {
      kbName: ruleForm.value.kbName,
      tokenizer: ruleForm.value?.tokenizer?.toLocaleLowerCase(),
      description: ruleForm.value.description,
      embeddingModel: ruleForm.value.embeddingModel,
      defaultParseMethod: ruleForm.value.defaultParseMethod,
      defaultChunkSize: ruleForm.value.defaultChunkSize,
      uploadCountLimit: ruleForm.value.uploadCountLimit,
      uploadSizeLimit: ruleForm.value.uploadSizeLimit,
      docTypes: ruleForm.value.docTypes.filter((item) => item.docTypeName.length > 0),
    };
    if (valid) {
      loading.visible.value = true;
      createLoading.value = true;
      if (ruleForm.value?.kbId) {
        KbAppAPI.updateKbLibrary({
          kbId: ruleForm.value.kbId,
        },payload)
          .then((res) => {
            props.handleOpsKbForm();
            if (props.configInfo) {
              props.handleQueryKbData();
            }
            ElMessage({
              showClose: true,
              message: t('opsMessage.modifSuccess'),
              icon: IconSuccess,
              customClass: 'o-message--success',
              duration: 3000,
            });
            ruleForm.value.docTypes = (res as any).docTypes;
          })
          .finally(() => {
            loading.visible.value = false;
            createLoading.value = false;
          });
      } else {
        let docArr:any = []
        ruleForm.value.docTypes.map((item) => {
          docArr.push({
            docTypeId:item.docTypeId,
            docTypeName:item.docTypeName
          })
        } )
        KbAppAPI.createKbLibrary({teamId:route.query.id?.toString() ?? ''},{
          ...payload,
          docTypes: docArr
        })
          .then(() => {
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

const handleRemoveDocType = (index: number) => {
  ruleForm.value.docTypes.splice(index, 1);
};

const handleRemoveAllDocType = () => {
  ruleForm.value.docTypes.splice(0);
};

const handleAddDocType = () => {
  ruleForm.value.docTypes.push({
    docTypeId: uuidv4(),
    docTypeName: '',
  });
  
  // 添加后自动滚动到底部，确保新增的输入框可见
  setTimeout(() => {
    // 获取所有的domain-config元素
    const domainConfigs = document.querySelectorAll('.domain-config');
    // 获取最后一个（即新添加的）元素
    const lastDomainConfig = domainConfigs[domainConfigs.length - 1];
    if (lastDomainConfig) {
      // 使用scrollIntoView滚动到新添加的元素
      lastDomainConfig.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, 100); // 增加延迟时间，确保DOM已更新
};
</script>