<template>
  <div class="student-scores">
    <!-- 学生基本信息 -->
    <div class="student-info">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="学号">{{ studentId }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ studentName }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 学期选择 -->
    <div class="semester-selector">
      <el-form :model="scoreForm" inline>
        <el-form-item label="选择学期">
          <el-select v-model="scoreForm.semester" placeholder="请选择学期" @change="handleSemesterChange">
            <el-option 
              v-for="semester in semesters" 
              :key="semester.value" 
              :label="semester.label" 
              :value="semester.value" 
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <!-- 绩点信息 -->
    <div class="gpa-card">
      <div class="gpa-header">
        <h3>绩点信息</h3>
        <div class="gpa-value">
          <span class="gpa-number">{{ currentGPA }}</span>
          <span class="gpa-label">当前绩点</span>
        </div>
      </div>
      <div class="gpa-chart">
        <div ref="gpaChart" style="height: 200px;"></div>
      </div>
    </div>

     课程成绩表格
    <div class="scores-table">
      <el-table :data="courseScores" v-loading="loading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="courseCode" label="课程代码" width="120" />
        <el-table-column prop="courseName" label="课程名称" />
        <el-table-column prop="credit" label="学分" width="80" />
        <el-table-column prop="score" label="成绩" width="100">
          <template #default="{ row }">
            <el-tag :type="getScoreType(row.score)">
              {{ row.score }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="gpa" label="绩点" width="100">
          <template #default="{ row }">
            {{ row.gpa.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="semester" label="学期" width="120" />
        <el-table-column prop="teacher" label="授课教师" width="120" />
      </el-table>
    </div>

    <!-- 成绩统计 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="6">
          <div class="stat-card">
            <div class="stat-icon" style="background: #409EFF;">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ totalCredits }}</div>
              <div class="stat-label">总学分</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="6">
          <div class="stat-card">
            <div class="stat-icon" style="background: #67C23A;">
              <el-icon><SuccessFilled /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ passedCourses }}</div>
              <div class="stat-label">通过课程</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="6">
          <div class="stat-card">
            <div class="stat-icon" style="background: #E6A23C;">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ avgScore }}</div>
              <div class="stat-label">平均成绩</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="6">
          <div class="stat-card">
            <div class="stat-icon" style="background: #F56C6C;">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ failedCourses }}</div>
              <div class="stat-label">不及格课程</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import {getStudentScores}from '@/api/user.js'
import * as echarts from 'echarts'
import { 
  Document, 
  SuccessFilled, 
  TrendCharts, 
  Warning 
} from '@element-plus/icons-vue'

const props = defineProps({
  studentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

const scoreForm = ref({
  semester: 'all'
})

const semesters = ref([
  { value: 'all', label: '全部学期' },
  { value: '2024-1', label: '2024学年第一学期' },
  { value: '2023-2', label: '2023学年第二学期' },
  { value: '2023-1', label: '2023学年第一学期' },
  { value: '2022-2', label: '2022学年第二学期' }
])

const courseScores = ref([])
const loading = ref(false)
const gpaChart = ref(null)

// 模拟数据
const allScores = ref([
  {
    courseCode: 'CS101',
    courseName: '计算机基础',
    credit: 3,
    score: 92,
    gpa: 4.0,
    semester: '2024-1',
    teacher: '张教授'
  },
  {
    courseCode: 'MA101',
    courseName: '高等数学',
    credit: 4,
    score: 88,
    gpa: 3.7,
    semester: '2024-1',
    teacher: '李教授'
  },
  {
    courseCode: 'EN101',
    courseName: '大学英语',
    credit: 2,
    score: 85,
    gpa: 3.3,
    semester: '2024-1',
    teacher: '王老师'
  },
  {
    courseCode: 'PH101',
    courseName: '大学物理',
    credit: 3,
    score: 78,
    gpa: 2.7,
    semester: '2023-2',
    teacher: '赵教授'
  },
  {
    courseCode: 'CH101',
    courseName: '大学化学',
    credit: 3,
    score: 95,
    gpa: 4.0,
    semester: '2023-2',
    teacher: '陈教授'
  }
])

// 计算属性
const currentGPA = computed(() => {
  const scores = filteredScores.value
  if (scores.length === 0) return '0.00'
  
  const total = scores.reduce((sum, course) => sum + course.gpa * course.credit, 0)
  const totalCredits = scores.reduce((sum, course) => sum + course.credit, 0)
  return (total / totalCredits).toFixed(2)
})

const filteredScores = computed(() => {
  if (scoreForm.value.semester === 'all') {
    return allScores.value
  }
  return allScores.value.filter(score => score.semester === scoreForm.value.semester)
})

const totalCredits = computed(() => {
  return filteredScores.value.reduce((sum, course) => sum + course.credit, 0)
})

const passedCourses = computed(() => {
  return filteredScores.value.filter(course => course.score >= 60).length
})

const failedCourses = computed(() => {
  return filteredScores.value.filter(course => course.score < 60).length
})

const avgScore = computed(() => {
  const scores = filteredScores.value
  if (scores.length === 0) return '0'
  const total = scores.reduce((sum, course) => sum + course.score, 0)
  return (total / scores.length).toFixed(1)
})

// 方法
const getScoreType = (score) => {
  if (score >= 90) return 'success'
  if (score >= 80) return 'primary'
  if (score >= 70) return 'warning'
  if (score >= 60) return 'info'
  return 'danger'
}

const handleSemesterChange = () => {
  courseScores.value = filteredScores.value
  updateGPAChart()
}

const updateGPAChart = () => {
  if (!gpaChart.value) return
  
  const chart = echarts.init(gpaChart.value)
  const semesterData = semesters.value
    .filter(s => s.value !== 'all')
    .map(semester => {
      const scores = allScores.value.filter(s => s.semester === semester.value)
      if (scores.length === 0) return { value: 0 }
      
      const total = scores.reduce((sum, course) => sum + course.gpa * course.credit, 0)
      const totalCredits = scores.reduce((sum, course) => sum + course.credit, 0)
      return {
        value: totalCredits > 0 ? (total / totalCredits).toFixed(2) : 0
      }
    })
  
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}'
    },
    xAxis: {
      type: 'category',
      data: semesters.value.filter(s => s.value !== 'all').map(s => s.label)
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 4.0
    },
    series: [{
      data: semesterData,
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#409EFF',
        width: 3
      },
      itemStyle: {
        color: '#409EFF'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(64, 158, 255, 0.3)'
          }, {
            offset: 1, color: 'rgba(64, 158, 255, 0.1)'
          }]
        }
      }
    }],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  })
}

onMounted(() => {
  courseScores.value = filteredScores.value
  setTimeout(() => {
    updateGPAChart()
  }, 100)
})

watch(() => props.studentId, (newVal) => {
  if (newVal) {
    // 这里可以加载对应学生的成绩数据
    console.log('加载学生成绩数据:', newVal)
  }
})
</script>

<style scoped>
.student-scores {
  padding: 0;
}

.student-info {
  margin-bottom: 20px;
}

.semester-selector {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.gpa-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.gpa-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.gpa-header h3 {
  margin: 0;
  color: #303133;
}

.gpa-value {
  text-align: center;
}

.gpa-number {
  display: block;
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
}

.gpa-label {
  font-size: 14px;
  color: #909399;
}

.gpa-chart {
  height: 200px;
}

.scores-table {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: white;
  font-size: 20px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #303133;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.el-table {
  margin-top: 15px;
}
</style>
