<template>
  <section class="border border-neutral-200 rounded-[10px] p-8 flex flex-col gap-8">
    <TitleDashboard title="Gestion des services" :has-button="true" btn-title="+ Ajouter un service"
      @on-click-btn="addService" />
    <hr />

    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
      <h3 class="text-lg font-semibold text-gray-800">Gérer mes disponibilités</h3>
      <router-link to="/appointment"
        class="bg-blue-600 text-white px-5 py-2 rounded-lg text-base font-semibold hover:bg-blue-700 transition">
        Ouvrir l'agenda
      </router-link>
    </div>

    <!-- Liste des services -->
    <div class="overflow-x-auto">
      <div v-if="isLoading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8c3d20]"></div>
        <span class="ml-3 text-[#6b7280]">Chargement des services...</span>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p class="text-red-600 text-sm">❌ Erreur lors du chargement des services</p>
        <button 
          @click="refetchServices" 
          class="mt-2 text-red-700 underline text-sm hover:no-underline"
        >
          Réessayer
        </button>
      </div>

      <table v-else class="w-full border-collapse text-[14px]">
        <thead>
          <tr class="border-b border-[#E5E7EB] bg-[#F9F9F9]">
            <th class="text-left p-4 text-black text-[16px] font-semibold">TYPE</th>
            <th class="text-left p-4 text-black text-[16px] font-semibold">NOM</th>
            <th class="text-left p-4 text-black text-[16px] font-semibold">DESCRIPTION</th>
            <th class="text-left p-4 text-black text-[16px] font-semibold">PRIX</th>
            <th class="text-left p-4 text-black text-[16px] font-semibold">DURÉE</th>
            <th class="text-left p-4 text-black text-[16px] font-semibold">STATUT</th>
            <th class="text-left p-4 text-black text-[16px] font-semibold">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="services.length === 0">
            <td colspan="7" class="p-8 text-center text-gray-500">
              <div class="flex flex-col items-center gap-3">
                <span class="text-4xl">📋</span>
                <p class="text-lg font-medium">Aucun service créé</p>
                <p class="text-sm">Cliquez sur "Ajouter un service" pour commencer</p>
              </div>
            </td>
          </tr>
          <tr v-for="service in services" :key="service.id" class="border-b border-[#ddd] hover:bg-gray-50">
            <td class="p-4">
              <div class="flex items-center gap-2">
                <div 
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: service.service_type?.color || '#6B7280' }"
                ></div>
                <span class="font-medium">{{ service.service_type?.name || 'Non défini' }}</span>
              </div>
            </td>
            <td class="p-4 font-medium">{{ service.name }}</td>
            <td class="p-4 text-gray-600">{{ service.description || '-' }}</td>
            <td class="p-4">
              <span class="font-semibold">{{ service.price || '0' }} €</span>
            </td>
            <td class="p-4">{{ service.duration || '0' }} min</td>
            <td class="p-4">
              <span 
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-800': service.is_active,
                  'bg-gray-100 text-gray-800': !service.is_active
                }"
              >
                {{ service.is_active ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td class="p-4">
              <div class="flex gap-2">
                <button
                  @click="editService(service)"
                  class="bg-green-100 text-[#6CC447] font-medium rounded-md px-3 py-1 text-sm cursor-pointer transition hover:bg-green-200"
                  type="button"
                >
                  Modifier
                </button>
                <button
                  @click="deleteService(service)"
                  class="bg-red-100 text-[#EF5350] font-medium rounded-md px-3 py-1 text-sm cursor-pointer transition hover:bg-red-200"
                  type="button"
                >
                  Supprimer
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal d'ajout de service -->
    <AddServiceModal 
      v-if="showAddServiceModal" 
      @close="handleAddServiceClose"
      @service-created="handleServiceCreated"
    />

    <!-- Modal d'édition de service -->
    <EditServiceModal 
      v-if="showEditServiceModal" 
      :service="selectedService"
      @close="handleEditServiceClose"
      @service-updated="handleServiceUpdated"
    />
  </section>
</template>

<script setup>
import TitleDashboard from '@/components/common/TitleDashboard.vue'
import AddServiceModal from '@/components/services/AddServiceModal.vue'
import EditServiceModal from '@/components/services/EditServiceModal.vue'
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAuth } from '@/composables/useAuth.js'
import { 
  useServices, 
  useDeleteService 
} from '@/services/services/serviceQueries.js'
import { useServicesStore } from '@/stores/services.js'

// États des modals
const showAddServiceModal = ref(false)
const showEditServiceModal = ref(false)
const selectedService = ref(null)

// Utilisateur actuel et store
const { user } = useAuth()
const currentUser = computed(() => user.value)
const servicesStore = useServicesStore()

// Charger les services de l'utilisateur connecté
const userId = computed(() => currentUser.value?.id)
const { 
  data: servicesData, 
  isLoading, 
  error, 
  refetch: refetchServices 
} = useServices({
  user_id: userId.value,
  with_service_type: true,
  enabled: computed(() => !!userId.value)
})

// Services depuis le store Pinia (mise à jour automatique)
const services = computed(() => {
  console.log('🔄 Recalcul des services:')
  console.log('   - Store Pinia:', servicesStore.services.length, 'services')
  console.log('   - API Response:', servicesData.value)
  console.log('   - API Data:', servicesData.value?.data)
  
  // Toujours utiliser le store en priorité s'il contient des données
  if (servicesStore.services.length > 0) {
    console.log('📦 ✅ Utilisation du store Pinia:', servicesStore.services.length, 'services')
    console.log('   - Premier service:', servicesStore.services[0])
    return servicesStore.services
  }
  
  // Fallback vers les données de l'API si le store est vide
  if (servicesData.value?.success && servicesData.value.data?.length > 0) {
    const apiServices = servicesData.value.data
    console.log('🌐 ✅ Chargement initial depuis l\'API:', apiServices.length, 'services')
    console.log('   - Premier service API:', apiServices[0])
    
    // Mettre à jour le store avec les données de l'API
    servicesStore.setServices(apiServices)
    return apiServices
  }
  
  console.log('📋 ❌ Aucun service disponible')
  return []
})

// Mutation pour supprimer un service
const deleteServiceMutation = useDeleteService()

// Fonctions pour gérer les services
function addService() {
  console.log('🔧 Ajouter un service')
  showAddServiceModal.value = true
}

function editService(service) {
  console.log('✏️ Éditer le service:', service)
  selectedService.value = service
  showEditServiceModal.value = true
}

async function deleteService(service) {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer le service "${service.name}" ?\n\nCette action est irréversible.`)) {
    return
  }

  try {
    console.log('🗑️ Suppression du service:', service)
    console.log('📋 Services dans le store AVANT suppression:', servicesStore.services.length)
    console.log('🔍 Service à supprimer - ID:', service.id, 'Name:', service.name)
    console.log('📝 Liste des IDs dans le store:', servicesStore.services.map(s => s.id))
    
    await deleteServiceMutation.mutateAsync(service.id)
    console.log('✅ Service supprimé avec succès de l\'API')
    
    // Vérifier si le service existe dans le store avant suppression
    const serviceExistsInStore = servicesStore.services.find(s => s.id === service.id)
    console.log('🔍 Service existe dans le store avant removeService:', !!serviceExistsInStore)
    
    // Mise à jour immédiate du store Pinia pour synchronisation
    console.log('🔄 Appel de servicesStore.removeService avec ID:', service.id)
    servicesStore.removeService(service.id)
    
    console.log('📊 Services restants dans le store APRÈS suppression:', servicesStore.services.length)
    console.log('📝 Liste des IDs restants:', servicesStore.services.map(s => s.id))
    
    // Attendre le prochain tick pour que la réactivité se déclenche
    await nextTick()
    
    // Vérifier si le service a bien été supprimé après nextTick
    const serviceStillExists = servicesStore.services.find(s => s.id === service.id)
    console.log('🔍 Service existe encore dans le store après nextTick:', !!serviceStillExists)
    
    // Forcer le recalcul du computed services si nécessaire
    console.log('🔄 Computed services length:', services.value.length)
    console.log('📝 Computed services IDs:', services.value.map(s => s.id))
    
    // Si le service existe encore dans le computed, il y a un problème de réactivité
    const serviceInComputed = services.value.find(s => s.id === service.id)
    if (serviceInComputed) {
      console.log('⚠️ Service encore présent dans le computed, forçage de la synchronisation')
      // Forcer une nouvelle synchronisation
      const currentServices = servicesStore.services.filter(s => s.id !== service.id)
      servicesStore.setServices(currentServices)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error)
    alert('Erreur lors de la suppression du service. Veuillez réessayer.')
  }
}

// Gestionnaires du modal d'ajout de service
function handleAddServiceClose() {
  showAddServiceModal.value = false
}

function handleServiceCreated(serviceResponse) {
  console.log('✅ Service créé dans la page:', serviceResponse)
  showAddServiceModal.value = false
  
  // Approche directe : ajouter immédiatement au store
  if (serviceResponse?.success && serviceResponse?.data) {
    console.log('📝 Ajout immédiat au store Pinia:', serviceResponse.data)
    servicesStore.addService(serviceResponse.data)
    
    // Vider le store et recharger pour être sûr
    setTimeout(() => {
      console.log('🔄 Rechargement des services après 500ms')
      refetchServices()
    }, 500)
  } else {
    // Si pas de données dans la réponse, forcer le rechargement
    console.log('⚠️ Pas de données dans la réponse, rechargement forcé')
    refetchServices()
  }
}

// Gestionnaires du modal d'édition de service
function handleEditServiceClose() {
  showEditServiceModal.value = false
  selectedService.value = null
}

function handleServiceUpdated(service) {
  console.log('✅ Service modifié:', service)
  showEditServiceModal.value = false
  selectedService.value = null
  // Le service sera automatiquement mis à jour dans la liste via TanStack Query
}

// Fonction pour synchroniser le store avec les données API
const syncStoreWithAPI = () => {
  if (servicesData.value?.success && servicesData.value.data) {
    console.log('🔄 Synchronisation du store avec les données API')
    servicesStore.setServices(servicesData.value.data)
  }
}

// Initialisation
onMounted(() => {
  console.log('🚀 Initialisation ServicesPage - Version corrigée')
  console.log('👤 Utilisateur:', currentUser.value?.name)
  console.log('🔧 Services chargés depuis serviceQueries.js')
  
  // Synchroniser le store si des données API sont déjà disponibles
  if (servicesData.value?.success) {
    syncStoreWithAPI()
  }
})
</script>

<style scoped>
</style>