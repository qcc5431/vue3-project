// 笔记相关类型定义

// 笔记可见性
export type NoteVisibility = 'public' | 'private'

// 笔记排序类型
export type NoteSortType = 'latest' | 'hot' | 'recommend'

// 笔记
export interface Note {
  id: string
  title: string
  content: string // Markdown格式
  coverImage?: string // 封面图
  coverImageAspectRatio?: number // 封面图宽高比 (width/height)
  images: string[] // 笔记中的图片列表
  authorId: string
  authorName: string
  authorAvatar: string
  visibility: NoteVisibility
  likeCount: number
  collectCount: number
  commentCount: number
  viewCount: number
  isLiked?: boolean // 当前用户是否点赞
  isCollected?: boolean // 当前用户是否收藏
  createdAt: string
  updatedAt: string
}

// 创建笔记参数
export interface CreateNoteParams {
  title: string
  content: string
  coverImage?: string
  images: string[]
  visibility: NoteVisibility
}

// 更新笔记参数
export interface UpdateNoteParams {
  id: string
  title?: string
  content?: string
  coverImage?: string
  images?: string[]
  visibility?: NoteVisibility
}

// 获取笔记列表参数
export interface GetNoteListParams {
  page?: number
  pageSize?: number
  sortType?: NoteSortType
  authorId?: string // 指定作者ID
  isFollowing?: boolean // 是否只看关注的
  isCollected?: boolean // 是否只看收藏的
}

// 笔记列表响应
export interface NoteListResponse {
  code: number
  message: string
  data: {
    list: Note[]
    total: number
    page: number
    pageSize: number
  }
}

// 笔记详情响应
export interface NoteDetailResponse {
  code: number
  message: string
  data: Note
}

// 通用响应
export interface CommonResponse {
  code: number
  message: string
  data?: unknown
}
