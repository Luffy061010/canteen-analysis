<template>
  <div class="consumption-data-query">
    <el-card>
      <template #header>
        <span>消费数据统计</span>
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
            <el-form-item label="日期范围">
              <el-date-picker
                v-model="queryForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学号">
              <el-input v-model="queryForm.studentId" placeholder="请输入学号" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" @click="handleQuery">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <!-- 统计信息 -->
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="6">
          <el-card>
            <div style="text-align: center;">
              <div style="font-size: 24px; color: #409EFF; font-weight: bold;">156</div>
              <div style="color: #909399; margin-top: 5px;">查询学生数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div style="text-align: center;">
              <div style="font-size: 24px; color: #67C23A; font-weight: bold;">¥15,238</div>
              <div style="color: #909399; margin-top: 5px;">总消费金额</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div style="text-align: center;">
              <div style="font-size: 24px; color: #E6A23C; font-weight: bold;">2,847</div>
              <div style="color: #909399; margin-top: 5px;">消费记录数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div style="text-align: center;">
              <div style="font-size: 24px; color: #F56C6C; font-weight: bold;">¥98.5</div>
              <div style="color: #909399; margin-top: 5px;">人均消费额</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 图表展示 -->
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>TOP消费窗口排行</span>
            </template>
            <div id="topWindowChart" style="height: 300px;"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>各窗口消费分布</span>
            </template>
            <div id="windowDistributionChart" style="height: 300px;"></div>
          </el-card>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>人均消费金额统计</span>
            </template>
            <div id="avgConsumptionChart" style="height: 300px;"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>人均消费次数统计</span>
            </template>
            <div id="avgFrequencyChart" style="height: 300px;"></div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {getConsumptionTop, getConsumptionGroup} from "@/api/user.js";
import {COLLEGES_MAJORS, generateClassNames} from '@/utils/const_value.js'
import { ElMessage } from 'element-plus'

