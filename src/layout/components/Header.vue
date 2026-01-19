<template>
  <header class="header">
    <!-- 左侧：面包屑导航 -->
    <div class="header__left">
      <el-breadcrumb separator="/">
        <transition-group name="breadcrumb">
          <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path">
            <span v-if="index === breadcrumbList.length - 1" class="breadcrumb-current">
              {{ item.title }}
            </span>
            <router-link v-else :to="item.path" class="breadcrumb-link">
              {{ item.title }}
            </router-link>
          </el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb>
    </div>

    <!-- 右侧：工具栏 -->
    <div class="header__right">
      <!-- 刷新按钮 -->
      <div class="header-action" @click="refreshPage">
        <el-tooltip content="刷新" placement="bottom">
          <el-icon :size="18" :class="{ 'is-rotating': isRefreshing }">
            <Refresh />
          </el-icon>
        </el-tooltip>
      </div>

      <!-- 全屏按钮 -->
      <div class="header-action" @click="toggleFullscreen">
        <el-tooltip content="全屏" placement="bottom">
          <el-icon :size="18">
            <FullScreen v-if="!isFullscreen" />
            <Aim v-else />
          </el-icon>
        </el-tooltip>
      </div>

      <!-- 消息通知 -->
      <div class="header-action">
        <el-badge :value="5" :max="99">
          <el-icon :size="18"><Bell /></el-icon>
        </el-badge>
      </div>

      <!-- 用户信息下拉 -->
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="header-user">
          <el-avatar :size="36" class="user-avatar">
            <img
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              alt="avatar"
            />
          </el-avatar>
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">{{ userRole }}</span>
          </div>
          <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              <span>个人中心</span>
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              <span>账号设置</span>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  FullScreen,
  Aim,
  Bell,
  ArrowDown,
  User,
  Setting,
  SwitchButton,
  Refresh,
} from '@element-plus/icons-vue'

interface BreadcrumbItem {
  path: string
  title: string
}

const route = useRoute()
const router = useRouter()

const isFullscreen = ref<boolean>(false)
const isRefreshing = ref<boolean>(false)
const userName = ref<string>('Admin')
const userRole = ref<string>('超级管理员')

// 注入父组件提供的刷新方法
const refreshPageFromLayout = inject<() => void>('refreshPage')

// 面包屑数据
const breadcrumbList = computed<BreadcrumbItem[]>(() => {
  const matched = route.matched.filter((item) => item.meta?.title)
  const list: BreadcrumbItem[] = [{ path: '/dashboard', title: '首页' }]

  matched.forEach((item) => {
    if (item.meta?.title && item.path !== '/dashboard') {
      list.push({
        path: item.path,
        title: item.meta.title as string,
      })
    }
  })

  return list
})

// 刷新页面
const refreshPage = (): void => {
  if (!refreshPageFromLayout) return

  isRefreshing.value = true

  // 调用父组件的刷新方法
  refreshPageFromLayout()

  // 动画结束后重置状态
  setTimeout(() => {
    isRefreshing.value = false
  }, 1000)
}

// 全屏切换
const toggleFullscreen = (): void => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 下拉菜单命令处理
const handleCommand = (command: string): void => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = (): void => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 清除登录状态
      localStorage.removeItem('token')
      ElMessage.success('已退出登录')
      router.push('/login')
    })
    .catch(() => {})
}

// 监听全屏状态变化
watch(
  () => document.fullscreenElement,
  () => {
    isFullscreen.value = !!document.fullscreenElement
  },
)
</script>

<style lang="scss" scoped>
.header {
  height: $header-height;
  background: $header-bg;
  box-shadow: $header-shadow;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-lg;
  position: sticky;
  top: 0;
  z-index: 90;

  &__left {
    display: flex;
    align-items: center;

    :deep(.el-breadcrumb) {
      font-size: $font-base;

      .el-breadcrumb__separator {
        color: $text-muted;
      }
    }

    .breadcrumb-link {
      color: $text-secondary;
      transition: color $transition-fast;

      &:hover {
        color: $primary-color;
      }
    }

    .breadcrumb-current {
      color: $text-primary;
      font-weight: 500;
    }
  }

  &__right {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }
}

.header-action {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-md;
  cursor: pointer;
  color: $text-secondary;
  transition: all $transition-fast;

  &:hover {
    background: $background-color;
    color: $primary-color;
  }

  :deep(.el-badge__content) {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    border: none;
  }
}

.header-user {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: $radius-lg;
  cursor: pointer;
  transition: all $transition-fast;
  margin-left: $spacing-sm;

  &:hover {
    background: $background-color;
  }

  .user-avatar {
    border: 2px solid transparent;
    background:
      $primary-gradient padding-box,
      $primary-gradient border-box;
    background-clip: padding-box, border-box;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .user-info {
    display: flex;
    flex-direction: column;
    margin-left: $spacing-sm;
    line-height: 1.3;

    .user-name {
      font-size: $font-base;
      font-weight: 500;
      color: $text-primary;
    }

    .user-role {
      font-size: $font-xs;
      color: $text-muted;
    }
  }

  .dropdown-icon {
    margin-left: $spacing-xs;
    color: $text-muted;
    transition: transform $transition-fast;
  }

  &:hover .dropdown-icon {
    transform: rotate(180deg);
  }
}

:deep(.el-dropdown-menu) {
  padding: $spacing-sm;
  border-radius: $radius-md;
  border: 1px solid $border-color;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  .el-dropdown-menu__item {
    padding: 10px 16px;
    border-radius: $radius-sm;
    font-size: $font-base;
    color: $text-secondary;
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    &:hover {
      background: rgba($primary-color, 0.08);
      color: $primary-color;
    }

    &.is-divided {
      margin-top: $spacing-sm;
      border-top: 1px solid $border-color;
      padding-top: $spacing-md;

      &:hover {
        color: $error-color;
        background: rgba($error-color, 0.08);
      }
    }
  }
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all $transition-fast;
}

.breadcrumb-enter-from,
.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

// 刷新图标旋转动画
.is-rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
