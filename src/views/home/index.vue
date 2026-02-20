<template>
  <div class="home-page">
    <!-- 关注动态区 - 走马灯 -->
    <div v-if="followingNotes.length > 0" class="following-section">
      <div class="carousel-container">
        <el-carousel
          :interval="0"
          arrow="always"
          height="320px"
          indicator-position="none"
          type="card"
        >
          <el-carousel-item v-for="note in followingNotes" :key="note.id">
            <CarouselNoteCard :note="note" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <!-- 全部内容区 - 瀑布流 -->
    <div class="content-section">
      <!-- 排序类型切换 -->
      <div class="sort-tabs">
        <el-tooltip v-for="item in sortItems" :key="item.type" :content="item.label" placement="bottom">
          <div
            class="sort-item"
            :class="{ active: sortType === item.type }"
            @click="changeSortType(item.type)"
          >
            <el-icon :size="24">
              <component :is="item.icon" />
            </el-icon>
          </div>
        </el-tooltip>
      </div>

      <WaterfallList
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
  </div>
</template>

<script setup lang="ts">
import { useNoteStore } from '@/store/modules/note'
import type { NoteSortType } from '@/api/types/note'
import CarouselNoteCard from '@/components/CarouselNoteCard.vue'
import NoteCard from '@/components/NoteCard.vue'
import WaterfallList from '@/components/WaterfallList.vue'
import { StarFilled, Clock, Trophy } from '@element-plus/icons-vue'
import type { Component } from 'vue'

const noteStore = useNoteStore()

const sortType = ref<NoteSortType>('recommend')

// 排序选项
interface SortItem {
  type: NoteSortType
  label: string
  icon: Component
}

const sortItems: SortItem[] = [
  { type: 'recommend', label: '推荐', icon: StarFilled },
  { type: 'latest', label: '最新', icon: Clock },
  { type: 'hot', label: '最热', icon: Trophy },
]

// 关注用户的笔记（用于走马灯）
const followingNotes = computed(() => {
  // 始终显示前3条笔记作为走马灯内容
  // TODO: 未来可以根据登录状态区分：已登录显示关注用户笔记，未登录显示推荐笔记
  return noteStore.notes.slice(0, 3)
})

// 是否还有更多
const hasMore = computed(() => {
  return noteStore.notes.length < noteStore.total
})

// 改变排序方式
const changeSortType = (type: NoteSortType) => {
  sortType.value = type
  noteStore.page = 1
  noteStore.fetchNotes({ sortType: type })
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
})
</script>

<style lang="scss" scoped>
.home-page {
  width: 100%;
  margin: 0 auto;
  padding: 30px 20px;

  // 关注动态区
  .following-section {
    margin-bottom: 60px;

    .carousel-container {
      background: transparent !important;
      margin: 0 auto;

      :deep(.el-carousel) {
        background: transparent !important;

        .el-carousel__container {
          height: 400px;
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
          padding: 0 20px;
          pointer-events: none;

          &.is-active {
            z-index: 10;
            pointer-events: auto;
          }

          &:not(.is-active) {
            pointer-events: none;

            .carousel-note-card {
              transform: scale(0.92);
              opacity: 0.6;
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
      }
    }
  }

  // 全部内容区
  .content-section {
    .sort-tabs {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 30px;
      padding: 0 10px;

      .sort-item {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        color: rgba(255, 255, 255, 0.6);

        .el-icon {
          transition: all 0.3s ease;
        }

        &:hover {
          color: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);

          .el-icon {
            transform: scale(1.15);
          }
        }

        &.active {
          color: #fff;

          .el-icon {
            transform: scale(1.2);
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
          }
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .home-page {
    padding: 20px 12px;

    .following-section {
      margin-bottom: 40px;

      .carousel-container {
        :deep(.el-carousel) {
          .el-carousel__container {
            height: 350px;
          }

          .el-carousel__arrow {
            width: 40px;
            height: 40px;
            font-size: 16px;
          }
        }
      }
    }

    .content-section {
      .sort-tabs {
        gap: 16px;
        margin-bottom: 24px;
        padding: 0 12px;

        .sort-item {
          .el-icon {
            font-size: 20px;
          }
        }
      }
    }
  }
}
</style>
