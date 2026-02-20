// 文件夹模拟数据
import type { Folder } from '@/api/types/folder'

export const mockFolders: Folder[] = [
  {
    id: 'folder-1',
    name: '前端技术',
    noteCount: 12,
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 'folder-2',
    name: '设计灵感',
    noteCount: 8,
    createdAt: '2024-01-20T08:00:00.000Z',
    updatedAt: '2024-01-20T08:00:00.000Z',
  },
  {
    id: 'folder-3',
    name: '生活日常',
    noteCount: 15,
    createdAt: '2024-02-01T08:00:00.000Z',
    updatedAt: '2024-02-01T08:00:00.000Z',
  },
]
