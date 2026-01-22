import { createRouter, createWebHistory } from 'vue-router'

// 定义路由配置
const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '系统总览' }
    },
    {
        path: '/student-info',
        name: 'StudentInfo',
        component: () => import('../views/student_info/StudentInfo.vue'),
        meta: { title: '学生信息管理' }
    },
    {
        path: '/consumption-query',
        name: 'ConsumptionQuery',
        component: () => import('../views/ConsumptionQuery.vue'),
        meta: { title: '消费信息查询' }
    },
    {
        path: '/system/log-query',
        name: 'LogQuery',
        component: () => import('../views/System/LogQuery.vue'),
        meta: { title: '系统日志查询', requiresAuth: true }
    },
    {
        path: '/consumption-analysis',
        name: 'ConsumptionAnalysis',
        component: () => import('../views/ConsumptionAnalysis.vue'),
        redirect: '/consumption-analysis/data-query',
        meta: { title: '消费数据分析' },
        children: [
            {
                path: 'data-query',
                name: 'ConsumptionDataQuery',
                component: () => import('../views/analysis/ConsumptionDataQuery.vue'),
                meta: { title: '消费数据统计' }
            },
            {
                path: 'drift-detection',
                name: 'ConsumptionDrift',
                component: () => import('../views/analysis/ConsumptionDrift.vue'),
                meta: { title: '消费漂移检测' }
            },
            {
                path: 'poverty-identification',
                name: 'PovertyIdentification',
                component: () => import('../views/analysis/PovertyIdentification.vue'),
                meta: { title: '贫困生鉴别' }
            },
            {
                path: 'score-correlation',
                name: 'ScoreCorrelation',
                component: () => import('../views/analysis/ScoreCorrelation.vue'),
                meta: { title: '成绩关联分析' }
            }
        ]
    }
]

// 创建路由实例（确保只声明一次）
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// 路由守卫 - 权限验证和页面标题设置
router.beforeEach((to, from, next) => {
    // 设置页面标题
    if (to.meta.title) {
        document.title = `${to.meta.title} - 贫困生鉴别系统`
    }

    // 权限验证
    if (to.meta.requiresAuth) {
        const token = localStorage.getItem('token')
        const userInfo = localStorage.getItem('userInfo')
        
        if (!token || !userInfo) {
            // 未登录，跳转到登录页或提示登录
            // 如果需要登录，可以跳转到登录页面
            // next({ name: 'Login', query: { redirect: to.fullPath } })
            
            // 当前先提示并允许访问（后续可以完善登录功能）
            console.warn('该页面需要登录访问')
            // 这里暂时允许访问，后续可以添加完整的登录流程
        }
    }

    next()
})

// 错误处理
router.onError((error) => {
    console.error('路由错误:', error)
})

// 导出路由实例（确保只导出一次）
export default router


