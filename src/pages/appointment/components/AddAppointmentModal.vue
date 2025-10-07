<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">Ajouter un rendez-vous</h2>
        <button @click="closeModal" class="close-btn">×</button>
      </div>

      <!-- Affichage des erreurs -->
      <div v-if="showErrors && (Object.keys(formErrors).length > 0 || Object.keys(apiErrors).length > 0)" class="error-section">
        <div class="error-header">
          <h4>⚠️ Erreurs détectées</h4>
          <button @click="clearErrors" class="clear-errors-btn">×</button>
        </div>
        <div class="error-list">
          <div v-for="(errors, field) in { ...formErrors, ...apiErrors }" :key="field" class="error-item">
            <strong>{{ getFieldLabel(field) }}:</strong>
            <ul>
              <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitAppointment" class="appointment-form">
        
        <!-- Date et heure -->
        <div class="form-section">
          <h3 class="section-title">📅 Date et horaires</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="date">Date</label>
              <input 
                type="date" 
                id="date"
                v-model="form.date" 
                required
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="startTime">Heure de début</label>
              <input 
                type="time" 
                id="startTime"
                v-model="form.startTime" 
                required
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="endTime">Heure de fin</label>
              <input 
                type="time" 
                id="endTime"
                v-model="form.endTime" 
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="duration-info" v-if="calculatedDuration">
            <span class="duration-badge">
              Durée : {{ calculatedDuration }} heure{{ calculatedDuration > 1 ? 's' : '' }}
            </span>
          </div>
        </div>

        <!-- Animal concerné -->
        <div class="form-section">
          <h3 class="section-title">🐾 Animal concerné</h3>
          
          <!-- Sélection d'animal existant -->
          <div class="form-group">
            <label for="selectedAnimal">Choisir un animal existant</label>
            <select 
              id="selectedAnimal"
              v-model="form.selectedAnimal" 
              class="form-input"
              :disabled="loadingAnimals"
            >
              <option value="">
                {{ loadingAnimals ? 'Chargement...' : 'Sélectionnez un animal' }}
              </option>
              <option 
                v-for="animal in userAnimals" 
                :key="animal.id" 
                :value="animal.id"
              >
                {{ animal.nom }} ({{ getAnimalSpeciesName(animal) }})
              </option>
            </select>
          </div>

        </div>

        <!-- Adresse -->
        <div class="form-section">
          <h3 class="section-title">📍 Lieu du rendez-vous</h3>
          
          <div class="location-type-selector">
            <label class="radio-option">
              <input 
                type="radio" 
                v-model="form.locationType" 
                value="physical"
                name="locationType"
              />
              <span class="radio-label">🏥 Consultation physique</span>
            </label>
            
            <label class="radio-option">
              <input 
                type="radio" 
                v-model="form.locationType" 
                value="online"
                name="locationType"
              />
              <span class="radio-label">💻 Consultation en ligne</span>
            </label>
          </div>

          <!-- Adresse physique -->
          <div v-if="form.locationType === 'physical'" class="address-section">
            <div class="form-group">
              <label for="address">Adresse</label>
              <div class="address-input-container">
                <input 
                  type="text" 
                  id="address"
                  v-model="form.address" 
                  placeholder="Tapez l'adresse ou cliquez sur la carte"
                  class="form-input"
                />
                <button 
                  type="button" 
                  @click="showMap = !showMap"
                  class="map-toggle-btn"
                >
                  🗺️
                </button>
              </div>
            </div>

            <!-- Mini carte (simulée) -->
            <div v-if="showMap" class="map-container">
              <div class="mock-map" @click="selectLocationOnMap">
                <div class="map-marker" v-if="form.coordinates">📍</div>
                <div class="map-instructions">
                  Cliquez sur la carte pour sélectionner un lieu
                </div>
              </div>
              <div v-if="form.coordinates" class="coordinates-info">
                Coordonnées : {{ form.coordinates.lat }}, {{ form.coordinates.lng }}
              </div>
            </div>
          </div>

          <!-- Lien de consultation en ligne -->
          <div v-if="form.locationType === 'online'" class="form-group">
            <label for="meetLink">Lien de la consultation (optionnel)</label>
            <input 
              type="url" 
              id="meetLink"
              v-model="form.meetLink" 
              placeholder="https://meet.google.com/..."
              class="form-input"
            />
            <small class="form-help">
              Le lien peut être généré automatiquement si laissé vide
            </small>
          </div>
        </div>

        <!-- Service -->
        <div class="form-section">
          <h3 class="section-title">⚕️ Service recherché</h3>
          
          <div class="service-selector">
          
            <div v-if="form.selectedService" class="selected-service">
              <div class="service-card">
                <div class="service-info">
                  <h4>{{ form.selectedService.name }}</h4>
                  <p class="service-address">{{ form.selectedService.address }}</p>
                  <p class="service-phone">{{ form.selectedService.phone }}</p>
                </div>
                <button 
                  type="button" 
                  @click="clearSelectedService"
                  class="remove-service-btn"
                >
                  ×
                </button>
              </div>
            </div>
            
            <!-- Barre de recherche -->
            <div class="search-container">
              <div class="search-input-container">
                <input 
                  type="text" 
                  v-model="serviceSearchQuery"
                  placeholder="Rechercher un service ou vétérinaire..."
                  class="search-input"
                  @keyup.enter="performSearch"
                />
                <button 
                  type="button" 
                  @click="performSearch"
                  class="search-toggle-btn"
                  :disabled="!serviceSearchQuery || serviceSearchQuery.length < 2"
                >
                  🔍
                </button>
              </div>
              
              <!-- Filtre de distance -->
              <div v-if="showServiceSearch" class="distance-filter">
                <label for="distanceRange">Distance : {{ distanceRange }} km</label>
                <input 
                  type="range" 
                  id="distanceRange"
                  v-model="distanceRange"
                  min="1" 
                  max="50" 
                  step="1"
                  class="distance-slider"
                />
              </div>
            </div>

            <!-- Résultats de recherche -->
            <div v-if="actualSearchTerm && (availableServices.length > 0 || loadingServices)" class="search-results">
              <div class="search-results-header">
                <h4>🔍 Résultats pour "{{ serviceSearchQuery || 'Vétérinaire généraliste' }}"</h4>
                <span class="results-count">{{ availableServices.length }} résultat(s) trouvé(s)</span>
              </div>

              <div v-if="loadingServices" class="loading-state">
                <div class="loading-spinner"></div>
                <span>Recherche en cours...</span>
              </div>

              <div v-else class="services-list">
                <div 
                  v-for="service in availableServices" 
                  :key="service.id"
                  @click="selectService(service)"
                  class="service-item"
                  :class="{ selected: form.selectedService?.id === service.id }"
                >
                  <div class="service-avatar">
                    <img v-if="service.avatar" :src="service.avatar" :alt="service.name" />
                    <div v-else class="default-avatar">👨‍⚕️</div>
                  </div>
                  
                  <div class="service-details">
                    <h5 class="service-name">{{ service.name }}</h5>
                    <p class="service-address">📍 {{ service.user?.address || 'Adresse non renseignée' }}</p>
                    <p class="service-price">💰 {{ service.price }}€ - {{ service.duration }}min</p>
                    <p class="service-type">🏷️ {{ service.service_type?.name || 'Service général' }}</p>
                  </div>
                  
                  <div class="service-contact">
                    <button 
                      type="button"
                      @click.stop="callService(service.user?.phone)"
                      class="call-btn"
                      v-if="service.user?.phone"
                    >
                      📞 {{ service.user.phone }}
                    </button>
                  </div>
                </div>

                <div v-if="availableServices.length === 0 && !loadingServices" class="no-results">
                  <div class="no-results-icon">🔍</div>
                  <p>Aucun service trouvé pour cette recherche</p>
                  <small>Essayez d'élargir la zone de recherche ou modifier les mots-clés</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes supplémentaires -->
        <div class="form-section">
          <h3 class="section-title">📝 Notes (optionnel)</h3>
          <div class="form-group">
            <textarea 
              v-model="form.notes" 
              placeholder="Informations supplémentaires, symptômes observés, questions particulières..."
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button 
            type="button" 
            @click="closeModal" 
            class="btn btn-secondary"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="!isFormValid || isCreating"
          >
            <span v-if="isCreating">Création en cours...</span>
            <span v-else>Créer le rendez-vous</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useSearchServices } from '@/services/services/serviceQueries.js'
