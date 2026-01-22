import BaseChart from './BaseChart.vue'
import LineChart from './LineChart.vue'
import BarChart from './BarChart.vue'
import PieChart from './PieChart.vue'
import ScatterChart from './ScatterChart.vue'
import HeatmapChart from './HeatmapChart.vue'
import HistogramChart from './HistogramChart.vue'

// 全局注册（可选）
const install = (app) => {
    app.component('BaseChart', BaseChart)
    app.component('LineChart', LineChart)
    app.component('BarChart', BarChart)
    app.component('PieChart', PieChart)
    app.component('ScatterChart', ScatterChart)
    app.component('HeatmapChart', HeatmapChart)
    app.component('HistogramChart', HistogramChart)
}

// 导出组件
export {
    BaseChart,
    LineChart,
    BarChart,
    PieChart,
    ScatterChart,
    HeatmapChart,
    HistogramChart,
    install
}

// 默认导出
export default {
    install
}