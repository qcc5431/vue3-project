// 文件夹相关 API
// import request from '@/utils/request'
import type {
  CreateFolderParams,
  UpdateFolderParams,
  FolderListResponse,
  CommonResponse,
} from './types/folder'
import { mockFolders } from '@/mock/folders'

// 获取文件夹列表
export const getFolderList = (): Promise<FolderListResponse> => {
  // return request.get('/folders')
  // 使用 mock 数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: mockFolders,
  })
}

// 创建文件夹
export const createFolder = (params: CreateFolderParams): Promise<CommonResponse> => {
  // return request.post('/folders', params)
  // 使用 mock 数据
  const newFolder = {
    id: `folder-${Date.now()}`,
    name: params.name,
    noteCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockFolders.push(newFolder)
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: newFolder,
  })
}

// 更新文件夹
export const updateFolder = (params: UpdateFolderParams): Promise<CommonResponse> => {
  // return request.put(`/folders/${params.id}`, { name: params.name })
  // 使用 mock 数据
  const folder = mockFolders.find((f) => f.id === params.id)
  if (folder) {
    folder.name = params.name
    folder.updatedAt = new Date().toISOString()
  }
  return Promise.resolve({
    code: 200,
    message: 'success',
  })
}

// 删除文件夹
export const deleteFolder = (id: string): Promise<CommonResponse> => {
  // return request.delete(`/folders/${id}`)
  // 使用 mock 数据
  const index = mockFolders.findIndex((f) => f.id === id)
  if (index !== -1) {
    mockFolders.splice(index, 1)
  }
  return Promise.resolve({
    code: 200,
    message: 'success',
  })
}

// 添加笔记到文件夹
export const addNoteToFolder = (): Promise<CommonResponse> => {
  // TODO: implement when backend is ready
  // return request.post(`/folders/${folderId}/notes/${noteId}`)
  return Promise.resolve({
    code: 200,
    message: 'success',
  })
}

// 从文件夹移除笔记
export const removeNoteFromFolder = (): Promise<CommonResponse> => {
  // TODO: implement when backend is ready
  // return request.delete(`/folders/${folderId}/notes/${noteId}`)
  return Promise.resolve({
    code: 200,
    message: 'success',
  })
}