import { useCreateAppointment } from '@/services/appointments/appointmentQueries.js'
import { useToast } from '@/composables/useToast.js'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'
import { useAnimalsStore } from '@/stores/animals.js'
import { useAppointmentsStore } from '@/stores/appointments.js'

// Props
const props = defineProps({
  initialDate: { type: String, default: '' },
  initialTime: { type: String, default: '09:00' },
  endTime: { type: String, default: '10:00' },
  duration: { type: Number, default: 1 }
})

// Emits
const emit = defineEmits(['close', 'add-appointment', 'refresh-data'])

// Services
const toast = useToast()
const auth = useSimpleAuth()

// Stores globaux
const animalsStore = useAnimalsStore()
const appointmentsStore = useAppointmentsStore()

// Animaux de l'utilisateur depuis le store UNIQUEMENT (pas d'API call)
const userAnimals = computed(() => 
  animalsStore.getAnimalsByOwner(auth.getCurrentUser.value?.id)
)
const loadingAnimals = computed(() => animalsStore.isLoading)

// État de chargement local
const isCreating = ref(false)

// Mutation pour créer un rendez-vous avec synchronisation store
const createAppointmentMutation = useCreateAppointment({
  onMutate: () => {
    isCreating.value = true
    console.log('🔄 Début création rendez-vous...')
  },
  onSuccess: (data) => {
    isCreating.value = false
    console.log('✅ Rendez-vous créé avec succès:', data)
    
    // Utiliser le message de l'API ou un message par défaut
    const successMessage = data.message || 'Rendez-vous créé avec succès'
    toast.success(successMessage)
    
    // Le store est automatiquement synchronisé via TanStack Query
    // Les listes d'appointments sont invalidées et refetchées
    console.log('🔄 Store appointments synchronisé automatiquement')
    
    // Émettre l'événement pour le parent (pour compatibilité calendrier)
    const appointmentData = {
      id: data.data?.id,
      date: form.value.date,
      startTime: form.value.startTime,
      endTime: form.value.endTime,
      duration: calculatedDuration.value,
      selectedAnimal: form.value.selectedAnimal,
      isOnline: form.value.locationType === 'online',
      location_type: form.value.locationType,
      address: form.value.address,
      coordinates: form.value.coordinates,
      online_meeting_url: form.value.meetLink,
      service: form.value.selectedService?.name || 'Consultation générale',
      serviceProvider: form.value.selectedService,
      notes: form.value.notes,
      title: `${form.value.selectedService?.name || 'Consultation'} - ${data.data?.animal?.nom || 'Animal'}`,
      eventType: getEventTypeByService(),
      status: data.data?.status || 'pending',
      confirmationToken: data.data?.confirmation_token
    }
    
    emit('add-appointment', appointmentData)
    console.log('📤 Événement add-appointment émis')
    
    // Émettre un événement pour demander le rafraîchissement des données
    emit('refresh-data')
    console.log('🔄 Événement refresh-data émis')
    
    closeModal()
    console.log('🚪 Modal fermé')
  },
  onError: (error) => {
    isCreating.value = false
    console.error('❌ Erreur création rendez-vous:', error)
    
    // Gérer les erreurs de validation Laravel
    if (error.response?.status === 422 && error.response?.data?.errors) {
      apiErrors.value = error.response.data.errors
      showErrors.value = true
      
      // Afficher le message principal
      const mainMessage = error.response.data.message || 'Erreurs de validation'
      toast.error(mainMessage)
      
      console.log('🔍 Erreurs de validation détectées:', apiErrors.value)
    } else {
      // Autres erreurs (500, réseau, etc.)
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création du rendez-vous'
      toast.error(errorMessage)
      apiErrors.value = {}
      showErrors.value = false
    }
    
    // NE PAS fermer le modal en cas d'erreur pour permettre la correction
  }
})

