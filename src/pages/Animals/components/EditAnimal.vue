<template>
  <BaseModal 
    title="Modifier l'animal" 
    @close="closeModal" 
    :footer="false"
  >
    <!-- Messages d'état -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-if="success" class="success-message">
      {{ success }}
    </div>

    <!-- Formulaire d'édition -->
    <form @submit.prevent="saveChanges" class="form-content">
      <label>
        Nom
        <input type="text" placeholder="Entrer le nom" v-model="formData.name" />
      </label>

      <label>
        Espèce
        <select v-model="formData.species" :disabled="loadingSpecies">
          <option disabled value="">
            {{ loadingSpecies ? 'Chargement...' : 'Sélectionner une espèce' }}
          </option>
          <option v-for="species in speciesList" :key="species.id" :value="species.nom">
            {{ species.nom }}
          </option>
        </select>
      </label>

      <label>
        Race
        <select v-model="formData.race" :disabled="!formData.species || loadingRaces">
          <option disabled value="">
            {{ 
              loadingRaces ? 'Chargement...' : 
              !formData.species ? 'Sélectionner d\'abord une espèce' :
              racesList.length === 0 ? 'Aucune race disponible' :
              'Sélectionner une race'
            }}
          </option>
          <option v-for="race in racesList" :key="race.id" :value="race.nom">
            {{ race.nom }}
          </option>
        </select>
      </label>

      <label>
        Sexe
        <select v-model="formData.gender" required>
          <option disabled value="">Sélectionner le sexe</option>
          <option value="M">Mâle</option>
          <option value="F">Femelle</option>
        </select>
      </label>

      <label>
        Date de naissance
        <div class="date-picker-container">
          <div class="date-input-wrapper">
            <img :src="calendarIcon" class="icon" alt="date" />
            <input 
              type="date" 
              v-model="formData.birthDate"
              class="date-picker-input"
              :max="maxDate"
              placeholder="Sélectionner une date"
            />
          </div>
          <div v-if="formData.birthDate" class="date-display">
            {{ formatDisplayDate(formData.birthDate) }}
          </div>
        </div>
      </label>

      <label>
        Poids (kg)
        <input type="number" placeholder="Poids en kg" v-model="formData.weight" />
      </label>

      <div class="actions">
        <button type="button" class="btn-secondary" @click="closeModal">Annuler</button>
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Sauvegarde...' : 'Sauvegarder' }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import calendarIcon from '@/assets/icons/calendar.svg'

// Services
import { useUpdateAnimal } from '@/services/animals/animalQueries.js'
import { useSpeciesCache } from '@/composables/useSpeciesCache.js'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'

// Props
const props = defineProps({
  animal: {
    type: Object,
    required: true
  }
})

// Émissions
const emit = defineEmits(['close', 'animal-updated'])

// États
const isSubmitting = ref(false)
const error = ref('')
const success = ref('')

// Date maximale (aujourd'hui)
const maxDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Données du formulaire
const formData = ref({
  name: '',
  species: '',
  race: '',
  gender: '',
  weight: '',
  birthDate: ''
})

// Récupération des espèces avec cache optimisé
const { species: speciesData, isLoading: loadingSpecies } = useSpeciesCache({ withRaces: true })
const speciesList = computed(() => speciesData.value || [])

// Espèce sélectionnée
const selectedSpecies = computed(() => {
  return speciesList.value.find(s => s.nom === formData.value.species)
})

// Races de l'espèce sélectionnée
const racesList = computed(() => {
  if (!selectedSpecies.value || !selectedSpecies.value.races) {
    return []
  }
  return selectedSpecies.value.races
})

// Loading des races (toujours false car incluses dans les espèces)
const loadingRaces = computed(() => false)

// Mutation pour la mise à jour
const updateAnimalMutation = useUpdateAnimal({
  onSuccess: (data) => {
    success.value = 'Animal modifié avec succès !'
    console.log('✅ Animal mis à jour avec succès:', data)
    
    // Émettre l'événement immédiatement pour déclencher le refetch
    emit('animal-updated', data)
    
    // Fermer le modal après un court délai pour que l'utilisateur voie le message
    setTimeout(() => {
      closeModal()
    }, 1000)
  },
  onError: (err) => {
    console.error('❌ Erreur mise à jour animal:', err)
    error.value = err.message || 'Erreur lors de la modification'
  }
})

// Initialiser le formulaire avec les données de l'animal
onMounted(() => {
  if (props.animal) {
    console.log('Animal à éditer:', props.animal)
    formData.value = {
      name: props.animal.nom || '',
      species: props.animal.espece?.nom || '',
      race: props.animal.race?.nom || '',
      gender: props.animal.sexe || '',
      weight: props.animal.poids || '',
      birthDate: props.animal.date_naissance ? props.animal.date_naissance.split('T')[0] : ''
    }
    console.log('Formulaire initialisé:', formData.value)
  }
})

// Fonction pour formater l'affichage de la date
function formatDisplayDate(dateString) {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const options = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    weekday: 'long'
  }
  return date.toLocaleDateString('fr-FR', options)
}

// Sauvegarder les modifications
async function saveChanges() {
  try {
    isSubmitting.value = true
    error.value = ''

    // Validation basique
    if (!formData.value.name.trim()) {
      error.value = 'Le nom est requis'
      return
    }

    // Préparer les données pour l'API
    const updateData = {
      nom: formData.value.name,
      espece_id: selectedSpecies.value?.id,
      race_id: racesList.value.find(r => r.nom === formData.value.race)?.id || null,
      sexe: formData.value.gender,
      poids: formData.value.weight ? parseFloat(formData.value.weight) : null,
      date_naissance: formData.value.birthDate || null
    }

    console.log('Mise à jour animal:', updateData)
    
    await updateAnimalMutation.mutateAsync({
      id: props.animal.id,
      data: updateData
    })

  } catch (err) {
    console.error('Erreur mise à jour:', err)
  } finally {
    isSubmitting.value = false
  }
}

// Fermer le modal
function closeModal() {
  emit('close')
}
</script>

<style scoped>
/* Réutilisation des styles d'AddAnimal */
.form-content {
  margin-top: 12px;
  font-size: medium;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-content label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-weight: 500;
  color: #374151;
}

.form-content input,
.form-content select,
.form-content textarea {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-content input:focus,
.form-content select:focus,
.form-content textarea:focus {
  outline: none;
  border-color: #43a047;
  box-shadow: 0 0 0 2px rgba(67, 160, 71, 0.1);
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #43a047;
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background-color: #388e3c;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.success-message {
  background-color: #d1fae5;
  color: #065f46;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
}

/* Styles pour le datepicker */
.date-picker-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px;
  background: white;
}

.date-picker-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #374151;
  background: transparent;
}

.date-display {
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
  padding-left: 24px;
  text-transform: capitalize;
}

.icon {
  width: 16px;
  height: 16px;
}
</style>
