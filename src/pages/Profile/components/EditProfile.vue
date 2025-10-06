<template>
  <div class="flex flex-col gap-4 bg-white rounded-[10px] p-6 border border-neutral-200">
    <div class="flex items-center gap-2">
      <span class="cursor-pointer" @click="$emit('backToList')">Mon profil</span>
      <img :src="arrowIcon" alt="retour" class="w-[14px] cursor-pointer" />
      <strong class="text-black font-bold">Modifier mon profil</strong>
    </div>

    <hr />

    <div class="flex justify-between items-start mb-2">
      <div class="flex gap-5 items-center mt-2 mb-6">
        <img :src="userAvatar" alt="photo de profil" class="w-[90px] h-[90px] rounded-full object-cover" />

        <div>
          <label class="border border-[#E5E7EB] rounded-[9px] px-3 py-1 flex items-center gap-2 cursor-pointer text-[#4B5563] hover:border-accent-500 transition-colors" 
                 :class="{ 'opacity-50 cursor-not-allowed': loading }">
            <img :src="editIcon" alt="edit" />
            <span v-if="loading">Upload en cours...</span>
            <span v-else>Importer une image</span>
            <input type="file" accept="image/*" @change="handleFileSelect" :disabled="loading" hidden />
          </label>
          <p class="text-[12px] text-[#666] mt-1">L'image doit être moins de 5MB (JPG, PNG, GIF)</p>
          
          <!-- Indicateur de progression -->
          <div v-if="loading" class="mt-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-accent-500 h-2 rounded-full animate-pulse" style="width: 100%"></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">Upload et sauvegarde en cours...</p>
          </div>
        </div>
      </div>

      <!-- Bouton enregistrer -->
      <button @click="saveProfile" :disabled="loading" 
        class="bg-accent-500 text-white px-6 py-3 rounded-[14px] disabled:opacity-50 disabled:cursor-not-allowed">
        <span v-if="loading">Sauvegarde...</span>
        <span v-else>Enregistrer</span>
      </button>
    </div>

    <!-- Messages d'erreur et de succès -->
    <div v-if="error" class="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
      {{ error }}
    </div>
    <div v-if="success" class="p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
      {{ success }}
    </div>

    <!-- Formulaire -->
    <form class="flex flex-col gap-4 mb-6 text-[#4B5563]" @submit.prevent="saveProfile">
      <label class="flex flex-col gap-1 font-medium">
        Nom
        <input type="text" v-model="form.name"
          class="px-2 py-2 border border-neutral-200 rounded text-[14px] text-neutral-700 font-bold outline-none focus:border-accent-500" />
      </label>

      <label class="flex flex-col gap-1 font-medium">
        Email
        <input type="email" v-model="form.email"
          class="px-2 py-2 border border-neutral-200 rounded text-[14px] text-neutral-700 font-bold outline-none focus:border-accent-500" />
      </label>

      <label class="flex flex-col gap-1 font-medium">
        Téléphone
        <input type="tel" v-model="form.phone"
          class="px-2 py-2 border border-neutral-200 rounded text-[14px] text-neutral-700 font-bold outline-none focus:border-accent-500" />
      </label>

      <label class="flex flex-col gap-1 font-medium">
        Adresse
        <input type="text" v-model="form.address"
          class="px-2 py-2 border border-neutral-200 rounded text-[14px] text-neutral-700 font-bold outline-none focus:border-accent-500" />
      </label>

      <label class="flex flex-col gap-1 font-medium">
        Bio / Description
        <textarea 
          v-model="form.bio"
          rows="4"
          placeholder="Parlez-nous de vous, votre expérience, vos centres d'intérêt..."
          class="px-2 py-2 border border-neutral-200 rounded text-[14px] text-neutral-700 font-bold outline-none focus:border-accent-500 resize-vertical min-h-[100px]"></textarea>
      </label>

      <label class="flex flex-col gap-1 font-medium">
        Date de naissance
        <div class="flex items-center border border-[#E5E7EB] rounded bg-white pl-3 h-[42px] focus-within:border-accent-500">
          <img :src="calendarIcon" alt="calendrier" class="w-[16px] h-[16px]" />
          <input type="date" v-model="form.birth_date"
            class="flex-1 border-none outline-none text-[14px] pl-2 text-[#374151] font-league bg-transparent h-full cursor-pointer" />
        </div>
      </label>
    </form>

    <Alert :alert-img="alertIcon" alert-description="Information confidentielle">
      <div class="flex flex-col gap-4">
        <p class="text-[#222]">
          Ces informations sont confidentielles et accessibles uniquement par vous et les spécialistes vétérinaires.
        </p>
      </div>
    </Alert>
  </div>
