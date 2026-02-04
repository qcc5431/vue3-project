// Mock笔记数据
import type { Note } from '@/api/types/note'

// 使用纯色占位图（本地生成，无需网络请求）
const getPlaceholderImage = (width: number, height: number, seed: number) => {
  // 使用 data URI 生成纯色占位图
  const colors = ['#8B9DC3', '#DFB2F4', '#F8E559', '#55E6C1', '#FD79A8', '#A29BFE', '#74B9FF']
  const color = (colors[seed % colors.length] ?? '#8B9DC3').replace('#', '')
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23${color}'/%3E%3C/svg%3E`
}

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
    title: '西藏布达拉宫之旅 - 心灵的洗涤',
    content: `# 西藏布达拉宫之旅

终于来到了梦寐以求的布达拉宫！

## 第一印象

当我第一眼看到布达拉宫时，真的被震撼到了。红白相间的宫殿在蓝天白云的映衬下，显得格外壮观。

![布达拉宫远景](https://picsum.photos/seed/1/800/1000)

## 游览体验

- 建议早上去，人少光线好
- 记得带身份证
- 高原反应要注意
- 里面不能拍照

## 小贴士

提前在网上预约门票，现场买不到哦！`,
    coverImage: getPlaceholderImage(600, 800, 1),
    coverImageAspectRatio: 0.75, // 3:4 竖版
    images: [getPlaceholderImage(800, 1000, 1)],
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
    coverImage: getPlaceholderImage(600, 337, 2),
    coverImageAspectRatio: 1.78, // 16:9 横版
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
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    coverImageAspectRatio: 0.67, // 2:3 竖版
    images: [],
    authorId: '1',
    authorName: '旅行者小王',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler01',
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
    title: '新疆喀纳斯 - 秋天的童话',
    content: `# 喀纳斯秋色

9月底的喀纳斯，美得不像话。

金黄的树叶、碧绿的湖水、雪山的倒影...这就是人间天堂吧。`,
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    coverImageAspectRatio: 1.5, // 3:2 横版
    images: [],
    authorId: '4',
    authorName: '摄影师Mike',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=photographer_mike',
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
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600',
    coverImageAspectRatio: 0.8, // 4:5 竖版
    images: [],
    authorId: '5',
    authorName: '背包客Amy',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=backpacker_amy',
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
    coverImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600',
    images: [],
    authorId: '2',
    authorName: '探险家Lisa',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=explorer_lisa',
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
    coverImage: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600',
    images: [],
    authorId: '1',
    authorName: '旅行者小王',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler01',
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
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    images: [],
    authorId: '5',
    authorName: '背包客Amy',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=backpacker_amy',
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
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    images: [],
    authorId: '4',
    authorName: '摄影师Mike',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=photographer_mike',
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

山城的夜晚，灯火辉煌，美得让人流连忘返。

## 最佳拍摄点

