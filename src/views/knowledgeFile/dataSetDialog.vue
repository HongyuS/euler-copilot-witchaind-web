<template>
  <el-dialog
    v-if="props.generateDialogVisible"
    v-model="props.generateDialogVisible"
    @close="handleCancelVisible"
    class="dataSet-edit-dialog"
    align-center
    width="550"
    :title="$t('assetFile.generateDataset')">
    <CustomLoading :loading="loading" />
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="135px"
      class="dataSet-ruleForm"
      label-position="left">
      <el-form-item
        :label="$t('dataset.datasetName')"
        prop="datasetName"
        class="dataSetName">
        <el-input
          maxlength="30"
          minlength="1"
          v-model="ruleForm.datasetName"
          :placeholder="$t('assetLibrary.message.pleasePlace')" />
      </el-form-item>
      <el-form-item :label="$t('dataset.datasetDesc')" prop="description">
        <el-input :rows="4" show-word-limit type="textarea" v-model="ruleForm.description" maxlength="200"
          :placeholder="$t('assetLibrary.message.pleasePlace')" />
      </el-form-item>
      <el-form-item :label="$t('assetLibrary.fileNum')" prop="documentIds" class="dataSetFileNum">
        <span>{{ props.selectionFileData.length }}</span>
      </el-form-item>

      <el-form-item :label="$t('dataset.datasetNum')" prop="dataCnt" class="dataSetNumber">
        <el-input-number class="config-size" v-model="ruleForm.dataCnt" :min="1" :max="512" />
      </el-form-item>
      <el-form-item :label="$t('testing.type')" prop="llmId">
        <el-select v-model="ruleForm.llmId" :placeholder="t('assetLibrary.message.pleaseChoose')" :suffix-icon="IconCaretDown">
          <template #label="{ label, value }">
              <img v-if="ruleForm.llmId" :src="`data:image/svg+xml;base64,${llmList.find(item => item.llmId === ruleForm.llmId)?.llmIcon}`" style="vertical-align: middle; margin-right: 8px;" />
              <span>{{ label }}</span>
          </template>
          <el-option
              v-for="item in llmList"
              :key="item.llmId"
              :label="item.llmName"
              :value="item.llmId" 
          >
              <img :src="`data:image/svg+xml;base64,${item.llmIcon}`"/>
              <span>{{ item.llmName }}</span>
          </el-option>
      </el-select>
      </el-form-item>
      <el-form-item :label="$t('dataset.isDataCleared')" prop="isDataCleared" class="isDataClean">
        <el-switch v-model="ruleForm.isDataCleared" class="ml-2" style="--el-switch-on-color: #13ce66" />
      </el-form-item>
      <el-form-item :label="$t('dataset.isChunkRelated')" prop="isChunkRelated" class="isComContext">
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
import '@/styles/dataSetDialog.scss';
import dataSetAPI from '@/api/dataSet'
import { ref } from 'vue';
import { useGroupStore } from '@/store/modules/group';
import CustomLoading from '@/components/CustomLoading/index.vue';
import { IconCaretDown, } from '@computing/opendesign-icons';

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
  handleClearSelected: {
    type: Function,
    default: () => { },
  },
});

watch(
  () => props.selectionFileData,
  () => {
    ruleForm.documentIds = props.selectionFileData.map((item) => item.docId);
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
  ruleFormRef.value.resetFields();
};

const submitForm = () => {
  loading.value = true;
  let param={
    kbId:route.query.kb_id,
    ...ruleForm.value
  }
  dataSetAPI.createDataSet(param).then(res => {
    handleCancelVisible();
    props.handleClearSelected();
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
