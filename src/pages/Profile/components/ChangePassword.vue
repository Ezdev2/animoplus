<template>
  <div class="flex flex-col gap-4 bg-white rounded-[10px] p-6 border border-neutral-200">
    <div class="flex items-center gap-2">
      <span class="cursor-pointer" @click="$emit('back')">Mon profil</span>
      <img :src="arrowIcon" alt="retour" class="w-[14px] cursor-pointer" />
      <strong class="text-black font-bold">Changer le mot de passe</strong>
    </div>

    <hr />

    <!-- Messages d'erreur et de succès -->
    <div v-if="error" class="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
      {{ error }}
    </div>
    <div v-if="success" class="p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
      {{ success }}
    </div>

    <!-- Formulaire changement mot de passe -->
    <form @submit.prevent="changePassword" class="flex flex-col gap-4 mb-6 text-[#4B5563]">
      <label class="flex flex-col gap-1 font-medium">
        Mot de passe actuel
        <input 
          type="password" 
          v-model="passwordForm.currentPassword"
          class="px-2 py-2 border border-neutral-200 rounded text-[14px] text-neutral-700 font-bold outline-none focus:border-accent-500"
          required 
        />
      </label>

      <label class="flex flex-col gap-1 font-medium">
        Nouveau mot de passe
        <input 
          type="password" 
          v-model="passwordForm.newPassword"
          class="px-2 py-2 border border-neutral-200 rounded text-[14px] text-neutral-700 font-bold outline-none focus:border-accent-500"
          required 
        />
      </label>

      <label class="flex flex-col gap-1 font-medium">
        Confirmer le nouveau mot de passe
        <input 
          type="password" 
          v-model="passwordForm.confirmPassword"
          class="px-2 py-2 border border-neutral-200 rounded text-[14px] text-neutral-700 font-bold outline-none focus:border-accent-500"
          required 
        />
      </label>

      <div class="flex gap-4 mt-4">
        <button 
          type="button" 
          @click="$emit('back')"
          class="px-6 py-3 border border-neutral-300 rounded-[14px] text-neutral-700 hover:bg-neutral-50"
        >
          Annuler
        </button>
        
        <button 
          type="submit" 
          :disabled="loading"
          class="bg-accent-500 text-white px-6 py-3 rounded-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Changement...</span>
          <span v-else>Changer le mot de passe</span>
        </button>
      </div>
    </form>

    <Alert :alert-img="alertIcon" alert-description="Sécurité">
      <div class="flex flex-col gap-4">
        <p class="text-[#222]">
          Assurez-vous que votre nouveau mot de passe contient au moins 8 caractères avec des lettres, chiffres et symboles.
        </p>
      </div>
    </Alert>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import arrowIcon from '@/assets/icons/arrow-left.svg'
import alertIcon from '@/assets/icons/alertGreen.svg'
import Alert from '@/components/common/Alert.vue'

const emit = defineEmits(['back', 'password-changed'])

// Formulaire mot de passe
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// États
const loading = ref(false)
const error = ref('')
const success = ref('')

// Validation du formulaire
const validatePasswordForm = () => {
  const errors = []
  
  if (!passwordForm.value.currentPassword) {
    errors.push('Le mot de passe actuel est requis')
  }
  
  if (!passwordForm.value.newPassword) {
    errors.push('Le nouveau mot de passe est requis')
  } else if (passwordForm.value.newPassword.length < 8) {
    errors.push('Le nouveau mot de passe doit contenir au moins 8 caractères')
  }
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errors.push('Les mots de passe ne correspondent pas')
  }
  
  return errors
}

// Changer le mot de passe
const changePassword = async () => {
  error.value = ''
  success.value = ''
  
  // Validation
  const errors = validatePasswordForm()
  if (errors.length > 0) {
    error.value = errors.join(', ')
    return
  }
  
  loading.value = true
  
  try {
    // Appeler l'API réelle pour changer le mot de passe
    console.log('Changement de mot de passe via API')
    
    // Importer le service utilisateur
    const { userService } = await import('@/services/users/userService.js')
    
    // Appel API réel
    const result = await userService.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
      confirmPassword: passwordForm.value.confirmPassword
    })
    
    if (result.success) {
      success.value = 'Mot de passe changé avec succès'
      
      // Réinitialiser le formulaire
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      
      // Émettre l'événement
      emit('password-changed')
      
      // Retourner au profil après 2 secondes
      setTimeout(() => {
        emit('back')
      }, 2000)
    } else {
      error.value = result.error || 'Erreur lors du changement de mot de passe'
    }
    
  } catch (err) {
    error.value = 'Erreur lors du changement de mot de passe'
    console.error('Erreur changement mot de passe:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.font-league {
  font-family: 'League Spartan', sans-serif;
}
</style>
