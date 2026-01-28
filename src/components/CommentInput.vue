<template>
  <div class="comment-input">
    <el-input
      v-model="commentText"
      type="textarea"
      :rows="3"
      :placeholder="replyTo ? `回复 @${replyTo}` : '写下你的评论...'"
      maxlength="500"
      show-word-limit
    />
    <div class="comment-actions">
      <el-button v-if="replyTo" size="small" @click="handleCancel">取消</el-button>
      <el-button type="primary" size="small" :loading="loading" @click="handleSubmit">
        发布
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  replyTo?: string
}

interface Emits {
  (e: 'submit', content: string): void
  (e: 'cancel'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const commentText = ref('')
const loading = ref(false)

const handleSubmit = () => {
  if (!commentText.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  emit('submit', commentText.value)
  commentText.value = ''
}

const handleCancel = () => {
  emit('cancel')
  commentText.value = ''
}
</script>

<style lang="scss" scoped>
.comment-input {
  .comment-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 12px;
  }
}
</style>
