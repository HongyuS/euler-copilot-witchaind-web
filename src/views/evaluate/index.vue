<template>
  <CustomLoading :dark="false" :loading="loading" />
  <div class="evaluate-empty-content" v-if="!isSearch && testList.length === 0">
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
      <el-input v-model="searchPayload.testingName" placeholder="请输入评测名称" class="search-input" 
      @input="handleInput" :suffix-icon="IconSearch" />
    </div>
    <el-table ref="testingTableRef" :data="testList" style="width: 100%; 
      margin-bottom: 20px" row-key="datasetId" bordered default-expand-all 
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="datasetName" width="120" label="所用数据集" />
      <el-table-column prop="testingName" width="120" label="测试名称">
        <template #default="scope">
          <div class="test-name" @click="handleTestData(scope.row)"> {{ scope.row.testingName }} </div>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="简介" />
      <el-table-column prop="modelType" width="250" label="模型类型">
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
              <FilterContainr :filterList="llmOptions" filterType="checkBox"
                :handelSubFilterProper="handelModelFilterProper" :checkedFilterList="checkedFilterList" />
            </el-popover>
          </div>
        </template>
        <template #default="scope">
          <div v-if="scope.row.llm">
            <img :src="`data:image/svg+xml;base64,${scope.row.llm?.llmIcon}`"/>
            {{ scope.row.llm?.llmName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="searchMethod" width="150" label="检索方法">
        <template #header>
          <div class="custom-header">
            <span>检索方法</span>
            <el-icon ref="searchRef" @click.stop :class="searchFilterVisible
              ? 'searchIconIsActive'
              : ''
              ">
              <IconFilter />
            </el-icon>
            <el-popover ref="popoverRef" v-model:visible="searchFilterVisible" popper-class="filterPopper"
              placement="bottom-start" :virtual-ref="searchRef" :show-arrow="false" trigger="click" virtual-triggering>
              <FilterContainr :filterList="searchList" filterType="checkBox"
                :handelSubFilterProper="handelSearchFilterProper" :checkedFilterList="checkedFilterList" />
            </el-popover>
          </div>
        </template>
        <template #default="scope">
          <div v-if="scope.row.llm">
            {{ scope.row.searchMethod}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="topk" width="80" label="Top_k"></el-table-column>
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
          <div v-if="scope.row.testingTask?.taskStatus === StatusEnum.FAIL" class="statusFail">
            测试失败
          </div>
          <div v-if="scope.row.testingTask?.taskStatus === StatusEnum.SUCCESS" class="statusSuccess">
            测试成功
          </div>
          <div v-if="scope.row.testingTask?.taskStatus === StatusEnum.CANCEL" class="statusCancel">
            取消测试
          </div>
          <div v-if="scope.row.testingTask?.taskStatus === StatusEnum.ANALYSIS_ING" class="statusWaitIng">
            <div class="icon-box icon-loading"></div>
            等待测试
          </div>
          <div class="statusAnalysis" v-if="scope.row.testingTask?.taskStatus === StatusEnum.RUNNING">
            <div class="percent-box">
              <el-progress :percentage="scope.row?.testingTask?.taskCompleted ?? 0" color="#0077FF" striped striped-flow />
            </div>
            <div class="statusAnalysisText">
              测试中
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="aveScore" width="150" label="综合评分(0-100)">
        <template #header>
          <div class="custom-header">
            <span>综合评分(0-100)</span>
            <div class="sort-icon-box">
              <span class="caret-wrapper">
                <i class="sort-caret ascending" :class="scoreActive === 'asc'?'sort-up-active':''" @click="handleSortChange('asc')"></i>
                <i class="sort-caret descending" :class="scoreActive === 'desc'?'sort-down-active':''" @click="handleSortChange('desc')"></i>
              </span>
            </div>
          </div>
        </template>
        <template #default="scope">
          {{ scope.row.aveScore<0 ?'--':scope.row.aveScore}}
        </template>
      </el-table-column>
      <el-table-column prop="authorName" width="100" label="创建人">
        <template #header>
          <div class="custom-header">
            <span>创建人</span>
            <el-icon
              ref="creatorRef"
              :class="
                searchPayload?.authorName?.length! > 0 || creatorVisible ? 'searchIconIsActive' : ''
              ">
              <IconSearch />
            </el-icon>
            <el-popover
                  ref="popoverRef"
                  v-model:visible="creatorVisible"
                  popper-class="inputSearchFilterPopper"
                  placement="bottom-start"
                  :virtual-ref="creatorRef"
                  :show-arrow="false"
                  trigger="click"
                  virtual-triggering>
                  <FilterContainr
                    filterType="input"
                    v-model:serachName="searchPayload.authorName"
                    :hanldeSearhNameFilter="hanldeSearhNameFilter"
                    :searchPayload="searchPayload" />
                </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="finishedTime" width="150" label="完成时间">
        <template #default="scope">
          {{ convertUTCToLocalTime(scope.row.testingTask?.finishedTime)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <div v-if="!scope.row.datasetId">
            <el-button v-if="[StatusEnum.RUNNING,StatusEnum.ANALYSIS_ING].includes(scope.row.status) " type="text"
              @click="handleStopTesting(scope.row)">暂停</el-button>
            <el-button :disabled="scope.row.status === StatusEnum.SUCCESS" v-else type="text"
              @click="handleRunTesting(true, scope.row)">重启</el-button>
            <el-button :disabled="scope.row.status !== 'idle'" type="text"
              @click="handleDownload(scope.row)">下载</el-button>
            <el-button :disabled="scope.row.status === StatusEnum.RUNNING" type="text"
              @click="handleDelete([scope.row])">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="testList.length > 0" v-model:current-page="currentPage" v-model:page-size="currentPageSize"
      :page-sizes="pagination.pageSizes" :layout="pagination.layout" :total="totalCount" popper-class="kbLibraryPage"
       @change="handleChangePage" />
  </div>
  <testCase :visible="testDataVisible" :rowData="testRowData" :close="closeFn" />
</template>

<script setup lang="ts">
import "@/styles/evaluate.scss"
import EmptyStatus from '@/components/EmptyStatus/index.vue'
import { useGroupStore } from "@/store/modules/group";
import { StatusEnum } from "@/enums/KnowledgeEnum";
import { IconAlarm, IconCaretDown, IconCaretUp, IconFilter, IconSearch } from "@computing/opendesign-icons";
import testCase from "./testCase.vue";
import { storeToRefs } from "pinia";
import FilterContainr from "@/components/TableFilter/index.vue";
import EvaluateAPI from "@/api/evaluate";
import CustomLoading from '@/components/CustomLoading/index.vue';
import { debounce } from "lodash";
import dataSetAPI from "@/api/dataSet";
import KbAppAPI from "@/api/kbApp";
import { convertUTCToLocalTime } from "@/utils/convertUTCToLocalTime";
import { downloadFun } from "@/utils/downloadFun";

const route = useRoute();
const testList:any = ref([]);
const store = useGroupStore();
const { knowledgeTabActive } = storeToRefs(store);
const { handleKnowledgeTab } = store;
const batchDownBth = ref(false);
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
const searchFilterVisible = ref(false);
const creatorVisible = ref(false);
const searchRef = ref();
const modelRef = ref();
const statusRef = ref();
const creatorRef = ref();
const searchList = ref([]);
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
const checkedFilterList = ref([]);
const pollingKfTimer = ref();
const searchPayload = ref<{
  kbId?: string,
  testingId?: string,
  testingName?: string,
  llmId?: string[],
  runStatus?: string[],
  scoresOrder?: string | null,
  topK?:string,
  authorName?: string,
  searchMethod?: string,
}>({});
const llmOptions = ref<Array<{
    label: string,
    value: string,
    icon: string
}>>([]);

const scoreActive =ref<string | null>(null)

const isSearch = computed(()=>{
  return Object.values(searchPayload.value).some(value => {
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return true;
    return value !== null && value !== undefined; // 其他类型需非空
  });
})

const hanldeSearhNameFilter = (filterName: string) => {
  searchPayload.value.authorName = filterName;
  handleSearchData();
};

const handleSortChange = (order: string) => {
  if(order === scoreActive.value){
    scoreActive.value = null;
  }else{
    scoreActive.value = order;
  }
  searchPayload.value.scoresOrder = scoreActive.value;
  handleSearchData();
}
const handleSearchData = () => {
  handeAssetLibraryData(
    {
      page: 1,
      pageSize: currentPageSize.value ?? 20,
      kbId: route.query.kb_id as string,
      ...handleSearchPayload(),
      ...searchPayload.value,
    },
    true,
    true
  );
  statusFilterVisible.value = false;
  creatorVisible.value = false
};
const handleBatchDownBth = (e: boolean) => {
  batchDownBth.value = e;
};

const handleInput = debounce(() => {
  currentPage.value = 1;
  let param = {
    ...searchPayload.value,
    page: currentPage.value,
    pageSize: currentPageSize.value
  };
  loading.value = true;
  EvaluateAPI.testingList({kbId:route.query.kb_id,...param}).then((res: any) => {
    testList.value = res.datasetTestings?.map((item: any) => {
      const newItem={
        datasetId: item.datasetId,
        datasetName: item.datasetName,
        children:item.testings,
      }
      return newItem;
    });
    
 
  }).finally(() => {
    loading.value = false;
  })
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

const handleChangePage = (pageNum: number, pageSize: number) => {
  currentPage.value = pageNum;
  currentPageSize.value = pageSize;
  let param = {
    ...searchPayload.value,
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
    handeAssetLibraryData(
      {
        kbId: route.query.kb_id as string,
        page: 1,
        pageSize: 20,
      },
      true,
      true
    );
  })
}
const handleStopTesting = (row: any) => {
  ElMessageBox.confirm('确定暂停测试？点击确定后将停止测试，请谨慎操作。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      cancelButtonClass: 'el-button--primary',
      confirmButtonClass: 'el-button-confirm',
      type: 'warning',
      icon:markRaw(IconAlarm)
      }).then(() => {
        handleRunTesting(false, row);
      })
}
const handleDownload = (row: any) => {
  const url = `${window.origin}/witchaind/api/testing/download?testingId=${row.testingId}`;
  downloadFun(url);
}
const handleBatchDownload = () => {
  let flag = true;
  selectedRow.value.forEach((item: any) => {
    if (item.runStatus !== 'idle') {
      flag = false;
    }
  })
  if(!flag){
    ElMessage.error('只有【测试成功】的评测信息才可以下载！')
    return;
  }
  selectedRow.value.forEach((item: any) => {
    setTimeout(()=>{
      handleDownload(item)
    },300)
  })
}

const handleDelete = (arr: any) => {
  let idList = arr.map((item: any) => {
    return item.testingId
  })
  EvaluateAPI.deleteTesting(idList).then((res) => {
    handeAssetLibraryData(
      {
        kbId: route.query.kb_id as string,
        page: 1,
        pageSize: 20,
      },
      true,
      true
    );
  })
}

const handleBatchDelete = () => {
  handleDelete(selectedRow.value)
}
const handelStatusFilterProper = (filterList: any) => {
  searchPayload.value.runStatus = filterList;
  handleSearchData();
};
const handelModelFilterProper = (filterList: any) => {
  searchPayload.value.llmId = filterList;
  handleSearchData();
};
const handelSearchFilterProper = (filterList: any) => {
  searchPayload.value.searchMethod = filterList;
  handleSearchData();
}
const closeFn = () => {
  testDataVisible.value = false;
}

const queryTestList = (params: any) => {
  loading.value = true;
  EvaluateAPI.testingList({kbId:route.query.kb_id,...params}).then((res: any) => {
    testList.value = res.datasetTestings?.map((item: any) => {
      const newItem={
        datasetId: item.datasetId,
        datasetName: item.datasetName,
        children:item.testings,
      }
      return newItem;
    });
    
 
  }).finally(() => {
    loading.value = false;
  })
}
const handlePollAssetFileData = () => {
  EvaluateAPI.testingList({
    page: currentPage.value,
    pageSize: currentPageSize.value,
    kbId: route.query.kb_id as string,
    ...handleSearchPayload(),
  })
    .then((res: any) => {
      if (!res?.datasetTestings?.length && currentPage.value && currentPage.value !== 1) {
        currentPage.value = 1;
        handleSearchOpsData(true, true);
        return;
      }
      testList.value = (res?.datasetTestings || []).map((item: any) => {
        const newItem={
          datasetId: item.datasetId,
          datasetName: item.datasetName,
          children:item.testings,
        }
        return newItem;
      });
      
    })
    .finally(() => {
      loading.value = false;
    });
};
const handleStartPollTimer = () => {
  pollingKfTimer.value = setInterval(() => handlePollAssetFileData(), 15000);
};
const handleSearchPayload = () => {
  const searchParams = Object.keys(searchPayload.value || {}).reduce((pre: any, item) => {
    if (searchPayload.value?.[item]?.length > 0 && searchPayload.value?.[item] !== 'all') {
      pre[item] = searchPayload.value[item];
    }

    return pre;
  }, {});
  return searchParams || {};
};
const handleSearchOpsData = (loadingStatus: boolean, startPollTimer: boolean) => {
  handeAssetLibraryData(
    {
      page: currentPage.value,
      pageSize: currentPageSize.value,
      kbId: route.query.kb_id as string,
      ...handleSearchPayload(),
    },
    loadingStatus,
    startPollTimer
  );
};
const handeAssetLibraryData = (
  payload: any,
  loadingStatus: boolean,
  pollTimer: boolean
) => {
  if (pollTimer) {
    handleCleartTimer();
  }
  loading.value = loadingStatus;
  EvaluateAPI.testingList(payload)
    .then((res: any) => {
      if (!res?.datasetTestings?.length && currentPage.value && currentPage.value !== 1) {
        currentPage.value = 1;
        handleSearchOpsData(true, true);
        return;
      }
      testList.value = (res?.datasetTestings || []).map((item: any) => {
        const newItem={
          datasetId: item.datasetId,
          datasetName: item.datasetName,
          children:item.testings,
        }
        return newItem;
      });
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

watch(()=>knowledgeTabActive.value, () => {
  if (knowledgeTabActive.value === 'evaluation') {
    handeAssetLibraryData(
      {
        kbId: route.query.kb_id as string,
        page: 1,
        pageSize: 20,
      },
      true,
      true
    );
    dataSetAPI.queryLlmData().then((res:any)=>{
        llmOptions.value = res.llms?.map((item: any) => {
            return { label: item.llmName, value: item.llmId,icon:item.llmIcon };
        });
    })
    KbAppAPI.querySearchMethodList().then((res: any) => {
        searchList.value = res?.map((item: any) => {
            return { label: item, value: item };
        });
    });
  }else{
    handleCleartTimer();
  }
})
onMounted(() => {
  const kbId = route.query.kb_id;
  if (kbId?.length && knowledgeTabActive.value === 'evaluation' ) {
    handeAssetLibraryData(
      {
        kbId: kbId as string,
        page: 1,
        pageSize: 20,
      },
      true,
      true
    );
  }
});

const handleCleartTimer = () => {
  clearInterval(pollingKfTimer.value);
  pollingKfTimer.value = null;
};

onUnmounted(() => {
  handleCleartTimer();
});
</script>
