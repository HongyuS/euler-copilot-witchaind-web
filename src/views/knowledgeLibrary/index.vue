<template>
  <UserHeaderBar />
  <CustomLoading :loading="loading" />

  <div class="knowledgeLibrary-container">
    <div
      v-if="showTaskExportNotify"
      class="o-export-progress-notify"
      v-loading="taskExportLoading"
      element-loading-background="rgba(122, 122, 122, 0.3)"
    >
      <div class="o-export-notify__head">
        <div class="task-list">
          <span>{{ $t("assetLibrary.exportTaskList") }}</span>
          <span>{{ `(${exportTaskTotal})` }}</span>
        </div>
        <div class="nofity-show">
          <el-icon
            class="o-export-notify__close"
            @click="showTaskExportList = !showTaskExportList"
          >
            <IconChevronDown v-if="showTaskExportList" />
            <IconChevronUp v-else />
          </el-icon>
        </div>
      </div>
      <div class="o-export-notify__body" v-if="showTaskExportList">
        <div class="o-export-notify__list" @scroll="handleExportScroll">
          <div
            v-for="(item, index) in taskExportList"
            :key="item.id"
            class="item"
          >
            <di class="item-box">
              <div class="item-info">
                <div class="item-name">
                  <h2 class="item-name-text">
                    <TextSingleTootip :content="item.name" />
                  </h2>
                </div>
                <div>
                  <span>_</span>
                  <span>{{ $t("exportTask.export") }}</span>
                </div>
              </div>
              <div class="item-close">
                <IconX @click="handleCloseSingleUpload(item.taskId)" />
              </div>
            </di>
            <div class="taskStatusPer">
              <div
                class="waitExport"
                v-if="['pending', 'running'].includes(item.exportStatus)"
              >
                <div class="icon-box icon-loading"></div>
                <span>
                  {{ $t("exportTask.pendingExport") }}
                </span>
              </div>
              <div
                class="packData"
                v-if="
                  ['success', 'error', 'canceled', 'failed'].includes(
                    item.exportStatus
                  )
                "
              >
                <IconError
                  v-if="
                    ['error', 'canceled', 'failed'].includes(item.exportStatus)
                  "
                  class="errorIcon"
                />
                <el-icon v-if="item.percent === 100" class="successIcon">
                  <CircleCheckFilled />
                </el-icon>
                <span v-if="item.exportStatus === 'success'">
                  {{ $t("exportTask.exportSuccess") }}
                </span>
                <span v-if="['error', 'failed'].includes(item.exportStatus)">
                  {{ $t("exportTask.exportFailed") }}
                </span>
                <span v-if="item.exportStatus === 'canceled'">
                  {{ $t("exportTask.canceled") }}
                </span>
              </div>
              <div
                class="opsExportTask"
                v-if="
                  ['success', 'error', 'failed'].includes(item.exportStatus)
                "
              >
                <div
                  v-if="['error', 'failed'].includes(item.exportStatus)"
                  class="errorTask"
                >
                  <div class="errorReson">{{ $t("exportTask.reason") }}</div>
                  <div class="errorRestart" @click="handleUploadRestart(item)">
                    {{ $t("btnText.retry") }}
                  </div>
                </div>

                <div
                  v-if="item.exportStatus === 'success'"
                  class="successTask"
                  @click="handleOpenDownload(item.taskId)"
                >
                  {{ $t("exportTask.downloadTask") }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="item-all-close">
          <div
            v-if="taskExportList.length > 0"
            @click="handleCloseSingleUpload('all')"
          >
            {{ $t("btnText.clearAll") }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="knowledgeLibrary-box knowledgeLibrary-table-box"
      :class="{ knowledgeLibrayList: switchIcon === 'list' }"
    >
      <div class="kl-tilte">
        {{ $t("assetLibrary.assetLibrary") }}
      </div>
      <div class="kl-ops">
        <div class="kl-left-btn">
          <el-button
            type="primary"
            class="createAsset"
            @click="handleCreateKnowledge"
          >
            {{ $t("btnText.createAssetLibrary") }}
          </el-button>
          <el-button
            @click="handleImportKnowledge"
            class="ImportAsset cancelBtn"
          >
            {{ $t("btnText.batchImport") }}
          </el-button>
        </div>
        <div class="kl-right-btn">
          <div class="kl-btn-search">
            <el-input
              ref="inputRef"
              v-model="knoledgekeyWord"
              @input="handleInputSearch"
              class="o-style-serch"
              :placeholder="$t('assetLibrary.message.name')"
              clearable
            >
              <template #suffix>
                <el-icon class="el-input__icon"><IconSearch /></el-icon>
              </template>
            </el-input>
          </div>
          <div class="kl-btn-switch">
            <div
              class="kl-btn-switch-icon"
              @click="handleSwitch('thumb')"
              :class="switchIcon === 'thumb' ? 'bgThumb' : ''"
            >
              <el-icon>
                <IconThumbnail />
              </el-icon>
            </div>

            <div
              class="kl-btn-switch-icon"
              @click="handleSwitch('list')"
              :class="switchIcon === 'list' ? 'bgThumb' : ''"
            >
              <el-icon>
                <IconList />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
      <div
        class="kl-card-box"
        @scroll="handleScroll"
        ref="klCardBox"
        v-if="switchIcon === 'thumb'"
      >
        <div
          class="kl-card kl-card-container"
          :class="
            5 < fileTableList.data.length ? 'kl-card-display' : 'kl-card-show'
          "
        >
          <div
            class="kl-single-card"
            v-for="item in fileTableList.data"
            @click="handleJumpAssets(item)"
            :key="item.id"
          >
            <div class="kl-card-top">
              <div class="kl-card-name">
                <TextSingleTootip :content="item.name" />
              </div>
              <el-dropdown
                placement="bottom-end"
                popper-class="dropdown-container assetDro"
              >
                <div class="kl-card-more-icon" @click.stop>
                  <el-icon><IconMore /></el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleEditKl(item)">
                      {{ $t("btnText.edit") }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleExportKl(item)">
                      {{ $t("btnText.export") }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleDeleteKl(item)">
                      {{ $t("btnText.delete") }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="kl-card-desc">
              <TextMoreTootip :value="item.description" :row="6" />
            </div>
            <div class="kl-card-footer">
              <div class="kl-card-file-icon">
                <img src="/src/assets/images/file.png" class="filePng" />
                <div class="kl-card-file">
                  <span class="kl-file-num">{{ item.document_count }}</span>
                  <span class="kl-file-text">
                    <TextSingleTootip
                      :content="`${$t('assetLibrary.piece')}${$t('assetLibrary.file')}`"
                    />
                  </span>
                </div>
              </div>
              <div class="kl-card-timer-icon">
                <img src="/src/assets/images/timer.png" class="timePng" />
                <div class="kl-card-timer">
                  <TextSingleTootip
                    :content="convertUTCToLocalTime(item.created_time)"
                  />
                </div>
              </div>
            </div>
            <div class="kl-card-id">
              <span class="id-label">{{ `ID:${" "} ` }}</span>
              <span class="id-value">{{ item.id }}</span>
            </div>
          </div>
        </div>
        <div v-if="!(fileTableList.data.length > 0)" class="pageNoData">
          {{ $t("pageTipText.NoData") }}
        </div>
      </div>
      <div class="kl-table-box" v-else>
        <el-table
          :data="fileTableList.data"
          :border="true"
          @sort-change="handleSortChange"
          @selection-change="handleSelectionChange"
          :class="
            fileTableList.data.length < currentPageSize ? 'showPagination' : ''
          "
        >
          <el-table-column
            prop="name"
            :label="$t('assetLibrary.name')"
            :show-overflow-tooltip="true"
            width="300"
            :fixed="true"
            class-name="kl-name"
          >
            <template #default="scope">
              <span class="kl-name-row" @click="handleJumpAssets(scope.row)">
                {{ scope.row.name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            :label="$t('assetLibrary.assetId')"
            show-overflow-tooltip
            :fixed="true"
            class-name="kl-id"
            width="300"
          >
            <template #header>
              <div class="asset-id-custom-header">
                <span>{{ $t("assetLibrary.assetId") }}</span>
                <el-icon
                  ref="inputSearchRef"
                  :class="
                    sortFilter?.id?.length > 0 || fileFilterVisible
                      ? 'searchIconIsActive'
                      : ''
                  "
                >
                  <IconSearch />
                </el-icon>
                <el-popover
                  ref="popoverRef"
                  v-model:visible="fileFilterVisible"
                  popper-class="inputSearchFilterPopper"
                  placement="bottom-start"
                  :virtual-ref="inputSearchRef"
                  :show-arrow="false"
                  trigger="click"
                  virtual-triggering
                >
                  <FilterContainr
                    filterType="input"
                    v-model:serachName="sortFilter.id"
                    :hanldeSearhNameFilter="hanldeSearhNameFilter"
                    :searchPayload="sortFilter"
                  />
                </el-popover>
              </div>
            </template>
            <template #default="scope">
              <span class="kf-name-row">
                {{ scope.row.id }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            :label="$t('assetLibrary.desc')"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            prop="document_count"
            sortable
            width="150"
            :label="$t('assetLibrary.fileNum')"
          />

          <el-table-column
            prop="created_time"
            sortable
            class-name="asset-upload-time-cell"
            :label="$t('assetLibrary.uploadTime')"
            width="200"
            @header-click="() => {}"
            @click.stop
          >
            <template #header>
              <div class="asset-custom-header custom-header">
                <span>{{ $t("assetLibrary.uploadTime") }}</span>
                <el-date-picker
                  popper-class="datetimerangeClass"
                  placement="bottom"
                  class="timer-picker"
                  v-model="created_time"
                  type="datetimerange"
                  :teleported="true"
                  :shortcuts="shortcuts"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  :unlink-panels="true"
                  time-format="HH:mm"
                  @change="handleTimeChange"
                  ref="tiemPick"
                  @visible-change="handleVisibleChange"
                />
                <el-popover
                  :visible="timeFilterVisible"
                  popper-class="filterPopper timeFilterPo"
                  placement="bottom-start"
                  :show-arrow="false"
                >
                  <template #reference>
                    <el-icon
                      @click="handeDatePickerShow"
                      @click.stop
                      :class="
                        sortFilter?.created_time_start?.length > 0 ||
                        timeFilterVisible
                          ? 'searchIconIsActive'
                          : ''
                      "
                    >
                      <IconFilter />
                    </el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
            <template #default="scope">
              <span>{{ convertUTCToLocalTime(scope.row.created_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="action"
            :label="$t('btnText.operation')"
            width="180"
          >
            <template #default="scope">
              <el-button text @click="handleEditKl(scope.row)">
                {{ $t("btnText.edit") }}
              </el-button>
              <el-button text @click="handleExportKl(scope.row)">
                {{ $t("btnText.export") }}
              </el-button>
              <el-button text @click="handleDeleteKl(scope.row)">
                {{ $t("btnText.delete") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="fileTableList.data?.length > 0"
          v-model:current-page="currentPage"
          v-model:page-size="currentPageSize"
          :page-sizes="pagination.pageSizes"
          :layout="pagination.layout"
          :total="totalCount"
          popper-class="kbLibraryPage"
          @change="handleChangePage"
        />
      </div>
    </div>
    <el-dialog
      v-model="dialogImportVisible"
      class="upload-dialog"
      align-center
      :title="$t('dialogTipText.importAssetLibrary')"
    >
      <Upload
        :tipText="$t('dialogTipText.fileZipFormat')"
        accept=".zip"
        :maxFileNum="5"
        :maxSize="5"
        :singleFileLimit="true"
        :singleFileSize="2"
        :handleCancelVisible="handleCancelVisible"
        :handleQueryTaskList="handleQueryTaskList"
        :handleUploadMyFile="handleUploadMyFile"
        :handInitTaskList="handInitTaskList"
        :taskListImportDate="taskListImportDate"
        :taskList="importTaskList"
        :toggleUploadNotify="toggleUploadNotify"
        :handleStopUploadFile="handleStopUploadFile"
        :handleImportLoading="handleImportLoading"
      />
    </el-dialog>
    <el-dialog
      v-if="dialogCreateVisible"
      v-model="dialogCreateVisible"
      class="create-dialog"
      align-center
      width="560"
      @close="handleCloseCreateKb"
      :title="
        formData?.name?.length > 0
          ? $t('btnText.editAssetLibrary')
          : $t('btnText.createAssetLibrary')
      "
    >
      <KnowledgeForm
        :handleOpsKbForm="handleOpsKbForm"
        :handelResetForm="handelResetForm"
        :handleCloseCreateKb="handleCloseCreateKb"
        :formData="formData"
      />
    </el-dialog>
    <el-dialog
      align-center
      v-model="addTipVisible"
      class="tip-dialog"
      width="400"
      :title="$t('dialogTipText.tipsText')"
    >
      {{ $t("dialogTipText.isAddFilr") }}
      <div class="tip-ops-btn">
        <el-button class="resetBtn" type="primary" @click="handleAddFile">
          {{ $t("btnText.confirm") }}
        </el-button>
        <el-button class="resetBtn cancelBtn" @click="handleCancelAddFile">
          {{ $t("btnText.cancel") }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      align-center
      v-model="delTipVisible"
      class="tip-dialog delTipDialog"
      width="432"
      :title="$t('dialogTipText.tipsText')"
    >
      <div class="delTip">
        <span class="iconAlarmOrange"><IconAlarmOrange /></span>
        <span>
          {{ $t("dialogTipText.confirmDelAsset") }}
          <span>
            【
            <span class="delToolTip">
              <TextSingleTootip :content="opsItem.name" />
            </span>
            】
            {{ userLanguage === "zh" ? "吗？" : null }}
          </span>
        </span>
      </div>
      <div class="tip-ops-btn">
        <el-button class="resetBtn" @click="handleConfirmDelKb(opsItem)">
          {{ $t("btnText.confirm") }}
        </el-button>
        <el-button
          type="primary"
          class="resetBtn cancelBtn"
          @click="handleCancelDelKb()"
        >
          {{ $t("btnText.cancel") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
  <UploadProgress
    :showUploadNotify="uploadTaskListData.showUploadNotify"
    :uploadingList="uploadTaskListData.uploadingList"
    :showTaskList="uploadTaskListData.showTaskList"
    :handleShowTaskList="uploadTaskListData.handleShowTaskList"
    :handleCloseSingleUpload="handleStopUploadFile"
    :handleUploadRestart="uploadTaskListData.handleUploadRestart"
    :taskListImportDate="taskListImportDate"
    :importTaskTotal="importTaskTotal"
    :handleImportScroll="handleImportScroll"
    :taskListLoading="taskListLoading"
  />
</template>
<script lang="ts" setup>
import UserHeaderBar from "@/components/UserHeaderBar/index.vue";
import KnowledgeForm from "@/components/KnowledgeForm/index.vue";
import UploadProgress from "@/components/Upload/uploadProgress.vue";
import Upload from "@/components/Upload/index.vue";
import "@/styles/knowledgeLibrary.scss";
import {
  IconList,
  IconMore,
  IconSearch,
  IconThumbnail,
  IconClock,
  IconAlarmOrange,
  IconChevronUp,
  IconChevronDown,
  IconX,
  IconError,
  IconFilter,
  IconSuccess,
} from "@computing/opendesign-icons";
import TextMoreTootip from "@/components/TextMoreTootip/index.vue";
import TextSingleTootip from "@/components/TextSingleTootip/index.vue";
import CustomLoading from "@/components/CustomLoading/index.vue";

import { debounce } from "lodash";
import KbAppAPI from "@/api/kbApp";
import { QueryKbRequest } from "@/api/apiType";
import {
  convertUTCToLocalTime,
  uTCToLocalTime,
} from "@/utils/convertUTCToLocalTime";
import FilterContainr from "@/components/TableFilter/index.vue";

const { t } = useI18n();
const router = useRouter();
const knoledgekeyWord = ref();
const dialogImportVisible = ref(false);
const dialogCreateVisible = ref(false);
const addTipVisible = ref(false);
const delTipVisible = ref(false);
const switchIcon = ref("thumb");
const opsItem = ref();
const klCardBox = ref();
const loading = ref(false);
const importTaskList = ref([]);
const userLanguage = ref();

const resetFormData = ref({
  name: "",
  language: "",
  default_chunk_size: 1024,
  embedding_model: "",
  default_parser_method: "",
  document_type_list: [],
  description: "",
});
const showTaskExportNotify = ref(false);
const taskExportList = ref<any[]>([]);
const showTaskExportList = ref(false);
const formData = ref(resetFormData.value);
const pagination = ref({
  pageSizes: [10, 20, 30, 40, 50],
  layout: "total,sizes,prev,pager,next,jumper",
});
const sortFilter = ref({});
const currentPage = ref(1);
const totalCount = ref(0);
const taskListImportDate = ref();
const currentPageSize = ref(pagination.value.pageSizes[0]);
const uploadTaskListData = ref<any>({});
const exportTaskTotal = ref(0);
const taskExportTimer = ref();
const exportTaskPageSize = ref(10);
const exportTaskPageNumber = ref(1);
const taskExportLoading = ref(false);
const importTaskTotal = ref(0);
const importTaskPage = ref(1);
const importTaskPageSize = ref(10);
const taskListLoading = ref(false);
const timeFilterVisible = ref(false);
const fileFilterVisible = ref(false);
const inputSearchRef = ref();
const tiemPick = ref();
const created_time = ref();
const shortcuts = ref();
const fileTableList = reactive<{
  data: Array<any>;
}>({
  data: [],
});
const taskTimer = ref();

const handleScroll = (e: { target: any }) => {
  const klCardBox = e.target;
  // 检查是否已经滚动到底部
  if (
    klCardBox?.clientHeight + klCardBox.scrollTop + 10 >=
    klCardBox?.scrollHeight
  ) {
    if (currentPage.value * currentPageSize.value < totalCount.value) {
      currentPage.value = currentPage.value + 1;
      loading.value = true;

      KbAppAPI.getKbLibrary({
        page_number: currentPage.value,
        page_size: currentPageSize.value,
      })
        .then((res: any) => {
          fileTableList.data = [...fileTableList.data, ...res?.data_list];
          totalCount.value = res?.total;
        })
        .finally(() => {
          loading.value = false;
        });
    }
  }
};
const handleQueryKbLibrary = (params: QueryKbRequest) => {
  loading.value = true;
  KbAppAPI.getKbLibrary(params)
    .then((res: any) => {
      fileTableList.data = res?.data_list;
      totalCount.value = res?.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
onMounted(() => {
  handleQueryKbLibrary({
    page_number: 1,
    page_size: 10,
  });
});

const handleVisibleChange = (e) => {
  timeFilterVisible.value = e;
};

const handeDatePickerShow = (e: { pageX: string; pageY: string }) => {
  timeFilterVisible.value = true;
  tiemPick.value.handleOpen();
  let dateTimerContainer = document.querySelector(
    ".datetimerangeClass"
  ) as HTMLElement;
  if (dateTimerContainer) {
    dateTimerContainer.style.position = "absolute";
    dateTimerContainer.style.left = e.pageX + "px";
    dateTimerContainer.style.top = e.pageY + "px";
  }
};

const handleFilterData = (params: any) => {
  let filterPaylod = {};
  Object.keys(params || {}).forEach((item: string | number) => {
    if (params[item]?.length > 0) {
      filterPaylod[item] = params[item];
    }
  });
  return filterPaylod;
};

const hanldeSearhNameFilter = (filterName: string) => {
  sortFilter.value.id = filterName;
  currentPage.value = 1;
  currentPageSize.value = 10;
  handleQueryKbLibrary({
    page_number: currentPage.value,
    page_size: currentPageSize.value,
    ...handleFilterData(sortFilter.value),
  });
  fileFilterVisible.value = false;
};

const handleSwitch = (switchType: string) => {
  switchIcon.value = switchType;
  sortFilter.value = {};
  currentPage.value = 1;
  currentPageSize.value = 10;
  knoledgekeyWord.value = "";
  handleQueryKbLibrary({
    page_number: currentPage.value,
    page_size: currentPageSize.value,
  });
};
const handleImportKnowledge = () => {
  dialogImportVisible.value = true;
  showTaskExportNotify.value = false;
};

const toggleUploadNotify = (uploadTaskPayload: {}) => {
  uploadTaskListData.value = uploadTaskPayload;
};

const handInitTaskList = (selectedFiles: string | any[]) => {
  return KbAppAPI.queryKbTaskList({
    types: ["import_knowledge_base"],
    page_number: 1,
    page_size: importTaskPageSize.value,
  }).then((res: any) => {
    importTaskList.value = res.data_list || [];
    importTaskTotal.value = selectedFiles
      ? res.total + selectedFiles.length
      : res.total;
    return res.data_list || [];
  });
};

const handelTaskList = () => {
  KbAppAPI.queryKbTaskList({
    types: ["import_knowledge_base"],
    page_number: 1,
    page_size: importTaskPageSize.value,
  }).then((res: any) => {
    importTaskList.value = res.data_list || [];
    importTaskTotal.value = res.total;
    taskListImportDate.value = Date.now();
    taskListLoading.value = false;
    if (
      res.data_list?.every(
        (item: any) => !["pending", "running"].includes(item.task.status)
      )
    ) {
      clearInterval(taskTimer.value);
      taskTimer.value = null;
      handleOpsKbConfirm();
    }
  });
};

const handleImportScroll = (e: { target: any }) => {
  const taskBox = e.target;
  // 检查是否已经滚动到底部
  if (taskBox?.clientHeight + taskBox.scrollTop + 10 >= taskBox?.scrollHeight) {
    if (importTaskPageSize.value < importTaskTotal.value) {
      taskListLoading.value = true;
      clearInterval(taskTimer.value);
      taskTimer.value = null;
      importTaskPage.value = importTaskPage.value + 1;
      importTaskPageSize.value = importTaskPage.value * 10;
      handleQueryTaskList();
    }
  }
};

const handleQueryTaskList = () => {
  taskTimer.value = setInterval(() => {
    handelTaskList();
  }, 2500);
};

const handleImportLoading = (loadingStatus: boolean) => {
  // loading.value = loadingStatus;
  taskListLoading.value = loadingStatus;
};

const handleStopUploadFile = (taskId: string) => {
  taskListImportDate.value = Date.now();
  taskListLoading.value = true;
  let payload: any = {
    task_id: taskId,
  };
  if (taskId === "all") {
    payload = { types: ["import_knowledge_base"] };
  }
  KbAppAPI.stopKbTaskList(payload).then((res) => {
    KbAppAPI.queryKbTaskList({
      types: ["import_knowledge_base"],
      page_number: 1,
      page_size: importTaskPageSize.value,
    }).then((res: any) => {
      importTaskList.value = res.data_list || [];
      taskListLoading.value = false;
      importTaskTotal.value = res.total || 0;
      taskListImportDate.value = Date.now();
    });
  });
};

const handleExportKl = async (row: any) => {
  dialogImportVisible.value = false;
  uploadTaskListData.value.showUploadNotify = false;
  loading.value = true;
  handleInitExportTaskList().then((res) => {
    showTaskExportNotify.value = true;
    showTaskExportList.value = true;
    exportTaskTotal.value = exportTaskTotal.value + 1;
    taskExportList.value = [
      ...[
        {
          name: row.name,
          id: row.id,
          exportStatus: "pending",
          taskId: res.data,
        },
      ]?.map((item: any) => {
        let taskOptions = {
          taksInfo: row,
          taskDownUrl: "",
          onProgress: (evt: any) => {
            item.percent = evt;
          },
          onError: () => {
            item.exportStatus = "error";
            item.percent = "0";
          },
        };
        KbAppAPI.savebLibrary(row.id, taskOptions)
          .then((taskRes) => {
            item.taskId = taskRes;
            loading.value = false;
            taskExportTimer.value = setInterval(() => {
              handleInitExportTaskList();
            }, 2500);
          })
          .catch(() => {
            taskOptions.onError();
          });

        return item;
      }),
      ...res.map((item: any) => {
        let reportDetail = item?.task?.reports?.[0];
        return {
          id: item.id,
          taskId: item.task.id,
          name: item.name,
          percent:
            item?.task?.status === "success"
              ? 100
              : reportDetail
                ? (
                    (reportDetail?.current_stage / reportDetail?.stage_cnt) *
                    100
                  ).toFixed(1)
                : 0,
          exportStatus: item?.task?.status,
        };
      }),
    ];
  });
};

const handleUploadRestart = (task: { taskId: string }) => {
  taskExportList.value.forEach((item) => {
    if (task.taskId === item.taskId) {
      let taskOptions = {
        taksInfo: task,
        taskDownUrl: "",
        onProgress: (evt: any) => {
          item.percent = evt;
        },
        onError: () => {
          item.exportStatus = "error";
          item.percent = "0";
        },
        onSuccess: () => {
          item.exportStatus = "success";
        },
      };
      KbAppAPI.savebLibrary(task.taskId, taskOptions)
        .then((res) => {
          taskOptions.onSuccess();
        })
        .catch(() => {
          taskOptions.onError();
        });
    }
  });
};

const handleCloseSingleUpload = (taskId: string) => {
  taskExportLoading.value = true;
  let payload: any = {
    task_id: taskId,
  };
  if (taskId === "all") {
    payload = { types: ["export_knowledge_base"] };
  }
  KbAppAPI.stopKbTaskList(payload).then((res) => {
    handleInitExportTaskList();
  });
};

const handleInitExportTaskList = () => {
  return KbAppAPI.queryKbTaskList({
    types: ["export_knowledge_base"],
    page_number: 1,
    page_size: exportTaskPageSize.value,
  }).then((res: any) => {
    exportTaskTotal.value = res?.total || 0;
    taskExportLoading.value = false;
    taskExportList.value =
      res.data_list.map((item: any) => {
        let reportDetail = item?.task?.reports?.[0];
        return {
          id: item.id,
          taskId: item.task.id,
          name: item.name,
          percent:
            item?.task?.status === "success"
              ? 100
              : reportDetail
                ? (
                    (reportDetail?.current_stage / reportDetail?.stage_cnt) *
                    100
                  ).toFixed(1)
                : 0,
          exportStatus: item?.task?.status,
        };
      }) || [];
    if (
      res?.data_list.every(
        (item: any) => !["pending", "running"].includes(item?.task?.status)
      )
    ) {
      clearInterval(taskExportTimer.value);
      taskExportTimer.value = null;
    }
    return res?.data_list || [];
  });
};

const handleExportScroll = (e: { target: any }) => {
  const taskBox = e.target;
  // 检查是否已经滚动到底部
  if (taskBox?.clientHeight + taskBox.scrollTop + 10 >= taskBox?.scrollHeight) {
    if (exportTaskPageSize.value < exportTaskTotal.value) {
      taskExportLoading.value = true;
      clearInterval(taskExportTimer.value);
      taskExportTimer.value = null;
      exportTaskPageNumber.value = exportTaskPageNumber.value + 1;
      exportTaskPageSize.value = exportTaskPageNumber.value * 10;
      taskExportTimer.value = setInterval(() => {
        handleInitExportTaskList();
      }, 2500);
    }
  }
};

// const handleQueryExportTaskList = () => {
//   taskExportTimer.value = setInterval(() => {
//     KbAppAPI.queryKbTaskList({
//       type: "save_knowledge_base",
//     }).then((res: any) => {
//       taskExportList.value = res || [];
//       taskListExportDate.value = Date.now();
//       if (res?.every((item) => item.status !== "pending")) {
//         clearInterval(taskExportTimer.value);
//         taskExportTimer.value = null;
//       }
//     });
//   }, 2500);
// };

watch(
  () => t(""),
  (newVal, oldVal) => {
    shortcuts.value = [
      {
        text: t("timerSearch.lastHour", {
          timer: 12,
        }),
        value: () => {
          const end = new Date();
          const start = new Date();

          start.setHours(start.getHours() - 12);
          return [start, end];
        },
      },
      {
        text: t("timerSearch.lastHour", {
          timer: 1,
        }),
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setHours(start.getHours() - 1);
          return [start, end];
        },
      },
      {
        text: t("timerSearch.lastHour", {
          timer: 3,
        }),
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setHours(start.getHours() - 3);
          return [start, end];
        },
      },
      {
        text: t("timerSearch.lastHour", {
          timer: 7,
        }),
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setHours(start.getHours() - 7);
          return [start, end];
        },
      },
    ];
    userLanguage.value = JSON.parse(
      localStorage.getItem("userInfo") || "{}"
    )?.language;
  },
  {
    deep: true,
    immediate: true,
  }
);

const handleTimeChange = (e: (string | undefined)[]) => {
  sortFilter.value.created_time_start = e?.[0] ? uTCToLocalTime(e?.[0]) : "";
  sortFilter.value.created_time_end = e?.[1] ? uTCToLocalTime(e?.[1]) : "";
  currentPage.value = 1;
  currentPageSize.value = 10;
  handleQueryKbLibrary({
    page_number: 1,
    page_size: 10,
    ...handleFilterData(sortFilter.value),
  });
  handleCancelVisible();
};

const handleCreateKnowledge = () => {
  dialogCreateVisible.value = true;
};

const handleCancelVisible = () => {
  dialogImportVisible.value = false;
  dialogCreateVisible.value = false;
};

const handleJumpAssets = (kbItem: any) => {
  window.open(`${window.origin}/witchaind/#/knowledge/file?kb_id=${kbItem.id}`, "_self");
};

const handleAddFile = () => {
  const assetLibraryObj = fileTableList.data[0];
  window.open(
    `${window.origin}/witchaind/#/knowledge/file?kb_id=${assetLibraryObj.id}`,
    "_self"
  );
};

const handleCancelAddFile = () => {
  addTipVisible.value = false;
};

const handleSelectionChange = () => {};

const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  currentPage.value = 1;
  sortFilter.value = data.order
    ? {
        [data.prop === "created_time"
          ? "created_time_order"
          : "document_count_order"]:
          data.order === "descending" ? "desc" : "asc",
      }
    : {};
  handleQueryKbLibrary({
    page_number: currentPage.value,
    page_size: currentPageSize.value,
    ...handleFilterData(sortFilter.value),
  });
};

const handleEditKl = (row: any) => {
  formData.value = row;
  dialogCreateVisible.value = true;
};

const handleDeleteKl = (row: any) => {
  opsItem.value = row;
  delTipVisible.value = true;
};

const handleOpenDownload = (fileId: any) => {
  window.open(`${window.origin}/witchaind/api/kb/download?task_id=${fileId}`);
};

const handleInputSearch = debounce((e) => {
  let payload: {
    page_number: number;
    page_size: number;
    [property: string]: any;
  } = {
    page_number: 1,
    page_size: currentPageSize.value,
  };
  if (e) {
    payload = {
      ...payload,
      name: e,
    };

    if (switchIcon.value === "list") {
      sortFilter.value.name = e;
      payload = { ...payload, ...handleFilterData(sortFilter.value) };
    }
  }
  handleQueryKbLibrary(payload);
}, 200);

const handleOpsKbConfirm = () => {
  let payload: {
    page_number: number;
    page_size: number;
    [property: string]: any;
  } = {
    page_number: 1,
    page_size: 10,
  };
  if (switchIcon.value === "thumb") {
    currentPage.value = 1;
    currentPageSize.value = 10;
  } else {
    payload = {
      ...payload,
      ...sortFilter.value,
    };
  }
  payload = {
    ...payload,
    page_number: currentPage.value,
    page_size: currentPageSize.value,
  };
  if (knoledgekeyWord.value?.length > 0) {
    payload.name = knoledgekeyWord.value;
  }
  handleQueryKbLibrary(payload);
};

const handleConfirmDelKb = (row: any) => {
  loading.value = true;
  delTipVisible.value = false;
  KbAppAPI.delKbLibrary({
    id: row.id,
    task_id: row.task_id,
  })
    .then((res) => {
      if (res) {
        ElMessage({
          showClose: true,
          message: t("opsMessage.delSuccess"),
          icon: IconSuccess,
          customClass: "o-message--success",
          duration: 3000,
        });
        if (switchIcon.value === "thumb") {
          klCardBox.value.scrollTop = 0;
        }
        handleOpsKbConfirm();
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleCancelDelKb = () => {
  delTipVisible.value = false;
};

const handelResetForm = () => {
  dialogCreateVisible.value = false;
  addTipVisible.value = true;
  formData.value = resetFormData.value;
};

const handleCloseCreateKb = () => {
  dialogCreateVisible.value = false;
  formData.value = resetFormData.value;
};

const handleOpsKbForm = () => {
  handleCloseCreateKb();
  currentPage.value = 1;
  currentPageSize.value = 10;
  handleQueryKbLibrary({
    page_number: 1,
    page_size: 10,
    ...handleFilterData(sortFilter.value),
  });
};

const handleChangePage = (pageNum: number, pageSize: number) => {
  currentPage.value = pageNum;
  currentPageSize.value = pageSize;
  handleQueryKbLibrary({
    page_number: currentPage.value,
    page_size: currentPageSize.value,
    ...handleFilterData(sortFilter.value),
  });
};

const handleUploadMyFile = (options: any) => {
  KbAppAPI.importKbLibrary(
    {
      data: {
        files: options.file.raw,
      },
    },
    options
  )
    .then((res) => {
      options.onProgress(100);
      options.onSuccess({
        ...options.fileInfo,
        success: "success",
      });
    })
    .catch((err) => {
      options.onError({ ...options.fileInfo, error: err });
    });
};

onUnmounted(() => {
  clearInterval(taskExportTimer.value);
  clearInterval(taskTimer.value);
  taskTimer.value = null;
  taskExportTimer.value = null;
});
</script>
