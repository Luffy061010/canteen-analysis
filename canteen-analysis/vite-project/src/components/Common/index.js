// 通用组件导出
import AnalysisFilter from './AnalysisFilter.vue'

export { AnalysisFilter }

export default {
  install(app) {
    app.component('AnalysisFilter', AnalysisFilter)
  }
}