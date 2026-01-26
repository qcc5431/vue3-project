export interface LoginParams {
  username: string
  password: string
}

export interface UserInfo {
  id: number
  username: string
  email?: string
  avatar?: string
}

export interface LoginResponse {
  token: string
  userInfo: UserInfo
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
