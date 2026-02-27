<template>
  <div class="create-note-page">
    <el-card>
      <div class="note-editor">
        <h2 class="page-title">{{ isEdit ? '编辑笔记' : '创建笔记' }}</h2>

        <el-form :model="formData" label-width="80px">
          <!-- 标题 -->
          <el-form-item label="标题">
            <el-input
              v-model="formData.title"
              placeholder="请输入笔记标题"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>

          <!-- Markdown编辑器 -->
          <el-form-item label="内容">
            <MarkdownEditor v-model="formData.content" @upload-image="handleImageUpload" />
          </el-form-item>

          <!-- 封面设置 -->
          <el-form-item label="封面设置">
            <div class="cover-setting">
              <div v-if="formData.coverMedia.length > 0" class="cover-preview">
                <div class="preview-grid">
                  <div
                    v-for="(media, index) in formData.coverMedia"
                    :key="index"
                    class="preview-item"
                  >
                    <img v-if="media.type === 'image'" :src="media.url" alt="封面" />
                    <video v-else :src="media.url" />
                    <el-button
                      class="remove-btn"
                      circle
                      size="small"
                      @click="removeCoverMedia(index)"
                    >
                      <el-icon><Close /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>
              <div v-else class="cover-tips">
                <el-text type="info" size="small">未设置封面，将自动使用文中前3张图片</el-text>
              </div>
              <div class="cover-actions">
                <el-button size="small" @click="selectFromContent">
                  <el-icon><Picture /></el-icon>
                  从文中选择
                </el-button>
                <el-button size="small" @click="uploadCover">
                  <el-icon><Upload /></el-icon>
                  从本地上传
                </el-button>
                <el-button v-if="formData.coverMedia.length > 0" size="small" @click="clearCover">
                  清除封面
                </el-button>
              </div>
            </div>
            <input
              ref="coverInput"
              type="file"
              accept="image/*,video/*"
              multiple
              style="display: none"
              @change="handleCoverUpload"
            />
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
            <input
              ref="markdownInput"
              type="file"
              accept=".md"
              style="display: none"
              @change="handleMarkdownImport"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Upload, Picture, Close } from '@element-plus/icons-vue'
import { useNoteStore } from '@/store/modules/note'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import type { MediaItem } from '@/api/types/note'
import { getImageSize, getVideoMetadata } from '@/utils/mediaHelper'

const router = useRouter()
const route = useRoute()
const noteStore = useNoteStore()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)

const markdownInput = ref<HTMLInputElement>()
const coverInput = ref<HTMLInputElement>()

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
    .then(async () => {
      const selectedElements = document.querySelectorAll('.image-selector .image-item.selected')
      const selectedUrls = Array.from(selectedElements)
        .map((el) => el.querySelector('img')?.src)
        .filter((url): url is string => !!url)
        .slice(0, 9)

      if (selectedUrls.length === 0) {
        ElMessage.warning('请至少选择一张图片')
        return
      }

      // 转换为MediaItem
      const mediaItems: MediaItem[] = []
      for (const url of selectedUrls) {
        try {
          // 简化处理：直接使用默认尺寸，实际应该获取真实尺寸
          mediaItems.push({
            type: 'image',
            url,
            width: 800,
            height: 600,
          })
        } catch (error) {
          console.error('处理图片失败:', error)
        }
      }

      formData.coverMedia = mediaItems
      ElMessage.success(`已选择 ${mediaItems.length} 张图片作为封面`)
    })
    .catch(() => {
      // 用户取消
    })
}

// 从本地上传封面
const uploadCover = () => {
  coverInput.value?.click()
}

// 处理封面上传
const handleCoverUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])

  if (files.length === 0) return

  if (formData.coverMedia.length + files.length > 9) {
    ElMessage.warning('封面最多9张图片/视频')
    target.value = ''
    return
  }

  const newMediaItems: MediaItem[] = []

  for (const file of files) {
    try {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')

      if (!isImage && !isVideo) {
        ElMessage.warning(`文件 ${file.name} 格式不支持`)
        continue
      }

      const url = URL.createObjectURL(file)

      if (isImage) {
        const { width, height } = await getImageSize(file)
        newMediaItems.push({
          type: 'image',
          url,
          width,
          height,
        })
      } else if (isVideo) {
        const { width, height, duration } = await getVideoMetadata(file)
        newMediaItems.push({
          type: 'video',
          url,
          width,
          height,
          duration,
        })
      }
    } catch (error) {
      console.error('处理文件失败:', error)
      ElMessage.error(`处理文件 ${file.name} 失败`)
    }
  }

  formData.coverMedia = [...formData.coverMedia, ...newMediaItems]
  target.value = ''
}

// 移除封面媒体
const removeCoverMedia = (index: number) => {
  const item = formData.coverMedia[index]
  if (item) {
    URL.revokeObjectURL(item.url)
  }
  formData.coverMedia = formData.coverMedia.filter((_, i) => i !== index)
}

// 清除封面
const clearCover = () => {
  formData.coverMedia.forEach((item) => {
    URL.revokeObjectURL(item.url)
  })
  formData.coverMedia = []
  ElMessage.success('已清除封面，将自动使用文中图片')
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

  .cover-setting {
    width: 100%;

    .cover-preview {
      margin-bottom: 12px;

      .preview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 12px;

        .preview-item {
          position: relative;
          width: 100%;
          height: 120px;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #ddd;

          img,
          video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .remove-btn {
            position: absolute;
            top: 4px;
            right: 4px;
            background-color: rgba(0, 0, 0, 0.5);
            border: none;
            color: #fff;

            &:hover {
              background-color: rgba(0, 0, 0, 0.7);
            }
          }
        }
      }
    }

    .cover-tips {
      padding: 12px;
      background-color: #f0f9ff;
      border-radius: 4px;
      margin-bottom: 12px;
    }

    .cover-actions {
      display: flex;
      gap: 8px;
    }
  }

  .image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .upload-tips {
    margin-top: 8px;
  }
}
</style>
