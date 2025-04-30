<template>
    <div class="group-detial-container">
        <div class="group-name">{{ groupName }}</div>
        <el-tabs v-model="activeName" class="group-detail-tabs" @tab-click="handleClick">
            <el-tab-pane label="团队设置" name="teamSet">
                <el-form :model="form" label-width="auto" style="max-width: 500px">
                    <el-form-item prop="name" label="团队名称">
                        <el-input v-model="form.name" />
                    </el-form-item>
                    <el-form-item prop="description" label="团队简介">
                        <el-input v-model="form.description" type="textarea" :rows="4" maxlength="200"
                            show-word-limit />
                    </el-form-item>
                    <el-form-item prop="is_public" label="是否公开">
                        <el-switch v-model="form.is_public" style="--el-switch-on-color: rgb(36,171,54); " />
                    </el-form-item>
                    <el-form-item prop="teamMember" label="团队人数">
                        10人
                    </el-form-item>
                    <el-form-item prop="is_public" label="移交团队">
                        <el-button>移交</el-button>
                        <span class="btn-tips">将团队的所有者权限移交给其他成员</span>
                    </el-form-item>
                    <el-form-item prop="is_public" label="解散团队">
                        <el-button>解散</el-button>
                        <span class="btn-tips">解散团队后相关资源都会被释放，请谨慎操作</span>
                    </el-form-item>
                    <el-form-item class="save-btn">
                        <el-button type="primary" @click="onSubmit">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script lang="ts" setup>

const route = useRoute();
let groupName = route.query.name as string;
let activeName = 'teamSet';
const form = reactive({
    name: '',
    description: '',
    is_public: false,
    teamMember: '',
})

const onSubmit = () => {
    console.log('submit!')
}


const handleClick = (tab: any, event: any) => {
    console.log(tab, event);
};
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
</style>
