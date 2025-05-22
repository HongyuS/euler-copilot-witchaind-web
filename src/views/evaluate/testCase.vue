<template>
    <el-drawer v-model="props.visible" @close="handleClose" :show-close="props.rowData?.testingTask?.taskStatus !== 'success'" size="70%"
        :destroy-on-close="false">
        <template #header>
            <h4 class="drawer-title">{{ props.rowData?.testingName }}</h4>
            <el-button v-if="props.rowData?.testingTask?.taskStatus === 'success'" @click="handleDownloadReport" >
                下载报告
            </el-button>
        </template>
        <template #default>
            <div class="empty-container" v-if="props.rowData?.status === 'pending'">
                <el-empty description="等待测试" :image="empty_pending" />
            </div>
            <div class="empty-container" v-else-if="props.rowData?.status === 'failed'">
                <el-empty description="测试失败" :image="empty_failed" />
            </div>
            <div class="empty-container" v-else-if="props.rowData?.status === 'running'">
                <el-empty description="测试中..." :image="empty_running" />
            </div>
            <div v-else>
                <div class="chart-container">
                    <div id="rightChart"></div>
                    <div id="leftChart"></div>
                </div>
                <div class="table-container">
                    <el-table :data="testCaseList" row-key="id" bordered>
                        <el-table-column prop="question" width="150" label="问题" fixed>
                            <template #default="scope">
                                <el-tooltip
                                    class="box-item"
                                    effect="dark"
                                    :content="scope.row.question"
                                    placement="top"
                                >
                                    <div class="dataChunkText">{{ scope.row.question }}</div>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column prop="answer" width="300" label="标准答案" fixed >
                            <template #default="scope">
                                <el-tooltip
                                    class="box-item"
                                    effect="dark"
                                    :content="scope.row.answer"
                                    placement="top"
                                >
                                    <div class="dataChunkText">{{ scope.row.answer }}</div>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column prop="llmAnswer" width="300" label="大模型的回答" >
                            <template #default="scope">
                                <el-tooltip
                                    class="box-item"
                                    effect="dark"
                                    :content="scope.row.llmAnswer"
                                    placement="top"
                                >
                                    <div class="dataChunkText">{{ scope.row.llmAnswer }}</div>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column prop="relatedChunk" width="300" label="检索到的片段" >
                            <template #default="scope">
                                <el-tooltip
                                    class="box-item"
                                    effect="dark"
                                    :content="scope.row.relatedChunk"
                                    placement="top"
                                >
                                    <div class="dataChunkText">{{ scope.row.relatedChunk }}</div>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column prop="docName" width="150" label="来源文档" >
                            <template #default="scope">
                                <el-tooltip
                                    class="box-item"
                                    effect="dark"
                                    :content="scope.row.docName"
                                    placement="top"
                                >
                                    <div class="dataChunkText">{{ scope.row.docName }}</div>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column prop="score" width="150" label="综合得分" />
                        <el-table-column prop="pre" width="60" label="精确率" fixed="right" />
                        <el-table-column prop="rec" width="60" label="召回率" fixed="right" />
                        <el-table-column prop="fai" width="60" label="忠实值" fixed="right" />
                        <el-table-column prop="rel" width="90" label="可解释性" fixed="right" />
                        <el-table-column prop="lcs" width="120" label="最长公共子串得分" fixed="right" />
                        <el-table-column prop="leve" width="100" label="编辑距离得分" fixed="right" />
                        <el-table-column prop="jac" width="120" label="杰卡徳相似系数" fixed="right" />
                    </el-table>
                    <el-pagination v-model:current-page="currentPage" v-model:page-size="currentPageSize"
                        :page-sizes="pagination.pageSizes" :layout="pagination.layout" :total="totalCount"
                        popper-class="kbLibraryPage" @change="handleChangePage" />
                </div>
            </div>
        </template>
        <template #footer>
            <el-button @click="handleClose">关闭</el-button>
        </template>
    </el-drawer>
