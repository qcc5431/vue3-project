// 文件上传相关API
import request from '@/utils/request'

// 上传响应类型
export interface UploadImageResponse {
  code: number
  message: string
  data: {
    url: string
    width: number
    height: number
  }
}

export interface UploadVideoResponse {
  code: number
  message: string
  data: {
    url: string
    width: number
    height: number
    duration: number
  }
}

export interface UploadCredentialResponse {
  code: number
  message: string
  data: {
    uploadUrl: string
    key: string
    credentials: {
      tmpSecretId: string
      tmpSecretKey: string
      sessionToken: string
      expiredTime: number
    }
  }
}

// 上传图片
export const uploadImage = (
  file: File,
  type: 'note' | 'avatar' = 'note',
): Promise<UploadImageResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)
  return request.post('/api/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 上传视频
export const uploadVideo = (file: File): Promise<UploadVideoResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/api/upload/video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 获取上传凭证（前端直传COS方案）
export const getUploadCredential = (
  type: 'image' | 'video',
  ext: string,
): Promise<UploadCredentialResponse> => {
  return request.get('/api/upload/credential', {
    params: { type, ext },
  })
}
