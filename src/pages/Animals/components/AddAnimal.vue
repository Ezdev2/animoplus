<template>
  <BaseModal 
    title="Information sur l'animal" 
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

    <!-- Étape 1 -->
    <form v-if="step === 1" @submit.prevent="nextStep" class="form-content">
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

      <div class="medical-history">
        <img :src="DocMedical" class="icon" alt="historique" />
        <span>🩺 Historique médical</span>
      </div>

      <textarea v-model="formData.medical" placeholder="Écrire ici ..."></textarea>

      <label>
        Poids (kg)
        <input type="number" placeholder="Poids en kg" v-model="formData.weight" />
      </label>

      <label>
        Taille (cm)
        <input type="number" placeholder="Taille en cm" v-model="formData.height" />
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
        Photo de l'animal
        <div class="photo-upload-container">
          <!-- Zone de prévisualisation -->
          <div v-if="photoPreview" class="photo-preview">
            <img :src="photoPreview" alt="Aperçu photo animal" class="preview-image" />
            <button type="button" @click="removePhoto" class="remove-photo-btn">
              <span>×</span>
            </button>
          </div>
          
          <!-- Zone d'upload -->
          <div v-else class="photo-upload-zone" @click="triggerFileInput" @drop="handleDrop" @dragover.prevent @dragenter.prevent>
            <div class="upload-content">
              <img :src="uploadIcon" class="upload-icon" alt="Upload" />
              <p class="upload-text">Cliquez ou glissez une photo ici</p>
              <p class="upload-hint">JPG, PNG, WebP - Max 5MB</p>
            </div>
          </div>
          
          <!-- Input file caché -->
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            class="hidden-file-input"
          />
          
          <!-- État d'upload -->
          <div v-if="uploadingPhoto" class="upload-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
            </div>
            <p class="upload-status">Upload en cours... {{ uploadProgress }}%</p>
          </div>
        </div>
      </label>

      <div class="actions">
        <button type="button" class="btn-primary" @click="nextStep">Suivant</button>
      </div>
    </form>

    <!-- Étape 2 -->
    <form v-else-if="step === 2" @submit.prevent="submitForm" class="form-content">
      <h3 class="font-semibold text-gray-700">Profil comportemental</h3>

      <Question
        label="Comment votre animal se comporte-t-il lors des promenades ?"
        :options="[
          { text: 'Il est calme et marche bien en laisse', value: 1 },
          { text: 'Il tire beaucoup ou s\'excite facilement', value: 2 },
          { text: 'Il est craintif ou réactif (aboie, grogne, etc.)', value: 3 },
          { text: 'Non concerné', value: 4 }
        ]"
        v-model="formData.promenades"
      />

      <Question
        label="Votre animal est-il sociable avec les autres animaux ?"
        :options="[
          { text: 'Oui, il joue volontiers avec eux', value: 1 },
          { text: 'Oui, mais il préfère les animaux calmes', value: 2 },
          { text: 'Non, il est réactif ou craintif', value: 3 },
          { text: 'Je ne sais pas / rarement en contact', value: 4 }
        ]"
        v-model="formData.sociabilite"
      />

      <Question
        label="Comment réagit-il face aux inconnus ?"
        :options="[
          { text: 'Il est à l\'aise et sociable', value: 1 },
          { text: 'Il est méfiant au début, puis se détend', value: 2 },
          { text: 'Il grogne, aboie ou fuit', value: 3 },
          { text: 'Je ne sais pas', value: 4 }
        ]"
        v-model="formData.inconnus"
      />

      <Question
        label="Votre animal supporte-t-il bien les manipulations (vétérinaire, toilettage, soins, etc.) ?"
        :options="[
          { text: 'Oui, sans souci', value: 1 },
          { text: 'Il est stressé mais coopératif', value: 2 },
          { text: 'Il se débat ou peut mordre / griffer', value: 3 },
          { text: 'Jamais testé', value: 4 }
        ]"
        v-model="formData.manipulations"
      />

      <Question
        label="Votre animal est-il propre et calme à la maison ?"
        :options="[
          { text: 'Oui, totalement', value: 1 },
          { text: 'Il a parfois des accidents ou vocalise', value: 2 },
          { text: 'Il détruit, fugue ou a des troubles du comportement', value: 3 },
          { text: 'Non applicable', value: 4 }
        ]"
        v-model="formData.maison"
      />

      <Question
        label="Peut-il rester seul sans problème ?"
        :options="[
          { text: 'Oui, il reste calme', value: 1 },
          { text: 'Il pleure un peu, mais se calme', value: 2 },
          { text: 'Non, il est destructeur ou très anxieux', value: 3 },
          { text: 'Je ne l\'ai jamais laissé seul', value: 4 }
        ]"
        v-model="formData.seul"
      />

      <Question
        label="Votre animal a-t-il des peurs ou sensibilités particulières ?"
        :options="[
          { text: 'Non, il est plutôt confiant', value: 1 },
          { text: 'Oui, il a peur des bruits forts ou des inconnus', value: 2 },
          { text: 'Oui, il est sensible à certaines manipulations', value: 3 },
          { text: 'Je ne sais pas', value: 4 }
        ]"
        v-model="formData.peurs"
      />

      <label>
        Souhaitez-vous signaler un comportement spécifique ?
        <textarea v-model="formData.notes" placeholder="Réponse facultative..."></textarea>
      </label>

      <div class="actions">
        <button type="button" class="btn-secondary" @click="prevStep">Retour</button>
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Création...' : 'Valider' }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import Question from '@/components/common/Question.vue'
import calendarIcon from '@/assets/icons/calendar.svg'
import DocMedical from '@/assets/icons/DocMedical.svg'
import uploadIcon from '@/assets/icons/upload.svg'

