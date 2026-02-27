<template>
  <div class="media-carousel">
    <!-- 单个视频直接显示，不轮播 -->
    <div v-if="firstMedia?.type === 'video'" class="single-video">
      <VideoPlayer :src="firstMedia!.url" :autoplay="true" />
    </div>

    <!-- 图片轮播 -->
    <div v-else @mouseenter="isHovering = true" @mouseleave="isHovering = false">
      <el-carousel
        v-if="mediaList.length > 0"
        :height="carouselHeight + 'px'"
        indicator-position="none"
        arrow="hover"
        @change="handleChange"
      >
        <el-carousel-item v-for="(media, index) in mediaList" :key="index">
          <div class="media-wrapper">
            <el-image :src="media.url" fit="contain" lazy />
          </div>
        </el-carousel-item>
      </el-carousel>
      <div v-if="mediaList.length > 1 && isHovering" class="media-indicator">
        {{ currentIndex + 1 }}/{{ mediaList.length }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MediaItem } from '@/api/types/note'
import VideoPlayer from './VideoPlayer.vue'

interface Props {
  mediaList: MediaItem[]
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 0,
})

const currentIndex = ref(0)
const isHovering = ref(false)

const firstMedia = computed(() => props.mediaList[0])

const carouselHeight = computed(() => {
  if (props.height > 0) {
    return props.height
  }

  const firstMedia = props.mediaList[0]
  if (firstMedia) {
    const aspectRatio = firstMedia.height / firstMedia.width
    return Math.round(300 * aspectRatio)
  }

  return 200
})

const handleChange = (index: number) => {
  currentIndex.value = index
}
</script>

<style lang="scss" scoped>
.media-carousel {
  position: relative;
  width: 100%;
  overflow: hidden;

  :deep(.el-carousel) {
    border-radius: 8px;
  }

  :deep(.el-carousel__container) {
    height: 100%;
  }

  .media-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;

    :deep(.el-image) {
      width: 100%;
      height: 100%;
    }
  }

  .media-indicator {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    pointer-events: none;
    z-index: 10;
  }

  :deep(.el-carousel__arrow) {
    background: rgba(0, 0, 0, 0.5);
    color: #fff;

    &:hover {
      background: rgba(0, 0, 0, 0.7);
    }
  }
}
</style>
