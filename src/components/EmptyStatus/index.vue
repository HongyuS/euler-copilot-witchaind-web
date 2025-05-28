<template>
  <el-empty :description="description">
    <el-button
      v-if="showButton"
      type="primary"
      class="empty-button-common"
      :class="buttonClass"
      @click="handleButtonClick"
    >
      {{ buttonText }}
    </el-button>
  </el-empty>
</template>

<script setup lang="ts">
import i18n from '@/lang'; // 引入国际化模块

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
  description: i18n.global.t('pageTipText.NoData'),
  showButton: true,
  buttonText: i18n.global.t('group.create'),
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