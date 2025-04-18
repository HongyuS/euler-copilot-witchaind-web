<template>
    <GroupLayout>
      <!-- 知识库内容 -->
      <template v-slot:default>
        <div v-show="groupMenu === 'knowledge'">
          <div class="library-info-title">{{ navGroup[3].name }}</div>
          <el-tabs v-model="activeName" class="library-info-tabs" @tab-click="handleTabClick">
            <el-tab-pane label="文档信息" name="documentInfo">
              <knowledgeFileSection />
            </el-tab-pane>
            <el-tab-pane label="日志" name="log">log</el-tab-pane>
          </el-tabs>
        </div>
      </template>
    </GroupLayout>
  </template>
  
  <script setup lang="ts">
  import { useGroupStore } from "@/store/modules/group";
  import knowledgeFileSection from "@/views/knowledgeFileSection/index.vue"
  import GroupLayout from "@/components/GroupLayout/index.vue"
  import { storeToRefs } from "pinia";
  import "@/styles/libraryInfo.scss"
  const { navGroup, groupMenu } = storeToRefs(useGroupStore());
  
  let activeName = ref('documentInfo')
  
  const handleTabClick = (tab: any, event: any) => { }
  
  
  </script>