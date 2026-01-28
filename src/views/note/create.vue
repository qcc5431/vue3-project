<template>
  <div class="create-note-page">
    <el-card>
      <div class="note-editor">
        <h2 class="page-title">{{ isEdit ? '编辑笔记' : '创建笔记' }}</h2>

        <el-form :model="formData" label-width="80px">
          <!-- 标题 -->
          <el-form-item label="标题">
            <el-input v-model="formData.title" placeholder="请输入笔记标题" maxlength="100" show-word-limit />
          </el-form-item>

          <!-- 封面图 -->
          <el-form-item label="封面图">
            <div v-if="formData.coverImage" class="cover-preview">
              <el-image :src="formData.coverImage" fit="cover" />
              <el-button class="remove-btn" circle @click="removeCover">
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
            <el-button v-else @click="triggerCoverUpload">
              <el-icon><Plus /></el-icon>
              选择封面图
            </el-button>
            <input ref="coverInput" type="file" accept="image/*" style="display: none" @change="handleCoverUpload" />
          </el-form-item>

          <!-- Markdown编辑器 -->
          <el-form-item label="内容">
            <MarkdownEditor v-model="formData.content" @upload-image="handleImageUpload" />
          </el-form-item>

          <!-- 图片列表 -->
          <el-form-item v-if="formData.images.length > 0" label="图片">
            <div class="image-list">
              <div v-for="(img, index) in formData.images" :key="index" class="image-item">
                <el-image :src="img" fit="cover" />
                <el-button class="remove-btn" circle @click="removeImage(index)">
                  <el-icon><Close /></el-icon>
                </el-button>
              </div>
            </div>
          </el-form-item>

          <!-- 可见性 -->
          <el-form-item label="可见性">
            <el-radio-group v-model="formData.visibility">
              <el-radio label="public">公开</el-radio>
              <el-radio label="private">仅自己可见</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 操作按钮 -->
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="handleSubmit">
              {{ isEdit ? '保存' : '发布' }}
            </el-button>
            <el-button @click="handleCancel">取消</el-button>
            <el-button @click="triggerMarkdownImport">
              <el-icon><Upload /></el-icon>
              导入Markdown
            </el-button>
            <input ref="markdownInput" type="file" accept=".md" style="display: none" @change="handleMarkdownImport" />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Plus, Close, Upload } from '@element-plus/icons-vue'
import { useNoteStore } from '@/store/modules/note'
import MarkdownEditor from '@/components/MarkdownEditor.vue'

const router = useRouter()
const route = useRoute()
const noteStore = useNoteStore()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)

const coverInput = ref<HTMLInputElement>()
const markdownInput = ref<HTMLInputElement>()

const formData = reactive({
  title: '',
  content: '',
  coverImage: '',
  images: [] as string[],
  visibility: 'public' as 'public' | 'private',
})

// 处理封面上传
const triggerCoverUpload = () => {
  coverInput.value?.click()
}

const handleCoverUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.coverImage = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
  target.value = ''
}

const removeCover = () => {
  formData.coverImage = ''
}

// 处理图片上传
const handleImageUpload = (files: File[]) => {
  files.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      formData.images.push(url)
      // 插入到Markdown中
      formData.content += `\n![图片](${url})\n`
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index: number) => {
  formData.images.splice(index, 1)
}

// 导入Markdown
const triggerMarkdownImport = () => {
  markdownInput.value?.click()
}

const handleMarkdownImport = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.content = e.target?.result as string
      ElMessage.success('导入成功')
    }
    reader.readAsText(file)
  }
  target.value = ''
}

// 提交
const handleSubmit = async () => {
  if (!formData.title.trim()) {
    ElMessage.warning('请输入标题')
    return
  }
  if (!formData.content.trim()) {
    ElMessage.warning('请输入内容')
    return
  }

  loading.value = true
  try {
    if (isEdit.value) {
      await noteStore.updateNote({
        id: route.params.id as string,
        ...formData,
      })
    } else {
      await noteStore.createNote(formData)
    }
    router.push('/my-notes')
  } finally {
    loading.value = false
  }
}

// 取消
const handleCancel = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.create-note-page {
  max-width: 900px;
  margin: 0 auto;

  .note-editor {
    .page-title {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 24px;
      color: #333;
    }
  }

  .cover-preview {
    position: relative;
    width: 200px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;

    :deep(.el-image) {
      width: 100%;
      height: 100%;
    }

    .remove-btn {
      position: absolute;
      top: 8px;
      right: 8px;
    }
  }

  .image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    .image-item {
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 8px;
      overflow: hidden;

      :deep(.el-image) {
        width: 100%;
        height: 100%;
      }

      .remove-btn {
        position: absolute;
        top: 4px;
        right: 4px;
      }
    }
  }
}
</style>
