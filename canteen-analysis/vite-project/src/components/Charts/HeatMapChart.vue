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
  // 热力图数据
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  // X轴标签
  xLabels: {
    type: Array,
    default: () => []
  },
  // Y轴标签
  yLabels: {
    type: Array,
    default: () => []
  },
  // 图表标题
  title: {
    type: [String, Object],
    default: ''
  },
  // 颜色配置
  colors: {
    type: Array,
    default: () => ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
  },
  // 是否显示视觉映射组件
  showVisualMap: {
    type: Boolean,
    default: true
  },
  // 视觉映射配置
  visualMap: {
    type: Object,
    default: () => ({
      min: 0,
      max: 100,
      calculable: true,
      orient: 'vertical',
      left: 'right',
      top: 'center'
    })
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

// 计算热力图配置
const chartOptions = computed(() => {
  return {
    title: props.title ? (typeof props.title === 'string' ? { text: props.title } : props.title) : undefined,
    tooltip: {
      position: 'top',
      formatter: (params) => {
        const xIndex = params.data[0]
        const yIndex = params.data[1]
        const value = params.data[2]
        return `${props.yLabels[yIndex]} - ${props.xLabels[xIndex]}<br/>值: ${value}`
      }
    },
    grid: props.grid,
    xAxis: {
      type: 'category',
      data: props.xLabels,
      splitArea: {
        show: true
      },
      axisLabel: {
        color: '#606266'
      }
    },
    yAxis: {
      type: 'category',
      data: props.yLabels,
      splitArea: {
        show: true
      },
      axisLabel: {
        color: '#606266'
      }
    },
    visualMap: props.showVisualMap ? {
      ...props.visualMap,
      inRange: {
        color: props.colors
      }
    } : undefined,
    series: [{
      name: '热力图',
      type: 'heatmap',
      data: props.data,
      label: {
        show: true,
        formatter: (params) => {
          return params.data[2]
        }
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
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
