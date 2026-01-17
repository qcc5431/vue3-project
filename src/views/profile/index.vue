<template>
  <div class="profile-page">
    <div class="profile-header">
      <el-avatar :size="80" class="profile-avatar">
        <img
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          alt="avatar"
        />
      </el-avatar>
      <div class="profile-info">
        <h2>Admin</h2>
        <p>超级管理员</p>
      </div>
    </div>

    <el-divider />

    <el-form label-width="100px" label-position="left">
      <el-form-item label="用户名">
        <el-input value="admin" disabled />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input value="admin@example.com" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input value="138****8888" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.profile-page {
  max-width: 600px;

  .profile-header {
    display: flex;
    align-items: center;
    gap: $spacing-lg;

    .profile-avatar {
      border: 3px solid transparent;
      background:
        $primary-gradient padding-box,
        $primary-gradient border-box;
      background-clip: padding-box, border-box;
    }

    .profile-info {
      h2 {
        font-size: $font-xl;
        font-weight: 600;
        color: $text-primary;
        margin-bottom: $spacing-xs;
      }

      p {
        color: $text-muted;
        font-size: $font-sm;
      }
    }
  }
}
</style>
