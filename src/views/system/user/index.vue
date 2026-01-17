<template>
  <div class="page-container">
    <h2>用户管理</h2>
    <p class="description">管理系统用户，包括新增、编辑、删除用户等操作。</p>
    <el-button type="primary">
      <el-icon><Plus /></el-icon>
      新增用户
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
