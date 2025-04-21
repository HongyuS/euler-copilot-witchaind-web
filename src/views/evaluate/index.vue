<template>
    <div class="evaluate-empty-content">
        <EmptyStatus description="暂无评测信息，去数据集生成一个吧！" buttonText="去生成评测" buttonClass="group-btn" @click="handleCreate" />
    </div>
</template>

<script setup lang="ts">
import "@/styles/evaluate.scss"
import EmptyStatus from '@/components/EmptyStatus/index.vue'

const handleCreate = () => {
}

</script>