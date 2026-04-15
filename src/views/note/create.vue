<template>
  <div class="create-note-page">
    <div class="note-editor">
      <!-- 标题输入 -->
      <div class="title-row">
        <el-input
          v-model="formData.title"
          placeholder="请输入标题"
          class="title-input"
          maxlength="100"
        />
        <AITitleSuggest
          :content="formData.content"
          @select="formData.title = $event"
        />
      </div>

      <!-- Markdown编辑器 -->
      <div class="editor-wrapper">
        <MarkdownEditor v-model="formData.content" @upload-image="handleImageUpload" />
      </div>

      <!-- 封面设置区域 -->
      <div class="cover-section">
        <div class="section-title">封面设置</div>
        <div v-if="formData.coverMedia.length === 0" class="cover-tips">
          未设置封面，将自动使用文中前3张图片
        </div>
        <MediaUploader
          v-model="formData.coverMedia"
          :max-count="9"
          :upload-fn="handleMediaUpload"
        />
        <div class="cover-actions">
          <el-button text @click="selectFromContent">
            <el-icon><Picture /></el-icon>
            从文中选择
          </el-button>
          <el-button v-if="formData.coverMedia.length > 0" text @click="clearCover">
            清除封面
          </el-button>
        </div>
      </div>

      <!-- 可见性设置 -->
      <div class="visibility-section">
        <div class="section-title">可见性</div>
        <el-radio-group v-model="formData.visibility" class="visibility-radio">
          <el-radio label="public">公开</el-radio>
          <el-radio label="private">仅自己可见</el-radio>
        </el-radio-group>
      </div>

      <!-- 底部操作栏 -->
      <div class="bottom-bar">
        <div class="left-actions">
          <el-button text @click="triggerMarkdownImport">
            <el-icon><Upload /></el-icon>
            导入Markdown
          </el-button>
          <input
            ref="markdownInput"
            type="file"
            accept=".md"
            style="display: none"
            @change="handleMarkdownImport"
          />
        </div>
        <div class="right-actions">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            {{ isEdit ? '保存' : '发布' }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Upload, Picture } from '@element-plus/icons-vue'
import { useNoteStore } from '@/store/modules/note'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import { AITitleSuggest } from '@/components/AIAssistant'
import type { MediaItem } from '@/api/types/note'
import { uploadImage, uploadVideo } from '@/api/upload'

const router = useRouter()
const route = useRoute()
const noteStore = useNoteStore()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)

const markdownInput = ref<HTMLInputElement>()

const formData = reactive({
  title: '',
  content: '',
  coverMedia: [] as MediaItem[],
  images: [] as string[],
  visibility: 'public' as 'public' | 'private',
})

// 从内容中提取图片URL
const extractImagesFromContent = (): string[] => {
  const regex = /!\[.*?\]\((.*?)\)/g
  const matches = [...formData.content.matchAll(regex)]
  return matches.map((match) => match[1] || '').filter((url) => url)
}

// MediaUploader 的上传函数
const handleMediaUpload = async (file: File): Promise<MediaItem | null> => {
  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')

  if (!isImage && !isVideo) {
    ElMessage.warning(`文件 ${file.name} 格式不支持`)
    return null
  }

  try {
    if (isImage) {
      const res = await uploadImage(file, 'note')
      if (res.code === 200 && res.data) {
        return {
          type: 'image',
          url: res.data.url,
          width: res.data.width,
          height: res.data.height,
        }
      }
    } else if (isVideo) {
      const res = await uploadVideo(file)
      if (res.code === 200 && res.data) {
        return {
          type: 'video',
          url: res.data.url,
          width: res.data.width,
          height: res.data.height,
          duration: res.data.duration,
        }
      }
    }
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error(`上传 ${file.name} 失败`)
  }
  return null
}

