import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import '@/assets/styles/global.scss' // 引入全局样式（会注入到页面）

// 创建 Vue 应用实例
const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn,
})

app.mount('#app')

