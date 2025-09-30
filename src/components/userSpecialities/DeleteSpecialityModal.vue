<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4 font-['League_Spartan']">
      <!-- Header du modal -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-red-600">
          Supprimer la spécialité
        </h3>
        <button 
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
        >
          ×
        </button>
      </div>

      <!-- Contenu du modal -->
      <div class="mb-6">
        <!-- Icône d'avertissement -->
        <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>

        <!-- Informations sur la spécialité -->
        <div v-if="speciality" class="text-center mb-4">
          <div class="flex items-center justify-center gap-2 mb-2">
            <span class="text-2xl">{{ getCertificationLevelIcon(speciality.certification_level) }}</span>
            <h4 class="font-semibold text-gray-800">{{ speciality.specialty?.name }}</h4>
          </div>
          
          <!-- Badge si c'est la spécialité principale -->
          <div v-if="speciality.is_primary" class="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium mb-2">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            Spécialité principale
          </div>
        </div>

        <!-- Message de confirmation -->
        <div class="text-center text-gray-700">
          <p class="mb-2">
            Êtes-vous sûr de vouloir supprimer cette spécialité de votre profil ?
          </p>
          
          <p v-if="speciality?.is_primary" class="text-sm text-red-600 font-medium">
            ⚠️ Cette action supprimera votre spécialité principale
          </p>
          
          <p class="text-sm text-gray-500 mt-2">
            Cette action est irréversible.
          </p>
        </div>
      </div>

      <!-- Boutons d'action -->
      <div class="flex gap-3">
        <button
          type="button"
          @click="closeModal"
          class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          :disabled="isDeleting"
        >
          Annuler
        </button>
        <button
          type="button"
          @click="confirmDelete"
          class="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isDeleting"
        >
          <span v-if="isDeleting" class="flex items-center justify-center gap-2">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Suppression...
          </span>
          <span v-else>Supprimer</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  speciality: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'confirm-delete'])

// État du modal
const isDeleting = ref(false)

// Fonctions utilitaires pour les icônes (simples pour ce modal)
const getCertificationLevelIcon = (level) => {
  const icons = {
    'junior': '🌱',
    'senior': '🎯',
    'expert': '⭐'
  }
  return icons[level] || '📋'
}

// Fonctions
const closeModal = () => {
  if (!isDeleting.value) {
    emit('close')
  }
}

const confirmDelete = async () => {
  if (!props.speciality || isDeleting.value) return
  
  isDeleting.value = true
  
  try {
    // Émettre l'événement de confirmation
    await emit('confirm-delete', props.speciality.id)
    
    // Fermer le modal après succès
    closeModal()
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
/* Animation du spinner */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
