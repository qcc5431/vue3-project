<template>
  <div class="media-uploader">
    <draggable
      v-model="mediaList"
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

    <div v-if="mediaList.length < maxCount" class="upload-btn" @click="triggerUpload">
      <el-icon class="upload-icon"><Plus /></el-icon>
      <span>添加图片/视频</span>
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
import { Close, Plus } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import type { MediaItem } from '@/api/types/note'
import { getImageSize, getVideoMetadata } from '@/utils/mediaHelper'

interface Props {
  modelValue: MediaItem[]
  maxCount?: number
}

interface Emits {
  (e: 'update:modelValue', value: MediaItem[]): void
}

const props = withDefaults(defineProps<Props>(), {
  maxCount: 9,
})

const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement>()
const mediaList = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])

  if (files.length === 0) return

  if (mediaList.value.length + files.length > props.maxCount) {
    ElMessage.warning(`最多只能上传 ${props.maxCount} 个文件`)
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

  mediaList.value = [...mediaList.value, ...newMediaItems]
  target.value = ''
}

const removeMedia = (index: number) => {
  const item = mediaList.value[index]
  if (item) {
    URL.revokeObjectURL(item.url)
  }
  mediaList.value = mediaList.value.filter((_, i) => i !== index)
}

const handleDragEnd = () => {
  emit('update:modelValue', mediaList.value)
}

const formatDuration = (duration?: number): string => {
  if (!duration) return '00:00'
  const minutes = Math.floor(duration / 60)
  const seconds = Math.floor(duration % 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

onBeforeUnmount(() => {
  mediaList.value.forEach((item) => {
    URL.revokeObjectURL(item.url)
  })
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
