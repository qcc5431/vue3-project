<template>
  <div class="comment-list">
    <div v-if="comments.length === 0" class="empty">暂无评论</div>

    <div v-for="comment in comments" :key="comment.id" class="comment-item">
      <UserAvatar :user-id="comment.userId" :avatar="comment.userAvatar" :size="36" />

      <div class="comment-content">
        <div class="comment-header">
          <span class="username">{{ comment.username }}</span>
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

        <!-- 子回复列表 -->
        <div v-if="comment.replies && comment.replies.length > 0" class="replies-section">
          <div
            v-for="reply in getVisibleReplies(comment)"
            :key="reply.id"
            class="reply-item"
          >
            <UserAvatar :user-id="reply.userId" :avatar="reply.userAvatar" :size="28" />
            <div class="reply-content">
              <div class="reply-header">
                <span class="username">{{ reply.username }}</span>
                <span v-if="reply.replyToUser" class="reply-to">
                  回复 <span class="reply-target">@{{ reply.replyToUser }}</span>
                </span>
                <span class="time">{{ formatTime(reply.createdAt) }}</span>
              </div>
              <div class="reply-text">{{ reply.content }}</div>
              <div class="reply-actions">
                <span class="action-btn" @click="handleLike(reply.id)">
                  <el-icon><Star :class="{ liked: reply.isLiked }" /></el-icon>
                  {{ reply.likeCount }}
                </span>
                <span class="action-btn" @click="handleReply(reply, comment)">
                  <el-icon><ChatDotRound /></el-icon>
                  回复
                </span>
              </div>
            </div>
          </div>

          <!-- 展开更多回复 -->
          <div
            v-if="hasMoreReplies(comment)"
            class="show-more-replies"
            @click="expandReplies(comment.id)"
          >
            展开更多回复 ({{ getRemainingCount(comment) }}条)
            <el-icon><ArrowDown /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Star, ChatDotRound, ArrowDown } from '@element-plus/icons-vue'
import type { Comment } from '@/api/types/social'
import UserAvatar from './UserAvatar.vue'

interface Props {
  comments: Comment[]
  defaultReplyCount?: number // 默认显示的回复数量
}

interface Emits {
  (e: 'reply', comment: Comment, parentComment?: Comment): void
  (e: 'like', commentId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  defaultReplyCount: 2,
})
const emit = defineEmits<Emits>()

// 记录每个评论展开的回复数量
const expandedReplies = ref<Record<string, number>>({})

// 获取可见的回复
const getVisibleReplies = (comment: Comment) => {
  if (!comment.replies) return []
  const count = expandedReplies.value[comment.id] || props.defaultReplyCount
  return comment.replies.slice(0, count)
}

// 是否还有更多回复
const hasMoreReplies = (comment: Comment) => {
  if (!comment.replies) return false
  const count = expandedReplies.value[comment.id] || props.defaultReplyCount
  return comment.replies.length > count
}

// 获取剩余回复数量
const getRemainingCount = (comment: Comment) => {
  if (!comment.replies) return 0
  const count = expandedReplies.value[comment.id] || props.defaultReplyCount
  return comment.replies.length - count
}

// 展开更多回复
const expandReplies = (commentId: string) => {
  const current = expandedReplies.value[commentId] || props.defaultReplyCount
  expandedReplies.value[commentId] = current + 5 // 每次多展示5条
}

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

const handleReply = (comment: Comment, parentComment?: Comment) => {
  emit('reply', comment, parentComment)
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

      // 子回复区域
      .replies-section {
        margin-top: 12px;
        padding: 12px;
        background: #f9f9f9;
        border-radius: 8px;

        .reply-item {
          display: flex;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;

          &:first-child {
            padding-top: 0;
          }

          &:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }

          .reply-content {
            flex: 1;
            min-width: 0;

            .reply-header {
              display: flex;
              align-items: center;
              gap: 6px;
              margin-bottom: 6px;
              flex-wrap: wrap;

              .username {
                font-weight: 500;
                color: #333;
                font-size: 13px;
              }

              .reply-to {
                color: #999;
                font-size: 13px;

                .reply-target {
                  color: #409eff;
                }
              }

              .time {
                color: #999;
                font-size: 12px;
                margin-left: auto;
              }
            }

            .reply-text {
              color: #333;
              font-size: 14px;
              line-height: 1.5;
              margin-bottom: 6px;
              word-break: break-word;
            }

            .reply-actions {
              display: flex;
              gap: 12px;

              .action-btn {
                display: flex;
                align-items: center;
                gap: 4px;
                color: #999;
                font-size: 12px;
                cursor: pointer;
                transition: color 0.2s;

                &:hover {
                  color: #409eff;
                }

                .el-icon {
                  font-size: 12px;

                  &.liked {
                    color: #f56c6c;
                  }
                }
              }
            }
          }
        }

        .show-more-replies {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 10px 0 0;
          color: #409eff;
          font-size: 13px;
          cursor: pointer;
          transition: opacity 0.2s;

          &:hover {
            opacity: 0.8;
          }

          .el-icon {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
