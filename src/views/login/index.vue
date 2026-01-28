<template>
  <div class="login-container">
    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- 左侧信息展示区 -->
      <div class="login-left">
        <div class="brand-info">
          <div class="logo-icon">
            <el-icon :size="70"><Location /></el-icon>
          </div>
          <h1 class="system-title">旅行笔记</h1>
          <p class="system-desc">记录旅途中的每一个精彩瞬间</p>
          <p class="system-desc">分享你的故事，发现更多精彩</p>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-right">
        <div class="login-form-wrapper">
          <h2 class="form-title">欢迎回来</h2>
          <p class="form-subtitle">登录账号，继续你的旅程</p>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            size="large"
            autocomplete="off"
          >
            <el-form-item prop="account">
              <el-input
                v-model="loginForm.account"
                placeholder="请输入用户名或邮箱"
                :prefix-icon="User"
                clearable
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                show-password
                autocomplete="off"
                @keyup.enter="handleLogin"
              />
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码？</el-link>
            </div>

            <el-form-item>
              <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">
                {{ loading ? '登录中...' : '登 录' }}
              </el-button>
            </el-form-item>
          </el-form>

          <div class="login-footer">
            <span>还没有账户？</span>
            <el-link type="primary" :underline="false" @click="goToRegister">立即注册</el-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Lock, Location } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const userStore = useUserStore()

// 表单引用
const loginFormRef = ref<FormInstance>()

// 登录表单数据
const loginForm = reactive({
  account: '', // 用户名或邮箱
  password: '',
})

// 记住我
const rememberMe = ref(false)

// 加载状态
const loading = ref(false)

// 自定义账号验证规则（支持用户名或邮箱）
const validateAccount = (rule: any, value: string, callback: any): void => {
  if (!value) {
    callback(new Error('请输入用户名或邮箱'))
    return
  }

  // 检查是否为邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isEmail = emailRegex.test(value)

  if (isEmail) {
    // 邮箱格式验证
    if (value.length > 50) {
      callback(new Error('邮箱长度不能超过50个字符'))
      return
    }
  } else {
    // 用户名格式验证
    if (value.length < 3 || value.length > 20) {
      callback(new Error('用户名长度为 3-20 个字符'))
      return
    }
  }

  callback()
}

// 自定义密码验证规则
const validatePassword = (rule: any, value: string, callback: any): void => {
  if (!value) {
    callback(new Error('请输入密码'))
    return
  }

  // 密码长度验证
  if (value.length < 8 || value.length > 20) {
    callback(new Error('密码长度为 8-20 个字符'))
    return
  }

  // 必须包含大写字母
  if (!/[A-Z]/.test(value)) {
    callback(new Error('密码必须包含至少一个大写字母'))
    return
  }

  // 必须包含小写字母
  if (!/[a-z]/.test(value)) {
    callback(new Error('密码必须包含至少一个小写字母'))
    return
  }

  // 必须包含数字
  if (!/\d/.test(value)) {
    callback(new Error('密码必须包含至少一个数字'))
    return
  }

  // 必须包含特殊字符
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    callback(new Error('密码必须包含至少一个特殊字符(!@#$%^&*等)'))
    return
  }

  callback()
}

// 表单验证规则
const loginRules: FormRules = {
  account: [{ required: true, validator: validateAccount, trigger: 'blur' }],
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
}

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 调用 Pinia store 的登录方法
        await userStore.login({
          account: loginForm.account,
          password: loginForm.password,
        })

        ElMessage.success('登录成功')
        // 登录成功后跳转到首页
        router.push('/')
      } catch (error) {
        // 错误信息已在请求拦截器中统一处理并显示
        console.error('登录错误:', error)
      } finally {
        loading.value = false
      }
    }
  })
}

// 跳转到注册页
const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $background-color;
  padding: $spacing-xl;
}

// 登录卡片
.login-card {
  display: flex;
  width: 100%;
  max-width: 1000px;
  min-height: 600px;
  background: $background-white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(109, 186, 122, 0.15);
  overflow: hidden;
}

// 左侧信息区
.login-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $primary-gradient;
  padding: $spacing-xl;

  .brand-info {
    text-align: center;
    color: $background-white;

    .logo-icon {
      margin-bottom: $spacing-lg;
      animation: float 3s ease-in-out infinite;

      .el-icon {
        color: rgba(255, 255, 255, 0.95);
      }
    }

    .system-title {
      font-size: 40px;
      font-weight: 700;
      margin-bottom: $spacing-md;
      letter-spacing: 2px;
      color: rgba(255, 255, 255, 0.98);
    }

    .system-desc {
      font-size: $font-base;
      opacity: 0.9;
      margin-bottom: $spacing-xs;
      line-height: 1.6;
    }
  }
}

// 右侧表单区
.login-right {
  width: 440px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $background-white;
  padding: $spacing-xl;
}

.login-form-wrapper {
  width: 100%;
  max-width: 340px;

  .form-title {
    font-size: 26px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }

  .form-subtitle {
    font-size: $font-base;
    color: $text-muted;
    margin-bottom: $spacing-xl;
  }
}

.login-form {
  .el-form-item {
    margin-bottom: $spacing-lg;
  }

  .el-input {
    --el-input-border-radius: #{$radius-md};

    :deep(.el-input__wrapper) {
      padding: $spacing-xs 15px;
      box-shadow: 0 0 0 1px $border-color inset;
      transition: all $transition-base;

      &:hover {
        box-shadow: 0 0 0 1px $text-muted inset;
      }

      &.is-focus {
        box-shadow: 0 0 0 1px $primary-color inset;
      }
    }
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: $font-lg;
  border-radius: $radius-md;
  letter-spacing: 2px;
  background: $primary-gradient;
  border: none;
  transition: all $transition-base;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
}

.login-footer {
  text-align: center;
  margin-top: $spacing-lg;
  font-size: $font-base;
  color: $text-muted;

  .el-link {
    margin-left: $spacing-xs;
    font-size: $font-base;
  }
}

// 响应式布局
@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
    max-width: 100%;
  }

  .login-left {
    padding: $spacing-lg;

    .brand-info {
      .logo-icon {
        .el-icon {
          font-size: 50px;
        }
      }

      .system-title {
        font-size: 28px;
      }
    }
  }

  .login-right {
    width: 100%;
    padding: $spacing-lg;
  }
}

// 浮动动画
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
