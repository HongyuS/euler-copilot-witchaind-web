<template>
  <CustomLoading :loading="loading" />
  <div class="empty-content" v-if="!fileTableList.data.length && !isSearch">
    <EmptyStatus
      :description="$t('assetLibrary.assetEmptyDesc')"
      :buttonText="$t('assetLibrary.assetEmptyText')"
      buttonClass="group-btn"
      @click="handleCreateKnowledge"
    />
  </div>
  <div v-else class="knowledgeLibrary-container">
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
                <IconError
                  v-if="['error', 'canceled', 'failed'].includes(item.exportStatus)"
                  class="errorIcon" />
                <el-icon
                  v-if="item.percent === 100"
                  class="successIcon">
                  <CircleCheckFilled />
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
    <div
      class="knowledgeLibrary-box knowledgeLibrary-table-box"
      :class="{ knowledgeLibrayList: switchIcon === 'list' }">
      <div class="kl-tilte">
          {{ groupName }}
      </div>
      <div class="kl-ops">
        <div class="kl-left-btn">
          <el-button
            type="primary"
            class="createAsset"
            @click="handleCreateKnowledge">
            {{ $t('btnText.createAssetLibrary') }}
          </el-button>
          <el-button
            @click="handleImportKnowledge"
            class="ImportAsset">
            {{ $t('btnText.batchImport') }}
          </el-button>
          <el-dropdown 
            placement="bottom" 
            popper-class="kf-ops-dowlon dropdown-container"
            @visible-change="handleBatchDownBth"
            :disabled="multipleSelection.length === 0"
          >
            <el-button 
            :class="{
              'upBtn': batchDownBth,
              'downBtn': !batchDownBth,
              'dropdown-disabled': multipleSelection.length === 0
            }"
            >
              {{ $t('btnText.batchOps') }}
              <el-icon class="el-icon--right" v-if="!batchDownBth">
                <IconCaretDown />
              </el-icon>
              <el-icon class="el-icon--right el-icon--caretup" v-if="batchDownBth">
                <IconCaretUp />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleBatchDelete" >
                  {{ $t('btnText.batchDelete') }}
                </el-dropdown-item>
                <el-dropdown-item @click="handleBatchExport" >
                  {{ $t('btnText.batchExport') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button v-if="switchIcon === 'thumb'" @click="handleMultipleSelect">
            {{multiple? $t('btnText.cancelMultiple') : $t('btnText.multiple')}}
          </el-button>
          <span v-if="multiple && switchIcon === 'thumb'" class="multipleSelect" >
            <el-checkbox 
              :label="$t('btnText.checkAll')" 
              size="large" 
              v-model="isAllChecked"
              :indeterminate="isIndeterminate"
              @change="handleSelectAll"
            />
          </span>
          <span v-if="multipleSelection.length>0 " class="multipleSelectNum">
            {{ $t('btnText.selected',{count: multipleSelection.length }) }} 
          </span>
        </div>
        <div class="kl-right-btn">
          <div class="kl-btn-search">
            <el-input
              ref="inputRef"
              v-model="knoledgekeyWord"
              @input="handleInputSearch"
              class="o-style-serch"
              :placeholder="$t('assetLibrary.message.name')"
              clearable>
              <template #suffix>
                <el-icon class="el-input__icon">
                  <IconSearch />
                </el-icon>
              </template>
            </el-input>
          </div>
          <div class="kl-btn-switch">
            <div
              class="kl-btn-switch-icon"
              @click="handleSwitch('thumb')"
              :class="switchIcon === 'thumb' ? 'bgThumb' : ''">
              <el-icon>
                <IconThumbnail />
              </el-icon>
            </div>

            <div
              class="kl-btn-switch-icon"
              @click="handleSwitch('list')"
              :class="switchIcon === 'list' ? 'bgThumb' : ''">
              <el-icon>
                <IconList />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
      <div
        class="kl-card-box"
        ref="klCardBox"
        v-if="switchIcon === 'thumb'">
        <div
          class="kl-card kl-card-container"
          :class="5 < fileTableList.data.length ? 'kl-card-display' : 'kl-card-show'">
          <div
            class="kl-single-card"
            @click="handleJumpAssets(item)"
            v-for="item in fileTableList.data"
            :key="item?.kbId"
            :class="{'is-checked': item?.checked}">
            <div class="kl-card-top">
              <div class="kl-card-name"
              >
                <TextSingleTootip :content="item.kbName" />
              </div>
              <el-dropdown
                v-if="!multiple"
                placement="bottom-end"
                popper-class="dropdown-container assetDro">
                <div
                  class="kl-card-more-icon"
                  @click.stop>
                  <el-icon>
                    <IconMore />
                  </el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleEditKl(item)">
                      {{ $t('btnText.edit') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleExportKl(item)">
                      {{ $t('btnText.export') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleDeleteKl(item)">
                      {{ $t('btnText.delete') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-checkbox 
                v-else 
                v-model="item.checked" 
                @click.stop
                @change="(val) => handleCheckboxChange(val, item)"
              />
            </div>
            <div class="kl-card-desc">
              <TextMoreTootip
                :value="item.description"
                :row="6" />
            </div>
            <div class="kl-card-id">
              <span class="id-label">{{ `ID:${' '} ` }}</span>
              <span class="id-value">{{ item.kbId }}</span>
            </div>
            <div class="kl-card-footer">
              <div>
                {{ item.authorName }}
              </div>
              <div class="kl-card-file-icon">
                <img
                  src="/src/assets/images/file_count.svg"
                  class="filePng" />
                <div class="kl-card-file">
                  <span class="kl-file-num">{{ item.docCnt }}</span>
                  <span class="kl-file-text">
                    <TextSingleTootip
                      :content="`${$t('assetLibrary.piece')}${$t('assetLibrary.file')}`" />
                  </span>
                </div>
              </div>
              <div class="kl-card-file-icon">
                <img
                  src="/src/assets/images/file_size.svg"
                  class="filePng" />
                <div class="kl-card-file">
                 {{ bytesToSize(item.docSize) }}
                </div>
              </div>
              <div class="kl-card-timer-icon">
                <img
                  src="/src/assets/images/date_time.svg"
                  class="timePng" />
                <div class="kl-card-timer">
                  <TextSingleTootip :content="convertUTCToLocalTime(item.createdTime)" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="!(fileTableList.data.length > 0)"
          class="pageNoData">
          {{ $t('pageTipText.NoData') }}
        </div>
      </div>
      <!-- 表格视图 -->
      <div
        class="kl-table-box"
        v-else>
        <el-table
          ref="tableListRef"
          :data="fileTableList.data"
          :border="true"
          @selection-change="handleSelectionChange"
          :class="fileTableList.data.length < currentPageSize ? 'showPagination' : ''">
          <el-table-column type="selection"  width="55" />
          <el-table-column
            prop="kbName"
            :label="$t('assetLibrary.name')"
            :show-overflow-tooltip="true"
            width="130"
            :fixed="true"
            class-name="kl-name">
            <template #default="scope">
              <span
                class="kl-name-row"
                @click="handleJumpAssets(scope.row)">
                {{ scope.row.kbName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="kbId"
            :label="$t('assetLibrary.assetId')"
            show-overflow-tooltip
            :fixed="true"
            class-name="kl-id"
            width="300">
            <template #header>
              <div class="asset-id-custom-header">
                <span>{{ $t('assetLibrary.assetId') }}</span>
                <el-icon
                  ref="inputSearchRef"
                  :class="
                    sortFilter?.kbId?.length! > 0 || fileFilterVisible ? 'searchIconIsActive' : ''
                  ">
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
                  virtual-triggering>
                  <FilterContainr
                    filterType="input"
                    v-model:serachName="sortFilter.kbId"
                    :hanldeSearhNameFilter="hanldeSearhNameFilter"
                    :searchPayload="sortFilter" />
                </el-popover>
              </div>
            </template>
            <template #default="scope">
              <span class="kf-name-row">
                {{ scope.row.kbId }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            :label="$t('assetLibrary.desc')"
            :show-overflow-tooltip="true" />
          <el-table-column
            prop="docCnt"
            sortable
            width="100"
            :label="$t('assetLibrary.fileNum')" />
            <el-table-column
            prop="docSize"
            sortable
            width="100"
            :label="$t('assetLibrary.fileSize')" >
            <template #default="scope">
              <span class="kf-name-row">
                {{ bytesToSize(scope.row.docSize) }}
              </span>
            </template>
          </el-table-column>
            <el-table-column
            prop="authorName"
            width="100"
            :label="$t('assetLibrary.creator')">
            <template #header>
              <div class="asset-id-custom-header">
                <span>{{ $t('assetLibrary.creator') }}</span>
                <el-icon
                  ref="authorNameSearchRef"
                  :class="
                    sortFilter?.authorName?.length! > 0 || authorNameFilterVisible ? 'searchIconIsActive' : ''
                  ">
                  <IconSearch />
                </el-icon>
                <el-popover
                  ref="popoverRef"
                  v-model:visible="authorNameFilterVisible"
                  popper-class="inputSearchFilterPopper"
                  placement="bottom-start"
                  :virtual-ref="authorNameSearchRef"
                  :show-arrow="false"
                  trigger="click"
                  virtual-triggering>
                  <FilterContainr
                    filterType="input"
                    v-model:serachName="sortFilter.authorName"
                    :hanldeSearhNameFilter="hanldeSearhAuthorNameFilter"
                    :searchPayload="sortFilter" />
                </el-popover>
              </div>
            </template>
            <template #default="scope">
              <span>{{ scope.row.authorName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createdTime"
            sortable
            class-name="asset-upload-time-cell"
            :label="$t('assetLibrary.uploadTime')"
            width="150"
            @header-click="() => {}"
            @click.stop>
            <template #default="scope">
              <span>{{ convertUTCToLocalTime(scope.row.createdTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="action"
            :label="$t('btnText.operation')"
            width="150">
            <template #default="scope">
              <el-button
                text
                @click="handleEditKl(scope.row)">
                {{ $t('btnText.edit') }}
              </el-button>
              <el-button
                text
                @click="handleExportKl(scope.row)">
                {{ $t('btnText.export') }}
              </el-button>
              <el-button
                text
                @click="handleDeleteKl(scope.row)">
                {{ $t('btnText.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        v-if="fileTableList.data?.length > 0"
        v-model:current-page="currentPage"
        v-model:page-size="currentPageSize"
        :page-sizes="pagination.pageSizes"
        :layout="pagination.layout"
        :total="totalCount"
        popper-class="kbLibraryPage"
        @change="handleChangePage" />
    </div>
  </div>
    <el-dialog
      v-model="dialogImportVisible"
      class="upload-dialog"
      align-center
      :title="$t('dialogTipText.importAssetLibrary')">
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
        uploadType="kbfile" />
    </el-dialog>
    <el-dialog
      v-if="dialogCreateVisible"
      v-model="dialogCreateVisible"
      class="create-dialog"
      align-center
      width="560"
      @close="handleCloseCreateKb"
      :title="
        formData?.kbName?.length > 0
          ? $t('btnText.editAssetLibrary')
          : $t('btnText.createAssetLibrary')
      ">
      <KnowledgeForm
        :handleOpsKbForm="handleOpsKbForm"
        :handelResetForm="handelResetForm"
        :handleCloseCreateKb="handleCloseCreateKb"
        :formData="formData" />
    </el-dialog>
    <el-dialog
      align-center
      v-model="addTipVisible"
      class="tip-dialog"
      width="400"
      :title="$t('dialogTipText.tipsText')">
      {{ $t('dialogTipText.isAddFilr') }}
      <div class="tip-ops-btn">
        <el-button
          class="resetBtn"
          type="primary"
          @click="handleAddFile">
          {{ $t('btnText.confirm') }}
        </el-button>
        <el-button
          class="resetBtn cancelBtn"
          @click="handleCancelAddFile">
          {{ $t('btnText.cancel') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      align-center
      v-model="delTipVisible"
      class="tip-dialog delTipDialog"
      width="432"
      :title="$t('dialogTipText.tipsText')">
      <div class="delTip">
        <span class="iconAlarmOrange">
          <IconAlarmOrange />
        </span>
        <span>
          {{ $t('dialogTipText.confirmDelAsset') }}
          <span>
            【
            <span class="delToolTip">
              <TextSingleTootip :content="opsItem.kbName" />
            </span>
            】
            {{ userLanguage === 'zh' ? '吗？' : null }}
          </span>
        </span>
      </div>
      <div class="tip-ops-btn">
        <el-button
          class="resetBtn"
          @click="handleConfirmDelKb(opsItem)">
          {{ $t('btnText.confirm') }}
        </el-button>
        <el-button
          type="primary"
          class="resetBtn cancelBtn"
          @click="handleCancelDelKb()">
          {{ $t('btnText.cancel') }}
        </el-button>
      </div>
    </el-dialog>
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
    :taskListLoading="taskListLoading" />
</template>
<script lang="ts" setup>
import KnowledgeForm from '@/components/KnowledgeForm/index.vue';
import UploadProgress from '@/components/Upload/uploadProgress.vue';
import Upload from '@/components/Upload/index.vue';
import '@/styles/knowledgeLibrary.scss';
import {
  IconList,
  IconMore,
  IconSearch,
  IconThumbnail,
  IconAlarmOrange,
  IconChevronUp,
  IconChevronDown,
  IconX,
  IconError,
  IconSuccess,
  IconCaretDown,
  IconCaretUp,
  IconAlarm,
} from '@computing/opendesign-icons';
import TextMoreTootip from '@/components/TextMoreTootip/index.vue';
import TextSingleTootip from '@/components/TextSingleTootip/index.vue';
import CustomLoading from '@/components/CustomLoading/index.vue';

import { debounce } from 'lodash';
import KbAppAPI, { ITaskType } from '@/api/kbApp';
import { QueryKbRequest } from '@/api/apiType';
import { convertUTCToLocalTime, uTCToLocalTime } from '@/utils/convertUTCToLocalTime';
import FilterContainr from '@/components/TableFilter/index.vue';
import { defineProps } from 'vue';
import router from '@/router';
import { useGroupStore } from '@/store/modules/group';
import EmptyStatus from '@/components/EmptyStatus/index.vue'
import { CheckboxValueType } from 'element-plus';
import { bytesToSize } from '@/utils/bytesToSize';
import { downloadFun } from '@/utils/downloadFun';
import { validate } from 'uuid';
const route = useRoute();

defineProps({
groupName: {
  type: String
},
});
const { navGroup,curTeamInfo } =  storeToRefs(useGroupStore());
const { t } = useI18n();
const knoledgekeyWord = ref();
const dialogImportVisible = ref(false);
const dialogCreateVisible = ref(false);
const addTipVisible = ref(false);
const delTipVisible = ref(false);
const switchIcon = ref('thumb');
const opsItem = ref();
const klCardBox = ref();
const loading = ref(false);
const importTaskList = ref([]);
const userLanguage = ref();

const resetFormData = ref({
  kbName: '',
  tokenizer: '',
  defaultChunkSize: 512,
  embeddingModel: '',
  defaultParseMethod: '',
  docTypes: [],
  description: '',
  uploadSizeLimit:512,
  uploadCountLimit:128,
});
const showTaskExportNotify = ref(false);
const taskExportList = ref<any[]>([]);
const showTaskExportList = ref(false);
const formData = ref(resetFormData.value);
const pagination = ref({
  pageSizes: [10, 20, 30, 40, 50],
  layout: 'total,sizes,prev,pager,next,jumper',
});
interface sortFilterType {
  id?: string;
  name?: string;
  created_time_start?: string;
  created_time_end?: string;
  [property: string | number]: string | undefined;
}
const sortFilter = ref<sortFilterType>({});
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
const authorNameFilterVisible = ref(false);
const fileFilterVisible = ref(false);
const inputSearchRef = ref();
const authorNameSearchRef = ref();
const shortcuts = ref();
const fileTableList = reactive<{
  data: Array<any>;
}>({
  data: [],
});
const tableListRef = ref();
const taskTimer = ref();
const batchDownBth = ref(false);
const multiple = ref(false)
const multipleSelection = ref<any[]>([]);
const isAllChecked = computed(() => {
  if (!fileTableList.data.length) return false;
  return fileTableList.data.every(item => item?.checked);
});
const isIndeterminate = ref(false);

const handleCheckboxChange = (checked: CheckboxValueType, item: any) => {
  if (checked) {
    if(!multipleSelection.value.includes(item)){
      multipleSelection.value.push(item);
    }
  } else {
    const index = multipleSelection.value.findIndex(i => i.id === item.id);
    if (index !== -1) {
      multipleSelection.value.splice(index, 1);
    }
  }
  isIndeterminate.value = multipleSelection.value.length > 0 && multipleSelection.value.length < fileTableList.data.length;
};

const handleSelectAll = (checked:CheckboxValueType) => {
  fileTableList.data.forEach(item => {
    item.checked = checked;
    handleCheckboxChange(checked, item);
  });
  isIndeterminate.value = false;
};

const handleClearSelection = () => {
  tableListRef.value?.clearSelection();
  fileTableList.data.forEach(item => {
    item.checked = false;
  });
  multipleSelection.value = [];
  isIndeterminate.value = false;
};

const handleBatchDownBth = (e: boolean) => {
  batchDownBth.value = e;
};

const handleDelete= async (ids:string[],successFn:Function)=>{
  loading.value = true;
  KbAppAPI.delKbLibrary(ids).then((res) => {
    if (res) {
      ElMessage({
        showClose: true,
        message: t('opsMessage.delSuccess'),
        icon: IconSuccess,
        customClass: 'o-message--success',
        duration: 3000,
      });
      handleOpsKbConfirm();
    }
    successFn();
  })
  .finally(() => {
    loading.value = false;
  });
}
const handleBatchDelete = () => {
  ElMessageBox.confirm(
    t('dialogTipText.confirmDelKL'),
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
    const ids = multipleSelection.value.map(item => item.kbId);
    const successFn = ()=>{
      handleClearSelection();
      handleQueryKbLibrary({
        page: 1,
        pageSize: 10,
      });
    }
    handleDelete(ids,successFn);
  })
}

const handleBatchExport = () => {
  dialogImportVisible.value = false;
  uploadTaskListData.value.showUploadNotify = false;
  loading.value = true;
  handleInitExportTaskList().then((res) => {
    showTaskExportNotify.value = true;
    showTaskExportList.value = true;
    exportTaskTotal.value = exportTaskTotal.value + 1;
    let kbIds:string[] = [];
    const arr = multipleSelection.value.map((row)=>{
      kbIds.push(row.kbId);
      let item = {
        name: row.kbName,
        id: row.kbId,
        exportStatus: 'pending',
        taskId: res?.data,
      }
      return item;
    })
    let taskOptions:any = []
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
    });
    taskExportList.value = [
      ...arr,
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
    KbAppAPI.savebLibrary(kbIds, taskOptions)
        .then((taskRes:any) => {
          arr?.map((item: any,index) => {
            item.taskId = taskRes[index];

          })
          loading.value = false;
          taskExportTimer.value = setInterval(() => {
            handleInitExportTaskList();
          }, 2500);
        })
        .catch(() => {
          arr?.map((item: any,index) => {
            taskOptions[index].onError();
          })
        }),
    handleMultipleSelect()
  })
}

const handleMultipleSelect = () => {
  multiple.value = !multiple.value;
  handleSelectAll(false);
};

const handleQueryKbLibrary = (params: QueryKbRequest) => {
  loading.value = true;
  let teamId = route.query.id as string ?? localStorage.getItem('teamId');
  KbAppAPI.getKbLibrary({ teamId: teamId , ...params })
    .then((res: any) => {
      fileTableList.data = res?.kbList;
      totalCount.value = res?.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
onMounted(() => {
  handleQueryKbLibrary({
    page: 1,
    pageSize: 10,
  });
});

const handleFilterData = (params: sortFilterType) => {
  let filterPaylod: sortFilterType = {};
  Object.keys(params || {}).forEach((item: string | number) => {
    if (params[item]) {
      if (params[item]?.length > 0) {
        filterPaylod[item] = params[item];
      }
    }
  });
  return filterPaylod;
};

const hanldeSearhNameFilter = (filterName: string) => {
  if(!validate(filterName)){
    ElMessage.error(t('assetLibrary.assetFormat'));
    return;
  }
  sortFilter.value.kbId = filterName;
  currentPage.value = 1;
  currentPageSize.value = 10;
  handleQueryKbLibrary({
    page: currentPage.value,
    pageSize: currentPageSize.value,
    ...handleFilterData(sortFilter.value),
  });
  fileFilterVisible.value = false;
};
const hanldeSearhAuthorNameFilter = (filterName: string) => {
  sortFilter.value.authorName = filterName;
  currentPage.value = 1;
  currentPageSize.value = 10;
  handleQueryKbLibrary({
    page: currentPage.value,
    pageSize: currentPageSize.value,
    ...handleFilterData(sortFilter.value),
  });
  authorNameFilterVisible.value = false;
};

const handleSwitch = (switchType: string) => {
  switchIcon.value = switchType;
  sortFilter.value = {};
  currentPage.value = 1;
  currentPageSize.value = 10;
  knoledgekeyWord.value = '';
  handleClearSelection();
  isIndeterminate.value = false;

  handleQueryKbLibrary({
    page: currentPage.value,
    pageSize: currentPageSize.value,
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
  return KbAppAPI.queryTaskList({
    teamId:route.query.id as string,
    taskType: 'kb_import',
    page: 1,
    pageSize: importTaskPageSize.value,
  }).then((res: any) => {
    importTaskList.value = res.tasks || [];
    importTaskTotal.value = selectedFiles ? res.total + selectedFiles.length : res.total;
    return res.tasks || [];
  });
};

const handelTaskList = () => {
  KbAppAPI.queryTaskList({
    teamId:route.query.id as string,
    taskType: 'kb_import',
    page: 1,
    pageSize: importTaskPageSize.value,
  }).then((res: any) => {
    importTaskList.value = res.tasks || [];
    importTaskTotal.value = res.total;
    taskListImportDate.value = Date.now();
    taskListLoading.value = false;
    if (res.tasks?.every((item: any) => !['pending', 'running'].includes(item.taskStatus))) {
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
  if(taskId==='all'){
    handleCloseAllTask('kb_import');
  }else{
    taskListImportDate.value = Date.now();
    taskListLoading.value = true;
    let payload: any = {
      taskId
    };
    KbAppAPI.stopOneTaskList(payload).then((res:any) => {
      handelTaskList();
      importTaskList.value = res.tasks || [];
      importTaskTotal.value = res.total || 0;
      taskListImportDate.value = Date.now();
    }).finally(()=>{
      taskListLoading.value = false;
    });
  }
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
          name: row.kbName,
          id: row.kbId,
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
        KbAppAPI.savebLibrary([row.kbId], taskOptions)
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
      KbAppAPI.savebLibrary([task.taskId], taskOptions)
        .then(() => {
          taskOptions.onSuccess();
        })
        .catch(() => {
          taskOptions.onError();
        });
    }
  });
};

const handleCloseSingleUpload = (taskId: string) => {
  if(taskId === 'all'){
    handleCloseAllTask('kb_export');
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

const handleCloseAllTask=(type: ITaskType)=>{
  taskExportLoading.value = true;
  KbAppAPI.stopAllTaskList({
    teamId: route.query.id as string,
    taskType:type
  }).then(() => {
    if(type === 'kb_export'){
      handleInitExportTaskList();
    }else{
      handelTaskList();
    }
  }).finally(()=>{
    taskExportLoading.value = false;
  })
}

const handleInitExportTaskList = () => {
  return KbAppAPI.queryTaskList({
    teamId: route.query.id as string,
    taskType: 'kb_export',
    page: 1,
    pageSize: exportTaskPageSize.value,
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

watch(
  () => t(''),
  () => {
    shortcuts.value = [
      {
        text: t('timerSearch.lastHour', {
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
        text: t('timerSearch.lastHour', {
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
        text: t('timerSearch.lastHour', {
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
        text: t('timerSearch.lastHour', {
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
    userLanguage.value = JSON.parse(localStorage.getItem('userInfo') || '{}')?.language;
  },
  {
    deep: true,
    immediate: true,
  }
);

const handleCreateKnowledge = () => {
  dialogCreateVisible.value = true;
};

const handleCancelVisible = () => {
  dialogImportVisible.value = false;
  dialogCreateVisible.value = false;
};

const handleJumpAssets = async (kbItem: any) => {
  await router.push({path:'/libraryInfo',query:{kb_id:kbItem.kbId}},);
  let groupNav = navGroup.value;
  groupNav[2]={
    name:kbItem.kbName,
    path:'/libraryInfo',
    query:{
      kb_id:kbItem.kbId
    }
  }
};

const handleAddFile = () => {
  const assetLibraryObj = fileTableList.data[0];
  handleJumpAssets(assetLibraryObj)
};

const handleCancelAddFile = () => {
  addTipVisible.value = false;
};

const handleSelectionChange = (val:any) => {
  multipleSelection.value = val;
}

const handleEditKl = (row: any) => {
  formData.value = row;
  dialogCreateVisible.value = true;
};

const handleDeleteKl = (row: any) => {
  opsItem.value = row;
  delTipVisible.value = true;
};

const handleOpenDownload = (fileId: string) => {
  const url = `${window.origin}/witchaind/api/kb/download?taskId=${fileId}`;
  downloadFun(url);
};
const isSearch = computed(()=>{
  return Object.values(sortFilter.value).some(value => {
    if (typeof value === 'string') return value.trim() !== '';
    return value !== null && value !== undefined; // 其他类型需非空
  })
})

const handleInputSearch = debounce((e) => {
  let payload: {
    page: number;
    pageSize: number;
    [property: string]: any;
  } = {
    page: 1,
    pageSize: currentPageSize.value,
  };
    payload = {
      ...payload,
      kbName: e,
    };
    sortFilter.value.kbName = e;
    payload = { ...payload, ...handleFilterData(sortFilter.value) };
  handleQueryKbLibrary(payload);
}, 200);

const handleOpsKbConfirm = () => {
  let payload: {
    page: number;
    pageSize: number;
    [property: string]: any;
  } = {
    page: 1,
    pageSize: 10,
  };
  if (switchIcon.value === 'thumb') {
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
    page: currentPage.value,
    pageSize: currentPageSize.value,
  };
  if (knoledgekeyWord.value?.length > 0) {
    payload.kbName = knoledgekeyWord.value;
  }
  handleQueryKbLibrary(payload);
};

const handleConfirmDelKb = (row: any) => {
  delTipVisible.value = false;
  const successFn = ()=>{
    handleQueryKbLibrary({
      page: 1,
      pageSize: 10,
    });
  }
  handleDelete([row.kbId], successFn)
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
    page: 1,
    pageSize: 10,
    ...handleFilterData(sortFilter.value),
  });
};

const handleChangePage = (pageNum: number, pageSize: number) => {
  currentPage.value = pageNum;
  currentPageSize.value = pageSize;
  handleQueryKbLibrary({
    page: currentPage.value,
    pageSize: currentPageSize.value,
    ...handleFilterData(sortFilter.value),
  });
};

const handleUploadMyFile = (options: any) => {
  KbAppAPI.importKbLibrary(
    {
      params:{
        teamId: route.query.id as string      },
      data: {
        kb_packages: options.file?.raw,
      },
    },
    options
  )
    .then(() => {
      options.onProgress(100);
      options.onSuccess({
        ...options.fileInfo,
        success: 'success',
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