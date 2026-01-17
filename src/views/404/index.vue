<template>
  <div class="not-found-container">
    <div class="content">
      <h1 class="error-code">404</h1>
      <p class="error-message">抱歉，您访问的页面不存在</p>
      <p class="error-description">页面可能已被删除或者您输入的地址有误</p>
      <button class="back-home" @click="goHome">返回首页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .content {
    text-align: center;
    color: #fff;

    .error-code {
      font-size: 120px;
      font-weight: bold;
      margin: 0;
      line-height: 1;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .error-message {
      font-size: 24px;
      margin: 20px 0 10px;
    }

    .error-description {
      font-size: 16px;
      opacity: 0.9;
      margin-bottom: 40px;
    }

    .back-home {
      padding: 12px 32px;
      font-size: 16px;
      background: #fff;
      color: #667eea;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}
</style>