// État des erreurs
const formErrors = ref({})
const apiErrors = ref({})
const showErrors = ref(false)

// State
const showMap = ref(false)
const showServiceSearch = ref(false)
const serviceSearchQuery = ref('')
const distanceRange = ref(5)

// Formulaire
const form = ref({
  date: '',
  startTime: '09:00',
  endTime: '10:00',
  selectedAnimal: '', // ID de l'animal sélectionné
  locationType: 'physical',
  address: '',
  coordinates: null,
  meetLink: '',
  selectedService: null,
  notes: ''
})

// Recherche de services via API (désactivée par défaut)
const searchEnabled = ref(false)
const actualSearchTerm = ref('')

const { 
  data: servicesResponse, 
  isLoading: loadingServices, 
  isError: servicesError,
  refetch: refetchServices
} = useSearchServices(actualSearchTerm, {
  with_user: true,
  with_service_type: true,
  enabled_only: true
})

// Services disponibles depuis l'API
const availableServices = computed(() => {
  console.log('📋 Services API response:', servicesResponse.value)
  console.log('🔍 Query UI:', serviceSearchQuery.value, typeof serviceSearchQuery.value)
  console.log('🔍 Actual search term:', actualSearchTerm.value, typeof actualSearchTerm.value)
  console.log('⏳ Loading:', loadingServices.value)
  console.log('❌ Error:', servicesError.value)
  
  // La réponse API a cette structure : { success: true, data: [...] }
  const services = servicesResponse.value?.data?.data || servicesResponse.value?.data || []
  console.log('📋 Services extraits:', services)
  return services
})

