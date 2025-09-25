<template>
  <BaseModal 
    title="Ajouter un nouveau service" 
    @close="closeModal" 
    :footer="false"
    size="large"
  >
    <!-- Formulaire d'ajout de service -->
    <form @submit.prevent="submitForm" class="add-service-form">
      
      <!-- Informations générales -->
      <div class="form-section">
        <h3 class="section-title">Informations générales</h3>
        
        <!-- Nom du service -->
        <div class="form-group">
          <label for="serviceName" class="form-label required">
            Nom du service
          </label>
          <input
            id="serviceName"
            v-model="formData.name"
            type="text"
            class="form-input"
            placeholder="Ex: Consultation générale"
            :class="{ 'error': errors.name }"
            required
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="serviceDescription" class="form-label">
            Description
          </label>
          <textarea
            id="serviceDescription"
            v-model="formData.description"
            class="form-textarea"
            placeholder="Décrivez votre service en détail..."
            rows="3"
            :class="{ 'error': errors.description }"
          ></textarea>
          <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
        </div>

        <!-- Type de service -->
        <div class="form-group">
          <label for="serviceType" class="form-label required">
            Type de service
          </label>
          <select
            id="serviceType"
            v-model="formData.services_types_id"
            class="form-select"
            :class="{ 'error': errors.services_types_id }"
            :disabled="isLoadingTypes"
            required
          >
            <option value="">
              {{ isLoadingTypes ? 'Chargement des types...' : 'Sélectionnez un type' }}
            </option>
            <option 
              v-for="type in finalServiceTypes" 
              :key="type?.id || `fallback-${type?.name}`" 
              :value="type?.id"
              v-show="type?.id && type?.name"
              :title="type?.description"
            >
              {{ type?.name || 'Type inconnu' }}{{ type?.description ? ` - ${type.description}` : '' }}
            </option>
          </select>
          <span v-if="errors.services_types_id" class="error-message">{{ errors.services_types_id }}</span>
        </div>
      </div>

      <!-- Tarification et durée -->
      <div class="form-section">
        <h3 class="section-title">Tarification et durée</h3>
        
        <div class="form-row">
          <!-- Prix -->
          <div class="form-group">
            <label for="servicePrice" class="form-label required">
              Prix (€)
            </label>
            <input
              id="servicePrice"
              v-model.number="formData.price"
              type="number"
              step="0.01"
              min="0"
              class="form-input"
              placeholder="45.50"
              :class="{ 'error': errors.price }"
              required
            />
            <span v-if="errors.price" class="error-message">{{ errors.price }}</span>
          </div>

          <!-- Durée -->
          <div class="form-group">
            <label for="serviceDuration" class="form-label required">
              Durée (minutes)
            </label>
            <input
              id="serviceDuration"
              v-model.number="formData.duration"
              type="number"
              min="5"
              max="480"
              class="form-input"
              placeholder="30"
              :class="{ 'error': errors.duration }"
              required
            />
            <span v-if="errors.duration" class="error-message">{{ errors.duration }}</span>
          </div>
        </div>

        <!-- Délai entre services -->
        <div class="form-group">
          <label for="serviceGap" class="form-label">
            Délai entre services (minutes)
          </label>
          <input
            id="serviceGap"
            v-model.number="formData.gap_between_services"
            type="number"
            min="0"
            max="120"
            class="form-input"
            placeholder="15"
            :class="{ 'error': errors.gap_between_services }"
          />
          <span v-if="errors.gap_between_services" class="error-message">{{ errors.gap_between_services }}</span>
          <small class="form-help">Temps de préparation nécessaire entre deux rendez-vous</small>
        </div>
      </div>

      <!-- Animaux supportés -->
      <div class="form-section">
        <h3 class="section-title">Animaux supportés</h3>
        
        <div class="form-group">
          <label class="form-label">
            Types d'animaux acceptés
          </label>
          <div class="checkbox-grid">
            <label 
              v-for="animal in availableAnimals" 
              :key="animal.value"
              class="checkbox-item"
            >
              <input
                type="checkbox"
                :value="animal.value"
                v-model="formData.animals_supported"
                class="checkbox-input"
              />
              <span class="checkbox-label">{{ animal.label }}</span>
            </label>
          </div>
          <span v-if="errors.animals_supported" class="error-message">{{ errors.animals_supported }}</span>
        </div>
      </div>

      <!-- Statut -->
      <div class="form-section">
        <div class="form-group">
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.is_enabled"
              class="checkbox-input"
            />
            <span class="checkbox-label">Service actif (disponible pour les réservations)</span>
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button 
          type="button" 
          @click="closeModal"
          class="btn-secondary"
          :disabled="isSubmitting"
        >
          Annuler
        </button>
        <button 
          type="submit" 
          class="btn-primary"
          :disabled="isSubmitting || !isFormValid"
        >
          <span v-if="isSubmitting">Création en cours...</span>
          <span v-else>Créer le service</span>
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { useCreateService } from '@/services/services/serviceQueries.js'
import { useServiceTypesCache } from '@/composables/useServiceTypesCache.js'
import { useToast } from '@/composables/useToast.js'

// Émissions
const emit = defineEmits(['close', 'service-created'])

// Toast
const toast = useToast()

// État du formulaire
const formData = reactive({
  name: '',
  description: '',
  services_types_id: '',
  price: null,
  duration: 30,
  gap_between_services: 15,
  animals_supported: [],
  is_enabled: true
})

