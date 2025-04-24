<template>
    <el-drawer 
        v-model="props.visible" 
        :show-close="false"
        size="70%"
        :destroy-on-close="false"
    >
        <template #header="{ close, titleId, titleClass }">
            <h4 :id="titleId" :class="titleClass">{{props.rowData?.testName}}</h4>
            <el-button @click="close">
                下载报告
            </el-button>
        </template>
        <div class="chart-container">
            <div id="rightChart"></div>
            <div id="leftChart"></div>
        </div>
    </el-drawer>
</template>
<script lang='ts' setup>
import * as echarts from 'echarts';
import { onMounted, onBeforeUnmount, watch, nextTick, ref } from 'vue';

const props = defineProps({
    visible: Boolean,
    rowData: Object,
});

let chartInstance: echarts.ECharts | null = null;
let chartInstanceL: echarts.ECharts | null = null;
let resizeTimer: NodeJS.Timeout | null = null;

// 防抖处理resize
const debounceResize = () => {
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(() => {
        if (chartInstance && props.visible) {
            chartInstance.resize();
        }
    }, 100);
};
// 计算环形渐变方向的核心函数
function getCoordinates(startAngle:number, endAngle:number) {
  const startRad = (startAngle - 90) * Math.PI / 180; // 转换为弧度（坐标系偏移90度）
  const endRad = (endAngle - 90) * Math.PI / 180;

  // 计算起点和终点在圆上的坐标（基于0.5,0.5的圆心）
  const x = 0.5 + 0.5 * Math.cos(startRad);
  const y = 0.5 + 0.5 * Math.sin(startRad);
  const x2 = 0.5 + 0.5 * Math.cos(endRad);
  const y2 = 0.5 + 0.5 * Math.sin(endRad);

  return { x, y, x2, y2 };
}

