<template>
  <el-card class="filter-card" style="margin-bottom: 20px;">
    <template #header>
      <div class="filter-header">
        <span>筛选条件</span>
        <el-button 
          v-if="showExpand" 
          type="text" 
          @click="expanded = !expanded"
        >
          {{ expanded ? '收起' : '展开' }}
        </el-button>
      </div>
    </template>
    
    <el-form :model="filterForm" label-width="80px" :inline="!expanded">
      <!-- 基础筛选条件 -->
      <el-form-item label="学院">
        <el-select 
          v-model="filterForm.college" 
          placeholder="全部学院" 
          clearable
          @change="handleCollegeChange"
        >
          <el-option label="全部" value=""></el-option>
          <el-option 
            v-for="college in collegeOptions" 
            :key="college" 
            :label="college" 
            :value="college"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="专业">
        <el-select 
          v-model="filterForm.major" 
          placeholder="全部专业" 
          clearable
        >
          <el-option label="全部" value=""></el-option>
          <el-option 
            v-for="major in majorOptions" 
            :key="major" 
            :label="major" 
            :value="major"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="年级">
        <el-select 
          v-model="filterForm.grade" 
          placeholder="全部年级" 
          clearable
        >
          <el-option label="全部" value=""></el-option>
          <el-option 
            v-for="grade in gradeOptions" 
            :key="grade" 
            :label="grade" 
            :value="grade"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="班级">
        <el-select 
          v-model="filterForm.class" 
          placeholder="全部班级" 
          clearable
        >
          <el-option label="全部" value=""></el-option>
          <el-option 
            v-for="cls in classOptions" 
            :key="cls" 
            :label="cls" 
            :value="cls"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 扩展筛选条件 -->
      <template v-if="expanded || !showExpand">
        <el-form-item label="学号">
          <el-input 
            v-model="filterForm.studentId" 
            placeholder="输入学号" 
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="日期范围" v-if="showDateRange">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="消费类型" v-if="showConsumptionType">
          <el-select 
            v-model="filterForm.consumptionType" 
            placeholder="全部类型" 
            clearable
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="早餐" value="breakfast"></el-option>
            <el-option label="午餐" value="lunch"></el-option>
            <el-option label="晚餐" value="dinner"></el-option>
            <el-option label="超市" value="supermarket"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
      </template>

      <el-form-item>
        <el-button type="primary" @click="handleFilter">
          <el-icon><Search /></el-icon>
          查询
        </el-button>
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon>
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import {getStudentInfo} from "@/api/user.js";
// 定义组件属性
const props = defineProps({
  // 是否显示扩展筛选条件
  showExpand: {
    type: Boolean,
    default: true
  },
  // 是否显示日期范围
  showDateRange: {
    type: Boolean,
    default: false
  },
  // 是否显示消费类型
  showConsumptionType: {
    type: Boolean,
    default: false
  },
  // 初始筛选值
  initialValues: {
    type: Object,
    default: () => ({})
  }
})

// 定义事件
const emit = defineEmits(['filter-change', 'filter-reset'])

// 响应式数据
const expanded = ref(false)
const filterForm = reactive({
  college: '',
  major: '',
  grade: '',
  class: '',
  studentId: '',
  dateRange: [],
  consumptionType: '',
  ...props.initialValues
})

// 模拟数据
const collegeOptions = ref(['计算机学院', '经济学院', '管理学院', '外语学院', '机械学院'])
const majorOptions = ref([])
const gradeOptions = ref(['2021级', '2022级', '2023级', '2024级'])
const classOptions = ref(['1班', '2班', '3班', '4班', '5班'])

// 学院变更处理
const handleCollegeChange = (college) => {
  // 根据学院加载专业数据
  if (college) {
    // 模拟专业数据
    const majorMap = {
      '计算机学院': ['计算机科学', '软件工程', '人工智能'],
      '经济学院': ['经济学', '金融学', '国际贸易'],
      '管理学院': ['工商管理', '市场营销', '人力资源'],
      '外语学院': ['英语', '日语', '法语'],
      '机械学院': ['机械工程', '自动化', '车辆工程']
    }
    majorOptions.value = majorMap[college] || []
  } else {
    majorOptions.value = []
  }
  filterForm.major = '' // 重置专业选择
}

// 筛选处理
const handleFilter = () => {
  emit('filter-change', { ...filterForm })
}

// 重置处理
const handleReset = () => {
  Object.keys(filterForm).forEach(key => {
    if (Array.isArray(filterForm[key])) {
      filterForm[key] = []
    } else {
      filterForm[key] = ''
    }
  })
  emit('filter-reset')
  emit('filter-change', { ...filterForm })
}

// 监听初始值变化
watch(() => props.initialValues, (newVal) => {
  Object.keys(newVal).forEach(key => {
    if (filterForm.hasOwnProperty(key)) {
      filterForm[key] = newVal[key]
    }
  })
}, { deep: true })

onMounted(() => {
  // 如果有初始学院值，加载对应的专业
  if (filterForm.college) {
    handleCollegeChange(filterForm.college)
  }
})
</script>

<style scoped>
.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-card {
  background: #fff;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 20px;
  margin-bottom: 10px;
}
</style>