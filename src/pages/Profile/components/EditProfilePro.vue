<template>
    <div class="flex flex-col gap-4 bg-white rounded-[10px] p-6 border border-neutral-200">
        <TitleDashboard title="Mon profil" :icon="editIcon" />

        <hr/>

        <!-- Messages d'état -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {{ error }}
        </div>
        <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
            {{ success }}
        </div>

        <div class="flex justify-between items-start mb-2">
            <div class="flex gap-5 items-center mt-2 mb-6">
                <img :src="userAvatar" alt="photo de profil" class="w-[90px] h-[90px] rounded-full object-cover" />

                <div>
                    <label class="border border-[#E5E7EB] rounded-[9px] px-3 py-1 flex items-center gap-2 cursor-pointer text-[#4B5563]">
                        <img :src="editIcon" alt="edit" />
                        Importer une image
                        <input type="file" accept="image/*" @change="handleFileSelect" hidden />
                    </label>
                    <p class="text-[12px] text-[#666] mt-1">L'image doit être moins de 5Mo</p>
                </div>
            </div>
            <!-- Bouton enregistrer -->
            <button 
                @click="handleSave" 
                :disabled="loading"
                class="bg-accent-500 text-white px-6 py-3 rounded-[14px] disabled:opacity-50 disabled:cursor-not-allowed">
                {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="handleSave" class="flex flex-col gap-6 mb-6 text-[#4B5563]">
            <label class="flex flex-col gap-1 font-medium">
                Nom
                <input 
                    type="text" 
                    v-model="form.name"
                    class="px-2 py-3 border border-neutral-200 rounded-md text-[14px] text-[#4B5563] font-bold outline-none w-[85%] focus:border-accent-500" />
            </label>

            <label class="flex flex-col gap-1 font-medium">
                Email
                <input 
                    type="email" 
                    v-model="form.email"
                    class="px-2 py-3 border border-neutral-200 rounded-md text-[14px] text-[#4B5563] font-bold outline-none w-[85%] focus:border-accent-500" />
            </label>

            <label class="flex flex-col gap-1 font-medium">
                Téléphone
                <input 
                    type="tel" 
                    v-model="form.phone"
                    class="px-2 py-3 border border-neutral-200 rounded-md text-[14px] text-[#4B5563] font-bold outline-none w-[85%] focus:border-accent-500" />
            </label>

            <label class="flex flex-col gap-1 font-medium">
                Adresse
                <input 
                    type="text" 
                    v-model="form.address"
                    class="px-2 py-3 border border-neutral-200 rounded-md text-[14px] text-[#4B5563] font-bold outline-none w-[85%] focus:border-accent-500" />
            </label>

            <label class="flex flex-col gap-1 font-medium">
                Nom de la clinique
                <input 
                    type="text" 
                    v-model="form.clinic_name"
                    class="px-2 py-3 border border-neutral-200 rounded-md text-[14px] text-[#4B5563] font-bold outline-none w-[85%] focus:border-accent-500" />
            </label>

            <label class="flex flex-col gap-1 font-medium">
                Adresse de la clinique
                <input 
                    type="text" 
                    v-model="form.clinic_address"
                    class="px-2 py-3 border border-neutral-200 rounded-md text-[14px] text-[#4B5563] font-bold outline-none w-[85%] focus:border-accent-500" />
            </label>

            <label class="flex flex-col gap-1 font-medium">
                Bio / Description
                <textarea 
                    v-model="form.bio"
                    rows="4"
                    placeholder="Parlez-nous de vous, votre expérience, vos spécialités..."
                    class="px-2 py-3 border border-neutral-200 rounded-md text-[14px] text-[#4B5563] font-bold outline-none w-[85%] focus:border-accent-500 resize-vertical min-h-[100px]"></textarea>
            </label>

            <label class="flex flex-col gap-1 font-medium">
                Horaires d'ouverture
                <div class="flex items-center gap-2 px-2 py-3 border border-neutral-200 rounded-md w-[85%] focus-within:border-accent-500">
                    <img :src="clockIcon" alt="clock" class="w-4 h-4" />
                    <input 
                        type="text" 
                        v-model="form.opening_hours"
                        placeholder="Ex: 8h00 - 18h00"
                        class="flex-1 border-none outline-none text-[14px] text-[#4B5563] font-bold bg-transparent" />
                </div>
            </label>
        </form>

        <Alert :alert-img="alertIcon" alert-description="Information confidentielle">
            <div class="flex flex-col gap-4 ">
                <p class="text-[#222]">
                Ces informations sont confidentielles et accessibles uniquement par vous et les spécialistes vétérinaires.
                </p>
            </div>
        </Alert>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'
import { getUserAvatar } from '@/utils/avatarUtils.js'
import { userService } from '@/services/users/userService.js'

import ProfileImg from '@/assets/images/image1.svg'
import editIcon from '@/assets/icons/edit.svg'
import clockIcon from '@/assets/icons/clock-black.svg'
import alertIcon from '@/assets/icons/alertGreen.svg'

import TitleDashboard from '@/components/common/TitleDashboard.vue'
import Alert from '@/components/common/Alert.vue'

const emit = defineEmits(['profile-updated'])

const auth = useSimpleAuth()

// Données utilisateur
const userData = computed(() => auth.getCurrentUser.value)

// Formulaire réactif
const form = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  clinic_name: '',
  clinic_address: '',
  bio: '',
  opening_hours: ''
})

// États
const loading = ref(false)
const error = ref('')
const success = ref('')
const selectedFile = ref(null)

// Avatar utilisateur
const userAvatar = ref(ProfileImg)

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
      clinic_name: userData.value.clinic_name || '',
      clinic_address: userData.value.clinic_address || '',
      bio: userData.value.bio || userData.value.description || '',
      opening_hours: userData.value.opening_hours || ''
    }
  }
  initializeAvatar()
}

// Gestion de la sélection de fichier
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Vérifier la taille (5Mo max)
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'L\'image doit faire moins de 5Mo'
      return
    }
    
    selectedFile.value = file
    
    // Preview de l'image
    const reader = new FileReader()
    reader.onload = (e) => {
      userAvatar.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Sauvegarder le profil
const handleSave = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    // 1. Mettre à jour le profil
    const profileResult = await userService.updateProfile(form.value)
    
    if (!profileResult.success) {
      throw new Error(profileResult.error)
    }
    
    // 2. Upload de l'avatar si sélectionné
    if (selectedFile.value) {
      const avatarResult = await userService.uploadAvatar(selectedFile.value)
      
      if (!avatarResult.success) {
        console.warn('Erreur upload avatar:', avatarResult.error)
        // Ne pas bloquer si seul l'avatar échoue
      }
    }
    
    // 3. Recharger les données utilisateur
    await auth.refreshUserData()
    
    success.value = 'Profil mis à jour avec succès !'
    emit('profile-updated')
    
    // Effacer le message de succès après 3 secondes
    setTimeout(() => {
      success.value = ''
    }, 3000)
    
  } catch (err) {
    console.error('Erreur lors de la sauvegarde:', err)
    error.value = err.message || 'Erreur lors de la mise à jour du profil'
  } finally {
    loading.value = false
  }
}

// Initialiser au montage
onMounted(() => {
  initializeForm()
})
</script>