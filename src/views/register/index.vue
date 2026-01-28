<template>
  <div class="register-container">
    <!-- 注册卡片 -->
    <div class="register-card">
      <!-- 左侧信息展示区 -->
      <div class="register-left">
        <div class="brand-info">
          <div class="logo-icon">
            <el-icon :size="70"><Location /></el-icon>
          </div>
          <h1 class="system-title">加入旅行笔记</h1>
          <p class="system-desc">开启你的旅行记录之旅</p>
          <p class="system-desc">与千万旅行者分享精彩时刻</p>
        </div>
      </div>

      <!-- 右侧注册表单 -->
      <div class="register-right">
        <div class="register-form-wrapper">
          <h2 class="form-title">创建账号</h2>
          <p class="form-subtitle">填写信息，开始记录你的旅程</p>

          <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            class="register-form"
            size="large"
          >
            <el-form-item prop="username">
              <el-input
                v-model="registerForm.username"
                placeholder="请输入用户名"
                :prefix-icon="User"
                clearable
              />
            </el-form-item>

            <el-form-item prop="email">
              <el-input
                v-model="registerForm.email"
                placeholder="请输入邮箱"
                :prefix-icon="Message"
                clearable
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请确认密码"
                :prefix-icon="Lock"
                show-password
                @keyup.enter="handleRegister"
              />
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="agreeTerms"> 我已阅读并同意 </el-checkbox>
              <el-link type="primary" :underline="false">用户协议</el-link>
            </div>

            <el-form-item>
              <el-button
                type="primary"
                class="register-btn"
                :loading="loading"
                @click="handleRegister"
              >
                {{ loading ? '注册中...' : '注 册' }}
              </el-button>
            </el-form-item>
          </el-form>

          <div class="register-footer">
            <span>已有账户？</span>
            <el-link type="primary" :underline="false" @click="goToLogin">立即登录</el-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Lock, Message, Location } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { reqRegister } from '@/api/user'

const router = useRouter()

// 表单引用
const registerFormRef = ref<FormInstance>()

// 注册表单数据
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// 同意条款
const agreeTerms = ref(false)

// 加载状态
const loading = ref(false)

// 自定义用户名验证规则
const validateUsername = (
  _rule: unknown,
  value: string,
  callback: (error?: Error) => void,
): void => {
  if (!value) {
    callback(new Error('请输入用户名'))
    return
  }

  if (value.length < 3 || value.length > 20) {
    callback(new Error('用户名长度为 3-20 个字符'))
    return
  }

  // 只能包含字母、数字、下划线
  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    callback(new Error('用户名只能包含字母、数字和下划线'))
    return
  }

  callback()
}

// 自定义邮箱验证规则
const validateEmail = (_rule: unknown, value: string, callback: (error?: Error) => void): void => {
  if (!value) {
    callback(new Error('请输入邮箱'))
    return
  }

  // 邮箱格式验证
  const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  if (!emailReg.test(value)) {
    callback(new Error('请输入正确的邮箱格式'))
    return
  }

  callback()
}

// 自定义密码验证规则
const validatePassword = (
  _rule: unknown,
  value: string,
  callback: (error?: Error) => void,
): void => {
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

// 自定义确认密码验证规则
const validateConfirmPassword = (
  _rule: unknown,
  value: string,
  callback: (error?: Error) => void,
): void => {
  if (!value) {
    callback(new Error('请确认密码'))
    return
  }

  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
    return
  }

  callback()
}

// 表单验证规则
const registerRules: FormRules = {
  username: [{ required: true, validator: validateUsername, trigger: 'blur' }],
  email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
}

// 注册处理
const handleRegister = async () => {
  if (!registerFormRef.value) return

  // 检查是否同意用户协议
  if (!agreeTerms.value) {
    ElMessage.warning('请先阅读并同意用户协议')
    return
  }

  await registerFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        // 调用注册接口
        const res = await reqRegister({
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password,
        })

        if (res.data) {
          ElMessage.success('注册成功，请登录')
          // 注册成功后跳转到登录页
          router.push('/login')
        }
      } catch (error: unknown) {
        console.error('注册错误:', error)
      } finally {
        loading.value = false
      }
    }
  })
}

// 跳转到登录页
const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped lang="scss">
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $background-color;
  padding: $spacing-xl;
}

// 注册卡片
.register-card {
  display: flex;
  width: 100%;
  max-width: 1000px;
  min-height: 650px;
  background: $background-white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(109, 186, 122, 0.15);
  overflow: hidden;
}

// 左侧信息区
.register-left {
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
.register-right {
  width: 440px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $background-white;
  padding: $spacing-xl;
}

.register-form-wrapper {
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

.register-form {
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
  align-items: center;
  margin-bottom: $spacing-lg;
  font-size: $font-sm;

  .el-link {
    margin-left: $spacing-xs;
  }
}

.register-btn {
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

.register-footer {
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
  .register-card {
    flex-direction: column;
    max-width: 100%;
  }

  .register-left {
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

  .register-right {
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
