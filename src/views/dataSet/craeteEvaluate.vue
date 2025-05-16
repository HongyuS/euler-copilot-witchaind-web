<template>
    <el-dialog 
        class="evaluate-dialog" 
        v-model="props.dialogEvaluateVisible" 
        title="新建评测" 
        width="544"
        v-if="props.dialogEvaluateVisible"
        @close="handleCancelVisible"
    >
        <el-form class="evaluate-form" ref="ruleFormRef" :model="form" labelPosition="left" :rules="rules" >
            <el-form-item label="所用数据集" :label-width="formLabelWidth">
                <div class="evaluate-dataSetName" >
                    {{ props.rowData?.dataSetName }}
                </div>
            </el-form-item>
            <el-form-item label="测试名称" prop="name" :label-width="formLabelWidth" >
                <el-input v-model="form.name" autocomplete="off" :placeholder="t('model.pleasePlace')" />
            </el-form-item>
            <el-form-item label="简介" prop="desc" :label-width="formLabelWidth">
                <el-input
                    :rows="4"
                    show-word-limit
                    type="textarea"
                    maxlength="200"
                    :placeholder="$t('assetLibrary.message.pleasePlace')"
                />
            </el-form-item>
            <el-form-item label="模型类型" prop="type" :label-width="formLabelWidth">
                <el-select v-model="form.type" :placeholder="t('model.pleasePlace')">
                    <el-option class="evaluate-type-option" label="DeepSeek" value="DeepSeek" />
                    <el-option class="evaluate-type-option" label="OpenAI" value="OpenAI" />
                </el-select>
            </el-form-item>
            <el-form-item label="检索方法" prop="method" :label-width="formLabelWidth">
                <el-select v-model="form.method" :placeholder="t('model.pleasePlace')">
                    <el-option label="DeepSeek" value="DeepSeek" />
                    <el-option label="OpenAI" value="OpenAI" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" :disabled="isSubmitDisabled" @click="handleSubmit(ruleFormRef)">确定</el-button>
                <el-button @click="handleCancelVisible">
                    取消
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus';
import "@/styles/evaluate.scss"
const { t, } = useI18n();


const props = defineProps({
    dialogEvaluateVisible: Boolean,
    rowData: Object,
    close: Function,
})

const isSubmitDisabled = ref(true);
const ruleFormRef = ref<FormInstance>()
const formLabelWidth = '100px'

const form = reactive({
  name: '',
  type: '',
  desc: '',
  method:''
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: t('model.pleasePlace'), trigger: 'blur' },
    { max: 100, message: 'Length should be 0 to 100', trigger: 'blur' },
  ],
  type: [
    { required: true, message: t('model.pleasePlace'), trigger: 'change' },
  ],
  desc: [
    { required: true, message: t('model.pleasePlace'), trigger: 'blur' },
  ],
  method: [
    { required: true, message: t('model.pleasePlace'), trigger: 'change' },
  ],
})

const handleSubmit = async (formEl: FormInstance | undefined) => {
    console.log(formEl)
    if (!formEl) return
    await formEl.validate((valid) => {
        console.log(valid)
        if (valid) {
            console.log('submit!',)
        }
    })
    // props.close?.();
    ruleFormRef.value?.resetFields();
}

const handleCancelVisible = () => {
    props.close?.();
}

</script>
