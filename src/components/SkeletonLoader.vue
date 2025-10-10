<template>
  <div class="skeleton-container" :class="containerClass">
    <!-- Skeleton pour Messages -->
    <div v-if="type === 'messages'" class="messages-skeleton">
      <div v-for="i in count" :key="i" class="message-item-skeleton">
        <div class="avatar-skeleton"></div>
        <div class="content-skeleton">
          <div class="name-skeleton"></div>
          <div class="message-skeleton"></div>
          <div class="time-skeleton"></div>
        </div>
      </div>
    </div>
    
    <!-- Skeleton pour Appointments -->
    <div v-else-if="type === 'appointment'" class="appointment-skeleton">
      <div class="appointment-header-skeleton">
        <div class="icon-skeleton"></div>
        <div class="title-skeleton"></div>
      </div>
      <div class="appointment-time-skeleton">
        <div class="time-block-skeleton"></div>
        <div class="arrow-skeleton"></div>
        <div class="time-block-skeleton"></div>
      </div>
      <div class="appointment-link-skeleton"></div>
    </div>
    
    <!-- Skeleton pour Cards -->
    <div v-else-if="type === 'card'" class="card-skeleton">
      <div class="card-header-skeleton">
        <div class="card-title-skeleton"></div>
        <div class="card-action-skeleton"></div>
      </div>
      <div class="card-content-skeleton">
        <div v-for="i in count" :key="i" class="card-line-skeleton"></div>
      </div>
    </div>
    
    <!-- Skeleton pour Lists -->
    <div v-else-if="type === 'list'" class="list-skeleton">
      <div v-for="i in count" :key="i" class="list-item-skeleton">
        <div class="list-icon-skeleton"></div>
        <div class="list-content-skeleton">
          <div class="list-title-skeleton"></div>
          <div class="list-subtitle-skeleton"></div>
        </div>
      </div>
    </div>
    
    <!-- Skeleton générique -->
    <div v-else class="generic-skeleton">
      <div v-for="i in count" :key="i" class="generic-line-skeleton" :style="getLineStyle(i)"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  // Type de skeleton
  type: {
    type: String,
    default: 'generic',
    validator: (value) => ['messages', 'appointment', 'card', 'list', 'generic'].includes(value)
  },
  
  // Nombre d'éléments à afficher
  count: {
    type: Number,
    default: 3
  },
  
  // Animation
  animated: {
    type: Boolean,
    default: true
  },
  
  // Taille
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  
  // Couleur de base
  baseColor: {
    type: String,
    default: '#f3f4f6'
  },
  
  // Couleur d'animation
  highlightColor: {
    type: String,
    default: '#e5e7eb'
  }
})

// Classes calculées
const containerClass = computed(() => {
  const classes = [`skeleton-${props.size}`]
  
  if (props.animated) {
    classes.push('skeleton-animated')
  }
  
  return classes.join(' ')
})

// Style pour les lignes génériques
const getLineStyle = (index) => {
  const widths = ['100%', '85%', '92%', '78%', '95%']
  return {
    width: widths[index % widths.length]
  }
}
</script>

<style scoped>
.skeleton-container {
  --skeleton-base-color: v-bind(baseColor);
  --skeleton-highlight-color: v-bind(highlightColor);
}

