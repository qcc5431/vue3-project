<template>
  <div class="my-notes-page">
    <!-- 左侧文件夹列表 -->
    <div class="sidebar">
      <!-- 默认文件夹 -->
      <div
        class="folder-item default-folder"
        :class="{ active: folderStore.currentFolderId === null }"
        @click="selectFolder(null)"
      >
        <el-icon><Document /></el-icon>
        <span class="folder-name">全部笔记</span>
        <span class="folder-count">{{ folderStore.totalNoteCount }}</span>
      </div>

      <el-divider />

      <!-- 自定义文件夹列表 -->
      <div class="custom-folders">
        <div class="folder-header">
          <span>我的文件夹</span>
          <el-button
            type="primary"
            :icon="Plus"
            size="small"
            circle
            @click="showCreateFolderDialog = true"
          />
        </div>

        <div class="folder-list">
          <transition-group name="fade-slide" tag="div" class="folder-list-wrapper">
            <div
              v-for="folder in folderStore.folders"
              :key="folder.id"
              class="folder-item"
              :class="{ active: folderStore.currentFolderId === folder.id }"
              @click="selectFolder(folder.id)"
            >
              <el-icon><FolderIcon /></el-icon>
              <span class="folder-name">{{ folder.name }}</span>
              <span class="folder-count">{{ folder.noteCount }}</span>
              <div class="folder-actions">
                <el-icon @click.stop="editFolder(folder)"><Edit /></el-icon>
                <el-icon @click.stop="handleDeleteFolder(folder.id)"><Delete /></el-icon>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>

    <!-- 右侧瀑布流列表 -->
    <div class="content">
      <WaterfallList
        :items="noteStore.notes"
        :loading="noteStore.loading"
        :has-more="hasMore"
        :total="noteStore.total"
        empty-text="还没有笔记"
        @load-more="handleLoadMore"
      >
        <template #default="{ item, imageHeight }">
          <NoteCard :note="item" :image-height="imageHeight" />
        </template>
      </WaterfallList>
    </div>

    <!-- 创建文件夹对话框 -->
    <el-dialog v-model="showCreateFolderDialog" title="创建文件夹" width="400px">
      <el-form @submit.prevent="handleCreateFolder">
        <el-form-item label="文件夹名称">
          <el-input
            v-model="newFolderName"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateFolderDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreateFolder">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑文件夹对话框 -->
    <el-dialog v-model="showEditFolderDialog" title="编辑文件夹" width="400px">
      <el-form @submit.prevent="handleEditFolder">
        <el-form-item label="文件夹名称">
          <el-input
            v-model="editingFolderName"
            placeholder="请输入文件夹名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditFolderDialog = false">取消</el-button>
        <el-button type="primary" @click="handleEditFolder">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useNoteStore } from '@/store/modules/note'
