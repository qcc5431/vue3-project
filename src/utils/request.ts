import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'

// 利用 axios 对象的 create 方法，创建 axios 实例，来增加一些额外配置
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
})

// 请求拦截器：在请求发送前自动携带 token
request.interceptors.request.use((config) => {
  const userStore = useUserStore()

  // 如果用户已登录，在请求头中携带 token
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }

  return config
})

// 响应拦截器：处理响应数据和错误
request.interceptors.response.use(
  (response) => {
    // 成功回调
    return response.data
  },
  (error) => {
    // 失败回调，处理 http 网络错误
    let message = ''
    const status = error.response?.status
    const userStore = useUserStore()

    // 优先使用后端返回的错误信息
    const backendMessage = error.response?.data?.message || error.response?.data?.msg

    if (backendMessage) {
      message = backendMessage
    } else {
      // 如果后端没有返回错误信息，使用默认提示
      switch (status) {
        case 401:
          message = 'token 过期，请重新登录'
          // token 过期或无效，清除用户信息并弹出登录框
          userStore.logout()
          userStore.openLoginModal()
          break
        case 403:
          message = '无权访问'
          break
        case 404:
          message = '请求地址错误'
          break
        case 500:
          message = '服务器出现问题'
          break
        default:
          message = '网络出现问题'
          break
      }
    }

    // 对于 401 错误，即使有后端消息也要执行登出逻辑
    if (status === 401) {
      userStore.logout()
      userStore.openLoginModal()
    }

    ElMessage({
      type: 'error',
      message,
    })

    return Promise.reject(error)
  },
)

export default request
