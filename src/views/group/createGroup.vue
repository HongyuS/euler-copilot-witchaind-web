<template>
    <el-dialog class="evaluate-dialog" v-model="props.createGroupVisible"
        :title="props.dialogueType === 'edit' ? '编辑团队' : '新建团队'" width="544" v-if="props.createGroupVisible"
        @close="handleCancelVisible">
        <el-form ref="ruleFormRef" class="evaluate-form" :model="form" labelPosition="left" :rules="rules">
            <el-form-item label="团队名称" prop="teamName" :label-width="formLabelWidth">
                <el-input v-model="form.teamName" autocomplete="off" :placeholder="t('model.pleasePlace')" />
            </el-form-item>
            <el-form-item label="团队简介" prop="description" :label-width="formLabelWidth">
                <el-input v-model="form.description" :rows="4" show-word-limit type="textarea" maxlength="200"
                    :placeholder="$t('assetLibrary.message.pleasePlace')" />
            </el-form-item>
            <el-form-item label="是否公开" prop="isPublic" :label-width="formLabelWidth">
                <el-switch v-model="form.isPublic" style="--el-switch-on-color: rgb(36,171,54); " />
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
<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus';

const { t, } = useI18n();

const props = defineProps({
    createGroupVisible: Boolean,
    currentRow: Object,
    close: Function,
    dialogueType: String,
})
const ruleFormRef = ref<FormInstance>()
const formLabelWidth = '100px';
const isSubmitDisabled = ref(true);
interface RuleForm {
    testId: string;
    teamName: string;
    description: string;
    isPublic: boolean | null;
    [property: string]: any;
}
let form = ref<RuleForm>({
    testId: '',
    teamName: '',
    description: '',
    isPublic: false,
});
watch(() => props.createGroupVisible, () => {
    if (props.dialogueType && props.dialogueType === 'edit') {
        form.value = JSON.parse( JSON.stringify({ ...props.currentRow }))
    }
})
const rules = reactive<FormRules>({
    teamName: [
        { required: true, message: t('model.pleasePlace'), trigger: 'blur' },
        { max: 100, message: 'Length should be 0 to 100', trigger: 'blur' },
    ],
    description: [
        { message: t('model.pleasePlace'), trigger: 'blur' },
    ],
});
const handleSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid,) => {
        if (valid) {
            console.log('submit!',form.value)
        }
    })
    props.close?.();
    ruleFormRef.value?.resetFields();
    form.value = {
        testId:'',
        teamName: '',
        description: '',
        isPublic: false,
    };
}

const handleCancelVisible = () => {
    props.close?.();
    ruleFormRef.value?.resetFields();
    form.value = {
        testId:'',
        teamName: '',
        description: '',
        isPublic: false,
    };
}
</script>
<style lang="scss">
.evaluate-dialog {
    .el-dialog__header {
        padding: 0 0 16px 8px !important;
    }

    .el-dialog__body {
        padding-left: 8px;
        padding-right: 4px;
        padding-bottom: 0px;

        .evaluate-form {
            .el-form-item {
                .el-form-item__label {
                    color: rgb(78, 88, 101);
                }

                .evaluate-dataSetName {
                    color: black;
                }

            }
        }
    }

    .el-dialog__footer {
        padding-bottom: 8px;

        .dialog-footer {
            display: flex;
            justify-content: center;

            & button {
                height: 24px;
                width: 64px;
            }
        }
    }
}
</style>