</template>
<script lang='ts' setup>
import EvaluateAPI from '@/api/evaluate';
import * as echarts from 'echarts';
import { onMounted, onBeforeUnmount, watch, nextTick, ref } from 'vue';
import empty_pending from '@/assets/images/empty_pending.svg'
import empty_failed from '@/assets/images/empty_failed.svg'
import empty_running from '@/assets/images/empty_running.svg'
import { downloadFun } from '@/utils/downloadFun';

const props = defineProps({
    visible: Boolean,
    rowData: Object,
    close: Function,
});

const currentPage = ref(1);
const totalCount = ref(0);
const currentPageSize = ref(20);
const pagination = ref({
    pageSizes: [10, 20, 30, 40, 50],
    layout: 'total,sizes,prev,pager,next,jumper',
});

const handleChangePage = (pageNum: number, pageSize: number) => {
    currentPage.value = pageNum;
    currentPageSize.value = pageSize;
    queryTestCase();
};

let chartInstanceR: echarts.ECharts | null = null;
let chartInstanceL: echarts.ECharts | null = null;
let resizeTimer: NodeJS.Timeout | null = null;

const testCaseAvg = ref({
    aveScore:0,
    avePre:0,
    aveRec:0,
    aveFai:0,
    aveRel:0,
    aveLcs:0,
    aveLeve:0,
    aveJac:0,
})
const testCaseList = ref([
    {
        testCaseId: 'testCaseId',
        question: 'question',
        answer: 'answer',
        llm_answer: 'llm_answer',
        related_chunk: 'related_chunk',
        doc_name: 'doc_name',
        score: 'score',
        pre: 'pre',
        rec: 'rec',
        fai: 'fai',
        rel: 'rel',
        lcs: 'lcs',
        leve: 'leve',
        jac: 'jac',
        
    }
])

// 防抖处理resize
const debounceResize = () => {
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(() => {
        if (chartInstanceR && chartInstanceL && props.visible) {
            chartInstanceR.resize();
            chartInstanceL.resize();
        }
    }, 100);
};

