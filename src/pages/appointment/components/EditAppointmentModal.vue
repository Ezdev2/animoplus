<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">Modifier le rendez-vous</h2>
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
        </div>

        <!-- Service -->
        <div class="form-section">
          <h3 class="section-title">🏥 Service</h3>
          
          <div class="form-group">
            <label for="service">Service sélectionné</label>
            <div class="selected-service" v-if="form.selectedService">
              <div class="service-info">
                <h4>{{ form.selectedService.name }}</h4>
                <p>{{ form.selectedService.description }}</p>
                <span class="service-price">{{ form.selectedService.price }}€</span>
              </div>
              <button type="button" @click="openServiceModal" class="change-service-btn">
                Changer
              </button>
            </div>
            <button type="button" v-else @click="openServiceModal" class="select-service-btn">
              Sélectionner un service
            </button>
          </div>
        </div>

        <!-- Animal -->
        <div class="form-section">
          <h3 class="section-title">🐕 Animal</h3>
          
          <div class="form-group">
            <label for="animal">Animal sélectionné</label>
            <div class="selected-animal" v-if="form.selectedAnimal">
              <div class="animal-info">
                <h4>{{ form.selectedAnimal.nom }}</h4>
                <p>{{ form.selectedAnimal.espece || 'Espèce non précisée' }}</p>
              </div>
              <button type="button" @click="openAnimalModal" class="change-animal-btn">
                Changer
              </button>
            </div>
            <button type="button" v-else @click="openAnimalModal" class="select-animal-btn">
              Sélectionner un animal
            </button>
          </div>
        </div>

        <!-- Type de consultation -->
        <div class="form-section">
          <h3 class="section-title">💻 Type de consultation</h3>
          
          <div class="radio-group">
            <label class="radio-option">
              <input 
                type="radio" 
                name="consultationType" 
                value="onsite"
                v-model="form.consultationType"
              />
              <span class="radio-label">Sur place</span>
            </label>
            
            <label class="radio-option">
              <input 
                type="radio" 
                name="consultationType" 
                value="online"
                v-model="form.consultationType"
              />
              <span class="radio-label">En ligne</span>
            </label>
          </div>
        </div>

        <!-- Message optionnel -->
        <div class="form-section">
          <h3 class="section-title">💬 Message (optionnel)</h3>
          
          <div class="form-group">
            <label for="message">Message pour le vétérinaire</label>
            <textarea 
              id="message"
              v-model="form.message" 
              placeholder="Décrivez les symptômes ou préoccupations..."
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="button" @click="closeModal" class="cancel-btn">
            Annuler
          </button>
          <button type="submit" :disabled="!isFormValid || isUpdating" class="submit-btn">
            <span v-if="isUpdating">Modification...</span>
            <span v-else>Modifier le rendez-vous</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { useUpdateAppointment } from '@/services/appointments/appointmentQueries'

const props = defineProps({
  appointment: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])

const { success: showSuccess, error: showError } = useToast()

// Hook de mutation pour la mise à jour
const { mutate: updateAppointment, isPending: isUpdating } = useUpdateAppointment({
  onSuccess: (data) => {
    console.log('✅ Rendez-vous mis à jour:', data)
    showSuccess(data.message || 'Rendez-vous modifié avec succès !')
    emit('updated', data.data)
    closeModal()
  },
  onError: (error) => {
    console.error('❌ Erreur modification:', error)
    showError(error.error || 'Erreur lors de la modification du rendez-vous')
  }
})

// État du formulaire
const form = ref({
  date: '',
  startTime: '',
  endTime: '',
  selectedService: null,
  selectedAnimal: null,
  consultationType: 'onsite',
  message: ''
})

// Valeurs originales pour le dirty tracking
const originalValues = ref({
  date: '',
  startTime: '',
  endTime: '',
  selectedService: null,
  selectedAnimal: null,
  consultationType: 'onsite',
  message: ''
})

// isSubmitting est maintenant géré par le hook (isUpdating)

// Validation du formulaire
const isFormValid = computed(() => {
  try {
    return form.value?.date && 
           form.value?.startTime && 
           form.value?.endTime && 
           form.value?.selectedService && 
           form.value?.selectedAnimal
  } catch (error) {
    console.error('❌ Erreur validation formulaire:', error)
    return false
  }
})

// Fonction pour calculer les champs modifiés
const getChangedFields = () => {
  const changes = {}
  
  // Vérifier chaque champ
  if (form.value.date !== originalValues.value.date) {
    changes.date = form.value.date
  }
  
  if (form.value.startTime !== originalValues.value.startTime) {
    changes.start_time = form.value.startTime
  }
  
  if (form.value.endTime !== originalValues.value.endTime) {
    changes.end_time = form.value.endTime
  }
  
  if (form.value.selectedService?.id !== originalValues.value.selectedService?.id) {
    changes.service_id = form.value.selectedService?.id
  }
  
  if (form.value.selectedAnimal?.id !== originalValues.value.selectedAnimal?.id) {
    changes.animal_id = form.value.selectedAnimal?.id
  }
  
  if (form.value.consultationType !== originalValues.value.consultationType) {
    changes.location_type = form.value.consultationType
  }
  
  if (form.value.message !== originalValues.value.message) {
    changes.message = form.value.message || null
  }
  
  return changes
}