// Erreurs de validation
const errors = ref({})

// État de soumission
const isSubmitting = ref(false)

// Types de services avec cache optimisé
const { 
  serviceTypes: rawServiceTypes, 
  isLoading: isLoadingTypes,
  isError: isErrorTypes,
  stats: serviceTypesStats
} = useServiceTypesCache({
  activeOnly: true, // Seulement les types actifs pour le formulaire
  enableBackgroundRefresh: true
})

// Protection contre les données null/undefined
const finalServiceTypes = computed(() => {
  const types = rawServiceTypes.value || []
  // Filtrer les types invalides
  return types.filter(type => type && type.id && type.name)
})

// Animaux disponibles
const availableAnimals = ref([
  { value: 'chien', label: 'Chien' },
  { value: 'chat', label: 'Chat' },
  { value: 'lapin', label: 'Lapin' },
  { value: 'oiseau', label: 'Oiseau' },
  { value: 'rongeur', label: 'Rongeur' },
  { value: 'reptile', label: 'Reptile' },
  { value: 'poisson', label: 'Poisson' },
  { value: 'autre', label: 'Autre' }
])

// Validation du formulaire
const isFormValid = computed(() => {
  return formData.name.trim() !== '' &&
         formData.services_types_id !== '' &&
         formData.price > 0 &&
         formData.duration > 0 &&
         formData.animals_supported.length > 0
})

// Mutation de création
const createServiceMutation = useCreateService({
  onSuccess: (data) => {
    console.log('✅ Service créé avec succès:', data)
    
    toast.success('Service créé avec succès', {
      duration: 3000
    })
    
    // Émettre l'événement de création
    emit('service-created', data)
    
    // Fermer le modal
    closeModal()
  },
  
  onError: (error) => {
    console.error('❌ Erreur création service:', error)
    
    toast.error('Impossible de créer le service. Veuillez réessayer.', {
      duration: 5000
    })
    
    isSubmitting.value = false
  }
})

// Validation des champs
function validateForm() {
  errors.value = {}
  
  // Nom requis
  if (!formData.name.trim()) {
    errors.value.name = 'Le nom du service est requis'
  } else if (formData.name.length < 3) {
    errors.value.name = 'Le nom doit contenir au moins 3 caractères'
  }
  
  // Type requis et valide
  if (!formData.services_types_id) {
    errors.value.services_types_id = 'Le type de service est requis'
  } else {
    // Vérifier que l'ID sélectionné existe dans la liste
    const selectedType = finalServiceTypes.value.find(type => type.id === formData.services_types_id)
    if (!selectedType) {
      errors.value.services_types_id = 'Le type de service sélectionné n\'est pas valide'
    }
  }
  
  // Prix requis et valide
  if (!formData.price || formData.price <= 0) {
    errors.value.price = 'Le prix doit être supérieur à 0'
  }
  
  // Durée requise et valide
  if (!formData.duration || formData.duration < 5) {
    errors.value.duration = 'La durée doit être d\'au moins 5 minutes'
  } else if (formData.duration > 480) {
    errors.value.duration = 'La durée ne peut pas dépasser 8 heures'
  }
  
  // Animaux supportés requis
  if (formData.animals_supported.length === 0) {
    errors.value.animals_supported = 'Sélectionnez au moins un type d\'animal'
  }
  
  return Object.keys(errors.value).length === 0
}

// Soumission du formulaire
async function submitForm() {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Préparer les données pour l'API
    const serviceData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      services_types_id: formData.services_types_id,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      gap_between_services: parseInt(formData.gap_between_services) || 0,
      animals_supported: formData.animals_supported,
      is_enabled: formData.is_enabled
    }
    
    console.log('📤 Création du service:', serviceData)
    
    // Créer le service
    await createServiceMutation.mutateAsync(serviceData)
    
  } catch (error) {
    console.error('Erreur lors de la création:', error)
    // L'erreur est gérée par onError de la mutation
  }
}

// Fermer le modal
function closeModal() {
  emit('close')
}

// Initialisation
onMounted(() => {
  console.log('🚀 Modal d\'ajout de service initialisé')
  
  // Protection contre les erreurs d'accès
  try {
    console.log('📊 Stats types de services:', serviceTypesStats.value || 'Non disponibles')
    console.log('🔢 Types disponibles:', finalServiceTypes.value?.length || 0)
    console.log('🔍 Types de services avec IDs réels:', finalServiceTypes.value?.map(type => ({
      id: type.id,
      name: type.name,
      description: type.description
    })))
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des types de services:', error)
  }
})
</script>

<style scoped>
.add-service-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}

.form-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 16px;
  background: #3b82f6;
  border-radius: 2px;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
  font-size: 14px;
}

.form-label.required::after {
  content: ' *';
  color: #ef4444;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error,
.form-textarea.error,
.form-select.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-help {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.error-message {
  display: block;
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 8px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.checkbox-item:hover {
  background: rgba(59, 130, 246, 0.05);
}

.checkbox-input {
  width: 16px;
  height: 16px;
  accent-color: #3b82f6;
}

.checkbox-label {
  font-size: 14px;
  color: #374151;
  user-select: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  margin-top: 8px;
}

.btn-secondary,
.btn-primary {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 120px;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .checkbox-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .btn-secondary,
  .btn-primary {
    width: 100%;
  }
}
</style>
