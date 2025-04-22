<template>
  <GroupLayout>
    <!-- 知识库内容 -->
    <template v-slot:default>
      <div v-show="groupMenu === 'knowledge'">
        <div class="document-info-title">
          <div class="document-info-title-left">
            {{ navGroup[3].name }}
          </div>
          <el-dropdown placement="bottom" popper-class="dropdown-container kf-ops-dowlon"
            @visible-change="handleBatchDownBth">
            <el-button :class="batchDownBth ? 'upBtn' : 'downBtn'">
              下载
              <el-icon class="el-icon--right" v-if="!batchDownBth">
                <IconCaretDown />
              </el-icon>
              <el-icon class="el-icon--right el-icon--caretup" v-if="batchDownBth">
                <IconCaretUp />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  文档信息
                </el-dropdown-item>
                <el-dropdown-item>
                  日志
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <el-tabs v-model="activeName" class="library-info-tabs" @tab-click="handleTabClick">
          <el-tab-pane label="文档信息" name="documentInfo">
            <knowledgeFileSection />
          </el-tab-pane>
          <el-tab-pane label="日志" name="log">
            <documentLog />
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
  </GroupLayout>
</template>

<script setup lang="ts">
import { useGroupStore } from "@/store/modules/group";
import knowledgeFileSection from "@/views/knowledgeFileSection/index.vue"
import GroupLayout from "@/components/GroupLayout/index.vue"
import documentLog from "@/views/knowledgeFile/documentLog.vue"
import { storeToRefs } from "pinia";
import {
  IconCaretDown,
  IconCaretUp,
} from '@computing/opendesign-icons';
import "@/styles/libraryInfo.scss"
const { navGroup, groupMenu } = storeToRefs(useGroupStore());

let activeName = ref('documentInfo')
const batchDownBth = ref(false);
const handleBatchDownBth = (e: boolean) => {
  batchDownBth.value = e;
};
const handleTabClick = (tab: any, event: any) => { }


</script>
<style lang="scss" scoped>
.document-info-title {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .document-info-title-left {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 8px;
  }

}

  .el-dropdown-menu {
    padding: 4px 0 ;
  }
  .el-dropdown-menu__item {
    font-size: 12px;
  }
</style>