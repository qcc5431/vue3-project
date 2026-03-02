<template>
  <div class="markdown-preview">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else class="markdown-body" v-html="renderedHtml"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  content: string
}

const props = defineProps<Props>()

const loading = ref(false)
const renderedHtml = ref('')

// 简单的Markdown渲染（临时方案，等安装marked库后替换）
const renderMarkdown = (markdown: string): string => {
  let html = markdown

  // 转义HTML标签
  html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // 标题
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  // 粗体
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // 斜体
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // 图片（必须在链接之前处理）
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')

  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')

  // 列表
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

  // 换行
  html = html.replace(/\n/g, '<br />')

  return html
}

// 监听内容变化
watch(
  () => props.content,
  (newContent) => {
    loading.value = true
    renderedHtml.value = renderMarkdown(newContent)
    loading.value = false
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.markdown-preview {
  padding: 3px 0;
  background: #fff;
  // border: 1px solid #dcdfe6;
  border-radius: 4px;
  min-height: 200px;

  .loading {
    text-align: center;
    padding: 32px;
    color: #999;
  }

  .markdown-body {
    line-height: 1.8;
    color: #333;

    :deep(h1) {
      font-size: 28px;
      font-weight: 600;
      margin: 24px 0 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #eee;
    }

    :deep(h2) {
      font-size: 24px;
      font-weight: 600;
      margin: 20px 0 12px;
    }

    :deep(h3) {
      font-size: 20px;
      font-weight: 600;
      margin: 16px 0 12px;
    }

    :deep(p) {
      margin: 12px 0;
    }

    :deep(strong) {
      font-weight: 600;
      color: #000;
    }

    :deep(em) {
      font-style: italic;
    }

    :deep(a) {
      color: #409eff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      margin: 12px 0;
    }

    :deep(ul) {
      margin: 12px 0;
      padding-left: 24px;

      li {
        margin: 8px 0;
      }
    }

    :deep(code) {
      background: #f5f7fa;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 14px;
    }
  }
}
</style>
