<template>
  <BaseChart
      ref="chartRef"
      :options="chartOptions"
      :container-style="containerStyle"
      :class-name="className"
      :loading="loading"
      :loading-text="loadingText"
      :theme="theme"
      :responsive="responsive"
      @chart-ready="handleChartReady"
      @chart-click="handleChartClick"
  />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseChart from './BaseChart.vue'

const props = defineProps({
  // 数据系列
  seriesData: {
    type: Array,
    required: true
  },
  // X轴数据
  xAxisData: {
    type: Array,
    default: () => []
  },
  // 图表标题
  title: {
    type: [String, Object],
    default: ''
  },
  // 是否平滑曲线
  smooth: {
    type: Boolean,
    default: true
  },
  // 是否显示面积图
  areaStyle: {
    type: [Boolean, Object],
    default: false
  },
  // 是否显示数据点
  showSymbol: {
    type: Boolean,
    default: true
  },
  // 网格配置
  grid: {
    type: Object,
    default: () => ({
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    })
  },
  // 颜色配置
  colors: {
    type: Array,
    default: () => ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
  },
  // 容器样式
  containerStyle: {
    type: Object,
    default: () => ({
      width: '100%',
      height: '400px'
    })
  },
  className: String,
  loading: Boolean,
  loadingText: String,
  theme: [String, Object],
  responsive: Boolean
})

const emit = defineEmits(['chart-ready', 'chart-click'])

const chartRef = ref(null)

// 计算图表配置
const chartOptions = computed(() => {
  return {
    title: props.title ? (typeof props.title === 'string' ? { text: props.title } : props.title) : undefined,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: props.seriesData.map(series => series.name),
      textStyle: {
        color: '#606266'
      }
    },
    grid: props.grid,
    xAxis: {
      type: 'category',
      data: props.xAxisData,
      axisLine: {
        lineStyle: {
          color: '#DCDFE6'
        }
      },
      axisLabel: {
        color: '#606266'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#DCDFE6'
        }
      },
      axisLabel: {
        color: '#606266'
      },
      splitLine: {
        lineStyle: {
          color: '#F2F6FC',
          type: 'dashed'
        }
      }
    },
    series: props.seriesData.map((series, index) => ({
      name: series.name,
      type: 'line',
      data: series.data,
      smooth: props.smooth,
      showSymbol: props.showSymbol,
      itemStyle: {
        color: props.colors[index % props.colors.length]
      },
      lineStyle: {
        width: 3,
        color: props.colors[index % props.colors.length]
      },
      areaStyle: props.areaStyle ? (
          typeof props.areaStyle === 'object' ? props.areaStyle : {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: props.colors[index % props.colors.length] + '40'
              }, {
                offset: 1,
                color: props.colors[index % props.colors.length] + '10'
              }]
            }
          }
      ) : undefined
    })),
    color: props.colors
  }
})

const handleChartReady = (instance) => {
  emit('chart-ready', instance)
}

const handleChartClick = (params) => {
  emit('chart-click', params)
}

// 暴露方法
defineExpose({
  getInstance: () => chartRef.value?.getInstance(),
  resize: () => chartRef.value?.resize(),
  dispose: () => chartRef.value?.dispose()
})
</script>