// Plus de watcher automatique - recherche uniquement sur clic

// Computed
const calculatedDuration = computed(() => {
  if (!form.value.startTime || !form.value.endTime) return 0
  
  const start = new Date(`2000-01-01T${form.value.startTime}:00`)
  const end = new Date(`2000-01-01T${form.value.endTime}:00`)
  
  if (end <= start) return 0
  
  return Math.round((end - start) / (1000 * 60 * 60))
})

const isFormValid = computed(() => {
  return (
    form.value.date &&
    form.value.startTime &&
    form.value.endTime &&
    form.value.selectedService &&
    form.value.selectedAnimal && // Animal requis
    (form.value.locationType === 'online' || form.value.address) &&
    calculatedDuration.value > 0
  )
})

// Les services sont directement dans availableServices (plus besoin de filteredServices)

// Validations frontend
const validateForm = () => {
  const errors = {}
  
  // Validation de la date
  if (!form.value.date) {
    errors.date = ['La date est requise']
  } else {
    const selectedDate = new Date(form.value.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      errors.date = ['La date ne peut pas être dans le passé']
    }
  }
  
  // Validation des heures
  if (!form.value.startTime) {
    errors.start_time = ['L\'heure de début est requise']
  }
  
  if (!form.value.endTime) {
    errors.end_time = ['L\'heure de fin est requise']
  }
  
  if (form.value.startTime && form.value.endTime) {
    const start = new Date(`2000-01-01T${form.value.startTime}:00`)
    const end = new Date(`2000-01-01T${form.value.endTime}:00`)
    
    if (end <= start) {
      errors.end_time = ['L\'heure de fin doit être postérieure à l\'heure de début']
    }
  }
  
  // Validation du service
  if (!form.value.selectedService) {
    errors.service_id = ['Un service doit être sélectionné']
  }
  
  // Validation de l'animal
  if (!form.value.selectedAnimal) {
    errors.animal_id = ['Un animal doit être sélectionné']
  }
  
  // Validation du type de lieu
  if (!form.value.locationType) {
    errors.location_type = ['Le type de consultation est requis']
  }
  
  // Validation de l'adresse pour consultation physique
  if (form.value.locationType === 'physical' && !form.value.address) {
    errors.address = ['L\'adresse est requise pour une consultation physique']
  }
  
  // Validation du lien de réunion pour consultation en ligne
  if (form.value.locationType === 'online' && !form.value.meetLink) {
    errors.online_meeting_url = ['Le lien de réunion est requis pour une consultation en ligne']
  }
  
  return errors
}

const clearErrors = () => {
  formErrors.value = {}
  apiErrors.value = {}
  showErrors.value = false
}

const getFieldError = (fieldName) => {
  return formErrors.value[fieldName] || apiErrors.value[fieldName] || null
}

const hasFieldError = (fieldName) => {
  return !!(formErrors.value[fieldName] || apiErrors.value[fieldName])
}

const getFieldLabel = (fieldName) => {
  const labels = {
    date: 'Date',
    start_time: 'Heure de début',
    end_time: 'Heure de fin',
    service_id: 'Service',
    animal_id: 'Animal',
    location_type: 'Type de consultation',
    address: 'Adresse',
    online_meeting_url: 'Lien de réunion'
  }
  return labels[fieldName] || fieldName
}

