<template>
    <el-dialog 
        class="evaluate-dialog" 
        v-model="props.dialogEvaluateVisible" 
        :title="$t('testing.createTesting')" 
        width="544"
        v-if="props.dialogEvaluateVisible"
        @close="handleCancelVisible"
        align-center
        :close-on-click-modal="false"
    >
        <el-form class="evaluate-form" ref="ruleFormRef" :model="form" labelPosition="left" :rules="rules" >
            <el-form-item :label="$t('testing.datasetUsed')" :label-width="formLabelWidth" class="evaluate-dataSetName-container" prop="datasetId">
                <div class="evaluate-dataSetName" >
                    {{ props.rowData?.datasetName }}
                </div>
            </el-form-item>
            <el-form-item :label="$t('testing.testingName')" prop="name" :label-width="formLabelWidth" >
                <el-input v-model="form.name" autocomplete="off" :placeholder="t('model.pleasePlace')" maxlength="30" />
            </el-form-item>
            <el-form-item :label="$t('testing.testingDesc')" prop="desc" :label-width="formLabelWidth">
                <el-input v-model="form.desc" show-word-limit maxlength="200" type="textarea" autocomplete="off" :placeholder="t('model.pleasePlace')" />
            </el-form-item>
            <el-form-item :label="$t('testing.type')" prop="type" :label-width="formLabelWidth">
                <el-select v-model="form.type" :placeholder="t('model.pleasePlace')" :suffix-icon="IconCaretDown" @change="isSubmitDisabled = false">
                    <template #label="{ label, value }">
                        <img v-if="form.type" :src="`data:image/svg+xml;base64,${llmOptions.find(item => item.value === form.type)?.icon}`" style="vertical-align: middle; margin-right: 8px;" />
                        <span>{{ label }}</span>
                    </template>
                    <el-option
                        v-for="item in llmOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" 
                    >
                        <img :src="`data:image/svg+xml;base64,${item.icon}`"/>
                        <span>{{ item.label }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('testing.method')" prop="method" :label-width="formLabelWidth">
                <el-select v-model="form.method" :placeholder="t('model.pleasePlace')" :suffix-icon="IconCaretDown">
                    <el-option
                        v-for="item in parserMethodOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="Top_k" prop="topk" :label-width="formLabelWidth">
                <el-input-number v-model="form.topk" :min="0" :max="10" />
                <span class="topk-desc">（1~10）</span>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" :disabled="!isSubmitDisabled" @click="handleSubmit(ruleFormRef)">{{ $t('btnText.confirm') }}</el-button>
                <el-button @click="handleCancelVisible">
                    {{ $t('btnText.cancel') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus';
import "@/styles/evaluate.scss"
import KbAppAPI from '@/api/kbApp';
import dataSetAPI from '@/api/dataSet';
import EvaluateAPI from '@/api/evaluate';
import { useGroupStore } from '@/store/modules/group';
import { IconCaretDown, } from '@computing/opendesign-icons';
const { t, } = useI18n();
const store = useGroupStore();
const { handleKnowledgeTab } = store;

const props = defineProps({
    dialogEvaluateVisible: Boolean,
    rowData: Object,
    close: Function,
})

const isSubmitDisabled = ref(true);
const ruleFormRef = ref<FormInstance>()
const formLabelWidth = '60px';
const parserMethodOptions = ref<any>([])
const llmOptions = ref<Array<{
    label: string,
    value: string,
    icon: string
}>>([]);

let form = reactive({
  name: '',
  type: '',
  desc: '',
  method:'',
  topk:5,
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: t('model.pleasePlace'), trigger: 'blur' },
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
  topk: [
    { required: true, message: t('model.pleasePlace'), trigger: 'change' },
  ],
})

const handleSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            let params = {
                testingName: form.name,
                description: form.desc,
                datasetId: props.rowData?.datasetId,
                llmId: form.type,
                searchMethod: form.method,
                topK: form.topk
            }
            EvaluateAPI.createTesting(params).then(()=>{
                handleCancelVisible();
                handleKnowledgeTab('evaluation')
            })
        }
    })
}

const handleCancelVisible = () => {
    props.close?.();
    ruleFormRef.value?.resetFields();
}
const initFormData = () => {
    form.name = '测试数据01'
    form.type = llmOptions.value.length > 0 ? llmOptions.value[0].value : '';
    form.method = parserMethodOptions.value.length > 0 ? parserMethodOptions.value[0].value : '';
    form.topk = 5;
}
onMounted( async () => {
    await KbAppAPI.querySearchMethodList().then((res: any) => {
        parserMethodOptions.value = res?.map((item: any) => {
            return { label: item, value: item };
        });
    });
    await dataSetAPI.queryLlmData().then((res:any)=>{
        llmOptions.value = res.llms?.map((item: any) => {
            return { label: item.llmName, value: item.llmId,icon:item.llmIcon };
        });
    })
    initFormData();
})

</script>