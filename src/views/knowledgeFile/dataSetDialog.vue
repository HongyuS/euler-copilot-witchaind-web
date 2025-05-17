<template>
  <el-dialog
    v-if="props.generateDialogVisible"
    v-model="props.generateDialogVisible"
    @close="handleGenerateDialogVisible"
    class="dataSet-edit-dialog"
    align-center
    width="550"
    :title="$t('生成数据集')">
    <CustomLoading :loading="loading" />
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="116"
      class="dataSet-ruleForm"
      label-position="left">
      <el-form-item
        :label="$t('数据集名称')"
        prop="datasetName"
        class="dataSetName">
        <el-input
          maxlength="150"
          minlength="1"
          v-model="ruleForm.datasetName"
          :placeholder="$t('assetLibrary.message.pleasePlace')" />
      </el-form-item>
      <el-form-item :label="$t('数据集简介')" prop="description">
        <el-input :rows="4" show-word-limit type="textarea" v-model="ruleForm.description" maxlength="200"
          :placeholder="$t('assetLibrary.message.pleasePlace')" />
      </el-form-item>
      <el-form-item :label="$t('文档数量')" prop="documentIds">
        <span>{{ ruleForm.documentIds.length }}</span>
      </el-form-item>

      <el-form-item :label="$t('数据集条目')" prop="dataCnt" class="dataSetNumber">
        <el-input-number class="config-size" v-model="ruleForm.dataCnt" :min="1" :max="512" />
      </el-form-item>
      <el-form-item :label="$t('模型类型')" prop="llmId">
        <el-select v-model="ruleForm.llmId" :placeholder="$t('assetLibrary.message.pleaseChoose')"
          :class="ruleForm.llmId.length ? 'selectedType' : 'notSelectedType'" :suffix-icon="IconCaretDown"
          :teleported="false">
          <el-option v-for="item in llmList" :key="item?.llmId" :label="item?.llmName" :value="item?.llmId" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('是否进行数据清洗')" prop="isDataCleared" class="isDataClean">
        <el-switch v-model="ruleForm.isDataCleared" class="ml-2" style="--el-switch-on-color: #13ce66" />
      </el-form-item>
      <el-form-item :label="$t('是否补全上下文')" prop="isChunkRelated" class="isComContext">
        <el-switch v-model="ruleForm.isChunkRelated" class="ml-2" style="--el-switch-on-color: #13ce66" />
      </el-form-item>
      <el-form-item class="kl-ops-btn">
        <el-button class="resetBtn" type="primary" :disabled="isSubmitDisabled" @click="submitForm(ruleFormRef)">
          {{ $t('btnText.confirm') }}
        </el-button>
        <el-button class="resetBtn cancelBtn" @click="handleCancelVisible()">
          {{ $t('btnText.cancel') }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup>
import { IconCaretDown } from '@computing/opendesign-icons';
import '@/styles/dataSetDialog.scss';
import dataSetAPI from '@/api/dataSet'
import { ref } from 'vue';
import { useGroupStore } from '@/store/modules/group';
import CustomLoading from '@/components/CustomLoading/index.vue';

const store = useGroupStore();
const { handleKnowledgeTab } = store;

const { t } = useI18n();

const loading = ref(false);
const route = useRoute();
const ruleForm = ref({
  datasetName: '',
  description: '',
  documentIds: [],
  dataCnt: 0,
  llmId: '',
  isDataCleared: false,
  isChunkRelated: false,
});
const ruleFormRef = ref();
const isSubmitDisabled = ref(true);
const llmList = ref([]);
const rules = ref({
  datasetName: [
    {
      required: true,
      message: t('model.pleasePlace'),
      trigger: ['blur', 'change'],
    },
  ],
  description: [
    {
      required: true,
      message: t('model.pleasePlace'),
      trigger: ['blur', 'change'],
    },
  ],
  dataCnt: [
    {
      required: true,
      message: t('model.pleasePlace'),
      trigger: ['blur', 'change'],
    },
  ],
  llmId: [
    {
      required: true,
      message: t('assetLibrary.message.pleaseChoose'),
      trigger: ['blur', 'change'],
    },
  ],
});
const props = defineProps({
  generateDialogVisible: {
    type: Boolean,
    default: false,
  },
  handleGenerateDataSet: {
    type: Function,
    default: () => { },
  },
  selectionFileData: {
    type: Array,
    default: [],
  },
});

watch(
  () => props.selectionFileData,
  () => {
    ruleForm.documentIds = props.selectionFileData.map((item) => item.id);
  },
  {
    deep: true,
    immediate: true,
  }
);

watch(
  () => ruleForm.value,
  () => {
    isSubmitDisabled.value = !Object.keys(rules.value).every((item) => {
      return ruleForm.value[item].toString().length;
    });
  },
  {
    deep: true,
    immediate: true,
  }
);

const handleGenerateDialogVisible = () => {
  props.handleGenerateDataSet(false);
};

const handleResetDataSet = () => {
  ruleForm.value = {
    datasetName: '',
    description: '',
    documentIds: [],
    dataCnt: 1,
    llmId: '',
    isDataCleared: false,
    isChunkRelated: false,
  };
};

const submitForm = () => {
  loading.value = true;
  let param={
    kbId:route.query.kb_id,
    ...ruleForm.value
  }
  dataSetAPI.createDataSet(param).then(res => {
    handleCancelVisible()
  }).finally(()=>{
    loading.value = false;
    handleKnowledgeTab('dataset')
  })
}

const handleCancelVisible = () => {
  props.handleGenerateDataSet(false);
  handleResetDataSet();
};

onMounted(() => {
  dataSetAPI.queryLlmData().then(res => {
    llmList.value = res.llms || [];
  })
})
watch(() => props.selectionFileData,
  () => {
    ruleForm.value.documentIds = props.selectionFileData.map((item) => item.docId)
  }, {
  deep: true
})


</script>