// Services pour les animaux
import { useCreateAnimal } from '@/services/animals/animalQueries.js'
import { useSpeciesCache } from '@/composables/useSpeciesCache.js'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'

// Props et émissions
const emit = defineEmits(['close', 'animal-created'])

// Authentification pour récupérer l'utilisateur connecté
const auth = useSimpleAuth()
const currentUser = computed(() => auth.getCurrentUser.value)

// États du formulaire
const step = ref(1)
const isSubmitting = ref(false)
const error = ref('')
const success = ref('')

// Date maximale (aujourd'hui)
const maxDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Variables pour la gestion de la photo
const fileInput = ref(null)
const photoPreview = ref('')
const selectedFile = ref(null)
const uploadingPhoto = ref(false)
const uploadProgress = ref(0)

// Données du formulaire avec propriétés comportementales numériques
const formData = ref({
  name: '',
  species: '',
  race: '',
  gender: '',
  medical: '',
  weight: '',
  height: '',
  birthDate: '',

  // Profil comportemental (valeurs numériques 1-4)
  promenades: null,
  sociabilite: null,
  inconnus: null,
  manipulations: null,
  maison: null,
  seul: null,
  peurs: null,
  notes: '',
  
  // Photo de l'animal
  photo_url: ''
})

// Récupération des espèces avec cache optimisé
const { species: speciesData, isLoading: loadingSpecies } = useSpeciesCache({ withRaces: true })
const speciesList = computed(() => speciesData.value || [])

// Debug pour les espèces
watch(speciesList, (newSpecies) => {
  console.log('Espèces chargées depuis le cache:', newSpecies)
}, { immediate: true })

// Espèce sélectionnée pour récupérer les races
const selectedSpecies = computed(() => {
  return speciesList.value.find(species => species.nom === formData.value.species)
})

// Races de l'espèce sélectionnée (incluses dans les données d'espèces)
const racesList = computed(() => {
  if (!selectedSpecies.value || !selectedSpecies.value.races) {
    return []
  }
  return selectedSpecies.value.races
})

// Loading des races (toujours false car incluses dans les espèces)
const loadingRaces = computed(() => false)

// Debug pour l'espèce sélectionnée
watch(() => formData.value.species, (newSpecies) => {
  console.log('Espèce sélectionnée:', newSpecies)
  console.log('Races disponibles:', racesList.value)
})

// Watcher pour réinitialiser la race quand l'espèce change
watch(() => formData.value.species, (newSpecies, oldSpecies) => {
  if (newSpecies !== oldSpecies) {
    // Réinitialiser la race sélectionnée quand l'espèce change
    formData.value.race = ''
    console.log('Espèce changée:', newSpecies)
    console.log('Espèce sélectionnée:', selectedSpecies.value)
  }
})

// Debug pour les races
watch(racesList, (newRaces) => {
  console.log('Races chargées:', newRaces)
}, { immediate: true })

watch(loadingRaces, (loading) => {
  console.log('Chargement races:', loading)
})