</template>

<script setup>
import ProfileImg from '@/assets/images/image1.svg'
import DefaultAvatar from '@/assets/images/default-avatar.svg'
import { getUserAvatar } from '@/utils/avatarUtils.js'
import editIcon from '@/assets/icons/edit.svg'
import calendarIcon from '@/assets/icons/small-calendar.svg'
import alertIcon from '@/assets/icons/alertGreen.svg'
import arrowIcon from '@/assets/icons/arrow-left.svg'
import Alert from '@/components/common/Alert.vue'

import { ref, computed, onMounted } from 'vue'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'

const emit = defineEmits(['backToList', 'profile-updated'])

// Utiliser le système d'auth ultra-simple
const auth = useSimpleAuth()

// Données utilisateur - UNE SEULE SOURCE
const userData = computed(() => {
  return auth.getCurrentUser.value
})

// Formulaire réactif
const form = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  bio: '',
  birth_date: ''
})

// États
const loading = ref(false)
const error = ref('')
const success = ref('')
const selectedFile = ref(null)

// Avatar utilisateur avec image par défaut
const userAvatar = ref(DefaultAvatar)

// Initialiser l'avatar
const initializeAvatar = () => {
  userAvatar.value = getUserAvatar(userData.value, 90)
}

// Initialiser le formulaire avec les données utilisateur
const initializeForm = () => {
  if (userData.value) {
    form.value = {
      name: userData.value.name || `${userData.value.firstName || ''} ${userData.value.lastName || ''}`.trim() || '',
      email: userData.value.email || '',
      phone: userData.value.phone || '',
      address: userData.value.address || '',
      bio: userData.value.bio || userData.value.description || '',
      birth_date: userData.value.birth_date ? formatDateForInput(userData.value.birth_date) : ''
    }
  }
  // Initialiser l'avatar aussi
  initializeAvatar()
}

// Formater la date pour l'input de type date (format YYYY-MM-DD)
const formatDateForInput = (dateString) => {
  try {
    const date = new Date(dateString)
    // Vérifier que la date est valide
    if (isNaN(date.getTime())) {
      return ''
    }
    // Retourner au format ISO (YYYY-MM-DD) requis par input type="date"
    return date.toISOString().split('T')[0]
  } catch (error) {
    console.warn('Erreur formatage date:', error)
    return ''
  }
}

// Gestion de l'upload d'avatar
const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (file) {
    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'L\'image doit faire moins de 5MB'
      return
    }
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      error.value = 'Veuillez sélectionner une image valide'
      return
    }
    
    selectedFile.value = file
    
    // Prévisualiser l'image immédiatement
    const reader = new FileReader()
    reader.onload = (e) => {
      userAvatar.value = e.target.result
    }
    reader.readAsDataURL(file)
    
    // Lancer automatiquement l'upload
    await uploadAvatar()
  }
}

// Validation du formulaire
const validateForm = () => {
  const errors = []
  
  if (!form.value.name.trim()) {
    errors.push('Le nom est requis')
  }
  
  if (!form.value.email.trim()) {
    errors.push('L\'email est requis')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.push('L\'email n\'est pas valide')
  }
  
  return errors
}

