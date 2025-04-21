<template>
    <div class="dataset-empty-content">
        <EmptyStatus button-text="去生成数据集" description="暂无数据集信息，去文档管理生成一个吧！" @click="handleToCreate" />
    </div>
</template>

<script setup lang="ts">
import EmptyStatus from "@/components/EmptyStatus/index.vue";
import { useGroupStore } from "@/store/modules/group";
import "@/styles/dataSet.scss";
const store = useGroupStore();
const { handleKnowledgeTab } = store;

const handleToCreate = () => {
    handleKnowledgeTab('document');
}

</script>