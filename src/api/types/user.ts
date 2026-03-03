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

// 用户信息响应
export interface UserInfoResponse {
  code: number
  message: string
  data: UserInfo
}

export interface LoginResponse {
  code: number
  message: string
  data: {
    token: string
    user: UserInfo
  }
}

export interface RegisterParams {
  username: string
  password: string
  email: string
}

export interface RegisterResponse {
  code: number
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

// 发送验证码参数
export interface SendCodeParams {
  phone: string
}

// 发送验证码响应
export interface SendCodeResponse {
  code: number
  message: string
  data?: {
    code: string // 后端返回的验证码（测试阶段使用）
  }
}

// 手机验证码登录参数
export interface PhoneLoginParams {
  phone: string
  code: string
}

// 手机验证码登录响应
export interface PhoneLoginResponse {
  code: number
  message: string
  data: {
    token: string
    user: UserInfo
  }
}
