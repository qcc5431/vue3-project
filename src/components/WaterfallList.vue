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
          transition: 'transform 0.3s ease-in-out, opacity 0.5s ease-out',
          opacity: itemOpacity[index] ? 1 : 0,
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
const itemOpacity = ref<Record<number, boolean>>({})
const isInitialLoad = ref(true) // 标记是否是初次加载

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
    // 4.1 从 coverMedia 中获取第一张封面的宽高比
    // coverMedia[0] 有 width 和 height 字段
    const coverMedia = (item.coverMedia as Array<{ width: number; height: number }>) || []
    const firstCover = coverMedia[0]
    const aspectRatio =
      firstCover && firstCover.width && firstCover.height
        ? firstCover.width / firstCover.height
        : 0.75

    // 4.2 根据宽高比判断使用竖版还是横版卡片
    // 宽高比 < 1 表示高度大于宽度，使用竖版
    // 宽高比 >= 1 表示宽度大于等于高度，使用横版
    const isVertical = aspectRatio < 1
    const imageHeight = isVertical ? Math.round(newColWidth * 1.33) : Math.round(newColWidth * 0.56) // 竖版 4:3, 横版 16:9

    // 4.3 找到最短列
    const minColIndex = columnHeights.indexOf(Math.min(...columnHeights))

    // 4.4 计算位置
    const left = minColIndex * (newColWidth + props.gap)
    const top = columnHeights[minColIndex] ?? 0

    // 4.5 更新列高
    const contentHeight = 120 // padding(32) + title(45) + author(24) + stats(20)
    if (columnHeights[minColIndex] !== undefined) {
      columnHeights[minColIndex] += imageHeight + contentHeight + props.gap
    }

    // 4.6 保存位置信息（包含图片高度供 slot 使用）
    newPositions.push({
      top,
      left,
      width: newColWidth,
      height: imageHeight + contentHeight,
      imageHeight: imageHeight,
    })
  })

  positions.value = newPositions
  gridHeight.value = Math.max(0, ...columnHeights.map((h) => h - props.gap))

  // 只在初次加载时添加淡入动画
  if (isInitialLoad.value) {
    nextTick(() => {
      newPositions.forEach((_, index) => {
        setTimeout(() => {
          itemOpacity.value[index] = true
        }, index * 30) // 减少延迟时间，从50ms改为30ms
      })
    })
    isInitialLoad.value = false // 标记已完成初次加载
  } else {
    // 非初次加载，直接显示
    nextTick(() => {
      newPositions.forEach((_, index) => {
        itemOpacity.value[index] = true
      })
    })
  }
}

// 监听items变化
watch(
  () => props.items,
  (newItems, oldItems) => {
    // 只有在数据完全替换时才重置（首次加载或切换页面）
    if (oldItems && oldItems.length > 0 && newItems.length < oldItems.length) {
      // 重置透明度和初始加载标志
      itemOpacity.value = {}
      isInitialLoad.value = true
    } else if (oldItems && oldItems.length === 0 && newItems.length > 0) {
      // 从空状态到有数据
      itemOpacity.value = {}
      isInitialLoad.value = true
    }

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
