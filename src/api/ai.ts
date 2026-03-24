// AI相关API
import request from '@/utils/request'

// 优化文案响应
export interface OptimizeContentResponse {
  code: number
  message: string
  data: {
    originalContent: string
    optimizedContent: string
  }
}

// 生成标题响应
export interface GenerateTitlesResponse {
  code: number
  message: string
  data: {
    titles: string[]
  }
}

// 扩展内容响应
export interface ExpandContentResponse {
  code: number
  message: string
  data: {
    originalContent: string
    expandedContent: string
  }
}

// 优化文案
export const optimizeContent = (content: string): Promise<OptimizeContentResponse> => {
  return request.post('/api/ai/optimize-content', { content })
}

// 生成标题建议
export const generateTitles = (content: string): Promise<GenerateTitlesResponse> => {
  return request.post('/api/ai/generate-titles', { content })
}

// 扩展内容
export const expandContent = (content: string, topic?: string): Promise<ExpandContentResponse> => {
  return request.post('/api/ai/expand-content', { content, topic })
}