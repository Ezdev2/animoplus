<template>
  <div class="veterinarians-example p-6 bg-white rounded-lg shadow-sm border">
    <h2 class="text-xl font-bold mb-4">🧪 Test des Endpoints Vétérinaires par Spécialité</h2>
    
    <!-- Sélection de spécialité -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Sélectionner une spécialité :
      </label>
      <div class="flex gap-3">
        <select 
          v-model="selectedSpecialiteId"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @change="loadVeterinarians"
        >
          <option value="">Choisir une spécialité...</option>
          <option 
            v-for="specialite in specialites" 
            :key="specialite.id" 
            :value="specialite.id"
          >
            {{ specialite.name }}
          </option>
        </select>
        
        <button 
          @click="loadSpecialites"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          :disabled="isLoadingSpecialites"
        >
          {{ isLoadingSpecialites ? '⏳' : '🔄' }} Recharger
        </button>
      </div>
    </div>

    <!-- Options de test -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Actifs uniquement :</label>
        <select v-model="activeOnly" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option :value="null">Tous</option>
          <option :value="true">Actifs seulement</option>
          <option :value="false">Inactifs seulement</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Par page :</label>
        <select v-model="perPage" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="15">15</option>
          <option :value="20">20</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Recherche :</label>
        <input 
          v-model="searchTerm"
          type="text"
          placeholder="Nom du vétérinaire..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    </div>

    <!-- Bouton de test -->
    <div class="mb-6">
      <button 
        @click="loadVeterinarians"
        :disabled="!selectedSpecialiteId || isLoading"
        class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isLoading ? '⏳ Chargement...' : '🚀 Tester l\'Endpoint' }}
      </button>
    </div>

    <!-- URL générée -->
    <div v-if="generatedUrl" class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="font-medium text-gray-900 mb-2">URL générée :</h3>
      <code class="text-sm text-blue-600 break-all">{{ generatedUrl }}</code>
    </div>

    <!-- Résultats -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-flex items-center gap-2">
        <div class="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span>Chargement des vétérinaires...</span>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <h3 class="font-medium text-red-800 mb-1">❌ Erreur</h3>
      <p class="text-red-600 text-sm">{{ error }}</p>
    </div>

    <div v-else-if="veterinarians.length > 0">
      <!-- Statistiques -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 class="font-medium text-blue-800 mb-2">📊 Résultats</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span class="text-blue-600 font-medium">Total :</span>
            <span class="ml-1">{{ pagination?.total || veterinarians.length }}</span>
          </div>
          <div>
            <span class="text-blue-600 font-medium">Page :</span>
            <span class="ml-1">{{ pagination?.current_page || 1 }}/{{ pagination?.last_page || 1 }}</span>
          </div>
          <div>
            <span class="text-blue-600 font-medium">Par page :</span>
            <span class="ml-1">{{ pagination?.per_page || veterinarians.length }}</span>
          </div>
          <div>
            <span class="text-blue-600 font-medium">Affichés :</span>
            <span class="ml-1">{{ veterinarians.length }}</span>
          </div>
        </div>
      </div>

      <!-- Liste des vétérinaires -->
      <div class="space-y-3">
        <h3 class="font-medium text-gray-900">👨‍⚕️ Vétérinaires trouvés :</h3>
        <div 
          v-for="(vet, index) in veterinarians" 
          :key="vet.id || index"
          class="flex items-center gap-4 p-3 border border-gray-200 rounded-lg"
        >
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {{ getInitials(vet.user?.name || vet.name) }}
          </div>
          
          <div class="flex-1">
            <div class="font-medium text-gray-900">
              {{ vet.user?.name || vet.name || 'Nom non disponible' }}
            </div>
            <div class="text-sm text-gray-600">
              {{ vet.user?.email || vet.email || 'Email non disponible' }}
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <span 
              v-if="vet.certification_level"
              class="px-2 py-1 rounded-full text-xs font-medium text-white"
              :style="{ backgroundColor: getCertificationColor(vet.certification_level) }"
            >
              {{ getCertificationLabel(vet.certification_level) }}
            </span>
            
            <div 
              class="w-2 h-2 rounded-full"
              :class="vet.is_active ? 'bg-green-500' : 'bg-gray-400'"
              :title="vet.is_active ? 'Actif' : 'Inactif'"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="selectedSpecialiteId && !isLoading" class="text-center py-8 text-gray-500">
      Aucun vétérinaire trouvé pour cette spécialité.
    </div>

    <!-- Données brutes (pour debug) -->
    <details v-if="lastResponse" class="mt-6">
      <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
        🔍 Voir les données brutes (debug)
      </summary>
      <pre class="mt-2 p-4 bg-gray-100 rounded-lg text-xs overflow-auto">{{ JSON.stringify(lastResponse, null, 2) }}</pre>
    </details>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useSpecialites } from '@/composables/useSpecialites.js'

