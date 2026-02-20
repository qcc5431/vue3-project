// 文件夹相关类型定义

// 文件夹
export interface Folder {
  id: string
  name: string
  noteCount: number // 文件夹中的笔记数量
  createdAt: string
  updatedAt: string
}

// 创建文件夹参数
export interface CreateFolderParams {
  name: string
}

// 更新文件夹参数
export interface UpdateFolderParams {
  id: string
  name: string
}

// 文件夹列表响应
export interface FolderListResponse {
  code: number
  message: string
  data: Folder[]
}

// 通用响应
export interface CommonResponse {
  code: number
  message: string
  data?: unknown
}
