<template>
  <div class="dashboard">
    <!-- 数据卡片 -->
    <div class="dashboard__cards">
      <div
        v-for="item in cardList"
        :key="item.title"
        class="stat-card"
        :style="{ '--card-color': item.color }"
      >
        <div class="stat-card__icon">
          <el-icon :size="28"><component :is="item.icon" /></el-icon>
        </div>
        <div class="stat-card__content">
          <span class="stat-value">{{ item.value }}</span>
          <span class="stat-title">{{ item.title }}</span>
        </div>
        <div class="stat-card__trend" :class="item.trend > 0 ? 'up' : 'down'">
          <el-icon><Top v-if="item.trend > 0" /><Bottom v-else /></el-icon>
          {{ Math.abs(item.trend) }}%
        </div>
      </div>
    </div>

    <!-- 欢迎区域 -->
    <div class="dashboard__welcome">
      <div class="welcome-content">
        <h2>欢迎回来，Admin</h2>
        <p>今天是个好日子，祝您工作愉快！</p>
      </div>
      <div class="welcome-illustration">
        <el-icon :size="120" color="#667eea"><DataAnalysis /></el-icon>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="dashboard__quick-actions">
      <h3 class="section-title">快捷操作</h3>
      <div class="action-grid">
        <div v-for="action in quickActions" :key="action.title" class="action-item">
          <div class="action-icon" :style="{ background: action.bg }">
            <el-icon :size="24"><component :is="action.icon" /></el-icon>
          </div>
          <span class="action-title">{{ action.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  User,
  Document,
  DataAnalysis,
  Tickets,
  Top,
  Bottom,
  Plus,
  Edit,
  Upload,
  Search,
} from '@element-plus/icons-vue'

interface CardItem {
  title: string
  value: string
  icon: any
  color: string
  trend: number
}

interface ActionItem {
  title: string
  icon: any
  bg: string
}

const cardList: CardItem[] = [
  { title: '用户总数', value: '12,546', icon: User, color: '#667eea', trend: 12.5 },
  { title: '文档数量', value: '3,842', icon: Document, color: '#10b981', trend: 8.2 },
  { title: '访问量', value: '98,234', icon: DataAnalysis, color: '#f59e0b', trend: -2.4 },
  { title: '订单数', value: '1,284', icon: Tickets, color: '#ef4444', trend: 15.8 },
]

const quickActions: ActionItem[] = [
  { title: '新建用户', icon: Plus, bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { title: '编辑内容', icon: Edit, bg: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' },
  { title: '上传文件', icon: Upload, bg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' },
  { title: '搜索数据', icon: Search, bg: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' },
]
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;

  &__cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-md;
  }

  &__welcome {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-xl;
    background: $primary-gradient;
    border-radius: $radius-lg;
    color: #fff;

    .welcome-content {
      h2 {
        font-size: $font-2xl;
        font-weight: 600;
        margin-bottom: $spacing-sm;
      }

      p {
        opacity: 0.85;
        font-size: $font-base;
      }
    }

    .welcome-illustration {
      opacity: 0.3;
    }
  }

  &__quick-actions {
    .section-title {
      font-size: $font-lg;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: $spacing-md;
    }

    .action-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: $spacing-md;
    }

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-lg;
      background: $background-color;
      border-radius: $radius-md;
      cursor: pointer;
      transition: all $transition-fast;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
      }

      .action-icon {
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: $radius-md;
        color: #fff;
      }

      .action-title {
        font-size: $font-sm;
        color: $text-secondary;
      }
    }
  }
}

.stat-card {
  display: flex;
  align-items: center;
  padding: $spacing-lg;
  background: #fff;
  border-radius: $radius-lg;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all $transition-fast;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }

  &__icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(var(--card-color), 0.1);
    border-radius: $radius-md;
    color: var(--card-color);
    margin-right: $spacing-md;
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;

    .stat-value {
      font-size: $font-2xl;
      font-weight: 700;
      color: $text-primary;
    }

    .stat-title {
      font-size: $font-sm;
      color: $text-muted;
      margin-top: 2px;
    }
  }

  &__trend {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: $font-sm;
    font-weight: 500;

    &.up {
      color: $success-color;
    }

    &.down {
      color: $error-color;
    }
  }
}

@media (max-width: 1200px) {
  .dashboard__cards,
  .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
