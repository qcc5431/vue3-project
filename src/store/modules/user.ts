import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo } from '@/api/user'
import type { LoginParams, UserInfo } from '@/api/types/user'

interface UserState {
  token: string | null
  userInfo: UserInfo | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token') || null,
    userInfo: null,
  }),

  getters: {
    // 是否已登录
    isLogin: (state) => !!state.token,
    // 获取用户名
    username: (state) => state.userInfo?.username || '',
    // 获取用户头像
    avatar: (state) => state.userInfo?.avatar || '',
  },

  actions: {
    // 用户登录
    async login(loginParams: LoginParams) {
      try {
        // 调用真实的登录接口
        const res = await reqLogin(loginParams)

        // 从响应中提取 token 和 user 信息
        const { token, user } = res.data

        // 保存 token
        this.token = token
        // 将 user 信息转换为 userInfo 格式并保存
        this.userInfo = {
          id: user.id,
          username: user.username,
          email: user.email,
        }

        // 持久化存储 token
        localStorage.setItem('token', token)

        return res
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    },

    // 获取用户信息
    async getUserInfo() {
      try {
        const res = await reqUserInfo()
        this.userInfo = res.data
        return res
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    },

    // 用户登出
    logout() {
      this.token = null
      this.userInfo = null
      localStorage.removeItem('token')
    },
  },
})
