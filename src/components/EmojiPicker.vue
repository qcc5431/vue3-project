<template>
  <el-popover placement="bottom-start" :width="340" trigger="click">
    <template #reference>
      <el-button size="small">
        <el-icon><Sunny /></el-icon>
        表情
      </el-button>
    </template>

    <div class="emoji-picker">
      <el-tabs v-model="activeTab" class="emoji-tabs">
        <el-tab-pane label="😀 常用" name="common">
          <div class="emoji-grid">
            <span
              v-for="emoji in recentEmojis"
              :key="emoji"
              class="emoji-item"
              @click="selectEmoji(emoji)"
            >
              {{ emoji }}
            </span>
            <div v-if="recentEmojis.length === 0" class="empty-tip">暂无最近使用</div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="😀 笑脸" name="smileys">
          <div class="emoji-grid">
            <span
              v-for="emoji in emojiData.smileys"
              :key="emoji"
              class="emoji-item"
              @click="selectEmoji(emoji)"
            >
              {{ emoji }}
            </span>
          </div>
        </el-tab-pane>
        <el-tab-pane label="👋 手势" name="gestures">
          <div class="emoji-grid">
            <span
              v-for="emoji in emojiData.gestures"
              :key="emoji"
              class="emoji-item"
              @click="selectEmoji(emoji)"
            >
              {{ emoji }}
            </span>
          </div>
        </el-tab-pane>
        <el-tab-pane label="🐱 动物" name="animals">
          <div class="emoji-grid">
            <span
              v-for="emoji in emojiData.animals"
              :key="emoji"
              class="emoji-item"
              @click="selectEmoji(emoji)"
            >
              {{ emoji }}
            </span>
          </div>
        </el-tab-pane>
        <el-tab-pane label="🍕 食物" name="food">
          <div class="emoji-grid">
            <span
              v-for="emoji in emojiData.food"
              :key="emoji"
              class="emoji-item"
              @click="selectEmoji(emoji)"
            >
              {{ emoji }}
            </span>
          </div>
        </el-tab-pane>
        <el-tab-pane label="⚽ 活动" name="activities">
          <div class="emoji-grid">
            <span
              v-for="emoji in emojiData.activities"
              :key="emoji"
              class="emoji-item"
              @click="selectEmoji(emoji)"
            >
              {{ emoji }}
            </span>
          </div>
        </el-tab-pane>
        <el-tab-pane label="🚗 交通" name="travel">
          <div class="emoji-grid">
            <span
              v-for="emoji in emojiData.travel"
              :key="emoji"
              class="emoji-item"
              @click="selectEmoji(emoji)"
            >
              {{ emoji }}
            </span>
          </div>
        </el-tab-pane>
        <el-tab-pane label="💡 符号" name="symbols">
          <div class="emoji-grid">
            <span
              v-for="emoji in emojiData.symbols"
              :key="emoji"
              class="emoji-item"
              @click="selectEmoji(emoji)"
            >
              {{ emoji }}
            </span>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { Sunny } from '@element-plus/icons-vue'

interface Emits {
  (e: 'select', emoji: string): void
}

const emit = defineEmits<Emits>()

const activeTab = ref('common')
const recentEmojis = ref<string[]>([])

