// Mock用户数据
import type { UserBrief } from '@/api/types/social'

export const mockUsers: UserBrief[] = [
  {
    id: '1',
    username: 'traveler01',
    nickname: '旅行者小王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler01',
    bio: '热爱旅行，喜欢记录生活中的美好瞬间',
    followingCount: 128,
    followersCount: 456,
    likeCount: 1234,
    isFollowing: false,
  },
  {
    id: '2',
    username: 'explorer_lisa',
    nickname: '探险家Lisa',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=explorer_lisa',
    bio: '环球旅行中，已走过32个国家',
    followingCount: 256,
    followersCount: 2341,
    likeCount: 5678,
    isFollowing: true,
  },
  {
    id: '3',
    username: 'foodie_zhang',
    nickname: '美食家小张',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=foodie_zhang',
    bio: '用味蕾记录每一座城市',
    followingCount: 89,
    followersCount: 567,
    likeCount: 890,
    isFollowing: false,
  },
  {
    id: '4',
    username: 'photographer_mike',
    nickname: '摄影师Mike',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=photographer_mike',
    bio: '用镜头捕捉世界的美',
    followingCount: 345,
    followersCount: 3456,
    likeCount: 8901,
    isFollowing: true,
  },
  {
    id: '5',
    username: 'backpacker_amy',
    nickname: '背包客Amy',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=backpacker_amy',
    bio: '一个人的旅行，一个人的故事',
    followingCount: 67,
    followersCount: 234,
    likeCount: 456,
    isFollowing: false,
  },
]

// 根据ID获取用户
export const getUserById = (id: string): UserBrief | undefined => {
  return mockUsers.find((user) => user.id === id)
}
