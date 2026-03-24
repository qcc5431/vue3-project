<template>
  <div class="ai-toolbar">
    <!-- AI功能按钮 -->
    <el-dropdown trigger="click" @command="handleAICommand">
      <button class="toolbar-btn ai-btn" title="AI助手">
        <el-icon><MagicStick /></el-icon>
        <span>AI</span>
      </button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="optimize-selection" :disabled="!hasSelection">
            <el-icon><Edit /></el-icon>
            优化选中文本
          </el-dropdown-item>
          <el-dropdown-item command="optimize-all">
            <el-icon><Document /></el-icon>
            优化全文
          </el-dropdown-item>
          <el-dropdown-item command="expand-content">
            <el-icon><Plus /></el-icon>
            扩展内容
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 优化预览对话框 -->
    <el-dialog
      v-model="optimizeDialogVisible"
      title="AI文案优化"
      width="80%"
      :close-on-click-modal="false"
    >
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>AI正在优化中，请稍候...</span>
      </div>
      <div v-else class="optimize-preview">
        <div class="preview-column">
          <div class="column-title">原文</div>
          <div class="column-content original">{{ originalContent }}</div>
        </div>
        <div class="preview-column">
          <div class="column-title">优化后</div>
          <div class="column-content optimized">{{ optimizedContent }}</div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="optimizeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="acceptOptimization">接受优化</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 扩展内容对话框 -->
    <el-dialog
      v-model="expandDialogVisible"
      title="AI内容扩展"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="expand-form">
        <el-input
          v-model="expandTopic"
          placeholder="可选：输入扩展主题（如：美食推荐、交通攻略）"
          style="margin-bottom: 16px"
        />
      </div>
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>AI正在扩展中，请稍候...</span>
      </div>
      <div v-else-if="expandedContent" class="optimize-preview">
        <div class="preview-column">
          <div class="column-title">原文</div>
          <div class="column-content original">{{ originalContent }}</div>
        </div>
        <div class="preview-column">
          <div class="column-title">扩展后</div>
          <div class="column-content optimized">{{ expandedContent }}</div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="expandDialogVisible = false">取消</el-button>
          <el-button :loading="loading" @click="doExpand">开始扩展</el-button>
          <el-button v-if="expandedContent" type="primary" @click="acceptExpansion">接受扩展</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { MagicStick, Edit, Document, Plus, Loading } from '@element-plus/icons-vue'
import { optimizeContent, expandContent } from '@/api/ai'

interface Props {
  content: string
  selectedText?: string
}

interface Emits {
  (e: 'update:content', value: string): void
  (e: 'replace-selection', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 状态
const loading = ref(false)
const optimizeDialogVisible = ref(false)
const expandDialogVisible = ref(false)
const originalContent = ref('')
const optimizedContent = ref('')
const expandedContent = ref('')
const expandTopic = ref('')
const currentMode = ref<'selection' | 'all'>('all')

// 计算属性
const hasSelection = computed(() => {
  return props.selectedText && props.selectedText.trim().length > 0
})

// 处理AI命令
const handleAICommand = (command: string) => {
  switch (command) {
    case 'optimize-selection':
      currentMode.value = 'selection'
      doOptimize(props.selectedText || props.content)
      break
    case 'optimize-all':
      currentMode.value = 'all'
      doOptimize(props.content)
      break
    case 'expand-content':
      originalContent.value = props.content
      expandTopic.value = ''
      expandedContent.value = ''
      expandDialogVisible.value = true
      break
  }
}

// 执行优化
const doOptimize = async (content: string) => {
  if (!content.trim()) {
    ElMessage.warning('内容为空，无法优化')
    return
  }

  loading.value = true
  originalContent.value = content
  optimizedContent.value = ''
  optimizeDialogVisible.value = true

  try {
    const res = await optimizeContent(content)
    if (res.code === 200) {
      optimizedContent.value = res.data.optimizedContent
    } else {
      ElMessage.error(res.message || '优化失败')
      optimizeDialogVisible.value = false
    }
  } catch (error: any) {
    console.error('优化失败:', error)
    ElMessage.error(error.message || 'AI服务暂时不可用')
    optimizeDialogVisible.value = false
  } finally {
    loading.value = false
  }
}

// 执行扩展
const doExpand = async () => {
  if (!originalContent.value.trim()) {
    ElMessage.warning('内容为空，无法扩展')
    return
  }

  loading.value = true
  try {
    const res = await expandContent(originalContent.value, expandTopic.value || undefined)
    if (res.code === 200) {
      expandedContent.value = res.data.expandedContent
    } else {
      ElMessage.error(res.message || '扩展失败')
    }
  } catch (error: any) {
    console.error('扩展失败:', error)
    ElMessage.error(error.message || 'AI服务暂时不可用')
  } finally {
    loading.value = false
  }
}

// 接受优化结果
const acceptOptimization = () => {
  if (currentMode.value === 'selection' && props.selectedText) {
    emit('replace-selection', optimizedContent.value)
  } else {
    emit('update:content', optimizedContent.value)
  }
  optimizeDialogVisible.value = false
  ElMessage.success('已应用优化结果')
}

// 接受扩展结果
const acceptExpansion = () => {
  emit('update:content', expandedContent.value)
  expandDialogVisible.value = false
  ElMessage.success('已应用扩展结果')
}
</script>

<style lang="scss" scoped>
.ai-toolbar {
  display: inline-flex;

  .toolbar-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 8px;
    height: 32px;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 4px;
    cursor: pointer;
    color: #fff;
    font-size: 14px;
    transition: all 0.2s;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .el-icon {
      font-size: 16px;
    }
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #409eff;

  .el-icon {
    font-size: 32px;
    margin-bottom: 12px;
  }

  span {
    font-size: 14px;
    color: #666;
  }
}

.optimize-preview {
  display: flex;
  gap: 24px;
  min-height: 300px;

  .preview-column {
    flex: 1;

    .column-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #409eff;
    }

    .column-content {
      padding: 16px;
      background: #f7f8fa;
      border-radius: 8px;
      min-height: 250px;
      max-height: 400px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 14px;
      line-height: 1.8;
      color: #303133;

      &.optimized {
        background: #f0f9eb;
      }
    }
  }
}

.expand-form {
  margin-bottom: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>