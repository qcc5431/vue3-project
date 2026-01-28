<template>
  <div class="markdown-editor">
    <!-- 工具栏 -->
    <div class="editor-toolbar">
      <el-button size="small" @click="insertBold">加粗</el-button>
      <el-button size="small" @click="insertItalic">斜体</el-button>
      <el-button size="small" @click="insertHeading">标题</el-button>
      <el-button size="small" @click="insertList">列表</el-button>
      <el-button size="small" @click="insertLink">链接</el-button>
      <el-button size="small" @click="triggerImageUpload">
        <el-icon><Picture /></el-icon>
        插入图片
      </el-button>
      <input
        ref="imageInput"
        type="file"
        accept="image/*"
        multiple
        style="display: none"
        @change="handleImageUpload"
      />
    </div>

    <!-- 编辑器 -->
    <el-input
      v-model="content"
      type="textarea"
      :rows="rows"
      :placeholder="placeholder"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
import { Picture } from '@element-plus/icons-vue'

interface Props {
  modelValue: string
  rows?: number
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'upload-image', files: File[]): void
}

const props = withDefaults(defineProps<Props>(), {
  rows: 15,
  placeholder: '请输入内容，支持Markdown语法...',
})

const emit = defineEmits<Emits>()

const content = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const imageInput = ref<HTMLInputElement>()

// 插入加粗
const insertBold = () => {
  insertText('**加粗文字**')
}

// 插入斜体
const insertItalic = () => {
  insertText('*斜体文字*')
}

// 插入标题
const insertHeading = () => {
  insertText('## 标题\n\n')
}

// 插入列表
const insertList = () => {
  insertText('- 列表项1\n- 列表项2\n- 列表项3\n\n')
}

// 插入链接
const insertLink = () => {
  insertText('[链接文字](链接地址)')
}

// 插入文本
const insertText = (text: string) => {
  content.value += text
}

// 触发图片上传
const triggerImageUpload = () => {
  imageInput.value?.click()
}

// 处理图片上传
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])

  if (files.length > 0) {
    emit('upload-image', files)
  }

  // 清空input，以便可以重复选择同一文件
  target.value = ''
}

// 处理输入
const handleInput = () => {
  // 可以在这里添加实时预览等功能
}
</script>

<style lang="scss" scoped>
.markdown-editor {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;

  .editor-toolbar {
    padding: 8px;
    background: #f5f7fa;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  :deep(.el-textarea__inner) {
    border: none;
    border-radius: 0;
    box-shadow: none;
    resize: vertical;
  }
}
</style>
