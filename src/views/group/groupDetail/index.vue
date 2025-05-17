<template>
    <div class="group-detial-container">
        <div class="group-name">{{ groupName }}</div>
        <el-tabs v-model="activeName" class="group-detail-tabs" @tab-click="handleClick">
            <el-tab-pane label="团队设置" name="teamSet">
                <el-form :model="form" label-width="auto" style="max-width: 500px">
                    <el-form-item prop="name" label="团队名称">
                        <el-input v-model="form.teamName" maxlength="100" />
                    </el-form-item>
                    <el-form-item prop="description" label="团队简介">
                        <el-input v-model="form.description" type="textarea" :rows="4" maxlength="200"
                            show-word-limit />
                    </el-form-item>
                    <el-form-item prop="isPublic" label="是否公开">
                        <el-switch v-model="form.isPublic" style="--el-switch-on-color: rgb(36,171,54); " />
                    </el-form-item>
                    <el-form-item prop="teamMember" label="团队人数">
                       {{ form.teamMember }}人
                    </el-form-item>
                    <el-form-item prop="deleteTeam" label="解散团队">
                        <el-button @click="handleDeleteTeam" >解散</el-button>
                        <span class="btn-tips">解散团队后相关资源都会被释放，请谨慎操作</span>
                    </el-form-item>
                    <el-form-item class="save-btn">
                        <el-button type="primary" :disabled="isSubmitDisabled" @click="onSubmit">保存</el-button>
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

const groupStore = useGroupStore();
const { curTeamInfo } = storeToRefs(groupStore);
const { handleSwitchMenu, delNav,setCurTeamInfo } = groupStore;

const route = useRoute();
const router = useRouter();

const isSubmitDisabled = computed(()=>{
    let oldData = JSON.stringify({teamName:curTeamInfo.value.teamName,description:curTeamInfo.value.description,isPublic:curTeamInfo.value.isPublic})
    let newData = JSON.stringify({teamName:form.value.teamName,description:form.value.description,isPublic:form.value.isPublic})
    return oldData === newData
})

let groupName = route.query.name as string;
let activeName = 'teamSet';
const form = ref({
    teamName: '',
    description: '',
    isPublic: false,
    teamMember: '',
})

watch(()=>curTeamInfo.value, (newVal) => {
    form.value.teamName = newVal.teamName;
    form.value.description = newVal.description;
    form.value.isPublic = newVal.isPublic;
    form.value.teamMember = newVal.memberCount;
})

const onSubmit = () => {
    GroupAPI.updateTeam(
        { teamId: curTeamInfo.value.teamId },
        {
            teamName: form.value.teamName,
            description: form.value.description,
            isPublic: form.value.isPublic,
        }
    ).then((res) => {
        ElMessage({
            message: '团队更新成功',
            type: 'success',
        })
        delNav(1);
        router.push('/group');
        handleSwitchMenu('knowledge')
    })
}


const handleClick = (tab: any, event: any) => {
    console.log(tab, event);
};

const handleDeleteTeam=() => {
    ElMessageBox.confirm(
        `解散【${curTeamInfo.value.teamName}】团队后，该团队下的所有项目都将被同步删除，且不可恢复！请谨慎操作。`,
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            cancelButtonClass: 'el-button--primary',
            confirmButtonClass: 'el-button-confirm',
            type: 'warning',
            icon:markRaw(IconAlarm)
        }
    ).then(()=>{
        GroupAPI.deleteTeam({
            teamId: curTeamInfo.value.teamId
        }).then((res) => {
            delNav(1);
            router.push('/group');
            handleSwitchMenu('knowledge')
            ElMessage.success(`团队【${curTeamInfo.value.teamName}】解散成功`);
        })
    })
}

</script>

<style lang="scss">
.group-detial-container {
    height: calc(100vh - 100px);
    display: flex;
    flex-direction: column;

    .group-name {
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
    }

    .group-detail-tabs {
        .el-form-item__label {
            font-size: 12px;
            padding-right: 24px;
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
.el-message-box{
  padding: 0px !important;
  .el-message-box__content{
    .el-message-box__message{
      padding-left: 0px;
    }
  }
  .el-message-box__btns{
    justify-content: center;
    .el-button-confirm{
        --el-button-bg-color:white;
        --el-button-text-color: rgb(78,88,101);
        &:focus{
            background-color: white;
            color: rgb(78,88,101) !important;
        }
        &:hover,&:active{
            background-color: white;
            color: rgba(78,88,101,0.8) !important;
        }
    }
  }
}
</style>
