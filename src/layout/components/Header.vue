<template>
  <header class="header">
    <!-- Logo和品牌 -->
    <div class="header__left">
      <router-link to="/" class="logo">
        <el-icon :size="28" color="#ff6b6b"><Location /></el-icon>
        <span class="logo-text">旅行笔记</span>
      </router-link>
    </div>

    <!-- 搜索框 -->
    <div class="header__center">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索笔记、用户..."
        :prefix-icon="Search"
        clearable
        @keyup.enter="handleSearch"
      />
    </div>

    <!-- 右侧工具栏 -->
    <div class="header__right">
      <!-- 未登录状态 -->
      <template v-if="!isLogin">
        <el-button @click="router.push('/login')">登录</el-button>
        <el-button type="primary" @click="router.push('/register')">注册</el-button>
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
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=traveler01"
                alt="avatar"
              />
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
import {
  Location,
  Search,
  EditPen,
  Bell,
  User,
  SwitchButton,
} from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const userStore = useUserStore()
const searchKeyword = ref('')

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
      // 清除登录状态
      localStorage.removeItem('token')
      ElMessage.success('已退出登录')
      router.push('/login')
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  background: $header-bg;
  border-bottom: 1px solid $border-color;
  box-shadow: 0 2px 8px rgba(109, 186, 122, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 100;

  &__left {
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
        color: $primary-color;
      }

      .logo-text {
        font-size: 20px;
        font-weight: 600;
        background: $primary-gradient;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
  }

  &__center {
    flex: 1;
    max-width: 500px;
    margin: 0 48px;

    :deep(.el-input) {
      .el-input__wrapper {
        background: $background-color;
        border-radius: 20px;
        box-shadow: none;
        padding: 4px 16px;

        .el-input__inner {
          color: $text-primary;

          &::placeholder {
            color: $secondary-color;
          }
        }

        &:hover {
          background: darken($background-color, 3%);
        }

        &.is-focus {
          background: #fff;
          box-shadow: 0 0 0 2px rgba(109, 186, 122, 0.3);
        }
      }
    }
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 16px;

    .el-button {
      background: transparent;
      border: 1px solid $primary-color;
      color: $primary-color;

      &:hover {
        background: rgba(109, 186, 122, 0.1);
      }

      &.el-button--primary {
        background: $primary-gradient;
        border: none;
        color: #fff;

        &:hover {
          opacity: 0.9;
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
  color: $primary-color;
  transition: all 0.2s;

  &:hover {
    background: $background-color;
    color: darken($primary-color, 10%);
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
    border: 2px solid $primary-color;
    box-shadow: 0 2px 8px rgba(109, 186, 122, 0.2);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

:deep(.el-dropdown-menu) {
  padding: 8px;
  border-radius: 8px;
  border: 1px solid $border-color;
  box-shadow: 0 4px 12px rgba(109, 186, 122, 0.15);
  background: $header-bg;

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
