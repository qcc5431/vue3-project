<template>
  <div class="note-detail-page">
    <div v-if="note" class="detail-container">
      <!-- 左栏：封面媒体 -->
      <div class="col-cover">
        <div v-if="displayCoverMedia.length > 0" class="cover-sticky">
          <MediaCarousel :media-list="displayCoverMedia" :height="500" />
        </div>
        <div v-else class="cover-empty"></div>
      </div>

      <!-- 中栏：笔记内容 -->
      <div class="col-note">
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

        <h1 class="note-title">{{ note.title }}</h1>

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
      </div>

      <!-- 右栏：评论区 -->
      <div class="col-comment">
        <!-- 滚动区：标题 + 评论列表 -->
        <div class="comment-scroll">
          <h3 class="section-title">评论 ({{ socialStore.commentTotal }})</h3>

          <CommentList
            :comments="socialStore.comments"
            @reply="handleCommentReply"
            @like="handleCommentLike"
          />
        </div>

        <!-- 底部固定栏：输入框 + 互动图标 -->
        <div class="comment-bar">
          <!-- 未输入状态：显示输入框占位 + 图标 -->
          <template v-if="!isCommentInputActive">
            <div class="input-placeholder" @click="openCommentInput">
              <el-icon><ChatDotRound /></el-icon>
              <span>说点什么...</span>
            </div>
            <div class="action-icons">
              <button class="action-btn" :class="{ active: note.isLiked }" @click="handleLike">
                <span class="emoji-icon">{{ note.isLiked ? '❤️' : '🤍' }}</span>
                <span class="action-count">{{ note.likeCount }}</span>
              </button>
              <button
                class="action-btn collect-btn"
                :class="{ active: note.isCollected }"
                @click="handleCollect"
              >
                <el-icon><component :is="note.isCollected ? StarFilled : Star" /></el-icon>
                <span class="action-count">{{ note.collectCount }}</span>
              </button>
              <button class="action-btn" @click="scrollToComment">
                <el-icon><ChatDotRound /></el-icon>
                <span class="action-count">{{ note.commentCount }}</span>
              </button>
            </div>
          </template>

          <!-- 输入状态：上行输入框，下行发送/取消按钮 -->
          <template v-else>
            <div class="input-expanded">
              <el-input
                v-model="commentContent"
                type="textarea"
                :rows="2"
                :placeholder="replyToUser ? `回复 ${replyToUser}:` : '说点什么...'"
                class="comment-textarea"
              />
              <div class="input-actions">
                <el-button type="primary" size="small" @click="submitComment">发送</el-button>
                <el-button size="small" @click="cancelCommentInput">取消</el-button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading-container">
      <el-icon class="is-loading"><Loading /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Star, StarFilled, Collection, ChatDotRound, Loading } from '@element-plus/icons-vue'
import { useNoteStore } from '@/store/modules/note'
import { useSocialStore } from '@/store/modules/social'
import { useUserStore } from '@/store/modules/user'
import type { Comment } from '@/api/types/social'
import UserAvatar from '@/components/UserAvatar.vue'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import CommentList from '@/components/CommentList.vue'
import MediaCarousel from '@/components/MediaCarousel.vue'
import { getDisplayCoverMedia } from '@/utils/mediaHelper'

const route = useRoute()
const noteStore = useNoteStore()
const socialStore = useSocialStore()
const userStore = useUserStore()

const note = computed(() => noteStore.currentNote)
const isLogin = computed(() => userStore.isLogin)
const isFollowing = ref(false)
const replyToUser = ref('')
const replyToId = ref('')
const isCommentInputActive = ref(false)
const commentContent = ref('')

// 获取展示用的封面（自动或手动）
const displayCoverMedia = computed(() => {
  if (!note.value) return []
  return getDisplayCoverMedia(note.value.coverMedia, note.value.content, 3)
})

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

// 打开评论输入
const openCommentInput = () => {
  if (!isLogin.value) {
    userStore.openLoginModal()
    return
  }
  isCommentInputActive.value = true
}

// 取消评论输入
const cancelCommentInput = () => {
  isCommentInputActive.value = false
  commentContent.value = ''
  cancelReply()
}

// 提交评论
const submitComment = async () => {
  if (!commentContent.value.trim()) return
  if (!note.value) return
  await socialStore.addComment(
    note.value.id,
    commentContent.value.trim(),
    replyToId.value || undefined,
  )
  commentContent.value = ''
  isCommentInputActive.value = false
  cancelReply()
}

