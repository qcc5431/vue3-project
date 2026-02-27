export interface LoginParams {
  account: string
  password: string
}

export interface UserInfo {
  id?: number
  username: string
  email?: string
  avatar?: string
}

export interface LoginResponse {
  token: string
  user: UserInfo
}

export interface RegisterParams {
  username: string
  password: string
  email: string
}

export interface RegisterResponse {
  message: string
  data: UserInfo
}

// 用户详情（包含社交信息）
export interface UserDetail {
  id: string
  username: string
  nickname: string
  avatar: string
  bio?: string
  followingCount: number
  followersCount: number
  likeCount: number
  isFollowing?: boolean
}

// 用户详情响应
export interface UserDetailResponse {
  code: number
  message: string
  data: UserDetail
}
