<template>
  <div class="note-detail-page">
    <div v-if="note" class="detail-container">
      <!-- 笔记内容 -->
      <el-card class="note-card">
        <h1 class="note-title">{{ note.title }}</h1>

        <!-- 作者信息 -->
        <div class="note-meta">
          <UserAvatar :user-id="note.authorId" :avatar="note.authorAvatar" :size="40" />
          <div class="author-info">
            <div class="author-name">{{ note.authorName }}</div>
            <div class="publish-time">{{ formatTime(note.createdAt) }}</div>
          </div>
          <el-button v-if="note.authorId !== '1'" type="primary" size="small" @click="handleFollow">
            {{ isFollowing ? '已关注' : '关注' }}
          </el-button>
        </div>

        <!-- 笔记正文 -->
        <div class="note-content">
          <MarkdownPreview :content="note.content" />
        </div>

        <!-- 互动栏 -->
        <div class="note-actions">
          <el-button :type="note.isLiked ? 'danger' : 'default'" @click="handleLike">
            <el-icon><Star /></el-icon>
            点赞 {{ note.likeCount }}
          </el-button>
          <el-button :type="note.isCollected ? 'warning' : 'default'" @click="handleCollect">
            <el-icon><Collection /></el-icon>
            收藏 {{ note.collectCount }}
          </el-button>
          <el-button @click="scrollToComment">
            <el-icon><ChatDotRound /></el-icon>
            评论 {{ note.commentCount }}
          </el-button>
        </div>
      </el-card>

      <!-- 评论区 -->
      <el-card class="comment-card">
        <h3 class="section-title">评论 ({{ socialStore.commentTotal }})</h3>

        <!-- 评论输入 - 只有登录后才显示 -->
        <div v-if="isLogin">
          <CommentInput
            :reply-to="replyToUser"
            @submit="handleCommentSubmit"
            @cancel="cancelReply"
          />
        </div>
        <div v-else class="login-tip">
          <el-button type="primary" @click="userStore.openLoginModal()">登录后发表评论</el-button>
        </div>

        <!-- 评论列表 -->
        <CommentList
          :comments="socialStore.comments"
          @reply="handleCommentReply"
          @like="handleCommentLike"
        />
      </el-card>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading-container">
      <el-icon class="is-loading"><Loading /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Star, Collection, ChatDotRound, Loading } from '@element-plus/icons-vue'
import { useNoteStore } from '@/store/modules/note'
import { useSocialStore } from '@/store/modules/social'
import { useUserStore } from '@/store/modules/user'
import type { Comment } from '@/api/types/social'
import UserAvatar from '@/components/UserAvatar.vue'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import CommentList from '@/components/CommentList.vue'
import CommentInput from '@/components/CommentInput.vue'

const route = useRoute()
const noteStore = useNoteStore()
const socialStore = useSocialStore()
const userStore = useUserStore()

const note = computed(() => noteStore.currentNote)
const isLogin = computed(() => userStore.isLogin)
const isFollowing = ref(false)
const replyToUser = ref('')
const replyToId = ref('')

// 初始化
onMounted(async () => {
  const noteId = route.params.id as string
  await noteStore.fetchNoteDetail(noteId)
  await socialStore.fetchComments(noteId)
})

// 格式化时间
const formatTime = (time: string): string => {
  return new Date(time).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 关注
const handleFollow = () => {
  if (!isLogin.value) {
    userStore.openLoginModal()
    return
  }
  if (!note.value) return
  socialStore.followUser(note.value.authorId)
  isFollowing.value = !isFollowing.value
}

// 点赞
const handleLike = () => {
  if (!isLogin.value) {
    userStore.openLoginModal()
    return
  }
  if (!note.value) return
  noteStore.likeNote(note.value.id)
}

// 收藏
const handleCollect = () => {
  if (!isLogin.value) {
    userStore.openLoginModal()
    return
  }
  if (!note.value) return
  noteStore.collectNote(note.value.id)
}

// 滚动到评论区
const scrollToComment = () => {
  if (!isLogin.value) {
    userStore.openLoginModal()
    return
  }
  // 简单实现，可以优化为平滑滚动到评论输入框
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

// 评论提交
const handleCommentSubmit = async (content: string) => {
  if (!note.value) return
  await socialStore.addComment(note.value.id, content, replyToId.value)
  cancelReply()
}

// 回复评论
const handleCommentReply = (comment: Comment) => {
  replyToUser.value = comment.username
  replyToId.value = comment.id
}

// 取消回复
const cancelReply = () => {
  replyToUser.value = ''
  replyToId.value = ''
}

// 评论点赞
const handleCommentLike = (commentId: string) => {
  console.log('Like comment:', commentId)
  // TODO: 实现评论点赞功能
}
</script>

<style lang="scss" scoped>
.note-detail-page {
  max-width: 900px;
  margin: 0 auto;

  .detail-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .note-card {
    .note-title {
      font-size: 32px;
      font-weight: 600;
      color: #333;
      margin: 0 0 24px;
      line-height: 1.4;
    }

    .note-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 24px;

      .author-info {
        flex: 1;

        .author-name {
          font-size: 16px;
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }

        .publish-time {
          font-size: 13px;
          color: #999;
        }
      }
    }

    .note-content {
      margin-bottom: 32px;
      min-height: 200px;
    }

    .note-actions {
      display: flex;
      gap: 12px;
      padding: 20px 0;
      border-top: 1px solid #f0f0f0;
    }
  }

  .comment-card {
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 0 0 20px;
    }

    .login-tip {
      text-align: center;
      padding: 32px 0;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 20px;
    }
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;

    .el-icon {
      font-size: 48px;
      color: #ff6b6b;
    }
  }
}
</style>
