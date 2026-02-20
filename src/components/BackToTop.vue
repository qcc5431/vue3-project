<template>
  <transition name="fade-up">
    <div
      v-show="visible"
      class="back-to-top"
      @click="scrollToTop"
    >
      <el-icon :size="24">
        <Top />
      </el-icon>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { Top } from '@element-plus/icons-vue'

const visible = ref(false)
let scrollContainer: HTMLElement | null = null

// 监听滚动，显示/隐藏按钮
const handleScroll = () => {
  const scrollTop = scrollContainer?.scrollTop || 0
  visible.value = scrollTop > 300
}

// 回到顶部
const scrollToTop = () => {
  if (scrollContainer) {
    scrollContainer.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

onMounted(() => {
  // 查找 .layout-body 元素（滚动容器）
  scrollContainer = document.querySelector('.layout-body') as HTMLElement | null
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style lang="scss" scoped>
.back-to-top {
  position: fixed;
  right: 40px;
  bottom: 40px;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  color: #fff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;

  // 性能优化
  will-change: transform, opacity;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);

    .el-icon {
      transform: scale(1.1);
    }
  }

  &:active {
    transform: translateY(-2px);
  }

  .el-icon {
    transition: transform 0.3s ease;
  }
}

// 动画
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

// 响应式
@media (max-width: 768px) {
  .back-to-top {
    right: 20px;
    bottom: 20px;
    width: 48px;
    height: 48px;

    .el-icon {
      font-size: 20px;
    }
  }
}
</style>
