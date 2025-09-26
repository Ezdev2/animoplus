<template>
  <div class="flex flex-col gap-4">
    <label value="">Choisir un type d'animal (optionnel)</label>
    <select v-model="formData.species" class="w-full h-12 px-4 border border-gray-300 rounded">
      <option value="">-- Sélectionner --</option>
      <option v-for="s in speciesData" :key="s.id" :value="s.id">{{ s.name }}</option>
    </select>

    <label value="">Choisir une race (optionnel)</label>
    <select v-model="formData.race" class="w-full h-12 px-4 border border-gray-300 rounded" v-if="formData.species">
      <option value="">-- Sélectionner --</option>
      <option v-for="r in getRacesBySpeciesId(formData.species)" :key="r.id" :value="r.id">{{ r.name }}</option>
    </select>

    <input v-model="formData.weight" placeholder="Poids en kg (optionnel)" class="w-full h-12 px-4 border border-gray-300 rounded" />

    <div class="flex gap-6 justify-between">
      <button class="w-[fit-content] py-3 px-4 bg-neutral-300 text-white rounded-lg font-medium hover:bg-primary-500" @click="$emit('prev')">Retour</button>
      <button class="w-[fit-content] py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-500 disabled:opacity-50" 
              @click="handleRegister" :disabled="isLoading">
        {{ isLoading ? 'Inscription en cours...' : 'Terminer l\'inscription' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast.js'
import { authService } from '@/services/auth/authService.js'
import { speciesData, getRacesBySpeciesId } from '@/pages/Animals/data/data'

const props = defineProps({
  formData: Object
})

const router = useRouter()
const { showToast } = useToast()
const isLoading = ref(false)

async function handleRegister() {
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
