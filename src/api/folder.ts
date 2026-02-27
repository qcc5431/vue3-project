// 文件夹相关 API
import request from '@/utils/request'
import type {
  CreateFolderParams,
  UpdateFolderParams,
  FolderListResponse,
  CommonResponse,
} from './types/folder'

// 获取文件夹列表
export const getFolderList = (): Promise<FolderListResponse> => {
  return request.get('/api/folders')
}

// 创建文件夹
export const createFolder = (params: CreateFolderParams): Promise<CommonResponse> => {
  return request.post('/api/folders', params)
}

// 更新文件夹
export const updateFolder = (params: UpdateFolderParams): Promise<CommonResponse> => {
  const { id, name } = params
  return request.put(`/api/folders/${id}`, { name })
}

// 删除文件夹
export const deleteFolder = (id: string): Promise<CommonResponse> => {
  return request.delete(`/api/folders/${id}`)
}

// 添加笔记到文件夹
export const addNoteToFolder = (folderId: string, noteId: string): Promise<CommonResponse> => {
  return request.post(`/api/folders/${folderId}/notes/${noteId}`)
}

// 从文件夹移除笔记
export const removeNoteFromFolder = (folderId: string, noteId: string): Promise<CommonResponse> => {
  return request.delete(`/api/folders/${folderId}/notes/${noteId}`)
}
