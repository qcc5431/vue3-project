// 笔记相关状态管理
import { defineStore } from 'pinia'
import type { Note, NoteSortType, MediaItem } from '@/api/types/note'
import * as noteApi from '@/api/note'

interface NoteState {
  notes: Note[]
  currentNote: Note | null
  total: number
  page: number
  pageSize: number
  sortType: NoteSortType
  loading: boolean
  preloading: boolean // 预加载状态
  hasPreloaded: boolean // 是否已预加载下一批
}

export const useNoteStore = defineStore('note', {
  state: (): NoteState => ({
    notes: [],
    currentNote: null,
    total: 0,
    page: 1,
    pageSize: 20,
    sortType: 'recommend',
    loading: false,
    preloading: false,
    hasPreloaded: false,
  }),

  getters: {
    // 获取公开的笔记
    publicNotes: (state) => state.notes.filter((note) => note.visibility === 'public'),

    // 获取私有的笔记
    privateNotes: (state) => state.notes.filter((note) => note.visibility === 'private'),
  },

  actions: {
    // 获取笔记列表
    async fetchNotes(params?: {
      sortType?: NoteSortType
      authorId?: string
      isFollowing?: boolean
      isCollected?: boolean
      folderId?: string
    }) {
      this.loading = true
      try {
        const response = await noteApi.getNoteList({
          page: this.page,
          pageSize: this.pageSize,
          sortType: params?.sortType || this.sortType,
          ...params,
        })

        if (response.code === 200) {
          this.notes = response.data.list
          this.total = response.data.total
          this.page = response.data.page
          if (params?.sortType) {
            this.sortType = params.sortType
          }
        }
      } catch (error) {
        console.error('获取笔记列表失败:', error)
        ElMessage.error('获取笔记列表失败')
      } finally {
        this.loading = false
      }
    },

    // 加载更多笔记
    async loadMore() {
      // 如果已经预加载了，就不需要再加载了
      if (this.hasPreloaded) {
        this.hasPreloaded = false
        return
      }

      this.page += 1
      this.loading = true
      try {
        const response = await noteApi.getNoteList({
          page: this.page,
          pageSize: this.pageSize,
          sortType: this.sortType,
        })

        if (response.code === 200) {
          this.notes.push(...response.data.list)
          this.total = response.data.total
        }
      } catch (error) {
        console.error('加载更多失败:', error)
        ElMessage.error('加载更多失败')
      } finally {
        this.loading = false
      }
    },

    // 预加载下一批数据
    async preloadNext() {
      // 如果已经预加载或正在加载,则不重复加载
      if (this.hasPreloaded || this.preloading || this.loading) {
        return
      }

      // 如果已经加载所有数据,则不预加载
      if (this.notes.length >= this.total) {
        return
      }

      this.preloading = true
      try {
        const nextPage = this.page + 1
        const response = await noteApi.getNoteList({
          page: nextPage,
          pageSize: this.pageSize,
          sortType: this.sortType,
        })

        if (response.code === 200) {
          // 将预加载的数据追加到列表
          this.notes.push(...response.data.list)
          this.total = response.data.total
          this.page = nextPage // 更新页码
          this.hasPreloaded = true // 标记已预加载
        }
      } catch (error) {
        console.error('预加载失败:', error)
      } finally {
        this.preloading = false
      }
    },

    // 获取笔记详情
    async fetchNoteDetail(id: string) {
      this.loading = true
      try {
        const response = await noteApi.getNoteDetail(id)
        if (response.code === 200) {
          this.currentNote = response.data
        }
      } catch (error) {
        console.error('获取笔记详情失败:', error)
        ElMessage.error('获取笔记详情失败')
      } finally {
        this.loading = false
      }
    },

    // 创建笔记
    async createNote(params: {
      title: string
      content: string
      coverMedia: MediaItem[]
      images: string[]
      visibility: 'public' | 'private'
    }) {
      this.loading = true
      try {
        const response = await noteApi.createNote(params)
        if (response.code === 200) {
          ElMessage.success('创建成功')
          return true
        }
        return false
      } catch (error) {
        console.error('创建笔记失败:', error)
        ElMessage.error('创建笔记失败')
        return false
      } finally {
        this.loading = false
      }
    },

    // 更新笔记
    async updateNote(params: {
      id: string
      title?: string
      content?: string
      coverMedia?: MediaItem[]
      images?: string[]
      visibility?: 'public' | 'private'
    }) {
      this.loading = true
      try {
        const response = await noteApi.updateNote(params)
        if (response.code === 200) {
          ElMessage.success('更新成功')
          return true
        }
        return false
      } catch (error) {
        console.error('更新笔记失败:', error)
        ElMessage.error('更新笔记失败')
        return false
      } finally {
        this.loading = false
      }
    },

    // 删除笔记
    async deleteNote(id: string) {
      try {
        const response = await noteApi.deleteNote(id)
        if (response.code === 200) {
          ElMessage.success('删除成功')
          // 从列表中移除
          this.notes = this.notes.filter((note) => note.id !== id)
          return true
        }
        return false
      } catch (error) {
        console.error('删除笔记失败:', error)
        ElMessage.error('删除笔记失败')
        return false
      }
    },

    // 点赞笔记
    async likeNote(id: string) {
      try {
        const response = await noteApi.likeNote(id)
        if (response.code === 200) {
          // 更新列表中的笔记
          const note = this.notes.find((n) => n.id === id)
          if (note) {
            note.isLiked = !note.isLiked
            note.likeCount += note.isLiked ? 1 : -1
          }
          // 更新当前笔记
          if (this.currentNote && this.currentNote.id === id) {
            this.currentNote.isLiked = !this.currentNote.isLiked
            this.currentNote.likeCount += this.currentNote.isLiked ? 1 : -1
          }
          return true
        }
        return false
      } catch (error) {
        console.error('点赞失败:', error)
        ElMessage.error('操作失败')
        return false
      }
    },

    // 收藏笔记
    async collectNote(id: string) {
      try {
        const response = await noteApi.collectNote(id)
        if (response.code === 200) {
          // 更新列表中的笔记
          const note = this.notes.find((n) => n.id === id)
          if (note) {
            note.isCollected = !note.isCollected
            note.collectCount += note.isCollected ? 1 : -1
          }
          // 更新当前笔记
          if (this.currentNote && this.currentNote.id === id) {
            this.currentNote.isCollected = !this.currentNote.isCollected
            this.currentNote.collectCount += this.currentNote.isCollected ? 1 : -1
          }
          ElMessage.success(this.currentNote?.isCollected ? '收藏成功' : '取消收藏')
          return true
        }
        return false
      } catch (error) {
        console.error('收藏失败:', error)
        ElMessage.error('操作失败')
        return false
      }
    },

    // 重置状态
    reset() {
      this.notes = []
      this.currentNote = null
      this.total = 0
      this.page = 1
      this.sortType = 'recommend'
      this.loading = false
      this.preloading = false
      this.hasPreloaded = false
    },
  },
})
