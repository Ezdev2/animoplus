<template>
  <div class="w-full flex items-center justify-center my-16">
    <div class="background absolute inset-0 bg-cover bg-center bg-no-repeat z-0"></div>

    <div class="w-[620px] z-10 px-10 py-8 bg-white shadow-lg rounded-xl flex flex-col gap-6 text-center">
      <!-- État initial : Vérification en attente -->
      <div v-if="!isVerifying && !isVerified && !hasError">
        <div class="text-6xl mb-4">📧</div>
        <h1 class="text-primary-600 text-3xl font-bold mb-4">
          Vérifiez votre email
        </h1>
        <p class="text-gray-600 mb-6">
          Nous avons envoyé un email de vérification à <strong>{{ email }}</strong>
        </p>
        <p class="text-gray-500 text-sm mb-6">
          Cliquez sur le lien dans l'email pour activer votre compte.
          Si vous ne voyez pas l'email, vérifiez votre dossier spam.
        </p>
        
        <div class="flex flex-col gap-4">
          <button 
            @click="handleResendVerification" 
            :disabled="isResending"
            class="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-500 disabled:opacity-50">
            {{ isResending ? 'Envoi en cours...' : 'Renvoyer l\'email' }}
          </button>
          
          <router-link 
            to="/login" 
            class="text-primary-600 hover:underline">
            Retour à la connexion
          </router-link>
        </div>
      </div>

      <!-- État : Vérification en cours -->
      <div v-if="isVerifying">
        <div class="text-6xl mb-4">⏳</div>
        <h1 class="text-primary-600 text-3xl font-bold mb-4">
          Vérification en cours...
        </h1>
        <p class="text-gray-600">
          Nous vérifions votre email, veuillez patienter.
        </p>
      </div>

      <!-- État : Vérification réussie -->
      <div v-if="isVerified">
        <div class="text-6xl mb-4">✅</div>
        <h1 class="text-green-600 text-3xl font-bold mb-4">
          Email vérifié !
        </h1>
        <p class="text-gray-600 mb-6">
          Votre compte a été activé avec succès.
        </p>
        
        <div class="flex flex-col gap-4">
          <router-link 
            to="/login" 
            class="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-500 text-center">
            Se connecter
          </router-link>
        </div>
      </div>

      <!-- État : Erreur -->
      <div v-if="hasError">
        <div class="text-6xl mb-4">❌</div>
        <h1 class="text-red-600 text-3xl font-bold mb-4">
          Erreur de vérification
        </h1>
        <p class="text-gray-600 mb-6">
          {{ errorMessage }}
        </p>
        
        <div class="flex flex-col gap-4">
          <button 
            @click="handleResendVerification" 
            :disabled="isResending"
            class="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-500 disabled:opacity-50">
            {{ isResending ? 'Envoi en cours...' : 'Renvoyer l\'email' }}
          </button>
          
          <router-link 
            to="/register" 
            class="text-primary-600 hover:underline">
            Retour à l'inscription
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEmailVerification } from '@/composables/useEmailVerification.js'

const route = useRoute()

// Utiliser le composable de vérification d'email
const {
  isVerifying,
  isResending,
  isVerified,
  hasError,
  errorMessage,
  verifyEmail,
  resendVerification
} = useEmailVerification()

// Email et token depuis les paramètres de requête
const email = ref(route.query.email || '')
const token = ref(route.query.token || '')

onMounted(async () => {
  console.log('📧 VerifyEmail - Page montée:', {
    email: email.value,
    token: token.value ? token.value.substring(0, 10) + '...' : 'Aucun token',
    query: route.query
  })
  
  // Si on a un token dans l'URL, vérifier automatiquement
  if (token.value && email.value) {
    console.log('🔍 Vérification automatique avec token')
    await verifyEmail(email.value, token.value)
  } else {
    console.log('📧 Affichage page d\'attente - pas de token')
  }
})

// Fonction wrapper pour le renvoi
const handleResendVerification = () => {
  resendVerification(email.value)
}
</script>

<style scoped>
.background {
    background-image: url("../../assets/images/bg-login.svg");
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 55vh;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    z-index: -1;
}
</style>
