<template>
  <div>
    <CustomLoading :loading="loading" />
  </div>
</template>
<script setup lang="ts">
import CustomLoading from '@/components/CustomLoading/index.vue';
const loading = ref(true);
</script>
