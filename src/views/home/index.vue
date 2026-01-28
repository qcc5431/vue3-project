<template>
  <div class="home-page">
    <!-- 排序选项 -->
    <div class="sort-bar">
      <el-radio-group v-model="sortType" @change="handleSortChange">
        <el-radio-button label="recommend">推荐</el-radio-button>
        <el-radio-button label="latest">最新</el-radio-button>
        <el-radio-button label="hot">最热</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 笔记列表 -->
    <div v-loading="noteStore.loading" class="notes-grid">
      <NoteCard v-for="note in noteStore.notes" :key="note.id" :note="note" />
    </div>

    <!-- 空状态 -->
    <el-empty v-if="!noteStore.loading && noteStore.notes.length === 0" description="暂无笔记" />

    <!-- 加载更多 -->
    <div v-if="hasMore" class="load-more">
      <el-button @click="loadMore">加载更多</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNoteStore } from '@/store/modules/note'
import type { NoteSortType } from '@/api/types/note'
import NoteCard from '@/components/NoteCard.vue'

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

// 排序变化
const handleSortChange = () => {
  noteStore.page = 1
  noteStore.fetchNotes({ sortType: sortType.value })
}

// 加载更多
const loadMore = () => {
  noteStore.loadMore()
}
</script>

<style lang="scss" scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;

  .sort-bar {
    margin-bottom: 24px;
    display: flex;
    justify-content: center;
  }

  .notes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .load-more {
    text-align: center;
    padding: 32px 0;
  }
}
</style>
