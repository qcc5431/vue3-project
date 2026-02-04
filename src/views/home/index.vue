<template>
  <div class="home-page">
    <!-- 走马灯卡片展示 -->
    <div v-if="viewMode === 'carousel'" v-loading="noteStore.loading" class="carousel-container">
      <el-carousel
        v-if="noteStore.notes.length > 0"
        ref="carouselRef"
        :interval="0"
        arrow="always"
        height="550px"
        indicator-position="outside"
        type="card"
        @change="onCarouselChange"
      >
        <el-carousel-item v-for="note in displayNotes" :key="note.id">
          <CarouselNoteCard :note="note" />
        </el-carousel-item>
      </el-carousel>

      <!-- 查看更多浮层 - 固定在右侧 -->
      <div v-if="showMoreCard" class="more-card-overlay" @click="goToList">
        <div class="more-card">
          <div class="more-icon">
            <el-icon><DArrowRight /></el-icon>
          </div>
          <h2 class="more-title">查看更多</h2>
          <p class="more-desc">发现更多精彩内容</p>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty
        v-if="!noteStore.loading && noteStore.notes.length === 0"
        description="暂无笔记"
        class="empty-state"
      />
    </div>

    <!-- 瀑布流展示 -->
    <WaterfallList
      v-else
      :items="noteStore.notes"
      :loading="noteStore.loading"
      :has-more="hasMore"
      :total="noteStore.total"
      :enable-preload="true"
      :preload-threshold="300"
      empty-text="暂无笔记"
      @load-more="handleLoadMore"
      @preload="handlePreload"
    >
      <template #default="{ item, imageHeight }">
        <NoteCard :note="item" :image-height="imageHeight" />
      </template>
    </WaterfallList>
  </div>
</template>

<script setup lang="ts">
import { useNoteStore } from '@/store/modules/note'
import type { NoteSortType } from '@/api/types/note'
import CarouselNoteCard from '@/components/CarouselNoteCard.vue'
import NoteCard from '@/components/NoteCard.vue'
import WaterfallList from '@/components/WaterfallList.vue'
import { DArrowRight } from '@element-plus/icons-vue'

const noteStore = useNoteStore()
const router = useRouter()
const carouselRef = ref()

const sortType = ref<NoteSortType>('recommend')
const currentIndex = ref(0)
const viewMode = ref<'carousel' | 'waterfall'>('carousel')

// 限制展示数量
const DISPLAY_LIMIT = 5

// 显示的笔记（限制数量）
const displayNotes = computed(() => {
  return noteStore.notes.slice(0, DISPLAY_LIMIT)
})

// 是否还有更多
const hasMore = computed(() => {
  return noteStore.notes.length < noteStore.total
})

// 是否显示查看更多卡片
const showMoreCard = computed(() => {
  return hasMore.value && currentIndex.value >= displayNotes.value.length - 1
})

// 切换回调
const onCarouselChange = (index: number): void => {
  currentIndex.value = index
}

// 跳转到列表页
const goToList = (): void => {
  // TODO: 跳转到笔记列表页面
  router.push('/my-notes')
}

// 处理加载更多
const handleLoadMore = (): void => {
  noteStore.loadMore()
}

// 处理预加载
const handlePreload = (): void => {
  noteStore.preloadNext()
}

// 初始化加载
onMounted(() => {
  noteStore.fetchNotes({ sortType: sortType.value })

  // 监听视图切换事件
  window.addEventListener('change-view-mode', ((event: CustomEvent) => {
    viewMode.value = event.detail
  }) as EventListener)
})

// 清理事件监听
onUnmounted(() => {
  window.removeEventListener('change-view-mode', (() => {}) as EventListener)
})
</script>

<style lang="scss" scoped>
.home-page {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;

  .carousel-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: transparent !important;
    max-width: 100%;
    position: relative;
    overflow: hidden;

    // 查看更多卡片浮层
    .more-card-overlay {
      position: absolute;
      right: 14%;
      top: 50%;
      transform: translateY(-50%) scale(0.85);
      width: min(220px, 18vw);
      height: min(350px, 28vw);
      z-index: 5;
      pointer-events: auto;
      animation: slideInRight 0.25s ease-out;
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateY(-50%) translateX(30px) scale(0.85);
      }
      to {
        opacity: 1;
        transform: translateY(-50%) scale(0.85);
      }
    }

    .more-card {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.15) 0%,
        rgba(255, 255, 255, 0.05) 100%
      );
      backdrop-filter: blur(20px);
      border-radius: 24px;
      cursor: pointer;
      transition: all 0.3s;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);

      &:hover {
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.2) 0%,
          rgba(255, 255, 255, 0.1) 100%
        );
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-8px);
      }

      .more-icon {
        font-size: 64px;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 20px;
        animation: arrowPulse 2s ease-in-out infinite;
      }

      .more-title {
        font-size: 26px;
        font-weight: 700;
        color: #fff;
        margin: 0 0 12px 0;
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
      }

      .more-desc {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
      }
    }

    @keyframes arrowPulse {
      0%,
      100% {
        transform: translateX(0);
      }
      50% {
        transform: translateX(10px);
      }
    }

    :deep(.el-carousel) {
      background: transparent !important;

      .el-carousel__container {
        height: 550px;
        background: transparent !important;
      }

      .el-carousel__mask {
        background: transparent !important;
      }

      // 卡片式走马灯样式
      .el-carousel__item {
        transition:
          transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
          opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        background: transparent !important;
        padding: 0 30px;
        pointer-events: none;

        &.is-active {
          z-index: 10;
          pointer-events: auto;
        }

        &:not(.is-active) {
          pointer-events: none;

          .carousel-note-card {
            transform: scale(0.95);
            pointer-events: none;
          }
        }
      }

      .el-carousel__arrow {
        background: rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.4);
        width: 48px;
        height: 48px;
        font-size: 18px;
        color: #fff;

        &:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      }

      .el-carousel__indicators {
        .el-carousel__indicator {
          .el-carousel__button {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            opacity: 1;
          }

          &.is-active {
            .el-carousel__button {
              background: rgba(255, 255, 255, 0.9);
              width: 32px;
              border-radius: 6px;
            }
          }
        }
      }
    }

    .empty-state {
      :deep(.el-empty__description) {
        color: rgba(255, 255, 255, 0.9);
        font-size: 16px;
      }
    }
  }

  // 查看更多卡片样式
  .more-card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    backdrop-filter: blur(20px);
    border-radius: 24px;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.2) 0%,
        rgba(255, 255, 255, 0.1) 100%
      );
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-8px);
    }

    .more-icon {
      font-size: 80px;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 24px;
      animation: arrowPulse 2s ease-in-out infinite;
    }

    .more-title {
      font-size: 32px;
      font-weight: 700;
      color: #fff;
      margin: 0 0 16px 0;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    }

    .more-desc {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }
  }

  @keyframes arrowPulse {
    0%,
    100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(10px);
    }
  }

  .load-more {
    display: none;
  }
}

// 响应式适配
@media (max-width: 768px) {
  .home-page {
    padding: 12px;

    .carousel-container {
      :deep(.el-carousel) {
        .el-carousel__arrow {
          width: 40px;
          height: 40px;
          font-size: 16px;

          &--left {
            left: 10px;
          }

          &--right {
            right: 10px;
          }
        }
      }
    }
  }
}
</style>
