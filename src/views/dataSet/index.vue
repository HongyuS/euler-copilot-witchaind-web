<template>
  <div
    class="dataset-empty-content"
    v-if="!dataSetTableList.length">
    <EmptyStatus
      button-text="去生成数据集"
      description="暂无数据集信息，去文档管理生成一个吧！"
      @click="handleToCreate" />
  </div>
  <div
    v-else
    class="dataSet-container">
    <div>
      <div>
        <el-dropdown
          placement="bottom"
          popper-class="dropdown-container dataSet-ops-dowlon"
          @visible-change="handleBatchDownBth"
          :disabled="!(selectionDataSetList.length > 0)">
          <el-button
            :class="batchDownBth ? 'upBtn' : 'downBtn'">
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
                :disabled="!(selectionDataSetList.length > 0)"
                @click="handleSelectExportDataSet">
                {{ $t('btnText.batchExport') }}
              </el-dropdown-item>
              <el-dropdown-item
                :disabled="!(selectionDataSetList.length > 0)"
                @click="handleSelectDeleteDataSet">
                {{ $t('btnText.batchDelete') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="dataSet-container-table-box">
        <el-table
          :data="dataSetTableList"
          class="dataSetTableContainer"
          cell-calss-name="tableCell"
          :row-key="(row) => row.id"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
          ref="multipleTable"
          v-loading="loading"
          :border="false">
          <el-table-column
            type="selection"
            :fixed="true"
            class-name="dataSet-selection"
            width="35"
            :reserve-selection="true"
            :selectable="checkSelecTable" />
          <el-table-column
            prop="dataSetName"
            :label="$t('数据集名称')"
            show-overflow-tooltip
            :fixed="true"
            class-name="dataSetName"
            width="200">
            <template #default="scope">
              <span
                class="dataSet-name-row"
                @click="handleJumpFileSection(scope.row)">
                {{ scope.row.dataSetName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="dataSetDesc"
            :label="$t('数据集简介')"
            show-overflow-tooltip>
            <template #default="scope">
              <span>{{ scope.row.dataSetDesc }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="dataSetNumber"
            :label="$t('数据集条目')"
            sortable />
          <el-table-column
            prop="isDataClean"
            :label="$t('是否进行数据清洗')">
            <template #header>
              <div class="custom-header">
                <span>{{ $t('是否进行数据清洗') }}</span>
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
            prop="dataSetStatus"
            :label="$t('状态')"
            width="220">
            <template #header>
              <div class="custom-header">
                <span>{{ $t('状态') }}</span>
                <el-icon
                  ref="statusRef"
                  @click.stop
                  :class="
                    searchPayload?.status?.length || statusFilterVisible
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
                v-if="scope.row.dataSetStatus === DataSetStatusEnum.FAIL"
                class="statusFail">
                {{ $t('生成失败') }}
              </div>
              <div
                v-if="scope.row.dataSetStatus === DataSetStatusEnum.SUCCESS"
                class="statusSuccess">
                {{ $t('生成完毕') }}
              </div>
              <div
                v-if="scope.row.dataSetStatus === DataSetStatusEnum.CANCEL"
                class="statusCancel">
                {{ $t('取消生成') }}
              </div>
              <div
                v-if="scope.row.dataSetStatus === DataSetStatusEnum.GENERATE_ING"
                class="statusWaitIng">
                <div class="icon-box icon-loading"></div>
                {{ $t('等待生成') }}
              </div>
              <div
                class="statusGenerate"
                v-if="scope.row.dataSetStatus === DataSetStatusEnum.RUNNING">
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
                  {{ $t('生成中') }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="dataSetScore"
            :label="`${$t('数据集质量分数')}(1~100)`"
            width="240"
            show-overflow-tooltip
            sortable=""></el-table-column>
          <el-table-column
            prop="dataSetCreator"
            :label="$t('创建人')"
            show-overflow-tooltip>
            <template #header>
              <div class="custom-header">
                <span>
                  {{ $t('创建人') }}
                </span>
                <el-icon
                  ref="creatorRef"
                  :class="
                    searchPayload?.creator?.length > 0 || creatorVisible ? 'searchIconIsActive' : ''
                  ">
                  <IconFilter />
                </el-icon>
                <el-popover
                  ref="popoverRef"
                  v-model:visible="creatorVisible"
                  popper-class="filterPopper"
                  placement="bottom-start"
                  :virtual-ref="creatorRef"
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
            prop="dataSetCreatime"
            class-name="upload-time-cell"
            :label="$t('完成时间')"
            sortable
            @click.stop></el-table-column>

          <el-table-column
            prop="action"
            :label="$t('btnText.operation')"
            width="240"
            fixed="right">
            <template #default="scope">
              <el-button
                v-if="scope.row.dataSetStatus === DataSetStatusEnum.RUNNING"
                text
                @click="handlePauseDataSet(scope.row, 'cancel')">
                {{ $t('暂停') }}
              </el-button>
              <el-button
                v-if="
                  [
                    DataSetStatusEnum.FAIL,
                    DataSetStatusEnum.CANCEL,
                    DataSetStatusEnum.ANALYSIS_ING,
                  ].includes(scope.row.dataSetStatus)
                "
                text
                @click="handleRunDataSet(scope.row, 'run')">
                {{ $t('生成') }}
              </el-button>
              <el-button
                text
                :disabled="scope.row.dataSetStatus === DataSetStatusEnum.RUNNING"
                @click="handleEditDataSet(scope.row)">
                {{ $t('btnText.edit') }}
              </el-button>
              <el-button
                text
                :disabled="scope.row.dataSetStatus === DataSetStatusEnum.SUCCESS"
                @click="handleDataSetEval(scope.row)">
                {{ $t('评测') }}
              </el-button>
              <el-button
                text
                @click="handleExportDataSet([scope.row])">
                {{ $t('导出') }}
              </el-button>
              <el-button
                :disabled="scope.row.dataSetStatus === DataSetStatusEnum.RUNNING"
                text
                @click="handleDeleteDataSet(scope.row)">
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
</template>

<script setup lang="ts">
import EmptyStatus from '@/components/EmptyStatus/index.vue';
import { useGroupStore } from '@/store/modules/group';
import { IconCaretDown, IconFilter, IconCaretUp } from '@computing/opendesign-icons';
import { DataSetStatusEnum } from '@/enums/KnowledgeEnum';
import FilterContainr from '@/components/TableFilter/index.vue';

import { ref } from 'vue';
import '@/styles/dataSet.scss';
const store = useGroupStore();
const selectionDataSetList = ref([]);
const batchDownBth = ref(false);
const dataSetTableList = ref([
     
]);
const loading = ref(false);
const checkedFilterList = ref([]);
const filterStatusList = ref();
const customColor = ref('#0077FF');
const filterEnableList = ref();
const parserMethodOptions = ref<any>([]);
const totalCount = ref(0);
const statusRef = ref();
const enableRef = ref();
const creatorRef = ref();
const statusFilterVisible = ref(false);
const creatorVisible = ref(false);
const enableFilterVisible = ref(false);

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
const searchPayload = ref<any>({
  name: '',
  document_type_list: [],
  chunk_size_order: '',
  created_time_order: '',
  status: [],
  created_time_start: '',
  created_time_end: '',
  enabled: '',
  parser_method: [],
});
const { handleKnowledgeTab } = store;

const handleToCreate = () => {
  handleKnowledgeTab('document');
};
const handelEnableFilterProper = (filterList: any) => {};

const handleBatchDownBth = () => {};

const handleSelectExportDataSet = () => {};

const handleSelectDeleteDataSet = () => {};

const handleSelectionChange = (newSelection: any[]) => {};

const handleSortChange = (data: { column: any; prop: string; order: any }) => {};

const checkSelecTable = (row: any) => {
  return true;
};
const handleJumpFileSection = (row: any) => {};

const handelStatusFilterProper = (filterList: any) => {};

const handleDeleteDataSet = (row: any) => {};

const handleExportDataSet = async (downloadData: any) => {};

const handleEditDataSet = (row: any) => {};

const handleRunDataSet = (row: any, type: string) => {};

const handleSwitch = (row: any) => {};

const handelParserMethodFilterProper = (filterList: any) => {};

const handleChangePage = (pageNum: number, pageSize: number) => {};

const handleDataSetEval = (row: any) =>{
    
}

const handlePauseDataSet = (row: any, p0: string) =>{}

</script>
