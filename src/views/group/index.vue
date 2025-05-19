<template>
    <UserHeaderBar />
    <CustomLoading :loading="loading" />
    <div class="group-container">
        <div class="group-box">
            <el-tabs type="border-card" class="group-tabs" default-active="mycreated" v-model="activeName"
                @tab-change="handleTabChange">
                <el-tab-pane class="group-tabs-item" v-for="tab in groupTabs" :name="tab.name" :key="tab.name"
                    :label="tab.label">
                    <div class="group-tab-header">
                        <div>
                            <el-button v-if="tab.name === 'mycreated'" type="primary" class="group-btn"
                                @click="handleCreateGroup(true)">新建团队</el-button>
                        </div>
                        <div class="group-right-btn">
                            <div class="group-btn-search">
                                <el-input ref="inputRef" v-model="teamSearchName" @input="handleInputSearch"
                                    class="o-style-serch" placeholder="请输入团队名称" clearable>
                                    <template #suffix>
                                        <el-icon class="el-input__icon">
                                            <IconSearch />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </div>
                            <div class="group-btn-switch">
                                <div class="group-btn-switch-icon" @click="handleSwitch('thumb')"
                                    :class="switchIcon === 'thumb' ? 'bgThumb' : ''">
                                    <el-icon>
                                        <IconThumbnail />
                                    </el-icon>
                                </div>

                                <div class="group-btn-switch-icon" @click="handleSwitch('list')"
                                    :class="switchIcon === 'list' ? 'bgThumb' : ''">
                                    <el-icon>
                                        <IconList />
                                    </el-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="group-content-container">
                        <!-- 卡片布局 -->
                        <div v-if="switchIcon === 'thumb'" class="group-tabs-content">
                            <div class="group-card-item" v-for="item in groupList" :key="item.teamId">
                                <div class="group-card-title" @click="handleToGroup(item)">
                                    <span class="group-card-title-name">{{ item.teamName }}</span>
                                    <span v-if="item.isPublic" class="card-type card-type-public">公开</span>
                                    <span v-else class="card-type card-type-privacy">私密</span>
                                </div>
                                <div class="group-card-desc">
                                    <el-tooltip popper-class="desc-popper" effect="dark" :content="item.description"
                                        placement="top-start">
                                        {{ item.description }}
                                    </el-tooltip>
                                </div>
                                <div class="group-card-footer">
                                    <div class="info">
                                        @{{ item.authorName }}
                                        <span class="member-count">
                                            <img src="@/assets/images/member_count.svg" />
                                            {{ item.memberCount }}人
                                        </span>
                                    </div>
                                    <el-button v-if="tab.name === 'mycreated'" text @click="handleEditKl(item)">
                                        编辑
                                    </el-button>
                                </div>
                            </div>
                        </div>
                        <!-- 列表布局 -->
                        <div class="group-table-box" v-else>
                            <el-table :data="groupList" :border="true">
                                <el-table-column prop="teamName" label="团队名称" :show-overflow-tooltip="true" width="200"
                                    class-name="group-name">
                                    <template #default="scope">
                                        <span class="group-name-row" @click="handleToGroup(scope.row)">
                                            {{ scope.row.teamName }}
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="description" label="团队简介" width="200" :show-overflow-tooltip="true" />
                                <el-table-column prop="memberCount" width="150" label="团队人数" />
                                <el-table-column prop="isPublic" width="150" label="团队权限">
                                    <template #default="scope">
                                        <span v-if="scope.row.isPublic" class="card-type card-type-public">公开</span>
                                        <span v-else class="card-type card-type-privacy">私密</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="authorName" width="150" label="创建人" />
                                <el-table-column prop="createdtime" width="150" label="创建时间" >
                                    <template #default="scope">
                                        {{ convertUTCToLocalTime(scope.row.createdtime)}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="action" :label="$t('btnText.operation')" width="100">
                                    <template #default="scope">
                                        <el-button text @click="handleEditKl(scope.row)">
                                            {{ $t('btnText.edit') }}
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <el-pagination v-if="groupList?.length > 0" :current-page="currentPage" :page-size="currentPageSize"
                        :page-sizes="pagination.pageSizes" :layout="pagination.layout" :total="totalCount"
                        popper-class="kbLibraryPage" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
    <CreateGroup :createGroupVisible="createGroupVisible" :handlequeryTeamList="handlequeryTeamList"
        :dialogueType="dialogueType" :currentRow="currentRow" :close="() => handleCreateGroup(false)" />
</template>
<script lang="ts" setup>
import UserHeaderBar from '@/components/UserHeaderBar/index.vue';
import CustomLoading from '@/components/CustomLoading/index.vue';
import "@/styles/group.scss"
import {
    IconList,
    IconSearch,
    IconThumbnail,
} from '@computing/opendesign-icons';
import { ref } from 'vue';
import { debounce } from 'lodash';
import router from '@/router/index';
import { useGroupStore } from '@/store/modules/group.js';
import CreateGroup from './createGroup.vue';
import GroupAPI from '@/api/group';
import { TabPaneName } from 'element-plus';
import { convertUTCToLocalTime } from '@/utils/convertUTCToLocalTime';

const groupStore = useGroupStore();
const { setCurTeamInfo } = groupStore;

const activeName = ref('mycreated');
const currentRow = ref({});
const dialogueType = ref('create');
let groupList = ref<any>([]);

const pagination = ref({
    pageSizes: [10, 20, 30, 40, 50],
    layout: 'total,sizes,prev,pager,next,jumper',
});
const currentPage = ref(1);
const totalCount = ref(groupList.value.length);
const currentPageSize = ref(20);
const loading = ref(false);

const handleTabChange = (tabName: TabPaneName) => {
    activeName.value = tabName.toString();
    teamSearchName.value = '';
    currentPage.value = 1;
    let param = {
        teamType: tabName.toString(),
        page: currentPage.value,
        pageSize: currentPageSize.value
    };
    handlequeryTeamList(param);
};

const handleCurrentChange = (pageNum: number) => {
    currentPage.value = pageNum;
    let param = {
        teamType: activeName.value,
        teamName: teamSearchName.value,
        page: pageNum,
        pageSize: currentPageSize.value,
    };
    handlequeryTeamList(param);
};

const handleSizeChange = (pageSize: number) => {
    currentPageSize.value = pageSize;
    currentPage.value = 1; // 切换每页显示数量时重置为第一页
    let param = {
        teamType: activeName.value,
        teamName: teamSearchName.value,
        page: 1,
        pageSize: pageSize,
    };
    handlequeryTeamList(param);
};

const { navGroup } = storeToRefs(useGroupStore());

const groupTabs = [
    {
        label: '我创建的',
        name: 'mycreated',
    },
    {
        label: '我加入的',
        name: 'myjoined',
    },
    {
        label: '全部团队',
        name: 'public',
    },
]
const switchIcon = ref('thumb');
const teamSearchName = ref();
const createGroupVisible = ref(false);

const handleCreateGroup = (value: boolean) => {
    createGroupVisible.value = value;
    currentRow.value = {};
    dialogueType.value = 'create';
}

const handleEditKl = (row: any) => {
    currentRow.value = row;
    createGroupVisible.value = true;
    dialogueType.value = 'edit';
}

const handleInputSearch = debounce(() => {
    currentPage.value = 1;
    let param = {
        teamType: activeName.value,
        teamName: teamSearchName.value,
        page: currentPage.value,
        pageSize: currentPageSize.value
    };
    handlequeryTeamList(param);
}, 200);

const handleSwitch = (switchType: string) => {
    switchIcon.value = switchType;
};
const handleToGroup = async (row: any) => {
    await router.push({ path: `/groupInfo`, query: { name: row.teamName, id: row.teamId } });
    let groupNav = navGroup.value;
    groupNav[1] = {
        name: row.teamName,
        path: '/groupInfo',
        query: {
            name: row.teamName,
            id: row.teamId
        }
    }
    setCurTeamInfo(row);
    localStorage.setItem('teamId', row.teamId);
}

const handlequeryTeamList = (param: { teamType: string, page: number, pageSize: number, teamName?: string }) => {
    loading.value = true;
    GroupAPI.teamList(param).then((res: any) => {
        groupList.value = res.teams;
        totalCount.value = res.total;
    }).finally(() => {
        loading.value = false;
    })
}

onMounted(() => {
    let param = {
        teamType: activeName.value,
        teamName: teamSearchName.value,
        page: currentPage.value,
        pageSize: currentPageSize.value
    };
    handlequeryTeamList(param);
})

</script>
<style lang="scss">
    .desc-popper {
        max-width: 376px !important;
    }
</style>