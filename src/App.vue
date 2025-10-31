<template>
  <h1>nihao</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <Persion />
</template>

<script lang="ts">
import Persion from './components/Persion.vue'

export default {
  name: 'App',
  components: { Persion },
}
</script>

<style scoped></style>
