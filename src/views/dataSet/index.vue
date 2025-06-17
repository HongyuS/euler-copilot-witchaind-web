<template>
  <CustomLoading :loading="loading" />
  <div
    class="dataset-empty-content"
    v-if="!isSearch && !fileTableList.data.length && totalCount === 0">
    <EmptyStatus
      :button-text="$t('dataset.emptyText')"
      :description="$t('dataset.emptyDesc')"
      @click="handleToCreate" />
  </div>
  <div
    v-else
    class="dataSet-container">
    <div
      v-if="showTaskExportNotify"
      class="o-export-progress-notify"
      v-loading="taskExportLoading"
      element-loading-background="rgba(122, 122, 122, 0.3)">
      <div class="o-export-notify__head">
        <div class="task-list">
          <span>{{ $t('assetLibrary.exportTaskList') }}</span>
          <span>{{ `(${exportTaskTotal})` }}</span>
        </div>
        <div class="nofity-show">
          <el-icon
            class="o-export-notify__close"
            @click="showTaskExportList = !showTaskExportList">
            <IconChevronDown v-if="showTaskExportList" />
            <IconChevronUp v-else />
          </el-icon>
        </div>
      </div>
      <div
        class="o-export-notify__body"
        v-if="showTaskExportList">
        <div
          class="o-export-notify__list"
          @scroll="handleExportScroll">
          <div
            v-for="(item, index) in taskExportList"
            :key="item.id"
            class="item">
            <div class="item-box">
              <div class="item-info">
                <div class="item-name">
                  <h2 class="item-name-text">
                    <TextSingleTootip :content="item.name" />
                  </h2>
                </div>
                <div>
                  <span>_</span>
                  <span>{{ $t('exportTask.export') }}</span>
                </div>
              </div>
              <div class="item-close">
                <IconX @click="handleCloseSingleUpload(item.taskId)" />
              </div>
            </div>
            <div class="taskStatusPer">
              <div
                class="waitExport"
                v-if="['pending', 'running'].includes(item.exportStatus)">
                <div class="icon-box icon-loading"></div>
                <span>
                  {{ $t('exportTask.pendingExport') }}
                </span>
              </div>
              <div
                class="packData"
                v-if="['success', 'error', 'canceled', 'failed'].includes(item.exportStatus)">
                <el-icon
                  v-if="['error', 'canceled', 'failed'].includes(item.exportStatus)"
                  class="errorIcon">
                  <img src="@/assets/svg/fail.svg" alt="fail icon" />
                </el-icon>
                <el-icon
                  v-if="item.percent === 100"
                  class="successIcon">
                   <img src="@/assets/svg/succes.svg" alt="success icon" />
                </el-icon>
                <span v-if="item.exportStatus === 'success'">
                  {{ $t('exportTask.exportSuccess') }}
                </span>
                <span v-if="['error', 'failed'].includes(item.exportStatus)">
                  {{ $t('exportTask.exportFailed') }}
                </span>
                <span v-if="item.exportStatus === 'canceled'">
                  {{ $t('exportTask.canceled') }}
                </span>
              </div>
              <div
                class="opsExportTask"
                v-if="['success', 'error', 'failed'].includes(item.exportStatus)">
                <div
                  v-if="['error', 'failed'].includes(item.exportStatus)"
                  class="errorTask">
                  <div class="errorReson">{{ $t('exportTask.reason') }}</div>
                </div>

                <div
                  v-if="item.exportStatus === 'success'"
                  class="successTask"
                  @click="handleOpenDownload(item.taskId)">
                  {{ $t('exportTask.downloadTask') }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="item-all-close">
          <div
            v-if="taskExportList.length > 0"
            @click="handleCloseSingleUpload('all')">
            {{ $t('btnText.clearAll') }}
          </div>
        </div>
      </div>
    </div>
    <div class="dataSet-container-header">
      <div class="dataSet-container-left" >
        <el-button
          type="primary"
          style="margin-right: 8px"
          @click="handleImportDataSet"
          class="importFileBtn">
          {{ $t('dataset.importDataset') }}
        </el-button>
        <el-dropdown
          placement="bottom"
          popper-class="dropdown-container dataSet-ops-dowlon"
          @visible-change="handleBatchDownBth"
          :disabled="!selectionDataSetList.length">
          <el-button
            :class="batchDownBth ? 'upBtn' : 'downBtn'" :disabled="!selectionDataSetList.length">
            {{ $t('btnText.batchOps') }}
            <el-icon
              class="el-icon--right"
              v-if="!batchDownBth">
              <IconCaretDown />
            </el-icon>
            <el-icon
              class="el-icon--right el-icon--caretup"
              v-if="batchDownBth">
              <IconCaretUp />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                :disabled="!selectionDataSetList.length"
                @click="handleBatchExport">
                {{ $t('btnText.batchExport') }}
              </el-dropdown-item>
              <el-dropdown-item
                :disabled="!selectionDataSetList.length"
                @click="handleSelectDeleteDataSet">
                {{ $t('btnText.batchDelete') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <el-input :placeholder="$t('dataset.placeholderDataset')" v-model="searchPayload.datasetName" class="dataSet-container-right" 
          @input="handleInputSearch"  :suffix-icon="IconSearch" />
      </div>
      <div class="dataSet-container-table-box">
        <el-table
          :data="fileTableList.data"
          class="dataSetTableContainer"
          cell-calss-name="tableCell"
          :row-key="(row) => row.datasetId"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          :border="false">
          <el-table-column
            type="selection"
            :fixed="true"
            class-name="dataSet-selection"
            width="35"
            :reserve-selection="true"
            :selectable="checkSelecTable" />
          <el-table-column
            prop="datasetName"
            :label="$t('dataset.datasetName')"
            show-overflow-tooltip
            :fixed="true"
            class-name="datasetName"
            width="200">
            <template #default="scope">
              <span
                class="dataSet-name-row"
                @click="handleJumpFileSection(scope.row)">
                {{ scope.row.datasetName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            :label="$t('dataset.datasetDesc')"
            show-overflow-tooltip>
            <template #default="scope">
              <span>{{ scope.row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="dataCnt"
            :label="$t('dataset.dataCountLimit')"
            sortable />
          <el-table-column
          prop="dataCntExisted"
          :label="$t('dataset.currentDataCount')"
          sortable />
          <el-table-column
            prop="isDataCleared"
            :label="$t('dataset.isDataCleared')">
            <template #header>
              <div class="custom-header">
                <span>{{ $t('dataset.isDataCleared') }}</span>
                <el-icon
                  ref="enableRef"
                  @click.stop
                  :class="
                    searchPayload?.isDataCleared?.toString()?.length || enableFilterVisible
                      ? 'searchIconIsActive'
                      : ''
                  ">
                  <IconFilter />
                </el-icon>
                <el-popover
                  ref="popoverRef"
                  v-model:visible="enableFilterVisible"
                  popper-class="filterPopper"
                  placement="bottom-start"
                  :virtual-ref="enableRef"
                  :show-arrow="false"
                  trigger="click"
                  virtual-triggering>
                  <FilterContainr
                    :filterList="filterEnableList"
                    filterType="checkBox"
                    :handelSubFilterProper="handelClearFilterProper"
                    :checkedFilterList="checkedFilterList" />
                </el-popover>
              </div>
            </template>
            <template #default="scope">
              <el-switch
                v-model:model-value="scope.row.isDataCleared" :disabled="true"
                style="--el-switch-on-color: #24ab36; --el-switch-off-color: #c3cedf" />
            </template>
          </el-table-column>
          <el-table-column
            prop="isChunkRelated"
            :label="$t('dataset.isChunkRelated')">
            <template #header>
              <div class="custom-header">
                <span>{{ $t('dataset.isChunkRelated') }}</span>
                <el-icon
                  ref="enableTextRef"
                  @click.stop
                  :class="
                    searchPayload?.isChunkRelated?.toString()?.length || enableTextFilterVisible
                      ? 'searchIconIsActive'
                      : ''
                  ">
                  <IconFilter />
                </el-icon>
                <el-popover
                  ref="popoverRef"
                  v-model:visible="enableTextFilterVisible"
                  popper-class="filterPopper"
                  placement="bottom-start"
                  :virtual-ref="enableTextRef"
                  :show-arrow="false"
                  trigger="click"
                  virtual-triggering>
                  <FilterContainr
                    :filterList="filterEnableList"
                    filterType="checkBox"
                    :handelSubFilterProper="handeRelatedFilterProper"
                    :checkedFilterList="checkedFilterList" />
                </el-popover>
              </div>
            </template>
            <template #default="scope">
              <el-switch
                v-model:model-value="scope.row.isChunkRelated" :disabled="true"
                style="--el-switch-on-color: #24ab36; --el-switch-off-color: #c3cedf" />
            </template>
          </el-table-column>
          <el-table-column
            prop="taskStatus"
            :label="$t('dataset.status')"
            width="180">
            <template #header>
              <div class="custom-header">
                <span>{{ $t('dataset.status') }}</span>
                <el-icon
                  ref="statusRef"
                  @click.stop
                  :class="
                    searchPayload?.generateStatus?.length || statusFilterVisible
                      ? 'searchIconIsActive'
                      : ''
                  ">
                  <IconFilter />
                </el-icon>
                <el-popover
                  ref="popoverRef"
                  v-model:visible="statusFilterVisible"
                  popper-class="filterPopper"
                  placement="bottom-start"
                  :virtual-ref="statusRef"
                  :show-arrow="false"
                  trigger="click"
                  virtual-triggering>
                  <FilterContainr
                    filterType="checkBox"
                    :filterList="filterStatusList"
                    :handelSubFilterProper="handelStatusFilterProper"
                    :checkedFilterList="checkedFilterList" />
                </el-popover>
              </div>
            </template>
            <template #default="scope">
              <div
                v-if="scope.row.generateTask?.taskStatus === DataSetStatusEnum.FAILED"
                class="statusFail">
                {{ $t('dataset.taskStatus.failed') }}
              </div>
              <div
                v-if="scope.row.generateTask?.taskStatus === DataSetStatusEnum.SUCCESS"
                class="statusSuccess">
                {{ $t('dataset.taskStatus.success') }}
              </div>
              <div
                v-if="scope.row.generateTask?.taskStatus === DataSetStatusEnum.CANCELED"
                class="statusCancel">
                {{ $t('dataset.taskStatus.canceled') }}
              </div>
              <div
                v-if="scope.row.generateTask?.taskStatus === DataSetStatusEnum.PENDING"
                class="statusWaitIng">
                <div class="icon-box"></div>
                {{ $t('dataset.taskStatus.pending') }}
              </div>
              <div
                class="statusGenerate"
                v-if="scope.row.generateTask?.taskStatus === DataSetStatusEnum.RUNNING">
                <div class="percent-box">
                  <el-progress
                    :percentage="
                      scope.row.task?.reports?.[0]?.current_stage &&
                      scope.row.task?.reports?.[0]?.stage_cnt
                        ? Math.floor(
                            ((scope.row.task?.reports?.[0]?.current_stage || 0) /
                              (scope.row.task?.reports?.[0]?.stage_cnt || 0)) *
                              100
                          )
                        : 0
                    "
                    :color="customColor"
                    striped
                    striped-flow />
                </div>
                <div class="statusGenerateText">
                  {{ $t('dataset.taskStatus.running') }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="score"
            :label="`${$t('dataset.score')}(1~100)`"
            width="175"
            show-overflow-tooltip
            sortable
          >
          <template #default="scope">
              {{ scope.row.score?.toFixed(2)?scope.row.score?.toFixed(2)>0?scope.row.score:0:'--'  }}
          </template>
        </el-table-column>
        <el-table-column
          prop="authorName"
          :label="$t('dataset.creator')"
          show-overflow-tooltip>
          <template #header>
              <div class="asset-id-custom-header">
                <span>{{ $t('dataset.creator') }}</span>
                <el-icon
                  ref="inputSearchRef"
                  :class="
                    searchPayload?.authorName?.length! > 0 || creatorVisible ? 'searchIconIsActive' : ''
                  ">
                  <IconSearch />
                </el-icon>
                <el-popover
                  ref="popoverRef"
                  v-model:visible="creatorVisible"
                  popper-class="inputSearchFilterPopper"
                  placement="bottom-start"
                  :virtual-ref="inputSearchRef"
                  :show-arrow="false"
                  trigger="click"
                  virtual-triggering>
                  <FilterContainr
                    filterType="input"
                    v-model:serachName="searchPayload.authorName"
                    :hanldeSearhNameFilter="hanldeSearhNameFilter"
                    :searchPayload="searchPayload" />
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="dataSetCreatime"
            class-name="upload-time-cell"
            :label="$t('dataset.finishedTime')"
            @click.stop>
            <template #default="scope">
                {{ convertUTCToLocalTime(scope.row.generateTask?.createdTime) }}
            </template>
          </el-table-column>

          <el-table-column
            prop="action"
            :label="$t('btnText.operation')"
            width="250"
            fixed="right">
            <template #default="scope">
              <el-button
                v-if="[StatusEnum.RUNNING,StatusEnum.ANALYSIS_ING].includes(scope.row.status) "
                text
                @click="handleRunDataSet(scope.row,false)">
                {{ $t('dataset.stop') }}
              </el-button>
              <el-button
                v-else
                text
                :disabled="scope.row.generateTask?.taskStatus === StatusEnum.SUCCESS"
                @click="handleRunDataSet(scope.row, true)">
                {{ $t('dataset.generate') }}
              </el-button>
              <el-button
                text
                :disabled="scope.row.generateTask?.taskStatus === DataSetStatusEnum.RUNNING"
                @click="handleJumpFileSection(scope.row)">
                {{ $t('btnText.edit') }}
              </el-button>
              <el-button
                text
                :disabled="scope.row.generateTask?.taskStatus !== DataSetStatusEnum.SUCCESS"
                @click="handleDataSetEval(scope.row)">
                {{ $t('dataset.testing') }}
              </el-button>
              <el-button
                text
                :disabled="scope.row.generateTask?.taskStatus === DataSetStatusEnum.RUNNING"
                @click="handleExportDataSet(scope.row)">
                {{ $t('btnText.export') }}
              </el-button>
              <el-button
                :disabled="scope.row.generateTask?.taskStatus === DataSetStatusEnum.RUNNING"
                text
                @click="handleDeleteDataSet(scope.row)">
                {{ $t('btnText.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="fileTableList.data?.length"
          v-model:current-page="currentPage"
          v-model:page-size="currentPageSize"
          :page-sizes="pagination.pageSizes"
          :layout="pagination.layout"
          :total="totalCount"
          popper-class="kbLibraryPage"
          @change="handleChangePage" />
    </div>
  </div>
  <CreateEvaluate :dialogEvaluateVisible="dialogEvaluateVisible" :rowData="rowData" :close="handleCloseDialogue" />
  <DataSetDrawer
    v-if="dataSetDrawerVisible"
    :dataSetDrawerVisible="dataSetDrawerVisible"
    :dataSetRow="dataSetRow"
    :handleDataSetProps="handleDataSetProps" />
  <el-dialog
    v-model="dialogImportVisible"
    class="upload-dialog"
    align-center
    :title="$t('dataset.importDataset')">
    <Upload
      :tipText="$t('dialogTipText.fileDataSetFormat')"
      accept=".xlsx,.yaml,.json"
      :maxFileNum="10"
      :maxSize="0.488"
      :handleUploadMyFile="handleUploadMyFile"
      :handleQueryTaskList="handleQueryTaskList"
      :handleCancelVisible="handleCancelVisible"
      :taskList="taskList"
      :taskListImportDate="taskListImportDate"
      :toggleUploadNotify="toggleUploadNotify"
      :handleImportLoading="handleImportLoading"
      uploadType="dataset" />
  </el-dialog>
  <UploadProgress
    :isKnowledgeFileUpload="true"
    :showUploadNotify="uploadTaskListData.showUploadNotify"
    :uploadingList="uploadTaskListData.uploadingList"
    :showTaskList="uploadTaskListData.showTaskList"
    :handleShowTaskList="uploadTaskListData.handleShowTaskList"
    :handleUploadRestart="uploadTaskListData.handleUploadRestart"
    :taskListImportDate="taskListImportDate"
    :importTaskTotal="importTaskTotal"
    :isShowAllClear="false" />
</template>

<script setup lang="ts">
import EmptyStatus from '@/components/EmptyStatus/index.vue';
import { useGroupStore } from '@/store/modules/group';
import { IconCaretDown, IconFilter, IconCaretUp, IconSearch, IconAlarm, IconChevronUp, IconChevronDown, IconX } from '@computing/opendesign-icons';
import { DataSetStatusEnum, StatusEnum } from '@/enums/KnowledgeEnum';
import FilterContainr from '@/components/TableFilter/index.vue';
import DataSetDrawer from './dataSetDrawer.vue';
import CreateEvaluate from '@/views/dataSet/craeteEvaluate.vue';
import dataSetAPI from '@/api/dataSet';
import CustomLoading from '@/components/CustomLoading/index.vue';
const route = useRoute();
const { t } = useI18n();

import { ref } from 'vue';
import '@/styles/dataSet.scss';
import UploadProgress from '@/components/Upload/uploadProgress.vue';
import TextSingleTootip from '@/components/TextSingleTootip/index.vue';
import KbAppAPI, { ITaskType } from '@/api/kbApp';
import { debounce } from 'lodash';
import { convertUTCToLocalTime } from '@/utils/convertUTCToLocalTime';
import { downloadFun } from '@/utils/downloadFun';
const store = useGroupStore();
const inputSearchRef = ref();
const multipleTable = ref();
const selectionDataSetList = ref<any>([]);
const batchDownBth = ref(false);
const loading = ref(false);
const checkedFilterList = ref([]);
const filterStatusList = ref();
const customColor = ref('rgb(99, 149, 253)');
const filterEnableList = ref();
const totalCount = ref(0);
const statusRef = ref();
const enableRef = ref();
const enableTextRef = ref();
const statusFilterVisible = ref(false);
const creatorVisible = ref(false);
const enableFilterVisible = ref(false);
const enableTextFilterVisible = ref(false);
const dataSetDrawerVisible = ref(false);
const dataSetRow = ref({});
const dialogEvaluateVisible = ref(false);
const rowData = ref({});
const checkTableSelecData = ref([]);
const pollingKfTimer = ref();
const dialogImportVisible = ref(false);
const taskList = ref<any>([]);
const taskListImportDate = ref();
const importTaskTotal = ref(0);
const uploadTaskListData = ref<{
  showUploadNotify?: boolean;
  uploadingList?: Array<any>;
  showTaskList?: boolean;
  handleShowTaskList?: Function;
  handleUploadRestart?: Function;
}>({});
const taskExportLoading = ref(false);
const taskExportList = ref<any[]>([]);
const taskExportTimer = ref();
const exportTaskTotal = ref(0);
const exportTaskPageNumber = ref(1);
const showTaskExportNotify = ref(false);
const showTaskExportList = ref(false);

const handleCloseDialogue = () => {
  dialogEvaluateVisible.value = false;
};

const fileTableList = reactive<{
  data: Array<any>;
}>({
  data: [],
});
const currentPage = ref(1);
const currentPageSize = ref(20);
const pagination = ref({
  pageSizes: [10, 20, 30, 40, 50],
  layout: 'total,sizes,prev,pager,next,jumper',
});
const searchPayload = ref<{
  datasetName?: string | null;
  generateStatus?: string[] | null;
  isDataCleared?: boolean | null;
  isChunkRelated?: boolean | null;
  authorName?: string | null;
}>({});

const isSearch = computed(()=>{
  return Object.values(searchPayload.value).some(value => {
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return true;
    return value !== null && value !== undefined; // 其他类型需非空
  });
})

const { handleKnowledgeTab } = store;
const {knowledgeTabActive} = storeToRefs(store);

watch(()=>knowledgeTabActive.value,()=>{
  if(knowledgeTabActive.value === 'dataset'){
    const kbId = route.query.kb_id;
    handleQueryDataSetList(
      {
        kbId: String(kbId),
        page: 1,
        pageSize: 20,
      },
      true,
      true
    );
    currentPage.value = 1;
    currentPageSize.value = 20;
  }else{
    handleCleartTimer();
  }
})

const handleInputSearch = debounce((value: string) => {
  searchPayload.value.datasetName = value.trim();
  handleSearchData();
}, 300);

const handleSearchPayload = (): Record<string, unknown> => {
  return Object.entries(searchPayload.value).reduce((acc, [key, value]) => {
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      return acc; // 移除空值或空数组的字段
    }
    // 处理特殊字段类型转换
    acc[key] = typeof value === 'string' 
        ? value.trim() 
        : value;
    return acc;
  }, {} as Record<string, unknown>);
};

const handlePollFileDataSet = () => {
  if (!route.query.kb_id || pollingKfTimer.value === null) {
    clearInterval(pollingKfTimer.value);
    return;
  }
  dataSetAPI.queryDataSetList({
    page: currentPage.value,
    pageSize: currentPageSize.value,
    kbId: route.query.kb_id as string,
    ...handleSearchPayload(),
  })
    .then((res: any) => {
      fileTableList.data = res?.datasets;
      totalCount.value = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleStartPollTimer = () => {
  pollingKfTimer.value = setInterval(() => handlePollFileDataSet(), 15000);
};

const handCheckTableData = (tableList: { filter: (arg0: (checkItem: any) => any) => never[]; find: (arg0: (notCheckItem: any) => boolean) => any; }) => {
  checkTableSelecData.value = tableList.filter((checkItem) => {
    const selecData = tableList.find((notCheckItem) => notCheckItem?.id === checkItem?.id);
    return selecData && ['pending', 'running'].includes(selecData.generateTask?.taskStatus);
  });
};

const handleSearchOpsData = (loadingStatus: boolean, startPollTimer: boolean) => {
  handleQueryDataSetList(
    {
      page: currentPage.value,
      pageSize: currentPageSize.value,
      kbId: route.query.kb_id as string,
      ...handleSearchPayload(),
    },
    loadingStatus,
    startPollTimer
  );
};

const handleQueryDataSetList = (
  payload: any,
  loadingStatus: boolean,
  pollTimer: boolean
)=>{
  if (pollTimer) {
    handleCleartTimer();
  }
  loading.value = loadingStatus;
  dataSetAPI.queryDataSetList(payload)
    .then((res: any) => {
      if (res.datasets?.length) {
        handCheckTableData(res.datasets);
      }
      if (!res?.datasets?.length && currentPage.value && currentPage.value !== 1) {
        currentPage.value = 1;
        handleSearchOpsData(true, true);
        return;
      }
      fileTableList.data = res?.datasets || [];
      totalCount.value = res.total;
      if (pollTimer) {
        handleStartPollTimer();
      }
    })
    .finally(() => {
      loading.value = false;
    });
}

const handleCleartTimer = () => {
  clearInterval(pollingKfTimer.value);
  pollingKfTimer.value = null;
};

const handleSearchData = () => {
  handleQueryDataSetList(
    {
      page: 1,
      pageSize: currentPageSize.value ?? 20,
      kbId: route.query.kb_id as string,
      ...handleSearchPayload(),
    },
    true,
    true
  );
  currentPage.value = 1;
  enableFilterVisible.value = false;
  statusFilterVisible.value = false;
  creatorVisible.value = false
  enableTextFilterVisible.value = false;
};

onMounted(() => {
  const kbId = route.query.kb_id;
  if (kbId?.length && knowledgeTabActive.value ==='dataset' ) {
    handleQueryDataSetList(
      {
        kbId: String(kbId),
        page: 1,
        pageSize: 20,
      },
      true,
      true
    );
    currentPage.value = 1;
    currentPageSize.value = 20;
  }
});
onUnmounted(()=>{
  handleCleartTimer();
})

const handleToCreate = () => {
  handleKnowledgeTab('document');
};
const handelClearFilterProper = (filterList: any) => {
  if(filterList.length === 1){
    searchPayload.value.isDataCleared = filterList[0]==='true'?true:false;
  }else{
    searchPayload.value.isDataCleared = null;
  }
  handleSearchData();
};

const handeRelatedFilterProper = (filterList: any) => {
  if(filterList.length === 1){
    searchPayload.value.isChunkRelated = filterList[0]==='true'?true:false;
  }else{
    searchPayload.value.isChunkRelated = null;
  }
  handleSearchData();
};

const hanldeSearhNameFilter = (filterName: string) => {
  searchPayload.value.authorName = filterName;
  handleSearchData();
  creatorVisible.value = false;
};
const handleBatchDownBth = (e: boolean) => {
  batchDownBth.value = e;

};

const handleSelectDeleteDataSet = () => {
  ElMessageBox.confirm(
    t('dialogTipText.confirmDelDataset'),
    t('dialogTipText.tipsText'),
    {
      confirmButtonText: t('btnText.confirm'),
      cancelButtonText: t('btnText.cancel'),
      cancelButtonClass: 'el-button--primary',
      confirmButtonClass: 'el-button-confirm',
      type: 'warning',
      icon:markRaw(IconAlarm)
    }
  ).then(() => {
    loading.value = true;
    const params = selectionDataSetList.value.map((row: any)=>row.datasetId)
    dataSetAPI.delDataSet(params).then(()=>{
      handleSearchData();
    }).finally(()=>{
      loading.value = false;
      selectionDataSetList.value = [];
    })
  })
};

const handleSelectionChange = (newSelection: any[]) => {
  selectionDataSetList.value = newSelection;
};

const checkSelecTable = (row: any) => {
  return true;
};
const handleJumpFileSection = (row: any) => {
  dataSetRow.value = row;
  dataSetDrawerVisible.value = true;
};

const handelStatusFilterProper = (filterList: any) => {
  searchPayload.value.generateStatus = filterList;
  handleSearchData();
};

const handleDeleteDataSet = (row: any) => {
  ElMessageBox.confirm(
    `${t('dialogTipText.delDataset')}【${row.datasetName}】 ？`,
    t('dialogTipText.tipsText'),
    {
      confirmButtonText: t('btnText.confirm'),
      cancelButtonText: t('btnText.cancel'),
      cancelButtonClass: 'el-button--primary',
      confirmButtonClass: 'el-button-confirm',
      type: 'warning',
      icon:markRaw(IconAlarm)
    }
  ).then(()=>{
    loading.value = true;
    const params = [row.datasetId];
    dataSetAPI.delDataSet(params).then(()=>{
      handleSearchData();
    }).finally(()=>{
      loading.value = false;
    })
  })
};

const handleRunDataSet = (row: any, type: boolean) => {
  loading.value = true;
  let params = {
    datasetId: row.datasetId,
    generate: type,
  }
  dataSetAPI.generateDataSet(params).then(()=>{
    handleSearchData();
  }).finally(()=>{
    loading.value = false;
  })
};

const handleChangePage = (pageNum: number, pageSize: number) => {
  currentPage.value = pageNum;
  currentPageSize.value = pageSize;
  handleQueryDataSetList(
      {
        kbId: route.query.kb_id as string,
        page: pageNum,
        pageSize: pageSize,
      },
      true,
      true
    );
};

const handleDataSetEval = (row: any) =>{
  loading.value = true;
  dataSetAPI.isHaveTesting({datasetId: row.datasetId}).then((res: any) => {
    if (res) {
      ElMessageBox.confirm(
        t('dialogTipText.existConfirm'), 
        t('dialogTipText.tipsText'), 
        {
          confirmButtonText: t('btnText.confirm'),
          cancelButtonText: t('btnText.cancel'),
          cancelButtonClass: 'el-button--primary',
          confirmButtonClass: 'el-button-confirm',
          type: 'warning',
          icon:markRaw(IconAlarm),
        }
      ).then(() => {
        dialogEvaluateVisible.value = true;
        rowData.value = row;
      })
    } else {
      dialogEvaluateVisible.value = true;
      rowData.value = row;
    }
  }).finally(() => {
    loading.value = false;
  })
}

watch(
  () => t(''),
  () => {
    filterStatusList.value = [
      {
        label: t('dataset.taskStatus.failed'),
        value: DataSetStatusEnum.FAILED,
      },
      {
        label: t('dataset.taskStatus.success'),
        value: DataSetStatusEnum.SUCCESS,
      },
      {
        label: t('dataset.taskStatus.canceled'),
        value: DataSetStatusEnum.CANCELED,
      },
      {
        label: t('dataset.taskStatus.pending'),
        value: DataSetStatusEnum.PENDING,
      },
      {
        label: t('dataset.taskStatus.running'),
        value: DataSetStatusEnum.RUNNING,
      },
    ];
    filterEnableList.value = [
      { label: t('dataset.yes'), value: 'true' },
      { label: t('dataset.no'), value: 'false' },
    ];
  },
  {
    deep: true,
    immediate: true,
  }
);

const handleDataSetProps = () => {
  dataSetDrawerVisible.value = false;
};

const handleImportDataSet = () =>{
  dialogImportVisible.value = true;
  showTaskExportNotify.value = false;
}
const handleUploadMyFile = (options: any) => {
  dataSetAPI.importDataSet(
    {
      data: {
        dataset_packages: options.file.raw,
      },
      params: {
        kbId: route.query.kb_id,
      },
    },
    options
  )
  .then(() => {
    options.onSuccess({ ...options.fileInfo, success: 'success' });
  })
  .catch((err) => {
    options.onError({ ...options.fileInfo, error: err });
  });
};
const handleQueryTaskList = () => {
  handleSearchOpsData(true, false);
};

const handleCancelVisible = () => {
  dialogImportVisible.value = false;
};
const toggleUploadNotify = (uploadTaskPayload: any) => {
  importTaskTotal.value = uploadTaskPayload.uploadingList.length;
  uploadTaskListData.value = uploadTaskPayload;
};
const handleImportLoading = (loadingStatus: boolean) => {
  loading.value = loadingStatus;
};

const handleInitExportTaskList = () => {
  const teamId = localStorage.getItem('teamId') ?? '';
  return KbAppAPI.queryTaskList({
    teamId,
    taskType: 'dataset_export',
    page: 1,
    pageSize: currentPageSize.value,
  }).then((res: any) => {
    exportTaskTotal.value = res?.total || 0;
    taskExportLoading.value = false;
    taskExportList.value =
      res.tasks.map((item: any) => {
        return {
          id: item.opId,
          taskId: item.taskId,
          name: item.opName,
          percent:
            item?.taskStatus === 'success'
              ? 100
              : item.taskCompleted,
          exportStatus: item?.taskStatus,
        };
      }) || [];
    if (res?.tasks.every((item: any) => !['pending', 'running'].includes(item?.taskStatus))) {
      clearInterval(taskExportTimer.value);
      taskExportTimer.value = null;
    }
    return res?.tasks || [];
  });
};

const handleExportDataSet = async (row: any) => {
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
          name: row.datasetName,
          id: row.datasetId,
          exportStatus: 'pending',
          taskId: res.data,
        },
      ]?.map((item: any) => {
        let taskOptions = {
          taskDownUrl: '',
          onProgress: (evt: any) => {
            item.percent = evt;
          },
          onError: () => {
            item.exportStatus = 'error';
            item.percent = '0';
            loading.value = false;
          },
        };
        dataSetAPI.saveDataSet([row.datasetId], taskOptions)
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
        return {
          id: item.opId,
          taskId: item.taskId,
          name: item.opName,
          percent:
            item?.taskStatus === 'success'
              ? 100
              : item.taskCompleted,
          exportStatus: item?.taskStatus,
        };
      }),
    ];
  });
};
const handleBatchExport = () => {
  dialogImportVisible.value = false;
  uploadTaskListData.value.showUploadNotify = false;
  loading.value = true;
  handleInitExportTaskList().then((res) => {
    showTaskExportNotify.value = true;
    showTaskExportList.value = true;
    exportTaskTotal.value = exportTaskTotal.value + 1;
    let datasetId:string[] = [];
    const arr = selectionDataSetList.value.map((row:any)=>{
      datasetId.push(row.datasetId);
      let item = {
        name: row.datasetName,
        id: row.datasetId,
        exportStatus: 'pending',
        taskId: res.data,
      }
      return item;
    })
    let taskOptions:any = []
    taskExportList.value = [
      arr?.map((item: any) => {
        taskOptions.push({
          taskDownUrl: '',
          onProgress: (evt: any) => {
            item.percent = evt;
          },
          onError: () => {
            item.exportStatus = 'error';
            item.percent = '0';
            loading.value = false;
          },
        });
        return item;
      }),
      dataSetAPI.saveDataSet(datasetId, taskOptions)
        .then((taskRes:any) => {
          arr?.map((item: any,index: number) => {
            item.taskId = taskRes[index];

          })
          loading.value = false;
          taskExportTimer.value = setInterval(() => {
            handleInitExportTaskList();
          }, 2500);
          selectionDataSetList.value = [];
          multipleTable.value.clearSelection();
        })
        .catch(() => {
          arr?.map((item: any,index: number) => {
            taskOptions[index].onError();
          })
        }),
      ...res.map((item: any) => {
        return {
          id: item.opId,
          taskId: item.taskId,
          name: item.opName,
          percent:
            item?.taskStatus === 'success'
              ? 100
              : item.taskCompleted,
          exportStatus: item?.taskStatus,
        };
      }),
    ];
  });
}

const exportTaskPageSize = ref(10);

const handleCloseAllTask=(type: ITaskType)=>{
  taskExportLoading.value = true;
  const teamId = localStorage.getItem('teamId') ?? '';
  KbAppAPI.stopAllTaskList({
    teamId,
    taskType:type
  }).then(() => {
    handleInitExportTaskList();
  }).finally(()=>{
    taskExportLoading.value = false;
  })
}

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

const handleCloseSingleUpload = (taskId: string) => {
  if(taskId === 'all'){
    handleCloseAllTask('dataset_export');
  }else{
    taskExportLoading.value = true;
    let payload: any = {
      taskId
    };
    KbAppAPI.stopOneTaskList(payload).then(() => {
      handleInitExportTaskList();
    }).finally(()=>{
      taskExportLoading.value = false;
    })
  }
};

const handleUploadRestart = (task: { taskId: string }) => {
  taskExportList.value.forEach((item) => {
    if (task.taskId === item.taskId) {
      let taskOptions = {
        taskDownUrl: '',
        onProgress: (evt: any) => {
          item.percent = evt;
        },
        onError: () => {
          item.exportStatus = 'error';
          item.percent = '0';
        },
        onSuccess: () => {
          item.exportStatus = 'success';
        },
      };
      dataSetAPI.saveDataSet([task.taskId], taskOptions)
        .then(() => {
          taskOptions.onSuccess();
        })
        .catch(() => {
          taskOptions.onError();
        });
    }
  });
};

const handleOpenDownload = (fileId: string) => {
  const url = `${window.origin}/witchaind/api/dataset/download?taskId=${fileId}`;
  downloadFun(url)
};

watch(()=>dataSetDrawerVisible.value,()=>{
  if(!dataSetDrawerVisible.value){
    handleSearchData();
  }
})

</script>
