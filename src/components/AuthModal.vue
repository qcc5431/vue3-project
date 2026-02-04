<template>
  <el-dialog
    v-model="userStore.authModalVisible"
    width="900px"
    destroy-on-close
    append-to-body
    :show-close="false"
    top="10vh"
    class="auth-dialog"
  >
    <div class="auth-card">
      <!-- 左侧信息展示区 -->
      <div class="auth-left">
        <div class="brand-info">
          <div class="logo-icon">
            <el-icon :size="70"><Location /></el-icon>
          </div>
          <h1 class="system-title">
            {{ userStore.authModalType === 'login' ? '旅行笔记' : '加入旅行笔记' }}
          </h1>
          <p class="system-desc">
            {{
              userStore.authModalType === 'login'
                ? '记录旅途中的每一个精彩瞬间'
                : '开启你的旅行记录之旅'
            }}
          </p>
          <p class="system-desc">
            {{
              userStore.authModalType === 'login'
                ? '分享你的故事，发现更多精彩'
                : '与千万旅行者分享精彩时刻'
            }}
          </p>
        </div>
      </div>

      <!-- 右侧表单区 -->
      <div class="auth-right">
        <div class="auth-form-wrapper">
          <!-- 登录表单 -->
          <template v-if="userStore.authModalType === 'login'">
            <h2 class="form-title">欢迎回来</h2>
            <p class="form-subtitle">登录账号，继续你的旅程</p>
            <el-form
              ref="loginFormRef"
              :model="loginForm"
              :rules="loginRules"
              class="auth-form"
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
                <el-button type="primary" class="auth-btn" :loading="loading" @click="handleLogin">
                  {{ loading ? '登录中...' : '登 录' }}
                </el-button>
              </el-form-item>
            </el-form>

            <div class="auth-footer">
              <span>还没有账户？</span>
              <el-link
                type="primary"
                :underline="false"
                @click="userStore.switchAuthMode('register')"
                >立即注册</el-link
              >
            </div>
          </template>

          <!-- 注册表单 -->
          <template v-else>
            <h2 class="form-title">创建账号</h2>
            <p class="form-subtitle">填写信息，开始记录你的旅程</p>
            <el-form
              ref="registerFormRef"
              :model="registerForm"
              :rules="registerRules"
              class="auth-form"
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
                  class="auth-btn"
                  :loading="loading"
                  @click="handleRegister"
                >
                  {{ loading ? '注册中...' : '注 册' }}
                </el-button>
              </el-form-item>
            </el-form>

            <div class="auth-footer">
              <span>已有账户？</span>
              <el-link type="primary" :underline="false" @click="userStore.switchAuthMode('login')"
                >立即登录</el-link
              >
            </div>
          </template>
        </div>
        <!-- 关闭按钮 -->
        <div class="close-btn" @click="userStore.closeAuthModal()">
          <el-icon :size="20"><Close /></el-icon>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { User, Lock, Message, Location, Close } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { reqRegister } from '@/api/user'

const userStore = useUserStore()

// 加载状态
const loading = ref(false)

// --- 登录逻辑 ---
const loginFormRef = ref<FormInstance>()
const loginForm = reactive({
  account: '',
  password: '',
})
const rememberMe = ref(false)

const validateAccount = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value) return callback(new Error('请输入用户名或邮箱'))
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegex.test(value)) {
    if (value.length > 50) return callback(new Error('邮箱长度不能超过50个字符'))
  } else {
    if (value.length < 3 || value.length > 20)
      return callback(new Error('用户名长度为 3-20 个字符'))
  }
  callback()
}

const validatePassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value) return callback(new Error('请输入密码'))
  if (value.length < 8 || value.length > 20) return callback(new Error('密码长度为 8-20 个字符'))
  if (!/[A-Z]/.test(value)) return callback(new Error('密码必须包含至少一个大写字母'))
  if (!/[a-z]/.test(value)) return callback(new Error('密码必须包含至少一个小写字母'))
  if (!/\d/.test(value)) return callback(new Error('密码必须包含至少一个数字'))
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value))
    return callback(new Error('密码必须包含至少一个特殊字符(!@#$%^&*等)'))
  callback()
}

