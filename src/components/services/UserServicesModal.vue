<template>
  <BaseModal 
    title="Mes Services" 
    @close="closeModal" 
    :footer="false"
    size="large"
  >
    <!-- Header avec statistiques -->
    <div class="services-header">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ totalServices }}</div>
          <div class="stat-label">Services totaux</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ activeServices }}</div>
          <div class="stat-label">Services actifs</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ averagePrice }}€</div>
          <div class="stat-label">Prix moyen</div>
        </div>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="filters-section">
      <div class="search-box">
        <input 
          v-model="searchTerm"
          type="text" 
          placeholder="Rechercher un service..."
          class="search-input"
        />
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      
      <div class="filter-buttons">
        <button 
          @click="statusFilter = 'all'"
          :class="['filter-btn', { active: statusFilter === 'all' }]"
        >
          Tous
        </button>
        <button 
          @click="statusFilter = 'active'"
          :class="['filter-btn', { active: statusFilter === 'active' }]"
        >
          Actifs
        </button>
        <button 
          @click="statusFilter = 'inactive'"
          :class="['filter-btn', { active: statusFilter === 'inactive' }]"
        >
          Inactifs
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement de vos services...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="isError" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Erreur de chargement</h3>
      <p>{{ error?.message || 'Impossible de charger vos services' }}</p>
      <button @click="refetch" class="retry-btn">Réessayer</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="!filteredServices.length" class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="m2 17 10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="m2 12 10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3>{{ searchTerm ? 'Aucun service trouvé' : 'Aucun service enregistré' }}</h3>
      <p>
        {{ searchTerm 
          ? 'Essayez avec d\'autres mots-clés' 
          : 'Commencez par créer votre premier service' 
        }}
      </p>
    </div>

    <!-- Services list -->
    <div v-else class="services-list">
      <div 
        v-for="service in filteredServices" 
        :key="service.id"
        class="service-card"
        :class="{ 'inactive': !service.is_enabled }"
      >
        <!-- Service header -->
        <div class="service-header">
          <div class="service-info">
            <h4 class="service-name">{{ service.name }}</h4>
            <p class="service-description">{{ service.description }}</p>
          </div>
          
          <div class="service-actions">
            <span 
              :class="['status-badge', service.is_enabled ? 'active' : 'inactive']"
            >
              {{ service.is_enabled ? 'Actif' : 'Inactif' }}
            </span>
            
            <ContextMenu 
              @edit="editService(service)"
              @delete="confirmDeleteService(service)"
              title="Options du service"
              position="bottom-left-modal"
            />
          </div>
        </div>

        <!-- Service details -->
        <div class="service-details">
          <div class="detail-item">
            <span class="detail-label">Prix :</span>
            <span class="detail-value price">{{ formatPrice(service.price) }}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">Durée :</span>
            <span class="detail-value">{{ service.duration }} min</span>
          </div>
          
          <div v-if="service.animals_supported?.length" class="detail-item">
            <span class="detail-label">Animaux :</span>
            <span class="detail-value">{{ service.animals_supported.join(', ') }}</span>
          </div>
          
          <div v-if="service.service_type" class="detail-item">
            <span class="detail-label">Type :</span>
            <span class="detail-value">{{ service.service_type.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer actions -->
    <div class="modal-footer">
      <button @click="closeModal" class="btn-secondary">
        Fermer
      </button>
      <button @click="createNewService" class="btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2"/>
          <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
        </svg>
        Nouveau service
      </button>
    </div>
  </BaseModal>

  <!-- Modal de confirmation de suppression -->
  <DeleteConfirmModal 
    v-if="showDeleteModal" 
    :title="'Supprimer le service'"
    :confirm-title="'Supprimer définitivement ce service ?'"
    :message="'Vous êtes sur le point de supprimer ce service. Cette action supprimera toutes les données associées (rendez-vous programmés, historique, etc.).'"
    :item-details="serviceToDelete?.name"
    :item-label="'Service'"
    :permanent-warning="'Cette suppression est permanente et irréversible. Tous les rendez-vous futurs liés à ce service seront annulés.'"
    :confirm-button-text="'Supprimer le service'"
    :deleting-text="'Suppression du service...'"
    @close="handleDeleteModalClose"
    @confirm="deleteService"
  />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import ContextMenu from '@/components/common/ContextMenu.vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import { useUserServices, useDeleteService } from '@/services/services/serviceQueries.js'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'
import { useToast } from '@/composables/useToast.js'

// Props
const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})

// Émissions
const emit = defineEmits(['close', 'edit-service', 'delete-service', 'create-service'])

// État local
const searchTerm = ref('')
const statusFilter = ref('all') // 'all', 'active', 'inactive'
const showDeleteModal = ref(false)
const serviceToDelete = ref(null)

// Authentification et toast
const auth = useSimpleAuth()
const currentUser = computed(() => auth.getCurrentUser.value)
const toast = useToast()

// Récupération des services utilisateur
const { 
  data: servicesResponse, 
  isLoading, 
  isError, 
  error,
  refetch 
} = useUserServices(props.userId, {
  with_user: true,
  with_service_type: true
})

