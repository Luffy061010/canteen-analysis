<template>
  <div class="consumption-drift">
    <el-card>
      <template #header>
        <span>消费漂移检测</span>
      </template>

      <!-- 筛选条件 -->
      <el-form :model="queryForm" ref="queryForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="学院">
              <el-select v-model="queryForm.college" placeholder="全部学院" style="width: 100%">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="college in colleges" :key="college" :label="college" :value="college"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="专业">
              <el-select v-model="queryForm.major" placeholder="全部专业" style="width: 100%">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="major in majors" :key="major" :label="major" :value="major"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年级">
              <el-select v-model="queryForm.grade" placeholder="全部年级" style="width: 100%">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="grade in grades" :key="grade" :label="grade" :value="grade"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="班级">
              <el-select v-model="queryForm.class" placeholder="全部班级" style="width: 100%">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="cls in classes" :key="cls" :label="cls" :value="cls"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="时间窗口">
              <el-select v-model="queryForm.timeWindow" placeholder="请选择时间窗口" style="width: 100%">
                <el-option label="7天" value="7"></el-option>
                <el-option label="15天" value="15"></el-option>
                <el-option label="30天" value="30"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学号">
              <el-input v-model="queryForm.studentId" placeholder="请输入学号" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" @click="handleQuery">检测</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 消费漂移检测图表 -->
      <el-card style="margin-top: 20px;">
        <template #header>
          <span>消费漂移检测分析</span>
        </template>
        <div id="driftChart" style="height: 400px;"></div>
      </el-card>

      <!-- 检测结果 -->
      <el-card style="margin-top: 20px;">
        <template #header>
          <span>漂移检测结果</span>
        </template>
        <el-table :data="driftResults" style="width: 100%">
          <el-table-column prop="studentId" label="学号" width="120"></el-table-column>
          <el-table-column prop="name" label="姓名" width="100"></el-table-column>
          <el-table-column prop="college" label="学院" width="120"></el-table-column>
          <el-table-column prop="beforeDrift" label="漂移前均值" width="100">
            <template #default="scope">¥{{ scope.row.beforeDrift }}</template>
          </el-table-column>
          <el-table-column prop="afterDrift" label="漂移后均值" width="100">
            <template #default="scope">¥{{ scope.row.afterDrift }}</template>
          </el-table-column>
          <el-table-column prop="changeRate" label="变化率" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.changeRate > 0 ? 'danger' : 'success'">
                {{ scope.row.changeRate > 0 ? '+' : '' }}{{ scope.row.changeRate }}%
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="confidence" label="置信度" width="100">
            <template #default="scope">{{ scope.row.confidence }}%</template>
          </el-table-column>
          <el-table-column prop="detectDate" label="检测日期" width="120"></el-table-column>
        </el-table>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import {getConsumptionDrift} from "@/api/user.js";
import {COLLEGES_MAJORS, generateClassNames} from '@/utils/const_value.js'
import LineChart from '@/components/Charts/LineChart.vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

