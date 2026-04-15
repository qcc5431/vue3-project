<template>
  <div class="media-uploader">
    <draggable
      v-model="displayList"
      item-key="id"
      class="media-grid"
      :animation="200"
      @end="handleDragEnd"
    >
      <template #item="{ element, index }">
        <div class="media-item">
          <img v-if="element.type === 'image'" :src="element.url" alt="media" />
          <video v-else :src="element.url" />
          <span class="media-index">{{ index + 1 }}</span>
          <el-button class="remove-btn" circle size="small" @click="removeMedia(index)">
            <el-icon><Close /></el-icon>
          </el-button>
          <div v-if="element.type === 'video'" class="video-duration">
            {{ formatDuration(element.duration) }}
          </div>
        </div>
      </template>
    </draggable>

    <div v-if="modelValue.length < maxCount" class="upload-btn" :class="{ 'is-loading': uploading }" @click="triggerUpload">
      <el-icon v-if="!uploading" class="upload-icon"><Plus /></el-icon>
      <el-icon v-else class="is-loading"><Loading /></el-icon>
      <span>{{ uploading ? '上传中...' : '添加图片/视频' }}</span>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*,video/*"
      multiple
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { Close, Plus, Loading } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import type { MediaItem } from '@/api/types/note'
import { getImageSize, getVideoMetadata } from '@/utils/mediaHelper'

// 自定义上传函数类型
type UploadFunction = (file: File) => Promise<MediaItem | null>

interface Props {
  modelValue: MediaItem[]
  maxCount?: number
  uploadFn?: UploadFunction // 自定义上传函数，若提供则使用远程上传
  loading?: boolean // 外部加载状态
}

interface Emits {
  (e: 'update:modelValue', value: MediaItem[]): void
  (e: 'update:loading', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  maxCount: 9,
})

const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement>()
const uploading = ref(false)

// 内部维护一个用于展示的列表，URL 可能是本地 blob 或远程 URL
const displayList = ref<{ id: string; url: string; type: 'image' | 'video'; duration?: number }[]>([])

// 初始化 displayList
watch(
  () => props.modelValue,
  (list) => {
    displayList.value = list.map((item, index) => ({
      id: `${item.type}-${item.url}-${index}`,
      url: item.url,
      type: item.type,
      duration: item.duration,
    }))
  },
  { immediate: true }
)

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])

  if (files.length === 0) return

  if (props.modelValue.length + files.length > props.maxCount) {
    ElMessage.warning(`最多只能上传 ${props.maxCount} 个文件`)
    target.value = ''
    return
  }

  uploading.value = true
  emit('update:loading', true)

  const newMediaItems: MediaItem[] = []

  for (const file of files) {
    try {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')

      if (!isImage && !isVideo) {
        ElMessage.warning(`文件 ${file.name} 格式不支持`)
        continue
      }

      if (props.uploadFn) {
        // 使用自定义上传函数（远程上传）
        const result = await props.uploadFn(file)
        if (result) {
          newMediaItems.push(result)
        }
      } else {
        // 本地模式：创建 blob URL
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
      }
    } catch (error) {
      console.error('处理文件失败:', error)
      ElMessage.error(`处理文件 ${file.name} 失败`)
    }
  }

  if (newMediaItems.length > 0) {
    emit('update:modelValue', [...props.modelValue, ...newMediaItems])
    ElMessage.success(`已添加 ${newMediaItems.length} 个文件`)
  }

  uploading.value = false
  emit('update:loading', false)
  target.value = ''
}

const removeMedia = (index: number) => {
  const newList = props.modelValue.filter((_, i) => i !== index)
  emit('update:modelValue', newList)
}

const handleDragEnd = () => {
  // 根据拖拽后的 displayList 顺序重新排列 modelValue
  const newOrder = displayList.value.map((item) => {
    return props.modelValue.find((m) => m.url === item.url)!
  }).filter(Boolean)
  emit('update:modelValue', newOrder)
}

const formatDuration = (duration?: number): string => {
  if (!duration) return '00:00'
  const minutes = Math.floor(duration / 60)
  const seconds = Math.floor(duration % 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

onBeforeUnmount(() => {
  // 只有本地模式下才需要清理 blob URL
  if (!props.uploadFn) {
    props.modelValue.forEach((item) => {
      if (item.url.startsWith('blob:')) {
        URL.revokeObjectURL(item.url)
      }
    })
  }
})
</script>

<style lang="scss" scoped>
.media-uploader {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  .media-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
  }

  .media-item {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #dcdfe6;
    cursor: move;

    img,
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .media-index {
      position: absolute;
      top: 4px;
      left: 4px;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .remove-btn {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(0, 0, 0, 0.6);
      border: none;
      color: #fff;

      &:hover {
        background: rgba(0, 0, 0, 0.8);
      }
    }

    .video-duration {
      position: absolute;
      bottom: 4px;
      right: 4px;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      font-size: 11px;
      padding: 2px 4px;
      border-radius: 3px;
    }
  }

  .upload-btn {
    width: 120px;
    height: 120px;
    border: 1px dashed #dcdfe6;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    color: #8c939d;

    &:hover {
      border-color: #409eff;
      color: #409eff;
    }

    &.is-loading {
      cursor: not-allowed;
      pointer-events: none;
      color: #c0c4cc;
    }

    .upload-icon {
      font-size: 28px;
      margin-bottom: 8px;
    }

    span {
      font-size: 12px;
    }
  }
}
</style>