/* Animation de base */
.skeleton-animated .avatar-skeleton,
.skeleton-animated .name-skeleton,
.skeleton-animated .message-skeleton,
.skeleton-animated .time-skeleton,
.skeleton-animated .icon-skeleton,
.skeleton-animated .title-skeleton,
.skeleton-animated .time-block-skeleton,
.skeleton-animated .arrow-skeleton,
.skeleton-animated .appointment-link-skeleton,
.skeleton-animated .card-title-skeleton,
.skeleton-animated .card-action-skeleton,
.skeleton-animated .card-line-skeleton,
.skeleton-animated .list-icon-skeleton,
.skeleton-animated .list-title-skeleton,
.skeleton-animated .list-subtitle-skeleton,
.skeleton-animated .generic-line-skeleton {
  background: linear-gradient(
    90deg,
    var(--skeleton-base-color) 25%,
    var(--skeleton-highlight-color) 50%,
    var(--skeleton-base-color) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Base commune pour tous les skeletons */
.avatar-skeleton,
.name-skeleton,
.message-skeleton,
.time-skeleton,
.icon-skeleton,
.title-skeleton,
.time-block-skeleton,
.arrow-skeleton,
.appointment-link-skeleton,
.card-title-skeleton,
.card-action-skeleton,
.card-line-skeleton,
.list-icon-skeleton,
.list-title-skeleton,
.list-subtitle-skeleton,
.generic-line-skeleton {
  background-color: var(--skeleton-base-color);
  border-radius: 4px;
}

/* Messages Skeleton */
.messages-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
}

.message-item-skeleton {
  display: flex;
  gap: 12px;
  padding: 12px 0;
}

.avatar-skeleton {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  flex-shrink: 0;
}

.content-skeleton {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.name-skeleton {
  @extend .skeleton-base;
  height: 16px;
  width: 120px;
}

.message-skeleton {
  @extend .skeleton-base;
  height: 14px;
  width: 85%;
}

.time-skeleton {
  @extend .skeleton-base;
  height: 12px;
  width: 60px;
  margin-left: auto;
}

/* Appointment Skeleton */
.appointment-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
}

.appointment-header-skeleton {
  display: flex;
  gap: 12px;
  align-items: center;
}

.icon-skeleton {
  @extend .skeleton-base;
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.title-skeleton {
  @extend .skeleton-base;
  height: 16px;
  width: 150px;
}

.appointment-time-skeleton {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
}

.time-block-skeleton {
  @extend .skeleton-base;
  height: 20px;
  width: 60px;
}

.arrow-skeleton {
  @extend .skeleton-base;
  width: 24px;
  height: 2px;
}

.appointment-link-skeleton {
  @extend .skeleton-base;
  height: 36px;
  width: 100%;
  border-radius: 8px;
}

/* Card Skeleton */
.card-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header-skeleton {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title-skeleton {
  @extend .skeleton-base;
  height: 20px;
  width: 140px;
}

.card-action-skeleton {
  @extend .skeleton-base;
  height: 16px;
  width: 80px;
}

.card-content-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-line-skeleton {
  @extend .skeleton-base;
  height: 14px;
}

/* List Skeleton */
.list-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-item-skeleton {
  display: flex;
  gap: 12px;
  align-items: center;
}

.list-icon-skeleton {
  @extend .skeleton-base;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.list-content-skeleton {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.list-title-skeleton {
  @extend .skeleton-base;
  height: 16px;
  width: 70%;
}

.list-subtitle-skeleton {
  @extend .skeleton-base;
  height: 14px;
  width: 50%;
}

/* Generic Skeleton */
.generic-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.generic-line-skeleton {
  @extend .skeleton-base;
  height: 16px;
}

/* Tailles */
.skeleton-small .avatar-skeleton {
  width: 32px;
  height: 32px;
}

.skeleton-small .message-item-skeleton {
  gap: 8px;
  padding: 8px 0;
}

.skeleton-small .name-skeleton {
  height: 14px;
  width: 100px;
}

.skeleton-small .message-skeleton {
  height: 12px;
}

.skeleton-large .avatar-skeleton {
  width: 56px;
  height: 56px;
}

.skeleton-large .message-item-skeleton {
  gap: 16px;
  padding: 16px 0;
}

.skeleton-large .name-skeleton {
  height: 18px;
  width: 140px;
}

.skeleton-large .message-skeleton {
  height: 16px;
}

/* Application de l'animation à tous les éléments skeleton */
.skeleton-animated .avatar-skeleton,
.skeleton-animated .name-skeleton,
.skeleton-animated .message-skeleton,
.skeleton-animated .time-skeleton,
.skeleton-animated .icon-skeleton,
.skeleton-animated .title-skeleton,
.skeleton-animated .time-block-skeleton,
.skeleton-animated .arrow-skeleton,
.skeleton-animated .appointment-link-skeleton,
.skeleton-animated .card-title-skeleton,
.skeleton-animated .card-action-skeleton,
.skeleton-animated .card-line-skeleton,
.skeleton-animated .list-icon-skeleton,
.skeleton-animated .list-title-skeleton,
.skeleton-animated .list-subtitle-skeleton,
.skeleton-animated .generic-line-skeleton {
  @extend .skeleton-base;
}

/* Responsive */
@media (max-width: 768px) {
  .messages-skeleton {
    gap: 12px;
    padding: 12px 0;
  }
  
  .message-item-skeleton {
    gap: 10px;
    padding: 10px 0;
  }
  
  .appointment-skeleton {
    gap: 12px;
    padding: 12px 0;
  }
  
  .appointment-time-skeleton {
    gap: 12px;
  }
}
</style>
