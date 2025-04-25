<template>
  <div class="evaluate-empty-content" v-if="testList.length === 0">
        <EmptyStatus description="暂无评测信息，去数据集管理生成一个吧！" buttonText="去生成评测" buttonClass="group-btn" @click="handleCreate" />
    </div>
  <div class="group-table-box" v-else>
    <div class="test-manage-header">
      <el-dropdown placement="bottom" popper-class="kf-ops-dowlon dropdown-container"
        @visible-change="handleBatchDownBth" :disabled="true">
        <el-button :class="{
          'upBtn': batchDownBth,
          'downBtn': !batchDownBth,
          'dropdown-disabled': true
        }">
          批量操作
          <el-icon class="el-icon--right" v-if="!batchDownBth">
            <IconCaretDown />
          </el-icon>
          <el-icon class="el-icon--right el-icon--caretup" v-if="batchDownBth">
            <IconCaretUp />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              {{ $t('btnText.batchDelete') }}
            </el-dropdown-item>
            <el-dropdown-item>
              {{ $t('btnText.batchExport') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-input v-model="search" placeholder="请输入评测名称"  class="search-input" @keyup.enter="handleSearch" :suffix-icon="IconSearch"/>
    </div>
    <el-table :data="testList" style="width: 100%; margin-bottom: 20px" row-key="id" 
    bordered default-expand-all @selection-change="handleSelectionChange" >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="dataName" width="120" label="所用数据集" />
      <el-table-column prop="testName" width="120" label="测试名称">
        <template #default="scope">
          <div class="test-name" @click="handleTestData(scope.row)"> {{ scope.row.testName }} </div>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="简介" />
      <el-table-column prop="modelType" width="150" label="模型类型" />
      <el-table-column prop="status" width="200" label="状态">
        <template #default="scope">
          <div v-if="scope.row.status === StatusEnum.FAIL" class="statusFail">
            测试失败
          </div>
          <div v-if="scope.row.status === StatusEnum.SUCCESS" class="statusSuccess">
            测试成功
          </div>
          <div v-if="scope.row.status === StatusEnum.CANCEL" class="statusCancel">
            取消测试
          </div>
          <div v-if="scope.row.status === StatusEnum.ANALYSIS_ING" class="statusWaitIng">
            <div class="icon-box icon-loading"></div>
            等待测试
          </div>
          <div class="statusAnalysis" v-if="scope.row.status === StatusEnum.RUNNING">
            <div class="percent-box">
              <el-progress :percentage="scope.row?.reports?.[0]?.current_stage &&
                scope.row?.reports?.[0]?.stage_cnt
                ? Math.floor(
                  ((scope.row?.reports?.[0]?.current_stage || 0) /
                    (scope.row?.reports?.[0]?.stage_cnt || 0)) *
                  100
                )
                : 0
                " color="#0077FF" striped striped-flow />
            </div>
            <div class="statusAnalysisText">
              测试中
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="score" width="150" label="综合评分(0-100)" />
      <el-table-column prop="creator" width="100" label="创建人" />
      <el-table-column prop="date" width="150" label="创建时间" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <div v-if="!scope.row.dataName">
            <el-button v-if="scope.row.status === StatusEnum.RUNNING" type="text"
              @click="handleStop(scope.row)">暂停</el-button>
            <el-button :disabled="scope.row.status === StatusEnum.SUCCESS" v-else type="text"
              @click="handleRestart(scope.row)">重启</el-button>
            <el-button :disabled="scope.row.status === StatusEnum.RUNNING" type="text"
              @click="handleDownload(scope.row)">下载</el-button>
            <el-button :disabled="scope.row.status === StatusEnum.RUNNING" type="text"
              @click="handleDelete(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="testList.length > 0"
      v-model:current-page="currentPage"
      v-model:page-size="currentPageSize"
      :page-sizes="pagination.pageSizes"
      :layout="pagination.layout"
      :total="totalCount"
      popper-class="kbLibraryPage"
      @change="handleChangePage" />
  </div>
  <testData :visible="testDataVisible" :rowData="testRowData" @close="testDataVisible = false" />
</template>

<script setup lang="ts">
import "@/styles/evaluate.scss"
import EmptyStatus from '@/components/EmptyStatus/index.vue'
import { useGroupStore } from "@/store/modules/group";
import { testList } from "../group/data";
import { StatusEnum } from "@/enums/KnowledgeEnum";
import { IconCaretDown, IconCaretUp, IconSearch } from "@computing/opendesign-icons";
import testData from "./testData.vue";
import { storeToRefs } from "pinia";

const store = useGroupStore();
const { } = storeToRefs(store);
const { handleKnowledgeTab } = store;
const batchDownBth = ref(false);
const search = ref('');
const selectedRow = ref([]);
const currentPage = ref(1);
const totalCount = ref(testList.length);
const currentPageSize = ref(20);
const pagination = ref({
  pageSizes: [10, 20, 30, 40, 50],
  layout: 'total,sizes,prev,pager,next,jumper',
});
const testDataVisible = ref(false);
let testRowData: any = ref({});

const handleBatchDownBth = (e: boolean) => {
  batchDownBth.value = e;
};

const handleSearch = () => {};

const handleCreate = () => {
  handleKnowledgeTab('dataset');
}

const handleSelectionChange = (val: any) => {
  console.log(val);
  selectedRow.value = val;
};

const handleChangePage = (pageNum: number, pageSize: number) => {
  currentPage.value = pageNum;
  currentPageSize.value = pageSize;
};

const handleTestData = (row: any) => {
  testDataVisible.value = true;
  testRowData.value = row;
  console.log(row);
}
const handleStop = (row: any) => {
  console.log(row);
}
const handleRestart = (row: any) => {
  console.log(row);
}
const handleDownload = (row: any) => {
  console.log(row);
}
const handleDelete = (row: any) => {
  console.log(row);
}

</script>

<style lang="scss">
.group-table-box {
  padding: 4px 0 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 200px;
  .test-manage-header{
    display: flex;
    justify-content: space-between;
    .search-input{
      width: 300px;
      font-size: 12px;
    }
    .el-dropdown {
      margin-right: 8px;
  
      .dropdown-disabled {
        cursor: not-allowed;
        border: 1px solid rgb(191, 199, 215) !important;
        background-color: rgb(235, 237, 243);
        color: rgb(191, 199, 215) !important;
  
        &:hover,
        :active {
          cursor: not-allowed;
          background-color: rgb(235, 237, 243);
          color: rgb(191, 199, 215) !important;
        }
      }
  
    }
  }

  .el-table.is-scrolling-left.el-table--border .el-table-fixed-column--left.is-last-column.el-table__cell {
    border-right: unset !important;
  }

  .el-table__header {
    width: 100% !important;
    height: 32px;
    box-shadow: inset 0 -1px 0 0 rgb(223 229 239);

    thead tr th {
      background-color: #f4f6fa;
    }
  }

  .test-name {
    color: rgb(99, 149, 253);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
  }

  .statusAnalysis {
    display: flex;
    align-items: center;

    .percent-box {
      .el-progress-bar {
        width: 88px;
      }

      .el-progress__text {
        width: fit-content;
      }
    }

    .el-progress__text {
      width: 24px;
      min-width: 18px;
      color: rgb(0 0 0);
    }

    .statusAnalysisText {
      font-size: 12px;
      font-family: 'HarmonyOS Sans SC Medium';
      margin-left: 2px;
      color: rgb(0 0 0);
    }
  }

  .statusFail,
  .statusWaitIng,
  .statusSuccess,
  .statusCancel {
    height: 24px;
    width: fit-content;
    padding: 0px 8px;
    font-size: 12px;
    line-height: 24px;
    color: rgb(255 255 255);
    text-align: center;
    border-radius: 4px;
  }

  .statusFail {
    background: rgb(227, 32, 32);
  }

  .statusSuccess {
    background: rgb(36, 171, 54);
  }

  .statusCancel {
    background: rgb(141, 152, 170);
  }

  .statusWaitIng {

    background: rgb(250, 192, 84);
  }


  .el-table__body {
    width: 100% !important;

    .el-table__row {
      height: 48px;
    }
  }

  .el-table__cell {
    padding: 0 !important;
    font-size: 12px;
    color: black;
  }

  .el-table--border .el-table__cell:first-child .cell {
    padding: 0 12px !important;
  }

  .el-table-column--selection .cell {
    padding-right: 0 !important;
    padding-left: 22px;
  }

  .group-selection::after {
    content: unset !important;
  }

  .el-pagination {
    margin-top: 0;
  }

  .el-pagination .el-input__inner {
    height: var(--el-input-inner-height) !important;
  }
}

.el-table [class*=el-table__row--level] .el-table__expand-icon {
  width: 14px;
  position: absolute !important;
  left: -50px;
  top: 16px;
}
.group-table-box .el-table__header-wrapper .el-table-column--selection .el-checkbox .is-indeterminate.el-checkbox__input .el-checkbox__inner::before{
  top: 5px;
  transform: scaleY(0.5) translateX(3px);
}
</style>
