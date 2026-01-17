<template>
  <!-- 如果没有子菜单，渲染为 el-menu-item -->
  <template v-if="!item.children || item.children.length === 0">
    <el-menu-item :index="item.path">
      <el-icon v-if="item.icon">
        <component :is="item.icon" />
      </el-icon>
      <template #title>
        <span>{{ item.title }}</span>
      </template>
    </el-menu-item>
  </template>

  <!-- 如果有子菜单，渲染为 el-sub-menu 并递归调用自身 -->
  <el-sub-menu v-else :index="item.path">
    <template #title>
      <el-icon v-if="item.icon">
        <component :is="item.icon" />
      </el-icon>
      <span>{{ item.title }}</span>
    </template>
    <sidebar-item v-for="child in item.children" :key="child.path" :item="child" />
  </el-sub-menu>
</template>

<script setup lang="ts">
interface MenuItem {
  path: string
  title: string
  icon?: any
  children?: MenuItem[]
}

defineProps<{
  item: MenuItem
}>()
</script>
