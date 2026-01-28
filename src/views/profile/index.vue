<template>
  <div class="profile-page">
    <!-- 用户信息卡片 -->
    <el-card class="user-card">
      <div class="user-header">
        <UserAvatar :user-id="userId" :avatar="userInfo.avatar" :size="80" :disabled="true" />
        <div class="user-info">
          <h2 class="username">{{ userInfo.nickname }}</h2>
          <p class="user-bio">{{ userInfo.bio }}</p>
        </div>
        <el-button v-if="!isCurrentUser" type="primary" @click="handleFollow">
          {{ userInfo.isFollowing ? '已关注' : '关注' }}
        </el-button>
      </div>

      <div class="user-stats">
        <div class="stat-item">
          <div class="stat-value">{{ userInfo.followingCount }}</div>
          <div class="stat-label">关注</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userInfo.followersCount }}</div>
          <div class="stat-label">粉丝</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userInfo.likeCount }}</div>
          <div class="stat-label">获赞</div>
        </div>
      </div>
    </el-card>

    <!-- 笔记列表 -->
    <el-card class="notes-card">
      <h3 class="section-title">{{ isCurrentUser ? '我的笔记' : 'TA的笔记' }}</h3>

      <div v-loading="noteStore.loading" class="notes-grid">
        <NoteCard v-for="note in noteStore.notes" :key="note.id" :note="note" />
      </div>

      <el-empty v-if="!noteStore.loading && noteStore.notes.length === 0" description="暂无笔记" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useNoteStore } from '@/store/modules/note'
import { useSocialStore } from '@/store/modules/social'
import { getUserById } from '@/mock/users'
import type { UserBrief } from '@/api/types/social'
import UserAvatar from '@/components/UserAvatar.vue'
import NoteCard from '@/components/NoteCard.vue'

const route = useRoute()
const noteStore = useNoteStore()
const socialStore = useSocialStore()

const userId = computed(() => (route.params.id as string) || '1')
const isCurrentUser = computed(() => userId.value === '1')

// 用户信息
const userInfo = ref<UserBrief>({
  id: '1',
  username: 'traveler01',
  nickname: '旅行者小王',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler01',
  bio: '热爱旅行，喜欢记录生活中的美好瞬间',
  followingCount: 128,
  followersCount: 456,
  likeCount: 1234,
  isFollowing: false,
})

// 初始化
onMounted(() => {
  // 加载用户信息
  const user = getUserById(userId.value)
  if (user) {
    userInfo.value = user
  }

  // 加载用户的笔记
  noteStore.fetchNotes({ authorId: userId.value })
})

// 关注/取消关注
const handleFollow = async () => {
  await socialStore.followUser(userId.value)
  userInfo.value.isFollowing = !userInfo.value.isFollowing
}
</script>

<style lang="scss" scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .user-card {
    .user-header {
      display: flex;
      align-items: center;
      gap: 20px;
      padding-bottom: 24px;
      border-bottom: 1px solid #f0f0f0;

      .user-info {
        flex: 1;

        .username {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin: 0 0 8px;
        }

        .user-bio {
          color: #666;
          font-size: 14px;
          margin: 0;
        }
      }
    }

    .user-stats {
      display: flex;
      gap: 48px;
      padding-top: 24px;

      .stat-item {
        text-align: center;

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 13px;
          color: #999;
        }
      }
    }
  }

  .notes-card {
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 0 0 20px;
    }

    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
  }
}
</style>
