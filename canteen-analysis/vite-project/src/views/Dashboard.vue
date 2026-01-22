<template>
  <div class="dashboard">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ statistics.totalStudents.toLocaleString() }}</div>
            <div class="stat-label">总学生数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">¥{{ statistics.todayConsumption.toLocaleString() }}</div>
            <div class="stat-label">今日消费总额</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ statistics.povertyStudents.toLocaleString() }}</div>
            <div class="stat-label">贫困生数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">¥{{ statistics.monthlyConsumption.toLocaleString() }}</div>
            <div class="stat-label">月总消费额</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 实时消费趋势图表（占据完整宽度） -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>实时消费趋势分析</span>
          </template>
          <div id="consumptionTrend" style="height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 贫困生消费信息 -->
    <el-card style="margin-top: 20px;">
      <template #header>
        <span>贫困生消费监控</span>
      </template>
      <el-table :data="povertyConsumptionData" v-loading="loading" style="width: 100%">
        <el-table-column prop="studentId" label="学号" width="120"></el-table-column>
        <el-table-column prop="name" label="姓名" width="100"></el-table-column>
        <el-table-column prop="college" label="学院" width="120"></el-table-column>
        <el-table-column prop="monthlyAvg" label="月均消费" width="100">
          <template #default="scope">
            ¥{{ (scope.row.monthlyAvg || scope.row.monthlyConsumption || 0).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="dailyAvg" label="日均消费" width="100">
          <template #default="scope">
            ¥{{ (scope.row.dailyAvg || scope.row.avgDaily || 0).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="clusterType" label="消费类型" width="120">
          <template #default="scope">
            <el-tag :type="getLevelType(scope.row.clusterType || scope.row.consumptionLevel)">
              {{ scope.row.clusterType || scope.row.consumptionLevel || '未知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="povertyIndex" label="贫困指数" width="100">
          <template #default="scope">
            {{ (scope.row.povertyIndex || 0).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="text" @click="viewDetail(scope.row)">详情</el-button>
            <el-button type="text" @click="sendAlert(scope.row)">提醒</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { getSummaryData, getConsumption } from '@/api/user.js'
import { ElMessage } from 'element-plus'

// 响应式数据
const statistics = ref({
  totalStudents: 0,
  todayConsumption: 0,
  povertyStudents: 0,
  monthlyConsumption: 0
})

const povertyConsumptionData = ref([])
const loading = ref(false)

// 数据安全处理
const safeValue = (val) => {
  if (val === null || val === undefined || isNaN(val)) return 0
  const num = Number(val)
  return isNaN(num) ? 0 : num
}

// 加载统计数据（修复参数问题）
const loadStatistics = async () => {
  loading.value = true
  try {
    // 添加必要的查询参数
    const params = {
      college: 'all',  // 或从组件状态获取
      start_date: '2024-01-01',
      end_date: '2024-12-31'
    }

    const result = await getSummaryData(params)

    if (result?.data) {
      const data = result.data
      statistics.value = {
        totalStudents: safeValue(data.totalStudents),
        todayConsumption: safeValue(data.todayConsumption),
        povertyStudents: safeValue(data.povertyStudents),
        monthlyConsumption: safeValue(data.monthlyConsumption)
      }
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
    if (error.response?.status === 422) {
      ElMessage.error('参数验证失败，请检查请求格式')
    } else {
      ElMessage.warning('加载统计数据失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}

// 加载贫困生数据（添加参数）
const loadPovertyData = async () => {
  try {
    const params = {
      type: 'poverty',
      limit: 10
    }
    const result = await getConsumption(params)

    if (result?.data) {
      povertyConsumptionData.value = Array.isArray(result.data)
          ? result.data
          : []
    }
  } catch (error) {
    console.error('加载贫困生数据失败:', error)
    povertyConsumptionData.value = []
  }
}

// 图表实例引用
let trendChart = null

// 图表初始化函数
const initConsumptionTrend = (trendData = null) => {
  nextTick(() => {
    try {
      const chartDom = document.getElementById('consumptionTrend')
      if (!chartDom) {
        console.warn('图表容器未找到')
        return
      }

      // 如果图表已存在，先销毁
      if (trendChart) {
        trendChart.dispose()
      }

      trendChart = echarts.init(chartDom)

      // 如果没有数据，使用默认示例数据
      const chartData = trendData || generateDefaultTrendData()

      const option = {
        title: {
          text: '最近30天消费趋势',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: (params) => {
            const data = params[0]
            return `${data.name}<br/>消费总额: ¥${data.value.toLocaleString()}`
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: chartData.dates,
          axisLine: {
            lineStyle: {
              color: '#DCDFE6'
            }
          },
          axisLabel: {
            color: '#606266',
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          name: '消费金额(元)',
          axisLine: {
            lineStyle: {
              color: '#DCDFE6'
            }
          },
          axisLabel: {
            color: '#606266',
            formatter: (value) => `¥${value.toLocaleString()}`
          },
          splitLine: {
            lineStyle: {
              color: '#F2F6FC',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '消费总额',
            type: 'line',
            smooth: true,
            data: chartData.values,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
                  { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
                ]
              }
            },
            itemStyle: {
              color: '#409EFF'
            },
            lineStyle: {
              width: 3,
              color: '#409EFF'
            }
          }
        ]
      }

      trendChart.setOption(option)

      // 响应式调整
      window.addEventListener('resize', () => {
        if (trendChart) {
          trendChart.resize()
        }
      })
    } catch (error) {
      console.error('初始化图表失败:', error)
      ElMessage.error('图表初始化失败')
    }
  })
}

// 生成默认趋势数据（如果没有真实数据）
const generateDefaultTrendData = () => {
  const dates = []
  const values = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dates.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }))

    // 生成随机消费数据（模拟）
    const baseValue = 50000 + Math.random() * 20000
    values.push(Math.round(baseValue))
  }

  return { dates, values }
}

// 获取消费类型标签颜色
const getLevelType = (type) => {
  const typeMap = {
    '低消费': 'danger',
    '中等消费': 'warning',
    '高消费': 'success',
    '贫困': 'danger',
    '正常': 'success',
    '富裕': 'info'
  }
  return typeMap[type] || 'info'
}

// 查看详情
const viewDetail = (row) => {
  ElMessage.info(`查看学生 ${row.studentId} 的详细信息`)
  // TODO: 跳转到学生详情页面或打开详情对话框
}

// 发送提醒
const sendAlert = (row) => {
  ElMessage.success(`已向学生 ${row.studentId} 发送提醒`)
  // TODO: 实现提醒功能
}

// 组件卸载时销毁图表
onBeforeUnmount(() => {
  if (trendChart) {
    trendChart.dispose()
    trendChart = null
  }
  window.removeEventListener('resize', () => {})
})

onMounted(async () => {
  await loadStatistics()
  await loadPovertyData()
  initConsumptionTrend()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stat-card {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-content {
  padding: 20px;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}
</style>
