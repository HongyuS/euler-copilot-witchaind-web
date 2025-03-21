<template>
  <div class="page-platform-header">
    <HeaderBar />
  </div>
  <CustomLoading :loading="loading" />
  <div class="kf-container">
    <div class="kf-container-top">
      <div class="kf-left-menu">
        <el-link
          @click="handleJumpHome"
          type="primary"
          target="_blank"
          class="home-menu"
          :underline="false"
        >
          {{ $t("btnText.homePage") }}
        </el-link>
        <div>/</div>
        <div class="kf-name">
          <TextTooltip :content="kbInfo.name" />
        </div>
      </div>
      <div class="kf-right-title">
        {{
          menuType === MenuType.KL_FILE
            ? $t("btnText.assetDocList")
            : $t("btnText.configInfo")
        }}
      </div>
    </div>
    <div class="kf-container-action">
      <div class="kf-container-left">
        <div
          class="kf-file-btn"
          :class="menuType === MenuType.KL_FILE ? 'kf-ops-btn' : ''"
          @click="handleChangeMenu(MenuType.KL_FILE)"
        >
          {{ $t("btnText.assetDocList") }}
        </div>
        <div
          class="kf-file-config"
          :class="menuType === MenuType.KL_CONFIG ? 'kf-ops-btn' : ''"
          @click="handleChangeMenu(MenuType.KL_CONFIG)"
        >
          {{ $t("btnText.configInfo") }}
        </div>
      </div>
      <div class="kf-container-right" v-if="menuType === MenuType.KL_FILE">
        <div class="kf-container-table-ops">
          <el-button
            type="primary"
            style="margin-right: 24px"
            @click="handleImportKnowledge"
            class="importFileBtn"
          >
            {{ $t("btnText.importFile") }}
          </el-button>
          <el-dropdown
            placement="bottom"
            popper-class="dropdown-container kf-ops-dowlon"
            @visible-change="handleBatchDownBth"
          >
            <el-button :class="batchDownBth ? 'upBtn' : 'downBtn'">
              {{ $t("btnText.batchDown") }}
              <el-icon class="el-icon--right" v-if="!batchDownBth">
                <IconCaretDown />
              </el-icon>
              <el-icon
                class="el-icon--right el-icon--caretup"
                v-if="batchDownBth"
              >
                <IconCaretUp />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  @click="handleDownloadFile(fileTableList.data)"
                >
                  {{ $t("btnText.downloadAll") }}
                </el-dropdown-item>
                <el-dropdown-item
                  :disabled="!(selectionFileData.length > 0)"
                  @click="handleDownloadFile(selectionFileData)"
                >
                  {{ $t("btnText.downloadChoose") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button
            class="delFileBtn"
            :disabled="!(selectionFileData.length > 0)"
            @click="handleSelectRunKl"
          >
            {{ $t("btnText.analytic") }}
          </el-button>
          <el-button
            class="delFileBtn cancelBtn"
            :disabled="!(selectionFileData.length > 0)"
            @click="handleSelectDeleteKl"
          >
            {{ $t("btnText.delete") }}
          </el-button>
        </div>
        <div class="kf-container-table-box">
          <el-table
            :data="fileTableList.data"
            class="fileTableContainer"
            cell-calss-name="tableCell"
            :row-key="(row) => row.id"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
            ref="multipleTable"
            :border="true"
          >
            <el-table-column
              type="selection"
              :fixed="true"
              class-name="kl-selection"
              width="35"
              :reserve-selection="true"
            />
            <el-table-column
              prop="name"
              :label="$t('assetFile.docName')"
              show-overflow-tooltip
              :fixed="true"
              class-name="kl-name"
              min-width="150"
            >
              <template #header>
                <div class="custom-header">
                  <span>{{ $t("assetFile.docName") }}</span>
                  <el-icon
                    ref="inputSearchRef"
                    :class="
                      searchPayload?.name?.length > 0 || fileFilterVisible
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
                      v-model:serachName="searchPayload.name"
                      :hanldeSearhNameFilter="hanldeSearhNameFilter"
                      :searchPayload="searchPayload"
                    />
                  </el-popover>
                </div>
              </template>
              <template #default="scope">
                <span
                  class="kf-name-row"
                  @click="handleJumpFileSection(scope.row)"
                >
                  {{ scope.row.name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="document_type"
              :label="$t('assetFile.category')"
              width="150"
              show-overflow-tooltip
            >
              <template #header>
                <div class="custom-header">
                  <span>{{ $t("assetFile.category") }}</span>
                  <el-icon
                    ref="buttonRef"
                    :class="
                      searchPayload?.document_type_list?.length > 0 ||
                      categoryFilterVisible
                        ? 'searchIconIsActive'
                        : ''
                    "
                  >
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
                    virtual-triggering
                  >
                    <FilterContainr
                      filterType="checkBox"
                      :handelSubFilterProper="handelCategoryFilterProper"
                      :filterList="filterCategoryList"
                      :checkedFilterList="checkedFilterList"
                    />
                  </el-popover>
                </div>
              </template>
              <template #default="scope">
                <span>{{ scope.row.document_type.type }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="chunk_size"
              :label="$t('assetFile.chunkSize')"
              sortable
              width="120"
            />
            <el-table-column
              prop="created_time"
              class-name="upload-time-cell"
              sortable
              :label="$t('assetFile.uploadTime')"
              width="200"
              @header-click="handleHeaderClick"
              @click.stop
            >
              <template #header>
                <div class="custom-header">
                  <span>{{ $t("assetFile.uploadTime") }}</span>
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
                          searchPayload?.created_time_start?.length > 0 ||
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
              prop="status"
              :label="$t('assetFile.analyticStatus')"
              width="220"
            >
              <template #header>
                <div class="custom-header">
                  <span>{{ $t("assetFile.analyticStatus") }}</span>
                  <el-icon
                    ref="statusRef"
                    @click.stop
                    :class="
                      searchPayload?.status?.length > 0 || statusFilterVisible
                        ? 'searchIconIsActive'
                        : ''
                    "
                  >
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
                    virtual-triggering
                  >
                    <FilterContainr
                      filterType="checkBox"
                      :filterList="filterStatusList"
                      :handelSubFilterProper="handelStatusFilterProper"
                      :checkedFilterList="checkedFilterList"
                    />
                  </el-popover>
                </div>
              </template>
              <template #default="scope">
                <div
                  v-if="scope.row.task.status === StatusEnum.FAIL"
                  class="statusFail"
                >
                  {{ $t("assetFile.status.analyticFail") }}
                </div>
                <div
                  v-if="scope.row.task.status === StatusEnum.SUCCESS"
                  class="statusSuccess"
                >
                  {{ $t("assetFile.status.analyticSucces") }}
                </div>
                <div
                  v-if="scope.row.task.status === StatusEnum.CANCEL"
                  class="statusCancel"
                >
                  {{ $t("assetFile.status.cancelAnalytic") }}
                </div>
                <div
                  v-if="scope.row.task.status === StatusEnum.ANALYSIS_ING"
                  class="statusWaitIng"
                >
                  <div class="icon-box icon-loading"></div>
                  {{ $t("assetFile.status.analyticWaitIng") }}
                </div>
                <div
                  class="statusAnalysis"
                  v-if="scope.row.task.status === StatusEnum.RUNNING"
                >
                  <div class="percent-box">
                    <el-progress
                      :percentage="
                        scope.row.task?.reports?.[0]?.current_stage &&
                        scope.row.task?.reports?.[0]?.stage_cnt
                          ? Math.floor(
                              ((scope.row.task?.reports?.[0]?.current_stage ||
                                0) /
                                (scope.row.task?.reports?.[0]?.stage_cnt ||
                                  0)) *
                                100
                            )
                          : 0
                      "
                      :color="customColor"
                      striped
                      striped-flow
                    />
                  </div>
                  <div class="statusAnalysisText">
                    {{ $t("assetFile.status.analyticIng") }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="parser_method"
              :label="$t('assetFile.parsingMethod')"
              width="150"
              show-overflow-tooltip
            >
              <template #header>
                <div class="custom-header">
                  <span>{{ $t("assetFile.parsingMethod") }}</span>
                  <el-icon
                    ref="parserMethodRef"
                    :class="
                      searchPayload?.parser_method?.length > 0 ||
                      parserMethodVisible
                        ? 'searchIconIsActive'
                        : ''
                    "
                  >
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
                    virtual-triggering
                  >
                    <FilterContainr
                      filterType="checkBox"
                      :handelSubFilterProper="handelParserMethodFilterProper"
                      :filterList="parserMethodOptions"
                      :checkedFilterList="checkedFilterList"
                    />
                  </el-popover>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              :label="$t('assetFile.parsingComTime')"
              width="200"
            >
              <template #default="scope">
                <div>
                  {{
                    scope?.row?.task?.status === "success" &&
                    scope?.row?.task?.reports?.[0]?.create_time
                      ? convertUTCToLocalTime(
                          scope?.row?.task?.reports?.[0]?.create_time
                        )
                      : "--"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="enabled"
              :label="$t('btnText.enable')"
              width="120"
            >
              <template #header>
                <div class="custom-header">
                  <span>{{ $t("btnText.enable") }}</span>
                  <el-icon
                    ref="enableRef"
                    @click.stop
                    :class="
                      searchPayload?.enabled?.length > 0 || enableFilterVisible
                        ? 'searchIconIsActive'
                        : ''
                    "
                  >
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
                    virtual-triggering
                  >
                    <FilterContainr
                      :filterList="filterEnableList"
                      filterType="checkBox"
                      :handelSubFilterProper="handelEnableFilterProper"
                      :checkedFilterList="checkedFilterList"
                    />
                  </el-popover>
                </div>
              </template>
              <template #default="scope">
                <el-switch
                  v-model:model-value="scope.row.enabled"
                  @change="handleSwitch(scope.row)"
                  style="
                    --el-switch-on-color: #24ab36;
                    --el-switch-off-color: #c3cedf;
                  "
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="action"
              :label="$t('btnText.operation')"
              width="220"
              fixed="right"
            >
              <template #default="scope">
                <el-button
                  v-if="scope.row.status === StatusEnum.RUNNING"
                  text
                  @click="handleRunKl(scope.row, 'cancel')"
                >
                  {{ $t("btnText.cancel") }}
                </el-button>
                <el-button
                  v-if="
                    [
                      StatusEnum.FAIL,
                      StatusEnum.CANCEL,
                      StatusEnum.ANALYSIS_ING,
                      StatusEnum.SUCCESS,
                    ].includes(scope.row.status)
                  "
                  text
                  @click="handleRunKl(scope.row, 'run')"
                >
                  {{ $t("btnText.analytic") }}
                </el-button>
                <el-button
                  text
                  :disabled="scope.row.status === StatusEnum.RUNNING"
                  @click="handleEditKl(scope.row)"
                >
                  {{ $t("btnText.edit") }}
                </el-button>
                <el-button text @click="handleDownloadFile([scope.row])">
                  {{ $t("btnText.download") }}
                </el-button>
                <el-button
                  :disabled="scope.row.status === StatusEnum.RUNNING"
                  text
                  @click="handleDeleteKl(scope.row)"
                >
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
      <div
        class="kf-container-right kf-container-form"
        v-if="menuType === MenuType.KL_CONFIG"
      >
        <KnowledgeForm
          :configInfo="true"
          :formData="kbInfo"
          :handleQueryKbData="handleQueryKbData"
        />
      </div>
    </div>
  </div>
  <el-dialog
    v-model="dialogImportVisible"
    class="upload-dialog"
    align-center
    :title="$t('btnText.importFile')"
  >
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
      uploadType="file"
    />
  </el-dialog>
  <el-dialog
    align-center
    v-model="cancelTipVisible"
    class="tip-dialog"
    width="432"
    :title="$t('dialogTipText.tipsText')"
  >
    <div class="delTip">
      <span class="iconAlarmOrange"><IconAlarmOrange /></span>
      {{ $t("dialogTipText.confirmCancelAnalytic") }}
    </div>
    <div class="tip-ops-btn">
      <el-button class="resetBtn" @click="handleConfirmFileAnalytic">
        {{ $t("btnText.confirm") }}
      </el-button>
      <el-button
        type="primary"
        class="resetBtn cancelBtn"
        @click="handleCancelVisible"
      >
        {{ $t("btnText.cancel") }}
      </el-button>
    </div>
  </el-dialog>
  <el-dialog
    align-center
    v-model="delTipVisible"
    class="tip-dialog"
    width="400"
    :title="$t('dialogTipText.tipsText')"
  >
    <div class="delTip">
      <span class="iconAlarmOrange"><IconAlarmOrange /></span>
      <span>
        {{ $t("dialogTipText.confirmDelFile") }}
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
      <el-button
        class="resetBtn"
        type="primary"
        @click="handleConfirmDleSingle(opsItem)"
      >
        {{ $t("btnText.confirm") }}
      </el-button>
      <el-button class="resetBtn cancelBtn" @click="handleCancelVisible">
        {{ $t("btnText.cancel") }}
      </el-button>
    </div>
  </el-dialog>
  <el-dialog
    align-center
    v-model="delSelectTipVisible"
    class="tip-dialog"
    width="400"
    :title="$t('dialogTipText.tipsText')"
  >
    <div class="delTip">
      <span class="iconAlarmOrange"><IconAlarmOrange /></span>
      <span>
        {{ $t("dialogTipText.confirmDelSelected") }}
      </span>
    </div>
    <div class="tip-ops-btn">
      <el-button
        class="resetBtn"
        type="primary"
        @click="handleConfirmDleSelected"
      >
        {{ $t("btnText.confirm") }}
      </el-button>
      <el-button class="resetBtn cancelBtn" @click="handleCancelVisible">
        {{ $t("btnText.cancel") }}
      </el-button>
    </div>
  </el-dialog>
  <el-dialog
    v-if="dialogEditVisible"
    v-model="dialogEditVisible"
    class="edit-dialog"
    align-center
    width="560"
    :title="$t('dialogTipText.eidtFile')"
  >
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="116"
      class="kl-ruleForm kf-ruleForm"
      label-position="left"
    >
      <el-form-item
        :label="$t('assetFile.docName')"
        prop="name"
        class="docName"
      >
        <el-input
          v-model="ruleForm.name"
          :placeholder="$t('assetLibrary.message.pleasePlace')"
        />
      </el-form-item>
      <el-form-item
        :label="$t('assetLibrary.analyticMethod')"
        prop="parser_method"
      >
        <el-select
          v-model="ruleForm.parser_method"
          :placeholder="$t('assetLibrary.message.pleaseChoose')"
          :teleported="false"
          :suffix-icon="IconCaretDown"
        >
          <el-option
            v-for="item in parserMethodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('assetFile.category')" prop="type_id">
        <el-select
          v-model="ruleForm.type_id"
          popper-class="docTypeClass"
          :placeholder="$t('assetLibrary.message.pleaseChoose')"
          :suffix-icon="IconCaretDown"
          :teleported="false"
        >
          <el-option
            v-for="item in filterCategoryList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('assetLibrary.fileChunkSize')"
        prop="szie"
        class="fileChunkSize"
      >
        <el-input-number
          class="config-size"
          v-model="ruleForm.chunk_size"
          :min="512"
          :max="1024"
        />
        <span class="form-right-tip">（512~1024）</span>
        <div class="editTip">
          <span class="iconAlarmOrange"><IconAlarmOrange /></span>
          <span class="editTipText">{{ $t("assetFile.analyticTip") }}</span>
        </div>
      </el-form-item>
      <el-form-item class="kl-ops-btn">
        <el-button
          class="resetBtn"
          type="primary"
          :disabled="isSubmitDisabled"
          @click="submitForm(ruleFormRef)"
        >
          {{ $t("btnText.confirm") }}
        </el-button>
        <el-button class="resetBtn cancelBtn" @click="handleCancelVisible()">
          {{ $t("btnText.cancel") }}
        </el-button>
      </el-form-item>
    </el-form>
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
    :isShowAllClear="false"
  />
</template>
<script setup lang="ts">
import HeaderBar from "@/components/UserHeaderBar/headerCom.vue";
import UploadProgress from "@/components/Upload/uploadProgress.vue";
import "@/styles/knowledgeFile.scss";
import {
  IconAlarmOrange,
  IconCaretDown,
  IconCaretUp,
  IconFilter,
  IconSearch,
  IconSuccess,
} from "@computing/opendesign-icons";
import { StatusEnum, MenuType } from "@/enums/KnowledgeEnum";
import KnowledgeForm from "@/components/KnowledgeForm/index.vue";
import FilterContainr from "@/components/TableFilter/index.vue";
const { t } = useI18n();
import { ElLoading, type FormInstance, type FormRules } from "element-plus";
import KfAppAPI from "@/api/kfApp";
import { DocListRequest } from "@/api/apiType";
import KbAppAPI from "@/api/kbApp";
import TextTooltip from "@/components/TextSingleTootip/index.vue";

import CustomLoading from "@/components/CustomLoading/index.vue";
import {
  convertUTCToLocalTime,
  uTCToLocalTime,
} from "@/utils/convertUTCToLocalTime";

import { FileForm, DocumentType } from "./fileConfig";

const router = useRouter();
const route = useRoute();
const dialogImportVisible = ref(false);
const customColor = ref("#0077FF");
const menuType = ref("klFile");
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
const searchPayload = ref<any>({
  name: "",
  document_type_list: [],
  chunk_size_order: "",
  created_time_order: "",
  status: [],
  created_time_start: "",
  created_time_end: "",
  enabled: "",
  parser_method: [],
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
  layout: "total,sizes,prev,pager,next,jumper",
});
const currentPage = ref(1);
const totalCount = ref(0);
const currentPageSize = ref(20);
const dialogEditVisible = ref(false);
const loading = ref(false);
const taskListImportDate = ref();
const taskNumber = ref(0);
const taskTimer = ref();
const taskList = ref<any>([]);
const uploadTaskListData = ref({});
const parserMethodOptions = ref<any>([]);
const userLanguage = ref();
const isSubmitDisabled = ref(true);
const ruleForm = ref<FileForm>({
  id: "",
  name: "",
  type_id: "",
  parser_method: "",
  chunk_size: 1024,
});
const rules = reactive({
  name: [
    {
      required: true,
      message: t("assetFile.message.name"),
      trigger: ["blur", "change"],
    },
    {
      min: 1,
      message: t("assetFile.message.docNameLen"),
      trigger: ["blur", "change"],
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
  () => t(""),
  (newVal, oldVal) => {
    filterStatusList.value = [
      {
        label: t("assetFile.status.analyticFail"),
        value: StatusEnum.FAIL,
      },
      {
        label: t("assetFile.status.analyticSucces"),
        value: StatusEnum.SUCCESS,
      },
      {
        label: t("assetFile.status.cancelAnalytic"),
        value: StatusEnum.CANCEL,
      },
      {
        label: t("assetFile.status.analyticWaitIng"),
        value: StatusEnum.ANALYSIS_ING,
      },
      {
        label: t("assetFile.status.analyticIng"),
        value: StatusEnum.RUNNING,
      },
    ];
    filterEnableList.value = [
      { label: t("assetFile.open"), value: "true" },
      { label: t("assetFile.close"), value: "false" },
    ];
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

watch(
  () => ruleForm.value.name,
  () => {
    isSubmitDisabled.value = !ruleForm.value.name?.length;
  },
  {
    deep: true,
    immediate: true,
  }
);

const handleBatchDownBth = (e) => {
  batchDownBth.value = e;
};

const handleSearchPayload = () => {
  const searchParams = Object.keys(searchPayload.value || {}).reduce(
    (pre: any, item) => {
      if (
        searchPayload.value?.[item]?.length > 0 &&
        searchPayload.value?.[item] !== "all"
      ) {
        pre[item] = searchPayload.value[item];
        if (item === "enabled") {
          pre[item] = JSON.parse(searchPayload.value[item]);
        }
      }

      return pre;
    },
    {}
  );
  return searchParams || {};
};

const handleJumpHome = () => {
  window.open(`${window.origin}/witchaind/#/knowledge/library`, "_self");
};

const handleHeaderClick = (e: any) => {};

const handelCategoryFilterProper = (filterList: any) => {
  searchPayload.value.document_type_list = filterList;
  handleSearchData();
};

const handelStatusFilterProper = (filterList: any) => {
  searchPayload.value.status = filterList;
  handleSearchData();
};
const handelEnableFilterProper = (filterList: any) => {
  searchPayload.value.enabled = filterList.length === 2 ? "all" : filterList[0];
  handleSearchData();
};

const handelParserMethodFilterProper = (filterList: any) => {
  searchPayload.value.parser_method = filterList;
  handleSearchData();
};

const handleRunKl = (row: any, type: string) => {
  if (type === "cancel") {
    cancelTipVisible.value = true;
    opsItem.value = row;
  } else {
    KfAppAPI.runLibraryFile({
      ids: [row.id],
      run: type,
    }).then((res) => {
      ElMessage({
        showClose: true,
        message: t("opsMessage.opsAnalyticIng"),
        icon: IconSuccess,
        customClass: "o-message--success",
        duration: 3000,
      });
      handleSearchOpsData(true, true);
    });
  }
};

const handleConfirmFileAnalytic = () => {
  KfAppAPI.runLibraryFile({
    ids: [opsItem.value.id],
    run: "cancel",
  }).then((res) => {
    ElMessage({
      showClose: true,
      message: t("opsMessage.opsCancel"),
      icon: IconSuccess,
      customClass: "o-message--success",
      duration: 3000,
    });
    handleSearchOpsData(true, true);
    handleCancelVisible();
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
      if (!res?.data_list?.length && currentPage.value !== 1) {
        currentPage.value = 1;
        handleSearchOpsData(true, true);
        return;
      }
      fileTableList.data = res?.data_list || [];
      currentPage.value = res.page_number;
      currentPageSize.value = res.page_size;
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
    page_number: currentPage.value,
    page_size: currentPageSize.value,
    kb_id: route.query.kb_id as string,
    ...handleSearchPayload(),
    ...sortFilter.value,
  })
    .then((res: any) => {
      if (res.page_number === currentPage.value && fileTableList.data?.length) {
        if (!res?.data_list?.length && currentPage.value !== 1) {
          currentPage.value = 1;
          handleSearchOpsData(true, true);
          return;
        }
        fileTableList.data = fileTableList.data.map((item) => {
          let fileData = res?.data_list?.filter(
            (file: any) => file.id === item.id
          )?.[0];
          return fileData || item;
        });
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const hanldeSearhNameFilter = (filterName: string) => {
  searchPayload.value.name = filterName;
  handleSearchData();
};

const handleJumpFileSection = (row: any) => {
  window.open(
    `${window.origin}/witchaind/#/knowledge/fileSection?kb_id=${route.query.kb_id}&file_id=${row.id}`,
    "_self"
  );
};

const handleSearchData = () => {
  handeAssetLibraryData(
    {
      page_number: 1,
      page_size: currentPageSize.value,
      kb_id: route.query.kb_id as string,
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
  KbAppAPI.getKbLibrary({
    id: kbId,
    page_number: 1,
    page_size: 10,
  }).then((res: any) => {
    kbInfo.value = res.data_list?.[0] || {};
    let categoryList = JSON.parse(
      JSON.stringify(
        Array.from(new Set(res.data_list?.[0]?.document_type_list)) || "[]"
      )
    );
    filterCategoryList.value = [
      ...categoryList.map((item: { type: string; id: string }) => {
        return {
          label: item.type,
          value: item.id,
        };
      }),
      {
        label: "default type",
        value: "00000000-0000-0000-0000-000000000000",
      },
    ].filter((item) => item?.label?.length > 0);
  });
};

const handleStartPollTimer = () => {
  pollingKfTimer.value = setInterval(() => handlePollAssetFileData(), 15000);
};

onMounted(() => {
  const kbId = route.query.kb_id;
  if (kbId?.length) {
    handeAssetLibraryData(
      {
        kb_id: kbId as string,
        page_number: 1,
        page_size: 20,
      },
      true,
      true
    );
    KbAppAPI.queryParseMethodList().then((res: any) => {
      parserMethodOptions.value = res?.map((item: any) => {
        return { label: item, value: item };
      });
    });
    handleQueryKbData();
  }
  document.addEventListener("click", () => handleDateTimerange);
});

const handleCleartTimer = () => {
  clearInterval(pollingKfTimer.value);
  pollingKfTimer.value = null;
};

onUnmounted(() => {
  handleCleartTimer();
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

const handleDateTimerange = (e: { target: Node | null }) => {
  const dateTimeContainer = document.querySelector(".datetimerangeClass");
  const timeFilterPo = document.querySelector(".timeFilterPo");
  if (dateTimeContainer) {
    if (
      !dateTimeContainer.contains(e.target) &&
      !timeFilterPo?.contains(e.target)
    ) {
      timeFilterVisible.value = false;
    }
  }
};

const handleTimeChange = (e: (string | undefined)[]) => {
  searchPayload.value.created_time_start = e?.[0] ? uTCToLocalTime(e?.[0]) : "";
  searchPayload.value.created_time_end = e?.[1] ? uTCToLocalTime(e?.[1]) : "";
  handleSearchOpsData(true, true);
  handleCancelVisible();
};

const handleChangeMenu = (type: string) => {
  menuType.value = type;
};

const handleSearchOpsData = (
  loadingStatus: boolean,
  startPollTimer: boolean
) => {
  handeAssetLibraryData(
    {
      page_number: currentPage.value,
      page_size: currentPageSize.value,
      kb_id: route.query.kb_id as string,
      ...handleSearchPayload(),
      ...sortFilter.value,
    },
    loadingStatus,
    startPollTimer
  );
};

const handleSwitch = (row: any) => {
  KfAppAPI.switchLibraryFile({
    id: row.id,
    enabled: row.enabled,
  }).then((res) => {
    ElMessage({
      showClose: true,
      message: t("opsMessage.opsSuccess"),
      icon: IconSuccess,
      customClass: "o-message--success",
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
  KfAppAPI.runLibraryFile({
    ids: selectionFileData.value.map((item) => {
      return item.id;
    }),
    run: "run",
  }).then((res) => {
    ElMessage({
      showClose: true,
      message: t("opsMessage.opsAnalyticIng"),
      icon: IconSuccess,
      customClass: "o-message--success",
      duration: 3000,
    });
    selectionFileData.value = [];
    multipleTable.value.clearSelection();
    handleSearchOpsData(true, true);
  });
};

const handleConfirmDleSingle = (row: any) => {
  KfAppAPI.delLibraryFile({
    ids: [row.id],
  }).then((res) => {
    ElMessage({
      showClose: true,
      message: t("opsMessage.delSuccess"),
      icon: IconSuccess,
      customClass: "o-message--success",
      duration: 3000,
    });
    let selectData = JSON.parse(JSON.stringify(selectionFileData.value));
    selectData = selectData
      .filter((item: any) => item.id !== row.id)
      .filter((item: { id: any }) => item?.id);
    if (selectData?.length > 0) {
      selectData.forEach((item: { id: any }) => {
        multipleTable.value.toggleRowSelection(item.id);
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
  KfAppAPI.delLibraryFile({
    ids: selectionFileData.value.map((item) => {
      return item.id;
    }),
  })
    .then((res) => {
      ElMessage({
        showClose: true,
        message: t("opsMessage.delSuccess"),
        icon: IconSuccess,
        customClass: "o-message--success",
        duration: 3000,
      });
      currentPage.value = 1;
      handleSearchOpsData(true, true);
      handleCancelVisible();
      selectionFileData.value = [];
      multipleTable.value.clearSelection();
    })
    .catch((err) => {
      handleStartPollTimer();
    });
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      KfAppAPI.updateLibraryFile({
        ...ruleForm.value,
        document_type: ruleForm.value.document_type,
      }).then((res) => {
        ElMessage({
          showClose: true,
          message: t("opsMessage.modifSuccess"),
          icon: IconSuccess,
          customClass: "o-message--success",
          duration: 3000,
        });
        handleSearchOpsData(true, true);
        dialogEditVisible.value = false;
      });
    } else {
    }
  });
};

const handleEditKl = (row: any) => {
  ruleForm.value.id = row.id;
  ruleForm.value.name = row.name;
  ruleForm.value.chunk_size = row.chunk_size || 1024;
  ruleForm.value.parser_method = row.parser_method;
  ruleForm.value.type_id = JSON.parse(JSON.stringify(row.document_type.id));
  dialogEditVisible.value = true;
};

const handleChangePage = (pageNum: number, pageSize: number) => {
  currentPage.value = pageNum;
  currentPageSize.value = pageSize;
  handleSearchOpsData(true, true);
};

const sortFilter = ref({});
const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  let sortKey =
    data.prop === "chunk_size" ? "chunk_size_order" : "created_time_order";
  let sortValue = data.order
    ? data.order === "ascending"
      ? "asc"
      : "desc"
    : null;
  sortFilter.value = sortValue
    ? {
        [sortKey]: sortValue,
      }
    : {};
  handleSearchOpsData(true, true);
};

const handleQueryTaskList = (selectedTaskList: string | any[]) => {
  handleSearchOpsData(true, false);
};

const handleImportLoading = (loadingStatus: boolean) => {
  loading.value = loadingStatus;
};

const toggleUploadNotify = (uploadTaskPayload: any) => {
  importTaskTotal.value = uploadTaskPayload.uploadingList.length;
  uploadTaskListData.value = uploadTaskPayload;
};

onUnmounted(() => {
  taskTimer.value = null;
});

const handleUploadMyFile = (options: any) => {
  KfAppAPI.importKbLibraryFile(
    {
      data: {
        files: options.file.raw,
      },
      params: {
        kb_id: route.query.kb_id,
      },
    },
    options
  )
    .then((res) => {
      options.onSuccess({ ...options.fileInfo, success: "success" });
    })
    .catch((err) => {
      options.onError({ ...options.fileInfo, error: err });
    });
};

const handleDownloadFile = (downloadData: any) => {
  downloadData.forEach((item: { id: any }) => {
    window.open(`${window.origin}/witchaind/api/doc/download?id=${item.id}`);
  });
};
</script>