- 南山一棵树
- 洪崖洞
- 千厮门大桥`,
    coverImage: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600',
    images: [],
    authorId: '3',
    authorName: '美食家小张',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=foodie_zhang',
    visibility: 'public',
    likeCount: 2890,
    collectCount: 1123,
    commentCount: 201,
    viewCount: 10234,
    isLiked: false,
    isCollected: false,
    createdAt: '2026-01-05T19:30:00Z',
    updatedAt: '2026-01-05T19:30:00Z',
  },
  {
    id: '11',
    title: '上海外滩夜色',
    content: '东方明珠塔的灯光秀真的太美了！',
    coverImage: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=600',
    images: [],
    authorId: '1',
    authorName: '旅行者小王',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler01',
    visibility: 'public',
    likeCount: 1234,
    collectCount: 456,
    commentCount: 78,
    viewCount: 5678,
    isLiked: false,
    isCollected: false,
    createdAt: '2026-01-28T20:00:00Z',
    updatedAt: '2026-01-28T20:00:00Z',
  },
  {
    id: '12',
    title: '桂林山水甲天下',
    content: '漓江竹筏漂流，两岸风景如画。',
    coverImage: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600',
    images: [],
    authorId: '2',
    authorName: '探险家Lisa',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=explorer_lisa',
    visibility: 'public',
    likeCount: 3456,
    collectCount: 1890,
    commentCount: 234,
    viewCount: 12345,
    isLiked: true,
    isCollected: true,
    createdAt: '2026-01-27T14:30:00Z',
    updatedAt: '2026-01-27T14:30:00Z',
  },
  {
    id: '13',
    title: '三亚海滩度假',
    content: '阳光、沙滩、海浪，这就是夏天该有的样子。',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    images: [],
    authorId: '5',
    authorName: '背包客Amy',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=backpacker_amy',
    visibility: 'public',
    likeCount: 2345,
    collectCount: 890,
    commentCount: 156,
    viewCount: 8901,
    isLiked: false,
    isCollected: true,
    createdAt: '2026-01-26T16:20:00Z',
    updatedAt: '2026-01-26T16:20:00Z',
  },
  {
    id: '14',
    title: '苏州园林古韵',
    content: '拙政园的设计真的太精妙了，每一处都是景。',
    coverImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600',
    images: [],
    authorId: '4',
    authorName: '摄影师Mike',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=photographer_mike',
    visibility: 'public',
    likeCount: 1890,
    collectCount: 678,
    commentCount: 123,
    viewCount: 6789,
    isLiked: true,
    isCollected: false,
    createdAt: '2026-01-25T11:40:00Z',
    updatedAt: '2026-01-25T11:40:00Z',
  },
  {
    id: '15',
    title: '西安兵马俑震撼',
    content: '第一次看到兵马俑的时候，真的被古人的智慧震撼了。',
    coverImage: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=600',
    images: [],
    authorId: '3',
    authorName: '美食家小张',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=foodie_zhang',
    visibility: 'public',
    likeCount: 4567,
    collectCount: 2345,
    commentCount: 456,
    viewCount: 18901,
    isLiked: false,
    isCollected: false,
    createdAt: '2026-01-24T09:15:00Z',
    updatedAt: '2026-01-24T09:15:00Z',
  },
  {
    id: '16',
    title: '黄山云海奇观',
    content: '爬了4个小时终于看到云海，所有的辛苦都值得了！',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    images: [],
    authorId: '1',
    authorName: '旅行者小王',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler01',
    visibility: 'public',
    likeCount: 5678,
    collectCount: 2890,
    commentCount: 567,
    viewCount: 23456,
    isLiked: true,
    isCollected: true,
    createdAt: '2026-01-23T07:30:00Z',
    updatedAt: '2026-01-23T07:30:00Z',
  },
  {
    id: '17',
    title: '南京梧桐大道',
    content: '秋天的南京，满城尽是金黄色。',
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600',
    images: [],
    authorId: '2',
    authorName: '探险家Lisa',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=explorer_lisa',
    visibility: 'public',
    likeCount: 2123,
    collectCount: 890,
    commentCount: 178,
    viewCount: 8901,
    isLiked: false,
    isCollected: true,
    createdAt: '2026-01-22T15:50:00Z',
    updatedAt: '2026-01-22T15:50:00Z',
  },
  {
    id: '18',
    title: '敦煌莫高窟艺术',
    content: '千年壁画依然色彩鲜艳，太神奇了。',
    coverImage: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600',
    images: [],
    authorId: '4',
    authorName: '摄影师Mike',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=photographer_mike',
    visibility: 'public',
    likeCount: 3890,
    collectCount: 1567,
    commentCount: 289,
    viewCount: 13456,
    isLiked: true,
    isCollected: false,
    createdAt: '2026-01-21T13:20:00Z',
    updatedAt: '2026-01-21T13:20:00Z',
  },
  {
    id: '19',
    title: '长沙臭豆腐打卡',
    content: '正宗的长沙臭豆腐，外酥里嫩，太好吃了！',
    coverImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600',
    images: [],
    authorId: '3',
    authorName: '美食家小张',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=foodie_zhang',
    visibility: 'public',
    likeCount: 3456,
    collectCount: 1234,
    commentCount: 234,
    viewCount: 12345,
    isLiked: false,
    isCollected: true,
    createdAt: '2026-01-20T12:40:00Z',
    updatedAt: '2026-01-20T12:40:00Z',
  },
  {
    id: '20',
    title: '武汉樱花季',
    content: '武大的樱花真的名不虚传，美到窒息。',
    coverImage: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600',
    images: [],
    authorId: '5',
    authorName: '背包客Amy',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=backpacker_amy',
    visibility: 'public',
    likeCount: 6789,
    collectCount: 3456,
    commentCount: 678,
    viewCount: 28901,
    isLiked: true,
    isCollected: true,
    createdAt: '2026-01-19T10:25:00Z',
    updatedAt: '2026-01-19T10:25:00Z',
  },
  {
    id: '21',
    title: '九寨沟五彩池',
    content: '水的颜色居然可以这么美，像宝石一样。',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    images: [],
    authorId: '1',
    authorName: '旅行者小王',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler01',
    visibility: 'public',
    likeCount: 5432,
    collectCount: 2678,
    commentCount: 456,
    viewCount: 21234,
    isLiked: false,
    isCollected: false,
    createdAt: '2026-01-18T14:55:00Z',
    updatedAt: '2026-01-18T14:55:00Z',
  },
  {
    id: '22',
    title: '青岛啤酒节',
    content: '夏天来青岛，怎么能错过啤酒节！',
    coverImage: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600',
    images: [],
    authorId: '3',
    authorName: '美食家小张',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=foodie_zhang',
    visibility: 'public',
    likeCount: 2890,
    collectCount: 1123,
    commentCount: 201,
    viewCount: 10234,
    isLiked: true,
    isCollected: false,
    createdAt: '2026-01-17T18:30:00Z',
    updatedAt: '2026-01-17T18:30:00Z',
  },
  {
    id: '23',
    title: '丽江古城慢时光',
    content: '在古城晒太阳、喝茶，感受慢生活。',
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600',
    images: [],
    authorId: '2',
    authorName: '探险家Lisa',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=explorer_lisa',
    visibility: 'public',
    likeCount: 4123,
    collectCount: 1890,
    commentCount: 312,
    viewCount: 16789,
    isLiked: false,
    isCollected: true,
    createdAt: '2026-01-16T11:10:00Z',
    updatedAt: '2026-01-16T11:10:00Z',
  },
  {
    id: '24',
    title: '哈尔滨冰雪大世界',
    content: '冰雕艺术的盛宴，晚上的灯光秀超级梦幻。',
    coverImage: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=600',
    images: [],
    authorId: '4',
    authorName: '摄影师Mike',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=photographer_mike',
    visibility: 'public',
    likeCount: 7890,
    collectCount: 3890,
    commentCount: 789,
    viewCount: 32345,
    isLiked: true,
    isCollected: true,
    createdAt: '2026-01-15T19:40:00Z',
    updatedAt: '2026-01-15T19:40:00Z',
  },
  {
    id: '25',
    title: '深圳世界之窗',
    content: '一天游遍世界，各种微缩景观都超级精致。',
    coverImage: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=600',
    images: [],
    authorId: '5',
    authorName: '背包客Amy',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=backpacker_amy',
    visibility: 'public',
    likeCount: 3456,
    collectCount: 1567,
    commentCount: 234,
    viewCount: 14567,
    isLiked: false,
    isCollected: false,
    createdAt: '2026-01-14T15:25:00Z',
    updatedAt: '2026-01-14T15:25:00Z',
  },
  {
    id: '26',
    title: '泰山日出',
    content: '凌晨3点开始爬山，就为了看这一抹朝阳。',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    images: [],
    authorId: '1',
    authorName: '旅行者小王',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler01',
    visibility: 'public',
    likeCount: 6234,
    collectCount: 2890,
    commentCount: 567,
    viewCount: 24567,
    isLiked: true,
    isCollected: true,
    createdAt: '2026-01-13T06:15:00Z',
    updatedAt: '2026-01-13T06:15:00Z',
  },
  {
    id: '27',
    title: '乌镇水乡夜景',
    content: '江南水乡的夜晚，灯火阑珊，美如画卷。',
    coverImage: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600',
    images: [],
    authorId: '2',
    authorName: '探险家Lisa',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=explorer_lisa',
    visibility: 'public',
    likeCount: 4567,
    collectCount: 2123,
    commentCount: 345,
    viewCount: 18901,
    isLiked: false,
    isCollected: true,
    createdAt: '2026-01-12T20:50:00Z',
    updatedAt: '2026-01-12T20:50:00Z',
  },
  {
    id: '28',
    title: '凤凰古城漫步',
    content: '沱江边的吊脚楼，充满了湘西风情。',
    coverImage: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600',
    images: [],
    authorId: '3',
    authorName: '美食家小张',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=foodie_zhang',
    visibility: 'public',
    likeCount: 3890,
    collectCount: 1678,
    commentCount: 289,
    viewCount: 15678,
    isLiked: true,
    isCollected: false,
    createdAt: '2026-01-11T16:35:00Z',
    updatedAt: '2026-01-11T16:35:00Z',
  },
  {
    id: '29',
    title: '呼伦贝尔大草原',
    content: '一望无际的草原，蓝天白云，牛羊成群。',
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
    images: [],
    authorId: '4',
    authorName: '摄影师Mike',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=photographer_mike',
    visibility: 'public',
    likeCount: 5678,
    collectCount: 2678,
    commentCount: 456,
    viewCount: 22345,
    isLiked: false,
    isCollected: true,
    createdAt: '2026-01-10T12:20:00Z',
    updatedAt: '2026-01-10T12:20:00Z',
  },
  {
    id: '30',
    title: '峨眉山金顶',
    content: '云海、佛光、日出，峨眉山的三大奇观都看到了！',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    images: [],
    authorId: '5',
    authorName: '背包客Amy',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=backpacker_amy',
    visibility: 'public',
    likeCount: 7123,
    collectCount: 3456,
    commentCount: 678,
    viewCount: 29012,
    isLiked: true,
    isCollected: true,
    createdAt: '2026-01-09T07:45:00Z',
    updatedAt: '2026-01-09T07:45:00Z',
  },
]

// 批量生成更多数据用于测试无限滚动
const generateMoreNotes = (): Note[] => {
  const titles = [
    '西湖断桥残雪',
    '九寨沟秋色',
    '长城日出',
    '丽江古城',
    '凤凰古城夜景',
    '敦煌莫高窟',
    '张掖丹霞地貌',
    '泸沽湖星空',
    '稻城亚丁',
    '呼伦贝尔草原',
  ]

  const authors = [
    {
      id: '1',
      name: '旅行者小王',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler01',
    },
    {
      id: '2',
      name: '探险家Lisa',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=explorer_lisa',
    },
    {
      id: '3',
      name: '美食家小张',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=foodie_zhang',
    },
    {
      id: '4',
      name: '摄影师Mike',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=photographer_mike',
    },
    {
      id: '5',
      name: '背包客Amy',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=backpacker_amy',
    },
  ]

  const images = [
    'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=600',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600',
    'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600',
    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600',
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600',
    'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=600',
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
  ]

  const aspectRatios = [
    0.75, // 3:4 竖版
    1.78, // 16:9 横版
  ]

  const moreNotes: Note[] = []
  const startId = 26

  for (let i = 0; i < 75; i++) {
    const id = (startId + i).toString()
    const titleIndex = i % titles.length
    const authorIndex = i % authors.length
    const imageIndex = i % images.length
    const aspectRatio = aspectRatios[i % aspectRatios.length] ?? 0.75
    const author = authors[authorIndex] ?? authors[0]

    moreNotes.push({
      id,
      title: `${titles[titleIndex]} ${i + 1}`,
      content: `这是第 ${i + 1} 篇笔记的内容，记录了美好的旅行时光。`,
      coverImage: images[imageIndex] ?? images[0],
      coverImageAspectRatio: aspectRatio,
      images: [],
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
      visibility: 'public',
      likeCount: Math.floor(Math.random() * 10000),
      collectCount: Math.floor(Math.random() * 5000),
      commentCount: Math.floor(Math.random() * 1000),
      viewCount: Math.floor(Math.random() * 50000),
      isLiked: Math.random() > 0.5,
      isCollected: Math.random() > 0.7,
      createdAt: new Date(2026, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
      updatedAt: new Date(2026, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
    })
  }

  return moreNotes
}

// 合并初始数据和生成的数据
mockNotes.push(...generateMoreNotes())

// 根据ID获取笔记
export const getNoteById = (id: string): Note | undefined => {
  return mockNotes.find((note) => note.id === id)
}
