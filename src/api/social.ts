// 社交相关API
import request from '@/utils/request'
import type {
  FollowUserParams,
  GetFollowListParams,
  UserListResponse,
  GetCommentsParams,
  AddCommentParams,
  LikeCommentParams,
  LikeCommentResponse,
  CommentListResponse,
  CommonResponse,
} from './types/social'

// 关注用户
export const followUser = (params: FollowUserParams): Promise<CommonResponse> => {
  return request.post('/api/social/follow', params)
}

// 取消关注用户
export const unfollowUser = (params: FollowUserParams): Promise<CommonResponse> => {
  return request.post('/api/social/follow', params) // 再次调用切换状态
}

// 获取关注列表
export const getFollowingList = (params: GetFollowListParams = {}): Promise<UserListResponse> => {
  return request.get('/api/social/following', { params })
}

// 获取粉丝列表
export const getFollowersList = (params: GetFollowListParams = {}): Promise<UserListResponse> => {
  return request.get('/api/social/followers', { params })
}

// 获取评论列表
export const getComments = (params: GetCommentsParams): Promise<CommentListResponse> => {
  return request.get('/api/social/comments', { params })
}

// 添加评论
export const addComment = (params: AddCommentParams): Promise<CommonResponse> => {
  return request.post('/api/social/comments', params)
}

// 评论点赞/取消点赞
export const likeComment = (params: LikeCommentParams): Promise<LikeCommentResponse> => {
  return request.post('/api/social/comments/like', params)
}
