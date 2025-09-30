<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4 font-['League_Spartan']">
      <!-- Header du modal -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-[#2e2e30]">
          Ajouter une spécialité
        </h3>
        <button 
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
        >
          ×
        </button>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="submitSpeciality">
        <!-- Sélection de la spécialité -->
        <div class="mb-4">
          <label class="block text-[#4b5563] text-sm font-medium mb-2">
            Spécialité <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.specialite_id"
            class="w-full p-3 border border-[#ddd] rounded-lg text-sm focus:outline-none focus:border-[#43A047] focus:ring-1 focus:ring-[#43A047]"
            :class="{ 'border-red-500': errors.specialite_id }"
            required
            :disabled="isLoadingSpecialites"
          >
            <option value="">
              {{ isLoadingSpecialites ? 'Chargement des spécialités...' : 'Sélectionnez une spécialité' }}
            </option>
            <option 
              v-for="specialite in availableSpecialites" 
              :key="specialite.id" 
              :value="specialite.id"
              :title="specialite.description"
            >
              {{ specialite.name }}
            </option>
          </select>
          <div v-if="errors.specialite_id" class="text-red-500 text-xs mt-1">
            {{ errors.specialite_id }}
          </div>
          <div v-if="availableSpecialites.length === 0 && !isLoadingSpecialites" class="text-amber-600 text-xs mt-1">
            Toutes les spécialités sont déjà ajoutées à votre profil
          </div>
        </div>

        <!-- Niveau de certification -->
        <div class="mb-4">
          <label class="block text-[#4b5563] text-sm font-medium mb-2">
            Niveau de certification <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.certification_level"
            class="w-full p-3 border border-[#ddd] rounded-lg text-sm focus:outline-none focus:border-[#43A047] focus:ring-1 focus:ring-[#43A047]"
            :class="{ 'border-red-500': errors.certification_level }"
            required
          >
            <option value="">Sélectionnez un niveau</option>
            <option 
              v-for="level in certificationLevels" 
              :key="level.value" 
              :value="level.value"
            >
              {{ level.icon }} {{ level.label }}
            </option>
          </select>
          <div v-if="errors.certification_level" class="text-red-500 text-xs mt-1">
            {{ errors.certification_level }}
          </div>
        </div>

        <!-- Date de certification -->
        <div class="mb-4">
          <label class="block text-[#4b5563] text-sm font-medium mb-2">
            Date de certification
          </label>
          <input
            type="date"
            v-model="form.certified_since"
            class="w-full p-3 border border-[#ddd] rounded-lg text-sm focus:outline-none focus:border-[#43A047] focus:ring-1 focus:ring-[#43A047]"
            :max="today"
          />
          <div class="text-gray-500 text-xs mt-1">
            Date d'obtention de la certification (optionnel)
          </div>
        </div>

        <!-- Date d'expiration -->
        <div class="mb-4">
          <label class="block text-[#4b5563] text-sm font-medium mb-2">
            Date d'expiration
          </label>
          <input
            type="date"
            v-model="form.certification_expires"
            class="w-full p-3 border border-[#ddd] rounded-lg text-sm focus:outline-none focus:border-[#43A047] focus:ring-1 focus:ring-[#43A047]"
            :min="form.certified_since || today"
          />
          <div class="text-gray-500 text-xs mt-1">
            Date d'expiration de la certification (optionnel)
          </div>
        </div>

        <!-- Notes -->
        <div class="mb-4">
          <label class="block text-[#4b5563] text-sm font-medium mb-2">
            Notes
          </label>
          <textarea
            v-model="form.notes"
            placeholder="Ex: Certification obtenue après 5 ans d'expérience..."
            rows="3"
            class="w-full p-3 border border-[#ddd] rounded-lg text-sm focus:outline-none focus:border-[#43A047] focus:ring-1 focus:ring-[#43A047] resize-none"
            maxlength="500"
          ></textarea>
          <div class="text-gray-500 text-xs mt-1">
            {{ form.notes?.length || 0 }}/500 caractères
          </div>
        </div>

        <!-- Spécialité principale -->
        <div class="mb-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="form.is_primary"
              class="w-4 h-4 text-[#43A047] border-gray-300 rounded focus:ring-[#43A047]"
              :disabled="hasPrimarySpeciality && !form.is_primary"
            />
            <span class="text-[#4b5563] text-sm font-medium">
              Définir comme spécialité principale
            </span>
          </label>
          <div v-if="hasPrimarySpeciality && !form.is_primary" class="text-amber-600 text-xs mt-1">
            Vous avez déjà une spécialité principale. Décochez l'actuelle pour en définir une nouvelle.
          </div>
          <div v-if="form.is_primary" class="text-green-600 text-xs mt-1">
            Cette spécialité sera votre spécialité principale
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex gap-3">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            :disabled="isSubmitting"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-3 bg-[#43A047] text-white rounded-lg hover:bg-[#388E3C] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSubmitting || !canSubmit"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Ajout...
            </span>
            <span v-else>Ajouter</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUserSpecialities } from '@/composables/useUserSpecialities.js'
