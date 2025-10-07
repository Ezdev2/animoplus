<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast" tag="div" class="toast-list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="[toast.bgColor, toast.textColor, toast.borderColor]"
          @click="handleToastClick(toast)"
        >
          <div class="toast-content">
            <div class="toast-icon">
              <span v-if="toast.type === 'loading'" class="loading-spinner">🔄</span>
              <span v-else>{{ toast.icon }}</span>
            </div>
            
            <div class="toast-message">
              <div class="toast-text">{{ toast.message }}</div>
              <div v-if="toast.action" class="toast-action">
                <button 
                  @click.stop="handleAction(toast)"
                  class="action-button"
                >
                  {{ toast.action.label }}
                </button>
              </div>
            </div>
            
            <button 
              v-if="!toast.persistent"
              @click.stop="removeToast(toast.id)"
              class="toast-close"
            >
              ✕
            </button>
          </div>
          
          <!-- Barre de progression pour les toasts temporaires -->
          <div 
            v-if="!toast.persistent" 
            class="toast-progress"
            :style="{ animationDuration: `${toast.duration}ms` }"
          ></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useGlobalToast } from '@/composables/useConnectionToast.js'

// Utiliser l'instance globale des toasts
const { toasts, removeToast } = useGlobalToast()

// Gérer le clic sur un toast
const handleToastClick = (toast) => {
  if (toast.action) {
    handleAction(toast)
  } else if (!toast.persistent) {
    removeToast(toast.id)
  }
}

// Gérer l'action d'un toast
const handleAction = (toast) => {
  if (toast.action && typeof toast.action.handler === 'function') {
    toast.action.handler()
    
    // Supprimer le toast après l'action si pas persistant
    if (!toast.persistent) {
      removeToast(toast.id)
    }
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  pointer-events: none;
}

.toast-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.toast {
  pointer-events: auto;
  border-radius: 12px;
  border: 1px solid;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-width: 300px;
  max-width: 400px;
}

.toast-content {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 12px;
}

.toast-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.loading-spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

.toast-message {
  flex: 1;
  min-width: 0;
}

.toast-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 8px;
}

.toast-action {
  margin-top: 8px;
}

.action-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: inherit;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.toast-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  animation: progress linear;
  transform-origin: left;
}

/* Animations */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes progress {
  0% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .toast-list {
    max-width: none;
  }
  
  .toast {
    min-width: auto;
    max-width: none;
  }
  
  .toast-content {
    padding: 12px;
    gap: 10px;
  }
  
  .toast-text {
    font-size: 13px;
  }
  
  .action-button {
    font-size: 11px;
    padding: 5px 10px;
  }
}

/* Thèmes spécifiques */
.bg-green-500 {
  background: linear-gradient(135deg, #10b981, #059669);
}

.bg-red-500 {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.bg-orange-500 {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.bg-blue-500 {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.bg-gray-500 {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

.text-white {
  color: white;
}

.border-green-600 {
  border-color: #059669;
}

.border-red-600 {
  border-color: #dc2626;
}

.border-orange-600 {
  border-color: #ea580c;
}

.border-blue-600 {
  border-color: #2563eb;
}

.border-gray-600 {
  border-color: #4b5563;
}
</style>
