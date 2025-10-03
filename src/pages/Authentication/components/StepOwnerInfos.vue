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

    <!-- Acceptation des règlements -->
    <label :class="['flex items-center gap-2 text-sm', formData.termsAccepted ? 'text-gray-700' : 'text-red-600']">
      <input type="checkbox" v-model="formData.termsAccepted" required />
      <span>J'accepte les <a href="#" class="text-primary-600 underline">règlements et conditions d'utilisation</a> *</span>
    </label>

    <!-- Message d'aide si formulaire invalide -->
    <div v-if="!isFormValid && !isLoading" class="text-red-600 text-sm bg-red-50 p-3 rounded">
      ⚠️ Veuillez remplir tous les champs obligatoires et accepter les règlements
    </div>

    <button class="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-500 disabled:opacity-50"
      @click="handleNext" :disabled="!isFormValid || isLoading || isRedirecting">
      {{ 
        isLoading ? 'Inscription en cours...' : 
        isRedirecting ? 'Redirection...' :
        (isProfessional ? 'Continuer vers les infos professionnelles' : 'Finaliser l\'inscription') 
      }}
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
const isRedirecting = ref(false)

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
    // Préparer les données selon l'API (champs requis seulement)
    const registrationData = {
      name: props.formData.name,
      email: props.formData.email,
      password: props.formData.password,
      password_confirmation: props.formData.password_confirmation,
      user_type: 'client',
      phone: props.formData.phone
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
      showToast('Inscription réussie ! Redirection en cours...', 'success')
      
      console.log('🔄 Redirection vers verify-email avec email:', props.formData.email)
      
      // Attendre un peu pour que l'utilisateur voie le toast
      setTimeout(async () => {
        isRedirecting.value = true
        
        // Rediriger vers la page de vérification d'email
        await router.push({
          name: 'verify-email',
          query: { email: props.formData.email }
        })
        
        console.log('✅ Redirection effectuée')
        isRedirecting.value = false
      }, 1500) // 1.5 secondes de délai
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
