// 社交相关状态管理
import { defineStore } from 'pinia'
import type { UserBrief, Comment } from '@/api/types/social'
import * as socialApi from '@/api/social'

interface SocialState {
  followingList: UserBrief[]
  followersList: UserBrief[]
  comments: Comment[]
  commentTotal: number
  loading: boolean
}

export const useSocialStore = defineStore('social', {
  state: (): SocialState => ({
    followingList: [],
    followersList: [],
    comments: [],
    commentTotal: 0,
    loading: false,
  }),

  actions: {
    // 关注用户
    async followUser(userId: string) {
      try {
        const response = await socialApi.followUser({ userId })
        if (response.code === 200) {
          ElMessage.success(response.message)
          return true
        }
        return false
      } catch (error) {
        console.error('关注失败:', error)
        ElMessage.error('操作失败')
        return false
      }
    },

    // 取消关注用户
    async unfollowUser(userId: string) {
      try {
        const response = await socialApi.unfollowUser({ userId })
        if (response.code === 200) {
          ElMessage.success(response.message)
          // 从关注列表中移除
          this.followingList = this.followingList.filter((user) => user.id !== userId)
          return true
        }
        return false
      } catch (error) {
        console.error('取消关注失败:', error)
        ElMessage.error('操作失败')
        return false
      }
    },

    // 获取关注列表
    async fetchFollowingList(userId?: string) {
      this.loading = true
      try {
        const response = await socialApi.getFollowingList({ userId })
        if (response.code === 200) {
          this.followingList = response.data.list
        }
      } catch (error) {
        console.error('获取关注列表失败:', error)
        ElMessage.error('获取关注列表失败')
      } finally {
        this.loading = false
      }
    },

    // 获取粉丝列表
    async fetchFollowersList(userId?: string) {
      this.loading = true
      try {
        const response = await socialApi.getFollowersList({ userId })
        if (response.code === 200) {
          this.followersList = response.data.list
        }
      } catch (error) {
        console.error('获取粉丝列表失败:', error)
        ElMessage.error('获取粉丝列表失败')
      } finally {
        this.loading = false
      }
    },

    // 获取评论列表
    async fetchComments(noteId: string, page = 1) {
      this.loading = true
      try {
        const response = await socialApi.getComments({ noteId, page, pageSize: 20 })
        if (response.code === 200) {
          if (page === 1) {
            this.comments = response.data.list
          } else {
            this.comments.push(...response.data.list)
          }
          this.commentTotal = response.data.total
        }
      } catch (error) {
        console.error('获取评论列表失败:', error)
        ElMessage.error('获取评论列表失败')
      } finally {
        this.loading = false
      }
    },

    // 添加评论
    async addComment(noteId: string, content: string, replyTo?: string) {
      try {
        const response = await socialApi.addComment({ noteId, content, replyTo })
        if (response.code === 200) {
          ElMessage.success('评论成功')
          // 重新获取评论列表
          await this.fetchComments(noteId)
          return true
        }
        return false
      } catch (error) {
        console.error('评论失败:', error)
        ElMessage.error('评论失败')
        return false
      }
    },

    // 重置状态
    reset() {
      this.followingList = []
      this.followersList = []
      this.comments = []
      this.commentTotal = 0
      this.loading = false
    },
  },
})
