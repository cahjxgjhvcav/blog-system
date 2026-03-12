//pinia独立使用
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia


//实现统一管理导出
// import { useUserStore } from './modules/user'
// export { useUserStore }

export * from './modules/user'