const loginRules: FormRules = {
  account: [{ required: true, validator: validateAccount, trigger: 'blur' }],
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.login({
          account: loginForm.account,
          password: loginForm.password,
        })
        ElMessage.success('登录成功')
        userStore.closeAuthModal()
      } catch (error) {
        console.error('登录错误:', error)
      } finally {
        loading.value = false
      }
    }
  })
}

// --- 注册逻辑 ---
const registerFormRef = ref<FormInstance>()
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const agreeTerms = ref(false)

const validateUsername = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value) return callback(new Error('请输入用户名'))
  if (value.length < 3 || value.length > 20) return callback(new Error('用户名长度为 3-20 个字符'))
  if (!/^[a-zA-Z0-9_]+$/.test(value)) return callback(new Error('用户名只能包含字母、数字和下划线'))
  callback()
}

const validateEmail = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value) return callback(new Error('请输入邮箱'))
  const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  if (!emailReg.test(value)) return callback(new Error('请输入正确的邮箱格式'))
  callback()
}

const validateConfirmPassword = (
  _rule: unknown,
  value: string,
  callback: (error?: Error) => void,
) => {
  if (!value) return callback(new Error('请确认密码'))
  if (value !== registerForm.password) return callback(new Error('两次输入的密码不一致'))
  callback()
}

const registerRules: FormRules = {
  username: [{ required: true, validator: validateUsername, trigger: 'blur' }],
  email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  if (!agreeTerms.value) return ElMessage.warning('请先阅读并同意用户协议')
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await reqRegister({
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password,
        })
        if (res.data) {
          ElMessage.success('注册成功，请登录')
          userStore.switchAuthMode('login')
        }
      } catch (error) {
        console.error('注册错误:', error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped lang="scss">
.auth-card {
  display: flex;
  width: 100%;
  min-height: 500px;
  background: $background-white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

// 左侧信息区
.auth-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(126, 190, 77, 0.8) 0%, rgba(109, 186, 122, 0.3) 100%);
  padding: $spacing-xl;
  border-right: 1px solid rgba(255, 255, 255, 0.15);

  .brand-info {
    text-align: center;
    color: #fff;

    .logo-icon {
      margin-bottom: $spacing-lg;
      animation: float 3s ease-in-out infinite;

      .el-icon {
        color: rgba(255, 255, 255, 0.95);
        font-size: 70px;
      }
    }

    .system-title {
      font-size: 40px;
      font-weight: 700;
      margin-bottom: $spacing-md;
      letter-spacing: 2px;
      color: #fff;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    }

    .system-desc {
      font-size: $font-base;
      opacity: 0.9;
      margin-bottom: $spacing-xs;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.9);
    }
  }
}

// 右侧表单区
.auth-right {
  width: 440px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $background-white;
  padding: $spacing-xl;
  position: relative;
}

.auth-form-wrapper {
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

.auth-form {
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

.auth-btn {
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

.auth-footer {
  text-align: center;
  margin-top: $spacing-lg;
  font-size: $font-base;
  color: $text-muted;

  .el-link {
    margin-left: $spacing-xs;
    font-size: $font-base;
  }
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  color: $text-muted;
  transition: all 0.2s;

  &:hover {
    color: $primary-color;
    transform: rotate(90deg);
  }
}

// 响应式布局
@media (max-width: 768px) {
  .auth-card {
    flex-direction: column;
  }

  .auth-left {
    display: none; // 移动端隐藏左侧
  }

  .auth-right {
    width: 100%;
    padding: $spacing-lg;
  }
}

// Dialog 样式覆盖
:deep(.auth-dialog) {
  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
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
