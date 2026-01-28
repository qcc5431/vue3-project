// 社交相关API
import type {
  FollowUserParams,
  GetFollowListParams,
  UserListResponse,
  GetCommentsParams,
  AddCommentParams,
  CommentListResponse,
  CommonResponse,
} from './types/social'
import { mockUsers, getUserById } from '@/mock/users'
import { mockComments, getCommentsByNoteId } from '@/mock/comments'

// 模拟API延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 关注用户
export const followUser = async (params: FollowUserParams): Promise<CommonResponse> => {
  await delay(300)

  const user = getUserById(params.userId)

  if (!user) {
    return {
      code: 404,
      message: '用户不存在',
    }
  }

  // 切换关注状态
  user.isFollowing = !user.isFollowing
  user.followersCount += user.isFollowing ? 1 : -1

  return {
    code: 200,
    message: user.isFollowing ? '关注成功' : '取消关注',
  }
}

// 取消关注用户
export const unfollowUser = async (params: FollowUserParams): Promise<CommonResponse> => {
  return followUser(params)
}

// 获取关注列表
export const getFollowingList = async (
  params: GetFollowListParams = {},
): Promise<UserListResponse> => {
  await delay(300)

  const { page = 1, pageSize = 10 } = params

  // 模拟：返回isFollowing为true的用户
  const followingUsers = mockUsers.filter((user) => user.isFollowing)

  // 分页
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = followingUsers.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: followingUsers.length,
      page,
      pageSize,
    },
  }
}

// 获取粉丝列表
export const getFollowersList = async (
  params: GetFollowListParams = {},
): Promise<UserListResponse> => {
  await delay(300)

  const { page = 1, pageSize = 10 } = params

  // 模拟：返回部分用户作为粉丝
  const followers = mockUsers.slice(0, 3)

  // 分页
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = followers.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: followers.length,
      page,
      pageSize,
    },
  }
}

// 获取评论列表
export const getComments = async (params: GetCommentsParams): Promise<CommentListResponse> => {
  await delay(300)

  const { noteId, page = 1, pageSize = 10 } = params

  const comments = getCommentsByNoteId(noteId)

  // 分页
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = comments.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: comments.length,
      page,
      pageSize,
    },
  }
}

// 添加评论
export const addComment = async (params: AddCommentParams): Promise<CommonResponse> => {
  await delay(500)

  const newComment = {
    id: `c${Date.now()}`,
    noteId: params.noteId,
    userId: '1', // 模拟当前用户ID
    username: '旅行者小王',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler01',
    content: params.content,
    likeCount: 0,
    isLiked: false,
    replyTo: params.replyTo,
    createdAt: new Date().toISOString(),
  }

  mockComments.push(newComment)

  return {
    code: 200,
    message: '评论成功',
    data: { id: newComment.id },
  }
}
