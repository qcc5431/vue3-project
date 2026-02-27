<template>
  <el-card :body-style="{ padding: '0px' }" class="note-card" @click="handleClick">
    <!-- 封面媒体 - 只显示第一张 -->
    <div
      v-if="firstCoverMedia"
      class="note-cover"
      :style="imageHeight ? { height: imageHeight + 'px' } : {}"
    >
      <el-image
        v-if="firstCoverMedia.type === 'image'"
        :src="firstCoverMedia.url"
        fit="cover"
        class="cover-image"
      />
      <div v-else class="video-wrapper">
        <video :src="firstCoverMedia.url" class="cover-video" preload="metadata" />
        <div class="play-button">
          <el-icon :size="24"><VideoPlay /></el-icon>
        </div>
      </div>
    </div>

    <div class="note-content">
      <!-- 标题 -->
      <h3 class="note-title">{{ note.title }}</h3>

      <!-- 作者信息 -->
      <div class="note-author">
        <UserAvatar :user-id="note.authorId" :avatar="note.authorAvatar" :size="24" @click.stop />
        <span class="author-name">{{ note.authorName }}</span>
      </div>

      <!-- 互动数据 -->
      <div class="note-stats">
        <span class="stat-item">
          <el-icon><View /></el-icon>
          {{ formatNumber(note.viewCount) }}
        </span>
        <span class="stat-item">
          <el-icon><Star /></el-icon>
          {{ formatNumber(note.likeCount) }}
        </span>
        <span class="stat-item">
          <el-icon><Collection /></el-icon>
          {{ formatNumber(note.collectCount) }}
        </span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { View, Star, Collection, VideoPlay } from '@element-plus/icons-vue'
import type { Note } from '@/api/types/note'
import UserAvatar from './UserAvatar.vue'
import { getDisplayCoverMedia } from '@/utils/mediaHelper'

interface Props {
  note: Note
  imageHeight?: number // 小红书式固定高度
}

const props = withDefaults(defineProps<Props>(), {
  imageHeight: 0, // 0 表示自适应
})
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
.note-card {
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  border-radius: 8px;
  background: #f5f7f6;
  border: 1px solid #d4dcd7;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(122, 157, 137, 0.15);
    border-color: #8fa998;
  }

  .note-cover {
    width: 100%;
    overflow: hidden;
    position: relative;
    background: #f5f7f6;

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

    &:hover .play-button {
      transform: scale(1.15);
    }
  }

  .note-content {
    padding: 16px;
  }

  .note-title {
    font-size: 16px;
    font-weight: 600;
    color: #4a5a4f;
    margin: 0 0 12px 0;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .note-author {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    .author-name {
      font-size: 14px;
      color: #6b7d73;
    }
  }

  .note-stats {
    display: flex;
    gap: 16px;
    color: #8fa998;
    font-size: 13px;

    .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;

      .el-icon {
        font-size: 14px;
      }
    }
  }
}
</style>
