<template>
  <div class="settings-page">
    <h2>账号设置</h2>

    <el-tabs>
      <el-tab-pane label="安全设置">
        <el-form label-width="120px" label-position="left" class="settings-form">
          <el-form-item label="修改密码">
            <el-button>修改密码</el-button>
          </el-form-item>
          <el-form-item label="两步验证">
            <el-switch />
            <span class="form-tip">开启两步验证可以提高账号安全性</span>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="通知设置">
        <el-form label-width="120px" label-position="left" class="settings-form">
          <el-form-item label="邮件通知">
            <el-switch model-value />
          </el-form-item>
          <el-form-item label="系统消息">
            <el-switch model-value />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.settings-page {
  h2 {
    font-size: $font-xl;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-lg;
  }

  .settings-form {
    max-width: 500px;
    margin-top: $spacing-lg;

    .form-tip {
      margin-left: $spacing-sm;
      color: $text-muted;
      font-size: $font-sm;
    }
  }
}
</style>
