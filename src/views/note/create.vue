<template>
  <div class="create-note-page">
    <div class="note-editor">
      <!-- 标题输入 -->
      <el-input
        v-model="formData.title"
        placeholder="请输入标题"
        class="title-input"
        maxlength="100"
      />

      <!-- Markdown编辑器 -->
      <div class="editor-wrapper">
        <MarkdownEditor v-model="formData.content" @upload-image="handleImageUpload" />
      </div>

      <!-- 封面设置区域 -->
      <div class="cover-section">
        <div class="section-title">封面设置</div>
        <div v-if="formData.coverMedia.length > 0" class="cover-preview">
          <div class="preview-grid">
            <div v-for="(media, index) in formData.coverMedia" :key="index" class="preview-item">
              <img v-if="media.type === 'image'" :src="media.url" alt="封面" />
              <video v-else :src="media.url" />
              <div class="remove-btn" @click="removeCoverMedia(index)">
                <el-icon><Close /></el-icon>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="cover-tips">未设置封面，将自动使用文中前3张图片</div>
        <div class="cover-actions">
          <el-button text @click="selectFromContent">
            <el-icon><Picture /></el-icon>
            从文中选择
          </el-button>
          <el-button text @click="uploadCover">
            <el-icon><Upload /></el-icon>
            本地上传
          </el-button>
          <el-button v-if="formData.coverMedia.length > 0" text @click="clearCover">
            清除封面
          </el-button>
        </div>
        <input
          ref="coverInput"
          type="file"
          accept="image/*,video/*"
          multiple
          style="display: none"
          @change="handleCoverUpload"
        />
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

      .cover-preview {
        margin-bottom: 16px;

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 12px;

          .preview-item {
            position: relative;
            width: 100%;
            aspect-ratio: 1;
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid #e5e6eb;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
              border-color: #409eff;
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);

              .remove-btn {
                opacity: 1;
              }
            }

            img,
            video {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .remove-btn {
              position: absolute;
              top: 6px;
              right: 6px;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: rgba(0, 0, 0, 0.6);
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              opacity: 0;
              transition: all 0.2s;
              font-size: 14px;

              &:hover {
                background: rgba(0, 0, 0, 0.8);
              }
            }
          }
        }
      }

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