// Composable
const { 
  fetchSpecialites, 
  getSpecialiteVeterinarians, 
  specialites, 
  isLoading: isLoadingSpecialites 
} = useSpecialites()

// État local
const selectedSpecialiteId = ref('')
const veterinarians = ref([])
const pagination = ref(null)
const isLoading = ref(false)
const error = ref(null)
const lastResponse = ref(null)

// Options de test
const activeOnly = ref(true)
const perPage = ref(10)
const searchTerm = ref('')

// Computed
const generatedUrl = computed(() => {
  if (!selectedSpecialiteId.value) return ''
  
  let url = `/api/specialites/${selectedSpecialiteId.value}/veterinarians`
  const params = []
  
  if (activeOnly.value !== null) params.push(`active_only=${activeOnly.value}`)
  if (perPage.value) params.push(`per_page=${perPage.value}`)
  if (searchTerm.value) params.push(`search=${encodeURIComponent(searchTerm.value)}`)
  
  if (params.length > 0) {
    url += '?' + params.join('&')
  }
  
  return url
})

// Fonctions utilitaires
const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getCertificationLabel = (level) => {
  const labels = {
    'junior': 'Junior',
    'senior': 'Senior',
    'expert': 'Expert'
  }
  return labels[level] || level
}

const getCertificationColor = (level) => {
  const colors = {
    'junior': '#10B981',
    'senior': '#3B82F6', 
    'expert': '#F59E0B'
  }
  return colors[level] || '#6B7280'
}

// Fonctions principales
const loadSpecialites = async () => {
  try {
    await fetchSpecialites({ is_active: true, per_page: 50 })
    console.log('✅ Spécialités chargées:', specialites.value?.length || 0)
  } catch (err) {
    console.error('❌ Erreur chargement spécialités:', err)
  }
}

const loadVeterinarians = async () => {
  if (!selectedSpecialiteId.value) return
  
  isLoading.value = true
  error.value = null
  veterinarians.value = []
  pagination.value = null
  lastResponse.value = null
  
  try {
    const options = {
      per_page: perPage.value,
      with_profile: true,
      with_user: true
    }
    
    if (activeOnly.value !== null) {
      options.active_only = activeOnly.value
    }
    
    if (searchTerm.value) {
      options.search = searchTerm.value
    }
    
    console.log('🚀 Test endpoint vétérinaires:', selectedSpecialiteId.value, options)
    console.log('🔗 URL:', generatedUrl.value)
    
    const response = await getSpecialiteVeterinarians(selectedSpecialiteId.value, options)
    
    lastResponse.value = response
    
    if (response.success) {
      veterinarians.value = response.data || []
      pagination.value = response.pagination || null
      console.log('✅ Vétérinaires récupérés:', veterinarians.value.length)
    } else {
      error.value = response.error || 'Erreur lors de la récupération des vétérinaires'
    }
  } catch (err) {
    console.error('❌ Erreur test endpoint:', err)
    error.value = err.message || 'Erreur lors du test de l\'endpoint'
  } finally {
    isLoading.value = false
  }
}

// Watchers
watch([activeOnly, perPage, searchTerm], () => {
  if (selectedSpecialiteId.value) {
    // Debounce pour la recherche
    clearTimeout(window.searchTimeout)
    window.searchTimeout = setTimeout(loadVeterinarians, 500)
  }
})

// Lifecycle
onMounted(() => {
  loadSpecialites()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
