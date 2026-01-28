<template>
  <div class="following-page">
    <div class="page-header">
      <h2>我关注的</h2>
      <p>查看你关注的人发布的笔记</p>
    </div>

    <!-- 笔记列表 -->
    <div v-loading="noteStore.loading" class="notes-grid">
      <NoteCard v-for="note in noteStore.notes" :key="note.id" :note="note" />
    </div>

    <!-- 空状态 -->
    <el-empty v-if="!noteStore.loading && noteStore.notes.length === 0" description="暂无笔记" />
  </div>
</template>

<script setup lang="ts">
import { useNoteStore } from '@/store/modules/note'
import NoteCard from '@/components/NoteCard.vue'

const noteStore = useNoteStore()

onMounted(() => {
  noteStore.fetchNotes({ isFollowing: true })
})
</script>

<style lang="scss" scoped>
.following-page {
  max-width: 1200px;
  margin: 0 auto;

  .page-header {
    margin-bottom: 32px;
    text-align: center;

    h2 {
      font-size: 28px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px;
    }

    p {
      color: #666;
      font-size: 14px;
      margin: 0;
    }
  }

  .notes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}
</style>
