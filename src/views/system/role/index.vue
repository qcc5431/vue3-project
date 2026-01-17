<template>
  <div class="page-container">
    <h2>角色管理</h2>
    <p class="description">管理系统角色，配置角色权限。</p>
    <el-button type="primary">
      <el-icon><Plus /></el-icon>
      新增角色
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.page-container {
  h2 {
    font-size: $font-xl;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }

  .description {
    color: $text-secondary;
    margin-bottom: $spacing-lg;
  }
}
</style>
