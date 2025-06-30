<template>
    <el-dialog class="craete-group-dialog" v-model="props.createGroupVisible" align-center
        :title="props.dialogueType === 'edit' ? $t('group.editTeam') : $t('group.createTeam')" width="544" v-if="props.createGroupVisible"
        :close-on-click-modal="false" @close="handleCancelVisible">
        <el-form ref="ruleFormRef" class="evaluate-form" :model="form" labelPosition="right" :rules="rules">
            <el-form-item :label="$t('group.teamName')" prop="teamName" :label-width="formLabelWidth">
                <el-input maxlength="100" v-model="form.teamName" autocomplete="off" :placeholder="t('model.pleasePlace')" />
            </el-form-item>
            <el-form-item :label="$t('group.teamDesc')" prop="description" :label-width="formLabelWidth">
                <el-input v-model="form.description" :rows="4" show-word-limit type="textarea" maxlength="200"
                    :placeholder="$t('assetLibrary.message.pleasePlace')" />
            </el-form-item>
            <el-form-item :label="$t('group.isPublic')" prop="isPublic" :label-width="formLabelWidth">
                <el-switch v-model="form.isPublic" style="--el-switch-on-color: rgb(36,171,54); " />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" :disabled="props.dialogueType === 'edit' ?(isSubmitDisabled || isEditSubmitDisabled):isSubmitDisabled" @click="handleSubmit(ruleFormRef)">{{ $t('btnText.confirm') }}</el-button>
                <el-button @click="handleCancelVisible">
                    {{ $t('btnText.cancel') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
import GroupAPI from '@/api/group';
import { FormInstance, FormRules } from 'element-plus';

const { t, } = useI18n();

const props = defineProps({
    createGroupVisible: Boolean,
    currentRow: Object,
    close: Function,
    dialogueType: String,
    handlequeryTeamList: Function,
})
const ruleFormRef = ref<FormInstance>()
const formLabelWidth = '58px';
const isSubmitDisabled = ref(true);
interface RuleForm {
    testId?: string;
    teamName: string;
    description: string;
    isPublic: boolean;
    [property: string]: any;
}
let form = ref<RuleForm>({
    teamName: '',
    description: '',
    isPublic: false,
});
watch(() => props.createGroupVisible, () => {
    if (props.dialogueType && props.dialogueType === 'edit') {
        form.value = JSON.parse(JSON.stringify({ ...props.currentRow }))
    }
})
const rules = reactive<FormRules>({
    teamName: [
        { required: true, message: t('model.pleasePlace'), trigger: 'blur' },
    ],
    description: [
        { message: t('model.pleasePlace'), trigger: 'blur' },
    ],
});
watch(
    () => form.value.teamName,
    () => {
        isSubmitDisabled.value = !form.value.teamName?.length;
    },
    {
        deep: true,
        immediate: true,
    }
);
const isEditSubmitDisabled = computed(()=>{
    let oldData = JSON.stringify({teamName:props.currentRow?.teamName,description:props.currentRow?.description,isPublic:props.currentRow?.isPublic})
    let newData = JSON.stringify({teamName:form.value.teamName,description:form.value.description,isPublic:form.value.isPublic})
    return oldData === newData
})

const handelResetForm = () => {
    ruleFormRef.value?.resetFields();
    form.value = {
        testId: '',
        teamName: '',
        description: '',
        isPublic: false,
    };

}
const handleSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid,) => {
        if (valid) {
            if (props.dialogueType && props.dialogueType === 'edit') {
                GroupAPI.updateTeam(
                    { teamId: form.value.teamId },
                    {
                        teamName: form.value.teamName,
                        description: form.value.description,
                        isPublic: form.value.isPublic,
                    }
                ).then(() => {
                    ElMessage({
                        message: t('groupDetail.updateTeamSuccess'),
                        type: 'success',
                    })
                }).finally(() => {
                    props.handlequeryTeamList?.({ teamType: "mycreated", page: 1, pageSize: 20 })
                    props.close?.();
                    ruleFormRef.value?.resetFields();
                    form.value = {
                        testId: '',
                        teamName: '',
                        description: '',
                        isPublic: false,
                    };
                })
            } else {
                GroupAPI.createTeam(form.value).then((res) => {
                    ElMessage({
                        message: t('groupDetail.createTeamSuccess'),
                        type: 'success',
                    })
                }).finally(() => {
                    props.handlequeryTeamList?.({ teamType: "mycreated", page: 1, pageSize: 20 })
                    props.close?.();
                    ruleFormRef.value?.resetFields();
                    form.value = {
                        testId: '',
                        teamName: '',
                        description: '',
                        isPublic: false,
                    };
                })

            }
        }
    })
}

const handleCancelVisible = () => {
    props.close?.();
    ruleFormRef.value?.resetFields();
    form.value = {
        testId: '',
        teamName: '',
        description: '',
        isPublic: false,
    };
}
</script>
<style lang="scss">
.craete-group-dialog {
    padding: 0;
    .el-dialog__header {
        padding: 16px 24px 16px 24px;
    }

    .el-dialog__body {
        padding: 24px 24px 0px 24px;
        margin-right: 0pxs;
        .evaluate-form {
            .el-form-item {
                margin-bottom: 24px;
                .el-form-item__label {
                    font-size: 12px !important;
                    color: var(--o-item-label-text);
                    padding-right: 0px;
                    margin-right: 24px;
                    font-family: 'HarmonyOS Sans SC';
                    width: 48px !important;
                }
                .el-form-item__label:before {
                    position: absolute;
                    left: -8px;
                    width: 8px;
                    margin-right: 0px;
                }
                .el-input__inner,.el-textarea__inner{
                    font-size:12px !important;
                }
                

                .evaluate-dataSetName {
                    color: var(--o-primary-color);
                }

            }
        }
    }

    .el-dialog__footer {
        padding-bottom: 24px;
        padding-top: 8px;

        .dialog-footer {
            display: flex;
            justify-content: center;

            & button {
                height: 24px;
                width: 64px;
                &:first-child{
                    margin:0 8px 0 0 !important;
                }
                &:last-child {
                    margin: 0 !important;
                }
            }
        }
    }
}
</style>
