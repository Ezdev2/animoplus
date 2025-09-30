<template>
  <div class="cache-management bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Gestion du Cache</h2>
        <p class="text-gray-600 mt-1">Gérer les données de référence en cache</p>
      </div>
      
      <!-- Indicateur statut global -->
      <div class="flex items-center gap-2">
        <div 
          class="w-3 h-3 rounded-full"
          :class="globalCacheStatus === 'valid' ? 'bg-green-500' : globalCacheStatus === 'expired' ? 'bg-yellow-500' : 'bg-red-500'"
        ></div>
        <span class="text-sm font-medium text-gray-700">
          {{ globalCacheStatusText }}
        </span>
      </div>
    </div>

    <!-- Informations du cache -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Cache des espèces -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-900">Cache des Espèces</h3>
          <span 
            class="px-2 py-1 rounded-full text-xs font-medium"
            :class="speciesCacheStatus === 'valid' ? 'bg-green-100 text-green-800' : speciesCacheStatus === 'expired' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'"
          >
            {{ speciesCacheStatusText }}
          </span>
        </div>
        
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Éléments :</span>
            <span class="font-medium">{{ speciesCacheInfo.count || 0 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Dernière MAJ :</span>
            <span class="font-medium">{{ speciesCacheInfo.lastUpdate || 'Jamais' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Expire :</span>
            <span class="font-medium">{{ speciesCacheInfo.expiresAt || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <!-- Cache des types de services -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-900">Cache Types de Services</h3>
          <span 
            class="px-2 py-1 rounded-full text-xs font-medium"
            :class="serviceTypesCacheStatus === 'valid' ? 'bg-green-100 text-green-800' : serviceTypesCacheStatus === 'expired' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'"
          >
            {{ serviceTypesCacheStatusText }}
          </span>
        </div>
        
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Éléments :</span>
            <span class="font-medium">{{ serviceTypesCacheInfo.count || 0 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Dernière MAJ :</span>
            <span class="font-medium">{{ serviceTypesCacheInfo.lastUpdate || 'Jamais' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Expire :</span>
            <span class="font-medium">{{ serviceTypesCacheInfo.expiresAt || 'N/A' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="space-y-4">
      <div class="flex flex-wrap gap-3">
        <!-- Actualiser tout -->
        <button
          @click="refreshAllCaches"
          :disabled="isRefreshing"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg 
            class="w-4 h-4" 
            :class="{ 'animate-spin': isRefreshing }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ isRefreshing ? 'Actualisation...' : 'Actualiser Tout' }}
        </button>

        <!-- Actualiser espèces -->
        <button
          @click="refreshSpeciesCache"
          :disabled="isRefreshingSpecies"
          class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg 
            class="w-4 h-4" 
            :class="{ 'animate-spin': isRefreshingSpecies }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ isRefreshingSpecies ? 'Actualisation...' : 'Actualiser Espèces' }}
        </button>

        <!-- Actualiser types de services -->
        <button
          @click="refreshServiceTypesCache"
          :disabled="isRefreshingServiceTypes"
          class="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg 
            class="w-4 h-4" 
            :class="{ 'animate-spin': isRefreshingServiceTypes }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ isRefreshingServiceTypes ? 'Actualisation...' : 'Actualiser Services' }}
        </button>

        <!-- Vider tout le cache -->
        <button
          @click="clearAllCaches"
          :disabled="isClearing"
          class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          {{ isClearing ? 'Suppression...' : 'Vider le Cache' }}
        </button>
      </div>

      <!-- Messages de statut -->
      <div v-if="statusMessage" class="p-4 rounded-lg" :class="statusMessageClass">
        <div class="flex items-center gap-2">
          <svg 
            class="w-5 h-5" 
            :class="statusMessage.type === 'success' ? 'text-green-500' : statusMessage.type === 'error' ? 'text-red-500' : 'text-blue-500'"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              v-if="statusMessage.type === 'success'"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M5 13l4 4L19 7"
            />
            <path 
              v-else-if="statusMessage.type === 'error'"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path 
              v-else
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="font-medium">{{ statusMessage.text }}</span>
        </div>
      </div>
    </div>

    <!-- Informations techniques -->
    <details class="mt-6">
      <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
        Informations techniques
      </summary>
      <div class="mt-3 p-4 bg-gray-50 rounded-lg text-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Configuration Cache</h4>
            <ul class="space-y-1 text-gray-600">
              <li>Durée : 24 heures</li>
              <li>Version : {{ cacheVersion }}</li>
              <li>Stockage : localStorage</li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Utilisation Stockage</h4>
            <ul class="space-y-1 text-gray-600">
              <li>Utilisé : {{ storageUsage.used }}</li>
              <li>Disponible : {{ storageUsage.available }}</li>
              <li>Pourcentage : {{ storageUsage.percentage }}%</li>
            </ul>
          </div>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { referenceCacheService } from '@/services/cache/referenceCache.js'
import { speciesService } from '@/services/species/speciesService.js'
import { serviceTypesService } from '@/services/serviceTypes/serviceTypesService.js'

// États
const isRefreshing = ref(false)
const isRefreshingSpecies = ref(false)
const isRefreshingServiceTypes = ref(false)
const isClearing = ref(false)
const statusMessage = ref(null)

// Informations du cache
const speciesCacheInfo = ref({})
const serviceTypesCacheInfo = ref({})
const cacheVersion = ref('1.0')

// Computed
const speciesCacheStatus = computed(() => {
  if (!speciesCacheInfo.value.exists) return 'empty'
  if (speciesCacheInfo.value.expired) return 'expired'
  return 'valid'
})

const serviceTypesCacheStatus = computed(() => {
  if (!serviceTypesCacheInfo.value.exists) return 'empty'
  if (serviceTypesCacheInfo.value.expired) return 'expired'
  return 'valid'
})

const globalCacheStatus = computed(() => {
  if (speciesCacheStatus.value === 'empty' || serviceTypesCacheStatus.value === 'empty') return 'empty'
  if (speciesCacheStatus.value === 'expired' || serviceTypesCacheStatus.value === 'expired') return 'expired'
  return 'valid'
})

const speciesCacheStatusText = computed(() => {
  const status = speciesCacheStatus.value
  return status === 'valid' ? 'Valide' : status === 'expired' ? 'Expiré' : 'Vide'
})

const serviceTypesCacheStatusText = computed(() => {
  const status = serviceTypesCacheStatus.value
  return status === 'valid' ? 'Valide' : status === 'expired' ? 'Expiré' : 'Vide'
})

const globalCacheStatusText = computed(() => {
  const status = globalCacheStatus.value
  return status === 'valid' ? 'Cache Valide' : status === 'expired' ? 'Cache Expiré' : 'Cache Vide'
})

const statusMessageClass = computed(() => {
  if (!statusMessage.value) return ''
  const type = statusMessage.value.type
  return type === 'success' ? 'bg-green-50 border border-green-200' : 
         type === 'error' ? 'bg-red-50 border border-red-200' : 
         'bg-blue-50 border border-blue-200'
})

const storageUsage = computed(() => {
  try {
    let used = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length
      }
    }
    
    const usedMB = (used / 1024 / 1024).toFixed(2)
    const availableMB = (5 - usedMB).toFixed(2) // Approximation 5MB limit
    const percentage = ((used / (5 * 1024 * 1024)) * 100).toFixed(1)
    
    return {
      used: `${usedMB} MB`,
      available: `${availableMB} MB`,
      percentage: percentage
    }
  } catch (error) {
    return {
      used: 'N/A',
      available: 'N/A', 
      percentage: 'N/A'
    }
  }
})

// Fonctions
const showMessage = (type, text) => {
  statusMessage.value = { type, text }
  setTimeout(() => {
    statusMessage.value = null
  }, 5000)
}

const loadCacheInfo = () => {
  // Informations cache espèces
  const speciesKey = referenceCacheService.config.STORAGE_KEYS.SPECIES
  const speciesData = referenceCacheService.getFromCache(speciesKey)
  const speciesValid = referenceCacheService.isCacheValid(speciesKey)
  
  speciesCacheInfo.value = {
    exists: !!speciesData,
    expired: !speciesValid && !!speciesData,
    count: Array.isArray(speciesData) ? speciesData.length : 0,
    lastUpdate: getLastUpdateTime(speciesKey),
    expiresAt: getExpirationTime(speciesKey)
  }

  // Informations cache types de services
  const serviceTypesKey = referenceCacheService.config.STORAGE_KEYS.SERVICE_TYPES
  const serviceTypesData = referenceCacheService.getFromCache(serviceTypesKey)
  const serviceTypesValid = referenceCacheService.isCacheValid(serviceTypesKey)
  
  serviceTypesCacheInfo.value = {
    exists: !!serviceTypesData,
    expired: !serviceTypesValid && !!serviceTypesData,
    count: Array.isArray(serviceTypesData) ? serviceTypesData.length : 0,
    lastUpdate: getLastUpdateTime(serviceTypesKey),
    expiresAt: getExpirationTime(serviceTypesKey)
  }

  cacheVersion.value = referenceCacheService.config.CACHE_VERSION
}

const getLastUpdateTime = (cacheKey) => {
  try {
    const cached = localStorage.getItem(cacheKey)
    if (!cached) return null
    
    const data = JSON.parse(cached)
    return new Date(data.timestamp).toLocaleString('fr-FR')
  } catch (error) {
    return null
  }
}

const getExpirationTime = (cacheKey) => {
  try {
    const cached = localStorage.getItem(cacheKey)
    if (!cached) return null
    
    const data = JSON.parse(cached)
    const expirationTime = data.timestamp + referenceCacheService.config.CACHE_DURATION
    return new Date(expirationTime).toLocaleString('fr-FR')
  } catch (error) {
    return null
  }
}

const refreshSpeciesCache = async () => {
  isRefreshingSpecies.value = true
  
  try {
    console.log('🔄 Actualisation forcée du cache des espèces...')
    
    // Forcer la mise à jour via le service
    await speciesService.forceRefreshCache()
    
    loadCacheInfo()
    showMessage('success', 'Cache des espèces actualisé avec succès')
    
  } catch (error) {
    console.error('❌ Erreur actualisation cache espèces:', error)
    showMessage('error', 'Erreur lors de l\'actualisation du cache des espèces')
  } finally {
    isRefreshingSpecies.value = false
  }
}

const refreshServiceTypesCache = async () => {
  isRefreshingServiceTypes.value = true
  
  try {
    console.log('🔄 Actualisation forcée du cache des types de services...')
    
    // Forcer la mise à jour via le service
    await serviceTypesService.forceRefreshCache()
    
    loadCacheInfo()
    showMessage('success', 'Cache des types de services actualisé avec succès')
    
  } catch (error) {
    console.error('❌ Erreur actualisation cache types de services:', error)
    showMessage('error', 'Erreur lors de l\'actualisation du cache des types de services')
  } finally {
    isRefreshingServiceTypes.value = false
  }
}

const refreshAllCaches = async () => {
  isRefreshing.value = true
  
  try {
    console.log('🔄 Actualisation forcée de tous les caches...')
    
    // Actualiser tous les caches
    await Promise.all([
      refreshSpeciesCache(),
      refreshServiceTypesCache()
    ])
    
    showMessage('success', 'Tous les caches ont été actualisés avec succès')
    
  } catch (error) {
    console.error('❌ Erreur actualisation globale:', error)
    showMessage('error', 'Erreur lors de l\'actualisation des caches')
  } finally {
    isRefreshing.value = false
  }
}

const clearAllCaches = () => {
  isClearing.value = true
  
  try {
    console.log('🗑️ Suppression de tous les caches...')
    
    referenceCacheService.clearAllCaches()
    
    loadCacheInfo()
    showMessage('success', 'Tous les caches ont été vidés')
    
  } catch (error) {
    console.error('❌ Erreur suppression caches:', error)
    showMessage('error', 'Erreur lors de la suppression des caches')
  } finally {
    isClearing.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadCacheInfo()
})
</script>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
