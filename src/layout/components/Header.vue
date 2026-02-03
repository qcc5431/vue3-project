<template>
  <header class="header">
    <!-- Logo和品牌 -->
    <div class="header__left">
      <router-link to="/" class="logo">
        <el-icon :size="28" color="#ff6b6b"><Location /></el-icon>
        <span class="logo-text">旅行笔记</span>
      </router-link>

      <!-- 导航菜单 -->
      <nav class="header-nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ active: isActive(item.path) }"
        >
          {{ item.title }}
        </router-link>
      </nav>

      <!-- 排序选项 -->
      <div class="sort-options">
        <el-tooltip content="推荐" placement="bottom">
          <div
            class="sort-icon"
            :class="{ active: sortType === 'recommend' }"
            @click="changeSortType('recommend')"
          >
            <el-icon><StarFilled /></el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="最新" placement="bottom">
          <div
            class="sort-icon"
            :class="{ active: sortType === 'latest' }"
            @click="changeSortType('latest')"
          >
            <el-icon><Clock /></el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="最热" placement="bottom">
          <div
            class="sort-icon"
            :class="{ active: sortType === 'hot' }"
            @click="changeSortType('hot')"
          >
            <el-icon><Trophy /></el-icon>
          </div>
        </el-tooltip>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="header__center">
      <el-input
        v-model="searchKeyword"
        :prefix-icon="Search"
        clearable
        @keyup.enter="handleSearch"
      />
    </div>

    <!-- 右侧工具栏 -->
    <div class="header__right">
      <!-- 未登录状态 -->
      <template v-if="!isLogin">
        <el-tooltip content="登录/注册" placement="bottom">
          <div class="user-icon" @click="userStore.openLoginModal()">
            <el-avatar :size="36" class="user-avatar-icon">
              <el-icon><User /></el-icon>
            </el-avatar>
          </div>
        </el-tooltip>
      </template>

      <!-- 已登录状态 -->
      <template v-else>
        <!-- 创建笔记按钮 -->
        <el-button type="primary" @click="handleCreate">
          <el-icon><EditPen /></el-icon>
          创建笔记
        </el-button>

        <!-- 消息通知 -->
        <div class="header-action">
          <el-badge :value="0" :hidden="true">
            <el-icon :size="20"><Bell /></el-icon>
          </el-badge>
        </div>

        <!-- 用户信息下拉 -->
        <el-dropdown trigger="click" @command="handleCommand">
          <div class="header-user">
            <el-avatar :size="36" class="user-avatar">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=traveler01" alt="avatar" />
            </el-avatar>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                <span>个人主页</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Location, Search, EditPen, Bell, User, SwitchButton, HomeFilled, Compass, Star, Document, StarFilled, Clock, Trophy } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import type { Component } from 'vue'
import type { NoteSortType } from '@/api/types/note'
import { useNoteStore } from '@/store/modules/note'

interface NavItem {
  path: string
  title: string
  icon: Component
}

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const noteStore = useNoteStore()
const searchKeyword = ref('')
const sortType = ref<NoteSortType>('recommend')

// 导航菜单项
const navItems: NavItem[] = [
  {
    path: '/',
    title: '首页',
    icon: HomeFilled,
  },
  {
    path: '/following',
    title: '关注',
    icon: Compass,
  },
  {
    path: '/favorites',
    title: '收藏',
    icon: Star,
  },
  {
    path: '/my-notes',
    title: '我的笔记',
    icon: Document,
  },
]

// 判断导航是否激活
const isActive = (path: string) => {
  return route.path === path
}

// 改变排序方式
const changeSortType = (type: NoteSortType) => {
  sortType.value = type
  noteStore.page = 1
  noteStore.fetchNotes({ sortType: type })
}

// 登录状态
const isLogin = computed(() => userStore.isLogin)

// 创建笔记
const handleCreate = () => {
  router.push('/create')
}

// 搜索
const handleSearch = () => {
  if (!searchKeyword.value.trim()) return
  ElMessage.info('搜索功能开发中...')
  // TODO: 实现搜索功能
}

// 下拉菜单命令处理
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 调用 userStore 的退出登录方法
      userStore.logout()
      ElMessage.success('已退出登录')
      // 如果当前页面需要权限，则跳转到首页
      if (router.currentRoute.value.meta.requiresAuth) {
        router.push('/')
      }
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-bottom: none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 100;

  &__left {
    display: flex;
    align-items: center;
    gap: 48px;

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.05);
      }

      .el-icon {
        color: #fff;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      }

      .logo-text {
        font-size: 20px;
        font-weight: 600;
        color: #fff;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }
    }

    .header-nav {
      display: flex;
      align-items: center;
      gap: 8px;

      .nav-link {
        padding: 8px 20px;
        color: rgba(255, 255, 255);
        text-decoration: none;
        font-size: 18px;
        font-weight: 500;
        border-radius: 8px;
        transition: all 0.3s ease;
        position: relative;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);

        &:hover {
          color: #fff;
          transform: translateY(-1px);
        }

        &.active {
          color: #fff;
          font-weight: 600;
        }
      }
    }

    .sort-options {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-left: 24px;
      padding-left: 24px;
      border-left: 1px solid rgba(255, 255, 255, 0.2);

      .sort-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.8);
        transition: all 0.3s ease;
        font-size: 24px;

        .el-icon {
          font-size: 28px;
          font-weight: bold;
        }

        &:hover {
          color: #fff;
          transform: scale(1.2);
        }

        &.active {
          color: #fff;
          font-weight: 900;
        }
      }
    }
  }

  &__center {
    flex: 1;
    max-width: 500px;
    margin: 0 48px;

    :deep(.el-input) {
      .el-input__wrapper {
        background: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: 20px;
        box-shadow: none;
        padding: 4px 16px;
        border: 1px solid rgba(255, 255, 255, 0.3);

        .el-input__inner {
          color: #fff;

          &::placeholder {
            color: rgba(255, 255, 255, 0.7);
          }
        }

        &:hover {
          background: rgba(255, 255, 255, 0.35);
          border-color: rgba(255, 255, 255, 0.5);
        }

        &.is-focus {
          background: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
          border-color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 12px;

    .user-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;

      .user-avatar-icon {
        border: 2px solid rgba(255, 255, 255, 0.8);
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.2) !important;
        display: flex;
        align-items: center;
        justify-content: center;

        .el-icon {
          color: #fff;
          font-size: 20px;
        }
      }

      &:hover {
        transform: scale(1.1);

        .user-avatar-icon {
          border-color: rgba(255, 255, 255, 1);
          background: rgba(255, 255, 255, 0.3) !important;
        }
      }
    }

    .el-button {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #fff;
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      &.el-button--primary {
        background: rgba(109, 186, 122, 0.7);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: #fff;

        &:hover {
          background: rgba(109, 186, 122, 0.85);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(109, 186, 122, 0.3);
        }
      }
    }
  }
}

.header-action {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  color: #fff;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.15);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
  }
}

.header-user {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  .user-avatar {
    border: 2px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

:deep(.el-dropdown-menu) {
  padding: 8px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  .el-dropdown-menu__item {
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    color: $text-secondary;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
      background: rgba(109, 186, 122, 0.15);
      color: $primary-color;
    }

    &.is-divided {
      margin-top: 8px;
      border-top: 1px solid $border-color;
      padding-top: 8px;

      &:hover {
        color: $error-color;
        background: rgba(232, 141, 141, 0.1);
      }
    }
  }
}
</style>
