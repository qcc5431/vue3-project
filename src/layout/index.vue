<template>
  <div class="layout">
    <!-- 侧边栏 -->
    <Sidebar :is-collapsed="isSidebarCollapsed" @toggle-collapse="toggleSidebar" />

    <!-- 主内容区 -->
    <div class="layout__main" :class="{ 'layout__main--expanded': isSidebarCollapsed }">
      <!-- 顶部栏 -->
      <Header />

      <!-- 内容区 -->
      <main class="layout__content">
        <div class="content-wrapper">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'

const isSidebarCollapsed = ref<boolean>(false)

const toggleSidebar = (): void => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: $background-color;

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    margin-left: 0;
    transition: margin-left $transition-base;

    &--expanded {
      margin-left: 0;
    }
  }

  &__content {
    flex: 1;
    padding: $spacing-md;
    overflow-y: auto;

    .content-wrapper {
      min-height: calc(100vh - #{$header-height} - #{$spacing-lg * 2});
      background: $background-white;
      border-radius: $radius-lg;
      padding: $spacing-lg;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }
  }
}

// 页面切换动画
.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
