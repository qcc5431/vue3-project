<template>
  <div class="video-player" @mouseenter="showControls = true" @mouseleave="hideControlsDelayed">
    <video
      ref="videoRef"
      :src="src"
      class="video-element"
      @click="togglePlay"
      @timeupdate="updateProgress"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
    />

    <!-- 控制栏 -->
    <div class="video-controls" :class="{ visible: showControls || !isPlaying }">
      <!-- 进度条 -->
      <div class="progress-bar" @click="seek">
        <div class="progress-played" :style="{ width: progress + '%' }"></div>
      </div>

      <!-- 底部控制栏 -->
      <div class="controls-bottom">
        <!-- 左侧：播放/暂停 + 时间 -->
        <div class="controls-left">
          <button class="control-btn" @click="togglePlay">
            <el-icon :size="20">
              <VideoPause v-if="isPlaying" />
              <VideoPlay v-else />
            </el-icon>
          </button>
          <span class="time-display">{{ currentTimeDisplay }}/{{ durationDisplay }}</span>
        </div>

        <!-- 右侧：倍速 + 音量 + 画中画 + 全屏 -->
        <div class="controls-right">
          <!-- 倍速 -->
          <div class="speed-control">
            <el-dropdown @command="handleSpeedChange">
              <button class="control-btn">
                <span class="speed-text">{{ playbackRate }}倍速</span>
              </button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="0.5">0.5x</el-dropdown-item>
                  <el-dropdown-item :command="0.75">0.75x</el-dropdown-item>
                  <el-dropdown-item :command="1">1.0x</el-dropdown-item>
                  <el-dropdown-item :command="1.25">1.25x</el-dropdown-item>
                  <el-dropdown-item :command="1.5">1.5x</el-dropdown-item>
                  <el-dropdown-item :command="2">2.0x</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <!-- 音量 -->
          <div class="volume-control">
            <button class="control-btn" @click="toggleMute">
              <el-icon :size="20">
                <svg
                  v-if="isMuted || volume === 0"
                  viewBox="0 0 1024 1024"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path
                    d="M640 181.333333c0-46.037333-54.357333-70.4-88.746667-39.850666L359.552 311.850667a32 32 0 0 1-21.248 8.106666H181.333333A96 96 0 0 0 85.333333 415.957333v191.872a96 96 0 0 0 96 96h156.970667a32 32 0 0 1 21.248 8.106667l191.701333 170.368c34.389333 30.549333 88.746667 6.186667 88.746667-39.850667V181.333333z"
                  />
                  <path d="M896 896L128 128l45.248-45.248 768 768L896 896z" fill="currentColor" />
                </svg>
                <svg v-else viewBox="0 0 1024 1024" width="20" height="20" fill="currentColor">
                  <path
                    d="M640 181.333333c0-46.037333-54.357333-70.4-88.746667-39.850666L359.552 311.850667a32 32 0 0 1-21.248 8.106666H181.333333A96 96 0 0 0 85.333333 415.957333v191.872a96 96 0 0 0 96 96h156.970667a32 32 0 0 1 21.248 8.106667l191.701333 170.368c34.389333 30.549333 88.746667 6.186667 88.746667-39.850667V181.333333z m85.333333 155.584a32 32 0 0 1 45.205334-2.794666A424.917333 424.917333 0 0 1 896 512a424.917333 424.917333 0 0 1-125.461333 178.005333 32 32 0 1 1-42.410667-48.042666A360.917333 360.917333 0 0 0 832 512a360.917333 360.917333 0 0 0-103.872-150.058667 32 32 0 0 1-2.794667-45.205333z m-90.496 90.496a32 32 0 0 1 45.205334-2.794666A232.106667 232.106667 0 0 1 746.666667 512a232.106667 232.106667 0 0 1-66.624 87.381333 32 32 0 1 1-42.410667-48.042666A168.106667 168.106667 0 0 0 682.666667 512a168.106667 168.106667 0 0 0-45.034667-39.338667 32 32 0 0 1-2.794667-45.248z"
                  />
                </svg>
              </el-icon>
            </button>
            <div class="volume-slider">
              <input
                type="range"
                min="0"
                max="100"
                v-model="volume"
                @input="updateVolume"
                class="volume-input"
              />
            </div>
          </div>

          <!-- 画中画 -->
          <button class="control-btn" @click="togglePictureInPicture" v-if="supportsPiP">
            <el-icon :size="20"><Monitor /></el-icon>
          </button>

          <!-- 全屏 -->
          <button class="control-btn" @click="toggleFullscreen">
            <el-icon :size="20">
              <FullScreen v-if="!isFullscreen" />
              <Minus v-else />
            </el-icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VideoPlay, VideoPause, Monitor, FullScreen, Minus } from '@element-plus/icons-vue'

