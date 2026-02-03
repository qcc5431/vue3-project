<template>
  <aside class="category-sidebar">
    <nav class="sidebar-nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
      >
        <el-icon :size="20">
          <component :is="item.icon" />
        </el-icon>
        <span class="nav-text">{{ item.title }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { HomeFilled, Compass, Star, Document } from '@element-plus/icons-vue'
import type { Component } from 'vue'

interface NavItem {
  path: string
  title: string
  icon: Component
}

const route = useRoute()

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

const isActive = (path: string) => {
  return route.path === path
}
</script>

<style lang="scss" scoped>
.category-sidebar {
  width: 200px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  padding: 24px 0;
  flex-shrink: 0;

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 24px;
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      transition: all 0.3s;
      position: relative;

      .el-icon {
        color: rgba(255, 255, 255, 0.8);
        transition: all 0.3s;
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
        transform: scaleY(0);
        transition: transform 0.3s;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;

        .el-icon {
          color: #fff;
          transform: scale(1.1);
        }
      }

      &.active {
        color: #fff;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.25);

        .el-icon {
          color: #fff;
        }

        &::before {
          transform: scaleY(1);
        }
      }

      .nav-text {
        font-size: 15px;
      }
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .category-sidebar {
    width: 60px;
    padding: 16px 0;

    .sidebar-nav {
      .nav-item {
        padding: 12px;
        justify-content: center;

        .nav-text {
          display: none;
        }
      }
    }
  }
}
</style>
