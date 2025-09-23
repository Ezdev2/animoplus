<template>
  <BaseModal 
    :title="title" 
    @close="closeModal" 
    :footer="false"
    :size="'small'"
  >
    <!-- Icône d'avertissement -->
    <div class="warning-content">
      <div class="warning-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <!-- Message principal -->
      <div class="warning-message">
        <h3 class="warning-title">{{ confirmTitle }}</h3>
        <p class="warning-description">{{ message }}</p>
        
        <!-- Détails de l'élément à supprimer -->
        <div v-if="itemDetails" class="item-details">
          <div class="item-info">
            <span class="item-label">{{ itemLabel }} :</span>
            <span class="item-name">{{ itemDetails }}</span>
          </div>
        </div>

        <!-- Avertissement permanent -->
        <div class="permanent-warning">
          <div class="warning-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ permanentWarning }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="modal-actions">
      <button 
        type="button" 
        class="btn-cancel" 
        @click="closeModal"
        :disabled="isDeleting"
      >
        Annuler
      </button>
      
      <button 
        type="button" 
        class="btn-delete" 
        @click="confirmDelete"
        :disabled="isDeleting"
      >
        <span v-if="isDeleting" class="loading-spinner"></span>
        {{ isDeleting ? deletingText : confirmButtonText }}
      </button>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Confirmer la suppression'
  },
  confirmTitle: {
    type: String,
    default: 'Êtes-vous sûr ?'
  },
  message: {
    type: String,
    default: 'Cette action ne peut pas être annulée.'
  },
  itemDetails: {
    type: String,
    default: null
  },
  itemLabel: {
    type: String,
    default: 'Élément'
  },
  permanentWarning: {
    type: String,
    default: 'Cette suppression est permanente et irréversible'
  },
  confirmButtonText: {
    type: String,
    default: 'Supprimer définitivement'
  },
  deletingText: {
    type: String,
    default: 'Suppression...'
  }
})

// Émissions
const emit = defineEmits(['close', 'confirm'])

// État local
const isDeleting = ref(false)

// Fonctions
function closeModal() {
  if (!isDeleting.value) {
    emit('close')
  }
}

async function confirmDelete() {
  if (isDeleting.value) return
  
  try {
    isDeleting.value = true
    await emit('confirm')
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
.warning-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 0;
}

.warning-icon {
  margin-bottom: 20px;
  animation: pulse 2s infinite;
}

.warning-message {
  width: 100%;
}

.warning-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
}

.warning-description {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 20px;
  line-height: 1.5;
}

.item-details {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.item-name {
  font-size: 16px;
  color: #111827;
  font-weight: 600;
}

.permanent-warning {
  margin-top: 16px;
}

.warning-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #fef2f2;
  color: #dc2626;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #fecaca;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-delete {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  justify-content: center;
}

.btn-cancel {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.btn-delete {
  background-color: #dc2626;
  color: white;
  border: 1px solid #dc2626;
}

.btn-delete:hover:not(:disabled) {
  background-color: #b91c1c;
  border-color: #b91c1c;
}

.btn-cancel:disabled,
.btn-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .modal-actions {
    flex-direction: column-reverse;
  }
  
  .btn-cancel,
  .btn-delete {
    width: 100%;
    min-width: auto;
  }
  
  .warning-title {
    font-size: 18px;
  }
  
  .warning-description {
    font-size: 14px;
  }
}
</style>
