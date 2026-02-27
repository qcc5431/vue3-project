// 笔记相关API
import type {
  CreateNoteParams,
  UpdateNoteParams,
  GetNoteListParams,
  NoteListResponse,
  NoteDetailResponse,
  CommonResponse,
} from './types/note'
import { mockNotes, getNoteById } from '@/mock/notes'

// 模拟API延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 获取笔记列表
export const getNoteList = async (params: GetNoteListParams = {}): Promise<NoteListResponse> => {
  await delay(300)

  const {
    page = 1,
    pageSize = 20,
    sortType = 'recommend',
    authorId,
    isFollowing,
    isCollected,
  } = params

  let filteredNotes = [...mockNotes]

  // 按作者筛选
  if (authorId) {
    filteredNotes = filteredNotes.filter((note) => note.authorId === authorId)
  }

  // 按关注筛选 (模拟：只显示authorId为2和4的笔记)
  if (isFollowing) {
    filteredNotes = filteredNotes.filter((note) => ['2', '4'].includes(note.authorId))
  }

  // 按收藏筛选
  if (isCollected) {
    filteredNotes = filteredNotes.filter((note) => note.isCollected)
  }

  // 排序
  if (sortType === 'latest') {
    filteredNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (sortType === 'hot') {
    filteredNotes.sort((a, b) => b.likeCount - a.likeCount)
  }

  // 分页
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedNotes = filteredNotes.slice(start, end)

  // 列表接口优化：只返回第一张封面，减少数据传输
  const list = paginatedNotes.map((note) => ({
    ...note,
    coverMedia: note.coverMedia.slice(0, 1), // 只取第一张封面
  }))

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredNotes.length,
      page,
      pageSize,
    },
  }
}

// 获取笔记详情
export const getNoteDetail = async (id: string): Promise<NoteDetailResponse> => {
  await delay(200)

  const note = getNoteById(id)

  if (!note) {
    throw new Error('笔记不存在')
  }

  return {
    code: 200,
    message: 'success',
    data: note,
  }
}

// 创建笔记
export const createNote = async (params: CreateNoteParams): Promise<CommonResponse> => {
  await delay(500)

  // 模拟创建成功
  const newNote = {
    id: Date.now().toString(),
    ...params,
    authorId: '1', // 模拟当前用户ID
    authorName: '旅行者小王',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler01',
    likeCount: 0,
    collectCount: 0,
    commentCount: 0,
    viewCount: 0,
    isLiked: false,
    isCollected: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockNotes.unshift(newNote)

  return {
    code: 200,
    message: '创建成功',
    data: { id: newNote.id },
  }
}

// 更新笔记
export const updateNote = async (params: UpdateNoteParams): Promise<CommonResponse> => {
  await delay(500)

  const index = mockNotes.findIndex((note) => note.id === params.id)

  if (index === -1) {
    return {
      code: 404,
      message: '笔记不存在',
    }
  }

  // 更新笔记
  const targetNote = mockNotes[index]
  if (targetNote) {
    Object.assign(targetNote, params, { updatedAt: new Date().toISOString() })
  }

  return {
    code: 200,
    message: '更新成功',
  }
}

// 删除笔记
export const deleteNote = async (id: string): Promise<CommonResponse> => {
  await delay(300)

  const index = mockNotes.findIndex((note) => note.id === id)

  if (index === -1) {
    return {
      code: 404,
      message: '笔记不存在',
    }
  }

  mockNotes.splice(index, 1)

  return {
    code: 200,
    message: '删除成功',
  }
}

// 点赞笔记
export const likeNote = async (id: string): Promise<CommonResponse> => {
  await delay(200)

  const note = getNoteById(id)

  if (!note) {
    return {
      code: 404,
      message: '笔记不存在',
    }
  }

  // 切换点赞状态
  note.isLiked = !note.isLiked
  note.likeCount += note.isLiked ? 1 : -1

  return {
    code: 200,
    message: note.isLiked ? '点赞成功' : '取消点赞',
  }
}

// 收藏笔记
export const collectNote = async (id: string): Promise<CommonResponse> => {
  await delay(200)

  const note = getNoteById(id)

  if (!note) {
    return {
      code: 404,
      message: '笔记不存在',
    }
  }

  // 切换收藏状态
  note.isCollected = !note.isCollected
  note.collectCount += note.isCollected ? 1 : -1

  return {
    code: 200,
    message: note.isCollected ? '收藏成功' : '取消收藏',
  }
}
