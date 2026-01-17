<template>
  <div class="sidebar" :class="{ 'sidebar--collapsed': isCollapsed }">
    <!-- Logo 区域 -->
    <div class="sidebar__logo">
      <div class="logo-icon">
        <el-icon :size="28"><Monitor /></el-icon>
      </div>
      <transition name="fade">
        <span v-show="!isCollapsed" class="logo-text">Admin Pro</span>
      </transition>
    </div>

    <!-- 菜单区域 -->
    <el-scrollbar class="sidebar__menu-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        :collapse-transition="false"
        background-color="transparent"
        text-color="#a2a3b7"
        active-text-color="#ffffff"
        router
      >
        <sidebar-item v-for="item in menuList" :key="item.path" :item="item" />
      </el-menu>
    </el-scrollbar>

    <!-- 折叠按钮 -->
    <div class="sidebar__collapse-btn" @click="toggleCollapse">
      <el-icon :size="18">
        <Fold v-if="!isCollapsed" />
        <Expand v-else />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarItem from './SidebarItem.vue'
import {
  Monitor,
  Fold,
  Expand,
  HomeFilled,
  User,
  Setting,
  Document,
  DataAnalysis,
  Grid,
  List,
  Operation,
} from '@element-plus/icons-vue'

interface MenuItem {
  path: string
  title: string
  icon: any
  children?: MenuItem[]
}

defineProps<{
  isCollapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-collapse'): void
}>()

const route = useRoute()

const activeMenu = computed<string>(() => route.path)

// 示例菜单数据 - 实际项目中可从路由或接口获取
const menuList: MenuItem[] = [
  {
    path: '/dashboard',
    title: '工作台',
    icon: HomeFilled,
  },
  {
    path: '/system',
    title: '系统管理',
    icon: Setting,
    children: [
      { path: '/system/user', title: '用户管理', icon: User },
      { path: '/system/role', title: '角色管理', icon: Operation },
      { path: '/system/menu', title: '菜单管理', icon: Grid },
    ],
  },
  {
    path: '/content',
    title: '内容管理',
    icon: Document,
    children: [
      { path: '/content/article', title: '文章管理', icon: List },
      { path: '/content/category', title: '分类管理', icon: Grid },
    ],
  },
  {
    path: '/data',
    title: '数据分析',
    icon: DataAnalysis,
    children: [
      { path: '/data/overview', title: '数据概览', icon: Monitor },
      {
        path: '/data/report',
        title: '报表中心',
        icon: Document,
        children: [
          { path: '/data/report/daily', title: '日报表', icon: List },
          {
            path: '/data/report/monthly',
            title: '月报表',
            icon: List,
            children: [
              { path: '/data/report/monthly/standard', title: '标准月报', icon: Operation },
              { path: '/data/report/monthly/special', title: '特殊月报', icon: Operation },
            ],
          },
        ],
      },
    ],
  },
]

const toggleCollapse = (): void => {
  emit('toggle-collapse')
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: $sidebar-width;
  height: 100vh;
  background: $sidebar-bg;
  display: flex;
  flex-direction: column;
  transition: width $transition-base;
  position: relative;
  z-index: 100;

  &--collapsed {
    width: $sidebar-collapsed-width;

    .sidebar__logo .logo-icon {
      margin-right: 0;
    }
  }

  &__logo {
    height: $header-height;
    display: flex;
    align-items: center;
    padding: 0 $spacing-md;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    flex-shrink: 0;

    .logo-icon {
      width: 40px;
      height: 40px;
      background: $primary-gradient;
      border-radius: $radius-md;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      margin-right: $spacing-sm;
      flex-shrink: 0;
    }

    .logo-text {
      font-size: $font-xl;
      font-weight: 600;
      color: #fff;
      white-space: nowrap;
      background: $primary-gradient;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &__menu-wrapper {
    flex: 1;
    overflow: hidden;

    :deep(.el-scrollbar__view) {
      padding: $spacing-sm 0;
    }

    :deep(.el-menu) {
      border: none;

      .el-menu-item,
      .el-sub-menu__title {
        height: 48px;
        line-height: 48px;
        margin: 4px 8px;
        border-radius: $radius-md;
        transition: all $transition-fast;

        &:hover {
          background: $sidebar-hover-bg !important;
        }

        .el-icon {
          font-size: 18px;
          margin-right: 10px;
        }
      }

      .el-menu-item.is-active {
        background: $primary-gradient !important;
        color: #fff;
        font-weight: 500;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          background: #fff;
          border-radius: 0 2px 2px 0;
        }
      }

      .el-sub-menu.is-active > .el-sub-menu__title {
        color: $sidebar-text-active;
      }

      // 子菜单样式
      .el-sub-menu .el-menu {
        background: transparent !important;

        .el-menu-item {
          height: 44px;
          line-height: 44px;
        }
      }
    }

    // 折叠状态
    :deep(.el-menu--collapse) {
      .el-menu-item,
      .el-sub-menu__title {
        padding: 0 !important;
        justify-content: center;

        .el-icon {
          margin-right: 0;
        }

        span {
          display: none;
        }
      }
    }
  }

  &__collapse-btn {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $sidebar-text;
    cursor: pointer;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    transition: all $transition-fast;
    flex-shrink: 0;

    &:hover {
      color: $sidebar-text-active;
      background: $sidebar-hover-bg;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-fast;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
