<template>
  <div class="specialite-veterinarians">
    <!-- En-tête -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">
            Vétérinaires {{ specialiteName }}
          </h2>
          <p class="text-gray-600">
            {{ totalVeterinarians }} vétérinaire{{ totalVeterinarians > 1 ? 's' : '' }} spécialisé{{ totalVeterinarians > 1 ? 's' : '' }}
          </p>
        </div>
      </div>
      
      <!-- Filtres -->
      <div class="flex items-center gap-3">
        <div class="relative">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Rechercher un vétérinaire..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="debouncedSearch"
          />
          <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        
        <select
          v-model="activeOnly"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @change="loadVeterinarians"
        >
          <option :value="null">Tous les vétérinaires</option>
          <option :value="true">Actifs uniquement</option>
          <option :value="false">Inactifs uniquement</option>
        </select>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-3">
        <div class="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span class="text-gray-600">Chargement des vétérinaires...</span>
      </div>
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="text-red-700 font-medium">Erreur de chargement</span>
      </div>
      <p class="text-red-600 mt-1">{{ error }}</p>
    </div>

    <!-- Aucun vétérinaire -->
    <div v-else-if="veterinarians.length === 0" class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun vétérinaire trouvé</h3>
      <p class="text-gray-600">
        {{ searchTerm ? 'Aucun vétérinaire ne correspond à votre recherche.' : 'Aucun vétérinaire n\'est spécialisé dans ce domaine pour le moment.' }}
      </p>
    </div>

    <!-- Liste des vétérinaires -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="veterinarian in veterinarians"
        :key="veterinarian.id"
        class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
        @click="viewVeterinarianProfile(veterinarian)"
      >
        <!-- Avatar et nom -->
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {{ getInitials(veterinarian.user?.name || veterinarian.name) }}
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">
              {{ veterinarian.user?.name || veterinarian.name || 'Nom non disponible' }}
            </h3>
            <p class="text-sm text-gray-600">
              {{ veterinarian.user?.email || veterinarian.email || 'Email non disponible' }}
            </p>
          </div>
        </div>

        <!-- Niveau de certification -->
        <div v-if="veterinarian.certification_level" class="mb-3">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-700">Niveau :</span>
            <span 
              class="px-2 py-1 rounded-full text-xs font-medium text-white"
              :style="{ backgroundColor: getCertificationColor(veterinarian.certification_level) }"
            >
              {{ getCertificationIcon(veterinarian.certification_level) }} {{ getCertificationLabel(veterinarian.certification_level) }}
            </span>
          </div>
        </div>

        <!-- Statut -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div 
              class="w-2 h-2 rounded-full"
              :class="veterinarian.is_active ? 'bg-green-500' : 'bg-gray-400'"
            ></div>
            <span class="text-sm text-gray-600">
              {{ veterinarian.is_active ? 'Actif' : 'Inactif' }}
            </span>
          </div>
          
          <!-- Bouton voir profil -->
          <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Voir profil →
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.last_page > 1" class="flex items-center justify-between mt-8">
      <div class="text-sm text-gray-600">
        Affichage de {{ pagination.from }} à {{ pagination.to }} sur {{ pagination.total }} vétérinaires
      </div>
      
      <div class="flex items-center gap-2">
        <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page <= 1"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Précédent
        </button>
        
        <span class="px-3 py-2 text-sm font-medium text-gray-700">
          Page {{ pagination.current_page }} sur {{ pagination.last_page }}
        </span>
        
        <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page >= pagination.last_page"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useSpecialites } from '@/composables/useSpecialites.js'

// Props
const props = defineProps({
  specialiteId: {
    type: String,
    required: true
  },
  specialiteName: {
    type: String,
    default: 'en spécialité'
  }
})

// Emits
const emit = defineEmits(['veterinarian-selected'])

// Composable
const { getSpecialiteVeterinarians, isLoading, error } = useSpecialites()

// État local
const veterinarians = ref([])
const pagination = ref(null)
const searchTerm = ref('')
const activeOnly = ref(true)
const currentPage = ref(1)

// Computed
const totalVeterinarians = computed(() => pagination.value?.total || veterinarians.value.length)

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

const getCertificationIcon = (level) => {
  const icons = {
    'junior': '🌱',
    'senior': '🎯',
    'expert': '⭐'
  }
  return icons[level] || '📋'
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
const loadVeterinarians = async () => {
  try {
    const options = {
      page: currentPage.value,
      per_page: 12,
      with_profile: true,
      with_user: true
    }
    
    if (searchTerm.value) {
      options.search = searchTerm.value
    }
    
    if (activeOnly.value !== null) {
      options.active_only = activeOnly.value
    }
    
    console.log('🔍 Chargement vétérinaires spécialité:', props.specialiteId, options)
    
    const response = await getSpecialiteVeterinarians(props.specialiteId, options)
    
    if (response.success) {
      veterinarians.value = response.data || []
      pagination.value = response.pagination || null
      console.log('✅ Vétérinaires chargés:', veterinarians.value.length)
    }
  } catch (err) {
    console.error('❌ Erreur chargement vétérinaires:', err)
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value?.last_page) {
    currentPage.value = page
    loadVeterinarians()
  }
}

const viewVeterinarianProfile = (veterinarian) => {
  console.log('👨‍⚕️ Voir profil vétérinaire:', veterinarian)
  emit('veterinarian-selected', veterinarian)
}

// Debounce pour la recherche
let searchTimeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadVeterinarians()
  }, 500)
}

// Watchers
watch(() => props.specialiteId, () => {
  if (props.specialiteId) {
    currentPage.value = 1
    loadVeterinarians()
  }
})

// Lifecycle
onMounted(() => {
  if (props.specialiteId) {
    loadVeterinarians()
  }
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
