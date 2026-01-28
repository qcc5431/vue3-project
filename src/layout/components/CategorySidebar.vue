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
  background: #f5f7f6;
  border-right: 1px solid #d4dcd7;
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
      color: #6b7d73;
      text-decoration: none;
      transition: all 0.2s;
      position: relative;

      .el-icon {
        color: #8fa998;
        transition: color 0.2s;
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: linear-gradient(180deg, #7a9d89 0%, #8fa998 100%);
        transform: scaleY(0);
        transition: transform 0.2s;
      }

      &:hover {
        background: rgba(122, 157, 137, 0.1);
        color: #5d7d6b;

        .el-icon {
          color: #7a9d89;
        }
      }

      &.active {
        color: #5d7d6b;
        font-weight: 500;
        background: rgba(122, 157, 137, 0.15);

        .el-icon {
          color: #7a9d89;
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
</style>
