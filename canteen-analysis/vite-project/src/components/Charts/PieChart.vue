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
  // 饼图数据
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
  // 是否显示图例
  showLegend: {
    type: Boolean,
    default: true
  },
  // 图例位置
  legendPosition: {
    type: String,
    default: 'right', // left, right, top, bottom
    validator: (value) => ['left', 'right', 'top', 'bottom'].includes(value)
  },
  // 饼图半径
  radius: {
    type: [String, Array],
    default: ['40%', '70%'] // 内外半径，可以设置为字符串或数组
  },
  // 是否显示标签
  showLabel: {
    type: Boolean,
    default: true
  },
  // 标签位置
  labelPosition: {
    type: String,
    default: 'outside', // outside, inside, inner
    validator: (value) => ['outside', 'inside', 'inner'].includes(value)
  },
  // 颜色配置
  colors: {
    type: Array,
    default: () => ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']
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
      formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
    },
    legend: {
      show: props.showLegend,
      orient: props.legendPosition === 'left' || props.legendPosition === 'right' ? 'vertical' : 'horizontal',
      left: props.legendPosition === 'left' ? 'left' : props.legendPosition === 'right' ? 'right' : 'center',
      top: props.legendPosition === 'top' ? 'top' : props.legendPosition === 'bottom' ? 'bottom' : 'middle',
      textStyle: {
        color: '#606266'
      }
    },
    series: [{
      name: '数据',
      type: 'pie',
      radius: props.radius,
      center: ['50%', '50%'],
      data: props.data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        show: props.showLabel,
        position: props.labelPosition,
        formatter: '{b}: {c} ({d}%)'
      },
      labelLine: {
        show: props.showLabel && props.labelPosition === 'outside'
      }
    }],
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

