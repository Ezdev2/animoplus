<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-xl p-8 w-full max-w-md mx-4 font-['League_Spartan'] relative overflow-hidden">
      
      <!-- Effet de fond décoratif -->
      <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200 to-blue-200 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
      <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200 to-purple-200 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
      
      <!-- Header du modal -->
      <div class="flex justify-between items-center mb-6 relative z-10">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l14 9-14 9V3z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">Passer Pro</h3>
            <p class="text-sm text-gray-600">Débloquez toutes les fonctionnalités</p>
          </div>
        </div>
        <button 
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none relative z-10"
        >
          ×
        </button>
      </div>

      <!-- Contenu du modal -->
      <div class="relative z-10">
        <!-- Badge Pro -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
            <span class="text-lg">⭐</span>
            Compte Professionnel
          </div>
        </div>

        <!-- Avantages -->
        <div class="mb-6">
          <h4 class="font-semibold text-gray-900 mb-4">Fonctionnalités Pro incluses :</h4>
          <ul class="space-y-3">
            <li class="flex items-center gap-3">
              <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <span class="text-gray-700">Gestion comptabilité avancée</span>
            </li>
            <li class="flex items-center gap-3">
              <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <span class="text-gray-700">Gestion de stock complète</span>
            </li>
            <li class="flex items-center gap-3">
              <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <span class="text-gray-700">Statistiques et rapports détaillés</span>
            </li>
            <li class="flex items-center gap-3">
              <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <span class="text-gray-700">Gestion multi-cliniques</span>
            </li>
            <li class="flex items-center gap-3">
              <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <span class="text-gray-700">Support prioritaire 24/7</span>
            </li>
          </ul>
        </div>

        <!-- Prix simulé -->
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6 text-center">
          <div class="text-2xl font-bold text-gray-900 mb-1">29,99€ / mois</div>
          <div class="text-sm text-gray-600">Facturation mensuelle • Annulation à tout moment</div>
          <div class="text-xs text-green-600 font-medium mt-2">🎉 Premier mois gratuit !</div>
        </div>

        <!-- Message de simulation/production -->
        <div :class="useSimulation ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'" class="border rounded-lg p-4 mb-6">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" :class="useSimulation ? 'text-yellow-600' : 'text-blue-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <p :class="useSimulation ? 'text-yellow-800' : 'text-blue-800'" class="font-medium text-sm">
                {{ useSimulation ? 'Mode Simulation' : 'Mode Production' }}
              </p>
              <p :class="useSimulation ? 'text-yellow-700' : 'text-blue-700'" class="text-xs mt-1">
                {{ simulationMessage }}
              </p>
            </div>
          </div>
        </div>

        <!-- Affichage des erreurs -->
        <div v-if="upgradeError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <div>
              <p class="text-red-800 font-medium text-sm">Erreur</p>
              <p class="text-red-700 text-xs mt-1">{{ upgradeError }}</p>
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex gap-3">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            :disabled="isUpgrading"
          >
            Annuler
          </button>
          <button
            type="button"
            @click="handleUpgrade"
            class="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isUpgrading || !canUpgrade"
          >
            <span v-if="isUpgrading" class="flex items-center justify-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {{ buttonText }}
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <span class="text-lg">⭐</span>
              {{ buttonText }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSubscription } from '@/composables/useSubscription.js'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  useSimulation: {
    type: Boolean,
    default: true // Par défaut en mode simulation
  }
})

// Emits
const emit = defineEmits(['close', 'upgrade-success'])

// Composable subscription
const { upgradeToPro, isUpgrading, upgradeError, canUpgrade } = useSubscription()

// Computed pour le texte du bouton
const buttonText = computed(() => {
  if (isUpgrading.value) {
    return props.useSimulation ? 'Activation...' : 'Traitement...'
  }
  return props.useSimulation ? 'Activer Pro (Simulation)' : 'Activer Pro'
})

// Computed pour le message de simulation
const simulationMessage = computed(() => {
  return props.useSimulation 
    ? 'Aucun paiement ne sera effectué. Votre compte sera automatiquement mis à niveau.'
    : 'Votre compte sera mis à niveau vers Pro après validation du paiement.'
})

// Fonctions
const closeModal = () => {
  if (!isUpgrading.value) {
    emit('close')
  }
}

const handleUpgrade = async () => {
  try {
    console.log('⭐ Début upgrade vers Pro...', { 
      useSimulation: props.useSimulation,
      canUpgrade: canUpgrade.value 
    })
    
    if (!canUpgrade.value) {
      console.warn('⚠️ Utilisateur ne peut pas upgrader')
      return
    }
    
    const result = await upgradeToPro(props.useSimulation)
    
    if (result.success) {
      console.log('✅ Upgrade réussi, émission événement success')
      
      // Émettre l'événement de succès avec les données
      emit('upgrade-success', {
        user: result.user || result.data,
        message: result.message,
        isSimulation: props.useSimulation
      })
      
      // Fermer le modal après un court délai
      setTimeout(() => {
        closeModal()
      }, 1000)
    } else {
      console.error('❌ Échec upgrade:', result)
      // L'erreur est déjà gérée par le composable (toast)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'upgrade:', error)
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

/* Animation d'entrée du modal */
.modal-enter-active {
  transition: all 0.3s ease;
}

.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
