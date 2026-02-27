<template>
  <div class="markdown-editor">
    <!-- 工具栏 -->
    <div class="editor-toolbar">
      <el-button-group>
        <el-button size="small" @click="insertBold">加粗</el-button>
        <el-button size="small" @click="insertItalic">斜体</el-button>
        <el-button size="small" @click="insertStrikethrough">删除线</el-button>
      </el-button-group>

      <el-button-group>
        <el-button size="small" @click="insertHeading">标题</el-button>
        <el-button size="small" @click="insertList">列表</el-button>
        <el-button size="small" @click="insertOrderedList">有序列表</el-button>
        <el-button size="small" @click="insertTaskList">任务列表</el-button>
      </el-button-group>

      <el-button-group>
        <el-button size="small" @click="insertCodeBlock">代码块</el-button>
        <el-button size="small" @click="insertTable">表格</el-button>
        <el-button size="small" @click="insertQuote">引用</el-button>
        <el-button size="small" @click="insertDivider">分割线</el-button>
      </el-button-group>

      <el-button-group>
        <el-button size="small" @click="insertLink">链接</el-button>
        <el-button size="small" @click="triggerImageUpload">
          <el-icon><Picture /></el-icon>
          图片
        </el-button>
      </el-button-group>

      <EmojiPicker @select="insertEmoji" />

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
      />
      <div v-if="showPreview" class="preview-pane">
        <MarkdownPreview :content="content" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Picture } from '@element-plus/icons-vue'
import EmojiPicker from './EmojiPicker.vue'
import MarkdownPreview from './MarkdownPreview.vue'

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

// 插入任务列表
const insertTaskList = () => {
  insertText('- [ ] 任务1\n- [ ] 任务2\n- [x] 已完成任务\n\n')
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
    align-items: center;

    .toolbar-right {
      margin-left: auto;
    }
  }

  .editor-container {
    display: flex;

    &.split-view {
      .editor-textarea {
        width: 50%;
        border-right: 1px solid #dcdfe6;
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
      }
    }
  }
}
</style>