// 从文中选择封面
const selectFromContent = () => {
  const contentImages = extractImagesFromContent()
  if (contentImages.length === 0) {
    ElMessage.warning('内容中没有图片，请先插入图片')
    return
  }

  // 弹窗选择图片
  ElMessageBox({
    title: '选择封面图片',
    message: h('div', { class: 'image-selector' }, [
      h('p', { style: 'margin-bottom: 12px; color: #666; font-size: 14px' }, '最多选择9张图片'),
      h(
        'div',
        {
          class: 'image-grid',
          style:
            'display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-height: 400px; overflow-y: auto',
        },
        contentImages.map((url, index) =>
          h(
            'div',
            {
              key: index,
              class: 'image-item',
              style:
                'position: relative; cursor: pointer; border: 2px solid transparent; border-radius: 4px; overflow: hidden',
              onclick: (e: Event) => {
                const target = e.currentTarget as HTMLElement
                target.classList.toggle('selected')
                if (target.classList.contains('selected')) {
                  target.style.border = '2px solid #409eff'
                } else {
                  target.style.border = '2px solid transparent'
                }
              },
            },
            [h('img', { src: url, style: 'width: 100%; height: 100px; object-fit: cover' })],
          ),
        ),
      ),
    ]),
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
    .then(() => {
      const selectedElements = document.querySelectorAll('.image-selector .image-item.selected')
      const selectedUrls = Array.from(selectedElements)
        .map((el) => el.querySelector('img')?.src)
        .filter((url): url is string => !!url)
        .slice(0, 9)

      if (selectedUrls.length === 0) {
        ElMessage.warning('请至少选择一张图片')
        return
      }

      // 转换为MediaItem（图片已上传，直接使用URL）
      const mediaItems: MediaItem[] = selectedUrls.map((url) => ({
        type: 'image' as const,
        url,
        width: 800,
        height: 600,
      }))

      formData.coverMedia = mediaItems
      ElMessage.success(`已选择 ${mediaItems.length} 张图片作为封面`)
    })
    .catch(() => {
      // 用户取消
    })
}

// 清除封面
const clearCover = () => {
  formData.coverMedia = []
  ElMessage.success('已清除封面，将自动使用文中图片')
}

// 处理图片上传（立即上传到COS）
const handleImageUpload = async (files: File[]) => {
  for (const file of files) {
    try {
      const res = await uploadImage(file, 'note')
      if (res.code === 200 && res.data) {
        const url = res.data.url
        formData.images.push(url)
        // 插入到Markdown中
        formData.content += `\n![图片](${url})\n`
      }
    } catch (error) {
      console.error('上传图片失败:', error)
      ElMessage.error('上传图片失败')
    }
  }
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
    // 提取最终的图片列表
    const images = extractImagesFromContent()

    if (isEdit.value) {
      await noteStore.updateNote({
        id: route.params.id as string,
        title: formData.title,
        content: formData.content,
        coverMedia: formData.coverMedia,
        images,
        visibility: formData.visibility,
      })
    } else {
      await noteStore.createNote({
        title: formData.title,
        content: formData.content,
        coverMedia: formData.coverMedia,
        images,
        visibility: formData.visibility,
      })
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
  min-height: 100vh;
  padding: 40px 20px;

  .note-editor {
    max-width: 920px;
    margin: 0 auto;
    background: #fff;
    border-radius: 8px;
    padding: 60px 80px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

    // 标题输入
    .title-input {
      margin-bottom: 32px;

      :deep(.el-input__wrapper) {
        box-shadow: none;
        padding: 0;
        border: none;
        background: transparent;
      }

      :deep(.el-input__inner) {
        font-size: 32px;
        font-weight: 400;
        line-height: 1.4;
        color: #1f2329;
        padding: 0;

        &::placeholder {
          color: #c8c9cc;
        }
      }
    }

    // 标题行
    .title-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 32px;

      .title-input {
        flex: 1;
        margin-bottom: 0;
      }
    }

    // 编辑器包装
    .editor-wrapper {
      margin-bottom: 40px;
      min-height: 300px;
    }

    // 分区标题
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #1f2329;
      margin-bottom: 16px;
    }

    // 封面设置区域
    .cover-section {
      padding: 24px 0;
      border-top: 1px solid #ebeef5;
      margin-bottom: 24px;

      .cover-tips {
        padding: 12px 16px;
        background: #f7f8fa;
        border-radius: 6px;
        color: #8f959e;
        font-size: 14px;
        margin-bottom: 16px;
      }

      .cover-actions {
        display: flex;
        gap: 16px;
        margin-top: 12px;

        :deep(.el-button) {
          color: #409eff;
          font-size: 14px;
          padding: 0;

          &:hover {
            color: #66b1ff;
          }
        }
      }
    }

    // 可见性设置
    .visibility-section {
      padding: 24px 0;
      border-top: 1px solid #ebeef5;
      margin-bottom: 24px;

      .visibility-radio {
        :deep(.el-radio) {
          margin-right: 24px;
        }
      }
    }

    // 底部操作栏
    .bottom-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 32px;
      border-top: 1px solid #ebeef5;

      .left-actions {
        :deep(.el-button) {
          color: #8f959e;
          font-size: 14px;
          padding: 0;

          &:hover {
            color: #409eff;
          }
        }
      }

      .right-actions {
        display: flex;
        gap: 12px;

        :deep(.el-button) {
          padding: 10px 24px;
          border-radius: 6px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
