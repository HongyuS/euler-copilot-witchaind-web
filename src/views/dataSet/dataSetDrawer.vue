<template>
  <el-drawer
    class="dataSetDrawerContainer"
    v-model="dataSetDrawerVisible"
    @close="handleCloseDrawerVisible">
    <template #header="{ titleId, titleClass }">
      <h4
        :id="titleId"
        :class="titleClass">
        {{ dataSetInfo.datasetName }}
      </h4>
    </template>
    <CustomLoading :loading="loading" />
    <div class="empty_box" v-if="props.dataSetRow?.status === 'pending'">
      <div class="empty_img empty_pending"></div>
      <div class="empty_text">{{ $t('dataset.taskStatus.pending') }}</div>
    </div>
    <div class="empty_box" v-else-if="props.dataSetRow?.status === 'failed'">
      <div class="empty_img empty_failed"></div>
      <div class="empty_text">{{ $t('dataset.taskStatus.failed') }}</div>
    </div>
    <div class="empty_box" v-else-if="props.dataSetRow?.status === 'running'">
      <div class="empty_img empty_pending"></div>
      <div class="empty_text">{{ $t('dataset.taskStatus.running') }}</div>
    </div>
    <div v-else>
    <div class="dataSetInfoContainer">
      <div class="dataSetInfoBox">
        <div class="dataSetInfoTitle">{{ $t('dataset.baseInfo') }}</div>
        <div
          v-if="dataSetInfoEdit"
          class="dataSetInfoEdit"
          @click="handleDataSetInfoEdit(true)">
          {{ $t('btnText.edit') }}
        </div>
        <div
          v-else
          class="dataSetInfoOps">
          <div
            class="dataSetInfoSave"
            @click="handleDataSetInfoSave">
            {{ $t('btnText.save') }}
          </div>
          <div
            class="dataSEtInfoCancel"
            @click="handleDataSetInfoEdit(false)">
            {{ $t('btnText.cancel') }}
          </div>
        </div>
      </div>
      <div class="dataSetInfoNameBox">
        <div class="dataSetInfoLabel">{{ $t('dataset.datasetName') }}</div>
        <div
          class="dataSetInfoContent"
          v-if="!dataSetInfoEditVisible">
          {{ dataSetInfo.datasetName }}
        </div>
        <div
          class="dataSetInfoContent"
          v-else>
          <el-input
            v-model="dataSetInfoInput.datasetName"
            :placeholder="$t('dataset.placeInput')" />
        </div>
      </div>
      <div class="dataSetInfoDescBox">
        <div class="dataSetInfoLabel">{{ $t('dataset.datasetDesc') }}</div>
        <div
          class="dataSetInfoContent"
          v-if="!dataSetInfoEditVisible">
          {{ dataSetInfo.description }}
        </div>
        <div
          class="dataSetInfoContent"
          v-else>
          <el-input
            v-model="dataSetInfoInput.description"
            show-word-limit
            type="textarea"
            :placeholder="$t('dataset.placeInput')"
            maxlength="200" />
        </div>
      </div>
    </div>
    <div class="dataSetInfoCenterBox">
      <div class="dataSetTableInfoOps">
        <el-button @click="handleBatchDelete" :disabled="!selectionDataSetList.length">{{ $t('btnText.batchDelete') }}</el-button>
      </div>
      <div class="dataSetInfoRight">
        <div class="dataSetListBox">
          <span class="dataSetListIcon" />
          <span class="dataSetListText">{{ $t('dataset.dataCountLimit') }}</span>
          <span class="dataSetListNumber">{{  props.dataSetRow.dataCnt }}</span>
        </div>
        <div class="dataSetScoreBox">
          <span class="dataSetScoreIcon" />
          <span class="dataSetScoreText">{{ $t('dataset.score') }}</span>
          <span class="dataSetScoreNumber">{{ props.dataSetRow.score>0?props.dataSetRow.score?.toFixed(2):'--' }}</span>
        </div>
      </div>
    </div>
    <div>
      <el-table
        :data="tableData.data"
        style="width: 100%"
        height="662px"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="30" />
        <el-table-column
          prop="question"
          :label="$t('dataset.question')"
          fixed
          width="180"
          class-name="editable-column">
          <template #default="scope">
            <div v-if="scope.row.onEdit">
              <el-input
                :model-value="handleGetRowData(scope.row, 'question')"
                :rows="4"
                show-word-limit
                type="textarea"
                maxlength="200" 
                @input="handleEditRow(scope.row.dataId,'question',$event)"
                />
            </div>
            <template v-else>
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="scope.row.question"
                placement="top"
              >
                <div class="dataChunkText">{{ scope.row.question }}</div>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="answer"
          fixed
          :label="$t('dataset.standardAnswer')"
          width="380"
          >
          <template #default="scope">
            <div v-if="scope.row.onEdit">
              <el-input
                :model-value="handleGetRowData(scope.row, 'answer')"
                :rows="4"
                show-word-limit
                type="textarea"
                @input="handleEditRow(scope.row.dataId,'answer',$event)"
                maxlength="1000" />
            </div>
            <template v-else>
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="scope.row.answer"
                placement="top"
              >
                <div class="dataChunkText">{{ scope.row.answer }}</div>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>

        <el-table-column
          prop="chunk"
          :label="$t('dataset.chunk')"
          width="300"
        >
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="scope.row.chunk"
            placement="top"
          >
            <div class="dataChunkText">{{ scope.row.chunk  }}</div>
          </el-tooltip>
        </template>
        </el-table-column>
          <el-table-column
          prop="chunkType"
          width="150"
          :label="$t('dataset.chunkType')" />
          <el-table-column
          prop="docName"
          width="250"
          :label="$t('dataset.sourceDoc')" />
        <el-table-column
          fixed="right"
          :label="$t('btnText.operation')"
          width="120">
          <template #default="scope">
            <el-button
              v-if="!scope.row.onEdit"
              @click="
                handleStartEdit({
                  type: 'edit',
                  row: scope.row,
                })
              "
              text>
              {{ $t('btnText.edit') }}
            </el-button>
            <el-button
              v-if="!scope.row.onEdit"
              @click="handleSingleDelete([scope.row.dataId])"
              text>
              {{ $t('btnText.delete') }}
            </el-button>
            <el-button
              v-if="scope.row.onEdit"
              @click="
                handleSaveEdit({
                  type: 'save',
                  row: scope.row,
                })
              "
              text>
              {{ $t('btnText.save') }}
            </el-button>
            <el-button
              v-if="scope.row.onEdit"
              @click="
                handleCancelEdit({
                  type: 'cancel',
                  row: scope.row,
                })
              "
              text>
              {{ $t('btnText.cancel') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="tableData.data?.length"
        v-model:current-page="currentPage"
        v-model:page-size="currentPageSize"
        :page-sizes="pagination.pageSizes"
        :layout="pagination.layout"
        :total="totalCount"
        popper-class="kbLibraryPage"
        @change="handleChangePage" />
    </div>
  </div>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">{{ $t('btnText.close') }}</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import '@/styles/dataSetDrawer.scss';
import CustomLoading from '@/components/CustomLoading/index.vue';
import dataSetAPI from '@/api/dataSet';
import { IconAlarm } from '@computing/opendesign-icons';

const {t} = useI18n();
const loading = ref(false);
const dataSetDrawerVisible = ref(false);
const dataSetInfoEdit = ref(true);
const dataSetInfo = ref();
const dataSetInfoInput = ref();
const dataSetInfoEditVisible = ref(false);
const onEditList = ref<any>([]);
const currentPage = ref(1);
const currentPageSize = ref(20);
const totalCount = ref(0);
const pagination = ref({
  pageSizes: [10, 20, 30, 40, 50],
  layout: 'total,sizes,prev,pager,next,jumper',
});
const tableData = ref({
  data: [
  ],
  editableKeys: ['question', 'answer'],
});
const selectionDataSetList = ref<any>([]);
const props = defineProps({
  dataSetDrawerVisible: {
    type: Boolean,
    default: false,
  },
  handleDataSetProps: {
    type: Function,
    default: () => {},
  },
  dataSetRow: {
    type: Object,
    default: {},
  },
});

watch(
  () => props.dataSetRow,
  (newVal) => {
    dataSetInfo.value = JSON.parse(JSON.stringify(newVal));
    dataSetInfoInput.value = JSON.parse(JSON.stringify(newVal));
  },
  {
    deep: true,
    immediate: true,
  }
);

const handleSelectionChange = (newSelection: any[]) => {
  selectionDataSetList.value = newSelection;
};

const handleGetRowData = (row: any, property: any) => {
  const rowData = onEditList.value.find((i: { dataId: any }) => i.dataId === row.dataId);
  if (rowData) {
    return rowData.editingValue[property].value;
  }
};

const removeRowEditable = (row: { dataId: number }) => {
  const data = tableData.value.data.find((data) => data.dataId === row.dataId);
  const index = onEditList.value.findIndex((item: { dataId: any }) => item.dataId === row.dataId);
  if (data) {
    data.onEdit = false;
    if (index !== -1) {
      onEditList.value.splice(index, 1);
    }
  }
};

const handleStartEdit = (obj: any) => {
  const { row } = obj;
  const data:any = tableData.value.data.find((data) => data.dataId === row.dataId);
  if (data) {
    data.onEdit = true;
    const editingValue: any = {};
    tableData.value.editableKeys.forEach((key) => {
      editingValue[key] = {
        type: typeof row[key],
        value: row[key],
      };
    });
    onEditList.value.push({
      dataId: row.dataId,
      editingValue,
    });
  }
};

const handleCancelEdit = ({ row }: any) => {
  removeRowEditable(row);
};

const handleSaveEdit = ({ row }: any) => {
  const tableItem: any = tableData.value.data.find((data) => data.dataId === row.dataId);
  const editItem = onEditList.value.find((item: { dataId: any }) => item.dataId === row.dataId);
  if (tableItem && editItem) {
    tableData.value.editableKeys.forEach((key) => {
      tableItem[key] = editItem.editingValue[key].value;
    });
  }

  dataSetAPI.updateDataSetInfo({
    dataId: row.dataId,
  },{
    question: tableItem.question,
    answer: tableItem.answer,
  }).then(()=>{
    let param = {
      page: currentPage.value,
      pageSize: currentPageSize.value,
    };
    queryTableData(param)
  })
};

const handleEditRow = (dataId: any,property: string | number,value: any)=>{
  const rowData = onEditList.value.find((i: { dataId: any; })=>i.dataId === dataId);
  if(rowData)
  rowData.editingValue[property].value = value
}

const handleBatchDelete =()=>{
  let ids = selectionDataSetList.value.map((item:any)=>item.dataId)
  ElMessageBox.confirm(
    t('dialogTipText.confirmDelData'),
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
    handleDelete(ids)
  })
}
const handleSingleDelete=(ids:any)=>{
  ElMessageBox.confirm(
    t('dialogTipText.confirmDelSingleData'),
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
    handleDelete(ids)
  })

}