// Initialiser le formulaire avec les données du rendez-vous
const initializeForm = () => {
  if (!props.appointment) {
    console.warn('⚠️ Aucun appointment fourni pour l\'initialisation')
    return
  }

  const appointment = props.appointment
  console.log('🔧 Initialisation du formulaire avec:', appointment)

  // Format API
  if (appointment.date && appointment.start_time) {
    const formData = {
      date: appointment.date.split('T')[0], // "2025-09-25T00:00:00.000000Z" -> "2025-09-25"
      startTime: appointment.start_time, // "09:00:00"
      endTime: appointment.end_time, // "10:00:00"
      selectedService: appointment.service,
      selectedAnimal: appointment.animal,
      consultationType: appointment.location_type || 'onsite',
      message: appointment.message || ''
    }
    
    // Mettre à jour le formulaire
    Object.assign(form.value, formData)
    // Sauvegarder les valeurs originales
    Object.assign(originalValues.value, JSON.parse(JSON.stringify(formData)))
  }
  // Format Mock
  else if (appointment.date && appointment.heureDebut) {
    // Convertir "17 Juin 2025" en format YYYY-MM-DD
    const dateStr = appointment.date
    const formData = {
      date: convertMockDateToISO(dateStr),
      startTime: appointment.heureDebut,
      endTime: appointment.heureFin,
      selectedService: { name: appointment.service },
      selectedAnimal: { nom: appointment.animal },
      consultationType: appointment.enLigne ? 'online' : 'onsite',
      message: appointment.message || ''
    }
    
    // Mettre à jour le formulaire
    Object.assign(form.value, formData)
    // Sauvegarder les valeurs originales
    Object.assign(originalValues.value, JSON.parse(JSON.stringify(formData)))
  }

  console.log('🔧 Formulaire initialisé:', form.value)
}

// Convertir date mock en format ISO
const convertMockDateToISO = (mockDate) => {
  // Exemple: "17 Juin 2025" -> "2025-06-17"
  const months = {
    'Janvier': '01', 'Février': '02', 'Mars': '03', 'Avril': '04',
    'Mai': '05', 'Juin': '06', 'Juillet': '07', 'Août': '08',
    'Septembre': '09', 'Octobre': '10', 'Novembre': '11', 'Décembre': '12'
  }
  
  const parts = mockDate.split(' ')
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0')
    const month = months[parts[1]] || '01'
    const year = parts[2]
    return `${year}-${month}-${day}`
  }
  
  return new Date().toISOString().split('T')[0] // Fallback
}

// Initialiser au montage
onMounted(() => {
  initializeForm()
})

// Réinitialiser quand l'appointment change
watch(() => props.appointment, (newAppointment) => {
  console.log('👀 Watcher appointment:', newAppointment)
  if (newAppointment) {
    initializeForm()
  }
}, { immediate: true })

// Méthodes
const closeModal = () => {
  emit('close')
}

const openServiceModal = () => {
  // TODO: Ouvrir modal de sélection de service
  console.log('🏥 Ouvrir modal service')
}

const openAnimalModal = () => {
  // TODO: Ouvrir modal de sélection d'animal
  console.log('🐕 Ouvrir modal animal')
}

const submitAppointment = async () => {
  if (!isFormValid.value || isUpdating.value) return

  try {
    // Calculer seulement les champs modifiés
    const changedFields = getChangedFields()
    
    console.log('🔧 Modification du rendez-vous:', {
      appointmentId: props.appointment.id,
      originalValues: originalValues.value,
      currentValues: form.value,
      changedFields: changedFields
    })

    // Vérifier s'il y a des modifications
    if (Object.keys(changedFields).length === 0) {
      console.log('ℹ️ Aucune modification détectée')
      showSuccess('Aucune modification à sauvegarder')
      closeModal()
      return
    }

    console.log('📤 Envoi des champs modifiés uniquement:', changedFields)

    // Appeler l'API de modification avec seulement les champs modifiés
    updateAppointment({
      id: props.appointment.id,
      data: changedFields
    })

  } catch (error) {
    console.error('❌ Erreur lors de la modification:', error)
    showError('Erreur lors de la modification du rendez-vous')
  }
}
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
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #374151;
}

.appointment-form {
  padding: 24px;
}

.form-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
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
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.form-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #43A047;
  box-shadow: 0 0 0 3px rgba(67, 160, 71, 0.1);
}

.form-textarea {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s;
}

.form-textarea:focus {
  outline: none;
  border-color: #43A047;
  box-shadow: 0 0 0 3px rgba(67, 160, 71, 0.1);
}

.selected-service, .selected-animal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #f9fafb;
}

.service-info, .animal-info {
  flex: 1;
}

.service-info h4, .animal-info h4 {
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.service-info p, .animal-info p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.service-price {
  font-weight: 600;
  color: #43A047;
  font-size: 0.875rem;
}

.change-service-btn, .change-animal-btn {
  background: #43A047;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.change-service-btn:hover, .change-animal-btn:hover {
  background: #388E3C;
}

.select-service-btn, .select-animal-btn {
  width: 100%;
  padding: 12px;
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.select-service-btn:hover, .select-animal-btn:hover {
  border-color: #43A047;
  color: #43A047;
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio-option input[type="radio"] {
  margin: 0;
}

.radio-label {
  font-size: 0.875rem;
  color: #374151;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn {
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f9fafb;
}

.submit-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #43A047;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #388E3C;
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
