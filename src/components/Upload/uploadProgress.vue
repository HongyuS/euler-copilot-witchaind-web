<template>
  <div
    v-if="showUploadNotify"
    class="o-upload-progress-notify"
    v-loading="taskListLoading"
    :element-loading-text="`${$t('pageTipText.Loading')}...`"
    element-loading-background="rgba(122, 122, 122, 0.3)">
    <div class="o-upload-notify__head">
      <div class="task-list">
        <span>{{ $t('assetLibrary.importTaskList') }}</span>
        <span>{{ `(${taskStatusList.length})` }}</span>
      </div>
      <div class="nofity-show">
        <el-icon
          class="o-upload-notify__close"
          @click="handleShowTaskList()">
          <IconChevronDown v-if="showTaskList" />
          <IconChevronUp v-else />
        </el-icon>
      </div>
    </div>
    <div
      class="o-upload-notify__body"
      v-if="showTaskList">
      <div
        class="o-upload-notify__list"
        @scroll="handleScroll">
        <div
          v-for="(item, index) in taskStatusList"
          :key="item.id"
          class="item">
          <div class="item-box">
            <div class="item-info">
              <div
                :class="
                  ['success', 'canceled'].includes(item.uploadStatus)
                    ? 'item-success-name'
                    : 'item-name'
                ">
                <TextSingleTootip :content="item.name" />
              </div>
              <div
                class="item-file-size"
                v-if="!['pending', 'running'].includes(item.uploadStatus)">
                <TextSingleTootip
                  :content="`，${$t('dialogTipText.fileSize')} ${bytesToSize(item?.file?.size || item?.size || 0)}`" />
              </div>
              <div
                v-if="!['success', 'canceled'].includes(item.uploadStatus)"
                class="upload-status">
                {{ `，${$t('assetLibrary.uploadIng')}...` }}
              </div>
            </div>
            <div
              class="item-close"
              v-if="typeof item.id === 'string'">
              <IconX @click="handleCloseSingleUpload(item.taskId)" />
            </div>
          </div>
          <el-progress
            :percentage="item.percent"
            v-if="item.uploadStatus !== 'canceled'"
            :stroke-width="8" />
          <div
            v-if="['success'].includes(item.uploadStatus)"
            class="upload-success">
            <span>
              <el-icon class="icon-tip">
                <CircleCheckFilled />
              </el-icon>
            </span>
            <span>{{ $t('uploadText.uploadSuccess') }}</span>
          </div>
          <div
            v-if="item.error"
            class="upload-error">
            <span>
              <el-icon class="icon-tip"><WarningFilled /></el-icon>
            </span>
            <span>{{ $t('uploadText.uploadFailed') }}</span>
            <span
              class="upload-restart"
              @click="handleUploadRestart(item)">
              {{ $t('btnText.retry') }}
            </span>
          </div>
          <div
            v-if="item.uploadStatus === 'canceled'"
            class="upload-error">
            <span>
              <el-icon class="icon-tip"><WarningFilled /></el-icon>
            </span>
            <span>{{ $t('exportTask.canceled') }}</span>
          </div>
        </div>
      </div>
      <div
        class="item-all-close"
        v-if="taskStatusList.length > 0 && isShowAllClear"
        @click="handleCloseSingleUpload('all')">
        {{ $t('btnText.clearAll') }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import '@/styles/uploadProgress.scss';
import { bytesToSize } from '@/utils/bytesToSize';
import TextSingleTootip from '@/components/TextSingleTootip/index.vue';
import { IconChevronUp, IconChevronDown, IconX } from '@computing/opendesign-icons';
const taskStatusList = ref<any>([]);
const props = defineProps({
  isKnowledgeFileUpload: {
    type: Boolean,
  },
  showUploadNotify: {
    type: Boolean,
  },
  uploadingList: {
    type: Array<any>,
    default: [],
  },
  handleShowTaskList: {
    type: Function,
    default: () => {},
  },
  showTaskList: {
    type: Boolean,
  },
  handleCloseSingleUpload: {
    type: Function,
    default: () => {},
  },
  handleUploadRestart: {
    type: Function,
    default: () => {},
  },
  taskListImportDate: {
    type: Number,
  },
  importTaskTotal: {
    type: Number,
  },
  handleImportScroll: {
    type: Function,
    default: () => {},
  },
  taskListLoading: {
    type: Boolean,
    default: false,
  },
  isShowAllClear: {
    type: Boolean,
    default: true,
  },
});

const handleScroll = (e: any) => {
  props.handleImportScroll(e);
};
watch(
  () => props.uploadingList,
  () => {
    if (props.isKnowledgeFileUpload) {
      taskStatusList.value = props.uploadingList.filter((item) => item.uploadStatus !== 'success');
    } else {
      taskStatusList.value = props.uploadingList;
    }
  },
  {
    deep: true,
  }
);
watch(
  () => props.taskListImportDate,
  () => {
    taskStatusList.value = props.uploadingList;
  }
);
onMounted(() => {
  if (props.isKnowledgeFileUpload) {
    taskStatusList.value = props.uploadingList.filter((item) => item?.uploadStatus !== 'success');
  } else {
    taskStatusList.value = props.uploadingList;
  }
});
</script>
<style lang="scss" scoped>
.icon-tip {
  margin-top: 4px;
  width: 16px;
  height: 16px;
}
</style>
