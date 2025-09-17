<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">Ajouter un rendez-vous</h2>
        <button @click="closeModal" class="close-btn">×</button>
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

        <!-- Type d'animal -->
        <div class="form-section">
          <h3 class="section-title">🐾 Type d'animal</h3>
          <div class="animal-selector">
            <button 
              type="button"
              v-for="animal in animalTypes" 
              :key="animal.value"
              @click="selectAnimal(animal.value)"
              :class="['animal-btn', { active: form.animalType === animal.value }]"
            >
              <span class="animal-icon">{{ animal.icon }}</span>
              <span class="animal-label">{{ animal.label }}</span>
            </button>
          </div>
          
          <!-- Autre animal -->
          <div v-if="form.animalType === 'autre'" class="form-group mt-3">
            <label for="otherAnimal">Précisez l'animal</label>
            <input 
              type="text" 
              id="otherAnimal"
              v-model="form.otherAnimal" 
              placeholder="Ex: Lapin, Oiseau, Reptile..."
              class="form-input"
            />
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
                  @input="onSearchInput"
                />
                <button 
                  type="button" 
                  @click="toggleServiceSearch"
                  class="search-toggle-btn"
                  :class="{ active: showServiceSearch }"
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
            <div v-if="showServiceSearch && (filteredServices.length > 0 || isSearching)" class="search-results">
              <div class="search-results-header">
                <h4>🔍 Résultats pour "{{ serviceSearchQuery || 'Vétérinaire généraliste' }}"</h4>
                <span class="results-count">{{ filteredServices.length }} résultat(s) trouvé(s)</span>
              </div>

              <div v-if="isSearching" class="loading-state">
                <div class="loading-spinner"></div>
                <span>Recherche en cours...</span>
              </div>

              <div v-else class="services-list">
                <div 
                  v-for="service in filteredServices" 
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
                    <p class="service-address">📍 {{ service.address }}</p>
                    <p class="service-distance">📏 Distance : {{ service.distance }} km</p>
                  </div>
                  
                  <div class="service-contact">
                    <button 
                      type="button"
                      @click.stop="callService(service.phone)"
                      class="call-btn"
                    >
                      📞 {{ service.phone }}
                    </button>
                  </div>
                </div>

                <div v-if="filteredServices.length === 0 && !isSearching" class="no-results">
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
            :disabled="!isFormValid"
          >
            Créer le rendez-vous
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// Props
const props = defineProps({
  initialDate: { type: String, default: '' },
  initialTime: { type: String, default: '09:00' },
  endTime: { type: String, default: '10:00' },
  duration: { type: Number, default: 1 }
})

// Emits
const emit = defineEmits(['close', 'add-appointment'])

// State
const showMap = ref(false)
const showServiceSearch = ref(false)
const serviceSearchQuery = ref('')
const distanceRange = ref(5)
const isSearching = ref(false)

// Formulaire
const form = ref({
  date: '',
  startTime: '09:00',
  endTime: '10:00',
  animalType: '',
  otherAnimal: '',
  locationType: 'physical',
  address: '',
  coordinates: null,
  meetLink: '',
  selectedService: null,
  notes: ''
})