// Sauvegarder le profil
const saveProfile = async () => {
  error.value = ''
  success.value = ''
  
  // Validation
  const errors = validateForm()
  if (errors.length > 0) {
    error.value = errors.join(', ')
    return
  }
  
  loading.value = true
  
  try {
    // Appeler l'API réelle pour sauvegarder le profil
    console.log('📋 Données du formulaire avant envoi:', form.value)
    console.log('📅 Date de naissance:', form.value.birth_date)
    console.log('📝 Bio:', form.value.bio)
    
    // Importer le service utilisateur
    const { userService } = await import('@/services/users/userService.js')
    
    // Appel API réel
    const result = await userService.updateProfile(form.value)
    
    if (result.success) {
      console.log('✅ Sauvegarde API réussie:', result)
      
      // La réponse API a la structure { success, message, user }
      // Extraire les données utilisateur depuis result.data.user ou result.data
      let updatedUserData = null
      
      if (result.data && result.data.user) {
        // Si la structure est { data: { user: {...} } }
        updatedUserData = result.data.user
      } else if (result.data && result.data.success && result.data.user) {
        // Si la structure est { data: { success: true, user: {...} } }
        updatedUserData = result.data.user
      } else if (result.data) {
        // Si la structure est { data: {...} } directement
        updatedUserData = result.data
      }
      
      console.log('📊 Données utilisateur extraites:', updatedUserData)
      
      if (updatedUserData) {
        // Mettre à jour avec le système unifié
        auth.updateUserData(updatedUserData)
        console.log('✅ Données synchronisées avec le système unifié')
        
        success.value = 'Profil mis à jour avec succès'
        
        // Émettre l'événement de mise à jour
        emit('profile-updated', updatedUserData)
        
        // Retourner à la vue profil après 2 secondes
        setTimeout(() => {
          emit('backToList')
        }, 2000)
      } else {
        console.error('❌ Impossible d\'extraire les données utilisateur de la réponse')
        error.value = 'Erreur lors de la synchronisation des données'
      }
    } else {
      error.value = result.error || 'Erreur lors de la sauvegarde du profil'
    }
    
  } catch (err) {
    error.value = 'Erreur lors de la sauvegarde du profil'
    console.error('Erreur sauvegarde profil:', err)
  } finally {
    loading.value = false
  }
}

// Upload de l'avatar
const uploadAvatar = async () => {
  if (!selectedFile.value) return
  
  try {
    loading.value = true
    error.value = ''
    console.log('🚀 Upload avatar vers Cloudinary:', selectedFile.value.name)
    
    // Étape 1: Upload vers Cloudinary
    const { cloudinaryService } = await import('@/services/cloudinary/cloudinaryService.js')
    
    const cloudinaryResult = await cloudinaryService.uploadImage(selectedFile.value, {
      folder: 'animoplus/avatars',
      maxSize: 5 * 1024 * 1024, // 5MB max pour les avatars
      tags: ['avatar', 'profile'],
      publicId: `avatar_${auth.getCurrentUser.value?.id}_${Date.now()}`
    })
    
    if (!cloudinaryResult.success) {
      error.value = cloudinaryResult.error || 'Erreur lors de l\'upload vers Cloudinary'
      return
    }
    
    const avatarUrl = cloudinaryResult.data.secure_url
    console.log('✅ Avatar uploadé sur Cloudinary:', avatarUrl)
    
    // Étape 2: Sauvegarder l'URL dans la base de données
    const { userService } = await import('@/services/users/userService.js')
    
    const apiResult = await userService.updateAvatarUrl(avatarUrl)
    
    if (apiResult.success) {
      console.log('✅ Avatar sauvegardé en base:', apiResult.data)
      
      // Mettre à jour l'avatar dans l'interface
      userAvatar.value = avatarUrl
      
      // Mettre à jour les données utilisateur dans le système unifié
      if (apiResult.data && apiResult.data.user) {
        auth.updateUserData(apiResult.data.user)
      } else if (apiResult.data) {
        auth.updateUserData(apiResult.data)
      }
      
      success.value = 'Photo de profil mise à jour avec succès'
      selectedFile.value = null
      
      // Réinitialiser l'input file
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) fileInput.value = ''
      
    } else {
      error.value = apiResult.error || 'Erreur lors de la sauvegarde de l\'avatar'
    }
    
  } catch (err) {
    error.value = 'Erreur lors de la mise à jour de l\'avatar'
    console.error('❌ Erreur upload avatar:', err)
  } finally {
    loading.value = false
  }
}

// Initialisation au montage
onMounted(() => {
  initializeForm()
})

</script>

<style scoped>

.font-league {
  font-family: 'League Spartan', sans-serif;
}

.confidential-text p {
  margin-left: -40px;
}
</style>
