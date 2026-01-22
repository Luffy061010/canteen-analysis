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
  // 散点图数据
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  // 图表标题
  title: {
    type: [String, Object],
    default: ''
  },
  // X轴名称
  xAxisName: {
    type: String,
    default: 'X轴'
  },
  // Y轴名称
  yAxisName: {
    type: String,
    default: 'Y轴'
  },
  // 散点大小
  symbolSize: {
    type: Number,
    default: 10
  },
  // 是否显示网格线
  showGrid: {
    type: Boolean,
    default: true
  },
  // 是否显示图例
  showLegend: {
    type: Boolean,
    default: true
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
      trigger: 'item',
      formatter: (params) => {
        return `${params.seriesName}<br/>X: ${params.value[0]}<br/>Y: ${params.value[1]}`
      }
    },
    legend: {
      show: props.showLegend,
      data: props.data.map(series => series.name),
      textStyle: {
        color: '#606266'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      show: props.showGrid
    },
    xAxis: {
      type: 'value',
      name: props.xAxisName,
      nameLocation: 'end',
      axisLine: {
        lineStyle: {
          color: '#DCDFE6'
        }
      },
      axisLabel: {
        color: '#606266'
      },
      splitLine: {
        show: props.showGrid,
        lineStyle: {
          color: '#F2F6FC',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: props.yAxisName,
      nameLocation: 'end',
      axisLine: {
        lineStyle: {
          color: '#DCDFE6'
        }
      },
      axisLabel: {
        color: '#606266'
      },
      splitLine: {
        show: props.showGrid,
        lineStyle: {
          color: '#F2F6FC',
          type: 'dashed'
        }
      }
    },
    series: props.data.map((series, index) => ({
      name: series.name,
      type: 'scatter',
      data: series.data,
      symbolSize: props.symbolSize,
      itemStyle: {
        color: props.colors[index % props.colors.length]
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
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