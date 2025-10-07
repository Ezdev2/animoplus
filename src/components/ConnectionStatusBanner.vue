<template>
  <Transition name="slide-down">
    <div v-if="shouldShow" class="connection-banner" :class="bannerClass">
      <div class="banner-content">
        <div class="banner-icon">
          <div v-if="connectionStatus === 'connecting'" class="spinner"></div>
          <div v-else-if="connectionStatus === 'offline'" class="icon">📡</div>
          <div v-else-if="connectionStatus === 'error'" class="icon">⚠️</div>
          <div v-else-if="connectionStatus === 'unauthenticated'" class="icon">🔐</div>
        </div>
        
        <div class="banner-message">
          <div class="message-title">{{ messageTitle }}</div>
          <div class="message-subtitle">{{ connectionMessage }}</div>
        </div>
        
        <div class="banner-actions">
          <button 
            v-if="showRetryButton" 
            @click="handleRetry"
            class="retry-btn"
            :disabled="isConnecting"
          >
            {{ isConnecting ? 'Reconnexion...' : 'Réessayer' }}
          </button>
          
          <button 
            v-if="showDismissButton"
            @click="dismiss"
            class="dismiss-btn"
          >
            ✕
          </button>
        </div>
      </div>
      
      <!-- Barre de progression pour les tentatives de reconnexion -->
      <div v-if="isConnecting" class="progress-bar">
        <div class="progress-fill"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useConnectionStatus } from '@/composables/useConnectionStatus.js'
import { useAuthStore } from '@/stores/authPinia.js'

// Composables
const connectionStatus = useConnectionStatus()
const authStore = useAuthStore()

// État local
const isDismissed = ref(false)
const dismissTimeout = ref(null)

// Computed
const shouldShow = computed(() => {
  if (isDismissed.value) return false
  return connectionStatus.shouldShowConnectionWarning.value || 
         connectionStatus.connectionStatus.value === 'connecting'
})

const bannerClass = computed(() => {
  switch (connectionStatus.connectionStatus.value) {
    case 'offline':
      return 'banner-offline'
    case 'connecting':
      return 'banner-connecting'
    case 'error':
      return 'banner-error'
    case 'unauthenticated':
      return 'banner-auth-error'
    default:
      return 'banner-info'
  }
})

const messageTitle = computed(() => {
  switch (connectionStatus.connectionStatus.value) {
    case 'offline':
      return 'Hors ligne'
    case 'connecting':
      return 'Reconnexion'
    case 'error':
      return 'Problème de connexion'
    case 'unauthenticated':
      return 'Session expirée'
    default:
      return 'Information'
  }
})

const showRetryButton = computed(() => {
  return ['offline', 'error', 'unauthenticated'].includes(connectionStatus.connectionStatus.value)
})

const showDismissButton = computed(() => {
  return connectionStatus.connectionStatus.value !== 'connecting'
})

// Actions
const handleRetry = async () => {
  isDismissed.value = false
  
  if (connectionStatus.connectionStatus.value === 'unauthenticated') {
    // Rediriger vers login pour réauthentification
    await authStore.logout()
    window.location.href = '/login'
  } else {
    // Forcer une reconnexion
    await connectionStatus.forceReconnect()
  }
}

const dismiss = () => {
  isDismissed.value = true
  connectionStatus.resetErrorCounters()
  
  // Auto-réaffichage après 30 secondes si le problème persiste
  if (dismissTimeout.value) {
    clearTimeout(dismissTimeout.value)
  }
  
  dismissTimeout.value = setTimeout(() => {
    if (connectionStatus.shouldShowConnectionWarning.value) {
      isDismissed.value = false
    }
  }, 30000)
}
</script>

<style scoped>
.connection-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.banner-offline {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
}

.banner-connecting {
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  color: white;
}

.banner-error {
  background: linear-gradient(135deg, #ffa726, #ff9800);
  color: white;
}

.banner-auth-error {
  background: linear-gradient(135deg, #ab47bc, #9c27b0);
  color: white;
}

.banner-info {
  background: linear-gradient(135deg, #42a5f5, #2196f3);
  color: white;
}

.banner-content {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  gap: 12px;
}

.banner-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.icon {
  font-size: 18px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.banner-message {
  flex: 1;
}

.message-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 2px;
}

.message-subtitle {
  font-size: 12px;
  opacity: 0.9;
}

.banner-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.retry-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.retry-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dismiss-btn {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.dismiss-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.progress-bar {
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: white;
  animation: progress 2s ease-in-out infinite;
}

/* Animations */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .banner-content {
    padding: 10px 16px;
    gap: 10px;
  }
  
  .message-title {
    font-size: 13px;
  }
  
  .message-subtitle {
    font-size: 11px;
  }
  
  .retry-btn {
    padding: 5px 10px;
    font-size: 11px;
  }
}
</style>