const initChart = async () => {
    try {
        // 等待DOM更新
        await nextTick();

        // 基于准备好的dom，初始化echarts实例
        const chartDom = document.getElementById('rightChart');
        const chartDomL = document.getElementById('leftChart');
        if (!chartDom || !chartDomL) {
            console.error('Chart DOM element not found');
            return;
        }

        // 如果已经有实例，先销毁
        if (chartInstanceR) {
            chartInstanceR.dispose();
        }
        if (chartInstanceL) {
            chartInstanceL.dispose();
        }

        chartInstanceR = echarts.init(chartDom);
        chartInstanceL = echarts.init(chartDomL);

        chartInstanceR.setOption({
            title: {
                text: '综合评分',
                left: 'left',
                textStyle: {
                    fontSize: 14,
                    color: '#333',
                    fontWeight: '700',
                }
            },
            series: [
                {
                    type: 'gauge',
                    min: 0, //最大值
                    max: 100, //最小值
                    startAngle: 225, //仪表盘起始角度。正右手侧为0度，正上方为90度，正左手侧为180度。
                    endAngle: -45, //仪表盘结束角度
                    itemStyle: {
                        color: '#f37215', //颜色
                        shadowColor: 'rgba(0,138,255,0.45)', //阴影颜色
                        shadowBlur: 10, //图形阴影的模糊大小
                        shadowOffsetX: 2, //阴影水平方向上的偏移距离
                        shadowOffsetY: 2 //阴影垂直方向上的偏移距离
                    },
                    progress: {
                        show: true, //是否显示进度条
                        width: 10, //进度条宽度
                        itemStyle: {
                            color: {
                                type: 'linear',
                                x: 1,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 1,
                                        color: 'green' // 0% 处的颜色
                                    },
                                    {
                                        offset: 0.7,
                                        color: 'yellow' // 100% 处的颜色
                                    },
                                    {
                                        offset: 0.3,
                                        color: 'orange' // 100% 处的颜色
                                    },
                                    {
                                        offset: 0,
                                        color: 'red' // 100% 处的颜色
                                    }
                                ],
                                global: false // 缺省为 false
                            }
                        }
                    },
                    pointer: {
                        icon: 'triangle',
                        width: 8,
                        length: '10%',
                        itemStyle: {
                            color: 'black',
                            shadowColor: 'rgba(0,0,0,0.3)',
                            shadowBlur: 8
                        },
                        offsetCenter: [0, '-60%']
                    },
                    axisLine: {
                        show: false, //是否显示仪表盘轴线
                        lineStyle: {
                            width: 18 //轴线宽度
                        }
                    },
                    axisTick: {
                        show: false, //是否显示刻度
                        distance: -29,
                        itemStyle: {
                            color: '#fff',
                            width: 2
                        }
                    },
                    splitLine: {
                        show: false, //是否显示分隔线
                    },
                    axisLabel: {
                        show: false, //是否显示标签
                    },
                    title: {
                        show: true, //是否显示标题
                    },
                    detail: {
                        show: true, //是否显示详情
                        valueAnimation: true, //是否开启标签的数字动画
                        offsetCenter: [0, 0], //相对于仪表盘中心的偏移位置
                        fontSize: 32, //文字的字体大小
                        color: 'black',
                        fontWeight: 'bolder', //文字字体的粗细
                        backgroundColor: 'white', // 添加白色背景
                        borderRadius: 100, // 设置圆形边框
                        padding: [10, 10, 10, 10], // 设置内边距使背景更大
                        width: 120, // 设置背景宽度
                        height: 120, // 设置背景高度
                        shadowColor: 'rgba(141,152,170,0.4)',
                        shadowBlur: 20, // 阴影模糊大小

                    },
                    data: [
                        {
                            value: props.rowData?.aveScore >= 0 ? props.rowData?.aveScore : 0,
   
                        }
                    ]
                }
            ]
        });
        chartInstanceL.setOption({
            color: ['rgb(141,152,170)'],
            textStyle: {
                color: 'rgb(141,152,170)'
            },
            lineStyle: {
                color: 'rgb(141,152,170)'
            },
            grid: {
                left: '2%',    // 左侧距离容器3%宽度（百分比更适配响应式）
                right: '1%',   // 右侧距离容器3%宽度
                bottom: '1%',   // 底部距离容器3%宽度
                top: '22%',    // 顶部距离容器3%宽度
                containLabel: true // 确保坐标轴标签不被截断[3,5](@ref)
            },
            title: {
                text: '评估质量',
                textStyle: {
                    fontSize: 14,
                }
            },
            xAxis: {
                data: ['平均精确率', '平均召回率', '平均忠实值', '平均可解释性', '平均最长公共子串得分', '平均编辑距离得分', '平均杰卡徳相似系数'],
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgb(141,152,170)',
                    }
                }

            },
            yAxis: {
                interval: 50,
                type: 'value',
                name: '分数（分）',
                textStyle: {
                    color: 'black',
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: 'rgb(141,152,170)',
                        dash: [30, 15],   // [实线长度, 间隔长度]（数值越大越稀疏）
                        opacity: 0.5
                    }
                }
            },
            series: [
                {
                    type: 'bar',
                    data: Object.values(testCaseAvg.value),
                    barWidth: '10%',
                    itemStyle: {
                        color: 'rgb(0,98,220)',
                        borderWidth: 1,
                        shadowColor: 'rgba(0,92,219,0.2)',
                        shadowBlur: 10,
                        shadowOffsetX: 4,
                        shadowOffsetY: 8,

                    }
                }
            ]
        })
    } catch (error) {
        console.error('Failed to initialize chart:', error);
    }
}

// 监听窗口大小变化
onMounted(() => {
    window.addEventListener('resize', debounceResize);
});

