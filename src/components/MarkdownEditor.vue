<template>
  <div class="markdown-editor">
    <!-- 工具栏 -->
    <div class="editor-toolbar">
      <button class="toolbar-btn" title="加粗" @click="insertBold">
        <strong>B</strong>
      </button>
      <button class="toolbar-btn" title="斜体" @click="insertItalic">
        <em>I</em>
      </button>
      <button class="toolbar-btn" title="删除线" @click="insertStrikethrough">
        <s>S</s>
      </button>

      <div class="toolbar-divider"></div>

      <button class="toolbar-btn" title="标题" @click="insertHeading">
        <span style="font-weight: 600">H</span>
      </button>
      <button class="toolbar-btn" title="无序列表" @click="insertList">
        <el-icon><List /></el-icon>
      </button>
      <button class="toolbar-btn" title="有序列表" @click="insertOrderedList">
        <el-icon><Ticket /></el-icon>
      </button>

      <div class="toolbar-divider"></div>

      <button class="toolbar-btn" title="代码块" @click="insertCodeBlock">
        <el-icon><Document /></el-icon>
      </button>
      <button class="toolbar-btn" title="表格" @click="insertTable">
        <el-icon><Grid /></el-icon>
      </button>
      <button class="toolbar-btn" title="引用" @click="insertQuote">
        <el-icon><ChatDotRound /></el-icon>
      </button>
      <button class="toolbar-btn" title="分割线" @click="insertDivider">
        <el-icon><Minus /></el-icon>
      </button>

      <div class="toolbar-divider"></div>

      <button class="toolbar-btn" title="链接" @click="insertLink">
        <el-icon><Link /></el-icon>
      </button>
      <button class="toolbar-btn" title="图片" @click="triggerImageUpload">
        <el-icon><Picture /></el-icon>
      </button>

      <EmojiPicker @select="insertEmoji" />

      <!-- AI助手 -->
      <AIToolbar
        :content="content"
        :selected-text="selectedText"
        @update:content="content = $event"
        @replace-selection="replaceSelection"
      />

      <div class="toolbar-right">
        <el-switch v-model="showPreview" active-text="预览" size="small" />
      </div>

      <input
        ref="imageInput"
        type="file"
        accept="image/*"
        multiple
        style="display: none"
        @change="handleImageUpload"
      />
    </div>

    <!-- 编辑器容器 -->
    <div class="editor-container" :class="{ 'split-view': showPreview }">
      <el-input
        ref="textareaRef"
        v-model="content"
        type="textarea"
        :rows="rows"
        :placeholder="placeholder"
        class="editor-textarea"
        @input="handleInput"
        @select="handleSelectionChange"
      />
      <div v-if="showPreview" class="preview-pane">
        <MarkdownPreview :content="content" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Picture,
  List,
  Ticket,
  Document,
  Grid,
  ChatDotRound,
  Minus,
  Link,
} from '@element-plus/icons-vue'
import EmojiPicker from './EmojiPicker.vue'
import MarkdownPreview from './MarkdownPreview.vue'
import { AIToolbar } from './AIAssistant'

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
const textareaRef = ref()
const showPreview = ref(false)
const selectedText = ref('')

// 获取选中的文本
const getSelectedText = () => {
  const textarea = textareaRef.value?.$el?.querySelector('textarea')
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    selectedText.value = content.value.substring(start, end)
  }
  return selectedText.value
}

// 替换选中的文本
const replaceSelection = (newText: string) => {
  const textarea = textareaRef.value?.$el?.querySelector('textarea')
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    content.value = content.value.substring(0, start) + newText + content.value.substring(end)
    // 设置光标位置
    nextTick(() => {
      textarea.focus()
      textarea.setSelectionRange(start + newText.length, start + newText.length)
    })
  }
}

// 监听选择变化
const handleSelectionChange = () => {
  getSelectedText()
}

// 插入加粗
const insertBold = () => {
  insertText('**加粗文字**')
}

// 插入斜体
const insertItalic = () => {
  insertText('*斜体文字*')
}

