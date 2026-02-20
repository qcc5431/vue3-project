<template>
  <div class="waterfall-container" ref="containerRef">
    <div
      class="waterfall-grid"
      :style="{
        position: 'relative',
        height: gridHeight + 'px',
        width: '100%',
      }"
    >
      <div
        v-for="(item, index) in items"
        :key="getItemKey(item)"
        v-show="positions[index]"
        :style="{
          position: 'absolute',
          width: (positions[index]?.width || 0) + 'px',
          transform: `translate(${positions[index]?.left || 0}px, ${positions[index]?.top || 0}px)`,
          transition: 'transform 0.3s ease-in-out',
        }"
        class="waterfall-item"
      >
        <slot :item="item" :index="index" :image-height="positions[index]?.imageHeight || 0" />
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && items.length === 0" class="empty-state">
      <el-empty :description="emptyText" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
interface Position {
  top: number
  left: number
  width: number
  height: number
  imageHeight: number // 图片高度
}

interface Props {
  items: T[]
  loading?: boolean
  hasMore?: boolean
  total?: number
  itemKey?: string
  emptyText?: string
  gap?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  hasMore: false,
  itemKey: 'id',
  emptyText: '暂无数据',
  gap: 20,
})

const emit = defineEmits<{
  loadMore: []
}>()

const containerRef = ref<HTMLElement>()
const positions = ref<Position[]>([])
const cols = ref(4)
const gridHeight = ref(0)

// 获取项目key
const getItemKey = (item: T): string => {
  return String(item[props.itemKey] ?? Math.random())
}

// 计算布局 - 基于截图逻辑
const calculateLayout = () => {
  if (!containerRef.value) return

  // 步骤1: 获取容器宽度
  const containerWidth = containerRef.value.clientWidth

  // 步骤2: 计算列数
  const minColWidth = 220
  const newCols = Math.max(
    2,
    Math.floor((containerWidth - props.gap * 3) / (minColWidth + props.gap)),
  )

  // 步骤3: 如果列数改变，需要重新布局
  if (cols.value !== newCols) {
    cols.value = newCols
    positions.value = []
  }

  // 步骤4: 计算新的列宽
  const newColWidth = (containerWidth - props.gap * (newCols - 1)) / newCols

  // 步骤5: 初始化列高数组
  const columnHeights: number[] = new Array(newCols).fill(0)
  const newPositions: Position[] = []

  props.items.forEach((item) => {
    // 4.1 计算宽高比（后端返回的是 coverImageAspectRatio）
    // coverImageAspectRatio = width / height
    // 如果没有，默认使用 3:4 的比例
    const aspectRatio = (item.coverImageAspectRatio as number) || 0.75
    const height = newColWidth / aspectRatio

    // 4.2 找到最短列
    const minColIndex = columnHeights.indexOf(Math.min(...columnHeights))

    // 4.3 计算位置
    const left = minColIndex * (newColWidth + props.gap)
    const top = columnHeights[minColIndex] ?? 0

    // 4.4 更新列高
    const contentHeight = 120 // padding(32) + title(45) + author(24) + stats(20)
    if (columnHeights[minColIndex] !== undefined) {
      columnHeights[minColIndex] += height + contentHeight + props.gap
    }

    // 4.5 保存位置信息（包含图片高度供 slot 使用）
    newPositions.push({
      top,
      left,
      width: newColWidth,
      height: height + contentHeight,
      imageHeight: Math.round(height),
    })
  })

  positions.value = newPositions
  gridHeight.value = Math.max(0, ...columnHeights.map((h) => h - props.gap))
}

// 监听items变化
watch(
  () => props.items,
  () => {
    nextTick(() => {
      calculateLayout()
    })
  },
  { deep: true, immediate: true },
)

// 初始化
onMounted(() => {
  calculateLayout()

  // 监听resize
  const resizeObserver = new ResizeObserver(calculateLayout)
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }

  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})

// 监听滚动加载更多
onMounted(() => {
  // 监听 layout-body 的滚动（向上查找滚动容器）
  const findScrollContainer = (el: HTMLElement | null): HTMLElement | null => {
    if (!el || el === document.body) return null
    const overflowY = window.getComputedStyle(el).overflowY
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return el
    }
    return findScrollContainer(el.parentElement)
  }

  const scrollContainer = findScrollContainer(containerRef.value || null)
  if (!scrollContainer) return

  const handleScroll = () => {
    const container = containerRef.value
    if (!container) return

    // 使用 getBoundingClientRect 计算元素底部距离视口的距离
    const rect = container.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const bottomDistance = rect.bottom - windowHeight

    // 距离底部500px时触发加载
    if (bottomDistance < 500 && props.hasMore && !props.loading) {
      emit('loadMore')
    }
  }

  scrollContainer.addEventListener('scroll', handleScroll)

  onUnmounted(() => {
    scrollContainer?.removeEventListener('scroll', handleScroll)
  })
})
</script>

<style lang="scss" scoped>
.waterfall-container {
  position: relative;
  width: 100%;
}

.waterfall-grid {
  position: relative;
  width: 100%;
}

.waterfall-item {
  position: absolute;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}
</style>