// Mutation pour créer un animal
const createAnimalMutation = useCreateAnimal({
  onSuccess: (data) => {
    success.value = 'Animal créé avec succès !'
    emit('animal-created', data.data)
    setTimeout(() => {
      emit('close')
    }, 1500)
  },
  onError: (err) => {
    error.value = err.response?.data?.message || 'Erreur lors de la création de l\'animal'
    console.error('Erreur création animal:', err)
  }
})

// Fonction pour formater les données selon l'API
function formatAnimalDataForAPI() {
  // Trouver l'ID de l'espèce sélectionnée
  const selectedSpecies = speciesList.value.find(s => s.nom === formData.value.species)
  const selectedRace = racesList.value.find(r => r.nom === formData.value.race)
  
  // Construire les observations avec l'historique médical et les notes
  const observations = []
  if (formData.value.medical) observations.push(`Historique médical: ${formData.value.medical}`)
  if (formData.value.notes) observations.push(`Notes comportementales: ${formData.value.notes}`)

  return {
    // Champs requis selon l'API
    nom: formData.value.name,
    espece_id: selectedSpecies?.id,
    sexe: formData.value.gender,
    proprietaire_id: currentUser.value?.id,
    
    // Champs optionnels de base
    race_id: selectedRace?.id || null,
    date_naissance: formData.value.birthDate || null,
    couleur: null, // Pas dans le formulaire actuel
    poids: formData.value.weight ? parseFloat(formData.value.weight) : null,
    numero_puce: null, // Pas dans le formulaire actuel
    numero_tatouage: null, // Pas dans le formulaire actuel
    sterilise: false, // Par défaut, à ajouter si nécessaire
    observations: observations.join('\n\n'),
    
    // Profil comportemental (valeurs numériques 1-4)
    promenades: formData.value.promenades,
    sociabilite: formData.value.sociabilite,
    inconnus: formData.value.inconnus,
    manipulations: formData.value.manipulations,
    maison: formData.value.maison,
    seul: formData.value.seul,
    peurs: formData.value.peurs,
    
    // Photo de l'animal
    photo: formData.value.photo_url || null
  }
}

// Validation du formulaire
function validateForm() {
  const errors = []
  
  if (!formData.value.name.trim()) {
    errors.push('Le nom est requis')
  }
  
  if (!formData.value.species) {
    errors.push('L\'espèce est requise')
  }
  
  if (!formData.value.gender) {
    errors.push('Le sexe est requis')
  }
  
  if (!currentUser.value?.id) {
    errors.push('Utilisateur non connecté')
  }
  
  return errors
}

// Soumission du formulaire
async function submitForm() {
  try {
    isSubmitting.value = true
    error.value = ''
    
    // Validation
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      error.value = validationErrors.join(', ')
      return
    }
    
    // Upload de la photo si une photo est sélectionnée
    if (selectedFile.value) {
      try {
        console.log('Upload de la photo en cours...')
        const photoUrl = await uploadPhotoToCloudinary(selectedFile.value)
        formData.value.photo_url = photoUrl
        console.log('Photo uploadée avec succès:', photoUrl)
      } catch (photoError) {
        error.value = photoError.message
        return
      }
    }
    
    // Formater les données pour l'API
    const animalData = formatAnimalDataForAPI()
    
    console.log('Données envoyées à l\'API:', animalData)
    
    await createAnimalMutation.mutateAsync(animalData)
  } catch (err) {
    // L'erreur est gérée par onError de la mutation
  } finally {
    isSubmitting.value = false
  }
}

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

// Fonction pour calculer l'âge
function calculateAge(birthDate) {
  if (!birthDate) return null
  
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

// === FONCTIONS GESTION PHOTO ===

// Déclencher la sélection de fichier
function triggerFileInput() {
  fileInput.value?.click()
}

// Gérer la sélection de fichier
function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    validateAndPreviewFile(file)
  }
}

// Gérer le drag & drop
function handleDrop(event) {
  event.preventDefault()
  const files = event.dataTransfer.files
  if (files.length > 0) {
    validateAndPreviewFile(files[0])
  }
}