// 插入删除线
const insertStrikethrough = () => {
  insertText('~~删除线文字~~')
}

// 插入标题
const insertHeading = () => {
  insertText('## 标题\n\n')
}

// 插入无序列表
const insertList = () => {
  insertText('- 列表项1\n- 列表项2\n- 列表项3\n\n')
}

// 插入有序列表
const insertOrderedList = () => {
  insertText('1. 列表项1\n2. 列表项2\n3. 列表项3\n\n')
}

// 插入代码块
const insertCodeBlock = async () => {
  try {
    const { value: language } = await ElMessageBox.prompt('请输入语言类型', '插入代码块', {
      inputValue: 'javascript',
      inputPlaceholder: '如：javascript, python, html',
    })
    insertText(`\`\`\`${language || ''}
// 在此输入代码
\`\`\`

`)
  } catch {
    // 用户取消
  }
}

// 插入表格
const insertTable = () => {
  insertText(
    '| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 单元格1 | 单元格2 | 单元格3 |\n| 单元格4 | 单元格5 | 单元格6 |\n\n',
  )
}

// 插入引用
const insertQuote = () => {
  insertText('> 引用内容\n\n')
}

// 插入分割线
const insertDivider = () => {
  insertText('---\n\n')
}

// 插入链接
const insertLink = () => {
  insertText('[链接文字](链接地址)')
}

// 插入表情
const insertEmoji = (emoji: string) => {
  insertText(emoji)
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

  target.value = ''
}

// 处理输入
const handleInput = () => {
  // 实时预览更新
}

// 处理粘贴事件（支持截图粘贴）
const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (!items) return

  const imageFiles: File[] = []

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        imageFiles.push(file)
      }
    }
  }

  if (imageFiles.length > 0) {
    event.preventDefault()
    emit('upload-image', imageFiles)
  }
}

// 监听textarea的paste事件
onMounted(() => {
  const textarea = textareaRef.value?.$el?.querySelector('textarea')
  if (textarea) {
    textarea.addEventListener('paste', handlePaste)
    textarea.addEventListener('select', handleSelectionChange)
    textarea.addEventListener('mouseup', handleSelectionChange)
    textarea.addEventListener('keyup', handleSelectionChange)
  }
})

onUnmounted(() => {
  const textarea = textareaRef.value?.$el?.querySelector('textarea')
  if (textarea) {
    textarea.removeEventListener('paste', handlePaste)
    textarea.removeEventListener('select', handleSelectionChange)
    textarea.removeEventListener('mouseup', handleSelectionChange)
    textarea.removeEventListener('keyup', handleSelectionChange)
  }
})
</script>

<style lang="scss" scoped>
.markdown-editor {
  border: none;

  .editor-toolbar {
    padding: 12px 0;
    border-bottom: 1px solid #e5e6eb;
    display: flex;
    gap: 4px;
    align-items: center;

    .toolbar-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #515767;
      font-size: 16px;
      transition: all 0.2s;

      &:hover {
        background: #f7f8fa;
        color: #409eff;
      }

      strong,
      em,
      s {
        font-size: 14px;
        font-weight: 600;
      }
    }

    .toolbar-divider {
      width: 1px;
      height: 20px;
      background: #e5e6eb;
      margin: 0 8px;
    }

    .toolbar-right {
      margin-left: auto;
    }
  }

  .editor-container {
    display: flex;
    margin-top: 16px;

    &.split-view {
      .editor-textarea {
        width: 50%;
        border-right: 1px solid #e5e6eb;
      }

      .preview-pane {
        width: 50%;
        padding: 16px;
        overflow-y: auto;
        max-height: 600px;
        background: #fff;
      }
    }

    .editor-textarea {
      width: 100%;

      :deep(.el-textarea__inner) {
        border: none;
        border-radius: 0;
        box-shadow: none;
        resize: vertical;
        padding: 16px 0;
        font-size: 15px;
        line-height: 1.8;
        color: #1f2329;
        background: transparent;

        &::placeholder {
          color: #c8c9cc;
        }

        &:focus {
          outline: none;
        }
      }
    }
  }
}
</style>
