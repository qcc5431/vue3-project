import type { MediaItem } from '@/api/types/note'

/**
 * 获取图片尺寸
 */
export function getImageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(img.src)
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      reject(new Error('无法加载图片'))
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * 获取视频元数据（宽度、高度、时长）
 */
export function getVideoMetadata(
  file: File,
): Promise<{ width: number; height: number; duration: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src)
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      })
    }

    video.onerror = () => {
      URL.revokeObjectURL(video.src)
      reject(new Error('无法加载视频元数据'))
    }

    video.src = URL.createObjectURL(file)
  })
}

/**
 * 从Markdown内容中提取图片URL
 */
export function extractImagesFromMarkdown(markdown: string): string[] {
  if (!markdown) return []
  const regex = /!\[.*?\]\((.*?)\)/g
  const matches = [...markdown.matchAll(regex)]
  return matches.map((match) => match[1] || '').filter((url) => url)
}

/**
 * 获取展示用的封面媒体列表
 * 如果有手动设置的coverMedia则使用，否则从内容中提取前N张图片
 */
export function getDisplayCoverMedia(
  coverMedia: MediaItem[] | undefined,
  content: string,
  limit: number = 3,
): MediaItem[] {
  // 如果有手动设置的封面，直接返回
  if (coverMedia && coverMedia.length > 0) {
    return coverMedia
  }

  // 否则从内容中提取图片
  const imageUrls = extractImagesFromMarkdown(content)
  if (imageUrls.length === 0) return []

  // 转换为MediaItem格式（使用默认尺寸）
  return imageUrls.slice(0, limit).map((url) => ({
    type: 'image' as const,
    url,
    width: 800,
    height: 600,
  }))
}
