<template>
  <div class="my-notes-page">
    <div class="page-header">
      <h2>我的笔记</h2>
      <el-radio-group v-model="visibilityFilter" @change="handleFilterChange">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="public">公开</el-radio-button>
        <el-radio-button label="private">私密</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 笔记列表 -->
    <div v-loading="noteStore.loading" class="notes-grid">
      <div v-for="note in filteredNotes" :key="note.id" class="note-item">
        <NoteCard :note="note" />
        <div class="note-actions">
          <el-button size="small" type="primary" text @click="editNote(note.id)">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <el-button size="small" type="danger" text @click="deleteNote(note.id)">
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty v-if="!noteStore.loading && filteredNotes.length === 0" description="还没有笔记" />
  </div>
</template>

<script setup lang="ts">
import { Edit, Delete } from '@element-plus/icons-vue'
import { useNoteStore } from '@/store/modules/note'
import NoteCard from '@/components/NoteCard.vue'

const router = useRouter()
const noteStore = useNoteStore()

const visibilityFilter = ref('all')

// 筛选的笔记
const filteredNotes = computed(() => {
  if (visibilityFilter.value === 'all') {
    return noteStore.notes
  }
  return noteStore.notes.filter((note) => note.visibility === visibilityFilter.value)
})

onMounted(() => {
  // 获取当前用户的笔记（authorId='1'是模拟的当前用户）
  noteStore.fetchNotes({ authorId: '1' })
})

// 筛选变化
const handleFilterChange = () => {
  // 筛选在前端完成，不需要重新请求
}

// 编辑笔记
const editNote = (id: string) => {
  router.push(`/note/${id}/edit`)
}

// 删除笔记
const deleteNote = (id: string) => {
  ElMessageBox.confirm('确定要删除这篇笔记吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await noteStore.deleteNote(id)
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
.my-notes-page {
  max-width: 1200px;
  margin: 0 auto;

  .page-header {
    margin-bottom: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      font-size: 28px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }
  }

  .notes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  .note-item {
    position: relative;

    .note-actions {
      position: absolute;
      top: 8px;
      right: 8px;
      display: none;
      gap: 8px;
      background: rgba(255, 255, 255, 0.95);
      padding: 4px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &:hover .note-actions {
      display: flex;
    }
  }
}
</style>