// Méthodes

// Fonction pour obtenir le nom de l'espèce d'un animal
const getAnimalSpeciesName = (animal) => {
  // Pour l'instant, on utilise l'espece_id car on n'a pas les données d'espèces enrichies
  // TODO: enrichir avec les données d'espèces depuis le cache
  return animal.espece?.nom || 'Espèce inconnue'
}

// Watcher pour l'animal sélectionné
watch(() => form.value.selectedAnimal, (newAnimalId) => {
  console.log('🐾 Animal sélectionné ID:', newAnimalId)
  if (newAnimalId) {
    const selectedAnimal = animalsStore.getAnimalById(newAnimalId)
    console.log('🐾 Animal trouvé:', selectedAnimal)
  }
})

const selectLocationOnMap = (event) => {
  // Simulation de sélection sur carte
  const rect = event.currentTarget.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height
  
  // Coordonnées fictives pour Antananarivo
  const lat = -18.8792 + (y - 0.5) * 0.1
  const lng = 47.5079 + (x - 0.5) * 0.1
  
  form.value.coordinates = { lat: lat.toFixed(6), lng: lng.toFixed(6) }
  form.value.address = `${lat.toFixed(6)}, ${lng.toFixed(6)} - Antananarivo`
}

const clearSelectedService = () => {
  form.value.selectedService = null
}

// const openServiceSearch = () => {
//   emit('find-service')
// }

const toggleServiceSearch = () => {
  showServiceSearch.value = !showServiceSearch.value
  if (showServiceSearch.value && !serviceSearchQuery.value) {
    serviceSearchQuery.value = 'consultation'
  }
}

// Fonction pour déclencher la recherche manuellement
const performSearch = () => {
  const query = String(serviceSearchQuery.value || '').trim()
  console.log('🔍 Query à rechercher:', query, typeof query)
  
  if (query && query.length >= 2) {
    console.log('🔍 Recherche manuelle déclenchée:', query)
    // Éviter les recherches dupliquées
    if (actualSearchTerm.value !== query) {
      actualSearchTerm.value = query
      console.log('🔄 Nouvelle recherche lancée pour:', query)
    } else {
      console.log('⚠️ Recherche identique ignorée')
    }
  } else {
    console.log('⚠️ Query trop courte pour la recherche')
  }
}

// Fonction supprimée - plus de recherche automatique

const selectService = (service) => {
  form.value.selectedService = service
  showServiceSearch.value = false
  serviceSearchQuery.value = service.name
}

const callService = (phone) => {
  // Simuler un appel téléphonique
  console.log(`Appel vers ${phone}`)
  alert(`Appel vers ${phone}`)
}

const closeModal = () => {
  console.log('🔒 Fermeture du modal...')
  emit('close')
}

const submitAppointment = async () => {
  if (isCreating.value) return
  
  // Effacer les erreurs précédentes
  clearErrors()
  
  // Validation frontend
  const frontendErrors = validateForm()
  if (Object.keys(frontendErrors).length > 0) {
    formErrors.value = frontendErrors
    showErrors.value = true
    toast.error('Veuillez corriger les erreurs dans le formulaire')
    console.log('❌ Erreurs de validation frontend:', frontendErrors)
    return
  }
  
  // Debug des valeurs du formulaire
  console.log('🔍 Valeurs du formulaire AVANT préparation:')
  console.log('  - date:', form.value.date)
  console.log('  - startTime:', form.value.startTime)
  console.log('  - endTime:', form.value.endTime)
  console.log('  - selectedService:', form.value.selectedService)
  console.log('  - selectedAnimal:', form.value.selectedAnimal)
  console.log('  - locationType:', form.value.locationType)
  
  // Préparer les données pour l'API selon le modèle Laravel fillable
  const appointmentData = {
    // Champs obligatoires du modèle Laravel
    date: form.value.date,
    start_time: form.value.startTime,
    end_time: form.value.endTime,
    service_id: form.value.selectedService?.id || null,
    client_id: auth.getCurrentUser.value?.id || null,
    animal_id: form.value.selectedAnimal || null, // Ajout de animal_id
    location_type: form.value.locationType,
    address: form.value.locationType === 'physical' ? form.value.address : null,
    online_meeting_url: form.value.locationType === 'online' ? form.value.meetLink : null,
    notes: form.value.notes || null,
    emergency: false,
    status: 'pending'
  }
  
  console.log('📝 Création du rendez-vous avec les données APRÈS préparation:', appointmentData)
  console.log('🔍 Vérification spécifique start_time et end_time:')
  console.log('  - appointmentData.start_time:', appointmentData.start_time)
  console.log('  - appointmentData.end_time:', appointmentData.end_time)
  console.log('🔑 Token actuel:', auth.getCurrentUser.value)
  console.log('🔑 Données localStorage:', localStorage.getItem('data'))
  
  try {
    // Utiliser la mutation TanStack Query pour créer le rendez-vous
    console.log('🚀 Lancement de la mutation...')
    await createAppointmentMutation.mutateAsync(appointmentData)
    // Le succès est géré par onSuccess de la mutation
  } catch (error) {
    // L'erreur est gérée par onError de la mutation
    console.error('❌ Erreur lors de la soumission:', error)
    console.error('❌ Détails erreur:', error.response?.data)
  }
}

