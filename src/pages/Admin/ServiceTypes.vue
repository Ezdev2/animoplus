<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Gestion des Service Types</h2>
          <p class="text-gray-600">Configuration et administration des types de services</p>
        </div>
        <button @click="showCreateModal = true" 
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + Nouveau Service Type
        </button>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex-1 min-w-64">
          <input type="text" v-model="searchQuery" placeholder="Rechercher un service type..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <select v-model="statusFilter" 
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
        <button @click="refreshData" 
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          🔄 Actualiser
        </button>
      </div>
    </div>

    <!-- Liste des service types -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Service Types ({{ filteredServiceTypes.length }})</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Services liés
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Créé le
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="serviceType in filteredServiceTypes" :key="serviceType.id" 
              class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ serviceType.name }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-700 max-w-xs truncate">
                  {{ serviceType.description || 'Aucune description' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  serviceType.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ serviceType.is_active ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ serviceType.services_count || 0 }} service(s)
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ formatDate(serviceType.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button @click="editServiceType(serviceType)" 
                  class="text-blue-600 hover:text-blue-900">
                  Modifier
                </button>
                <button @click="toggleStatus(serviceType)" 
                  :class="serviceType.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'">
                  {{ serviceType.is_active ? 'Désactiver' : 'Activer' }}
                </button>
                <button @click="deleteServiceType(serviceType)" 
                  class="text-red-600 hover:text-red-900">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Message si aucun résultat -->
      <div v-if="filteredServiceTypes.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-lg mb-2">📋</div>
        <p class="text-gray-500">Aucun service type trouvé</p>
      </div>
    </div>

    <!-- Modal de création/édition -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ editingServiceType ? 'Modifier' : 'Créer' }} un Service Type
        </h3>
        
        <form @submit.prevent="saveServiceType" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
            <input type="text" v-model="formData.name" required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea v-model="formData.description" rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          
          <div class="flex items-center">
            <input type="checkbox" v-model="formData.is_active" id="is_active" class="mr-2" />
            <label for="is_active" class="text-sm text-gray-700">Service type actif</label>
          </div>
          
          <div class="flex gap-3 pt-4">
            <button type="button" @click="closeModal" 
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" 
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {{ editingServiceType ? 'Modifier' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// État réactif
const serviceTypes = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const showCreateModal = ref(false)
const editingServiceType = ref(null)
const isLoading = ref(false)

// Données du formulaire
const formData = ref({
  name: '',
  description: '',
  is_active: true
})

// Données de démonstration
const demoServiceTypes = [
  {
    id: 1,
    name: 'Consultation générale',
    description: 'Consultation vétérinaire standard',
    is_active: true,
    services_count: 15,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Chirurgie',
    description: 'Interventions chirurgicales diverses',
    is_active: true,
    services_count: 8,
    created_at: '2024-01-10T14:30:00Z'
  },
  {
    id: 3,
    name: 'Vaccination',
    description: 'Services de vaccination pour animaux',
    is_active: false,
    services_count: 3,
    created_at: '2024-01-05T09:15:00Z'
  }
]

// Computed
const filteredServiceTypes = computed(() => {
  let filtered = serviceTypes.value

  if (searchQuery.value) {
    filtered = filtered.filter(st => 
      st.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (st.description && st.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(st => 
      statusFilter.value === 'active' ? st.is_active : !st.is_active
    )
  }

  return filtered
})

// Méthodes
const refreshData = async () => {
  isLoading.value = true
  try {
    // TODO: Appel API réel
    // const response = await serviceTypesService.getAll()
    // serviceTypes.value = response.data
    
    // Pour le moment, utiliser les données de démo
    serviceTypes.value = [...demoServiceTypes]
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    isLoading.value = false
  }
}

const editServiceType = (serviceType) => {
  editingServiceType.value = serviceType
  formData.value = { ...serviceType }
  showCreateModal.value = true
}

const saveServiceType = async () => {
  try {
    if (editingServiceType.value) {
      // TODO: Appel API pour modifier
      console.log('Modifier service type:', formData.value)
    } else {
      // TODO: Appel API pour créer
      console.log('Créer service type:', formData.value)
    }
    
    closeModal()
    await refreshData()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  }
}

const toggleStatus = async (serviceType) => {
  try {
    // TODO: Appel API pour changer le statut
    console.log('Changer statut:', serviceType.id, !serviceType.is_active)
    serviceType.is_active = !serviceType.is_active
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error)
  }
}

const deleteServiceType = async (serviceType) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer "${serviceType.name}" ?`)) {
    try {
      // TODO: Appel API pour supprimer
      console.log('Supprimer service type:', serviceType.id)
      await refreshData()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingServiceType.value = null
  formData.value = {
    name: '',
    description: '',
    is_active: true
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  refreshData()
})
</script>
