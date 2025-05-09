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
        <el-button
            type="primary"
            style="margin-right: 8px"
            @click="handleImportDataSet"
            class="importFileBtn">
            {{ $t('导入数据集') }}
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
                @click="handleSelectExportDataSet">
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
            prop="description"
            :label="$t('数据集简介')"
            show-overflow-tooltip>
            <template #default="scope">
              <span>{{ scope.row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="dataCnt"
            :label="$t('数据集条目')"
            sortable />
          <el-table-column
            prop="isDataCleared"
            :label="$t('是否进行数据清洗')">
            <template #header>
              <div class="custom-header">
                <span>{{ $t('是否进行数据清洗') }}</span>
                <el-icon
                  ref="enableRef"
                  @click.stop
                  :class="
                    searchPayload?.enabled?.length || enableFilterVisible
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
            prop="generateStatus"
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
                v-if="scope.row.generateTask.generateStatus === DataSetStatusEnum.FAILED"
                class="statusFail">
                {{ $t('生成失败') }}
              </div>
              <div
                v-if="scope.row.generateTask.generateStatus === DataSetStatusEnum.SUCCESS"
                class="statusSuccess">
                {{ $t('生成完毕') }}
              </div>
              <div
                v-if="scope.row.generateTask.generateStatus === DataSetStatusEnum.CANCELED"
                class="statusCancel">
                {{ $t('取消生成') }}
              </div>
              <div
                v-if="scope.row.generateTask.generateStatus === DataSetStatusEnum.PENDING"
                class="statusWaitIng">
                <div class="icon-box icon-loading"></div>
                {{ $t('等待生成') }}
              </div>
              <div
                class="statusGenerate"
                v-if="scope.row.generateTask.generateStatus === DataSetStatusEnum.RUNNING">
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
            prop="score"
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
                    searchPayload?.creator?.length || creatorVisible ? 'searchIconIsActive' : ''
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
            @click.stop>
            <template #default="scope">
               {{ scope.row.generateTask.createdTime }}
            </template>
          </el-table-column>

          <el-table-column
            prop="action"
            :label="$t('btnText.operation')"
            width="240"
            fixed="right">
            <template #default="scope">
              <el-button
                v-if="scope.row.generateTask.generateStatus === DataSetStatusEnum.RUNNING"
                text
                @click="handlePauseDataSet(scope.row, 'cancel')">
                {{ $t('暂停') }}
              </el-button>
              <el-button
                v-if="
                  [
                    DataSetStatusEnum.FAILED,
                    DataSetStatusEnum.CANCELED,
                  ].includes(scope.row.generateTask.generateStatus)
                "
                text
                @click="handleRunDataSet(scope.row, 'run')">
                {{ $t('生成') }}
              </el-button>
              <el-button
                text
                :disabled="scope.row.generateTask.generateStatus === DataSetStatusEnum.RUNNING"
                @click="handleEditDataSet(scope.row)">
                {{ $t('btnText.edit') }}
              </el-button>
              <el-button
                text
                :disabled="scope.row.generateTask.generateStatus === DataSetStatusEnum.SUCCESS"
                @click="handleDataSetEval(scope.row)">
                {{ $t('评测') }}
              </el-button>
              <el-button
                text
                @click="handleExportDataSet([scope.row])">
                {{ $t('导出') }}
              </el-button>
              <el-button
                :disabled="scope.row.generateTask.generateStatus === DataSetStatusEnum.RUNNING"
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
  </div>
  <CreateEvaluate :dialogEvaluateVisible="dialogEvaluateVisible" :rowData="rowData" :close="handleCloseDialogue" />
  <DataSetDrawer
    v-if="dataSetDrawerVisible"
    :dataSetDrawerVisible="dataSetDrawerVisible"
    :dataSetRow="dataSetRow"
    :handleDataSetProps="handleDataSetProps" />
</template>

<script setup lang="ts">
import EmptyStatus from '@/components/EmptyStatus/index.vue';
import { useGroupStore } from '@/store/modules/group';
import { IconCaretDown, IconFilter, IconCaretUp } from '@computing/opendesign-icons';
import { DataSetStatusEnum } from '@/enums/KnowledgeEnum';
import FilterContainr from '@/components/TableFilter/index.vue';
import DataSetDrawer from './dataSetDrawer.vue';
import CreateEvaluate from '@/views/dataSet/craeteEvaluate.vue';
import dataSetAPI from '@/api/dataSet';
import router from '@/router';
const route = useRoute();
const { t } = useI18n();

import { ref } from 'vue';
import '@/styles/dataSet.scss';
const store = useGroupStore();
const selectionDataSetList = ref<any>([]);
const batchDownBth = ref(false);
const dataSetTableList = ref([
     {dataSetName:'数据集06',description:'数据集06描述',dataCnt:10,
     isDataCleared:true,generateTask:{generateStatus:DataSetStatusEnum.FAILED,createdTime:'2022-03-22 12:22:22'},dataSetCreator:'admin',
     score:99},
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
const dataSetDrawerVisible = ref(false);
const dataSetRow = ref({});
const dialogEvaluateVisible = ref(false);
const rowData = ref({});
const checkTableSelecData = ref([]);
const pollingKfTimer = ref();
const sortFilter = ref({});

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
const searchPayload = ref<any>({
  name: '',
  docTypes: [],
  chunk_size_order: '',
  created_time_order: '',
  status: [],
  created_time_start: '',
  created_time_end: '',
  enabled: '',
  parser_method: [],
  isDataCleared: [],
});
const { handleKnowledgeTab } = store;

const handleSearchPayload = () => {
  const searchParams = Object.keys(searchPayload.value || {}).reduce((pre: any, item) => {
    if (searchPayload.value?.[item]?.length && searchPayload.value?.[item] !== 'all') {
      pre[item] = searchPayload.value[item];
      if (item === 'enabled') {
        pre[item] = JSON.parse(searchPayload.value[item]);
      }
    }

    return pre;
  }, {});
  return searchParams || {};
};

const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  let sortKey = data.prop === 'score' ? 'scoreOrder' : null;
  let sortValue = data.order ? (data.order === 'ascending' ? 'asc' : 'desc') : null;
  sortFilter.value = sortValue
    ? {
        [sortKey || data.prop]: sortValue,
      }
    : {};
  handleSearchOpsData(true, true);
};

const handlePollFileDataSet = () => {
  dataSetAPI.queryDataSetList({
    page_number: currentPage.value,
    page_size: currentPageSize.value,
    kbId: route.query.kb_id as string,
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
          let fileData = res?.data_list?.filter((file: any) => file.id === item.id)?.[0];
          return fileData || item;
        });
      }
      if (res.data_list?.length) {
        handCheckTableData(res.data_list);
      }
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
    return selecData && ['pending', 'running'].includes(selecData.task.status);
  });
};

