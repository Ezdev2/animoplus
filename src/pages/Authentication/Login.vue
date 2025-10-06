<template>
  <div class="w-full flex items-center justify-center my-16">
    <div class="background absolute inset-0 bg-cover bg-center bg-no-repeat z-0"></div>

    <div
      class="w-[572px] z-10 px-10 py-8 bg-white shadow-[0px_82px_40px_-14px_rgba(100,100,100,0.08)] outline outline-1 outline-neutral-200 rounded-xl flex flex-col items-center gap-8">

      <h1 class="text-primary-600 text-3xl font-bold text-center">Connexion</h1>
      <p class="text-neutral-500 text-lg text-center">Prenez soin de votre compagnon en 1 clic</p>

      <div class="w-full flex flex-col gap-4">

        <label class="w-full flex flex-col gap-1">
          <span class="text-zinc-600 text-sm font-medium uppercase">Adresse email</span>
          <input v-model="email" type="email" placeholder="johndoe@example.com"
            class="w-full h-12 px-4 bg-white border border-neutral-200 rounded outline-none focus:ring-2 focus:ring-primary-600" />
        </label>

        <label class="w-full flex flex-col gap-1">
          <span class="text-zinc-600 text-sm font-medium uppercase">Mot de passe</span>
          <input v-model="password" type="password" placeholder="********"
            class="w-full h-12 px-4 bg-white border border-neutral-200 rounded outline-none focus:ring-2 focus:ring-primary-600" />
        </label>

        <div class="flex w-full justify-between">
          <div class="flex items-center gap-2 text-sm text-zinc-600">
            <input type="checkbox" id="remember" class="w-4 h-4 border border-gray-400" />
            <label for="remember">Se souvenir de moi</label>
          </div>
          <router-link to="/reset-password" class="text-primary-600 font-semibold underline">Mot de passe oublié</router-link>
        </div>

        <button @click="handleLogin" :disabled="loading"
          class="w-full py-3 bg-primary-600 text-white rounded-xl text-lg font-medium hover:bg-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <!-- Spinner de chargement -->
          <svg v-if="loading" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
        </button>

        <!-- Affichage des erreurs -->
        <div v-if="error" class="w-full p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
          {{ error }}
        </div>
      </div>

      <p class="text-gray-600 text-lg">
        Pas encore de compte ?
        <router-link to="/register" class="text-primary-600 font-semibold underline">Inscrivez-vous</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'
import { useRouter } from 'vue-router'

const auth = useSimpleAuth()
const router = useRouter()

// Données du formulaire
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// Redirection automatique si déjà connecté
onMounted(() => {
  if (auth.isAuthenticated.value) {
    console.log('🔄 Déjà connecté, redirection vers dashboard')
    router.push('/dashboard')
  }
})

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Veuillez remplir tous les champs'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    console.log('🔐 Tentative de connexion:', email.value)
    
    // Appel API direct sans authService pour éviter la duplication
    const { apiClient } = await import('@/services/api/config.js')
    const { API_ENDPOINTS } = await import('@/services/api/endpoints.js')
    
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email: email.value,
      password: password.value
    })
    
    const { access_token, refresh_token, user } = response.data
    console.log('✅ Connexion réussie:', { user: user.name, role: user.user_type })
    
    // Sauvegarder UNIQUEMENT avec useSimpleAuth (évite la duplication)
    auth.login(access_token, refresh_token, user)
    
    // Redirection forcée
    console.log('🔄 Redirection vers dashboard...')
    window.location.href = '/dashboard'
    
  } catch (err) {
    console.error('❌ Erreur login:', err)
    const errorMessage = err.response?.data?.message || 'Erreur de connexion'
    error.value = errorMessage
  } finally {
    loading.value = false
  }
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