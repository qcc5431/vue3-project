import request from '@/utils/request'

// "type"向开发者和编译器明确表示，这些导入的符号仅作为类型使用，而不会在运行时作为值（变量、类等）存在
import type {
  LoginParams,
  LoginResponse,
  UserInfo,
  RegisterParams,
  RegisterResponse,
} from './types/user'

// 用户登录
export const reqLogin = (data: LoginParams) => request.post<LoginResponse>('/api/users/login', data)

// 获取用户信息
export const reqUserInfo = () => request.get<UserInfo>('/api/users/info')

// 用户注册
export const reqRegister = (data: RegisterParams) =>
  request.post<RegisterResponse>('/api/users/register', data)