// 示例：当圆环从225度开始到-45度结束时
const coords = getCoordinates(225, -45); // 返回{x: 0.146, y: 0.146, x2: 0.854, y2: 0.854}
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
        if (chartInstance) {
            chartInstance.dispose();
        }
        
        chartInstance = echarts.init(chartDom);
        chartInstanceL = echarts.init(chartDomL);
        const option = {
  // 鼠标悬浮的提示
  tooltip: {
    formatter: '{b} : {c}'
  },
  series: [
    {
      type: 'gauge',
      min: 0, //最大值
      max: 100, //最小值
      startAngle: 200, //仪表盘起始角度。正右手侧为0度，正上方为90度，正左手侧为180度。
      endAngle: -20, //仪表盘结束角度
      itemStyle: {
        color: '#f37215', //颜色
        shadowColor: 'rgba(0,138,255,0.45)', //阴影颜色
        shadowBlur: 10, //图形阴影的模糊大小
        shadowOffsetX: 2, //阴影水平方向上的偏移距离
        shadowOffsetY: 2 //阴影垂直方向上的偏移距离
      },
      progress: {
        show: true, //是否显示进度条
        width: 18, //进度条宽度
        itemStyle: {
          color: {
            type: 'linear',
            x: 1,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'green' // 0% 处的颜色
              },
              {
                offset: 0.3,
                color: 'yellow' // 100% 处的颜色
              },
              {
                offset: 0.7,
                color: 'orange' // 100% 处的颜色
              },
              {
                offset: 1,
                color: 'red' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        }
      },
      pointer: {
        show: false, //是否显示指针
        itemStyle: {
          color: {
            type: 'linear',
            x: 1,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#f12711' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#f5af19' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        }
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
        borderRadius: 8, //文字块的圆角
        // offsetCenter: [0, '70%'], //相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比
        fontSize: 50, //文字的字体大小
        fontWeight: 'bolder', //文字字体的粗细
        formatter: '{value}', //格式化函数或者字符串
      },
      data: [
        {
          value: 90,
          name: '高危'
        }
      ]
    }
  ]
};

chartInstance.setOption(option);

        // chartInstance.setOption({
        //     title: {
        //         text: '85',
        //         x: 'center',
        //         y: 'center',
        //         textStyle: {
        //             fontSize: 36,
        //             fontWeight: 'bold',
        //             color: '#333'
        //         }
        //     },
        //     series: [
        //         {
        //             type: 'gauge',
        //             radius: ['70%', '80%'],
        //             startAngle: 225,            // 左下角起始（角度坐标系：0度为右侧，顺时针增加）
        //             endAngle: -45,              // 右下角结束（等效315度）
        //             clockWise: true,            // 顺时针填充
        //             data: [
        //                 {
        //                     value: 85,
        //                     name: '完成率',
        //                     itemStyle: {
        //                         color: {
        //                             type: 'linear',
        //                            ...coords,
        //                            colorStops: [
        //                                 { offset: 0.0, color: '#00FF00' },   // 0%位置：绿色
        //                                 { offset: 0.5, color: '#FFFF00' },   // 50%位置：黄色
        //                                 { offset: 0.75, color: '#FFA500' },  // 75%位置：橙色
        //                                 { offset: 1.0, color: '#FF0000' }    // 100%位置：红色
        //                             ],
        //                             globalCoord: false  // 确保渐变基于图形坐标系[5](@ref)
        //                         }
        //                     }
        //                 },
        //                 {
        //                     value: 15,
        //                     name: '剩余',
        //                     itemStyle: {
        //                         color: '#EBEEF5'
        //                     }
        //                 }
        //             ],
        //             label: {
        //                 show: false
        //             },
        //             hoverAnimation: false,
        //             silent: true
        //         }
        //     ]
        // });

        chartInstanceL.setOption({
            color: ['rgb(141,152,170)'],
            textStyle: {
                color: 'rgb(141,152,170)'
            },
            lineStyle: {
                color: 'rgb(141,152,170)' 
            },
            grid: {
                left: '1%',    // 左侧距离容器3%宽度（百分比更适配响应式）
                right: '1%',   // 右侧距离容器3%宽度
                containLabel: true // 确保坐标轴标签不被截断[3,5](@ref)
            },
            title: { text: '评估质量' },  // 继承全局字体颜色
            xAxis: {
                data: ['上下文相关性', '召回率', '忠实性', '答案的相关性', '最大公共子串', '编辑距离', '杰卡徳距离'],
            },
            yAxis: {
                interval:50,
                type: 'value',
                name:'分数（分）',
                textStyle: {
                    color: 'black',
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed', 
                        color: 'rgb(141,152,170)', 
                        dash: [30,15],   // [实线长度, 间隔长度]（数值越大越稀疏）
                        opacity: 0.5
                    }
                }
            },
            series: [
                {
                    type: 'bar',
                    data: [76, 70, 78, 80, 74, 82, 77],
                    barWidth: '10%',
                    itemStyle: {
                        color:'rgb(0,98,220)',
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

// 监听visible属性变化
watch(() => props.visible, async (newVal) => {
    if (newVal) {
        // 添加小延时确保DOM已经渲染
        setTimeout(async () => {
            await initChart();
        }, 100);
    }
}, { immediate: true });

// 监听窗口大小变化
onMounted(() => {
    window.addEventListener('resize', debounceResize);
});

// 监听visible变化，处理图表清理
watch(() => props.visible, (newVal) => {
    if (newVal) {
        // 添加小延时确保DOM已经渲染
        setTimeout(async () => {
            await initChart();
        }, 100);
    } else {
        // drawer关闭时清理图表实例
        if (chartInstance) {
            chartInstance.dispose();
            chartInstance = null;
        }
    }
}, { immediate: true });

// 组件销毁前清理
onBeforeUnmount(() => {
    if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
    }
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }
    window.removeEventListener('resize', debounceResize);
});

</script>

<style scoped>
.chart-container {
    width: 100%;
    height: 400px;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

#rightChart {
    width: 270px;
    height: 256px;
    min-height: 300px;
    /* transition: all 0.3s ease; */
    background-color: rgb(244,246,250);
    border-radius: 8px;
    padding: 16px;
}
#leftChart {
    width: 920px;
    height: 256px;
    min-height: 300px;
    transition: all 0.3s ease;
    background-color: rgb(244,246,250);
    border-radius: 8px;
    padding: 16px;
}

:deep(.el-drawer__body) {
    padding: 0;
    overflow: hidden;
}
</style>