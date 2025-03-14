<template>
  <div class="upload-to-list" :class="{ 'has-files': hasFiles }">
    <div v-if="hasFiles">
      <el-alert :title="tipText" type="info" show-icon :closable="false" />
      <div class="list-action">
        <el-button
          type="primary"
          @click.stop="selectFiles"
          class="file-ops"
          :disabled="fileTableList.data.length >= props.maxFileNum"
        >
          {{ $t("btnText.chooseFile") }}
        </el-button>
        <el-button @click="batchDelete()" class="delFileBtn cancelBtn">
          {{ $t("btnText.batchDelete") }}
        </el-button>
      </div>
      <div class="list-tip">
        <div>{{ $t("dialogTipText.continueAdd") }}</div>
        <div>{{ fileTableList.data.length }} / {{ props.maxFileNum }}</div>
      </div>
    </div>
    <el-upload
      action=""
      drag
      multiple
      :limit="props.maxFileNum"
      :accept="accept"
      :show-file-list="false"
      :on-exceed="handleExceed"
      :on-success="handlsSuccess"
      :on-change="handleChange"
      :on-progress="handleProgress"
      :auto-upload="false"
    >
      <div ref="uploadEl" class="upload-block">
        <div v-if="hasFiles" class="upload-preview" @click.stop>
          <el-table
            :data="fileTableList.data"
            max-height="184"
            @selection-change="handleSelectionChange"
            ref="fileTableRef"
          >
            <el-table-column
              type="selection"
              class-name="upload-file-selection"
              width="48"
            />
            <el-table-column
              prop="name"
              :label="$t('dialogTipText.fileName')"
              class-name="upload-file-name"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="size"
              :label="$t('dialogTipText.fileSize')"
              width="120"
            />
            <el-table-column
              prop="action"
              :label="$t('btnText.operation')"
              width="100"
            >
              <template #default="scope">
                <el-button text @click="deleteFile(scope.row)">
                  {{ $t("btnText.delete") }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="upload-drag-mask">
            <div>
              <el-icon class="upload-btn-icon">
                <IconUpload />
              </el-icon>
              <div class="upload-tip">
                {{ $t("dialogTipText.dragDropAdd") }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="upload-add">
          <el-icon class="upload-btn-icon">
            <IconUpload />
          </el-icon>
          <div class="upload-tip">
            <div class="upload-drag">{{ $t("dialogTipText.dragFile") }}</div>
            <div class="upload-tip-text">({{ tipText }})</div>
            <div style="margin-top: 24px">
              <el-button type="primary" class="chooseFileBtn">
                {{ $t("btnText.chooseFile") }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-upload>
    <div v-if="hasFiles" class="upload-ops-btn">
      <el-button
        class="resetBtn"
        type="primary"
        :disabled="btnDisabled"
        @click="uploadType === 'file' ? uploadKnowledgeFile() : uploadFiles()"
      >
        {{ $t("btnText.confirm") }}
      </el-button>
      <el-button class="resetBtn cancelBtn" @click="handleCancelUpload()">
        {{ $t("btnText.cancel") }}
      </el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import "@/styles/upload.scss";
import { IconUpload, IconError } from "@computing/opendesign-icons";
import type {
  UploadFile,
  UploadProgressEvent,
} from "element-plus/es/components/upload/src/upload";
const { t } = useI18n();
import { ElMessage } from "element-plus";
import { bytesToSize, isMaxMemoryOut } from "@/utils/bytesToSize";
interface TableRow {
  id: string | number;
  name: string;
  size?: string;
  file: UploadFile;
}
const doUpload = (options: any) => {
  props.handleUploadMyFile(options);
};
const progressVal = ref(0);
const uploadEl = ref(null);
const btnDisabled = ref(true);
const props = defineProps({
  tipText: {
    type: String,
  },
  accept: {
    type: String,
  },
  maxFileNum: {
    type: Number,
    default: 0,
  },
  handleCancelVisible: {
    type: Function,
    default: () => {},
  },
  handleQueryTaskList: {
    type: Function,
    default: () => {},
  },
  maxSize: {
    type: Number,
    default: 0,
  },
  handleUploadMyFile: {
    type: Function,
    default: () => {},
  },
  handInitTaskList: {
    type: Function,
    default: () => {},
  },
  handleStopUploadFile: {
    type: Function,
    default: () => {},
  },
  taskListImportDate: {
    type: Number,
  },
  taskList: {
    type: Array,
    default: [],
  },
  toggleUploadNotify: {
    type: Function,
    default: () => {},
  },
  handleImportLoading: {
    type: Function,
    default: () => {},
  },
  singleFileLimit: {
    type: Boolean,
    default: false,
  },
  singleFileSize: {
    type: Number,
  },
  uploadType: {
    type: String,
  },
});
const fileTableList = reactive<{
  data: Array<TableRow>;
}>({
  data: [],
});
let selectedFiles: any[] = [];
const multipleSelection = ref<TableRow[]>([]);
const uploadingList = ref<Array<any>>([]);
const showTaskList = ref(true);

// 表格实例引用
const fileTableRef = ref();
const handleSelectionChange = (val: TableRow[]) => {
  multipleSelection.value = val;
  selectedFiles = val.map((item) => {
    return {
      id: item.id,
      name: item.name,
      file: item.file,
      percent: 0,
    };
  });
};

const hasFiles = computed(() => fileTableList.data.length > 0);

let allFileSizes = 0; // 所有文件大小
const handleChange = (file: UploadFile) => {
  const item: TableRow = {
    id: file.uid,
    name: file.name,
    size: bytesToSize(file.size as number),
    file: file,
  };
  allFileSizes += file.size as number;
  btnDisabled.value = isMaxMemoryOut(allFileSizes, props.maxSize);
  fileTableList.data.push(item);
};

// 超出文件数量限制时的处理
const handleExceed = () => {
  ElMessage.warning(
    `超出文件数量限制,最多只能上传 ${props.maxFileNum} 个文件!`
  );
};

const handleProgress = (e: UploadProgressEvent) => {
  progressVal.value = e.percent;
};

const handlsSuccess = () => {
  progressVal.value = 0;
};

const handleUploadRestart = (item: any) => {
  uploadingList.value = uploadingList.value.map((up) => {
    if (up.id === item.id) {
      return { ...item, error: false, uploadStatus: "error" };
    }
    return up;
  });
  doUpload({
    file: item.file,
    onProgress: (evt: any) => {
      item.percent = evt;
    },
    onError: (e: any) => {
      uploadingList.value = uploadingList.value.map((up) => {
        if (up.id === e.id) {
          return e;
        }
        return up;
      });
    },
    onSuccess: (response: any) => {
      item.percent = 100;
      props.handInitTaskList();
    },
    fileInfo: item,
  });
};

watch(
  () => fileTableList.data,
  () => {
    handleSelectionChange(multipleSelection.value);
  },
  {
    deep: true,
    immediate: true,
  }
);
const batchDelete = () => {
  if (!selectedFiles.length) {
    ElMessage.warning(`请先选择文件再进行批量删除操作！`);
    return;
  }
  selectedFiles.forEach((item) => item && deleteFile(item));
};
const deleteFile = (row?: any) => {
  if (row) {
    const idx = fileTableList.data.findIndex((item: any) => item.id === row.id);
    fileTableList.data.splice(idx, 1);
  }
};

const selectFiles = () => {
  uploadEl.value && (uploadEl.value as HTMLElement).click();
};

watch(
  () => props.taskListImportDate,
  (newVal, oldVal) => {
    uploadingList.value = props.taskList?.map((item: any) => {
      return {
        id: item.id,
        newUploadTask: false,
        taskId: item.task.id,
        name: item.name,
        size: item?.document_size,
        percent:
          item?.task?.status && item?.task?.status !== "pending" ? 100 : 99,
        uploadStatus: item?.task?.status,
      };
    });
    handleToggleUploadNotify();
  }
);

const handleLimitSize = (selectedFileData) => {
  let flag = false;
  selectedFileData.forEach((item) => {
    if (isMaxMemoryOut(item.file.size, props.singleFileSize)) {
      flag = true;
    }
  });

  return flag;
};
// 提交资产库 .zip
const uploadFiles = () => {
  if (props.singleFileLimit) {
    if (handleLimitSize(fileTableList.data)) {
      ElMessage({
        showClose: true,
        message: t("dialogTipText.singleFileSize"),
        icon: IconError,
        customClass: "o-message--error",
        duration: 3000,
      });
      return;
    }
  }
  props?.handleImportLoading(true);
  let uploadFileNumber = 0;
    props.handInitTaskList(fileTableList.data).then((res: any) => {
    uploadingList.value = fileTableList.data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        file: item.file,
        percent: 0,
        newUploadTask: true,
      };
    });
    uploadingList.value.forEach((item) => {
      return doUpload({
        file: item.file,
        onProgress: (evt: any) => {
          if (evt < 100) {
            item.percent = evt;
          }
        },
        onError: (e: any) => {
          uploadingList.value = uploadingList.value.map((up) => {
            if (up.id === e.id) {
              return e;
            }
            return up;
          });
        },
        onSuccess: (response: any) => {
          uploadFileNumber += 1;
          if (uploadFileNumber === fileTableList.data.length) {
            props.handleQueryTaskList();
          }
        },
        fileInfo: item,
      });
    });
    uploadingList.value = [
      ...uploadingList.value,
      ...res?.map((item: any) => {
        let reportDetail = item?.task?.reports?.[0];
        return {
          id: item.id,
          taskId: item.task.id,
          name: item.name,
          size: item?.document_size,
          percent:
            item?.task?.status === "success"
              ? 100
              : reportDetail && reportDetail?.current_stage
                ? (
                    (reportDetail?.current_stage / reportDetail?.stage_cnt) *
                    100
                  ).toFixed(1)
                : 0,
          uploadStatus: item?.task?.status,
        };
      }),
    ];
    uploadingList.value.length && handleToggleUploadNotify();
    props.handleCancelVisible();
    fileTableList.data = [];
  });
};

