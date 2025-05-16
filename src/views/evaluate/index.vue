<template>
  <CustomLoading :dark="false" :loading="loading" />
  <div class="evaluate-empty-content" v-if="testList.length === 0">
    <EmptyStatus description="暂无评测信息，去数据集管理生成一个吧！" buttonText="去生成评测" buttonClass="group-btn" @click="handleCreate" />
  </div>
  <div class="group-table-box" v-else>
    <div class="test-manage-header">
      <el-dropdown placement="bottom" popper-class="kf-ops-dowlon dropdown-container"
        @visible-change="handleBatchDownBth" :disabled="!selectedRow.length">
        <el-button :class="{
          'upBtn': batchDownBth,
          'downBtn': !batchDownBth,
          'dropdown-disabled': !selectedRow.length
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
            <el-dropdown-item @click="handleBatchDownload" >
              批量下载
            </el-dropdown-item>
            <el-dropdown-item @click="handleBatchDelete" >
              {{ $t('btnText.batchDelete') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-input v-model="searchParam.testingName" placeholder="请输入评测名称" class="search-input" @input="handleInput"
        :suffix-icon="IconSearch" />
    </div>
    <el-table ref="testingTableRef" :data="testList" style="width: 100%; 
      margin-bottom: 20px" row-key="datasetId" bordered default-expand-all @selection-change="handleSelectionChange"
      @select="handleSelectRow" @sort-change="handleSortChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="dataName" width="120" label="所用数据集" />
      <el-table-column prop="testName" width="120" label="测试名称">
        <template #default="scope">
          <div class="test-name" @click="handleTestData(scope.row)"> {{ scope.row.testName }} </div>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="简介" />
      <el-table-column prop="modelType" width="150" label="模型类型">
        <template #header>
          <div class="custom-header">
            <span>模型类型</span>
            <el-icon ref="modelRef" @click.stop :class="modelFilterVisible
              ? 'searchIconIsActive'
              : ''
              ">
              <IconFilter />
            </el-icon>
            <el-popover ref="popoverRef" v-model:visible="modelFilterVisible" popper-class="filterPopper"
              placement="bottom-start" :virtual-ref="modelRef" :show-arrow="false" trigger="click" virtual-triggering>
              <FilterContainr :filterList="modelList" filterType="checkBox"
                :handelSubFilterProper="handelStatusFilterProper" :checkedFilterList="[]" />
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" width="200" label="状态">
        <template #header>
          <div class="custom-header">
            <span>状态</span>
            <el-icon ref="statusRef" @click.stop :class="statusFilterVisible
              ? 'searchIconIsActive'
              : ''
              ">
              <IconFilter />
            </el-icon>
            <el-popover ref="popoverRef" v-model:visible="statusFilterVisible" popper-class="filterPopper"
              placement="bottom-start" :virtual-ref="statusRef" :show-arrow="false" trigger="click" virtual-triggering>
              <FilterContainr :filterList="statusList" filterType="checkBox"
                :handelSubFilterProper="handelStatusFilterProper" :checkedFilterList="checkedFilterList" />
            </el-popover>
          </div>
        </template>
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
      <el-table-column prop="score" width="150" label="综合评分(0-100)">
        <template #header>
          <div class="custom-header">
            <span>综合评分(0-100)</span>
            <div class="sort-icon-box">
              <span class="caret-wrapper">
                <i class="sort-caret ascending" @click="handleSortChange('score', 'asc')"></i>
                <i class="sort-caret descending" @click="handleSortChange('score', 'desc')"></i>
              </span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="creator" width="100" label="创建人">
        <template #header>
          <div class="custom-header">
            <span>创建人</span>
            <el-icon ref="creatorRef" @click.stop :class="creatorFilterVisible
              ? 'searchIconIsActive'
              : ''
              ">
              <IconFilter />
            </el-icon>
            <el-popover ref="popoverRef" v-model:visible="creatorFilterVisible" popper-class="filterPopper"
              placement="bottom-start" :virtual-ref="creatorRef" :show-arrow="false" trigger="click" virtual-triggering>
              <FilterContainr :filterList="[]" filterType="checkBox" :handelSubFilterProper="handelStatusFilterProper"
                :checkedFilterList="[]" />
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" width="150" label="完成时间">
        <template #header>
          <div class="custom-header">
            <span>完成时间</span>
            <div class="sort-icon-box">
              <span class="caret-wrapper">
                <i class="sort-caret ascending" @click="handleSortChange('date', 'asc')"></i>
                <i class="sort-caret descending" @click="handleSortChange('date', 'desc')"></i>
              </span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <div v-if="!scope.row.dataName">
            <el-button v-if="scope.row.status === StatusEnum.RUNNING" type="text"
              @click="handleRunTesting(false, scope.row)">暂停</el-button>
            <el-button :disabled="scope.row.status === StatusEnum.SUCCESS" v-else type="text"
              @click="handleRunTesting(true, scope.row)">重启</el-button>
            <el-button :disabled="scope.row.status === StatusEnum.RUNNING" type="text"
              @click="handleDownload(scope.row)">下载</el-button>
            <el-button :disabled="scope.row.status === StatusEnum.RUNNING" type="text"
              @click="handleDelete([scope.row])">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="testList.length > 0" v-model:current-page="currentPage" v-model:page-size="currentPageSize"
      :page-sizes="pagination.pageSizes" :layout="pagination.layout" :total="totalCount" popper-class="kbLibraryPage"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" @change="handleChangePage" />
  </div>
  <testData :visible="testDataVisible" :rowData="testRowData" :close="closeFn" />
</template>

<script setup lang="ts">
import "@/styles/evaluate.scss"
import EmptyStatus from '@/components/EmptyStatus/index.vue'
import { useGroupStore } from "@/store/modules/group";
import { StatusEnum } from "@/enums/KnowledgeEnum";
import { IconCaretDown, IconCaretUp, IconFilter, IconSearch } from "@computing/opendesign-icons";
import testData from "./testData.vue";
import { storeToRefs } from "pinia";
import FilterContainr from "@/components/TableFilter/index.vue";
import EvaluateAPI from "@/api/evaluate";
import CustomLoading from '@/components/CustomLoading/index.vue';
import { debounce } from "lodash";

let testList = ref([
  {
    datasetId: 1,
    dataName: 'CVPR-2023',
    children: [
      {
        testId: 11,
        testName: '图像分类测试',
        desc: 'ResNet50在ImageNet数据集上的基准测试',
        modelType: 'ResNet-50',
        status: 'success',
        score: 92,
        creator: '张三',
        date: '2023-03-15 14:30',
      },
      {
        testId: 12,
        testName: '图像分类测试',
        desc: 'ResNet50在ImageNet数据集上的基准测试',
        modelType: 'ResNet-50',
        status: 'running',
        score: 91,
        creator: '张三',
        date: '2023-03-15 14:30',
      },
      {
        testId: 13,
        testName: '图像分类测试',
        desc: 'ResNet50在ImageNet数据集上的基准测试',
        modelType: 'ResNet-50',
        status: 'failed',
        score: 22,
        creator: '张三',
        date: '2023-03-15 14:30',
      },
      {
        testId: 14,
        testName: '图像分类测试',
        desc: 'ResNet50在ImageNet数据集上的基准测试',
        modelType: 'ResNet-50',
        status: 'pending',
        score: 77,
        creator: '张三',
        date: '2023-03-15 14:30',
      },
    ],
  },
  {
    datasetId: 2,
    dataName: 'CVPR-2024',
    children: [
      {
        testId: 11,
        testName: '图像分类测试',
        desc: 'ResNet50在ImageNet数据集上的基准测试',
        modelType: 'ResNet-50',
        status: 'success',
        score: 92,
        creator: '张三',
        date: '2023-03-15 14:30',
      },
      {
        testId: 12,
        testName: '图像分类测试',
        desc: 'ResNet50在ImageNet数据集上的基准测试',
        modelType: 'ResNet-50',
        status: 'running',
        score: 91,
        creator: '张三',
        date: '2023-03-15 14:30',
      },
      {
        testId: 13,
        testName: '图像分类测试',
        desc: 'ResNet50在ImageNet数据集上的基准测试',
        modelType: 'ResNet-50',
        status: 'failed',
        score: 22,
        creator: '张三',
        date: '2023-03-15 14:30',
      },
      {
        testId: 14,
        testName: '图像分类测试',
        desc: 'ResNet50在ImageNet数据集上的基准测试',
        modelType: 'ResNet-50',
        status: 'pending',
        score: 77,
        creator: '张三',
        date: '2023-03-15 14:30',
      },
    ],
  },
]);
const store = useGroupStore();
const { knowledgeTabActive } = storeToRefs(store);
const { handleKnowledgeTab } = store;
const batchDownBth = ref(false);
const inputValue = ref('');
const testingTableRef = ref();
const selectedRow = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalCount = ref(testList.value.length);
const currentPageSize = ref(20);
const pagination = ref({
  pageSizes: [10, 20, 30, 40, 50],
  layout: 'total,sizes,prev,pager,next,jumper',
});
const testDataVisible = ref(false);
let testRowData: any = ref({});
const modelFilterVisible = ref(false);
const statusFilterVisible = ref(false);
const creatorFilterVisible = ref(false);
const modelRef = ref();
const statusRef = ref();
const creatorRef = ref();
const modelList = ref([]);
let searchParam = ref({
  datasetId: "6586f21b",
  testingId: "",
  testingName: "",
  llmId: "",
  runStatus: "",
  scoresOrder: "asc",
  authorName: "",
})
const statusList = [
  {
    value: StatusEnum.SUCCESS,
    label: '测试成功',
  },
  {
    value: StatusEnum.FAIL,
    label: '测试失败',
  },
  {
    value: StatusEnum.ANALYSIS_ING,
    label: '等待测试',
  },
  {
    value: StatusEnum.RUNNING,
    label: '测试中',
  },
  {
    value: StatusEnum.CANCEL,
    label: '取消测试',
  },
]
const checkedFilterList = ref([
  {
    value: StatusEnum.SUCCESS,

  }
]);
const handleSortChange = (column: string, order: string) => {
}
const handleBatchDownBth = (e: boolean) => {
  batchDownBth.value = e;
};

const handleInput = debounce(() => {
  currentPage.value = 1;
  let param = {
    ...searchParam.value,
    page: currentPage.value,
    pageSize: currentPageSize.value
  };
  queryTestList(param);
}, 200);

const handleCreate = () => {
  handleKnowledgeTab('dataset');
}

const handleSelectionChange = (val: any) => {

  let selectArr: any = [];
  val.forEach((item: any) => {
    if (!item.datasetId) {
      selectArr.push(item)
    }
  })
  selectedRow.value = selectArr;
};

const handleSelectRow = (selection: any[], row: any) => {
  console.log(selection, row);
}

const handleChangePage = (pageNum: number, pageSize: number) => {
  console.log(pageNum, pageSize)
  currentPage.value = pageNum;
  currentPageSize.value = pageSize;
  let param = {
    ...searchParam.value,
    page: pageNum,
    pageSize: pageSize,
  };

  queryTestList(param);
};

const handleTestData = (row: any) => {
  testDataVisible.value = true;
  testRowData.value = row;
}
const handleRunTesting = (isRun: boolean, row: any) => {
  let param = {
    testingId: row.testingId,
    run: isRun,
  }
  EvaluateAPI.runTesting(param).then((res) => {

  })
}
const handleDownload = (row: any) => {
  const url = `${window.origin}/witchaind/api/testing/download?testingId=${row.testingId}`;
  const a = document.createElement('a');
  a.href = url;
  a.download = 'filename'; // 指定文件名
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
const handleBatchDownload = () => {
  selectedRow.value.forEach((item: any) => {
    setTimeout(()=>{
      handleDownload(item)
    },300)
  })
}
const handleDelete = (arr: any) => {
  console.log(arr);
  let idList = arr.map((item: any) => {
    return item.testingId
  })
  EvaluateAPI.deleteTesting(idList).then((res) => {
    console.log(res);
  })
}

const handleBatchDelete = () => {
  handleDelete(selectedRow.value)
}
const handelStatusFilterProper = (filterList: any) => {
  console.log(filterList);
};
const closeFn = () => {
  testDataVisible.value = false;
}

const queryTestList = (params: any) => {
  loading.value = true;
  EvaluateAPI.testingList(params).then((res: any) => {
    console.log(res);
    testList.value = res.testings;
  }).finally(() => {
    loading.value = false;
  })
}
watch(knowledgeTabActive, () => {
  if (knowledgeTabActive.value === 'evaluation') {
    console.log(knowledgeTabActive.value);
    let param = {
      ...searchParam.value,
      testingName: inputValue.value,
      page: currentPage.value,
      pageSize: currentPageSize.value
    };
    queryTestList(param);
  }
})
</script>
