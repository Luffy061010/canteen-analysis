import axios from 'axios';

// 创建axios实例 - 修复环境变量引用
const apiService = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
});

// 请求拦截器
apiService.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
apiService.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('无权访问');
                    break;
                case 404:
                    console.error('请求资源不存在');
                    break;
                case 500:
                    console.error('服务器内部错误');
                    break;
                default:
                    console.error('请求失败', error.response.status);
            }
        } else {
            console.error('网络错误，请检查网络连接');
        }
        return Promise.reject(error);
    }
);

// API模块
const api = {
    student: {
        getList: (params) => apiService.get('/students', { params }),
        getDetail: (id) => apiService.get(`/students/${id}`),
        update: (id, data) => apiService.put(`/students/${id}`, data),
        create: (data) => apiService.post('/students', data),
        delete: (id) => apiService.delete(`/students/${id}`),
    },
    consumption: {
        getList: (params) => apiService.get('/consumptions', { params }),
        getDetail: (id) => apiService.get(`/consumptions/${id}`),
        getStatistics: (params) => apiService.get('/consumptions/statistics', { params }),
        driftDetection: (data) => apiService.post('/consumptions/drift-detection', data),
        povertyIdentification: (data) => apiService.post('/consumptions/poverty-identification', data),
        scoreCorrelation: (data) => apiService.post('/consumptions/score-correlation', data),
    },
    system: {
        getOverview: () => apiService.get('/system/overview'),
        getAlerts: (params) => apiService.get('/system/alerts', { params }),
    },
    auth: {
        login: (data) => apiService.post('/auth/login', data),
        logout: () => apiService.post('/auth/logout'),
        getUserInfo: () => apiService.get('/auth/userinfo'),
    },
};

export { apiService, api };
export default apiService;
