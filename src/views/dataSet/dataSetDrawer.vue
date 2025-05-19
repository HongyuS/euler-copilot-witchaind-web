<template>
  <el-drawer
    class="dataSetDrawerContainer"
    v-model="dataSetDrawerVisible"
    @close="handleCloseDrawerVisible">
    <template #header="{ close, titleId, titleClass }">
      <h4
        :id="titleId"
        :class="titleClass">
        {{ dataSetInfo.datasetName }}
      </h4>
    </template>
    <CustomLoading :dark="false" :loading="loading" />
    <div class="dataSetInfoContainer">
      <div class="dataSetInfoBox">
        <div class="dataSetInfoTitle">基本信息</div>
        <div
          v-if="dataSetInfoEdit"
          class="dataSetInfoEdit"
          @click="handleDataSetInfoEdit(true)">
          编辑
        </div>
        <div
          v-else
          class="dataSetInfoOps">
          <div
            class="dataSetInfoSave"
            @click="handleDataSetInfoSave">
            保存
          </div>
          <div
            class="dataSEtInfoCancel"
            @click="handleDataSetInfoEdit(false)">
            取消
          </div>
        </div>
      </div>
      <div class="dataSetInfoNameBox">
        <div class="dataSetInfoLabel">数据集名称</div>
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
            placeholder="Please input" />
        </div>
      </div>
      <div class="dataSetInfoDescBox">
        <div class="dataSetInfoLabel">数据集简介</div>
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
            maxlength="200" />
        </div>
      </div>
    </div>
    <div class="dataSetInfoCenterBox">
      <div class="dataSetTableInfoOps">
        <el-button @click="handleBatchDelete" :disabled="!selectionDataSetList.length">批量删除</el-button>
      </div>
      <div class="dataSetInfoRight">
        <div class="dataSetListBox">
          <span class="dataSetListIcon">
            <img src="/src/assets/svg/taskList.svg" />
          </span>
          <span class="dataSetListText">数据条目限制</span>
          <span class="dataSetListNumber">{{  props.dataSetRow.dataCnt }}</span>
        </div>
        <div class="dataSetScoreBox">
          <span class="dataSetScoreIcon">
            <img src="/src/assets/svg/taskScore.svg" />
          </span>
          <span class="dataSetScoreText">数据集质量分数</span>
          <span class="dataSetScoreNumber">{{ props.dataSetRow.score>0?props.dataSetRow.score?.toFixed(2):'--' }}</span>
        </div>
      </div>
    </div>
    <div>
      <el-table
        :data="tableData.data"
        style="width: 100%"
        :height="dataSetInfoEdit?'705':'643'"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="30" />
        <el-table-column
          prop="question"
          label="问题"
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
          label="标准答案" 
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
          label="原始片段上下文" 
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
          label="片段类型" />
          <el-table-column
          prop="docName"
          width="250"
          label="来源文档" />
        <el-table-column
          fixed="right"
          label="操作"
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
              编辑
            </el-button>
            <el-button
              v-if="!scope.row.onEdit"
              @click="handleDelete([scope.row.dataId])"
              text>
              删除
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
              保存
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
              取消
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
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">关闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import '@/styles/dataSetDrawer.scss';
import CustomLoading from '@/components/CustomLoading/index.vue';
import dataSetAPI from '@/api/dataSet';

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
  handleDelete(ids);
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

const cancelClick = () => {};

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

onMounted(() => {
  dataSetDrawerVisible.value = props.dataSetDrawerVisible;
  let param = {
    page: currentPage.value,
    pageSize: currentPageSize.value,
  };
  queryTableData(param)
});
</script>
