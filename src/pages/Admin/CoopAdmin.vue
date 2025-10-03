<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Administration Coopération</h2>
          <p class="text-gray-600">Modération des annonces d'animaux perdus/trouvés</p>
        </div>
        <div class="flex gap-3">
          <button @click="refreshData" 
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            🔄 Actualiser
          </button>
        </div>
      </div>
    </div>

    <!-- Statistiques -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Statistiques en temps réel</h3>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Données live</span>
        </div>
      </div>
      <div class="text-sm text-gray-600 mb-4">
        Total des annonces : <span class="font-semibold">{{ totalAnnouncements }}</span>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">En attente</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.pending }}</p>
            <p class="text-xs text-gray-500">{{ getPercentage(stats.pending) }}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Approuvées</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.approved }}</p>
            <p class="text-xs text-gray-500">{{ getPercentage(stats.approved) }}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Rejetées</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.rejected }}</p>
            <p class="text-xs text-gray-500">{{ getPercentage(stats.rejected) }}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Résolues</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.resolved }}</p>
            <p class="text-xs text-gray-500">{{ getPercentage(stats.resolved) }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex gap-2">
          <button v-for="status in statusFilters" :key="status.value"
            @click="onStatusChange(status.value)"
            :disabled="isLoading"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              selectedStatus === status.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            ]">
            {{ status.label }}
          </button>
        </div>
        
        <div class="flex-1 min-w-64">
          <input type="text" v-model="searchQuery" @input="onSearchChange" placeholder="Rechercher par nom, description..." 
            :disabled="isLoading"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50" />
        </div>
        
        <select v-model="typeFilter" @change="onTypeChange" :disabled="isLoading"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
          <option value="">Tous les types</option>
          <option value="lost">Animaux perdus</option>
          <option value="found">Animaux trouvés</option>
        </select>
      </div>
    </div>

    <!-- Liste des annonces -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          Annonces {{ selectedStatus === 'all' ? '' : statusFilters.find(s => s.value === selectedStatus)?.label.toLowerCase() }} 
          ({{ announcements.length }})
          <span v-if="pagination.total > 0" class="text-sm text-gray-500 font-normal">
            - {{ pagination.from }}-{{ pagination.to }} sur {{ pagination.total }}
          </span>
        </h3>
      </div>
      
      <!-- Loading state -->
      <div v-if="isLoading" class="p-6 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Chargement des annonces...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="p-6 text-center">
        <div class="text-red-500 text-lg mb-2">❌</div>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="refreshData" 
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Réessayer
        </button>
      </div>
      
      <!-- Liste des annonces -->
      <div v-else-if="announcements.length > 0" class="divide-y divide-gray-200">
        <div v-for="announcement in announcements" :key="announcement.id" 
          class="p-6 hover:bg-gray-50">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <span :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  announcement.type === 'lost'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                ]">
                  {{ announcement.type === 'lost' ? '❌ PERDU' : '✅ TROUVÉ' }}
                </span>
                
                <span :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  getStatusClass(announcement.status)
                ]">
                  {{ getStatusLabel(announcement.status) }}
                </span>
                
                <span class="text-sm text-gray-500">
                  {{ formatDate(announcement.created_at) }}
                </span>
              </div>
              
              <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ announcement.name }}</h4>
              <p class="text-gray-700 mb-2">{{ announcement.description }}</p>
              
              <div class="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span>📍 {{ announcement.location }}</span>
                <span>🐕 {{ announcement.animal_type }}</span>
                <span>👤 {{ announcement.contact_name }}</span>
              </div>
              
              <div v-if="announcement.reward" class="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3 inline-block">
                <span class="text-yellow-800 text-sm">💰 Récompense: {{ announcement.reward }}</span>
              </div>
            </div>
            
            <!-- Actions de modération -->
            <div v-if="announcement.status === 'pending'" class="flex gap-2 ml-4">
              <button @click="approveAnnouncement(announcement)" 
                :disabled="processingActions.has(`approve-${announcement.id}`)"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="processingActions.has(`approve-${announcement.id}`)">🔄</span>
                <span v-else>✅</span>
                {{ processingActions.has(`approve-${announcement.id}`) ? 'Approbation...' : 'Approuver' }}
              </button>
              <button @click="rejectAnnouncement(announcement)" 
                :disabled="processingActions.has(`reject-${announcement.id}`)"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="processingActions.has(`reject-${announcement.id}`)">🔄</span>
                <span v-else>❌</span>
                {{ processingActions.has(`reject-${announcement.id}`) ? 'Rejet...' : 'Rejeter' }}
              </button>
            </div>
            
            <div v-else class="flex gap-2 ml-4">
              <button @click="viewDetails(announcement)" 
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                👁️ Voir détails
              </button>
              <button v-if="announcement.status === 'approved'" @click="markAsResolved(announcement)" 
                :disabled="processingActions.has(`resolve-${announcement.id}`)"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="processingActions.has(`resolve-${announcement.id}`)">🔄</span>
                <span v-else>🎉</span>
                {{ processingActions.has(`resolve-${announcement.id}`) ? 'Résolution...' : 'Marquer résolu' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- État vide -->
      <div v-else class="text-center py-12">
        <div class="text-gray-400 text-lg mb-2">📋</div>
        <p class="text-gray-500">Aucune annonce trouvée</p>
        <p class="text-sm text-gray-400 mt-2">
          {{ selectedStatus === 'all' ? 'Aucune annonce disponible' : `Aucune annonce ${statusFilters.find(s => s.value === selectedStatus)?.label.toLowerCase()}` }}
        </p>
      </div>
    </div>

    <!-- Modal de détails -->
    <div v-if="selectedAnnouncement" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-semibold text-gray-900">Détails de l'annonce</h3>
          <button @click="selectedAnnouncement = null" class="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Type</label>
              <p class="text-gray-900">{{ selectedAnnouncement.type === 'lost' ? 'Animal perdu' : 'Animal trouvé' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Animal</label>
              <p class="text-gray-900">{{ selectedAnnouncement.animal_type }}</p>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Nom/Description</label>
            <p class="text-gray-900">{{ selectedAnnouncement.name }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Description détaillée</label>
            <p class="text-gray-900">{{ selectedAnnouncement.description }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Lieu</label>
            <p class="text-gray-900">{{ selectedAnnouncement.location }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Contact</label>
              <p class="text-gray-900">{{ selectedAnnouncement.contact_name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Téléphone</label>
              <p class="text-gray-900">{{ selectedAnnouncement.contact_phone }}</p>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <p class="text-gray-900">{{ selectedAnnouncement.contact_email }}</p>
          </div>
          
          <div v-if="selectedAnnouncement.reward">
            <label class="block text-sm font-medium text-gray-700">Récompense</label>
            <p class="text-gray-900">{{ selectedAnnouncement.reward }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { lostAnimalsService } from '@/services/lostAnimals/lostAnimalsService.js'

// État réactif
const announcements = ref([])
const selectedStatus = ref('pending')
const searchQuery = ref('')
const typeFilter = ref('')
const selectedAnnouncement = ref(null)
const isLoading = ref(false)
const error = ref(null)
const processingActions = ref(new Set()) // Pour tracker les actions en cours

// Pagination
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0
})

// Statistiques
const stats = ref({
  pending: 0,
  approved: 0,
  rejected: 0,
  resolved: 0
})

// Filtres de statut
const statusFilters = [
  { value: 'pending', label: 'En attente' },
  { value: 'approved', label: 'Approuvées' },
  { value: 'rejected', label: 'Rejetées' },
  { value: 'resolved', label: 'Résolues' },
  { value: 'all', label: 'Toutes' }
]

// Computed pour les statistiques basées sur les vraies données
const allAnnouncements = ref([]) // Pour stocker toutes les annonces pour les stats

// Le filtrage se fait maintenant côté API via les paramètres de requête

// Computed properties
const totalAnnouncements = computed(() => {
  return stats.value.pending + stats.value.approved + stats.value.rejected + stats.value.resolved
})

// Méthodes
const fetchAnnouncements = async (filters = {}) => {
  isLoading.value = true
  error.value = null
  
  try {
    console.log('🔍 Récupération des annonces avec filtres:', filters)
    
    const options = {
      ...filters,
      per_page: 15
    }
    
    const result = await lostAnimalsService.getLostAnimals(options)
    console.log('📦 Résultat service:', result)
    
    if (result.success) {
      announcements.value = result.data || []
      pagination.value = result.pagination || {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: announcements.value.length,
        from: 1,
        to: announcements.value.length
      }
      
      console.log('✅ Annonces chargées:', announcements.value.length)
      
      // Si on récupère toutes les annonces (pas de filtre), on peut calculer les stats directement
      if (!filters.status && !filters.search && !filters.type) {
        console.log('📊 Calcul des stats depuis les annonces principales (pas de filtre)')
        const directStats = {
          pending: announcements.value.filter(a => a.status === 'pending').length,
          approved: announcements.value.filter(a => a.status === 'approved').length,
          rejected: announcements.value.filter(a => a.status === 'rejected').length,
          resolved: announcements.value.filter(a => a.status === 'resolved').length
        }
        stats.value = { ...directStats }
        console.log('📊 Stats calculées directement:', stats.value)
      }
    } else {
      error.value = result.error || 'Erreur lors du chargement des annonces'
      console.error('❌ Erreur service:', result.error)
    }
  } catch (err) {
    error.value = err.message || 'Erreur lors du chargement des annonces'
    console.error('❌ Erreur fetch:', err)
  } finally {
    isLoading.value = false
  }
}

const fetchAllForStats = async () => {
  try {
    console.log('📊 Récupération de toutes les annonces pour stats')
    
    // Récupérer la première page pour connaître le total
    const firstResult = await lostAnimalsService.getLostAnimals({ per_page: 100, page: 1 })
    
    if (firstResult.success) {
      let allData = [...(firstResult.data || [])]
      const totalPages = firstResult.pagination?.last_page || 1
      
      console.log('📊 Première page récupérée:', {
        annonces: allData.length,
        totalPages: totalPages,
        total: firstResult.pagination?.total
      })
      
      // Si il y a plusieurs pages, récupérer les autres
      if (totalPages > 1) {
        console.log('📊 Récupération des pages supplémentaires...')
        const promises = []
        
        for (let page = 2; page <= Math.min(totalPages, 10); page++) { // Limiter à 10 pages max pour éviter trop de requêtes
          promises.push(lostAnimalsService.getLostAnimals({ per_page: 100, page }))
        }
        
        const results = await Promise.all(promises)
        
        results.forEach((result, index) => {
          if (result.success) {
            allData = [...allData, ...(result.data || [])]
            console.log(`📊 Page ${index + 2} ajoutée: ${result.data?.length || 0} annonces`)
          }
        })
      }
      
      allAnnouncements.value = allData
      
      // Calculer les statistiques basées sur les vraies données
      const realStats = {
        pending: allAnnouncements.value.filter(a => a.status === 'pending').length,
        approved: allAnnouncements.value.filter(a => a.status === 'approved').length,
        rejected: allAnnouncements.value.filter(a => a.status === 'rejected').length,
        resolved: allAnnouncements.value.filter(a => a.status === 'resolved').length
      }
      
      // Utiliser les vraies statistiques - FORCER la réactivité
      stats.value = { ...realStats }
      
      console.log('📊 Statistiques réelles calculées:', stats.value)
      console.log('📊 Total des annonces récupérées:', allAnnouncements.value.length)
      console.log('📊 Répartition par statut:', realStats)
    }
  } catch (err) {
    console.error('❌ Erreur stats:', err)
    // En cas d'erreur, garder les stats à 0
    stats.value = {
      pending: 0,
      approved: 0,
      rejected: 0,
      resolved: 0
    }
  }
}

const refreshData = async () => {
  console.log('🔄 Début refreshData')
  
  // Récupérer les annonces selon le filtre actuel
  const filters = {}
  
  if (selectedStatus.value !== 'all') {
    filters.status = selectedStatus.value
  }
  
  if (searchQuery.value) {
    filters.search = searchQuery.value
  }
  
  if (typeFilter.value) {
    filters.type = typeFilter.value
  }
  
  console.log('🔍 Filtres appliqués:', filters)
  
  // Toujours récupérer les stats d'abord pour avoir les vraies données
  await fetchAllForStats()
  
  // Puis récupérer les annonces filtrées
  await fetchAnnouncements(filters)
  
  console.log('✅ RefreshData terminé, stats finales:', stats.value)
}

// Fonction appelée quand on change de statut
const onStatusChange = async (newStatus) => {
  selectedStatus.value = newStatus
  await refreshData()
}

// Debounce pour la recherche
let searchTimeout = null
const onSearchChange = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    await refreshData()
  }, 500)
}

// Fonction appelée quand on change de type
const onTypeChange = async () => {
  await refreshData()
}

const approveAnnouncement = async (announcement) => {
  const actionKey = `approve-${announcement.id}`
  
  try {
    processingActions.value.add(actionKey)
    console.log('✅ Début approbation annonce:', announcement.id)
    
    // Appel du service d'approbation
    const result = await lostAnimalsService.approveLostAnimal(announcement.id)
    
    if (result.success) {
      console.log('✅ Annonce approuvée avec succès:', result.data)
      
      // Mettre à jour l'annonce localement
      announcement.status = 'approved'
      announcement.updated_at = result.data.updated_at
      
      // Rafraîchir les données pour mettre à jour les statistiques
      await refreshData()
      
      console.log('🎉 Approbation terminée')
    } else {
      console.error('❌ Erreur lors de l\'approbation:', result.error)
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'approbation:', error)
    
    // Gérer les erreurs spécifiques
    if (error.response?.status === 403) {
      console.error('🚫 Accès refusé - Droits insuffisants')
    } else if (error.response?.status === 404) {
      console.error('🔍 Annonce non trouvée')
    } else {
      console.error('💥 Erreur technique:', error.message)
    }
  } finally {
    processingActions.value.delete(actionKey)
  }
}

const rejectAnnouncement = async (announcement) => {
  if (confirm(`Êtes-vous sûr de vouloir rejeter l'annonce "${announcement.name}" ?`)) {
    const actionKey = `reject-${announcement.id}`
    
    try {
      processingActions.value.add(actionKey)
      console.log('❌ Début rejet annonce:', announcement.id)
      
      // Appel du service de rejet
      const result = await lostAnimalsService.rejectLostAnimal(announcement.id)
      
      if (result.success) {
        console.log('❌ Annonce rejetée avec succès:', result.data)
        
        // Mettre à jour l'annonce localement
        announcement.status = 'rejected'
        announcement.updated_at = result.data.updated_at
        
        // Rafraîchir les données pour mettre à jour les statistiques
        await refreshData()
        
        console.log('🎉 Rejet terminé')
      } else {
        console.error('❌ Erreur lors du rejet:', result.error)
      }
    } catch (error) {
      console.error('❌ Erreur lors du rejet:', error)
      
      // Gérer les erreurs spécifiques
      if (error.response?.status === 403) {
        console.error('🚫 Accès refusé - Droits insuffisants')
      } else if (error.response?.status === 404) {
        console.error('🔍 Annonce non trouvée')
      } else {
        console.error('💥 Erreur technique:', error.message)
      }
    } finally {
      processingActions.value.delete(actionKey)
    }
  }
}

const markAsResolved = async (announcement) => {
  if (confirm(`Marquer l'annonce "${announcement.name}" comme résolue ?`)) {
    const actionKey = `resolve-${announcement.id}`
    
    try {
      processingActions.value.add(actionKey)
      console.log('🎉 Début résolution annonce:', announcement.id)
      
      // Appel du service de résolution
      const result = await lostAnimalsService.resolveLostAnimal(announcement.id)
      
      if (result.success) {
        console.log('🎉 Annonce résolue avec succès:', result.data)
        
        // Mettre à jour l'annonce localement
        announcement.status = 'resolved'
        announcement.resolved_at = result.data.resolved_at
        announcement.updated_at = result.data.updated_at
        
        // Rafraîchir les données pour mettre à jour les statistiques
        await refreshData()
        
        console.log('✅ Résolution terminée')
      } else {
        console.error('❌ Erreur lors de la résolution:', result.error)
      }
    } catch (error) {
      console.error('❌ Erreur lors de la résolution:', error)
      
      // Gérer les erreurs spécifiques
      if (error.response?.status === 403) {
        console.error('🚫 Accès refusé - Droits insuffisants')
      } else if (error.response?.status === 404) {
        console.error('🔍 Annonce non trouvée')
      } else {
        console.error('💥 Erreur technique:', error.message)
      }
    } finally {
      processingActions.value.delete(actionKey)
    }
  }
}

const viewDetails = (announcement) => {
  selectedAnnouncement.value = announcement
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    resolved: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    approved: 'Approuvée',
    rejected: 'Rejetée',
    resolved: 'Résolue'
  }
  return labels[status] || status
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getPercentage = (count) => {
  const total = stats.value.pending + stats.value.approved + stats.value.rejected + stats.value.resolved
  console.log('🧮 Calcul pourcentage:', { count, total, stats: stats.value })
  if (total === 0) return 0
  const percentage = Math.round((count / total) * 100)
  console.log('📊 Pourcentage calculé:', percentage)
  return percentage
}

// Lifecycle
onMounted(() => {
  refreshData()
})
</script>