const getEventTypeByService = () => {
  if (!form.value.selectedService) return 'blue'
  
  const service = form.value.selectedService.name.toLowerCase()
  if (service.includes('urgence')) return 'red'
  if (service.includes('suivi') || service.includes('contrôle')) return 'orange'
  return 'blue'
}

// Initialisation avec les props
onMounted(() => {
  // Initialiser l'authentification
  auth.init()
  
  if (props.initialDate) {
    form.value.date = props.initialDate
  }
  if (props.initialTime) {
    form.value.startTime = props.initialTime
  }
  if (props.endTime) {
    form.value.endTime = props.endTime
  }
  
  console.log('🚀 Modal de création de rendez-vous initialisé')
  console.log('👤 Utilisateur connecté:', auth.getCurrentUser.value?.name || 'Non connecté')
  
  // Test d'accès au store des animaux
  console.log('🐾 Store animaux:', animalsStore)
  console.log('🐾 Animaux dans le store:', animalsStore.animals)
  console.log('🐾 Animaux de l\'utilisateur:', userAnimals.value)
  console.log('🐾 État de chargement:', loadingAnimals.value)
  
  // Marquer comme initialisé pour éviter que le watcher écrase endTime
  isInitialized.value = true
})

// Variable pour éviter l'écrasement de endTime lors de l'initialisation
const isInitialized = ref(false)

// Watcher pour synchroniser les heures (seulement après initialisation)
watch(() => form.value.startTime, (newStartTime, oldStartTime) => {
  // Ne pas écraser endTime lors de l'initialisation ou si endTime a été défini par les props
  if (!isInitialized.value || !oldStartTime) return
  
  if (newStartTime && props.duration) {
    const start = new Date(`2000-01-01T${newStartTime}:00`)
    start.setHours(start.getHours() + props.duration)
    const calculatedEndTime = start.toTimeString().slice(0, 5)
    
    console.log('🔄 Watcher startTime: Calcul automatique endTime:', calculatedEndTime)
    form.value.endTime = calculatedEndTime
  }
})

// Méthode exposée pour recevoir le service sélectionné
const setSelectedService = (service) => {
  form.value.selectedService = service
}

// Exposer la méthode pour le parent
defineExpose({
  setSelectedService
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.modal-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #374151;
}

.appointment-form {
  padding: 0 24px 24px;
}

.form-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
  font-size: 14px;
}

.form-input, .form-textarea {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #43A047;
  box-shadow: 0 0 0 3px rgba(67, 160, 71, 0.1);
}

.duration-info {
  margin-top: 12px;
  text-align: center;
}

.duration-badge {
  background: #E8F5E8;
  color: #43A047;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.animal-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
}

.animal-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.animal-btn:hover {
  border-color: #43A047;
  background: #f9f9f9;
}

.animal-btn.active {
  border-color: #43A047;
  background: #E8F5E8;
  color: #43A047;
}

.animal-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.animal-label {
  font-size: 14px;
  font-weight: 500;
}

.location-type-selector {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.radio-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
}

.radio-option input[type="radio"] {
  margin-right: 8px;
  accent-color: #43A047;
}

