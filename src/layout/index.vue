<template>
  <div class="layout">
    <!-- 背景图片 -->
    <div class="layout-background"></div>

    <!-- 顶部栏 -->
    <Header />

    <!-- 主体区域 -->
    <div class="layout-body">
      <!-- 内容区 -->
      <main class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- 登录注册弹窗 -->
    <AuthModal />

    <!-- 回到顶部按钮 -->
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import AuthModal from '@/components/AuthModal.vue'

const route = useRoute()
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  .layout-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/images/back3.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
  }

  .layout-body {
    display: flex;
    flex: 1;
    width: 100%;
    position: relative;
    z-index: 1;
    overflow-y: auto;
    overflow-x: hidden;

    // 隐藏滚动条但保持滚动功能
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */

    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  }

  .layout-content {
    flex: 1;
    padding: 0;
    min-width: 0;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }
}

// 页面切换动画
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
}
</style>