import { useFolderStore } from '@/store/modules/folder'
import type { Folder } from '@/api/types/folder'
import NoteCard from '@/components/NoteCard.vue'
import WaterfallList from '@/components/WaterfallList.vue'
import { Document, Folder as FolderIcon, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const noteStore = useNoteStore()
const folderStore = useFolderStore()

// 对话框状态
const showCreateFolderDialog = ref(false)
const showEditFolderDialog = ref(false)
const newFolderName = ref('')
const editingFolderName = ref('')
const editingFolderId = ref('')

// 是否还有更多
const hasMore = computed(() => {
  return noteStore.notes.length < noteStore.total
})

// 选择文件夹
const selectFolder = (folderId: string | null) => {
  folderStore.setCurrentFolder(folderId)
  noteStore.page = 1
  noteStore.fetchNotes({
    authorId: '1', // 当前用户ID
    folderId: folderId || undefined,
  })
}

// 创建文件夹
const handleCreateFolder = async () => {
  if (!newFolderName.value.trim()) {
    ElMessage.warning('请输入文件夹名称')
    return
  }

  const success = await folderStore.createFolder(newFolderName.value.trim())
  if (success) {
    showCreateFolderDialog.value = false
    newFolderName.value = ''
  }
}

// 编辑文件夹
const editFolder = (folder: Folder) => {
  editingFolderId.value = folder.id
  editingFolderName.value = folder.name
  showEditFolderDialog.value = true
}

// 确认编辑文件夹
const handleEditFolder = async () => {
  if (!editingFolderName.value.trim()) {
    ElMessage.warning('请输入文件夹名称')
    return
  }

  const success = await folderStore.updateFolder(
    editingFolderId.value,
    editingFolderName.value.trim(),
  )
  if (success) {
    showEditFolderDialog.value = false
    editingFolderName.value = ''
    editingFolderId.value = ''
  }
}

// 删除文件夹
const handleDeleteFolder = async (folderId: string) => {
  try {
    await ElMessageBox.confirm('删除文件夹不会删除其中的笔记，确认删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await folderStore.deleteFolder(folderId)
  } catch {
    // 取消删除
  }
}

// 加载更多
const handleLoadMore = () => {
  noteStore.loadMore()
}

// 初始化加载
onMounted(() => {
  // 清空之前的数据
  noteStore.notes = []
  noteStore.page = 1

  // 加载文件夹列表
  folderStore.fetchFolders()
  // 加载当前用户的笔记（默认全部）
  noteStore.fetchNotes({ authorId: '1' })
})
</script>

<style lang="scss" scoped>
.my-notes-page {
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

    .el-divider {
      margin: 16px 0;
      background-color: rgba(255, 255, 255, 0.2);
    }

    // 默认文件夹
    .default-folder {
      margin-bottom: 8px;
    }

    // 文件夹项
    .folder-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: rgba(255, 255, 255);
      position: relative;

      .el-icon {
        font-size: 18px;
        flex-shrink: 0;
      }

      .folder-name {
        flex: 1;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .folder-count {
        font-size: 12px;
        color: rgba(255, 255, 255);
        flex-shrink: 0;
      }

      .folder-actions {
        display: none;
        gap: 8px;
        margin-left: 8px;

        .el-icon {
          font-size: 20px;
          padding: 2px;
          border-radius: 4px;
          transition: all 0.2s ease;

          &:hover {
            background: rgba(255, 255, 255, 0.2);
            color: #fff;
          }
        }
      }

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;

        .folder-actions {
          display: flex;
        }

        .folder-count {
          display: none;
        }
      }

      &.active {
        background: rgba(255, 255, 255, 0.25);
        color: #fff;
        font-weight: 500;

        .folder-count {
          color: rgba(255, 255, 255);
        }
      }
    }

    // 文件夹头部
    .folder-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      padding: 0 4px;

      span {
        font-size: 13px;
        color: rgba(255, 255, 255);
        font-weight: 500;
      }

      .el-button {
        width: 28px;
        height: 28px;
        background: rgba(109, 186, 122, 0.3);
        border: none;
        color: #fff;

        &:hover {
          background: rgba(109, 186, 122, 0.6);
          color: #fff;
          transform: scale(1.1);
        }
      }
    }

    .folder-list {
      display: flex;
      flex-direction: column;
      gap: 4px;

      // 文件夹列表容器
      .folder-list-wrapper {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      // 淡入动画
      .fade-slide-enter-active {
        transition: all 0.4s ease-out;

        &:nth-child(1) { transition-delay: 0.05s; }
        &:nth-child(2) { transition-delay: 0.1s; }
        &:nth-child(3) { transition-delay: 0.15s; }
        &:nth-child(4) { transition-delay: 0.2s; }
        &:nth-child(5) { transition-delay: 0.25s; }
      }

      .fade-slide-enter-from {
        opacity: 0;
        transform: translateY(-10px);
      }

      .fade-slide-enter-to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  // 右侧内容区
  .content {
    flex: 1;
    min-width: 0;
  }
}

// 对话框样式
:deep(.el-dialog) {
  border-radius: 12px;

  .el-dialog__footer {
    .el-button {
      padding: 10px 24px;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s ease;

      &:not(.el-button--primary) {
        background: #f5f5f5;
        border: 1px solid #e0e0e0;
        color: #666;

        &:hover {
          background: #e8e8e8;
          border-color: #d0d0d0;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      }

      &.el-button--primary {
        background: rgba(109, 186, 122, 0.7);
        border: none;
        color: #fff;

        &:hover {
          background: rgba(109, 186, 122, 0.85);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(109, 186, 122, 0.4);
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .my-notes-page {
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
