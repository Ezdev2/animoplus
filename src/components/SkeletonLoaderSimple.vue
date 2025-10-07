<template>
  <div class="skeleton-container" :class="containerClass">
    <!-- Skeleton pour Messages -->
    <div v-if="type === 'messages'" class="messages-skeleton">
      <div v-for="i in count" :key="i" class="message-item">
        <div class="avatar"></div>
        <div class="content">
          <div class="name"></div>
          <div class="message"></div>
          <div class="time"></div>
        </div>
      </div>
    </div>
    
    <!-- Skeleton pour Appointments -->
    <div v-else-if="type === 'appointment'" class="appointment-skeleton">
      <div class="appointment-header">
        <div class="icon"></div>
        <div class="title"></div>
      </div>
      <div class="appointment-time">
        <div class="time-block"></div>
        <div class="arrow"></div>
        <div class="time-block"></div>
      </div>
      <div class="appointment-link"></div>
    </div>
    
    <!-- Skeleton générique -->
    <div v-else class="generic-skeleton">
      <div v-for="i in count" :key="i" class="line" :style="getLineStyle(i)"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  type: {
    type: String,
    default: 'generic',
    validator: (value) => ['messages', 'appointment', 'generic'].includes(value)
  },
  count: {
    type: Number,
    default: 3
  },
  animated: {
    type: Boolean,
    default: true
  }
})

// Classes calculées
const containerClass = computed(() => {
  const classes = []
  if (props.animated) classes.push('animated')
  return classes.join(' ')
})

// Style pour les lignes génériques
const getLineStyle = (index) => {
  const widths = ['100%', '85%', '92%', '78%', '95%']
  return { width: widths[index % widths.length] }
}
</script>

<style scoped>
.skeleton-container {
  padding: 16px 0;
}

/* Animation */
.animated .skeleton-item {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Base skeleton */
.skeleton-item {
  background-color: #f3f4f6;
  border-radius: 4px;
}

/* Messages */
.messages-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
}

.message-item .avatar {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  flex-shrink: 0;
}

.message-item .content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-item .name {
  height: 16px;
  width: 120px;
}

.message-item .message {
  height: 14px;
  width: 85%;
}

.message-item .time {
  height: 12px;
  width: 60px;
  margin-left: auto;
}

/* Appointments */
.appointment-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.appointment-header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.appointment-header .icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.appointment-header .title {
  height: 16px;
  width: 150px;
}

.appointment-time {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
}

.appointment-time .time-block {
  height: 20px;
  width: 60px;
}

.appointment-time .arrow {
  width: 24px;
  height: 2px;
}

.appointment-link {
  height: 36px;
  width: 100%;
  border-radius: 8px;
}

/* Generic */
.generic-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.generic-skeleton .line {
  height: 16px;
}

/* Appliquer les styles skeleton à tous les éléments */
.message-item .avatar,
.message-item .name,
.message-item .message,
.message-item .time,
.appointment-header .icon,
.appointment-header .title,
.appointment-time .time-block,
.appointment-time .arrow,
.appointment-link,
.generic-skeleton .line {
  background-color: #f3f4f6;
  border-radius: 4px;
}

/* Animation pour les éléments animés */
.animated .message-item .avatar,
.animated .message-item .name,
.animated .message-item .message,
.animated .message-item .time,
.animated .appointment-header .icon,
.animated .appointment-header .title,
.animated .appointment-time .time-block,
.animated .appointment-time .arrow,
.animated .appointment-link,
.animated .generic-skeleton .line {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}
</style>
