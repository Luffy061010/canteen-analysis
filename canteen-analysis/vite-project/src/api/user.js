import request from "@/utils/request";

// 使用环境变量配置API基础地址
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const FASTAPI_BASE_URL = import.meta.env.VITE_FASTAPI_BASE_URL || '/fastapi';

// 统一参数处理函数
const buildParams = (form) => {
    const params = {}
    if (!form) return params

    const paramMap = {
        'grade': 'grade',
        'college': 'college',
        'major': 'major',
        'class': 'className',
        'className': 'className',
        'studentId': 'studentId',
        'page': 'page',
        'pageSize': 'pageSize',
        'timeBegin': 'timeBegin',
        'timeEnd': 'timeEnd',
        'correlationMethod': 'correlationMethod',
        'variable1': 'variable1',
        'driftMethod': 'driftMethod',
        'timeWindow': 'timeWindow',
        'clusterMethod': 'clusterMethod',
        'clusterNums': 'clusterNums'
    }

    Object.keys(paramMap).forEach(key => {
        const paramKey = paramMap[key]
        const value = form[key]
        if (value !== null && value !== undefined && value !== '') {
            params[paramKey] = String(value)
        }
    })

    return params
}

// ==================== 学生信息相关API ====================
export const getStudentInfo = (form) => {
    const params = buildParams(form)
    console.log('查询学生信息参数:', params)
    return request.get(`${API_BASE_URL}/basic_data/student/info`, {params})
}

export const getStudentScores = (params) => {
    if (!params || !params.studentId) {
        throw new Error('studentId is required')
    }
    const queryParams = buildParams(params)
    return request.get(`${API_BASE_URL}/basic_data/student/score`, {params: queryParams})
}

// ==================== 消费数据相关API ====================
export const getConsumption = (form) => {
    const params = buildParams(form)
    return request.get(`${API_BASE_URL}/consumption_data/StudentConsumptionStat`, {
        params,
        timeout: 300000
    })
}

export const getConsumptionData = (form) => {
    const params = buildParams(form)
    return request.get(`${API_BASE_URL}/consumption_data/StudentConsumption`, {
        params,
        timeout: 300000
    })
}

export const getConsumptionTop = (form) => {
    const params = buildParams(form)
    return request.get(`${API_BASE_URL}/consumption_data/window/top/barAndPie`, {
        params,
        timeout: 300000
    })
}

export const getConsumptionGroup = (form) => {
    const params = buildParams(form)
    return request.get(`${API_BASE_URL}/consumption_data/window/group/barAndPie`, {
        params,
        timeout: 300000
    })
}

// ==================== 分析相关API ====================
export const getScoreCorrelation = (form) => {
    const params = buildParams(form)
    return request.get(`${FASTAPI_BASE_URL}/analysis/correlation`, {
        params,
        timeout: 300000
    })
}

export const getConsumptionDrift = (form) => {
    const params = buildParams(form)
    return request.get(`${FASTAPI_BASE_URL}/analysis/drift`, {
        params,
        timeout: 300000
    })
}

export const getPovertyIdentification = (form) => {
    const params = buildParams(form)
    return request.get(`${FASTAPI_BASE_URL}/analysis/cluster`, {
        params,
        timeout: 300000
    })
}

// ==================== 汇总数据API ====================
export const getSummaryData = (form) => {
    const params = buildParams(form)
    return request.get(`${FASTAPI_BASE_URL}/analysis/summary/data`, {
        params,
        timeout: 300000
    })
}

// ==================== 兼容性API ====================
export const getConsumptionDateQuery = (form) => {
    return getConsumptionData(form)
}

// ==================== 新增API（基于您的后端代码） ====================

// 获取学生列表
export const getStudentList = (form) => {
    const params = buildParams(form)
    return request.get(`${API_BASE_URL}/basic_data/student/list`, {params})
}

// 获取学生详情
export const getStudentDetail = (studentId) => {
    return request.get(`${API_BASE_URL}/basic_data/student/detail/${studentId}`)
}

// 添加学生
export const addStudent = (data) => {
    return request.post(`${API_BASE_URL}/basic_data/student/add`, data)
}

// 更新学生信息
export const updateStudent = (studentId, data) => {
    return request.put(`${API_BASE_URL}/basic_data/student/update/${studentId}`, data)
}

// 删除学生
export const deleteStudent = (studentId) => {
    return request.delete(`${API_BASE_URL}/basic_data/student/delete/${studentId}`)
}

// 导入学生数据
export const importStudents = (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post(`${API_BASE_URL}/basic_data/student/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

// 导出学生数据
export const exportStudents = (params) => {
    return request.get(`${API_BASE_URL}/basic_data/student/export`, {
        params,
        responseType: 'blob'
    })
}

// 消费趋势分析
export const getConsumptionTrend = (form) => {
    const params = buildParams(form)
    return request.get(`${API_BASE_URL}/consumption_data/trend`, {
        params,
        timeout: 300000
    })
}

// 窗口消费排名
export const getWindowRanking = (form) => {
    const params = buildParams(form)
    return request.get(`${API_BASE_URL}/consumption_data/window/ranking`, {
        params,
        timeout: 300000
    })
}

// 贫困生鉴别分析
export const getPoorIdentification = (form) => {
    const params = buildParams(form)
    return request.get(`${FASTAPI_BASE_URL}/analysis/poor-identification`, {
        params,
        timeout: 300000
    })
}

// 消费对比分析
export const getConsumptionCompare = (form) => {
    const params = buildParams(form)
    return request.get(`${FASTAPI_BASE_URL}/analysis/compare`, {
        params,
        timeout: 300000
    })
}

// 获取仪表板数据
export const getDashboardData = () => {
    return request.get(`${API_BASE_URL}/dashboard/data`)
}

// 获取系统状态
export const getSystemStatus = () => {
    return request.get(`${API_BASE_URL}/system/status`)
}

// ==================== 系统日志相关API ====================
// 获取系统日志列表
export const getSystemLogs = (params) => {
    const queryParams = buildParams(params)
    return request.get(`${API_BASE_URL}/system/logs`, { params: queryParams })
}

// 导出系统日志
export const exportSystemLogs = (params) => {
    const queryParams = buildParams(params)
    return request.get(`${API_BASE_URL}/system/logs/export`, {
        params: queryParams,
        responseType: 'blob'
    })
}

// 删除系统日志
export const deleteSystemLogs = (logIds) => {
    return request.delete(`${API_BASE_URL}/system/logs`, {
        data: { logIds }
    })
}

// 默认导出
export default {
    // 学生信息
    getStudentInfo,
    getStudentScores,
    getStudentList,
    getStudentDetail,
    addStudent,
    updateStudent,
    deleteStudent,
    importStudents,
    exportStudents,

    // 消费数据
    getConsumption,
    getConsumptionData,
    getConsumptionTop,
    getConsumptionGroup,
    getConsumptionTrend,
    getWindowRanking,
    getConsumptionDateQuery,

    // 分析功能
    getScoreCorrelation,
    getConsumptionDrift,
    getPovertyIdentification,
    getPoorIdentification,
    getConsumptionCompare,

    // 汇总数据
    getSummaryData,

    // 系统功能
    getDashboardData,
    getSystemStatus,

    // 系统日志
    getSystemLogs,
    exportSystemLogs,
    deleteSystemLogs
}