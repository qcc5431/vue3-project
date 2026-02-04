<template>
  <div class="carousel-note-card" @click="handleClick">
    <!-- 左侧封面 -->
    <div class="card-cover">
      <el-image :src="note.coverImage" fit="cover" lazy>
        <template #error>
          <div class="image-error">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
    </div>

    <!-- 右侧内容 -->
    <div class="card-content">
      <!-- 标题 -->
      <h2 class="card-title">{{ note.title }}</h2>

      <!-- 作者信息 -->
      <div class="card-author">
        <UserAvatar :user-id="note.authorId" :avatar="note.authorAvatar" :size="36" @click.stop />
        <div class="author-info">
          <span class="author-name">{{ note.authorName }}</span>
          <span class="publish-time">{{ formatTime(note.createdAt) }}</span>
        </div>
      </div>

      <!-- 简介 -->
      <p class="card-description">{{ note.content || '暂无简介' }}</p>

      <!-- 互动数据 -->
      <div class="card-stats">
        <div class="stat-item">
          <el-icon><View /></el-icon>
          <span>{{ formatNumber(note.viewCount) }}</span>
        </div>
        <div class="stat-item">
          <el-icon><Star /></el-icon>
          <span>{{ formatNumber(note.likeCount) }}</span>
        </div>
        <div class="stat-item">
          <el-icon><Collection /></el-icon>
          <span>{{ formatNumber(note.collectCount) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { View, Star, Collection, Picture } from '@element-plus/icons-vue'
import type { Note } from '@/api/types/note'
import UserAvatar from './UserAvatar.vue'

interface Props {
  note: Note
}

const props = defineProps<Props>()
const router = useRouter()

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 格式化时间
const formatTime = (time: string): string => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes <= 1 ? '刚刚' : `${minutes}分钟前`
    }
    return `${hours}小时前`
  }
  if (days < 7) {
    return `${days}天前`
  }
  return date.toLocaleDateString('zh-CN')
}

// 点击卡片跳转到详情页
const handleClick = () => {
  router.push(`/note/${props.note.id}`)
}
</script>

<style lang="scss" scoped>
.carousel-note-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  pointer-events: auto;

  .card-cover {
    width: 100%;
    height: 55%;
    flex-shrink: 0;
    overflow: hidden;

    :deep(.el-image) {
      width: 100%;
      height: 100%;
    }

    .image-error {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.5);
      font-size: 48px;
    }
  }

  .card-content {
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
  }

  .card-title {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 16px 0;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }

  .card-author {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;

    .author-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .author-name {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    }

    .publish-time {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .card-description {
    flex: 1;
    font-size: 15px;
    line-height: 1.8;
    color: rgba(255, 255, 255, 1);
    margin: 0 0 12px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }

  .card-stats {
    display: flex;
    gap: 32px;

    .stat-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.95);
      font-size: 15px;
      font-weight: 500;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

      .el-icon {
        font-size: 18px;
      }
    }
  }
}

// 响应式适配
@media (max-width: 1200px) {
  .carousel-note-card {
    .card-content {
      padding: 20px;
    }

    .card-title {
      font-size: 24px;
    }
  }
}

@media (max-width: 768px) {
  .carousel-note-card {
    .card-cover {
      height: 200px;
    }

    .card-content {
      padding: 20px;
    }

    .card-title {
      font-size: 20px;
      margin-bottom: 16px;
    }

    .card-stats {
      gap: 20px;
    }
  }
}
</style>