import { useSpecialites } from '@/composables/useSpecialites.js'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'speciality-added'])

// Composables
const { 
  addUserSpeciality, 
  getCertificationLevels,
  hasSpeciality,
  hasPrimarySpeciality,
  validateSpecialityData
} = useUserSpecialities()

const { 
  activeSpecialites,
  isLoading: isLoadingSpecialites,
  loadActiveSpecialites
} = useSpecialites()

// État du formulaire
const form = ref({
  specialite_id: '',
  certification_level: '',
  certified_since: '',
  certification_expires: '',
  notes: '',
  is_primary: false
})

// État du modal
const isSubmitting = ref(false)
const errors = ref({})

// Date d'aujourd'hui pour les contraintes de date
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Niveaux de certification disponibles
const certificationLevels = computed(() => getCertificationLevels())

// Spécialités disponibles (non encore ajoutées par l'utilisateur)
const availableSpecialites = computed(() => {
  if (!activeSpecialites.value) return []
  
  return activeSpecialites.value.filter(specialite => 
    !hasSpeciality(specialite.id)
  )
})

// Vérifier si le formulaire peut être soumis
const canSubmit = computed(() => {
  return form.value.specialite_id && 
         form.value.certification_level && 
         !isSubmitting.value &&
         availableSpecialites.value.length > 0
})

// Watcher pour réinitialiser is_primary si une spécialité principale existe déjà
watch(() => hasPrimarySpeciality.value, (newValue) => {
  if (newValue && form.value.is_primary) {
    form.value.is_primary = false
  }
})

// Fonctions
const closeModal = () => {
  if (!isSubmitting.value) {
    resetForm()
    emit('close')
  }
}

const resetForm = () => {
  form.value = {
    specialite_id: '',
    certification_level: '',
    certified_since: '',
    certification_expires: '',
    notes: '',
    is_primary: false
  }
  errors.value = {}
}

const validateForm = () => {
  errors.value = {}
  
  // Validation spécialité
  if (!form.value.specialite_id) {
    errors.value.specialite_id = 'Veuillez sélectionner une spécialité'
  }
  
  // Validation niveau de certification
  if (!form.value.certification_level) {
    errors.value.certification_level = 'Veuillez sélectionner un niveau de certification'
  }
  
  // Validation dates
  if (form.value.certified_since && form.value.certification_expires) {
    const certifiedDate = new Date(form.value.certified_since)
    const expiresDate = new Date(form.value.certification_expires)
    
    if (expiresDate <= certifiedDate) {
      errors.value.certification_expires = 'La date d\'expiration doit être postérieure à la date de certification'
    }
  }
  
  return Object.keys(errors.value).length === 0
}

const submitSpeciality = async () => {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Préparer les données selon le format requis
    const specialityData = {
      specialite_id: form.value.specialite_id,
      certification_level: form.value.certification_level,
      is_primary: form.value.is_primary
    }
    
    // Ajouter les champs optionnels s'ils sont remplis
    if (form.value.certified_since) {
      specialityData.certified_since = form.value.certified_since
    }
    
    if (form.value.certification_expires) {
      specialityData.certification_expires = form.value.certification_expires
    }
    
    if (form.value.notes?.trim()) {
      specialityData.notes = form.value.notes.trim()
    }
    
    console.log('📤 Ajout spécialité utilisateur:', specialityData)
    
    // Appeler le service
    const result = await addUserSpeciality(specialityData)
    
    if (result.success) {
      console.log('✅ Spécialité ajoutée avec succès:', result.data)
      
      // Émettre l'événement de succès
      emit('speciality-added', result.data)
      
      // Fermer le modal
      closeModal()
      
      // Optionnel: Afficher une notification de succès
      // TODO: Intégrer système de notifications
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout de la spécialité:', error)
    
    // Gérer les erreurs de validation du serveur
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      errors.value.general = error.message || 'Une erreur est survenue lors de l\'ajout de la spécialité'
    }
  } finally {
    isSubmitting.value = false
  }
}

// Charger les spécialités au montage du modal
onMounted(async () => {
  if (props.isOpen) {
    try {
      await loadActiveSpecialites()
      console.log('✅ Spécialités chargées pour le modal:', activeSpecialites.value?.length || 0)
    } catch (error) {
      console.error('❌ Erreur chargement spécialités:', error)
    }
  }
})

// Watcher pour charger les spécialités quand le modal s'ouvre
watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    resetForm()
    try {
      await loadActiveSpecialites()
    } catch (error) {
      console.error('❌ Erreur chargement spécialités:', error)
    }
  }
})
</script>

<style scoped>
/* Styles spécifiques au modal si nécessaire */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
