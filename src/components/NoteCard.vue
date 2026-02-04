<template>
  <el-card :body-style="{ padding: '0px' }" class="note-card" @click="handleClick">
    <!-- 封面图 -->
    <div
      v-if="note.coverImage"
      class="note-cover"
      :style="imageHeight ? { height: imageHeight + 'px' } : {}"
    >
      <el-skeleton v-if="!imageLoaded" animated class="image-skeleton">
        <template #template>
          <el-skeleton-item variant="image" class="skeleton-image" />
        </template>
      </el-skeleton>
      <el-image v-show="imageLoaded" :src="note.coverImage" fit="cover" @load="handleImageLoad" />
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
import { View, Star, Collection } from '@element-plus/icons-vue'
import type { Note } from '@/api/types/note'
import UserAvatar from './UserAvatar.vue'

interface Props {
  note: Note
  imageHeight?: number // 小红书式固定高度
}

const props = withDefaults(defineProps<Props>(), {
  imageHeight: 0, // 0 表示自适应
})
const router = useRouter()

// 图片加载状态
const imageLoaded = ref(false)

// 图片加载完成
const handleImageLoad = () => {
  imageLoaded.value = true
}

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

    .image-skeleton {
      width: 100%;
      height: 100%;
    }

    .skeleton-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    :deep(.el-image) {
      width: 100%;
      height: 100%;
      display: block;
    }

    :deep(.el-image__inner) {
      width: 100%;
      height: 100%;
      object-fit: cover;
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
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
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
