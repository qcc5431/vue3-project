<template>
  <div class="layout">
    <!-- 顶部栏 -->
    <Header />

    <!-- 主体区域 -->
    <div class="layout-body">
      <!-- 左侧分类栏 -->
      <CategorySidebar />

      <!-- 内容区 -->
      <main class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import CategorySidebar from './components/CategorySidebar.vue'

const route = useRoute()
</script>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
  background: #e8ebe9;
  display: flex;
  flex-direction: column;

  .layout-body {
    display: flex;
    flex: 1;
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
  }

  .layout-content {
    flex: 1;
    padding: 24px;
    min-width: 0;
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
