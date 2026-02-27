<template>
  <div class="following-page">
    <!-- 左侧关注用户列表 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <span>我关注的用户</span>
        <span class="user-count">{{ socialStore.followingList.length }}</span>
      </div>

      <div class="user-list">
        <transition-group name="fade-slide" tag="div" class="user-list-wrapper">
          <div
            v-for="user in socialStore.followingList"
            :key="user.id"
            class="user-item"
            @click="router.push(`/profile/${user.id}`)"
          >
            <UserAvatar :user-id="user.id" :avatar="user.avatar" :size="40" />
            <div class="user-info">
              <div class="user-name">{{ user.nickname }}</div>
              <div class="user-stats">{{ user.likeCount }} 笔记</div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>

    <!-- 右侧瀑布流列表 -->
    <div class="content">
      <WaterfallList
        :items="noteStore.notes"
        :loading="noteStore.loading"
        :has-more="hasMore"
        :total="noteStore.total"
        empty-text="暂无笔记"
        @load-more="handleLoadMore"
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
import { useSocialStore } from '@/store/modules/social'
import NoteCard from '@/components/NoteCard.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import WaterfallList from '@/components/WaterfallList.vue'

const noteStore = useNoteStore()
const socialStore = useSocialStore()
const router = useRouter()

// 是否还有更多
const hasMore = computed(() => {
  return noteStore.notes.length < noteStore.total
})

// 加载更多
const handleLoadMore = () => {
  noteStore.loadMore()
}

onMounted(() => {
  // 清空之前的数据
  noteStore.notes = []
  noteStore.page = 1

  // 获取关注的用户列表
  socialStore.fetchFollowingList()
  // 获取关注用户的笔记,按最新排序
  noteStore.fetchNotes({ isFollowing: true, sortType: 'latest' })
})
</script>

<style lang="scss" scoped>
.following-page {
  display: flex;
  gap: 24px;
  padding: 20px 0 30px 0;
  min-height: 100vh;

  // 左侧侧边栏
  .sidebar {
    width: 260px;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 16px;
    padding: 20px;
    height: fit-content;
    position: sticky;
    top: 20px;
    margin-left: 10px;
    opacity: 0;
    animation: sidebar-fade-in 0.5s ease-out forwards;
    animation-delay: 0.1s;

    @keyframes sidebar-fade-in {
      from {
        opacity: 0;
        transform: translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding: 0 4px;

      span {
        font-size: 13px;
        color: rgba(255, 255, 255);
        font-weight: 500;
      }

      .user-count {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .user-list {
      display: flex;
      flex-direction: column;
      gap: 4px;

      // 用户列表容器
      .user-list-wrapper {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      // 淡入动画
      .fade-slide-enter-active {
        transition: all 0.4s ease-out;

        &:nth-child(1) {
          transition-delay: 0.05s;
        }
        &:nth-child(2) {
          transition-delay: 0.1s;
        }
        &:nth-child(3) {
          transition-delay: 0.15s;
        }
        &:nth-child(4) {
          transition-delay: 0.2s;
        }
        &:nth-child(5) {
          transition-delay: 0.25s;
        }
      }

      .fade-slide-enter-from {
        opacity: 0;
        transform: translateY(-10px);
      }

      .fade-slide-enter-to {
        opacity: 1;
        transform: translateY(0);
      }

      .user-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        color: rgba(255, 255, 255);

        .user-info {
          flex: 1;
          min-width: 0;

          .user-name {
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 4px;
          }

          .user-stats {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
      }
    }
  }

  // 右侧内容区
  .content {
    flex: 1;
    min-width: 0;
  }
}

// 响应式适配
@media (max-width: 768px) {
  .following-page {
    flex-direction: column;
    padding: 20px 12px;

    .sidebar {
      width: 100%;
      position: relative;
      top: 0;
    }
  }
}
</style>
