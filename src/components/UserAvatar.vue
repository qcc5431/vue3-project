<template>
  <div
    :class="['user-avatar', { clickable: !disabled }]"
    :style="{ width: size + 'px', height: size + 'px' }"
    @click="handleClick"
  >
    <el-avatar :size="size" :src="avatar">
      <el-icon><User /></el-icon>
    </el-avatar>
  </div>
</template>

<script setup lang="ts">
import { User } from '@element-plus/icons-vue'

interface Props {
  userId?: string
  avatar?: string
  size?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  avatar: '',
  size: 40,
  disabled: false,
})

const router = useRouter()

const handleClick = () => {
  if (props.disabled || !props.userId) return
  router.push(`/profile/${props.userId}`)
}
</script>

<style lang="scss" scoped>
.user-avatar {
  display: inline-block;
  flex-shrink: 0;

  &.clickable {
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);
    }
  }
}
</style>
