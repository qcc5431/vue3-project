import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

// 导入路由组件
const Layout = () => import('@/layout/index.vue')
const NotFound = () => import('@/views/404/index.vue')

// Home and Note pages
const Home = () => import('@/views/home/index.vue')
const Following = () => import('@/views/following/index.vue')
const Favorites = () => import('@/views/favorites/index.vue')
const MyNotes = () => import('@/views/my-notes/index.vue')
const CreateNote = () => import('@/views/note/create.vue')
const NoteDetail = () => import('@/views/note/detail.vue')
const Profile = () => import('@/views/profile/index.vue')

// 定义路由规则
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/',
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
          title: '首页',
          requiresAuth: false, // 首页无需登录
        },
      },
      {
        path: '/following',
        name: 'Following',
        component: Following,
        meta: {
          title: '关注',
          requiresAuth: true,
        },
      },
      {
        path: '/favorites',
        name: 'Favorites',
        component: Favorites,
        meta: {
          title: '收藏',
          requiresAuth: true,
        },
      },
      {
        path: '/my-notes',
        name: 'MyNotes',
        component: MyNotes,
        meta: {
          title: '我的笔记',
          requiresAuth: true,
        },
      },
      {
        path: '/create',
        name: 'CreateNote',
        component: CreateNote,
        meta: {
          title: '创建笔记',
          requiresAuth: true,
        },
      },
      {
        path: '/note/:id',
        name: 'NoteDetail',
        component: NoteDetail,
        meta: {
          title: '笔记详情',
          requiresAuth: false, // 详情页无需登录
        },
      },
      {
        path: '/note/:id/edit',
        name: 'EditNote',
        component: CreateNote,
        meta: {
          title: '编辑笔记',
          requiresAuth: true,
        },
      },
      {
        path: '/profile/:id?',
        name: 'Profile',
        component: Profile,
        meta: {
          title: '个人主页',
          requiresAuth: false, // 个人主页无需登录
        },
      },
    ],
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
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
})

// 全局前置守卫：路由跳转前的鉴权判断
router.beforeEach((to, _from, next) => {
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
      userStore.openLoginModal()
      next(false) // 中断当前导航
    }
  } else {
    // 不需要登录认证的页面，直接访问
    next()
  }
})

export default router