// Services de démonstration
const availableServices = ref([
  {
    id: 1,
    name: 'Solange FOURNIER',
    address: '250 route de la Vallée 69380 CIVRIEUX-D\'AZERGUES',
    phone: '04 78 43 45 67',
    distance: 2.5,
    speciality: 'Vétérinaire généraliste',
    avatar: null
  },
  {
    id: 2,
    name: 'Valerie VOUILLON',
    address: '250 route de la Vallée 69380 CIVRIEUX-D\'AZERGUES',
    phone: '04 78 43 45 67',
    distance: 2.5,
    speciality: 'Vétérinaire généraliste',
    avatar: null
  },
  {
    id: 3,
    name: 'Dr. Martin DUBOIS',
    address: '15 Avenue de la République 69001 LYON',
    phone: '04 78 28 35 42',
    distance: 8.2,
    speciality: 'Urgences vétérinaires',
    avatar: null
  },
  {
    id: 4,
    name: 'Clinique Vétérinaire du Centre',
    address: '32 Rue de la Liberté 69003 LYON',
    phone: '04 72 34 56 78',
    distance: 12.1,
    speciality: 'Chirurgie et radiologie',
    avatar: null
  },
  {
    id: 5,
    name: 'Cabinet Dr. Sophie MARTIN',
    address: '78 Boulevard des Belges 69006 LYON',
    phone: '04 78 45 67 89',
    distance: 15.3,
    speciality: 'Cardiologie vétérinaire',
    avatar: null
  }
])
const animalTypes = [
  { value: 'chien', label: 'Chien', icon: '🐕' },
  { value: 'chat', label: 'Chat', icon: '🐱' },
  { value: 'oiseau', label: 'Oiseau', icon: '🐦' },
  { value: 'lapin', label: 'Lapin', icon: '🐰' },
  { value: 'rongeur', label: 'Rongeur', icon: '🐹' },
  { value: 'reptile', label: 'Reptile', icon: '🦎' },
  { value: 'autre', label: 'Autre', icon: '🐾' }
]

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
    form.value.animalType &&
    (form.value.locationType === 'online' || form.value.address) &&
    calculatedDuration.value > 0
  )
})

const filteredServices = computed(() => {
  let services = availableServices.value.filter(service => 
    service.distance <= distanceRange.value
  )

  if (serviceSearchQuery.value.trim()) {
    const query = serviceSearchQuery.value.toLowerCase().trim()
    services = services.filter(service =>
      service.name.toLowerCase().includes(query) ||
      service.speciality.toLowerCase().includes(query) ||
      service.address.toLowerCase().includes(query)
    )
  }

  return services.sort((a, b) => a.distance - b.distance)
})

// Méthodes
const selectAnimal = (animalType) => {
  form.value.animalType = animalType
  if (animalType !== 'autre') {
    form.value.otherAnimal = ''
  }
}

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
    serviceSearchQuery.value = 'Vétérinaire généraliste'
    onSearchInput()
  }
}

const onSearchInput = () => {
  isSearching.value = true
  // Simuler un délai de recherche
  setTimeout(() => {
    isSearching.value = false
  }, 500)
}

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
  emit('close')
}

const submitAppointment = () => {
  if (!isFormValid.value) return
  
  const appointmentData = {
    date: form.value.date,
    startTime: form.value.startTime,
    endTime: form.value.endTime,
    duration: calculatedDuration.value,
    animalType: form.value.animalType === 'autre' ? form.value.otherAnimal : form.value.animalType,
    isOnline: form.value.locationType === 'online',
    address: form.value.locationType === 'physical' ? form.value.address : null,
    coordinates: form.value.coordinates,
    meetLink: form.value.meetLink,
    service: form.value.selectedService?.name || 'Consultation générale',
    serviceProvider: form.value.selectedService,
    notes: form.value.notes,
    title: `${form.value.selectedService?.name || 'Consultation'} - ${form.value.animalType === 'autre' ? form.value.otherAnimal : form.value.animalType}`,
    eventType: getEventTypeByService()
  }
  
  emit('add-appointment', appointmentData)
  closeModal()
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
  if (props.initialDate) {
    form.value.date = props.initialDate
  }
  if (props.initialTime) {
    form.value.startTime = props.initialTime
  }
  if (props.endTime) {
    form.value.endTime = props.endTime
  }
})

// Watcher pour synchroniser les heures
watch(() => form.value.startTime, (newStartTime) => {
  if (newStartTime && props.duration) {
    const start = new Date(`2000-01-01T${newStartTime}:00`)
    start.setHours(start.getHours() + props.duration)
    form.value.endTime = start.toTimeString().slice(0, 5)
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
</style>