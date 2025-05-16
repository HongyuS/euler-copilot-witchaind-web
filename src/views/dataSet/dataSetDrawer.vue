<template>
  <el-drawer
    class="dataSetDrawerContainer"
    v-model="dataSetDrawerVisible"
    @close="handleCloseDrawerVisible">
    <template #header="{ close, titleId, titleClass }">
      <h4
        :id="titleId"
        :class="titleClass">
        {{ dataSetInfo.dataSetName }}
      </h4>
    </template>
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
          {{ dataSetInfo.dataSetName }}
        </div>
        <div
          class="dataSetInfoContent"
          v-else>
          <el-input
            v-model="dataSetInfo.dataSetName"
            placeholder="Please input" />
        </div>
      </div>
      <div class="dataSetInfoDescBox">
        <div class="dataSetInfoLabel">数据集简介</div>
        <div
          class="dataSetInfoContent"
          v-if="!dataSetInfoEditVisible">
          {{ dataSetInfo.dataSetDesc }}
        </div>
        <div
          class="dataSetInfoContent"
          v-else>
          <el-input
            v-model="dataSetInfo.dataSetDesc"
            :rows="4"
            show-word-limit
            type="textarea"
            maxlength="200" />
        </div>
      </div>
    </div>
    <div class="dataSetInfoCenterBox">
      <div class="dataSetTableInfoOps">
        <el-button :disabled="!selectionDataSetList.length">批量删除</el-button>
      </div>
      <div class="dataSetInfoRight">
        <div class="dataSetListBox">
          <span class="dataSetListIcon">
            <img src="/src/assets/svg/taskList.svg" />
          </span>
          <span class="dataSetListText">数据集条目</span>
          <span class="dataSetListNumber">0</span>
        </div>
        <div class="dataSetScoreBox">
          <span class="dataSetScoreIcon">
            <img src="/src/assets/svg/taskScore.svg" />
          </span>
          <span class="dataSetScoreText">数据集质量分数</span>
          <span class="dataSetScoreNumber">0</span>
        </div>
      </div>
    </div>
    <div>
      <el-table
        :data="tableData.data"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="30" />
        <el-table-column
          prop="question"
          label="问题"
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
                @input="handleEditRow(scope.row.id,'question',$event)"
                />
            </div>
            <template v-else>
              {{ scope.row.question }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="standardAnswer"
          label="标准答案"
          width="240">
          <template #default="scope">
            <div v-if="scope.row.onEdit">
              <el-input
                :model-value="handleGetRowData(scope.row, 'standardAnswer')"
                :rows="4"
                show-word-limit
                type="textarea"
                maxlength="200" />
            </div>
            <template v-else>
              {{ scope.row.standardAnswer }}
            </template>
          </template>
        </el-table-column>

        <el-table-column
          prop="fragmentContext"
          label="原始片段上下文" />
        <el-table-column
          prop="fragmentType"
          label="片段类型" />
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

const dataSetDrawerVisible = ref(false);
const dataSetInfoEdit = ref(true);
const dataSetInfo = ref();
const dataSetInfoEditVisible = ref(false);
const onEditList = ref<any>([]);
const tableData = ref({
  data: [
  ],
  editableKeys: ['question', 'standardAnswer'],
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
  () => {
    dataSetInfo.value = props.dataSetRow;
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
  const rowData = onEditList.value.find((i: { id: any }) => i.id === row.id);
  if (rowData) {
    return rowData.editingValue[property].value;
  }
};

const removeRowEditable = (row: { id: number }) => {
  const data = tableData.value.data.find((data) => data.id === row.id);
  const index = onEditList.value.findIndex((item: { id: any }) => item.id === row.id);
  if (data) {
    data.onEdit = false;
    if (index !== -1) {
      onEditList.value.splice(index, 1);
    }
  }
};

const handleStartEdit = (obj: any) => {
  const { row } = obj;
  const data = tableData.value.data.find((data) => data.id === row.id);
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
      id: row.id,
      editingValue,
    });
  }
};

const handleCancelEdit = ({ row }: any) => {
  removeRowEditable(row);
};

const handleSaveEdit = ({ row }: any) => {
  const tableItem: any = tableData.value.data.find((data) => data.id === row.id);
  const editItem = onEditList.value.find((item: { id: any }) => item.id === row.id);
  if (tableItem && editItem) {
    tableData.value.editableKeys.forEach((key) => {
      tableItem[key] = editItem.editingValue[key].value;
    });
  }

  removeRowEditable(row);
};

const handleEditRow = (id: any,property: string | number,value: any)=>{
  const rowData = onEditList.value.find((i: { id: any; })=>i.id === id);
  if(rowData)
  rowData.editingValue[property].value = value
}

const cancelClick = () => {};

const handleDataSetInfoEdit = (opsType: boolean) => {
  dataSetInfoEditVisible.value = opsType;
  dataSetInfoEdit.value = !opsType;
};

const handleDataSetInfoSave = () => {
  dataSetInfoEditVisible.value = false;
  dataSetInfoEdit.value = true;
};

const handleCloseDrawerVisible = () => {
  dataSetDrawerVisible.value = false;
  props.handleDataSetProps();
};

onMounted(() => {
  dataSetDrawerVisible.value = props.dataSetDrawerVisible;
});
</script>
