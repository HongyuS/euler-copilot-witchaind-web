<template>
    <UserHeaderBar />
    <CustomLoading :loading="false" />
    <div class="group-container">
        <div class="group-box">
            <el-tabs type="border-card" class="group-tabs" >
                <el-tab-pane class="group-tabs-item" v-for="item in groupTabs" :key="item.key" :label="item.name">
                    <div class="group-tab-header">
                        <el-button type="primary" class="group-btn" >新建团队</el-button>
                        <div class="group-right-btn">
                            <div class="group-btn-search">
                                <el-input
                                ref="inputRef"
                                v-model="knoledgekeyWord"
                                @input="handleInputSearch"
                                class="o-style-serch"
                                placeholder="请输入团队名称"
                                clearable>
                                <template #suffix>
                                    <el-icon class="el-input__icon">
                                        <IconSearch />
                                    </el-icon>
                                </template>
                                </el-input>
                            </div>
                            <div class="group-btn-switch">
                                <div
                                class="group-btn-switch-icon"
                                @click="handleSwitch('thumb')"
                                :class="switchIcon === 'thumb' ? 'bgThumb' : ''">
                                <el-icon>
                                    <IconThumbnail />
                                </el-icon>
                                </div>

                                <div
                                class="group-btn-switch-icon"
                                @click="handleSwitch('list')"
                                :class="switchIcon === 'list' ? 'bgThumb' : ''">
                                <el-icon>
                                    <IconList />
                                </el-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 卡片布局 -->
                    <div v-if="switchIcon === 'thumb'" class="group-tabs-content">
                        <div class="group-card-item" @click="handleToGroup(item)" v-for="item in groupList" :key="item.id" >
                            <div class="group-card-title">
                            <span class="group-card-title-name" >{{ item.name }}</span>
                                <span class="card-type" :class="item.type==='公开'?'card-type-public':'card-type-privacy'">{{ item.type}}</span>
                            </div>
                            <div class="group-card-desc" >
                                {{ item.desc }}
                            </div>
                            <div class="group-card-footer" >
                                <div class="info" >
                                    @{{item.owner}}
                                <span style="margin-left: 16px;">
                                    <el-icon><User /></el-icon>
                                    {{item.member}}人
                                </span>
                                </div>
                                <el-button text >
                                    编辑
                                </el-button>
                            </div>
                        </div>
                    </div>
                    <!-- 列表布局 -->
                    <div
                        class="group-table-box"
                        v-else>
                        <el-table
                        :data="groupList"
                        :border="true"
                        >
                        <el-table-column
                            prop="name"
                            label="团队名称"
                            :show-overflow-tooltip="true"
                            width="300"
                            :fixed="true"
                            class-name="group-name">
                            <template #default="scope">
                            <span
                                class="group-name-row"
                                @click="handleToGroup(scope.row)">
                                {{ scope.row.name }}
                            </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="desc"
                            label="团队简介"
                            :show-overflow-tooltip="true" />
                        <el-table-column
                            prop="member"
                            sortable
                            width="150"
                            label="团队人数" />
                        <el-table-column
                            prop="document_count"
                            sortable
                            width="150"
                            label="团队权限" />
                        <el-table-column
                            prop="owner"
                            sortable
                            width="150"
                            label="创建人" />
                        <el-table-column
                            prop="document_count"
                            sortable
                            width="150"
                            label="创建时间" />
                        <el-table-column
                            prop="action"
                            :label="$t('btnText.operation')"
                            width="180">
                            <template #default="scope">
                                <el-button
                                    text
                                    @click="handleEditKl(scope.row)">
                                    {{ $t('btnText.edit') }}
                                </el-button>
                            </template>
                        </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script lang="ts" setup>
import UserHeaderBar from '@/components/UserHeaderBar/index.vue';
import CustomLoading from '@/components/CustomLoading/index.vue';
import "@/styles/group.scss"
import {groupList} from './data.js'
import {
  IconList,
  IconSearch,
  IconThumbnail,
} from '@computing/opendesign-icons';
import { ref } from 'vue';
import { debounce } from 'lodash';
import router from '@/router/index';
import { useGroupStore } from '@/store/modules/group.js';

const { navGroup } =  storeToRefs(useGroupStore());

const groupTabs=[
    {
        name:'我创建的',
        key:'create',
    },
    {
        name:'我加入的',
        key:'join',
    },
    {
        name:'全部团队',
        key:'all',
    },
]
const switchIcon = ref('thumb');
const knoledgekeyWord = ref();

const handleInputSearch = debounce((e) => {
}, 200);

const handleSwitch = (switchType: string) => {
  switchIcon.value = switchType;
};
const handleToGroup=(row:any)=>{
    let groupNav = navGroup.value;
    groupNav[1]={
        name:row.name,
        path:'/groupInfo',
        query:{
            name:row.name
        }}
    router.push({path:`/groupInfo`,query:{name:row.name}});
}
const handleEditKl=(row:any)=>{
}

</script>

