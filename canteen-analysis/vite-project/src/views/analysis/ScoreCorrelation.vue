<template>
  <div class="score-correlation">
    <el-card>
      <template #header>
        <span>成绩关联分析</span>
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
<!--          <el-col :span="8">-->
<!--            <el-form-item label="科目">-->
<!--              <el-select v-model="queryForm.subject" placeholder="请选择科目" style="width: 100%">-->
<!--                <el-option label="全部" value=""></el-option>-->
<!--                <el-option label="数学" value="math"></el-option>-->
<!--                <el-option label="英语" value="english"></el-option>-->
<!--                <el-option label="专业课" value="major"></el-option>-->
<!--                <el-option label="总绩点" value="gpa"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="8">
            <el-form-item label="学号">
              <el-input v-model="queryForm.studentId" placeholder="请输入学号" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" @click="handleAnalyze">分析</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <!-- 关联性分析图表 -->
      <el-card style="margin-top: 20px;">
        <template #header>
          <span>成绩与消费关联性散点图</span>
        </template>
        <div id="correlationHeatmap" style="height: 500px;width: 100%;">
          <ScatterChart
              :data="consumptionScatterData"
              title="学生成绩与消费关联性分析"
              x-axis-name="三餐消费金额（元）"
              y-axis-name="学生总绩点"
              :symbol-size="8"
              :container-style="{ height: '400px' }"
              @chart-click="handleScatterChartClick"
          />
        </div>
      </el-card>
      
      <!-- 分析结果 -->
      <el-card style="margin-top: 20px;">
        <template #header>
          <span>成绩与消费关联性分析结果</span>
        </template>
        <el-table :data="correlationResults" style="width: 100%">
          <el-table-column prop="factor" label="消费因素" width="150"></el-table-column>
          <el-table-column prop="correlation" label="相关系数" width="120">
            <template #default="scope">
              <el-tag :type="getCorrelationType(scope.row.correlation)">
                {{ scope.row.correlation.toFixed(3) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="pValue" label="P值" width="120">
            <template #default="scope">{{ scope.row.pValue.toFixed(4) }}</template>
          </el-table-column>
          <el-table-column prop="significance" label="显著性" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.significance === '显著' ? 'success' : 'info'">
                {{ scope.row.significance }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="interpretation" label="解读"></el-table-column>
        </el-table>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import {getScoreCorrelation} from "@/api/user.js";
import {COLLEGES_MAJORS, generateClassNames} from '@/utils/const_value.js'
import ScatterChart from '@/components/Charts/ScatterChart.vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'ScoreCorrelation',
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
        timeBegin: '',
        timeEnd: '',
        studentId: '',
        correlationMethod: 'Pearson',
        variable1: 'gpa'
      },
      colleges: Object.keys(COLLEGES_MAJORS),
      majors: [],
      grades: ['2021', '2022', '2023', '2024'],
      classes: [],
      loading: false,
      correlationResults: [],
      consumptionScatterData: []
    }
  },
  mounted() {
    // 初始化数据
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
    async handleAnalyze() {
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
        
        const result = await getScoreCorrelation(params)
        
        // 处理返回数据
        if (result && result.data) {
          const data = result.data
          
          // 处理散点图数据
          if (data.scatterData && Array.isArray(data.scatterData)) {
            this.consumptionScatterData = [{
              name: '成绩与消费关联',
              data: data.scatterData.map(item => [item.consumption || item.x, item.gpa || item.y])
            }]
          } else if (data.points && Array.isArray(data.points)) {
            this.consumptionScatterData = [{
              name: '成绩与消费关联',
              data: data.points.map(item => [item.consumption || item.x, item.gpa || item.y])
            }]
          } else {
            // 如果没有散点数据，使用空数组
            this.consumptionScatterData = []
          }
          
          // 处理关联分析结果
          if (data.correlationResults && Array.isArray(data.correlationResults)) {
            this.correlationResults = data.correlationResults
          } else if (data.results && Array.isArray(data.results)) {
            this.correlationResults = data.results
          } else {
            this.correlationResults = []
          }
        } else {
          this.consumptionScatterData = []
          this.correlationResults = []
        }
      } catch (error) {
        console.error('关联分析失败:', error)
        ElMessage.error('关联分析失败: ' + (error.message || '未知错误'))
        this.consumptionScatterData = []
        this.correlationResults = []
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
        timeBegin: '',
        timeEnd: '',
        studentId: '',
        correlationMethod: 'Pearson',
        variable1: 'gpa'
      }
      this.majors = []
      this.classes = []
      this.correlationResults = []
      this.consumptionScatterData = []
    },
    getCorrelationType(correlation) {
      if (Math.abs(correlation) > 0.5) return 'danger';
      if (Math.abs(correlation) > 0.3) return 'warning';
      if (Math.abs(correlation) > 0.1) return 'success';
      return 'info';
    },
    handleScatterChartClick(params) {
      console.log('散点图点击:', params)
    }
  //    initHeatmap() {
  //     const chart = echarts.init(document.getElementById('correlationHeatmap'));
  //     const option = {
  //       tooltip: {
  //         position: 'top'
  //       },
  //       grid: {
  //         height: '80%',
  //         top: '10%'
  //       },
  //       xAxis: {
  //         type: 'category',
  //         data: ['早餐', '午餐', '晚餐', '超市', '图书馆', '其他'],
  //         splitArea: { show: true }
  //       },
  //       yAxis: {
  //         type: 'category',
  //         data: ['数学', '英语', '专业课', '体育', '总绩点'],
  //         splitArea: { show: true }
  //       },
  //       visualMap: {
  //         min: -1,
  //         max: 1,
  //         calculable: true,
  //         orient: 'horizontal',
  //         left: 'center',
  //         bottom: '0%',
  //         inRange: {
  //           color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
  //         }
  //       },
  //       series: [{
  //         name: '相关性',
  //         type: 'heatmap',
  //         data: this.generateHeatmapData(),
  //         label: { show: true },
  //         emphasis: {
  //           itemStyle: {
  //             shadowBlur: 10,
  //             shadowColor: 'rgba(0, 0, 0, 0.5)'
  //           }
  //         }
  //       }]
  //     };
  //     chart.setOption(option);
  //   },
  //   generateHeatmapData() {
  //     const data = [];
  //     const xData = ['早餐', '午餐', '晚餐', '超市', '图书馆', '其他'];
  //     const yData = ['数学', '英语', '专业课', '体育', '总绩点'];
  //     console.log('生成热力图')
  //     yData.forEach((y, yIndex) => {
  //       xData.forEach((x, xIndex) => {
  //         // 模拟相关性数据
  //         let value;
  //         if (x === '早餐' && y === '总绩点') value = 0.31;
  //         else if (x === '图书馆' && y === '总绩点') value = 0.45;
  //         else if (x === '午餐' && y === '数学') value = 0.22;
  //         else if (x === '超市' && y === '体育') value = -0.15;
  //         else value = (Math.random() * 0.6 - 0.3).toFixed(2);
  //
  //         data.push([xIndex, yIndex, parseFloat(value)]);
  //       });
  //     });
  //     return data;
  //   }
  }
}
</script>

<style scoped>
.score-correlation {
  padding: 20px;
}
</style>