interface Props {
  src: string
  autoplay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
})

const videoRef = ref<HTMLVideoElement>()
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)
const volume = ref(100)
const isMuted = ref(false)
const playbackRate = ref(1)
const isFullscreen = ref(false)
const showControls = ref(true)
const hideControlsTimer = ref<number>()

const supportsPiP = computed(() => {
  return document.pictureInPictureEnabled
})

const currentTimeDisplay = computed(() => formatTime(currentTime.value))
const durationDisplay = computed(() => formatTime(duration.value))

// 格式化时间
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 播放/暂停
const togglePlay = () => {
  if (!videoRef.value) return
  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}

// 更新进度
const updateProgress = () => {
  if (!videoRef.value) return
  currentTime.value = videoRef.value.currentTime
  progress.value = (currentTime.value / duration.value) * 100
}

// 加载元数据
const onLoadedMetadata = () => {
  if (!videoRef.value) return
  duration.value = videoRef.value.duration
}

// 播放结束
const onEnded = () => {
  isPlaying.value = false
}

// 进度条跳转
const seek = (e: MouseEvent) => {
  if (!videoRef.value) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  videoRef.value.currentTime = percent * duration.value
}

// 倍速调整
const handleSpeedChange = (rate: number) => {
  if (!videoRef.value) return
  videoRef.value.playbackRate = rate
  playbackRate.value = rate
}

// 音量调整
const updateVolume = () => {
  if (!videoRef.value) return
  videoRef.value.volume = volume.value / 100
  isMuted.value = volume.value === 0
}

// 静音切换
const toggleMute = () => {
  if (!videoRef.value) return
  isMuted.value = !isMuted.value
  videoRef.value.muted = isMuted.value
}

// 画中画
const togglePictureInPicture = async () => {
  if (!videoRef.value) return
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture()
    } else {
      await videoRef.value.requestPictureInPicture()
    }
  } catch (error) {
    console.error('画中画错误:', error)
  }
}

// 全屏
const toggleFullscreen = async () => {
  if (!videoRef.value) return
  try {
    if (!document.fullscreenElement) {
      await videoRef.value.parentElement?.requestFullscreen()
      isFullscreen.value = true
    } else {
      await document.exitFullscreen()
      isFullscreen.value = false
    }
  } catch (error) {
    console.error('全屏错误:', error)
  }
}

// 隐藏控制栏（延迟）
const hideControlsDelayed = () => {
  if (hideControlsTimer.value) {
    clearTimeout(hideControlsTimer.value)
  }
  hideControlsTimer.value = window.setTimeout(() => {
    if (isPlaying.value) {
      showControls.value = false
    }
  }, 2000)
}

// 自动播放
onMounted(() => {
  if (props.autoplay && videoRef.value) {
    videoRef.value
      .play()
      .then(() => {
        isPlaying.value = true
      })
      .catch(() => {
        // 自动播放被阻止
      })
  }
})
</script>

<style lang="scss" scoped>
.video-player {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;

  .video-element {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  .video-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
    padding: 20px 16px 12px;
    opacity: 0;
    transition: opacity 0.3s ease;

    &.visible {
      opacity: 1;
    }

    .progress-bar {
      height: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
      cursor: pointer;
      margin-bottom: 12px;
      position: relative;

      &:hover {
        height: 6px;
      }

      .progress-played {
        height: 100%;
        background: #fff;
        border-radius: 2px;
        transition: width 0.1s linear;
      }
    }

    .controls-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .controls-left,
      .controls-right {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .control-btn {
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.2s;

        &:hover {
          opacity: 0.8;
        }
      }

      .time-display {
        color: #fff;
        font-size: 13px;
        user-select: none;
      }

      .speed-text {
        color: #fff;
        font-size: 13px;
      }

      .volume-control {
        display: flex;
        align-items: center;
        gap: 8px;

        .volume-slider {
          width: 60px;

          .volume-input {
            width: 100%;
            height: 4px;
            border-radius: 2px;
            background: rgba(255, 255, 255, 0.3);
            outline: none;
            appearance: none;

            &::-webkit-slider-thumb {
              appearance: none;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: #fff;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
