<template>
  <GroupLayout>
    <!-- 知识库内容 -->
    <template v-slot:default>
      <div v-show="groupMenu === 'knowledge'">
        <div class="library-info-title">{{ navGroup[2].name }}</div>
        <el-tabs v-model="knowledgeTabActive" class="library-info-tabs" @tab-click="handleTabClick">
          <el-tab-pane label="文档管理" name="document">
            <knowledgeFile />
          </el-tab-pane>
          <el-tab-pane label="数据集管理" name="dataset">
            <DataSet />
          </el-tab-pane>
          <el-tab-pane label="评测管理" name="evaluation">
            <Evaluate />
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
  </GroupLayout>
</template>

<script setup lang="ts">
import { useGroupStore } from "@/store/modules/group";
import knowledgeFile from "@/views/knowledgeFile/index.vue"
import DataSet from "@/views/dataSet/index.vue"
import Evaluate from "@/views/evaluate/index.vue"
import { storeToRefs } from "pinia";
import "@/styles/libraryInfo.scss"

const store = useGroupStore();
const { navGroup, groupMenu,knowledgeTabActive } = storeToRefs(store);
const {handleKnowledgeTab} = store;

const handleTabClick = (tab: any) => { 
  handleKnowledgeTab(tab.name)
}


</script>