// Mutation pour la suppression de services avec Optimistic Update
const deleteServiceMutation = useDeleteService({
  onSuccess: (data, serviceId, context) => {
    console.log('✅ Service supprimé avec succès côté serveur, ID:', serviceId)
    
    // Toast de succès discret (modals déjà fermés)
    toast.success('Service supprimé avec succès', {
      duration: 2000
    })
  },
  
  onError: (error, serviceId, context) => {
    console.error('❌ Erreur suppression service:', error)
    
    // Récupérer le nom du service depuis le contexte ou les données restaurées
    let serviceName = 'Service'
    if (context?.previousServices) {
      // Chercher le service dans les données restaurées
      Object.values(context.previousServices).forEach(data => {
        if (data?.data) {
          const foundService = data.data.find(s => s.id === serviceId)
          if (foundService) {
            serviceName = foundService.name
          }
        }
      })
    }
    
    // Toast d'erreur avec option de restauration
    toast.errorWithRestore(
      `Impossible de supprimer "${serviceName}". Le service a été restauré.`,
      () => {
        // Fonction de restauration (déjà gérée automatiquement par onMutate)
        console.log('🔄 Service restauré automatiquement')
      },
      {
        title: 'Erreur de suppression',
        duration: 8000
      }
    )
  }
})

// Services data
const services = computed(() => servicesResponse.value?.data || [])

// Statistiques
const totalServices = computed(() => services.value.length)
const activeServices = computed(() => services.value.filter(s => s.is_enabled).length)
const averagePrice = computed(() => {
  if (!services.value.length) return 0
  const total = services.value.reduce((sum, s) => sum + parseFloat(s.price || 0), 0)
  return (total / services.value.length).toFixed(2)
})

// Services filtrés
const filteredServices = computed(() => {
  let filtered = services.value

  // Filtrer par statut
  if (statusFilter.value === 'active') {
    filtered = filtered.filter(s => s.is_enabled)
  } else if (statusFilter.value === 'inactive') {
    filtered = filtered.filter(s => !s.is_enabled)
  }

  // Filtrer par recherche
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(service => 
      service.name?.toLowerCase().includes(term) ||
      service.description?.toLowerCase().includes(term) ||
      service.animals_supported?.some(animal => 
        animal.toLowerCase().includes(term)
      )
    )
  }

  return filtered
})

// Fonctions
function closeModal() {
  emit('close')
}

function editService(service) {
  emit('edit-service', service)
}

function confirmDeleteService(service) {
  console.log('🗑️ Demande de suppression du service:', service.name)
  serviceToDelete.value = service
  showDeleteModal.value = true
}

// Fonction pour gérer la fermeture du modal de suppression
function handleDeleteModalClose() {
  showDeleteModal.value = false
  serviceToDelete.value = null
}

// Fonction pour supprimer le service
async function deleteService() {
  if (!serviceToDelete.value) return
  
  try {
    console.log('🗑️ Suppression du service:', serviceToDelete.value.name)
    
    // Sauvegarder les infos du service AVANT de nettoyer
    const serviceId = serviceToDelete.value.id
    const serviceName = serviceToDelete.value.name
    
    // Fermer immédiatement le modal de confirmation de suppression
    showDeleteModal.value = false
    serviceToDelete.value = null
    
    // Déclencher la suppression optimiste avec l'ID sauvegardé
    await deleteServiceMutation.mutateAsync(serviceId)
    
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    // L'erreur sera gérée par onError de la mutation
    throw error
  }
}

function createNewService() {
  emit('create-service')
}

function formatPrice(price) {
  return `${parseFloat(price || 0).toFixed(2)}€`
}

// Watch pour logs de debug
watch(services, (newServices) => {
  console.log('Services utilisateur chargés:', newServices)
}, { immediate: true })
</script>

<style scoped>
.services-header {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

.filters-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
}

.search-box {
  position: relative;
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #43a047;
  box-shadow: 0 0 0 3px rgba(67, 160, 71, 0.1);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.filter-buttons {
  display: flex;
  gap: 8px;
}

.filter-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background: #f9fafb;
}

.filter-btn.active {
  background: #43a047;
  border-color: #43a047;
  color: white;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #43a047;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-icon {
  color: #9ca3af;
  margin-bottom: 16px;
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background: #43a047;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.service-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background: white;
  transition: all 0.2s ease;
}

.service-card:hover {
  border-color: #43a047;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.service-card.inactive {
  opacity: 0.6;
  background: #f9fafb;
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.service-info {
  flex: 1;
}

.service-name {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.service-description {
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

.service-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

/* Le menu contextuel utilise maintenant la position bottom-left-modal */

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.service-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  color: #1e293b;
  font-weight: 600;
}

.detail-value.price {
  color: #43a047;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-secondary,
.btn-primary {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  background: #43a047;
  color: white;
  border: 1px solid #43a047;
}

.btn-primary:hover {
  background: #388e3c;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .service-details {
    grid-template-columns: 1fr;
  }
  
  .modal-footer {
    flex-direction: column-reverse;
  }
  
  .btn-secondary,
  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}
</style>