const handleDelete=(ids:any)=>{
  loading.value = true;
  dataSetAPI.deleteDataInfo(ids).then(()=>{
    let param = {
      page: currentPage.value,
      pageSize: currentPageSize.value,
    };
    queryTableData(param);
  }).finally(()=>{
    loading.value = false;
  })
}

const cancelClick = () => {
  handleCloseDrawerVisible();
};

const handleDataSetInfoEdit = (opsType: boolean) => {
  if(!opsType){
    dataSetInfoInput.value = JSON.parse(JSON.stringify(dataSetInfo.value))
  }
  dataSetInfoEditVisible.value = opsType;
  dataSetInfoEdit.value = !opsType;
};

const handleDataSetInfoSave = () => {
  loading.value = true;
  dataSetAPI.updateDataSet(
    {
      databaseId:props.dataSetRow.datasetId
    },
    {
      datasetName: dataSetInfoInput.value?.datasetName,
      description: dataSetInfoInput.value?.description,
    }
  ).then(()=>{
    dataSetInfoEditVisible.value = false;
    dataSetInfoEdit.value = true;
    dataSetInfo.value = JSON.parse(JSON.stringify(dataSetInfoInput.value));
  }).finally(()=>{
    loading.value = false;
  })
};

const handleCloseDrawerVisible = () => {
  dataSetDrawerVisible.value = false;
  props.handleDataSetProps();
};
const handleChangePage=(pageNum: number, pageSize: number)=>{
  currentPage.value = pageNum;
  currentPageSize.value = pageSize;
  let param = {
    page: pageNum,
    pageSize: pageSize,
  };

  queryTableData(param);
}
const queryTableData=(params: any)=>{
  loading.value = true;
  const param={
    datasetId:props.dataSetRow.datasetId,
    ...params,
  }
  dataSetAPI.querySingleDataSetInfo(param).then((res:any)=>{
    tableData.value.data = res.datas;
    totalCount.value = res.total;
  }).finally(()=>{
    loading.value = false;
  })
}

const handleDataPolling = (params: any) => {
  const param={
    datasetId:props.dataSetRow.datasetId,
    ...params,
  }
  dataSetAPI.querySingleDataSetInfo(param).then((res:any)=>{
    tableData.value.data = res.datas;
    totalCount.value = res.total;
    if(res.datas.length && res.total){
      stopPolling();
    }
  })
};

let pollingTimer: any = null;

const startPolling = () => {
  stopPolling(); // 确保之前的轮询已停止
  pollingTimer = setInterval(() => {
    let param = {
      page: currentPage.value,
      pageSize: currentPageSize.value,
    };
    handleDataPolling(param);
  }, 15000);
};

const stopPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
};

watch(dataSetDrawerVisible, (newVal) => {
  if (newVal) {
    startPolling();
  } else {
    stopPolling();
  }
});

onUnmounted(() => {
  stopPolling(); // 确保组件卸载时停止轮询
});

onMounted(() => {
  dataSetDrawerVisible.value = props.dataSetDrawerVisible;
  let param = {
    page: currentPage.value,
    pageSize: currentPageSize.value,
  };
  queryTableData(param)
});
</script>
