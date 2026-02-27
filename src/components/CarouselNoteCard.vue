<template>
  <div class="carousel-note-card" @click="handleClick">
    <!-- 左侧封面 - 只显示第一张 -->
    <div class="card-cover">
      <el-image
        v-if="firstCoverMedia && firstCoverMedia.type === 'image'"
        :src="firstCoverMedia.url"
        fit="cover"
        class="cover-image"
      />
      <div v-else-if="firstCoverMedia && firstCoverMedia.type === 'video'" class="video-wrapper">
        <video :src="firstCoverMedia.url" class="cover-video" preload="metadata" />
        <div class="play-button">
          <el-icon :size="24"><VideoPlay /></el-icon>
        </div>
      </div>
    </div>

    <!-- 右侧内容 -->
    <div class="card-content">
      <!-- 标题 -->
      <h2 class="card-title">{{ note.title }}</h2>

      <!-- 作者信息 -->
      <div class="card-author">
        <UserAvatar :user-id="note.authorId" :avatar="note.authorAvatar" :size="32" @click.stop />
        <span class="author-name">{{ note.authorName }}</span>
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
import { View, Star, Collection, VideoPlay } from '@element-plus/icons-vue'
import type { Note } from '@/api/types/note'
import UserAvatar from './UserAvatar.vue'
import { getDisplayCoverMedia } from '@/utils/mediaHelper'

interface Props {
  note: Note
}

const props = defineProps<Props>()
const router = useRouter()

// 获取展示用的封面（自动或手动）
const displayCoverMedia = computed(() => {
  return getDisplayCoverMedia(props.note.coverMedia, props.note.content, 3)
})

// 只获取第一张封面
const firstCoverMedia = computed(() => {
  return displayCoverMedia.value[0]
})

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

// 点击卡片跳转到详情页
const handleClick = () => {
  router.push(`/note/${props.note.id}`)
}
</script>

<style lang="scss" scoped>
.carousel-note-card {
  display: flex;
  flex-direction: row;
  height: 100%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  pointer-events: auto;

  .card-cover {
    width: 45%;
    height: 100%;
    flex-shrink: 0;
    overflow: hidden;
    position: relative;

    .cover-image,
    .cover-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .video-wrapper {
      width: 100%;
      height: 100%;
      position: relative;

      .cover-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .play-button {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #d7d7d7;
        pointer-events: none;
        transition: all 0.3s ease;
      }
    }
  }

  &:hover .play-button {
    transform: scale(1.15);
  }

  .card-content {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.18) 0%,
      rgba(255, 255, 255, 0.1) 100%
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
    gap: 10px;
    margin-bottom: 16px;

    .author-name {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    }
  }

  .card-description {
    flex: 1;
    font-size: 15px;
    line-height: 1.8;
    color: rgba(255, 255, 255, 1);
    margin: 0 0 16px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
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
      padding: 24px;
    }

    .card-title {
      font-size: 24px;
    }
  }
}

@media (max-width: 768px) {
  .carousel-note-card {
    flex-direction: column;

    .card-cover {
      width: 100%;
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