// 资产库内提交文件 .pdf .ms .docx......
const uploadKnowledgeFile = () => {
  if (props.singleFileLimit) {
    if (handleLimitSize(fileTableList.data)) {
      ElMessage({
        showClose: true,
        message: t("dialogTipText.singleFileSize"),
        icon: IconError,
        customClass: "o-message--error",
        duration: 3000,
      });
      return;
    }
  }
  props?.handleImportLoading(true);
  let uploadFileNumber = 0;
  uploadingList.value = fileTableList.data.map((item) => {
    return {
      id: item.id,
      name: item.name,
      file: item.file,
      percent: 0,
      newUploadTask: true,
    };
  });
  uploadingList.value.forEach((item) => {
    return doUpload({
      file: item.file,
      onProgress: (evt: any) => {
        if (evt < 100) {
          item.percent = evt;
        }
      },
      onError: (e: any) => {
        uploadingList.value = uploadingList.value.map((up) => {
          if (up.id === e.id) {
            return { ...e, uploadStatus: "error" };
          }
          return up;
        });
        props?.handleImportLoading(false);
        uploadingList.value.length && handleToggleUploadNotify();
      },
      onSuccess: (response: any) => {
        props.handleQueryTaskList(fileTableList.data);
        uploadFileNumber += 1;
        item.percent = 100;
        item.uploadStatus = "success";
      },
      fileInfo: item,
    });
  });
  uploadingList.value.length && handleToggleUploadNotify();
  props.handleCancelVisible();
  fileTableList.data = [];
};

const handleToggleUploadNotify = () => {
  props.toggleUploadNotify({
    showUploadNotify: true,
    uploadingList: uploadingList.value,
    showTaskList: showTaskList.value,
    handleShowTaskList: handleShowTaskList,
    handleUploadRestart: handleUploadRestart,
  });
};

const handleShowTaskList = () => {
  showTaskList.value = !showTaskList.value;
  handleToggleUploadNotify();
};

const handleCancelUpload = () => {
  props.handleCancelVisible();
};
</script>
