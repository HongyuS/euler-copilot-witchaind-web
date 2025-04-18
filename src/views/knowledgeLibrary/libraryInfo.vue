<template>
  <GroupLayout>
    <!-- 知识库内容 -->
    <template v-slot:default>
      <div v-show="groupMenu === 'knowledge'">
        <div class="library-info-title">{{ navGroup[2].name }}</div>
        <el-tabs v-model="activeName" class="library-info-tabs" @tab-click="handleTabClick">
          <el-tab-pane label="文档管理" name="document">
            <knowledgeFile />
          </el-tab-pane>
          <el-tab-pane label="数据集管理" name="dataset">Config</el-tab-pane>
          <el-tab-pane label="评测管理" name="evaluation">Role</el-tab-pane>
        </el-tabs>
      </div>
    </template>
  </GroupLayout>
</template>

<script setup lang="ts">
import { useGroupStore } from "@/store/modules/group";
import knowledgeFile from "@/views/knowledgeFile/index.vue"

import "@/styles/libraryInfo.scss"
const { navGroup, groupMenu } = storeToRefs(useGroupStore());

let activeName = ref('document')

const handleTabClick = (tab: any, event: any) => { }


</script>