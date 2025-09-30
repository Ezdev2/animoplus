<template>
  <div class="cache-refresh-button">
    <!-- Bouton principal -->
    <button
      @click="toggleDropdown"
      :class="buttonClass"
      class="relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
      :title="buttonTitle"
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
      
      <span v-if="showText">{{ buttonText }}</span>
      
      <!-- Indicateur de statut -->
      <div 
        class="w-2 h-2 rounded-full"
        :class="statusIndicatorClass"
      ></div>
      
      <!-- Flèche dropdown -->
      <svg 
        v-if="showDropdown"
        class="w-3 h-3 transition-transform"
        :class="{ 'rotate-180': isDropdownOpen }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div 
      v-if="showDropdown && isDropdownOpen"
      class="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
    >
      <!-- En-tête -->
      <div class="p-3 border-b border-gray-200">
        <h3 class="font-medium text-gray-900">Gestion du Cache</h3>
        <p class="text-xs text-gray-600 mt-1">{{ cacheStatusText }}</p>
      </div>

      <!-- Actions -->
      <div class="p-2 space-y-1">
        <button
          @click="refreshSpeciesCache"
          :disabled="isRefreshingSpecies"
          class="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
        >
          <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ isRefreshingSpecies ? 'Actualisation...' : 'Actualiser Espèces' }}
        </button>

        <button
          @click="refreshServiceTypesCache"
          :disabled="isRefreshingServiceTypes"
          class="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
        >
          <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ isRefreshingServiceTypes ? 'Actualisation...' : 'Actualiser Services' }}
        </button>

        <button
          @click="refreshAllCaches"
          :disabled="isRefreshing"
          class="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
        >
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ isRefreshing ? 'Actualisation...' : 'Tout Actualiser' }}
        </button>

        <hr class="my-1">

        <button
          @click="clearAllCaches"
          class="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 rounded transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          Vider le Cache
        </button>

        <button
          @click="openCacheManagement"
          class="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 rounded transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Gestion Avancée
        </button>
      </div>
    </div>

    <!-- Overlay pour fermer le dropdown -->
    <div 
      v-if="isDropdownOpen" 
      class="fixed inset-0 z-40" 
      @click="closeDropdown"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { referenceCacheService } from '@/services/cache/referenceCache.js'
import { serviceTypesService } from '@/services/serviceTypes/serviceTypesService.js'
import { speciesService } from '@/services/species/speciesService.js'

// Props
const props = defineProps({
  variant: {
    type: String,
    default: 'default', // 'default', 'primary', 'ghost'
    validator: (value) => ['default', 'primary', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg'
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  showText: {
    type: Boolean,
    default: true
  },
  showDropdown: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['cache-refreshed', 'cache-cleared'])

// Router
const router = useRouter()

// États
const isRefreshing = ref(false)
const isRefreshingSpecies = ref(false)
const isRefreshingServiceTypes = ref(false)
const isDropdownOpen = ref(false)
const cacheStats = ref({})

// Computed
const buttonClass = computed(() => {
  const baseClasses = {
    'default': 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    'primary': 'bg-blue-600 text-white hover:bg-blue-700',
    'ghost': 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
  }
  
  return baseClasses[props.variant] || baseClasses.default
})

const buttonText = computed(() => {
  if (isRefreshing.value) return 'Actualisation...'
  return 'Cache'
})

const buttonTitle = computed(() => {
  if (isRefreshing.value) return 'Actualisation en cours...'
  return 'Gestion du cache des données de référence'
})

const statusIndicatorClass = computed(() => {
  const stats = Object.values(cacheStats.value)
  
  if (stats.some(stat => !stat.exists)) return 'bg-gray-400'
  if (stats.some(stat => stat.exists && !stat.valid)) return 'bg-yellow-500'
  return 'bg-green-500'
})

const cacheStatusText = computed(() => {
  const stats = Object.values(cacheStats.value)
  const totalCaches = stats.length
  const validCaches = stats.filter(stat => stat.exists && stat.valid).length
  
  if (validCaches === totalCaches) return 'Tous les caches sont valides'
  if (validCaches === 0) return 'Aucun cache valide'
  return `${validCaches}/${totalCaches} caches valides`
})

// Fonctions
const loadCacheStats = () => {
  cacheStats.value = referenceCacheService.getCacheStats()
}

const toggleDropdown = () => {
  if (props.showDropdown) {
    isDropdownOpen.value = !isDropdownOpen.value
  } else {
    // Si pas de dropdown, actualiser directement
    refreshAllCaches()
  }
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const refreshSpeciesCache = async () => {
  isRefreshingSpecies.value = true
  closeDropdown()
  
  try {
    await speciesService.forceRefreshCache()
    
    loadCacheStats()
    emit('cache-refreshed', { type: 'species' })
    
  } catch (error) {
    console.error('❌ Erreur actualisation cache espèces:', error)
  } finally {
    isRefreshingSpecies.value = false
  }
}

const refreshServiceTypesCache = async () => {
  isRefreshingServiceTypes.value = true
  closeDropdown()
  
  try {
    await serviceTypesService.forceRefreshCache()
    
    loadCacheStats()
    emit('cache-refreshed', { type: 'service_types' })
    
  } catch (error) {
    console.error('❌ Erreur actualisation cache types de services:', error)
  } finally {
    isRefreshingServiceTypes.value = false
  }
}

const refreshAllCaches = async () => {
  isRefreshing.value = true
  closeDropdown()
  
  try {
    await Promise.all([
      refreshSpeciesCache(),
      refreshServiceTypesCache()
    ])
    
    emit('cache-refreshed', { type: 'all' })
    
  } catch (error) {
    console.error('❌ Erreur actualisation globale:', error)
  } finally {
    isRefreshing.value = false
  }
}

const clearAllCaches = () => {
  if (!confirm('Êtes-vous sûr de vouloir vider tous les caches ?')) {
    return
  }
  
  closeDropdown()
  
  try {
    referenceCacheService.clearAllCaches()
    loadCacheStats()
    emit('cache-cleared')
    
  } catch (error) {
    console.error('❌ Erreur nettoyage caches:', error)
  }
}

const openCacheManagement = () => {
  closeDropdown()
  router.push('/admin/cache-management')
}

// Gestion des clics extérieurs
const handleClickOutside = (event) => {
  if (!event.target.closest('.cache-refresh-button')) {
    closeDropdown()
  }
}

// Lifecycle
onMounted(() => {
  loadCacheStats()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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

.rotate-180 {
  transform: rotate(180deg);
}
</style>
