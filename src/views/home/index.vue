<template>
  <div class="home-page">

    <!-- 走马灯卡片展示 -->
    <div v-loading="noteStore.loading" class="carousel-container">
      <el-carousel
        v-if="noteStore.notes.length > 0"
        :interval="0"
        arrow="always"
        height="550px"
        indicator-position="outside"
        type="card"
      >
        <el-carousel-item v-for="note in noteStore.notes" :key="note.id">
          <CarouselNoteCard :note="note" />
        </el-carousel-item>
      </el-carousel>

      <!-- 空状态 -->
      <el-empty
        v-if="!noteStore.loading && noteStore.notes.length === 0"
        description="暂无笔记"
        class="empty-state"
      />
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore" class="load-more">
      <el-button @click="loadMore" class="load-more-btn">加载更多</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNoteStore } from '@/store/modules/note'
import type { NoteSortType } from '@/api/types/note'
import CarouselNoteCard from '@/components/CarouselNoteCard.vue'

const noteStore = useNoteStore()

const sortType = ref<NoteSortType>('recommend')

// 是否还有更多
const hasMore = computed(() => {
  return noteStore.notes.length < noteStore.total
})

// 初始化加载
onMounted(() => {
  noteStore.fetchNotes({ sortType: sortType.value })
})

// 加载更多
const loadMore = () => {
  noteStore.loadMore()
}
</script>

<style lang="scss" scoped>
.home-page {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;

  .carousel-container {
    flex: 0 0 auto;
    background: transparent !important;
    max-width: 100%;
    padding: 0 20px;

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
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
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

        &--left {
          left: 20px;
        }

        &--right {
          right: 20px;
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
