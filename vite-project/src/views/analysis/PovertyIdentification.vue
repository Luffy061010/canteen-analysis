<template>
  <div class="poverty-identification">
    <el-card>
      <template #header>
        <span>贫困生鉴别</span>
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
            <el-form-item label="聚类算法">
              <el-select v-model="queryForm.algorithm" placeholder="请选择算法" style="width: 100%">
                <el-option label="全部" value=""></el-option>
                <el-option label="K-means" value="kmeans"></el-option>
                <el-option label="DBSCAN" value="dbscan"></el-option>
                <el-option label="层次聚类" value="hierarchical"></el-option>
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
              <el-button type="primary" @click="handleIdentify">鉴别</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 聚类分析图表 -->
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>消费聚类分析</span>
            </template>
            <div id="clusterChart" style="height: 400px;"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>群体分布统计</span>
            </template>
            <div id="distributionChart" style="height: 400px;"></div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 鉴别结果 -->
      <el-card style="margin-top: 20px;">
        <template #header>
          <span>贫困生鉴别结果</span>
        </template>
        <el-table :data="povertyResults" style="width: 100%">
          <el-table-column prop="studentId" label="学号" width="120"></el-table-column>
          <el-table-column prop="name" label="姓名" width="100"></el-table-column>
          <el-table-column prop="college" label="学院" width="120"></el-table-column>
          <el-table-column prop="monthlyAvg" label="月均消费" width="100">
            <template #default="scope">¥{{ scope.row.monthlyAvg }}</template>
          </el-table-column>
          <el-table-column prop="dailyAvg" label="日均消费" width="100">
            <template #default="scope">¥{{ scope.row.dailyAvg }}</template>
          </el-table-column>
          <el-table-column prop="clusterType" label="消费类型" width="120">
            <template #default="scope">
              <el-tag :type="getClusterType(scope.row.clusterType)">
                {{ scope.row.clusterType }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="povertyIndex" label="贫困指数" width="100">
            <template #default="scope">{{ scope.row.povertyIndex }}</template>
          </el-table-column>
          <el-table-column prop="confidence" label="置信度" width="100">
            <template #default="scope">{{ scope.row.confidence }}%</template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import {getPovertyIdentification} from "@/api/user.js";
import {COLLEGES_MAJORS, generateClassNames} from '@/utils/const_value.js'
import ScatterChart from '@/components/Charts/ScatterChart.vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

export default {
  name: 'PovertyIdentification',
  components: {
    ScatterChart
  },
  data() {
    return {
      queryForm: {
        college: '',
        major: '',
        grade: '',
        class: '',
        clusterMethod: 'kmeans',
        clusterNums: '4',
        studentId: '',
        timeBegin: '',
        timeEnd: ''
      },
      colleges: Object.keys(COLLEGES_MAJORS),
      majors: [],
      grades: ['2021', '2022', '2023', '2024'],
      classes: [],
      loading: false,
      povertyResults: [],
      clusterScatterData: [],
      distributionPieData: []
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
    async handleIdentify() {
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

        const result = await getPovertyIdentification(params)

        // 处理返回数据
        if (result && result.data) {
          const data = result.data

          // 处理贫困生鉴别结果
          if (data.results && Array.isArray(data.results)) {
            this.povertyResults = data.results
          } else if (data.povertyResults && Array.isArray(data.povertyResults)) {
            this.povertyResults = data.povertyResults
          } else if (Array.isArray(data)) {
            this.povertyResults = data
          } else {
            this.povertyResults = []
          }

          // 处理聚类散点图数据
          if (data.clusterData && Array.isArray(data.clusterData)) {
            this.clusterScatterData = [{
              name: '消费聚类分析',
              data: data.clusterData.map(item => [item.monthlyAvg || item.consumption || item.x, item.gpa || item.score || item.y])
            }]
          } else {
            // 如果没有聚类数据，从结果中生成
            if (this.povertyResults.length > 0) {
              this.clusterScatterData = [{
                name: '消费聚类分析',
                data: this.povertyResults.map(item => [item.monthlyAvg || 0, item.gpa || 0])
              }]
            } else {
              this.clusterScatterData = []
            }
          }

          // 处理群体分布饼图数据
          if (data.distributionData && Array.isArray(data.distributionData)) {
            this.distributionPieData = data.distributionData
          } else {
            // 如果没有分布数据，从结果中统计
            const distributionMap = {}
            this.povertyResults.forEach(item => {
              const type = item.clusterType || item.type || '未知'
              distributionMap[type] = (distributionMap[type] || 0) + 1
            })
            this.distributionPieData = Object.keys(distributionMap).map(key => ({
              name: key,
              value: distributionMap[key]
            }))
          }
        } else {
          this.povertyResults = []
          this.clusterScatterData = []
          this.distributionPieData = []
        }

        // 初始化图表
        this.$nextTick(() => {
          this.initCharts()
        })
      } catch (error) {
        console.error('贫困生鉴别失败:', error)
        ElMessage.error('贫困生鉴别失败: ' + (error.message || '未知错误'))
        this.povertyResults = []
        this.clusterScatterData = []
        this.distributionPieData = []
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
        clusterMethod: 'kmeans',
        clusterNums: '4',
        studentId: '',
        timeBegin: '',
        timeEnd: ''
      }
      this.majors = []
      this.classes = []
      this.povertyResults = []
      this.clusterScatterData = []
      this.distributionPieData = []
    },
    getClusterType(type) {
      const typeMap = {
        '贫困生': 'danger',
        '普通消费1': 'info',
        '普通消费2': 'warning',
        '高消费': 'success'
      }
      return typeMap[type] || 'info'
    },
    initCharts() {
      // 聚类分析散点图
      const clusterChart = echarts.init(document.getElementById('clusterChart'));
      if (this.clusterScatterData.length > 0 && this.clusterScatterData[0].data.length > 0) {
        clusterChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              const index = params.dataIndex
              const item = this.povertyResults[index]
              if (item) {
                return `学号: ${item.studentId || '未知'}<br/>消费: ${item.monthlyAvg || params.value[0]}元<br/>成绩: ${item.gpa || params.value[1]}<br/>类型: ${item.clusterType || '未知'}`
              }
              return `消费: ${params.value[0]}元<br/>成绩: ${params.value[1]}`
            }
          },
          xAxis: {
            type: 'value',
            name: '月消费金额(元)',
            nameLocation: 'end'
          },
          yAxis: {
            type: 'value',
            name: '学业成绩',
            nameLocation: 'end'
          },
          series: [{
            name: '消费聚类分析',
            data: this.clusterScatterData[0].data,
            type: 'scatter',
            symbolSize: 10,
            itemStyle: {
              color: (params) => {
                const index = params.dataIndex
                const item = this.povertyResults[index]
                if (item) {
                  const colorMap = {
                    '高消费': '#ee6666',
                    '普通消费1': '#5470c6',
                    '普通消费2': '#91cc75',
                    '贫困生': '#fac858'
                  }
                  return colorMap[item.clusterType] || '#909399'
                }
                return '#409EFF'
              }
            }
          }]
        })
      } else {
        clusterChart.setOption({
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

      // 群体分布饼图
      const distributionChart = echarts.init(document.getElementById('distributionChart'));
      if (this.distributionPieData.length > 0) {
        distributionChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [{
            name: '消费群体分布',
            type: 'pie',
            radius: '50%',
            data: this.distributionPieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        })
      } else {
        distributionChart.setOption({
          title: {
            text: '暂无数据',
            left: 'center',
            top: 'center',
            textStyle: {
              color: '#999',
              fontSize: 14
            }
          },
          series: []
        })
      }
    }
  }
}
</script>

<style scoped>
.poverty-identification {
  padding: 20px;
}
</style>