export default {
  name: 'ConsumptionDrift',
  components: {
    LineChart
  },
  data() {
    return {
      queryForm: {
        college: '',
        major: '',
        grade: '',
        class: '',
        timeWindow: '7',
        driftMethod: 'ElKmeans',
        studentId: '',
        timeBegin: '',
        timeEnd: ''
      },
      colleges: Object.keys(COLLEGES_MAJORS),
      majors: [],
      grades: ['2021', '2022', '2023', '2024'],
      classes: [],
      loading: false,
      driftResults: [],
      driftChartData: []
    }
  },
  mounted() {
    // 初始化图表
  },
  watch: {
    'queryForm.college'(newVal) {
      if (newVal && COLLEGES_MAJORS[newVal]) {
        this.majors = COLLEGES_MAJORS[newVal].majors || []
      } else {
        this.majors = []
      }
      this.queryForm.major = ''
      this.queryForm.class = ''
      this.classes = []
    },
    'queryForm.major'(newVal) {
      if (newVal && this.queryForm.grade) {
        this.classes = generateClassNames(newVal, this.queryForm.grade + '级')
      } else {
        this.classes = []
      }
      this.queryForm.class = ''
    },
    'queryForm.grade'(newVal) {
      if (newVal && this.queryForm.major) {
        this.classes = generateClassNames(this.queryForm.major, newVal + '级')
      } else {
        this.classes = []
      }
      this.queryForm.class = ''
    }
  },
  methods: {
    async handleQuery() {
      this.loading = true
      try {
        // 构建查询参数
        const params = {
          ...this.queryForm,
          className: this.queryForm.class || undefined,
          grade: this.queryForm.grade || undefined
        }

        // 移除空值
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
          }
        })

        const result = await getConsumptionDrift(params)

        // 处理返回数据
        if (result && result.data) {
          const data = result.data

          // 处理漂移检测结果
          if (data.results && Array.isArray(data.results)) {
            this.driftResults = data.results
          } else if (data.driftResults && Array.isArray(data.driftResults)) {
            this.driftResults = data.driftResults
          } else if (Array.isArray(data)) {
            this.driftResults = data
          } else {
            this.driftResults = []
          }

          // 处理漂移图表数据
          if (data.chartData && data.chartData.dates && data.chartData.values) {
            this.driftChartData = {
              dates: data.chartData.dates,
              actual: data.chartData.values.actual || [],
              trend: data.chartData.values.trend || [],
              driftPoints: data.chartData.values.driftPoints || []
            }
          } else if (data.timeSeries && Array.isArray(data.timeSeries)) {
            // 从时间序列数据中提取
            this.driftChartData = {
              dates: data.timeSeries.map(item => item.date || item.time),
              actual: data.timeSeries.map(item => item.consumption || item.value),
              trend: data.timeSeries.map(item => item.trend || null),
              driftPoints: data.timeSeries.map((item, index) => item.isDrift ? item.consumption : null)
            }
          } else {
            this.driftChartData = {
              dates: [],
              actual: [],
              trend: [],
              driftPoints: []
            }
          }
        } else {
          this.driftResults = []
          this.driftChartData = {
            dates: [],
            actual: [],
            trend: [],
            driftPoints: []
          }
        }

        // 初始化图表
        this.$nextTick(() => {
          this.initDriftChart()
        })
      } catch (error) {
        console.error('漂移检测失败:', error)
        ElMessage.error('漂移检测失败: ' + (error.message || '未知错误'))
        this.driftResults = []
        this.driftChartData = {
          dates: [],
          actual: [],
          trend: [],
          driftPoints: []
        }
      } finally {
        this.loading = false
      }
    },
    handleReset() {
      this.queryForm = {
        college: '',
        major: '',
        grade: '',
        class: '',
        timeWindow: '7',
        driftMethod: 'ElKmeans',
        studentId: '',
        timeBegin: '',
        timeEnd: ''
      }
      this.majors = []
      this.classes = []
      this.driftResults = []
      this.driftChartData = {
        dates: [],
        actual: [],
        trend: [],
        driftPoints: []
      }
    },
    initDriftChart() {
      const chart = echarts.init(document.getElementById('driftChart'));

      if (this.driftChartData.dates && this.driftChartData.dates.length > 0) {
        const option = {
          tooltip: {
            trigger: 'axis',
            formatter: (params) => {
              let result = params[0].name + '<br/>'
              params.forEach(param => {
                if (param.value !== null && param.value !== undefined) {
                  result += param.seriesName + ': ' + param.value + '元<br/>'
                }
              })
              return result
            }
          },
          legend: {
            data: ['实际消费', '趋势线', '检测点']
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
            data: this.driftChartData.dates
          },
          yAxis: {
            type: 'value',
            name: '消费金额(元)'
          },
          series: [
            {
              name: '实际消费',
              type: 'line',
              data: this.driftChartData.actual,
              smooth: true,
              lineStyle: {
                color: '#5470c6',
                width: 3
              },
              symbol: 'circle',
              symbolSize: 6
            },
            {
              name: '趋势线',
              type: 'line',
              data: this.driftChartData.trend,
              smooth: true,
              lineStyle: {
                color: '#91cc75',
                type: 'dashed',
                width: 2
              }
            },
            {
              name: '检测点',
              type: 'scatter',
              data: this.driftChartData.driftPoints,
              symbolSize: 12,
              itemStyle: {
                color: '#ee6666'
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        chart.setOption(option)
      } else {
        chart.setOption({
          title: {
            text: '暂无数据',
            left: 'center',
            top: 'center',
            textStyle: {
              color: '#999',
              fontSize: 14
            }
          },
          xAxis: { show: false },
          yAxis: { show: false },
          series: []
        })
      }
    }
  }
}
</script>

<style scoped>
.consumption-drift {
  padding: 20px;
}
</style>