const queryTestCase = ()=>{
    let params={
        page:currentPage.value,
        pageSize:currentPageSize.value,
        testingId: props.rowData?.testingId
    }
    EvaluateAPI.testingCase(params).then((res:any) => {
        testCaseAvg.value = {
            aveScore:res.aveScore<0?0:res.aveScore,
            avePre:res.avePre<0?0:res.avePre,
            aveRec:res.aveRec<0?0:res.aveRec,
            aveFai:res.aveFai<0?0:res.aveFai,
            aveRel:res.aveRel<0?0:res.aveRel,
            aveLcs:res.aveLcs<0?0:res.aveLcs,
            aveLeve:res.aveLeve<0?0:res.aveLeve,
            aveJac:res.aveJac<0?0:res.aveJac,
        };
        testCaseList.value = res.testCases;
        totalCount.value = res.total;
    }).finally(() => {
        // 初始化图表
        initChart();
    })
}

// 监听visible变化，处理图表清理
watch(() => props.visible, (newVal) => {
    if (newVal) {
        // drawer打开时初始化数据
        queryTestCase();
    } else {
        // drawer关闭时清理图表实例
        if (chartInstanceR) {
            chartInstanceR.dispose();
            chartInstanceR = null;
        }
        if (chartInstanceL) {
            chartInstanceL.dispose();
            chartInstanceL = null;
        }
    }
}, { immediate: true });

// 组件销毁前清理
onBeforeUnmount(() => {
    if (chartInstanceR) {
        chartInstanceR.dispose();
        chartInstanceR = null;
    }
    if (chartInstanceL) {
        chartInstanceL.dispose();
        chartInstanceL = null;
    }
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }
    window.removeEventListener('resize', debounceResize);
});

const handleClose = () => {
    props.close?.();
}

const handleDownloadReport = () => {
    const url = `${window.origin}/witchaind/api/testing/download?testingId=${props.rowData?.testingId}`;
    downloadFun(url);
}
</script>

<style lang="scss">
.el-drawer__header {
    padding: 24px 24px 0;
    margin-bottom: 0;

    .drawer-title {
        font-size: 16px;
        font-weight: 700;
        color: black;
        line-height: 32px;
    }
}

.el-drawer__body {
    padding: 16px 24px 24px 24px;

    .empty-container {
        height: calc(100vh - 192px);
        display: flex;
        align-items: center;
        justify-self: center;

        .el-empty__image {
            width: 320px;
            height: 130px;
        }
    }
}

.chart-container {
    display: flex;
    gap: 16px;

    #rightChart {
        width: 23%;
        height: 300px;
        background-color: rgb(244, 246, 250);
        border-radius: 8px;
        padding: 16px;
        display: flex;
        justify-content: center;
    }

    #leftChart {
        width: 75%;
        height: 256px;
        min-height: 300px;
        background-color: rgb(244, 246, 250);
        border-radius: 8px;
        padding: 16px;
    }
}

.table-container {
    margin-top: 16px;
    overflow-x: auto; // 添加横向滚动支持

    .el-table {
        min-width: 1200px; // 设置表格的最小宽度，确保中间列在小屏幕上不会被隐藏
    }

    .el-table.is-scrolling-left.el-table--border .el-table-fixed-column--left.is-last-column.el-table__cell {
        border-right: unset !important;
    }

    .el-table.is-scrolling-left th.el-table-fixed-column--right,
    .el-table.is-scrolling-left th.el-table-fixed-column--left,
    .el-table.is-scrolling-middle th.el-table-fixed-column--right,
    .el-table.is-scrolling-middle th.el-table-fixed-column--left,
    .el-table.is-scrolling-right th.el-table-fixed-column--right,
    .el-table.is-scrolling-right th.el-table-fixed-column--left {
        background-color: #f4f6fa;

    }

    .el-table__header {
        width: 100% !important;
        height: 32px;
        box-shadow: inset 0 -1px 0 0 rgb(223 229 239);

        thead tr th {
            background-color: #f4f6fa;
        }
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
        margin-top: 16px;
    }

    .el-pagination .el-input__inner {
        height: var(--el-input-inner-height) !important;
    }

    .dataChunkText{
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1; /* 控制显示行数 */
        text-overflow: ellipsis;
      }

}

.el-drawer__footer {
    box-shadow: 0 -8px 16px 0 rgba(0, 0, 0, 0.1);
    padding: 8px 24px;
}
</style>