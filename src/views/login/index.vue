<template>
  <div class="login-container">
    <!-- 背景图层 -->
    <div class="login-bg"></div>

    <!-- 内容区域 -->
    <div class="login-content">
      <!-- 左侧信息展示区 -->
      <div class="login-left">
        <div class="brand-info">
          <h1 class="system-title">后台管理系统</h1>
          <p class="system-desc">高效、安全、便捷的企业级管理平台</p>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-right">
        <div class="login-form-wrapper">
          <h2 class="form-title">用户登录</h2>
          <p class="form-subtitle">欢迎回来，请登录您的账户</p>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            size="large"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
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
            <el-link type="primary" :underline="false">立即注册</el-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const userStore = useUserStore()

// 表单引用
const loginFormRef = ref<FormInstance>()

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
})

// 记住我
const rememberMe = ref(false)

// 加载状态
const loading = ref(false)

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
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为 3-20 个字符', trigger: 'blur' },
  ],
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
          username: loginForm.username,
          password: loginForm.password,
        })

        ElMessage.success('登录成功')
        // 登录成功后跳转到首页
        router.push('/home')
      } catch (error) {
        ElMessage.error('登录失败，请检查用户名或密码')
        console.error('登录错误:', error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

// 背景图层
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80')
    no-repeat center center;
  background-size: cover;
  filter: brightness(0.7);
  z-index: 0;
}

// 内容区域
.login-content {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  height: 100%;
}

// 左侧信息区
.login-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;

  .brand-info {
    text-align: center;
    color: #fff;

    .system-title {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 20px;
      text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
      letter-spacing: 4px;
    }

    .system-desc {
      font-size: 18px;
      opacity: 0.9;
      text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
    }
  }
}

// 右侧表单区
.login-right {
  width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.1);
}

.login-form-wrapper {
  width: 100%;
  max-width: 360px;
  padding: 40px;

  .form-title {
    font-size: 28px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
  }

  .form-subtitle {
    font-size: 14px;
    color: #909399;
    margin-bottom: 40px;
  }
}

.login-form {
  .el-form-item {
    margin-bottom: 24px;
  }

  .el-input {
    --el-input-border-radius: 8px;

    :deep(.el-input__wrapper) {
      padding: 4px 15px;
      box-shadow: 0 0 0 1px #dcdfe6 inset;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 0 0 1px #c0c4cc inset;
      }

      &.is-focus {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      }
    }
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 8px;
  letter-spacing: 2px;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #909399;

  .el-link {
    margin-left: 4px;
    font-size: 14px;
  }
}

// 响应式适配
@media screen and (max-width: 768px) {
  .login-left {
    display: none;
  }

  .login-right {
    width: 100%;
  }
}
</style>
