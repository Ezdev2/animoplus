<template>
  <div class="specialite-detail-page min-h-screen bg-gray-50">
    <!-- Navigation -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center gap-4">
        <button 
          @click="goBack"
          class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Retour aux spécialités
        </button>
        
        <div class="h-6 w-px bg-gray-300"></div>
        
        <nav class="flex items-center gap-2 text-sm">
          <span class="text-gray-500">Spécialités</span>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          <span class="text-gray-900 font-medium">{{ specialite?.name || 'Détail' }}</span>
        </nav>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- En-tête de la spécialité -->
      <div v-if="specialite" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div class="flex items-start gap-6">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            {{ getSpecialiteInitials(specialite.name) }}
          </div>
          
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-3xl font-bold text-gray-900">{{ specialite.name }}</h1>
              <span 
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="specialite.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
              >
                {{ specialite.is_active ? 'Actif' : 'Inactif' }}
              </span>
            </div>
            
            <p v-if="specialite.description" class="text-gray-600 text-lg leading-relaxed mb-4">
              {{ specialite.description }}
            </p>
            
            <!-- Statistiques -->
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <span class="text-gray-700 font-medium">{{ veterinarianCount }} vétérinaires</span>
              </div>
              
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-gray-700 font-medium">{{ activeVeterinarianCount }} actifs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- État de chargement spécialité -->
      <div v-else-if="isLoadingSpecialite" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div class="flex items-center gap-4">
          <div class="w-20 h-20 bg-gray-200 rounded-2xl animate-pulse"></div>
          <div class="flex-1">
            <div class="h-8 bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded-lg w-2/3 animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Erreur chargement spécialité -->
      <div v-else-if="specialiteError" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <h3 class="text-red-800 font-medium">Erreur de chargement</h3>
            <p class="text-red-600">{{ specialiteError }}</p>
          </div>
        </div>
      </div>

      <!-- Composant des vétérinaires -->
      <SpecialiteVeterinarians
        v-if="specialite"
        :specialite-id="specialite.id"
        :specialite-name="specialite.name"
        @veterinarian-selected="handleVeterinarianSelected"
      />
    </div>

    <!-- Modal profil vétérinaire (placeholder) -->
    <div 
      v-if="selectedVeterinarian"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeVeterinarianModal"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Profil Vétérinaire</h3>
          <button @click="closeVeterinarianModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl mx-auto mb-4">
            {{ getInitials(selectedVeterinarian.user?.name || selectedVeterinarian.name) }}
          </div>
          <h4 class="font-semibold text-gray-900 mb-1">
            {{ selectedVeterinarian.user?.name || selectedVeterinarian.name }}
          </h4>
          <p class="text-gray-600 mb-4">
            {{ selectedVeterinarian.user?.email || selectedVeterinarian.email }}
          </p>
          
          <!-- TODO: Ajouter plus de détails du profil -->
          <p class="text-sm text-gray-500">
            Profil détaillé à implémenter
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSpecialites } from '@/composables/useSpecialites.js'
import SpecialiteVeterinarians from '@/components/specialites/SpecialiteVeterinarians.vue'

// Router
const route = useRoute()
const router = useRouter()

// Composable
const { fetchSpecialiteById, isLoading: isLoadingSpecialites, error } = useSpecialites()

// État local
const specialite = ref(null)
const isLoadingSpecialite = ref(false)
const specialiteError = ref(null)
const selectedVeterinarian = ref(null)
const veterinarianCount = ref(0)
const activeVeterinarianCount = ref(0)

// Computed
const specialiteId = computed(() => route.params.id)

// Fonctions utilitaires
const getSpecialiteInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// Fonctions principales
const loadSpecialite = async () => {
  if (!specialiteId.value) return
  
  isLoadingSpecialite.value = true
  specialiteError.value = null
  
  try {
    console.log('🔍 Chargement spécialité:', specialiteId.value)
    
    const response = await fetchSpecialiteById(specialiteId.value)
    
    if (response.success) {
      specialite.value = response.data
      console.log('✅ Spécialité chargée:', specialite.value)
    } else {
      specialiteError.value = response.error || 'Erreur lors du chargement de la spécialité'
    }
  } catch (err) {
    console.error('❌ Erreur chargement spécialité:', err)
    specialiteError.value = err.message || 'Erreur lors du chargement de la spécialité'
  } finally {
    isLoadingSpecialite.value = false
  }
}

const handleVeterinarianSelected = (veterinarian) => {
  console.log('👨‍⚕️ Vétérinaire sélectionné:', veterinarian)
  selectedVeterinarian.value = veterinarian
}

const closeVeterinarianModal = () => {
  selectedVeterinarian.value = null
}

const goBack = () => {
  router.push('/specialites')
}

// Lifecycle
onMounted(() => {
  loadSpecialite()
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>