// Valider et prévisualiser le fichier
function validateAndPreviewFile(file) {
  // Validation du type de fichier
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    error.value = 'Format de fichier non supporté. Utilisez JPG, PNG ou WebP.'
    return
  }
  
  // Validation de la taille (5MB max)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    error.value = 'Le fichier est trop volumineux. Taille maximale : 5MB.'
    return
  }
  
  // Réinitialiser l'erreur
  error.value = ''
  
  // Stocker le fichier sélectionné
  selectedFile.value = file
  
  // Créer la prévisualisation
  const reader = new FileReader()
  reader.onload = (e) => {
    photoPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// Supprimer la photo sélectionnée
function removePhoto() {
  selectedFile.value = null
  photoPreview.value = ''
  formData.value.photo_url = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Upload vers Cloudinary
async function uploadPhotoToCloudinary(file) {
  if (!file) return null
  
  try {
    uploadingPhoto.value = true
    uploadProgress.value = 0
    
    console.log('🚀 Upload photo animal vers Cloudinary:', file.name)
    
    // Utiliser le même service Cloudinary que le profil
    const { cloudinaryService } = await import('@/services/cloudinary/cloudinaryService.js')
    
    const result = await cloudinaryService.uploadImage(file, {
      folder: 'animoplus/animals',
      maxSize: 5 * 1024 * 1024, // 5MB max pour les photos d'animaux
      tags: ['animal', 'photo'],
      publicId: `animal_${currentUser.value?.id}_${Date.now()}`
    })
    
    if (!result.success) {
      throw new Error(result.error || 'Erreur lors de l\'upload de l\'image')
    }
    
    uploadProgress.value = 100
    console.log('✅ Photo animal uploadée sur Cloudinary:', result.data.secure_url)
    
    return result.data.secure_url
    
  } catch (error) {
    console.error('❌ Erreur upload Cloudinary:', error)
    throw new Error(error.message || 'Impossible d\'uploader l\'image. Veuillez réessayer.')
  } finally {
    uploadingPhoto.value = false
    uploadProgress.value = 0
  }
}

function nextStep() {
  step.value = 2
}

function prevStep() {
  step.value = 1
}

// Fermer le modal
function closeModal() {
  emit('close')
}

onMounted(() => {
  // Réinitialiser le formulaire à l'ouverture
  step.value = 1
  error.value = ''
  success.value = ''
  
  // Réinitialiser les variables de photo
  photoPreview.value = ''
  selectedFile.value = null
  uploadingPhoto.value = false
  uploadProgress.value = 0
  
  // Réinitialiser les données du formulaire
  formData.value = {
    name: '',
    species: '',
    race: '',
    gender: '',
    medical: '',
    weight: '',
    height: '',
    birthDate: '',
    
    // Profil comportemental (valeurs numériques)
    promenades: null,
    sociabilite: null,
    inconnus: null,
    manipulations: null,
    maison: null,
    seul: null,
    peurs: null,
    notes: '',
    
    // Photo de l'animal
    photo_url: ''
  }
})
</script>

<style scoped>
/* même style que toi */
.form-content {
  margin-top: 12px;
  font-size: medium;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: scroll;
}

label {
  color: #4B5563;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

input,
select,
textarea {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
}

textarea {
  resize: vertical;
  min-height: 60px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

.btn-primary {
  background: #43a047;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.btn-primary:disabled {
  background: #a5a5a5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

/* Messages d'état */
.error-message {
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 12px;
  font-size: 14px;
}

.success-message {
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 12px;
  font-size: 14px;
}

/* Styles pour les champs désactivés */
select:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

/* Style pour les icônes et éléments existants */
.medical-history {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4B5563;
  font-weight: 500;
}

.icon {
  width: 16px;
  height: 16px;
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
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
  background: white;
  position: relative;
}

.date-picker-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #374151;
  background: transparent;
  cursor: pointer;
}

.date-picker-input::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.date-display {
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
  padding-left: 24px;
  text-transform: capitalize;
}

.date-input-wrapper:hover {
  border-color: #43a047;
}

.date-input-wrapper:focus-within {
  border-color: #43a047;
  box-shadow: 0 0 0 2px rgba(67, 160, 71, 0.1);
}

/* === STYLES POUR L'UPLOAD DE PHOTO === */

.photo-upload-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.photo-upload-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fafafa;
}

.photo-upload-zone:hover {
  border-color: #43a047;
  background-color: #f0f8f0;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-icon {
  width: 32px;
  height: 32px;
  opacity: 0.6;
}

.upload-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.upload-hint {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.photo-preview {
  position: relative;
  display: inline-block;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-image {
  width: 200px;
  height: 150px;
  object-fit: cover;
  display: block;
}

.remove-photo-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #666;
  transition: all 0.2s ease;
}

.remove-photo-btn:hover {
  background-color: #ff4444;
  color: white;
}

.hidden-file-input {
  display: none;
}

.upload-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #43a047;
  transition: width 0.3s ease;
}

.upload-status {
  font-size: 12px;
  color: #666;
  text-align: center;
  margin: 0;
}
</style>
