<template>
  <div class="ai-title-suggest">
    <el-button
      class="suggest-btn"
      :loading="loading"
      @click="generateTitles"
    >
      <el-icon><MagicStick /></el-icon>
      AI生成标题
    </el-button>

    <!-- 标题建议弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="AI标题建议"
      width="500px"
      :close-on-click-modal="false"
    >
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>AI正在生成标题...</span>
      </div>
      <div v-else-if="titles.length > 0" class="title-list">
        <div
          v-for="(title, index) in titles"
          :key="index"
          class="title-item"
          :class="{ selected: selectedIndex === index }"
          @click="selectedIndex = index"
        >
          <el-icon v-if="selectedIndex === index" class="check-icon"><Check /></el-icon>
          <span>{{ title }}</span>
        </div>
      </div>
      <div v-else class="empty-tip">
        点击上方按钮生成标题建议
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button :disabled="selectedIndex === -1" type="primary" @click="acceptTitle">
            使用此标题
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { MagicStick, Loading, Check } from '@element-plus/icons-vue'
import { generateTitles as generateTitlesApi } from '@/api/ai'

interface Props {
  content: string
}

interface Emits {
  (e: 'select', title: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 状态
const loading = ref(false)
const dialogVisible = ref(false)
const titles = ref<string[]>([])
const selectedIndex = ref(-1)

// 生成标题
const generateTitles = async () => {
  if (!props.content.trim()) {
    ElMessage.warning('请先输入内容')
    return
  }

  loading.value = true
  dialogVisible.value = true
  titles.value = []
  selectedIndex.value = -1

  try {
    const res = await generateTitlesApi(props.content)
    if (res.code === 200) {
      titles.value = res.data.titles
    } else {
      ElMessage.error(res.message || '生成失败')
      dialogVisible.value = false
    }
  } catch (error: any) {
    console.error('生成标题失败:', error)
    ElMessage.error(error.message || 'AI服务暂时不可用')
    dialogVisible.value = false
  } finally {
    loading.value = false
  }
}

// 接受选中的标题
const acceptTitle = () => {
  if (selectedIndex.value >= 0 && titles.value[selectedIndex.value]) {
    emit('select', titles.value[selectedIndex.value])
    dialogVisible.value = false
    ElMessage.success('已应用标题')
  }
}
</script>

<style lang="scss" scoped>
.ai-title-suggest {
  .suggest-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: #fff;

    &:hover {
      background: linear-gradient(135deg, #7b8ced 0%, #8a5fb8 100%);
    }

    .el-icon {
      margin-right: 4px;
    }
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
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

.title-list {
  .title-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    margin-bottom: 8px;
    background: #f7f8fa;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid transparent;

    &:hover {
      background: #f0f9eb;
      border-color: #67c23a;
    }

    &.selected {
      background: #f0f9eb;
      border-color: #67c23a;

      .check-icon {
        color: #67c23a;
      }
    }

    .check-icon {
      margin-right: 8px;
      color: transparent;
    }

    span {
      font-size: 14px;
      color: #303133;
      line-height: 1.5;
    }
  }
}

.empty-tip {
  text-align: center;
  padding: 40px 0;
  color: #909399;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>