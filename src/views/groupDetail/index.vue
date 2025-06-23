<template>
    <CustomLoading :loading="loading" />
    <div class="group-detial-container">
        <div class="group-name">{{ groupName }}</div>
        <el-tabs v-model="activeName" class="group-detail-tabs" @tab-click="handleClick">
            <el-tab-pane :label="$t('groupDetail.teamSet')" name="teamSet">
                <el-form :model="form" label-width="auto" style="max-width: 500px">
                    <el-form-item prop="name" :label="$t('group.teamName')">
                        <el-input v-model="form.teamName" maxlength="100" />
                    </el-form-item>
                    <el-form-item prop="description" :label="$t('group.teamDesc')">
                        <el-input v-model="form.description" type="textarea" :rows="4" maxlength="200"
                            show-word-limit />
                    </el-form-item>
                    <el-form-item prop="isPublic" :label="$t('group.isPublic')">
                        <el-switch v-model="form.isPublic" style="--el-switch-on-color: rgb(36,171,54); " />
                    </el-form-item>
                    <el-form-item prop="memberCount" :label="$t('group.teamSize')">
                       {{ form.memberCount }}{{ $t('group.people') }}
                    </el-form-item>
                    <el-form-item prop="deleteTeam" :label="$t('groupDetail.dissolveTeam')">
                        <el-button @click="handleDeleteTeam" >{{ $t('groupDetail.dissolve') }}</el-button>
                        <span class="btn-tips">{{ $t('groupDetail.dissolveTip') }}</span>
                    </el-form-item>
                    <el-form-item class="save-btn">
                        <el-button type="primary" :disabled="isSubmitDisabled" @click="onSubmit">{{ $t('btnText.save') }}</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script lang="ts" setup>
import GroupAPI from '@/api/group';
import { useGroupStore } from '@/store/modules/group';
import { IconAlarm } from '@computing/opendesign-icons';
import CustomLoading from '@/components/CustomLoading/index.vue';

const groupStore = useGroupStore();
const { curTeamInfo,groupMenu } = storeToRefs(groupStore);
const { handleSwitchMenu, delNav } = groupStore;

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const loading = ref(false);

const isSubmitDisabled = computed(()=>{
    let oldData = JSON.stringify({teamName:curTeamInfo.value.teamName,description:curTeamInfo.value.description,isPublic:curTeamInfo.value.isPublic})
    let newData = JSON.stringify({teamName:form.value.teamName,description:form.value.description,isPublic:form.value.isPublic})
    return oldData === newData
})

let groupName = ref('');
let activeName = 'teamSet';
const form = ref({
    teamName: '',
    description: '',
    isPublic: false,
    memberCount: '',
})

const queryGroupDetail = () => {
    loading.value = true;
    let param = {
        teamId: localStorage.getItem('teamId') ?? '',
        page: 1,
        pageSize: 10,
    };
    GroupAPI.teamList(param).then((res: any) => {
        form.value = res.teams[0];
        groupName.value = res.teams[0].teamName;
    }).finally(() => {
        loading.value = false;
    })
}

watch(()=>groupMenu.value , (newVal) => {
    if(newVal=== 'detail'){
        queryGroupDetail();
    } 
})

const onSubmit = () => {
  const teamId = localStorage.getItem('teamId') ?? '';
  GroupAPI.updateTeam(
        { teamId },
        {
            teamName: form.value.teamName,
            description: form.value.description,
            isPublic: form.value.isPublic,
        }
    ).then((res) => {
        ElMessage({
            message: t('groupDetail.updateTeamTip'),
            type: 'success',
        })
        queryGroupDetail();
    })
}


const handleClick = (tab: any, event: any) => { };

const handleDeleteTeam=() => {
    ElMessageBox.confirm(
        `${t('groupDetail.confirmDissolve',{name:form.value.teamName})}`,
        t('dialogTipText.tipsText'),
        {
            confirmButtonText: t('btnText.confirm'),
            cancelButtonText: t('btnText.cancel'),
            cancelButtonClass: 'el-button--primary',
            confirmButtonClass: 'el-button-confirm',
            type: 'warning',
            icon:markRaw(IconAlarm)
        }
    ).then(()=>{
    const teamId = localStorage.getItem('teamId') ?? '';
    GroupAPI.deleteTeam({
            teamId
        }).then((res) => {
            delNav(1);
            router.push('/group');
            handleSwitchMenu('knowledge')
            ElMessage.success(`${t('groupDetail.team')}【${form.value.teamName}】${t('groupDetail.dissolveSuccess')}`);
        })
    })
}

onMounted(()=>{
    if(groupMenu.value=== 'detail'){
        queryGroupDetail();
    } 
})

</script>

<style lang="scss">
.group-detial-container {
    height: calc(100vh - 100px);
    display: flex;
    flex-direction: column;
    margin-right: 24px;

    .group-name {
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
        color: var(--o-text-color-primary);
        margin-bottom: 8px;
    }

    .group-detail-tabs {
        .el-form-item__label {
            font-size: 12px;
            padding-right: 24px;
            color: var(--o-text-color-secondary);
        }
        .btn-tips{
            font-size: 12px;
            color: rgb(141,152,170);
            margin-left: 8px;
        }
        .save-btn{
            padding-left: 72px;
            margin-top: 32px;
        }
    }
}
</style>
