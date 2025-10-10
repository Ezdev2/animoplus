<template>
  <div class="loading-state" :class="containerClass">
    <!-- Spinner personnalisé -->
    <div class="loading-spinner" :class="spinnerClass">
      <div v-if="type === 'dots'" class="dots-spinner">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      <div v-else-if="type === 'pulse'" class="pulse-spinner"></div>
      <div v-else-if="type === 'bars'" class="bars-spinner">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
      <div v-else class="default-spinner"></div>
    </div>
    
    <!-- Message de chargement -->
    <div v-if="showMessage" class="loading-message">
      <div class="message-title">{{ title }}</div>
      <div v-if="subtitle" class="message-subtitle">{{ subtitle }}</div>
    </div>
    
    <!-- Barre de progression optionnelle -->
    <div v-if="showProgress && progress !== null" class="progress-container">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }"
        ></div>
      </div>
      <div class="progress-text">{{ Math.round(progress) }}%</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  // Type de spinner
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'dots', 'pulse', 'bars'].includes(value)
  },
  
  // Taille du spinner
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  
  // Couleur du spinner
  color: {
    type: String,
    default: 'indigo',
    validator: (value) => ['indigo', 'blue', 'green', 'orange', 'red', 'gray'].includes(value)
  },
  
  // Messages
  title: {
    type: String,
    default: 'Chargement...'
  },
  
  subtitle: {
    type: String,
    default: null
  },
  
  // Affichage
  showMessage: {
    type: Boolean,
    default: true
  },
  
  showProgress: {
    type: Boolean,
    default: false
  },
  
  progress: {
    type: Number,
    default: null
  },
  
  // Style du conteneur
  fullHeight: {
    type: Boolean,
    default: false
  },
  
  centered: {
    type: Boolean,
    default: true
  }
})

// Classes calculées
const containerClass = computed(() => {
  const classes = []
  
  if (props.fullHeight) classes.push('full-height')
  if (props.centered) classes.push('centered')
  
  return classes.join(' ')
})

const spinnerClass = computed(() => {
  const classes = []
  
  // Taille
  classes.push(`size-${props.size}`)
  
  // Couleur
  classes.push(`color-${props.color}`)
  
  return classes.join(' ')
})
</script>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px 16px;
}

.loading-state.centered {
  align-items: center;
  justify-content: center;
  text-align: center;
}

.loading-state.full-height {
  min-height: 200px;
}

/* Spinners */
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Spinner par défaut (rotation) */
.default-spinner {
  border-radius: 50%;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  animation: spin 1s linear infinite;
}

/* Spinner à points */
.dots-spinner {
  display: flex;
  gap: 4px;
}

.dots-spinner .dot {
  border-radius: 50%;
  background: currentColor;
  animation: dots-bounce 1.4s ease-in-out infinite both;
}

.dots-spinner .dot:nth-child(1) { animation-delay: -0.32s; }
.dots-spinner .dot:nth-child(2) { animation-delay: -0.16s; }

/* Spinner pulse */
.pulse-spinner {
  border-radius: 50%;
  background: currentColor;
  animation: pulse 1.5s ease-in-out infinite;
}

/* Spinner barres */
.bars-spinner {
  display: flex;
  gap: 2px;
  align-items: end;
}

.bars-spinner .bar {
  background: currentColor;
  animation: bars-scale 1.2s ease-in-out infinite;
}

.bars-spinner .bar:nth-child(1) { animation-delay: -0.45s; }
.bars-spinner .bar:nth-child(2) { animation-delay: -0.3s; }
.bars-spinner .bar:nth-child(3) { animation-delay: -0.15s; }

/* Tailles */
.size-small .default-spinner {
  width: 16px;
  height: 16px;
}

.size-small .dots-spinner .dot {
  width: 4px;
  height: 4px;
}

.size-small .pulse-spinner {
  width: 16px;
  height: 16px;
}

.size-small .bars-spinner .bar {
  width: 3px;
  height: 12px;
}

.size-medium .default-spinner {
  width: 24px;
  height: 24px;
}

.size-medium .dots-spinner .dot {
  width: 6px;
  height: 6px;
}

.size-medium .pulse-spinner {
  width: 24px;
  height: 24px;
}

.size-medium .bars-spinner .bar {
  width: 4px;
  height: 16px;
}

.size-large .default-spinner {
  width: 32px;
  height: 32px;
}

.size-large .dots-spinner .dot {
  width: 8px;
  height: 8px;
}

.size-large .pulse-spinner {
  width: 32px;
  height: 32px;
}

.size-large .bars-spinner .bar {
  width: 5px;
  height: 20px;
}

/* Couleurs */
.color-indigo { color: #6366f1; }
.color-blue { color: #3b82f6; }
.color-green { color: #10b981; }
.color-orange { color: #f97316; }
.color-red { color: #ef4444; }
.color-gray { color: #6b7280; }

/* Messages */
.loading-message {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-title {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  font-family: 'League Spartan', sans-serif;
}

.message-subtitle {
  font-size: 12px;
  color: #6b7280;
  font-family: 'League Spartan', sans-serif;
}

/* Barre de progression */
.progress-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 200px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: currentColor;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 11px;
  color: #6b7280;
  text-align: center;
  font-family: 'League Spartan', sans-serif;
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes dots-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes bars-scale {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .loading-state {
    padding: 24px 12px;
    gap: 12px;
  }
  
  .message-title {
    font-size: 13px;
  }
  
  .message-subtitle {
    font-size: 11px;
  }
}
</style>
