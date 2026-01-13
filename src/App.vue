<template>
  <div id="app">
    <!-- 路由出口：当前路由匹配的组件将渲染在这里 -->
    <router-view />
  </div>
</template>

<script lang="ts" setup>
// 不再需要导入单个组件，由路由管理
</script>

<style scoped>
#app {
  width: 100%;
  height: 100vh;
}
</style>
