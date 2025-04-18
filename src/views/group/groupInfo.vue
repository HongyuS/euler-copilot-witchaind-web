<template>
  <GroupLayout>
    <!-- 知识库内容 -->
    <template v-slot:default>
      <div v-show="groupMenu === 'knowledge'">
        <div>
          <knowledgeLibrary :groupName="groupName" />
        </div>
      </div>
    </template>
  </GroupLayout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGroupStore } from "@/store/modules/group";
import GroupLayout from '@/components/GroupLayout/index.vue';
import knowledgeLibrary from "@/views/knowledgeLibrary/index.vue";

const route = useRoute();
const groupName = route.query.name as string;
const { groupMenu } = storeToRefs(useGroupStore());
</script>