// Mock笔记数据
import type { Note } from '@/api/types/note'

const getAvatar = (name: string) => {
  // 使用 data URI 生成纯色头像
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const color = (colors[hash % colors.length] ?? '#FF6B6B').replace('#', '')
  const initial = name.charAt(0)
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Ccircle cx='64' cy='64' r='64' fill='%23${color}'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='0.35em' font-size='48' fill='white' font-family='Arial'%3E${initial}%3C/text%3E%3C/svg%3E`
}

export const mockNotes: Note[] = [
  {
    id: '1',
    title: '西藏布达拉宫之旅',
    content: `# 西藏布达拉宫之旅

终于来到了梦寐以求的布达拉宫！

## 第一印象

当我第一眼看到布达拉宫时，真的被震撼到了。红白相间的宫殿在蓝天白云的映衬下，显得格外壮观。

![布达拉宫远景](https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=1000)

## 游览体验

- 建议早上去，人少光线好
- 记得带身份证
- 高原反应要注意
- 里面不能拍照

## 小贴士

提前在网上预约门票，现场买不到哦！`,
    coverMedia: [
      {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=800',
        width: 600,
        height: 800,
      },
      {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=600&h=800',
        width: 600,
        height: 800,
      },
      {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=800',
        width: 600,
        height: 800,
      },
    ],
    images: ['https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=1000'],
    authorId: '2',
    authorName: '探险家Lisa',
    authorAvatar: getAvatar('Lisa'),
    visibility: 'public',
    likeCount: 1234,
    collectCount: 567,
    commentCount: 89,
    viewCount: 5432,
    isLiked: false,
    isCollected: false,
    createdAt: '2026-01-20T10:30:00Z',
    updatedAt: '2026-01-20T10:30:00Z',
  },
  {
    id: '2',
    title: '成都美食探店 - 3天吃遍春熙路',
    content: `# 成都美食攻略

作为一个吃货，来成都怎么能不好好吃一顿！

## Day 1: 火锅

去了当地人推荐的一家老火锅店，麻辣鲜香，太好吃了！

## Day 2: 串串

串串香真的是成都的灵魂美食。

## Day 3: 小吃

钟水饺、龙抄手、夫妻肺片...停不下来！`,
    coverMedia: [
      {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=337',
        width: 600,
        height: 337,
      },
      {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=337',
        width: 600,
        height: 337,
      },
      {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=337',
        width: 600,
        height: 337,
      },
      {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=337',
        width: 600,
        height: 337,
      },
    ],
    images: [],
    authorId: '3',
    authorName: '美食家小张',
    authorAvatar: getAvatar('张'),
    visibility: 'public',
    likeCount: 2341,
    collectCount: 890,
    commentCount: 156,
    viewCount: 8901,
    isLiked: true,
    isCollected: true,
    createdAt: '2026-01-22T14:20:00Z',
    updatedAt: '2026-01-22T14:20:00Z',
  },
  {
    id: '3',
    title: '云南大理洱海骑行记',
    content: `# 洱海骑行

环洱海骑行是来大理必做的事情之一。

## 路线推荐

从古城出发，沿着洱海东路一路向北，风景绝美！

## 注意事项

- 租个电动车，全程120公里太累了
- 防晒一定要做好
- 带点干粮和水`,
    coverMedia: [
      {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=900',
        width: 600,
        height: 900,
      },
    ],
    images: [],
    authorId: '1',
    authorName: '旅行者小王',
    authorAvatar: getAvatar('王'),
    visibility: 'public',
    likeCount: 567,
    collectCount: 234,
    commentCount: 45,
    viewCount: 2345,
    isLiked: false,
    isCollected: false,
    createdAt: '2026-01-25T09:15:00Z',
    updatedAt: '2026-01-25T09:15:00Z',
  },
  {
    id: '4',
    title: '新疆喀纳斯秋色',
    content: `# 喀纳斯秋色

9月底的喀纳斯，美得不像话。

金黄的树叶、碧绿的湖水、雪山的倒影...这就是人间天堂吧。`,
    coverMedia: [
      {
        type: 'video' as const,
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        width: 640,
        height: 360,
        duration: 10,
      },
    ],
    images: [],
    authorId: '4',
    authorName: '摄影师Mike',
    authorAvatar: getAvatar('Mike'),
    visibility: 'public',
    likeCount: 3456,
    collectCount: 1234,
    commentCount: 234,
    viewCount: 12345,
    isLiked: true,
    isCollected: false,
    createdAt: '2026-01-18T16:45:00Z',
    updatedAt: '2026-01-18T16:45:00Z',
  },
  {
    id: '5',
    title: '厦门鼓浪屿慢生活',
    content: `# 鼓浪屿3日游

在鼓浪屿待了三天，感受到了久违的慢节奏生活。

## 推荐景点

- 日光岩
- 菽庄花园
- 钢琴博物馆

岛上的小巷子也很有味道，随便走走都能发现惊喜。`,
    coverMedia: [
      {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=750',
        width: 600,
        height: 750,
      },
    ],
    images: [],
    authorId: '5',
    authorName: '背包客Amy',
    authorAvatar: getAvatar('Amy'),
    visibility: 'public',
    likeCount: 890,
    collectCount: 345,
    commentCount: 67,
    viewCount: 3456,
    isLiked: false,
    isCollected: true,
    createdAt: '2026-01-26T11:00:00Z',
    updatedAt: '2026-01-26T11:00:00Z',
  },
  {
    id: '6',
    title: '北京故宫深度游',
    content: `# 故宫一日游

作为中国最著名的古建筑群，故宫真的值得花一整天时间慢慢逛。`,
    coverMedia: [
      {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&h=400',
        width: 600,
        height: 400,
      },
    ],
    images: [],
    authorId: '2',
    authorName: '探险家Lisa',
    authorAvatar: getAvatar('Lisa'),
    visibility: 'public',
    likeCount: 1567,
    collectCount: 678,
    commentCount: 123,
    viewCount: 6789,
    isLiked: false,
    isCollected: false,
    createdAt: '2026-01-15T08:30:00Z',
    updatedAt: '2026-01-15T08:30:00Z',
  },
  {
    id: '7',
    title: '杭州西湖春日散步',
    content: `# 西湖春色

春天的西湖美得让人窒息，柳树发芽，桃花盛开。

## 推荐路线

断桥 → 白堤 → 孤山 → 苏堤`,
    coverMedia: [
      {
        type: 'video' as const,
        url: 'https://www.w3schools.com/html/movie.mp4',
        width: 640,
        height: 360,
        duration: 12,
      },
    ],
    images: [],
    authorId: '1',
    authorName: '旅行者小王',
    authorAvatar: getAvatar('王'),
    visibility: 'public',
    likeCount: 2234,
    collectCount: 890,
    commentCount: 178,
    viewCount: 8901,
    isLiked: true,
    isCollected: true,
    createdAt: '2026-01-12T15:20:00Z',
    updatedAt: '2026-01-12T15:20:00Z',
  },
  {
    id: '8',
    title: '张家界天门山玻璃栈道',
    content: `# 挑战天门山

走在玻璃栈道上，真的是太刺激了！

腿都是软的，但风景真的超级美。`,
    coverMedia: [
      {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800',
        width: 600,
        height: 800,
      },
    ],
    images: [],
    authorId: '5',
    authorName: '背包客Amy',
    authorAvatar: getAvatar('Amy'),
    visibility: 'public',
    likeCount: 4567,
    collectCount: 1890,
    commentCount: 345,
    viewCount: 15678,
    isLiked: true,
    isCollected: false,
    createdAt: '2026-01-10T13:45:00Z',
    updatedAt: '2026-01-10T13:45:00Z',
  },
  {
    id: '9',
    title: '青海湖环湖骑行攻略',
    content: `# 青海湖骑行

环湖360公里，骑行4天完成。

这是一段很难忘的经历，虽然累但很值得！`,
    coverMedia: [
      {
        type: 'video' as const,
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        width: 1280,
        height: 720,
        duration: 596,
      },
    ],
    images: [],
    authorId: '4',
    authorName: '摄影师Mike',
    authorAvatar: getAvatar('Mike'),
    visibility: 'public',
    likeCount: 3890,
    collectCount: 1567,
    commentCount: 289,
    viewCount: 13456,
    isLiked: false,
    isCollected: true,
    createdAt: '2026-01-08T10:10:00Z',
    updatedAt: '2026-01-08T10:10:00Z',
  },
  {
    id: '10',
    title: '重庆夜景拍摄指南',
    content: `# 重庆夜景

重庆的夜景真的太美了，8D魔幻城市名不虚传。

## 最佳拍摄点

- 南山一棵树
- 洪崖洞
- 千厮门大桥`,
    coverMedia: [
      {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&h=400',
        width: 600,
        height: 400,
      },
    ],
    images: [],
    authorId: '3',
    authorName: '美食家小张',
    authorAvatar: getAvatar('张'),
    visibility: 'public',
    likeCount: 5678,
    collectCount: 2345,
    commentCount: 456,
    viewCount: 18901,
    isLiked: true,
    isCollected: true,
    createdAt: '2026-01-05T19:30:00Z',
    updatedAt: '2026-01-05T19:30:00Z',
  },
]

// 根据ID获取笔记
export const getNoteById = (id: string): Note | undefined => {
  return mockNotes.find((note) => note.id === id)
}
