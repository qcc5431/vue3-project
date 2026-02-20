// 文件夹相关状态管理
import { defineStore } from 'pinia'
import type { Folder } from '@/api/types/folder'
import * as folderApi from '@/api/folder'

interface FolderState {
  folders: Folder[]
  currentFolderId: string | null // 当前选中的文件夹ID，null表示全部收藏
  loading: boolean
}

export const useFolderStore = defineStore('folder', {
  state: (): FolderState => ({
    folders: [],
    currentFolderId: null,
    loading: false,
  }),

  getters: {
    // 获取当前选中的文件夹
    currentFolder: (state) => {
      if (!state.currentFolderId) return null
      return state.folders.find((folder) => folder.id === state.currentFolderId) || null
    },

    // 获取全部笔记数量（所有文件夹的笔记数之和）
    totalNoteCount: (state) => {
      return state.folders.reduce((sum, folder) => sum + folder.noteCount, 0)
    },
  },

  actions: {
    // 获取文件夹列表
    async fetchFolders() {
      this.loading = true
      try {
        const response = await folderApi.getFolderList()
        if (response.code === 200) {
          this.folders = response.data
        }
      } catch (error) {
        console.error('获取文件夹列表失败:', error)
        ElMessage.error('获取文件夹列表失败')
      } finally {
        this.loading = false
      }
    },

    // 创建文件夹
    async createFolder(name: string) {
      try {
        const response = await folderApi.createFolder({ name })
        if (response.code === 200) {
          ElMessage.success('创建成功')
          // 重新获取文件夹列表
          await this.fetchFolders()
          return true
        }
        return false
      } catch (error) {
        console.error('创建文件夹失败:', error)
        ElMessage.error('创建文件夹失败')
        return false
      }
    },

    // 更新文件夹
    async updateFolder(id: string, name: string) {
      try {
        const response = await folderApi.updateFolder({ id, name })
        if (response.code === 200) {
          ElMessage.success('更新成功')
          // 重新获取文件夹列表
          await this.fetchFolders()
          return true
        }
        return false
      } catch (error) {
        console.error('更新文件夹失败:', error)
        ElMessage.error('更新文件夹失败')
        return false
      }
    },

    // 删除文件夹
    async deleteFolder(id: string) {
      try {
        const response = await folderApi.deleteFolder(id)
        if (response.code === 200) {
          ElMessage.success('删除成功')
          // 如果删除的是当前文件夹，切换到全部
          if (this.currentFolderId === id) {
            this.currentFolderId = null
          }
          // 重新获取文件夹列表
          await this.fetchFolders()
          return true
        }
        return false
      } catch (error) {
        console.error('删除文件夹失败:', error)
        ElMessage.error('删除文件夹失败')
        return false
      }
    },

    // 添加笔记到文件夹
    async addNoteToFolder(folderId: string, _noteId: string) {
      try {
        const response = await folderApi.addNoteToFolder()
        if (response.code === 200) {
          ElMessage.success('添加成功')
          // 更新文件夹笔记数量
          const folder = this.folders.find((f) => f.id === folderId)
          if (folder) {
            folder.noteCount += 1
          }
          return true
        }
        return false
      } catch (error) {
        console.error('添加到文件夹失败:', error)
        ElMessage.error('添加到文件夹失败')
        return false
      }
    },

    // 从文件夹移除笔记
    async removeNoteFromFolder(folderId: string, _noteId: string) {
      try {
        const response = await folderApi.removeNoteFromFolder()
        if (response.code === 200) {
          ElMessage.success('移除成功')
          // 更新文件夹笔记数量
          const folder = this.folders.find((f) => f.id === folderId)
          if (folder && folder.noteCount > 0) {
            folder.noteCount -= 1
          }
          return true
        }
        return false
      } catch (error) {
        console.error('从文件夹移除失败:', error)
        ElMessage.error('从文件夹移除失败')
        return false
      }
    },

    // 设置当前文件夹
    setCurrentFolder(folderId: string | null) {
      this.currentFolderId = folderId
    },

    // 重置状态
    reset() {
      this.folders = []
      this.currentFolderId = null
      this.loading = false
    },
  },
})
