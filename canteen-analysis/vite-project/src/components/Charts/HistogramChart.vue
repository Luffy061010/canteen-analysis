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
  // 直方图数据（频数数组）
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  // 区间标签
  bins: {
    type: Array,
    required: true,
    default: () => []
  },
  // 图表标题
  title: {
    type: [String, Object],
    default: ''
  },
  // 柱状图颜色
  color: {
    type: String,
    default: '#5470c6'
  },
  // 是否显示数据标签
  showLabel: {
    type: Boolean,
    default: true
  },
  // X轴名称
  xAxisName: {
    type: String,
    default: '数值区间'
  },
  // Y轴名称
  yAxisName: {
    type: String,
    default: '频数'
  },
  // 是否显示网格线
  showGrid: {
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
      },
      formatter: (params) => {
        const data = params[0]
        return `${data.name}<br/>频数: ${data.value}`
      }
    },
    grid: props.grid,
    xAxis: {
      type: 'category',
      data: props.bins,
      name: props.xAxisName,
      nameLocation: 'end',
      nameTextStyle: {
        color: '#606266'
      },
      axisLine: {
        lineStyle: {
          color: '#DCDFE6'
        }
      },
      axisLabel: {
        color: '#606266',
        interval: 0,
        rotate: props.bins.some(label => label.length > 6) ? 45 : 0
      }
    },
    yAxis: {
      type: 'value',
      name: props.yAxisName,
      nameLocation: 'end',
      nameTextStyle: {
        color: '#606266'
      },
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
    series: [{
      name: '分布',
      type: 'bar',
      data: props.data,
      itemStyle: {
        color: props.color
      },
      label: props.showLabel ? {
        show: true,
        position: 'top',
        color: '#303133',
        fontSize: 12
      } : undefined,
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
