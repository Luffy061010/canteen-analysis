import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import router from "../router/index"

const request = axios.create({
    baseURL: "/api",
    timeout: 600000,
});

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        // 从localStorage获取token
        const token = localStorage.getItem('token')
        const userInfo = localStorage.getItem('userInfo')
        
        if (token) {
            // 添加token到请求头
            config.headers.Authorization = `Bearer ${token}`
        }
        
        // 如果有用户信息，可以添加其他请求头
        if (userInfo) {
            try {
                const user = JSON.parse(userInfo)
                if (user.userId) {
                    config.headers['X-User-Id'] = user.userId
                }
            } catch (e) {
                console.warn('解析用户信息失败:', e)
            }
        }
        
        return config;
    },
    (error) => {
        console.error('请求拦截器错误:', error)
        return Promise.reject(error);
    }
)

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        // 统一处理响应数据
        const res = response.data;
        
        // 如果后端返回了统一的响应格式，可以在这里处理
        // 例如: { code: 200, data: ..., message: 'success' }
        if (res.code && res.code !== 200) {
            ElMessage.error(res.message || '请求失败')
            return Promise.reject(new Error(res.message || '请求失败'))
        }
        
        // 直接返回data，如果没有统一格式则返回整个response.data
        return res.data !== undefined ? res.data : res;
    },
    (error) => {
        console.error('响应拦截器错误:', error)
        
        if (error.response) {
            const { status, data } = error.response;
            
            switch (status) {
                case 401:
                    ElMessageBox.confirm(
                        '登录已过期，请重新登录',
                        '提示',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                        }
                    ).then(() => {
                        // 清除本地存储
                        localStorage.removeItem('token')
                        localStorage.removeItem('userInfo')
                        // 跳转到登录页（如果有登录页面）
                        // router.push('/login')
                        // 当前先刷新页面
                        window.location.reload()
                    })
                    break;
                case 403:
                    ElMessage.error(data?.message || '没有权限访问该资源')
                    break;
                case 404:
                    ElMessage.error(data?.message || '请求的资源不存在')
                    break;
                case 422:
                    ElMessage.error(data?.message || '请求参数验证失败')
                    break;
                case 500:
                    ElMessage.error(data?.message || '服务器内部错误，请稍后重试')
                    break;
                case 503:
                    ElMessage.error(data?.message || '服务暂不可用，请稍后重试')
                    break;
                default:
                    ElMessage.error(data?.message || `请求失败 (${status})`)
            }
        } else if (error.request) {
            // 请求已发出但没有收到响应
            ElMessage.error('网络错误，请检查网络连接')
        } else {
            // 发送请求时出错
            ElMessage.error(error.message || '请求失败')
        }
        
        return Promise.reject(error);
    }
)

export default request;