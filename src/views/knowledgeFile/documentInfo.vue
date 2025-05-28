<template>
  <GroupLayout>
    <!-- 知识库内容 -->
    <template v-slot:default>
      <div v-show="groupMenu === 'knowledge'">
        <div class="document-info-title">
          <div class="document-info-title-left">
            {{ navGroup[3]?.name }}
          </div>
        </div>
        <el-tabs v-model="activeName" class="library-info-tabs" @tab-click="handleTabClick">
          <el-tab-pane :label="$t('assetFile.documentInfo')" name="documentInfo">
            <knowledgeFileSection />
          </el-tab-pane>
          <el-tab-pane :label="$t('assetFile.log')" name="log">
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
import "@/styles/libraryInfo.scss"
const { navGroup, groupMenu } = storeToRefs(useGroupStore());

let activeName = ref('documentInfo')
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