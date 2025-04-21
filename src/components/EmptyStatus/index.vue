<template>
  <el-empty :description="description">
    <el-button
      v-if="showButton"
      type="primary"
      :class="buttonClass"
      @click="handleButtonClick"
    >
      {{ buttonText }}
    </el-button>
  </el-empty>
</template>

<script setup lang="ts">
interface Props {
  // 空状态描述文本
  description?: string;
  // 是否显示按钮
  showButton?: boolean;
  // 按钮文本
  buttonText?: string;
  // 按钮类名
  buttonClass?: string;
}

// 定义默认值
const props = withDefaults(defineProps<Props>(), {
  description: '暂无数据',
  showButton: true,
  buttonText: '新建',
  buttonClass: ''
});

// 定义事件
const emit = defineEmits<{
  (e: 'click'): void
}>();

// 按钮点击处理
const handleButtonClick = () => {
  emit('click');
};
</script>

<style>
/* 如果需要自定义样式可以在这里添加 */
.el-empty__description>p{
    font-size: 12px !important;
}
</style>