// 表情数据
const emojiData = {
  smileys: [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '🤣',
    '😂',
    '🙂',
    '🙃',
    '😉',
    '😊',
    '😇',
    '🥰',
    '😍',
    '🤩',
    '😘',
    '😗',
    '😚',
    '😙',
    '😋',
    '😛',
    '😜',
    '🤪',
    '😝',
    '🤑',
    '🤗',
    '🤭',
    '🤫',
    '🤔',
    '🤐',
    '🤨',
    '😐',
    '😑',
    '😶',
    '😏',
    '😒',
    '🙄',
    '😬',
    '🤥',
    '😌',
    '😔',
    '😪',
    '🤤',
    '😴',
    '😷',
    '🤒',
    '🤕',
    '🤢',
    '🤮',
    '🤧',
    '🥵',
    '🥶',
    '🥴',
    '😵',
    '🤯',
    '🤠',
    '🥳',
    '😎',
    '🤓',
    '🧐',
    '😕',
    '😟',
    '🙁',
    '😮',
    '😯',
    '😲',
    '😳',
    '🥺',
    '😦',
    '😧',
    '😨',
    '😰',
    '😥',
    '😢',
    '😭',
    '😱',
    '😖',
    '😣',
    '😞',
  ],
  gestures: [
    '👋',
    '🤚',
    '🖐',
    '✋',
    '🖖',
    '👌',
    '🤏',
    '✌',
    '🤞',
    '🤟',
    '🤘',
    '🤙',
    '👈',
    '👉',
    '👆',
    '🖕',
    '👇',
    '☝',
    '👍',
    '👎',
    '✊',
    '👊',
    '🤛',
    '🤜',
    '👏',
    '🙌',
    '👐',
    '🤲',
    '🤝',
    '🙏',
    '✍',
    '💅',
    '🤳',
    '💪',
    '🦾',
    '🦿',
    '🦵',
    '🦶',
    '👂',
    '🦻',
    '👃',
    '🧠',
    '🦷',
    '🦴',
    '👀',
    '👁',
    '👅',
    '👄',
  ],
  animals: [
    '🐶',
    '🐱',
    '🐭',
    '🐹',
    '🐰',
    '🦊',
    '🐻',
    '🐼',
    '🐨',
    '🐯',
    '🦁',
    '🐮',
    '🐷',
    '🐽',
    '🐸',
    '🐵',
    '🙈',
    '🙉',
    '🙊',
    '🐒',
    '🐔',
    '🐧',
    '🐦',
    '🐤',
    '🐣',
    '🐥',
    '🦆',
    '🦅',
    '🦉',
    '🦇',
    '🐺',
    '🐗',
    '🐴',
    '🦄',
    '🐝',
    '🐛',
    '🦋',
    '🐌',
    '🐞',
    '🐜',
    '🦟',
    '🦗',
    '🕷',
    '🦂',
    '🐢',
    '🐍',
    '🦎',
    '🦖',
    '🦕',
    '🐙',
    '🦑',
    '🦐',
    '🦞',
    '🦀',
    '🐡',
    '🐠',
    '🐟',
    '🐬',
    '🐳',
    '🐋',
    '🦈',
    '🐊',
    '🐅',
    '🐆',
  ],
  food: [
    '🍏',
    '🍎',
    '🍐',
    '🍊',
    '🍋',
    '🍌',
    '🍉',
    '🍇',
    '🍓',
    '🍈',
    '🍒',
    '🍑',
    '🥭',
    '🍍',
    '🥥',
    '🥝',
    '🍅',
    '🍆',
    '🥑',
    '🥦',
    '🥬',
    '🥒',
    '🌶',
    '🌽',
    '🥕',
    '🧄',
    '🧅',
    '🥔',
    '🍠',
    '🥐',
    '🥯',
    '🍞',
    '🥖',
    '🥨',
    '🧀',
    '🥚',
    '🍳',
    '🧈',
    '🥞',
    '🧇',
    '🥓',
    '🥩',
    '🍗',
    '🍖',
    '🦴',
    '🌭',
    '🍔',
    '🍟',
    '🍕',
    '🥪',
    '🥙',
    '🧆',
    '🌮',
    '🌯',
    '🥗',
    '🥘',
    '🍝',
    '🍜',
    '🍲',
    '🍛',
    '🍣',
    '🍱',
    '🥟',
    '🦪',
  ],
  activities: [
    '⚽',
    '🏀',
    '🏈',
    '⚾',
    '🥎',
    '🎾',
    '🏐',
    '🏉',
    '🥏',
    '🎱',
    '🪀',
    '🏓',
    '🏸',
    '🏒',
    '🏑',
    '🥍',
    '🏏',
    '🥅',
    '⛳',
    '🪁',
    '🏹',
    '🎣',
    '🤿',
    '🥊',
    '🥋',
    '🎽',
    '🛹',
    '🛼',
    '🛷',
    '⛸',
    '🥌',
    '🎿',
    '⛷',
    '🏂',
    '🪂',
    '🏋',
    '🤼',
    '🤸',
    '🤺',
    '⛹',
    '🤾',
    '🏌',
    '🏇',
    '🧘',
    '🏊',
    '🤽',
    '🚣',
    '🧗',
    '🚴',
    '🚵',
    '🎪',
    '🎭',
    '🎨',
    '🎬',
    '🎤',
    '🎧',
    '🎼',
    '🎹',
    '🥁',
    '🎷',
    '🎺',
    '🎸',
    '🪕',
    '🎻',
  ],
  travel: [
    '🚗',
    '🚕',
    '🚙',
    '🚌',
    '🚎',
    '🏎',
    '🚓',
    '🚑',
    '🚒',
    '🚐',
    '🚚',
    '🚛',
    '🚜',
    '🦯',
    '🦽',
    '🦼',
    '🛴',
    '🚲',
    '🛵',
    '🏍',
    '🛺',
    '🚨',
    '🚔',
    '🚍',
    '🚘',
    '🚖',
    '🚡',
    '🚠',
    '🚟',
    '🚃',
    '🚋',
    '🚞',
    '🚝',
    '🚄',
    '🚅',
    '🚈',
    '🚂',
    '🚆',
    '🚇',
    '🚊',
    '🚉',
    '✈',
    '🛫',
    '🛬',
    '🛩',
    '💺',
    '🛰',
    '🚀',
    '🛸',
    '🚁',
    '🛶',
    '⛵',
    '🚤',
    '🛥',
    '🛳',
    '⛴',
    '🚢',
    '⚓',
    '⛽',
    '🚧',
    '🚦',
    '🚥',
    '🚏',
    '🗺',
  ],
  symbols: [
    '❤',
    '🧡',
    '💛',
    '💚',
    '💙',
    '💜',
    '🖤',
    '🤍',
    '🤎',
    '💔',
    '❣',
    '💕',
    '💞',
    '💓',
    '💗',
    '💖',
    '💘',
    '💝',
    '💟',
    '☮',
    '✝',
    '☪',
    '🕉',
    '☸',
    '✡',
    '🔯',
    '🕎',
    '☯',
    '☦',
    '🛐',
    '⛎',
    '♈',
    '♉',
    '♊',
    '♋',
    '♌',
    '♍',
    '♎',
    '♏',
    '♐',
    '♑',
    '♒',
    '♓',
    '🆔',
    '⚛',
    '🉑',
    '☢',
    '☣',
    '📴',
    '📳',
    '🈶',
    '🈚',
    '🈸',
    '🈺',
    '🈷',
    '✴',
    '🆚',
    '💮',
    '🉐',
    '㊙',
    '㊗',
    '🈴',
    '🈵',
    '🈹',
  ],
}

