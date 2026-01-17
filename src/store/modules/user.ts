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
        // 模拟登录接口,默认通过
        // const res = await reqLogin(loginParams)

        // 模拟返回的数据结构
        const mockToken: string = 'mock-token-' + Date.now()
        const mockUserInfo: UserInfo = {
          username: loginParams.username,
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        }

        this.token = mockToken
        this.userInfo = mockUserInfo
        // 持久化存储 token
        localStorage.setItem('token', mockToken)

        // 返回模拟的响应数据
        return {
          code: 200,
          message: '登录成功',
          data: {
            token: mockToken,
            userInfo: mockUserInfo,
          },
        }
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
