<template>
    <div class="group-info">
        <!-- 通用标题部分 -->
        <div class="group-info-title">
            <div class="group-left-menu">
                <div class="group-menu-item">
                    <el-link @click="handleHomeClick" type="primary" class="home-menu" :underline="false">
                    {{ $t('group.witchaind') }}
                </el-link>
                </div>
                <div v-if="navGroup.length > 1" class="group-menu-item">
                    <div v-if="router.currentRoute.value.path.includes('/groupInfo')" class="group-name">
                        <div>/</div>
                        <div class="last-name">
                            {{ navGroup[1]?.name }}
                        </div>
                    </div>
                    <div v-else class="library-name" @click="handleGroupClick(1,navGroup[1])">
                        <el-link class="home-menu" @click="() => router.push('/group')" type="primary" target="_blank"
                            :underline="false">
                            /
                            {{ navGroup[1]?.name }}
                        </el-link>
                    </div>
                </div>
                <div v-if="navGroup.length > 2" class="group-menu-item">
                    <div v-if="router.currentRoute.value.path.includes('/libraryInfo')" class="group-name">
                        <div>/</div>
                        <div class="last-name">
                            {{ navGroup[2]?.name }}
                        </div>
                    </div>
                    <div v-else class="library-name" @click="handleGroupClick(2,navGroup[2])">
                        <el-link class="home-menu" @click="() => router.push('/groupInfo')" type="primary"
                            target="_blank" :underline="false">
                            <span class="last-name">/
                                {{ navGroup[2]?.name }}
                            </span>
                        </el-link>
                    </div>
                </div>
                <div v-if="navGroup.length > 3" class="group-menu-item">
                    <div  class="group-name">
                        <div>/</div>
                        <div class="last-name">
                            {{ navGroup[3]?.name }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="group-mid-menu">
                <div class="section" :class="{ 'section-active': groupMenu === 'knowledge' }"
                    @click="handleSwitchMenu('knowledge')">
                    {{ $t('assetLibrary.assetLibrary') }}
                </div>
                <div class="section" :class="{ 'section-active': groupMenu === 'detail' }"
                    @click="handleSwitchMenu('detail')">
                    {{ $t('group.teamDetail') }}
                </div>
            </div>
        </div>

        <!-- 内容区域 -->
        <div class="group-info-content">
            <!-- 当 groupMenu === 'detail' 时显示的内容 -->
            <div v-show="groupMenu === 'detail'">
                <groupDetail />
            </div>

            <!-- 其他内容通过默认插槽传入 -->
            <slot v-if="groupMenu !== 'detail'" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useGroupStore } from "@/store/modules/group";
import { storeToRefs } from 'pinia';
import groupDetail from '@/views/groupDetail/index.vue';

const router = useRouter();
const groupStore = useGroupStore();
const { navGroup, groupMenu } = storeToRefs(groupStore);
const { handleSwitchMenu, delNav, initNav } = groupStore;

const handleHomeClick = () => {
    router.push('/group');
    initNav();
    handleSwitchMenu('knowledge');
};
const handleGroupClick = ( number: number, currentNav:{ path:string,query:any }) => {
    if(groupMenu.value === 'detail'){
        handleSwitchMenu('knowledge');
    }
    delNav(number+1);
    router.push({ path: currentNav.path, query:currentNav.query });
}
</script>


<style lang="scss">
@use '@/styles/grouInfo.scss';
</style>