const handleSearchOpsData = (loadingStatus: boolean, startPollTimer: boolean) => {
  handleQueryDataSetList(
    {
      page_number: currentPage.value,
      page_size: currentPageSize.value,
      kbId: route.query.kb_id as string,
      ...handleSearchPayload(),
      ...sortFilter.value,
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
      if (res.data_list?.length) {
        handCheckTableData(res.data_list);
      }
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
}

const handleCleartTimer = () => {
  clearInterval(pollingKfTimer.value);
  pollingKfTimer.value = null;
};

const handleSearchData = () => {
  handleQueryDataSetList(
    {
      page_number: 1,
      page_size: currentPageSize.value,
      kbId: route.query.kb_id as string,
      ...handleSearchPayload(),
      ...sortFilter.value,
    },
    true,
    true
  );
  enableFilterVisible.value = false;
  statusFilterVisible.value = false;
  creatorVisible.value = false
};

onMounted(() => {
  const kbId = route.query.kb_id;
  if (kbId?.length) {
    handleQueryDataSetList(
      {
        kbId: kbId as string,
        page_number: 1,
        page_size: 20,
      },
      true,
      true
    );
  }
});

const handleToCreate = () => {
  handleKnowledgeTab('document');
};
const handelEnableFilterProper = (filterList: any) => {
  searchPayload.value.isDataCleared = filterList.length === 2 ? 'all' : filterList[0];
  handleSearchData();
};

const handleBatchDownBth = () => {};

const handleSelectExportDataSet = () => {};

const handleSelectDeleteDataSet = () => {};

const handleSelectionChange = (newSelection: any[]) => {
  selectionDataSetList.value = newSelection;
};

const checkSelecTable = (row: any) => {
  return true;
};
const handleJumpFileSection = (row: any) => {};

const handelStatusFilterProper = (filterList: any) => {
  searchPayload.value.generateStatus = filterList;
  handleSearchData();
};

const handleDeleteDataSet = (row: any) => {};

const handleExportDataSet = async (downloadData: any) => {};

const handleEditDataSet = (row: any) => {
  dataSetRow.value = row;
  dataSetDrawerVisible.value = true;
};

const handleRunDataSet = (row: any, type: string) => {
  dialogEvaluateVisible.value = true;
  rowData.value = row;
};

const handleSwitch = (row: any) => {};

const handelParserMethodFilterProper = (filterList: any) => {};

const handleChangePage = (pageNum: number, pageSize: number) => {};

const handleDataSetEval = (row: any) =>{
    
}

const handlePauseDataSet = (row: any, p0: string) =>{}

const handleImportDataSet = () =>{

}

watch(
  () => t(''),
  () => {
    filterStatusList.value = [
      {
        label: t('生成失败'),
        value: DataSetStatusEnum.FAILED,
      },
      {
        label: t('生成完毕'),
        value: DataSetStatusEnum.SUCCESS,
      },
      {
        label: t('取消生成'),
        value: DataSetStatusEnum.CANCELED,
      },
      {
        label: t('等待生成'),
        value: DataSetStatusEnum.PENDING,
      },
      {
        label: t('生成中'),
        value: DataSetStatusEnum.RUNNING,
      },
    ];
    filterEnableList.value = [
      { label: t('是'), value: 'true' },
      { label: t('否'), value: 'false' },
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
</script>
