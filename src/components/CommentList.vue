<template>
  <div class="comment-list">
    <div v-if="comments.length === 0" class="empty">暂无评论</div>

    <div v-for="comment in comments" :key="comment.id" class="comment-item">
      <UserAvatar :user-id="comment.userId" :avatar="comment.userAvatar" :size="36" />

      <div class="comment-content">
        <div class="comment-header">
          <span class="username">{{ comment.username }}</span>
          <span v-if="comment.replyToUser" class="reply-to">回复 @{{ comment.replyToUser }}</span>
          <span class="time">{{ formatTime(comment.createdAt) }}</span>
        </div>

        <div class="comment-text">{{ comment.content }}</div>

        <div class="comment-actions">
          <span class="action-btn" @click="handleLike(comment.id)">
            <el-icon><Star :class="{ liked: comment.isLiked }" /></el-icon>
            {{ comment.likeCount }}
          </span>
          <span class="action-btn" @click="handleReply(comment)">
            <el-icon><ChatDotRound /></el-icon>
            回复
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Star, ChatDotRound } from '@element-plus/icons-vue'
import type { Comment } from '@/api/types/social'
import UserAvatar from './UserAvatar.vue'

interface Props {
  comments: Comment[]
}

interface Emits {
  (e: 'reply', comment: Comment): void
  (e: 'like', commentId: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

// 格式化时间
const formatTime = (time: string): string => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`

  return date.toLocaleDateString()
}

const handleLike = (commentId: string) => {
  emit('like', commentId)
}

const handleReply = (comment: Comment) => {
  emit('reply', comment)
}
</script>

<style lang="scss" scoped>
.comment-list {
  .empty {
    text-align: center;
    padding: 48px 0;
    color: #999;
  }

  .comment-item {
    display: flex;
    gap: 12px;
    padding: 16px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .comment-content {
      flex: 1;
      min-width: 0;

      .comment-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;

        .username {
          font-weight: 500;
          color: #333;
        }

        .reply-to {
          color: #666;
          font-size: 14px;
        }

        .time {
          color: #999;
          font-size: 12px;
          margin-left: auto;
        }
      }

      .comment-text {
        color: #333;
        line-height: 1.6;
        margin-bottom: 8px;
        word-break: break-word;
      }

      .comment-actions {
        display: flex;
        gap: 16px;

        .action-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #999;
          font-size: 13px;
          cursor: pointer;
          transition: color 0.2s;

          &:hover {
            color: #409eff;
          }

          .el-icon {
            font-size: 14px;

            &.liked {
              color: #f56c6c;
            }
          }
        }
      }
    }
  }
}
</style>
