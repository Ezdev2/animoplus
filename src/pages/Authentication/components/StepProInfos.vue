<template>
  <div class="flex flex-col gap-4">
    <!-- Champs requis par l'API pour vétérinaire -->
    <input v-model="formData.name" placeholder="Nom complet (Dr. Nom) *" class="w-full h-12 px-4 border border-gray-300 rounded" required />
    <input v-model="formData.email" type="email" placeholder="Email professionnel *" class="w-full h-12 px-4 border border-gray-300 rounded" required />
    <input v-model="formData.phone" type="tel" placeholder="Téléphone *" class="w-full h-12 px-4 border border-gray-300 rounded" required />
    <input v-model="formData.password" type="password" placeholder="Mot de passe *" class="w-full h-12 px-4 border border-gray-300 rounded" required />
    <input v-model="formData.password_confirmation" type="password" placeholder="Confirmer le mot de passe *" class="w-full h-12 px-4 border border-gray-300 rounded" required />
    
    <!-- Champs spécifiques vétérinaire -->
    <input v-model="formData.license_number" placeholder="Numéro de licence vétérinaire *" class="w-full h-12 px-4 border border-gray-300 rounded" required />
    <input v-model="formData.clinic_name" placeholder="Nom de la clinique *" class="w-full h-12 px-4 border border-gray-300 rounded" required />
    <textarea v-model="formData.clinic_address" placeholder="Adresse de la clinique *" class="w-full h-20 px-4 py-2 border border-gray-300 rounded resize-none" required></textarea>

    <!-- Acceptations légales -->
    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" v-model="formData.cgu" required /> Accepter les CGU *
    </label>
    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" v-model="formData.cgv" required /> Accepter les CGV *
    </label>
    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" v-model="formData.mentions" required /> Mentions légales *
    </label>
    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" v-model="formData.contrat" required /> Accepter les termes du contrat *
    </label>
    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" v-model="formData.newsletter" /> S'inscrire à la newsletter
    </label>

    <button class="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-500 disabled:opacity-50" 
            @click="handleRegister" :disabled="!isFormValid || isLoading">
      {{ isLoading ? 'Inscription en cours...' : 'Finaliser l\'inscription' }}
    </button>

    <div class="flex flex-wrap justify-between text-primary-600 underline text-sm">
      <a href="/#">Tarifs</a>
      <a href="/#">Sécurité</a>
      <a href="/#">Installation</a>
      <a href="/#">Service client</a>
      <a href="/#">Guide d'utilisation</a>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast.js'
import { authService } from '@/services/auth/authService.js'

const props = defineProps({
  formData: Object
})

const router = useRouter()
const { showToast } = useToast()
const isLoading = ref(false)

// Validation du formulaire
const isFormValid = computed(() => {
  return props.formData.name && 
         props.formData.email && 
         props.formData.phone && 
         props.formData.password && 
         props.formData.password_confirmation && 
         props.formData.password === props.formData.password_confirmation &&
         props.formData.license_number &&
         props.formData.clinic_name &&
         props.formData.clinic_address &&
         props.formData.cgu &&
         props.formData.cgv &&
         props.formData.mentions &&
         props.formData.contrat
})

async function handleRegister() {
  if (!isFormValid.value) return
  
  isLoading.value = true
  
  try {
    // Préparer les données selon l'API
    const registrationData = {
      name: props.formData.name,
      email: props.formData.email,
      password: props.formData.password,
      password_confirmation: props.formData.password_confirmation,
      user_type: 'veterinarian',
      phone: props.formData.phone,
      license_number: props.formData.license_number,
      clinic_name: props.formData.clinic_name,
      clinic_address: props.formData.clinic_address
    }
    
    console.log('📝 Inscription vétérinaire - Payload envoyé:', registrationData)
    console.log('📋 Champs requis vérifiés:', {
      name: !!registrationData.name,
      email: !!registrationData.email,
      password: !!registrationData.password,
      password_confirmation: !!registrationData.password_confirmation,
      user_type: registrationData.user_type,
      phone: !!registrationData.phone,
      license_number: !!registrationData.license_number,
      clinic_name: !!registrationData.clinic_name,
      clinic_address: !!registrationData.clinic_address
    })
    
    // Appeler l'API d'inscription via le service
    const result = await authService.register(registrationData)
    
    if (result.success) {
      console.log('✅ Inscription réussie:', result.data)
      showToast('Inscription réussie ! Redirection en cours...', 'success')
      
      console.log('🔄 Redirection vers verify-email avec email:', props.formData.email)
      
      // Attendre un peu pour que l'utilisateur voie le toast
      setTimeout(async () => {
        // Rediriger vers la page de vérification d'email
        await router.push({
          name: 'verify-email',
          query: { email: props.formData.email }
        })
        
        console.log('✅ Redirection effectuée')
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
