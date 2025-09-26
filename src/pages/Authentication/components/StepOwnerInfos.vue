<template>
  <div class="flex flex-col gap-4">
    <!-- Switch Client/Professionnel -->
    <div class="bg-gray-50 p-4 rounded-lg">
      <p class="text-sm font-medium text-gray-700 mb-3">Type de compte :</p>
      <div class="flex items-center justify-center gap-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            :value="false" 
            :checked="!isProfessional"
            @change="$emit('setUserType', false)"
            class="w-4 h-4 text-primary-600" 
          />
          <span class="font-medium">👤 Client</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            :value="true" 
            :checked="isProfessional"
            @change="$emit('setUserType', true)"
            class="w-4 h-4 text-primary-600" 
          />
          <span class="font-medium">🩺 Professionnel</span>
        </label>
      </div>
    </div>
    
    <!-- Champs requis par l'API -->
    <input v-model="formData.name" placeholder="Nom complet *" 
           :class="['w-full h-12 px-4 border rounded', formData.name ? 'border-gray-300' : 'border-red-300']" required />
    <input v-model="formData.email" type="email" placeholder="Email *" 
           :class="['w-full h-12 px-4 border rounded', formData.email ? 'border-gray-300' : 'border-red-300']" required />
    <input v-model="formData.phone" type="tel" placeholder="Téléphone *" 
           :class="['w-full h-12 px-4 border rounded', formData.phone ? 'border-gray-300' : 'border-red-300']" required />
    <input v-model="formData.password" type="password" placeholder="Mot de passe *" 
           :class="['w-full h-12 px-4 border rounded', formData.password ? 'border-gray-300' : 'border-red-300']" required />
    <input v-model="formData.password_confirmation" type="password" placeholder="Confirmer le mot de passe *" 
           :class="['w-full h-12 px-4 border rounded', formData.password_confirmation && formData.password === formData.password_confirmation ? 'border-gray-300' : 'border-red-300']" required />

    <!-- Champs optionnels -->
    <div class="border-t pt-4 mt-2">
      <p class="text-sm text-gray-600 mb-3">Informations optionnelles :</p>
      
      <div class="flex items-center gap-4 mb-3">
        <span class="text-sm font-medium">Sexe :</span>
        <label class="flex items-center gap-1">
          <input type="radio" value="M" v-model="formData.gender" /> Masculin
        </label>
        <label class="flex items-center gap-1">
          <input type="radio" value="F" v-model="formData.gender" /> Féminin
        </label>
      </div>

      <input type="date" v-model="formData.birthdate" placeholder="Date de naissance" class="w-full h-12 px-4 border border-gray-300 rounded" />
    </div>


    <!-- CGU -->
    <label :class="['flex items-center gap-2 text-sm', formData.termsAccepted ? 'text-gray-700' : 'text-red-600']">
      <input type="checkbox" v-model="formData.termsAccepted" required />
      J'accepte les CGU *
    </label>

    <!-- Message d'aide si formulaire invalide -->
    <div v-if="!isFormValid && !isLoading" class="text-red-600 text-sm bg-red-50 p-3 rounded">
      ⚠️ Veuillez remplir tous les champs obligatoires et accepter les CGU
    </div>

    <button class="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-500 disabled:opacity-50"
      @click="handleNext" :disabled="!isFormValid || isLoading">
      {{ isLoading ? 'Inscription en cours...' : (isProfessional ? 'Continuer vers les infos professionnelles' : 'Finaliser l\'inscription') }}
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast.js'
import { authService } from '@/services/auth/authService.js'

const props = defineProps({
  formData: Object,
  isProfessional: Boolean
})

const emit = defineEmits(['next', 'setUserType'])

const router = useRouter()
const { showToast } = useToast()
const isLoading = ref(false)

// Validation du formulaire
const isFormValid = computed(() => {
  const validation = {
    name: !!props.formData.name,
    email: !!props.formData.email,
    phone: !!props.formData.phone,
    password: !!props.formData.password,
    password_confirmation: !!props.formData.password_confirmation,
    passwordsMatch: props.formData.password === props.formData.password_confirmation,
    termsAccepted: !!props.formData.termsAccepted
  }
  
  const isValid = validation.name && 
                  validation.email && 
                  validation.phone && 
                  validation.password && 
                  validation.password_confirmation && 
                  validation.passwordsMatch &&
                  validation.termsAccepted
  
  // Debug: Log de validation
  console.log('🔍 Validation formulaire:', {
    ...validation,
    isValid,
    formData: {
      name: props.formData.name?.substring(0, 10) + '...',
      email: props.formData.email?.substring(0, 10) + '...',
      phone: props.formData.phone?.substring(0, 5) + '...',
      hasPassword: !!props.formData.password,
      hasPasswordConfirm: !!props.formData.password_confirmation,
      termsAccepted: props.formData.termsAccepted
    }
  })
  
  return isValid
})


async function handleNext() {
  if (!isFormValid.value) return
  
  // Définir le type d'utilisateur selon la sélection
  props.formData.user_type = props.isProfessional ? 'veterinarian' : 'client'
  
  // Si c'est un professionnel, aller à l'étape suivante
  if (props.isProfessional) {
    emit('next')
    return
  }
  
  // Si c'est un client, procéder directement à l'inscription
  await handleClientRegistration()
}

async function handleClientRegistration() {
  isLoading.value = true
  
  try {
    // Préparer les données selon l'API
    const registrationData = {
      name: props.formData.name,
      email: props.formData.email,
      password: props.formData.password,
      password_confirmation: props.formData.password_confirmation,
      user_type: 'client',
      phone: props.formData.phone
    }

    // Ajouter les champs optionnels s'ils sont remplis
    if (props.formData.gender) {
      registrationData.gender = props.formData.gender
    }
    
    if (props.formData.birthdate) {
      registrationData.birthdate = props.formData.birthdate
    }
    
    console.log('📝 Inscription client - Payload envoyé:', registrationData)
    console.log('📋 Champs requis vérifiés:', {
      name: !!registrationData.name,
      email: !!registrationData.email,
      password: !!registrationData.password,
      password_confirmation: !!registrationData.password_confirmation,
      user_type: registrationData.user_type,
      phone: !!registrationData.phone
    })
    
    // Appeler l'API d'inscription via le service
    const result = await authService.register(registrationData)
    
    if (result.success) {
      console.log('✅ Inscription réussie:', result.data)
      showToast('Inscription réussie ! Vérifiez votre email pour activer votre compte.', 'success')
      
      // Rediriger vers la page de vérification d'email
      router.push({
        name: 'verify-email',
        query: { email: props.formData.email }
      })
    } else {
      console.error('❌ Erreur inscription:', result.error)
      showToast(result.error || 'Erreur lors de l\'inscription', 'error')
    }
  } catch (error) {
    console.error('❌ Erreur réseau:', error)
    showToast('Erreur de connexion. Veuillez réessayer.', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
