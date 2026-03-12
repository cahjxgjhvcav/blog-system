import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 5000
})
// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`//作用：将token放到请求头中，以便服务器进行身份验证
    }
    return config
  },
  (err) => Promise.reject(err)
)
// 添加响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO 4. 摘取核心响应数据
    if (res.data.code === 0){//根据服务器返回的响应状态码判断请求是否成功
        return res
    }
    // TODO 3. 处理业务失败
    ElMessage.error(res.data.message || '服务器响应失败')
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 5. 处理401错误
    //特殊情况：401是因为token过期或权限不足，需要跳转到登录页
    if (err.response?.status === 401) {
        router.push('/login')
    }
    //错误的默认处理方式
    ElMessage.error(err.response.data.message || '服务器响应失败')
    return Promise.reject(err)
  }
)

export default instance
// TODO 6. 导出
export { baseURL }