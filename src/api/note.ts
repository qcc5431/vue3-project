// 笔记相关API
import request from '@/utils/request'
import type {
  CreateNoteParams,
  UpdateNoteParams,
  GetNoteListParams,
  NoteListResponse,
  NoteDetailResponse,
  CommonResponse,
} from './types/note'

// 获取笔记列表
export const getNoteList = (params: GetNoteListParams = {}): Promise<NoteListResponse> => {
  return request.get('/api/notes', { params })
}

// 获取笔记详情
export const getNoteDetail = (id: string): Promise<NoteDetailResponse> => {
  return request.get(`/api/notes/${id}`)
}

// 创建笔记
export const createNote = (params: CreateNoteParams): Promise<CommonResponse> => {
  return request.post('/api/notes', params)
}

// 更新笔记
export const updateNote = (params: UpdateNoteParams): Promise<CommonResponse> => {
  const { id, ...data } = params
  return request.put(`/api/notes/${id}`, data)
}

// 删除笔记
export const deleteNote = (id: string): Promise<CommonResponse> => {
  return request.delete(`/api/notes/${id}`)
}

// 点赞笔记
export const likeNote = (id: string): Promise<CommonResponse> => {
  return request.post(`/api/notes/${id}/like`)
}

// 收藏笔记
export const collectNote = (id: string): Promise<CommonResponse> => {
  return request.post(`/api/notes/${id}/collect`)
}
