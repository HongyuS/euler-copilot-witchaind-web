<template>
  <el-dialog
    v-if="props.generateDialogVisible"
    v-model="props.generateDialogVisible"
    class="dataSet-edit-dialog"
    align-center
    width="550"
    :title="$t('生成数据集')">
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
        prop="dataSetName"
        class="dataSetName">
        <el-input :placeholder="$t('assetLibrary.message.pleasePlace')" />
      </el-form-item>
      <el-form-item
        :label="$t('数据集简介')"
        prop="dataSetDesc">
        <el-input
          :rows="4"
          show-word-limit
          type="textarea"
          maxlength="200"
          :placeholder="$t('assetLibrary.message.pleasePlace')"
           />
      </el-form-item>
      <el-form-item
        :label="$t('文档数量')"
        prop="fileNumber">
        <span>3</span>
      </el-form-item>

      <el-form-item
        :label="$t('数据集条目')"
        prop="dataSetNumber"
        class="dataSetNumber">
        <el-input-number
          class="config-size"
          v-model="ruleForm.dataSetNumber"
          :min="1"
          :max="512" />
      </el-form-item>
      <el-form-item
        :label="$t('模型类型')"
        prop="modelType">
        <el-select
          v-model="ruleForm.modelType"
          :placeholder="$t('assetLibrary.message.pleaseChoose')"
          :class="ruleForm.modelType.length ? 'selectedType' : 'notSelectedType'"
          :suffix-icon="IconCaretDown"
          :teleported="false">
          <el-option
            v-for="item in []"
            :key="item?.value"
            :label="item?.label"
            :value="item?.value" />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('是否进行数据清洗')"
        prop="isDataClean"
        class="isDataClean">
        <el-switch
          v-model="ruleForm.isDataClean"
          class="ml-2"
          style="--el-switch-on-color: #13ce66" />
      </el-form-item>
      <el-form-item
        :label="$t('是否补全上下文')"
        prop="isComContext"
        class="isComContext">
        <el-switch
        v-model="ruleForm.isComContext"
          class="ml-2"
          style="--el-switch-on-color: #13ce66" />
      </el-form-item>
      <el-form-item class="kl-ops-btn">
        <el-button
          class="resetBtn"
          type="primary"
          :disabled="isSubmitDisabled"
          @click="submitForm(ruleFormRef)">
          {{ $t('btnText.confirm') }}
        </el-button>
        <el-button
          class="resetBtn cancelBtn"
          @click="handleCancelVisible()">
          {{ $t('btnText.cancel') }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup>
import {
  IconCaretDown,
} from '@computing/opendesign-icons';
import '@/styles/dataSetDialog.scss';
import { ref } from 'vue';
const { t, } = useI18n();
const ruleForm = ref({
  dataSetName:'',
  dataSetDesc:'',
  fileNumber:1,
  dataSetNumber:1,
  modelType:'',
  isDataClean:true,
  isComContext:false,
});
const ruleFormRef = ref();
const isSubmitDisabled = ref(true);
const rules = reactive({
  dataSetName: [
    {
      required: true,
      message: t('model.pleasePlace'),
      trigger: ['blur', 'change'],
    },
  ],
  dataSetDesc:[
    {
      required: true,
      message: t('model.pleasePlace'),
      trigger: ['blur', 'change'],
    },
  ],
  dataSetNumber:[
    {
      required: true,
      message: t('model.pleasePlace'),
      trigger: ['blur', 'change'],
    },
  ],
  modelType:[
    {
      required: true,
      message: t('assetLibrary.message.pleaseChoose'),
      trigger: ['blur', 'change'],
    },
  ],
})
const props = defineProps({
  generateDialogVisible: {
    type: Boolean,
    default: false,
  },
});

const submitForm = () => {};
</script>
