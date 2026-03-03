// 社交相关类型定义

// 用户简要信息
export interface UserBrief {
  id: string
  username: string
  nickname: string
  avatar: string
  bio?: string
  followingCount: number
  followersCount: number
  likeCount: number
  isFollowing?: boolean // 当前用户是否关注了该用户
}

// 评论
export interface Comment {
  id: string
  noteId: string
  userId: string
  username: string
  userAvatar: string
  content: string
  likeCount: number
  isLiked?: boolean
  replyTo?: string // 回复的评论ID
  replyToUser?: string // 回复的用户名
  createdAt: string
  replies?: Comment[] // 子回复列表
  replyCount?: number // 回复总数
}

// 关注用户参数
export interface FollowUserParams {
  userId: string
}

// 获取关注列表参数
export interface GetFollowListParams {
  userId?: string // 不传则获取当前用户的
  page?: number
  pageSize?: number
}

// 用户列表响应
export interface UserListResponse {
  code: number
  message: string
  data: {
    list: UserBrief[]
    total: number
    page: number
    pageSize: number
  }
}

// 评论列表参数
export interface GetCommentsParams {
  noteId: string
  page?: number
  pageSize?: number
}

// 添加评论参数
export interface AddCommentParams {
  noteId: string
  content: string
  replyTo?: string
}

// 评论点赞参数
export interface LikeCommentParams {
  commentId: string
}

// 评论点赞响应
export interface LikeCommentResponse {
  code: number
  message: string
  data: {
    isLiked: boolean
    likeCount: number
  }
}

// 评论列表响应
export interface CommentListResponse {
  code: number
  message: string
  data: {
    list: Comment[]
    total: number
    page: number
    pageSize: number
  }
}

// 通用响应
export interface CommonResponse {
  code: number
  message: string
  data?: unknown
}