// 回复评论
const handleCommentReply = (comment: Comment, parentComment?: Comment) => {
  replyToUser.value = comment.username
  // 如果是回复子评论，实际回复到父评论下
  replyToId.value = parentComment ? parentComment.id : comment.id
  isCommentInputActive.value = true
}

// 取消回复
const cancelReply = () => {
  replyToUser.value = ''
  replyToId.value = ''
}

// 评论点赞
const handleCommentLike = (commentId: string) => {
  if (!isLogin.value) {
    userStore.openLoginModal()
    return
  }
  socialStore.likeComment(commentId)
}
</script>

<style lang="scss" scoped>
.note-detail-page {
  height: calc(100vh - 60px); // 减去header高度
  overflow: hidden;
  padding: 0 20px;

  .detail-container {
    display: grid;
    grid-template-columns: 360px 1fr 360px;
    gap: 0;
    height: 100%;
    padding-bottom: 10px;
    max-width: 1400px;
    margin: 0 auto;
  }

  // 左栏：封面
  .col-cover {
    border-right: 1px solid #f0f0f0;
    display: flex;
    align-items: flex-start;
    overflow: hidden;

    // 覆盖公共轮播组件的圆角，仅保留左上和左下
    :deep(.el-carousel),
    :deep(.single-video) {
      border-radius: 12px 0 0 12px;
    }

    .cover-sticky {
      width: 100%;
      position: sticky;
      top: 0;
    }

    .cover-empty {
      width: 100%;
      height: 100%;
      background: #1a1a1a;
    }
  }

  // 中栏：笔记正文（隐藏滚动条）
  .col-note {
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
    padding: 32px 36px;
    background: #fff;

    .note-title {
      font-size: 28px;
      font-weight: 600;
      color: #1f2329;
      margin: 20px 0 24px;
      line-height: 1.4;
    }

    .note-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 0;
      margin-bottom: 0;

      .author-info {
        flex: 1;

        .author-name {
          font-size: 15px;
          font-weight: 500;
          color: #333;
          margin-bottom: 2px;
        }

        .publish-time {
          font-size: 13px;
          color: #999;
        }
      }
    }

    .note-content {
      min-height: 200px;
      margin-bottom: 32px;
    }

    .note-actions {
      display: none; // 移到评论栏底部，这里隐藏
    }
  }

  // 右栏：评论区
  .col-comment {
    border-left: 1px solid #f0f0f0;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    // 可滚动区域（隐藏滚动条）
    .comment-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 24px 20px 16px;
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0 0 20px;
    }

    .login-tip {
      text-align: center;
      padding: 24px 0;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 16px;
    }

    // 底部固定栏
    .comment-bar {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-top: 1px solid #f0f0f0;
      background: #fafafa;

      .input-placeholder {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 2px 8px;
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 20px;
        cursor: pointer;
        color: #999;
        font-size: 14px;
        transition: all 0.2s;

        &:hover {
          border-color: $primary-color;
          color: #666;
        }

        .el-icon {
          font-size: 16px;
        }
      }

      .input-active {
        flex: 1;

        .comment-textarea {
          :deep(.el-textarea__inner) {
            border-radius: 16px;
            resize: none;
          }
        }
      }

      // 展开状态：上下两行
      .input-expanded {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;

        .comment-textarea {
          :deep(.el-textarea) {
            --el-input-focus-border-color: #{$primary-color};
            --el-input-hover-border-color: #{$primary-color};
          }
          :deep(.el-textarea__inner) {
            border-radius: 12px;
            resize: none;
          }
        }

        .input-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
      }
      .action-icons {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .input-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .action-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        background: none;
        border: none;
        cursor: pointer;
        color: #8fa998;
        font-size: 14px;
        padding: 4px 0;
        transition: color 0.2s;

        &:hover {
          color: #4a5a4f;
        }

        &.collect-btn.active {
          color: #f0a500;
        }

        .emoji-icon {
          font-size: 12px;
          line-height: 1;
          display: inline-block;
          vertical-align: middle;
        }

        .action-count {
          font-size: 13px;
        }
      }
    }
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    .el-icon {
      font-size: 48px;
      color: #ff6b6b;
    }
  }
}

// 响应式：小屏改为单列
@media (max-width: 1024px) {
  .note-detail-page {
    height: auto;
    overflow: visible;

    .detail-container {
      grid-template-columns: 1fr;
    }

    .col-cover {
      height: 400px;
    }

    .col-comment {
      border-left: none;
      border-top: 1px solid #f0f0f0;
    }
  }
}
</style>