.address-input-container {
  display: flex;
  gap: 8px;
}

.address-input-container .form-input {
  flex: 1;
}

.map-toggle-btn {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.map-toggle-btn:hover {
  background: #f3f4f6;
}

.map-container {
  margin-top: 12px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.mock-map {
  height: 200px;
  background: linear-gradient(45deg, #e8f5e8 25%, transparent 25%),
              linear-gradient(-45deg, #e8f5e8 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #e8f5e8 75%),
              linear-gradient(-45deg, transparent 75%, #e8f5e8 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  position: relative;
  cursor: crosshair;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-marker {
  position: absolute;
  font-size: 24px;
  z-index: 2;
}

.map-instructions {
  color: #6b7280;
  font-size: 14px;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 4px;
}

.coordinates-info {
  padding: 8px 12px;
  background: #f3f4f6;
  font-size: 12px;
  color: #6b7280;
}

.form-help {
  color: #6b7280;
  font-size: 12px;
  margin-top: 4px;
}

.service-selector {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.selected-service {
  padding: 16px;
  border: 2px solid #43A047;
  border-radius: 8px;
  background: #E8F5E8;
}

.service-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.service-info h4 {
  margin: 0 0 8px 0;
  color: #43A047;
  font-weight: 600;
}

.service-address, .service-phone {
  margin: 4px 0;
  color: #6b7280;
  font-size: 14px;
}

.remove-service-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
}

.remove-service-btn:hover {
  color: #dc2626;
}

.search-container {
  margin-bottom: 16px;
}

.search-input-container {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #43A047;
  box-shadow: 0 0 0 3px rgba(67, 160, 71, 0.1);
}

.search-toggle-btn {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 16px;
}

.search-toggle-btn:hover,
.search-toggle-btn.active {
  background: #43A047;
  border-color: #43A047;
  color: white;
}

.distance-filter {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.distance-filter label {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
}

.distance-slider {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #e9ecef;
  outline: none;
  -webkit-appearance: none;
}

.distance-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #43A047;
  cursor: pointer;
}

.distance-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #43A047;
  cursor: pointer;
  border: none;
}

.search-results {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  max-height: 400px;
  overflow-y: auto;
}

.search-results-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-results-header h4 {
  margin: 0;
  font-size: 16px;
  color: #374151;
}

.results-count {
  font-size: 12px;
  color: #6b7280;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px;
  color: #6b7280;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #43A047;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.services-list {
  display: flex;
  flex-direction: column;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s;
}

.service-item:hover {
  background: #f9f9f9;
}

.service-item.selected {
  background: #E8F5E8;
  border-left: 4px solid #43A047;
}

.service-item:last-child {
  border-bottom: none;
}

.service-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
}

.service-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  font-size: 24px;
}

.service-details {
  flex: 1;
}

.service-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.service-address,
.service-distance {
  margin: 2px 0;
  font-size: 13px;
  color: #6b7280;
}

.service-contact {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.call-btn {
  background: #43A047;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.call-btn:hover {
  background: #388E3C;
}

.no-results {
  text-align: center;
  padding: 32px;
  color: #6b7280;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-results p {
  margin: 8px 0;
  font-weight: 500;
}

.no-results small {
  font-size: 12px;
  opacity: 0.8;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
  margin-top: 32px;
}

.btn {
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
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
  background: #43A047;
  color: white;
  border: 1px solid #43A047;
}

.btn-primary:hover:not(:disabled) {
  background: #388E3C;
}

.btn-primary:disabled {
  background: #9ca3af;
  border-color: #9ca3af;
  cursor: not-allowed;
}

.mt-3 {
  margin-top: 16px;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .animal-selector {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .location-type-selector {
    flex-direction: column;
    gap: 12px;
  }
}

/* Styles pour les erreurs */
.error-section {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.error-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.error-header h4 {
  color: #dc2626;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.clear-errors-btn {
  background: none;
  border: none;
  color: #dc2626;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.clear-errors-btn:hover {
  background: #fecaca;
}

.error-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.error-item {
  font-size: 14px;
}

.error-item strong {
  color: #dc2626;
  font-weight: 600;
}

.error-item ul {
  margin: 4px 0 0 0;
  padding-left: 20px;
}

.error-item li {
  color: #991b1b;
  margin: 2px 0;
}
</style>