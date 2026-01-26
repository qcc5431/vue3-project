/// <reference types="vite/client" />

// 扩展 vue-router 的类型定义
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    icon?: any
    hideInMenu?: boolean
  }
}
