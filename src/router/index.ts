import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

// 导入路由组件
const Layout = () => import('@/layout/index.vue')
const Login = () => import('@/views/login/index.vue')
const NotFound = () => import('@/views/404/index.vue')

// 定义路由规则
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '工作台',
          requiresAuth: true,
        },
      },
      {
        path: 'system',
        name: 'System',
        redirect: '/system/user',
        meta: { title: '系统管理' },
        children: [
          {
            path: 'user',
            name: 'SystemUser',
            component: () => import('@/views/system/user/index.vue'),
            meta: { title: '用户管理', requiresAuth: true },
          },
          {
            path: 'role',
            name: 'SystemRole',
            component: () => import('@/views/system/role/index.vue'),
            meta: { title: '角色管理', requiresAuth: true },
          },
          {
            path: 'menu',
            name: 'SystemMenu',
            component: () => import('@/views/system/menu/index.vue'),
            meta: { title: '菜单管理', requiresAuth: true },
          },
        ],
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: { title: '个人中心', requiresAuth: true },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/settings/index.vue'),
        meta: { title: '账号设置', requiresAuth: true },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '404 - 页面不存在',
    },
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 每次路由切换时，页面都会自动滚动到顶部（左上角 0,0 位置）
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
})

// 全局前置守卫：路由跳转前的鉴权判断
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  const userStore = useUserStore()
  const isLogin = userStore.isLogin

  // 如果目标路由需要登录认证
  if (to.meta.requiresAuth) {
    if (isLogin) {
      // 已登录，允许访问
      next()
    } else {
      // 未登录，跳转到登录页
      ElMessage.warning('请先登录')
      next('/login')
    }
  } else if (to.path === '/login' && isLogin) {
    // 已登录用户访问登录页，重定向到首页
    next('/home')
  } else {
    // 不需要登录认证的页面，直接访问
    next()
  }
})

export default router