// 加载最近使用的表情
const loadRecentEmojis = () => {
  const stored = localStorage.getItem('recent_emojis')
  if (stored) {
    try {
      recentEmojis.value = JSON.parse(stored)
    } catch {
      recentEmojis.value = []
    }
  }
}

// 保存最近使用的表情
const saveRecentEmoji = (emoji: string) => {
  const recent = recentEmojis.value.filter((e) => e !== emoji)
  recent.unshift(emoji)
  recentEmojis.value = recent.slice(0, 24)
  localStorage.setItem('recent_emojis', JSON.stringify(recentEmojis.value))
}

// 选择表情
const selectEmoji = (emoji: string) => {
  saveRecentEmoji(emoji)
  emit('select', emoji)
}

onMounted(() => {
  loadRecentEmojis()
})
</script>

<style lang="scss" scoped>
.emoji-picker {
  .emoji-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 12px;
    }

    :deep(.el-tabs__nav) {
      font-size: 12px;
    }

    :deep(.el-tabs__item) {
      padding: 0 12px;
      height: 36px;
      line-height: 36px;
    }
  }

  .emoji-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
    max-height: 240px;
    overflow-y: auto;

    .emoji-item {
      font-size: 24px;
      cursor: pointer;
      text-align: center;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;

      &:hover {
        background: #f5f7fa;
        transform: scale(1.2);
      }
    }

    .empty-tip {
      grid-column: 1 / -1;
      text-align: center;
      color: #909399;
      font-size: 14px;
      padding: 40px 0;
    }
  }
}
</style>
