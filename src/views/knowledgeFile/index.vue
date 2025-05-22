<template>
  <div class="kf-container">
    <CustomLoading :dark="false" :loading="loading" />
    <div class="kf-container-action">
      <div
        class="kf-container-right"
        v-if="menuType === MenuType.KL_FILE">
        <div class="kf-container-table-ops">
        <div class="kf-container-table-ops-left" >
          <el-button
            type="primary"
            style="margin-right: 8px"
            @click="handleImportKnowledge"
            class="importFileBtn">
            {{ $t('btnText.importFile') }}
          </el-button>
          <el-button
            type="primary"
            style="margin-right: 8px"
            @click="handleGenerateDataSet(true)"
            :disabled="!isGenerateDataSet"
            class="dataSetBtn">
            {{ $t('生成数据集') }}
          </el-button>
          <el-dropdown
            placement="bottom"
            popper-class="dropdown-container kf-ops-dowlon"
            @visible-change="handleBatchDownBth"
            :disabled="!(selectionFileData.length > 0)">
            <el-button
              :class="batchDownBth ? 'upBtn' : 'downBtn'"
              :disabled="!(selectionFileData.length > 0)">
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
                <el-dropdown-item @click="handleDownloadFile(fileTableList.data)">
                  {{ $t('btnText.downloadAll') }}
                </el-dropdown-item>
                <el-dropdown-item
                  :disabled="!(selectionFileData.length > 0)"
                  @click="handleDownloadFile(selectionFileData)">
                  {{ $t('btnText.downloadChoose') }}
                </el-dropdown-item>
                <el-dropdown-item
                  :disabled="!(selectionFileData.length > 0)"
                  @click="handleSelectRunKl">
                  {{ $t('btnText.batchAnalytic') }}
                </el-dropdown-item>
                <el-dropdown-item
                  :disabled="!(selectionFileData.length > 0)"
                  @click="handleSelectDeleteKl">
                  {{ $t('btnText.batchDelete') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <el-input placeholder="请输入文档名称" v-model="searchPayload.docName" class="kf-container-table-ops-right" 
          @input="hanldeSearhNameFilter"  :suffix-icon="IconSearch" />
        </div>
        <div class="kf-container-table-box">
          <el-table
            :data="fileTableList.data"
            class="fileTableContainer"
            cell-calss-name="tableCell"
            :row-key="(row) => row.docId"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
            ref="multipleTable"
            :border="true">
            <el-table-column
              type="selection"
              :fixed="true"
              class-name="kl-selection"
              width="35"
              :reserve-selection="true"
              :selectable="checkSelecTable" />
            <el-table-column
              prop="docName"
              :label="$t('assetFile.docName')"
              show-overflow-tooltip
              :fixed="true"
              class-name="kl-name"
              min-width="150">
              <template #default="scope">
                <span
                  class="kf-name-row"
                  @click="handleJumpFileSection(scope.row)">
                  {{ scope.row.docName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="docType"
              :label="$t('assetFile.category')"
              width="150"
              show-overflow-tooltip>
              <template #header>
                <div class="custom-header">
                  <span>{{ $t('assetFile.category') }}</span>
                  <el-icon
                    ref="buttonRef"
                    :class="
                      searchPayload?.docTypeId?.length > 0 || categoryFilterVisible
                        ? 'searchIconIsActive'
                        : ''
                    ">
                    <IconFilter />
                  </el-icon>
                  <el-popover
                    ref="popoverRef"
                    v-model:visible="categoryFilterVisible"
                    popper-class="filterPopper"
                    placement="bottom-start"
                    :virtual-ref="buttonRef"
                    :show-arrow="false"
                    trigger="click"
                    virtual-triggering>
                    <FilterContainr
                      filterType="checkBox"
                      :handelSubFilterProper="handelCategoryFilterProper"
                      :filterList="filterCategoryList"
                      :checkedFilterList="checkedFilterList" />
                  </el-popover>
                </div>
              </template>
              <template #default="scope">
                <span>{{ scope.row.docType.docTypeName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="chunkSize"
              :label="$t('assetFile.chunkSize')"
              sortable
              width="120" />
            <el-table-column
              prop="createdTime"
              class-name="upload-time-cell"
              sortable
              :label="$t('assetFile.uploadTime')"
              width="200"
              @click.stop>
              <template #header>
                <div class="custom-header">
                  <span>{{ $t('assetFile.uploadTime') }}</span>
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
                    time-format="HH:mm"
                    :unlink-panels="true"
                    @change="handleTimeChange"
                    ref="tiemPick"
                    @visible-change="handleVisibleChange" />
                  <el-popover
                    :visible="timeFilterVisible"
                    popper-class="filterPopper timeFilterPo"
                    placement="bottom-start"
                    :show-arrow="false">
                    <template #reference>
                      <el-icon
                        @click="handeDatePickerShow"
                        @click.stop
                        :class="
                          searchPayload?.createdTimeStart?.length > 0 || timeFilterVisible
                            ? 'searchIconIsActive'
                            : ''
                        ">
                        <IconFilter />
                      </el-icon>
                    </template>
                  </el-popover>
                </div>
              </template>
              <template #default="scope">
                <span>{{ convertUTCToLocalTime(scope.row.createdTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="taskStatus"
              :label="$t('assetFile.analyticStatus')"
              width="220">
              <template #header>
                <div class="custom-header">
                  <span>{{ $t('assetFile.analyticStatus') }}</span>
                  <el-icon
                    ref="statusRef"
                    @click.stop
                    :class="
                      searchPayload?.parseStatus?.length > 0 || statusFilterVisible
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
                  v-if="scope.row.docTask?.taskStatus === StatusEnum.FAIL"
                  class="statusFail">
                  {{ $t('assetFile.status.analyticFail') }}
                </div>
                <div
                  v-if="scope.row.docTask?.taskStatus === StatusEnum.SUCCESS"
                  class="statusSuccess">
                  {{ $t('assetFile.status.analyticSucces') }}
                </div>
                <div
                  v-if="scope.row.docTask?.taskStatus === StatusEnum.CANCEL"
                  class="statusCancel">
                  {{ $t('assetFile.status.cancelAnalytic') }}
                </div>
                <div
                  v-if="scope.row.docTask?.taskStatus === StatusEnum.ANALYSIS_ING"
                  class="statusWaitIng">
                  {{ $t('assetFile.status.analyticWaitIng') }}
                </div>
                <div
                  class="statusAnalysis"
                  v-if="scope.row.docTask?.taskStatus === StatusEnum.RUNNING">
                  <div class="percent-box">
                    <el-progress
                      :percentage=" scope.row.docTask?.taskCompleted ?? 0 "
                      :color="customColor"
                      striped
                      striped-flow />
                  </div>
                  <div class="statusAnalysisText">
                    {{ $t('assetFile.status.analyticIng') }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="parseMethod"
              :label="$t('assetFile.parsingMethod')"
              width="150"
              show-overflow-tooltip>
              <template #header>
                <div class="custom-header">
                  <span>{{ $t('assetFile.parsingMethod') }}</span>
                  <el-icon
                    ref="parserMethodRef"
                    :class="
                      searchPayload?.parseMethods?.length > 0 || parserMethodVisible
                        ? 'searchIconIsActive'
                        : ''
                    ">
                    <IconFilter />
                  </el-icon>
                  <el-popover
                    ref="popoverRef"
                    v-model:visible="parserMethodVisible"
                    popper-class="filterPopper"
                    placement="bottom-start"
                    :virtual-ref="parserMethodRef"
                    :show-arrow="false"
                    trigger="click"
                    virtual-triggering>
                    <FilterContainr
                      filterType="checkBox"
                      :handelSubFilterProper="handelParserMethodFilterProper"
                      :filterList="parserMethodOptions"
                      :checkedFilterList="checkedFilterList" />
                  </el-popover>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="finishedTime"
              :label="$t('assetFile.parsingComTime')"
              width="200">
              <template #default="scope">
                <div>
                  {{convertUTCToLocalTime(scope.row.docTask?.finishedTime)}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="enabled"
              :label="$t('btnText.enable')"
              width="120">
              <template #header>
                <div class="custom-header">
                  <span>{{ $t('btnText.enable') }}</span>
                  <el-icon
                    ref="enableRef"
                    @click.stop
                    :class="
                      searchPayload?.enabled?.length > 0 || enableFilterVisible
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
                      :handelSubFilterProper="handelEnableFilterProper"
                      :checkedFilterList="checkedFilterList" />
                  </el-popover>
                </div>
              </template>
              <template #default="scope">
                <el-switch
                  v-model:model-value="scope.row.enabled"
                  @change="handleSwitch(scope.row)"
                  style="--el-switch-on-color: #24ab36; --el-switch-off-color: #c3cedf" />
              </template>
            </el-table-column>
            <el-table-column
              prop="action"
              :label="$t('btnText.operation')"
              width="220"
              fixed="right">
              <template #default="scope">
                <el-button
                  v-if="[StatusEnum.RUNNING,StatusEnum.ANALYSIS_ING].includes(scope.row.status) "
                  text
                  @click="handleRunKl(scope.row, 'cancel')">
                  {{ $t('btnText.cancel') }}
                </el-button>
                <el-button
                  v-if="scope.row.status==='idle'"
                  text
                  @click="handleRunKl(scope.row, 'run')">
                  {{ $t('btnText.analytic') }}
                </el-button>
                <el-button
                  text
                  :disabled="scope.row.status === StatusEnum.RUNNING"
                  @click="handleEditKl(scope.row)">
                  {{ $t('btnText.edit') }}
                </el-button>
                <el-button
                  text
                  @click="handleDownloadFile([scope.row])">
                  {{ $t('btnText.download') }}
                </el-button>
                <el-button
                  :disabled="scope.row.status === StatusEnum.RUNNING"
                  text
                  @click="handleDeleteKl(scope.row)">
                  {{ $t('btnText.delete') }}
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
            @change="handleChangePage" />
        </div>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="dialogImportVisible"
    class="upload-dialog"
    align-center
    :title="$t('btnText.importFile')">
    <Upload
      :singleFileLimit="true"
      :singleFileSize="0.05"
      :tipText="$t('dialogTipText.fileAllFormat')"
      accept=".md,.xlsx,.pdf,.doc,.docx,.txt,.pptx,.html"
      :maxFileNum="128"
      :maxSize="0.488"
      :handleUploadMyFile="handleUploadMyFile"
      :handleQueryTaskList="handleQueryTaskList"
      :handleCancelVisible="handleCancelVisible"
      :taskList="taskList"
      :taskListImportDate="taskListImportDate"
      :toggleUploadNotify="toggleUploadNotify"
      :handleImportLoading="handleImportLoading"
      uploadType="file" />
  </el-dialog>
  <el-dialog
    align-center
    v-model="cancelTipVisible"
    class="tip-dialog cancel-analytic-dialog"
    width="432"
    :title="$t('dialogTipText.tipsText')">
    <div class="delTip">
      <span class="iconAlarmOrange">
        <IconAlarmOrange />
      </span>
      {{ $t('dialogTipText.confirmCancelAnalytic') }}
    </div>
    <div class="tip-ops-btn">
      <el-button
        class="resetBtn"
        @click="handleConfirmFileAnalytic">
        {{ $t('btnText.confirm') }}
      </el-button>
      <el-button
        type="primary"
        class="resetBtn cancelBtn"
        @click="handleCancelVisible">
        {{ $t('btnText.cancel') }}
      </el-button>
    </div>
  </el-dialog>
  <el-dialog
    align-center
    v-model="delTipVisible"
    class="tip-dialog"
    width="400"
    :title="$t('dialogTipText.tipsText')">
    <div class="delTip">
      <span class="iconAlarmOrange">
        <IconAlarmOrange />
      </span>
      <span>
        {{ $t('dialogTipText.confirmDelFile') }}
        <span>
          【
          <span class="delToolTip">
            <TextSingleTootip :content="opsItem.docName" />
          </span>
          】
          {{ userLanguage === 'zh' ? '吗？' : null }}
        </span>
      </span>
    </div>
    <div class="tip-ops-btn">
      <el-button
        class="resetBtn"
        type="primary"
        @click="handleConfirmDleSingle(opsItem)">
        {{ $t('btnText.confirm') }}
      </el-button>
      <el-button
        class="resetBtn cancelBtn"
        @click="handleCancelVisible">
        {{ $t('btnText.cancel') }}
      </el-button>
    </div>
  </el-dialog>
  <el-dialog
    align-center
    v-model="delSelectTipVisible"
    class="tip-dialog"
    width="400"
    :title="$t('dialogTipText.tipsText')">
    <div class="delTip">
      <span class="iconAlarmOrange">
        <IconAlarmOrange />
      </span>
      <span>
        {{ $t('dialogTipText.confirmDelSelected') }}
      </span>
    </div>
    <div class="tip-ops-btn">
      <el-button
        class="resetBtn"
        type="primary"
        @click="handleConfirmDleSelected">
        {{ $t('btnText.confirm') }}
      </el-button>
      <el-button
        class="resetBtn cancelBtn"
        @click="handleCancelVisible">
        {{ $t('btnText.cancel') }}
      </el-button>
    </div>
  </el-dialog>
  <el-dialog
    v-if="dialogEditVisible"
    v-model="dialogEditVisible"
    class="edit-dialog"
    align-center
    width="560"
    :title="$t('dialogTipText.eidtFile')">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="116"
      class="kl-ruleForm kf-ruleForm"
      label-position="left">
      <el-form-item
        :label="$t('assetFile.docName')"
        prop="name"
        class="docName">
        <el-input
          v-model="ruleForm.docName"
          :placeholder="$t('assetLibrary.message.pleasePlace')" />
      </el-form-item>
      <el-form-item
        :label="$t('assetLibrary.analyticMethod')"
        prop="parseMethod">
        <el-select
          v-model="ruleForm.parseMethod"
          :placeholder="$t('assetLibrary.message.pleaseChoose')"
          :teleported="false"
          :suffix-icon="IconCaretDown">
          <el-option
            v-for="item in parserMethodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('assetFile.category')"
        prop="docTypeId">
        <el-select
          v-model="ruleForm.docTypeName"
          popper-class="docTypeClass"
          :placeholder="$t('assetLibrary.message.pleaseChoose')"
          :suffix-icon="IconCaretDown"
          :teleported="false">
          <el-option
            v-for="item in filterCategoryList"
            :key="item.value"
            :label="item.label"
            :value="item.label" >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('assetLibrary.fileChunkSize')"
        prop="szie"
        class="fileChunkSize">
        <el-input-number
          class="config-size"
          v-model="ruleForm.chunkSize"
          :min="512"
          :max="1024" />
        <span class="form-right-tip">（512~1024）</span>
        <div class="editTip">
          <span class="iconAlarmOrange">
            <IconAlarmOrange />
          </span>
          <span class="editTipText">{{ $t('assetFile.analyticTip') }}</span>
        </div>
      </el-form-item>
      <el-form-item class="kl-ops-btn">
        <el-button
          class="resetBtn"
          type="primary"
          :disabled="isSubmitDisabled"
          @click="submitForm(ruleFormRef)">
          {{ $t('btnText.confirm') }}
        </el-button>
        <el-button
          class="resetBtn cancelBtn"
          @click="handleCancelVisible()">
          {{ $t('btnText.cancel') }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <DataSetDialog 
    :selectionFileData="selectionFileData" 
    :generateDialogVisible="generateDialogVisible" 
    :handleGenerateDataSet="handleGenerateDataSet"
    :handleClearSelected="handleClearSelected"s
    />
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
import UploadProgress from '@/components/Upload/uploadProgress.vue';
import '@/styles/knowledgeFile.scss';
import {
  IconAlarmOrange,
  IconCaretDown,
  IconCaretUp,
  IconFilter,
  IconSearch,
  IconSuccess,
} from '@computing/opendesign-icons';
import { StatusEnum, MenuType } from '@/enums/KnowledgeEnum';
import FilterContainr from '@/components/TableFilter/index.vue';
const { t } = useI18n();
import { type FormInstance } from 'element-plus';
import KfAppAPI from '@/api/kfApp';
import { DocListRequest } from '@/api/apiType';
import KbAppAPI from '@/api/kbApp';
import CustomLoading from '@/components/CustomLoading/index.vue';
import { convertUTCToLocalTime, uTCToLocalTime } from '@/utils/convertUTCToLocalTime';

import { FileForm, DocumentType } from './fileConfig';
import router from '@/router';
import { useGroupStore } from '@/store/modules/group';
import DataSetDialog from './dataSetDialog.vue';
import { downloadFun } from '@/utils/downloadFun';

const route = useRoute();
const dialogImportVisible = ref(false);
const customColor = ref('#0077FF');
const menuType = ref('klFile');
const buttonRef = ref();
const created_time = ref();
const statusRef = ref();
const popoverRef = ref();
const enableRef = ref();
const parserMethodRef = ref();
const tiemPick = ref();
const inputSearchRef = ref();
const categoryFilterVisible = ref(false);
const timeFilterVisible = ref(false);
const statusFilterVisible = ref(false);
const fileFilterVisible = ref(false);
const enableFilterVisible = ref(false);
const parserMethodVisible = ref(false);
const cancelTipVisible = ref(false);
const delTipVisible = ref(false);
const delSelectTipVisible = ref(false);
const batchDownBth = ref(false);
const opsItem = ref();
const multipleTable = ref();
const selectionFileData = ref<any[]>([]);
const importTaskTotal = ref(0);
const checkTableSelecData = ref<any[]>([]);
const generateDialogVisible = ref(false);
const searchPayload = ref<any>({
  docName: '',
  docTypeId: [],
  chunkSizeOrder: '',
  createdTimeOrder: '',
  parseStatus: [],
  createdTimeStart: '',
  createdTimeEnd: '',
  enabled: '',
  parseMethods: [],
});
const kbInfo = ref<any>({});
const checkedFilterList = ref([]);
const filterCategoryList = ref<DocumentType[]>([]);
const pollingKfTimer = ref();
const filterStatusList = ref();
const filterEnableList = ref();
const ruleFormRef = ref<FormInstance>();
const pagination = ref({
  pageSizes: [10, 20, 30, 40, 50],
  layout: 'total,sizes,prev,pager,next,jumper',
});
const currentPage = ref(1);
const totalCount = ref(0);
const currentPageSize = ref(20);
const dialogEditVisible = ref(false);
const loading = ref(false);
const taskListImportDate = ref();
const taskTimer = ref();
const taskList = ref<any>([]);
const uploadTaskListData = ref<{
  showUploadNotify?: boolean;
  uploadingList?: Array<any>;
  showTaskList?: boolean;
  handleShowTaskList?: Function;
  handleUploadRestart?: Function;
}>({});
const parserMethodOptions = ref<any>([]);
const userLanguage = ref();
const isSubmitDisabled = ref(true);
const isGenerateDataSet = computed(()=>{
  const arr = selectionFileData.value.filter((item:any) => {
    return item.docTask?.taskStatus === 'success';
  })
  return arr.length > 0;
})
const ruleForm = ref<FileForm>({
  docId: '',
  docName: '',
  docTypeId: '',
  parseMethod: '',
  chunkSize: 1024,
});
const store = useGroupStore();
const { knowledgeTabActive,curTeamInfo } = storeToRefs(store);
const rules = reactive({
  docName: [
    {
      required: true,
      message: t('assetFile.message.name'),
      trigger: ['blur', 'change'],
    },
    {
      min: 1,
      message: t('assetFile.message.docNameLen'),
      trigger: ['blur', 'change'],
    },
  ],
});
const shortcuts = ref();

const fileTableList = reactive<{
  data: Array<any>;
}>({
  data: [],
});

watch(
  () => t(''),
  () => {
    filterStatusList.value = [
      {
        label: t('assetFile.status.analyticFail'),
        value: StatusEnum.FAIL,
      },
      {
        label: t('assetFile.status.analyticSucces'),
        value: StatusEnum.SUCCESS,
      },
      {
        label: t('assetFile.status.cancelAnalytic'),
        value: StatusEnum.CANCEL,
      },
      {
        label: t('assetFile.status.analyticWaitIng'),
        value: StatusEnum.ANALYSIS_ING,
      },
      {
        label: t('assetFile.status.analyticIng'),
        value: StatusEnum.RUNNING,
      },
    ];
    filterEnableList.value = [
      { label: t('assetFile.open'), value: 'true' },
      { label: t('assetFile.close'), value: 'false' },
    ];
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

watch(
  () => ruleForm.value.docName,
  () => {
    isSubmitDisabled.value = !ruleForm.value.docName?.length;
  },
  {
    deep: true,
    immediate: true,
  }
);

const handleBatchDownBth = (e: boolean) => {
  batchDownBth.value = e;
};

const handleSearchPayload = () => {
  const searchParams = Object.keys(searchPayload.value || {}).reduce((pre: any, item) => {
    if (searchPayload.value?.[item]?.length > 0 && searchPayload.value?.[item] !== 'all') {
      pre[item] = searchPayload.value[item];
      if (item === 'enabled') {
        pre[item] = JSON.parse(searchPayload.value[item]);
      }
    }

    return pre;
  }, {});
  return searchParams || {};
};

const handelCategoryFilterProper = (filterList: any) => {
  searchPayload.value.docTypeId = filterList;
  handleSearchData();
};

const handelStatusFilterProper = (filterList: any) => {
  searchPayload.value.parseStatus = filterList;
  handleSearchData();
};
const handelEnableFilterProper = (filterList: any) => {
  searchPayload.value.enabled = filterList.length === 2 ? 'all' : filterList[0];
  handleSearchData();
};

const handelParserMethodFilterProper = (filterList: any) => {
  searchPayload.value.parseMethods = filterList;
  handleSearchData();
};

const handleRunKl = (row: any, type: string) => {
  if (type === 'cancel') {
    cancelTipVisible.value = true;
    opsItem.value = row;
  } else {
    KfAppAPI.runLibraryFile({
      parse: true,
    },[row.docId]).then(() => {
      ElMessage({
        showClose: true,
        message: t('opsMessage.opsAnalyticIng'),
        icon: IconSuccess,
        customClass: 'o-message--success',
        duration: 3000,
      });
      handleSearchOpsData(true, true);
    });
  }
};

const handleConfirmFileAnalytic = () => {
  KfAppAPI.runLibraryFile({
    parse: false,
  },[opsItem.value.docId]).then(() => {
    ElMessage({
      showClose: true,
      message: t('opsMessage.opsCancel'),
      icon: IconSuccess,
      customClass: 'o-message--success',
      duration: 3000,
    });
    handleSearchOpsData(true, true);
    handleCancelVisible();
  });
};

const handCheckTableData = (tableList:any) => {
  checkTableSelecData.value = tableList.filter((checkItem:any) => {
    const selecData = tableList.find((notCheckItem:any) => notCheckItem?.docId === checkItem?.docId);
    return selecData && ['pending', 'running'].includes(selecData.task?.taskStatus);
  });
};

const handeAssetLibraryData = (
  payload: DocListRequest,
  loadingStatus: boolean,
  pollTimer: boolean
) => {
  if (pollTimer) {
    handleCleartTimer();
  }
  loading.value = loadingStatus;
  KfAppAPI.getKbLibraryFile(payload)
    .then((res: any) => {
      if (res.documents?.length) {
        handCheckTableData(res.documents);
      }
      if (!res?.documents?.length && currentPage.value && currentPage.value !== 1) {
        currentPage.value = 1;
        handleSearchOpsData(true, true);
        return;
      }
      fileTableList.data = res?.documents || [];
      currentPage.value = res.page;
      currentPageSize.value = res.pageSize;
      totalCount.value = res.total;
      if (pollTimer) {
        handleStartPollTimer();
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const handlePollAssetFileData = () => {
  KfAppAPI.getKbLibraryFile({
    page: currentPage.value,
    pageSize: currentPageSize.value,
    kbId: route.query.kb_id as string,
    ...handleSearchPayload(),
    ...sortFilter.value,
  })
    .then((res: any) => {
      if (res.page === currentPage.value && fileTableList.data?.length) {
        if (!res?.documents?.length && currentPage.value !== 1) {
          currentPage.value = 1;
          handleSearchOpsData(true, true);
          return;
        }
        fileTableList.data = fileTableList.data.map((item) => {
          let fileData = res?.documents?.filter((file: any) => file.docId === item.docId)?.[0];
          return fileData || item;
        });
      }
      if (res.documents?.length) {
        handCheckTableData(res.documents);
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const hanldeSearhNameFilter = (filterName: string) => {
  searchPayload.value.docName = filterName;
  handleSearchData();
};
const groupStore = useGroupStore();
const { navGroup } = storeToRefs(groupStore);
const handleJumpFileSection = async (row: any) => {
  await router.push({
    path: '/documentInfo',
    query: {
      kb_id: route.query.kb_id,
      file_id: row.docId,
    },
  });
  let groupNav = navGroup.value;
  groupNav[3] = {
    name: row.docName,
    path: '/documentInfo',
    query: {
      kb_id: route.query.kb_id,
      file_id:row.docId,
    },
  };
};

const handleSearchData = () => {
  handeAssetLibraryData(
    {
      page: 1,
      pageSize: currentPageSize.value ?? 20,
      kbId: route.query.kb_id as string,
      ...handleSearchPayload(),
      ...sortFilter.value,
    },
    true,
    true
  );
  fileFilterVisible.value = false;
  categoryFilterVisible.value = false;
  enableFilterVisible.value = false;
  statusFilterVisible.value = false;
  parserMethodVisible.value = false;
};

const handleQueryKbData = () => {
  const kbId = route.query.kb_id;
  curTeamInfo
  const teamId = localStorage.getItem('teamId') ?? '';
  KbAppAPI.getKbLibrary({
    teamId,
    kbId: kbId,
    page: 1,
    pageSize: 10,
  }).then((res: any) => {
    kbInfo.value = res.kbList?.[0] || {};
    let categoryList = JSON.parse(
      JSON.stringify(Array.from(new Set(res.kbList?.[0]?.docTypes)) || '[]')
    );
    filterCategoryList.value = [
      ...categoryList.map((item: { type: string; docId: string }) => {
        return {
          label: item.type,
          value: item.docId,
        };
      }),
      {
        label: 'default',
        value: '00000000-0000-0000-0000-000000000000',
      },
    ].filter((item) => item?.label?.length > 0);
  });
};

const handleStartPollTimer = () => {
  pollingKfTimer.value = setInterval(() => handlePollAssetFileData(), 15000);
};
// 添加postMessage监听器
const handleMessage = (event: MessageEvent) => {
  if(event.data?.type!=='changeActive'){
    return;
  }
  if (event.data && typeof event.data.StopActive !== 'undefined') {
    if (event.data.StopActive) {
      handleCleartTimer();
    } else {
      handleStartPollTimer();
    }
  }
};
watch(()=>knowledgeTabActive.value,()=>{
  if(knowledgeTabActive.value === 'document'){
    const kbId = route.query.kb_id;
    handeAssetLibraryData(
      {
        kbId: kbId as string,
        page: 1,
        pageSize: 20,
      },
      true,
      true
    );
  }else{
    handleCleartTimer();
  }
})
onMounted(() => {
  const kbId = route.query.kb_id;
  if (kbId?.length && knowledgeTabActive.value === 'document' ) {
  handleQueryKbData();
  handeAssetLibraryData(
      {
        kbId: kbId as string,
        page: 1,
        pageSize: 20,
      },
      true,
      true
    );
    KbAppAPI.queryParseMethodList().then((res: any) => {
      parserMethodOptions.value = res?.map((item: any) => {
        return { label: item, value: item };
      });
    });
  }
  document.addEventListener('click', () => handleDateTimerange);
  
  // 添加postMessage事件监听
  window.addEventListener('message', handleMessage);
});

const handleCleartTimer = () => {
  clearInterval(pollingKfTimer.value);
  pollingKfTimer.value = null;
};

onUnmounted(() => {
  handleCleartTimer();
  // 移除postMessage事件监听
  window.removeEventListener('message', handleMessage);
  taskTimer.value = null;
});

const handleVisibleChange = (e: boolean) => {
  timeFilterVisible.value = e;
};

const handeDatePickerShow = (e: { pageX: string; pageY: string }) => {
  timeFilterVisible.value = true;
  tiemPick.value.handleOpen();
  let dateTimerContainer = document.querySelector('.datetimerangeClass') as HTMLElement;
  if (dateTimerContainer) {
    dateTimerContainer.style.position = 'absolute';
    dateTimerContainer.style.left = e.pageX + 'px';
    dateTimerContainer.style.top = e.pageY + 'px';
  }
};

const handleDateTimerange = (e: { target: Node | null }) => {
  const dateTimeContainer = document.querySelector('.datetimerangeClass');
  const timeFilterPo = document.querySelector('.timeFilterPo');
  if (dateTimeContainer) {
    if (!dateTimeContainer.contains(e.target) && !timeFilterPo?.contains(e.target)) {
      timeFilterVisible.value = false;
    }
  }
};

const handleTimeChange = (e: (string | undefined)[]) => {
  searchPayload.value.createdTimeStart = e?.[0] ? uTCToLocalTime(e?.[0]) : '';
  searchPayload.value.createdTimeEnd = e?.[1] ? uTCToLocalTime(e?.[1]) : '';
  handleSearchOpsData(true, true);
  handleCancelVisible();
};

const handleSearchOpsData = (loadingStatus: boolean, startPollTimer: boolean) => {
  handeAssetLibraryData(
    {
      page: currentPage.value,
      pageSize: currentPageSize.value,
      kbId: route.query.kb_id as string,
      ...handleSearchPayload(),
      ...sortFilter.value,
    },
    loadingStatus,
    startPollTimer
  );
};

const handleSwitch = (row: any) => {
  KfAppAPI.updateLibraryFile({docId: row.docId},{
    docName: row.docName,
    docTypeId: row.docTypeId,
    chunkSize: row.chunkSize,
    parseMethod: row.parseMethod,
    enabled: row.enabled,
  }).then(() => {
    ElMessage({
      showClose: true,
      message: t('opsMessage.opsSuccess'),
      icon: IconSuccess,
      customClass: 'o-message--success',
      duration: 3000,
    });
    handleSearchOpsData(true, true);
  });
};

const handleImportKnowledge = () => {
  dialogImportVisible.value = true;
};

const handleCancelVisible = () => {
  dialogImportVisible.value = false;
  delTipVisible.value = false;
  delSelectTipVisible.value = false;
  dialogEditVisible.value = false;
  cancelTipVisible.value = false;
  timeFilterVisible.value = false;
};

const handleSelectionChange = (newSelection: any[]) => {
  selectionFileData.value = newSelection || [];
};

const handleDeleteKl = (row: any) => {
  opsItem.value = row;
  delTipVisible.value = true;
};

const handleSelectDeleteKl = () => {
  delSelectTipVisible.value = true;
};

const handleSelectRunKl = () => {
  checkTableSelecData.value = selectionFileData.value;
  const ids = selectionFileData.value.map((item) => item.docId);
  KfAppAPI.runLibraryFile({parse:true},ids).then(() => {
    ElMessage({
      showClose: true,
      message: t('opsMessage.opsAnalyticIng'),
      icon: IconSuccess,
      customClass: 'o-message--success',
      duration: 3000,
    });
    selectionFileData.value = [];
    multipleTable.value.clearSelection();
    handleSearchOpsData(true, true);
  });
};

const handleConfirmDleSingle = (row: any) => {
  KfAppAPI.delLibraryFile([row.docId]).then(() => {
    ElMessage({
      showClose: true,
      message: t('opsMessage.delSuccess'),
      icon: IconSuccess,
      customClass: 'o-message--success',
      duration: 3000,
    });
    let selectData = JSON.parse(JSON.stringify(selectionFileData.value));
    selectData = selectData
      .filter((item: any) => item.docId !== row.docId)
      .filter((item: { docId: any }) => item?.docId);
    if (selectData?.length > 0) {
      selectData.forEach((item: { docId: any }) => {
        multipleTable.value.toggleRowSelection(item.docId);
      });
      selectionFileData.value = selectData;
    } else {
      multipleTable.value.clearSelection();
    }

    handleSearchOpsData(true, true);
    handleCancelVisible();
  });
};

const handleConfirmDleSelected = () => {
  delSelectTipVisible.value = false;
  loading.value = true;
  handleCleartTimer();
  let ids=selectionFileData.value.map((item) => {
      return item.docId;
    })
  KfAppAPI.delLibraryFile(ids)
    .then(() => {
      ElMessage({
        showClose: true,
        message: t('opsMessage.delSuccess'),
        icon: IconSuccess,
        customClass: 'o-message--success',
        duration: 3000,
      });
      currentPage.value = 1;
      handleSearchOpsData(true, true);
      handleCancelVisible();
      selectionFileData.value = [];
      multipleTable.value.clearSelection();
    })
    .catch(() => {
      handleStartPollTimer();
    }).finally(()=>{
      loading.value = false;
    })
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      KfAppAPI.updateLibraryFile({
        docId: ruleForm.value.docId
      },{
        ...ruleForm.value,
        docTypeId: ruleForm.value.docTypeId,
        docTypeName: ruleForm.value.docTypeName,
      }).then(() => {
        ElMessage({
          showClose: true,
          message: t('opsMessage.modifSuccess'),
          icon: IconSuccess,
          customClass: 'o-message--success',
          duration: 3000,
        });
        handleSearchOpsData(true, true);
        dialogEditVisible.value = false;
      });
    }
  });
};

const handleEditKl = (row: any) => {
  ruleForm.value.docId = row.docId;
  ruleForm.value.docName = row.docName;
  ruleForm.value.chunkSize = row.chunkSize || 1024;
  ruleForm.value.parseMethod = row.parseMethod;
  ruleForm.value.docTypeId = JSON.parse(JSON.stringify(row.docType.docTypeId));
  ruleForm.value.docTypeName = JSON.parse(JSON.stringify(row.docType.docTypeName));
  dialogEditVisible.value = true;
};

const handleChangePage = (pageNum: number, pageSize: number) => {
  currentPage.value = pageNum;
  currentPageSize.value = pageSize;
  handleSearchOpsData(true, true);
};

const sortFilter = ref({});
const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  let sortKey = data.prop === 'chunkSize' ? 'chunkSizeOrder' : 'createdTimeOrder';
  let sortValue = data.order ? (data.order === 'ascending' ? 'asc' : 'desc') : null;
  sortFilter.value = sortValue
    ? {
        [sortKey]: sortValue,
      }
    : {};
  handleSearchOpsData(true, true);
};

const handleQueryTaskList = () => {
  handleSearchOpsData(true, false);
};

const handleImportLoading = (loadingStatus: boolean) => {
  loading.value = loadingStatus;
};

const toggleUploadNotify = (uploadTaskPayload: any) => {
  importTaskTotal.value = uploadTaskPayload.uploadingList.length;
  uploadTaskListData.value = uploadTaskPayload;
};

const handleUploadMyFile = (options: any) => {
  KfAppAPI.importKbLibraryFile(
    {
      data: {
        docs: options.file.raw,
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

const handleDownloadFile = async (downloadData: any) => {
  for (const item of downloadData) {
    const url = `${window.origin}/witchaind/api/doc/download?docId=${item.docId}`;
    downloadFun(url);
    await new Promise((resolve) => setTimeout(resolve, 333)); // 添加延迟
  }
};

const checkSelecTable = (row) => {
  return checkTableSelecData.value.every((item) => item?.docId !== row?.docId);
};

const handleGenerateDataSet = (visible: boolean) => {
  let flag = true;
  selectionFileData.value.forEach((item) => {
    if (item.docTask?.taskStatus !== 'success') {
      flag = false;
    }
  });
  if (!flag) {
    ElMessage.error('只有【解析成功】状态的文档可以生成数据集！');
    return;
  }
  generateDialogVisible.value = visible;
};

const handleClearSelected = ()=>{
  checkTableSelecData.value = [];
  multipleTable.value.clearSelection();
}
</script>