export default {
  name: 'ConsumptionDataQuery',
  data() {
    return {
      queryForm: {
        college: '',
        major: '',
        grade: '',
        class: '',
        dateRange: [],
        timeBegin: '',
        timeEnd: '',
        studentId: ''
      },
      colleges: Object.keys(COLLEGES_MAJORS),
      majors: [],
      grades: ['2021', '2022', '2023', '2024'],
      classes: [],
      loading: false,
      topData: [],
      groupData: [],
      avgConsumptionData: [],
      avgFrequencyData: []
    }
  },
  mounted() {
    this.loadData();
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
    async loadData() {
      this.loading = true
      try {
        // 处理日期范围
        if (this.queryForm.dateRange && Array.isArray(this.queryForm.dateRange) && this.queryForm.dateRange.length === 2) {
          this.queryForm.timeBegin = this.queryForm.dateRange[0]
          this.queryForm.timeEnd = this.queryForm.dateRange[1]
        }
        
        // 构建查询参数
        const params = {
          ...this.queryForm,
          className: this.queryForm.class || undefined,
          grade: this.queryForm.grade || undefined
        }
        
        // 移除空值和不需要的字段
        delete params.dateRange
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
          }
        })
        
        // 并行请求数据
        const [topResult, groupResult] = await Promise.all([
          getConsumptionTop(params),
          getConsumptionGroup(params)
        ])
        
        // 处理TOP数据 - API返回格式: {windowNames: [], windowAmounts: [], windowPercent: []}
        if (topResult && topResult.data) {
          const data = topResult.data
          if (data.windowNames && Array.isArray(data.windowNames)) {
            // 转换为图表需要的格式
            this.topData = data.windowNames.map((name, index) => ({
              window: name || `窗口${index + 1}`,
              name: name || `窗口${index + 1}`,
              amount: data.windowAmounts && data.windowAmounts[index] ? data.windowAmounts[index] : 0,
              percent: data.windowPercent && data.windowPercent[index] ? data.windowPercent[index] : 0
            }))
          } else if (Array.isArray(data)) {
            this.topData = data
          } else if (data.results && Array.isArray(data.results)) {
            this.topData = data.results
          } else if (data.topData && Array.isArray(data.topData)) {
            this.topData = data.topData
          } else {
            this.topData = []
          }
        } else {
          this.topData = []
        }
        
        // 处理群体数据 - API返回格式: {windowNames: [], windowAmounts: [], windowPercent: []}
        if (groupResult && groupResult.data) {
          const data = groupResult.data
          if (data.windowNames && Array.isArray(data.windowNames)) {
            // 转换为图表需要的格式
            this.groupData = data.windowNames.map((name, index) => ({
              window: name || `窗口${index + 1}`,
              name: name || `窗口${index + 1}`,
              amount: data.windowAmounts && data.windowAmounts[index] ? data.windowAmounts[index] : 0,
              percent: data.windowPercent && data.windowPercent[index] ? data.windowPercent[index] : 0
            }))
          } else if (Array.isArray(data)) {
            this.groupData = data
          } else if (data.results && Array.isArray(data.results)) {
            this.groupData = data.results
          } else if (data.groupData && Array.isArray(data.groupData)) {
            this.groupData = data.groupData
          } else {
            this.groupData = []
          }
        } else {
          this.groupData = []
        }
        
        // 初始化图表
        this.$nextTick(() => {
          this.initCharts()
        })
      } catch (error) {
        console.error('加载统计数据失败:', error)
        ElMessage.error('加载统计数据失败: ' + (error.message || '未知错误'))
      } finally {
        this.loading = false
      }
    },
    async handleQuery() {
      await this.loadData()
    },
    handleReset() {
      this.queryForm = {
        college: '',
        major: '',
        grade: '',
        class: '',
        dateRange: [],
        timeBegin: '',
        timeEnd: '',
        studentId: ''
      }
      this.majors = []
      this.classes = []
      this.topData = []
      this.groupData = []
    },
    initCharts() {
      // TOP消费窗口柱形图
      const topWindowChart = echarts.init(document.getElementById('topWindowChart'));
      if (this.topData && this.topData.length > 0) {
        const windowNames = this.topData.map(item => item.window || item.name || '未知')
        const amounts = this.topData.map(item => item.amount || item.value || 0)
        
        topWindowChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: '{b}: ¥{c}'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: windowNames,
            axisLabel: {
              rotate: 45
            }
          },
          yAxis: {
            type: 'value',
            name: '消费金额(元)'
          },
          series: [{
            name: '消费金额',
            data: amounts,
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#5470c6' },
                { offset: 1, color: '#91cc75' }
              ])
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        })
      } else {
        topWindowChart.setOption({
          title: {
            text: '暂无数据',
            left: 'center',
            top: 'center',
            textStyle: { color: '#999', fontSize: 14 }
          },
          xAxis: { show: false },
          yAxis: { show: false },
          series: []
        })
      }

      // 各窗口消费分布饼图
      const windowDistributionChart = echarts.init(document.getElementById('windowDistributionChart'));
      if (this.groupData && this.groupData.length > 0) {
        const pieData = this.groupData.map(item => ({
          name: item.name || item.window || '未知',
          value: item.value || item.amount || 0
        }))
        
        windowDistributionChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: { color: '#606266' }
          },
          series: [{
            name: '消费分布',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['60%', '50%'],
            data: pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              show: true,
              formatter: '{b}: {d}%'
            }
          }]
        })
      } else {
        windowDistributionChart.setOption({
          title: {
            text: '暂无数据',
            left: 'center',
            top: 'center',
            textStyle: { color: '#999', fontSize: 14 }
          },
          series: []
        })
      }

      // 人均消费金额统计
      const avgConsumptionChart = echarts.init(document.getElementById('avgConsumptionChart'));
      if (this.topData && this.topData.length > 0) {
        const colleges = [...new Set(this.topData.map(item => item.college).filter(Boolean))]
        const avgData = colleges.map(college => {
          const items = this.topData.filter(item => item.college === college)
          const total = items.reduce((sum, item) => sum + (item.avgAmount || item.amount || 0), 0)
          return items.length > 0 ? total / items.length : 0
        })
        
        avgConsumptionChart.setOption({
          tooltip: {
            trigger: 'axis',
            formatter: '{b}: ¥{c}'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: colleges.length > 0 ? colleges : ['暂无数据'],
            axisLabel: { rotate: 45 }
          },
          yAxis: {
            type: 'value',
            name: '人均消费(元)'
          },
          series: [{
            name: '人均消费',
            data: avgData.length > 0 ? avgData : [0],
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#91cc75',
              width: 3
            },
            itemStyle: {
              color: '#91cc75'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(144, 238, 144, 0.6)' },
                  { offset: 1, color: 'rgba(144, 238, 144, 0.1)' }
                ]
              }
            }
          }]
        })
      } else {
        avgConsumptionChart.setOption({
          title: {
            text: '暂无数据',
            left: 'center',
            top: 'center',
            textStyle: { color: '#999', fontSize: 14 }
          },
          xAxis: { show: false },
          yAxis: { show: false },
          series: []
        })
      }

      // 人均消费次数统计
      const avgFrequencyChart = echarts.init(document.getElementById('avgFrequencyChart'));
      if (this.topData && this.topData.length > 0) {
        const colleges = [...new Set(this.topData.map(item => item.college).filter(Boolean))]
        const frequencyData = colleges.map(college => {
          const items = this.topData.filter(item => item.college === college)
          const total = items.reduce((sum, item) => sum + (item.frequency || item.count || 0), 0)
          return items.length > 0 ? total / items.length : 0
        })
        
        avgFrequencyChart.setOption({
          tooltip: {
            trigger: 'axis',
            formatter: '{b}: {c}次'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: colleges.length > 0 ? colleges : ['暂无数据'],
            axisLabel: { rotate: 45 }
          },
          yAxis: {
            type: 'value',
            name: '人均次数'
          },
          series: [{
            name: '人均次数',
            data: frequencyData.length > 0 ? frequencyData : [0],
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#fac858' },
                { offset: 1, color: '#ee6666' }
              ])
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        })
      } else {
        avgFrequencyChart.setOption({
          title: {
            text: '暂无数据',
            left: 'center',
            top: 'center',
            textStyle: { color: '#999', fontSize: 14 }
          },
          xAxis: { show: false },
          yAxis: { show: false },
          series: []
        })
      }
      
      // 响应式调整
      window.addEventListener('resize', () => {
        topWindowChart.resize()
        windowDistributionChart.resize()
        avgConsumptionChart.resize()
        avgFrequencyChart.resize()
      })
    }
  }
}
</script>

<style scoped>
.consumption-data-query {
  padding: 20px;
}
</style>