<template>
  <div class="w-full flex items-center justify-center my-16 relative">
    <div class="background absolute inset-0 bg-cover bg-center bg-no-repeat"></div>

    <div
      class="w-[572px] relative z-10 px-10 py-8 bg-white shadow-[0px_82px_40px_-14px_rgba(100,100,100,0.08)] outline outline-1 outline-neutral-200 rounded-xl flex flex-col items-center gap-8">

      <h1 class="text-primary-600 text-3xl font-bold text-center">Connexion</h1>
      <p class="text-neutral-500 text-lg text-center">Prenez soin de votre compagnon en 1 clic</p>

      <form @submit.prevent="handleLogin" class="w-full flex flex-col gap-4">

        <label class="w-full flex flex-col gap-1">
          <span class="text-zinc-600 text-sm font-medium uppercase">Adresse email</span>
          <input 
            v-model="credentials.email"
            type="email" 
            placeholder="johndoe@example.com"
            required
            :disabled="isLoading"
            class="w-full h-12 px-4 bg-white border border-neutral-200 rounded outline-none focus:ring-2 focus:ring-primary-600 disabled:opacity-50" />
        </label>

        <label class="w-full flex flex-col gap-1">
          <span class="text-zinc-600 text-sm font-medium uppercase">Mot de passe</span>
          <input 
            v-model="credentials.password"
            type="password" 
            placeholder="********"
            required
            :disabled="isLoading"
            class="w-full h-12 px-4 bg-white border border-neutral-200 rounded outline-none focus:ring-2 focus:ring-primary-600 disabled:opacity-50" />
        </label>

        <div class="flex items-center gap-2 text-sm text-zinc-600">
          <input 
            v-model="rememberMe"
            type="checkbox" 
            id="remember" 
            class="w-4 h-4 border border-gray-400" />
          <label for="remember">Se souvenir de moi</label>
        </div>

        <!-- Error message -->
        <div v-if="loginError" class="text-red-600 text-sm text-center bg-red-50 p-3 rounded">
          {{ loginError }}
        </div>

        <button 
          type="submit"
          :disabled="isLoading || !credentials.email || !credentials.password"
          class="w-full py-3 bg-primary-600 text-white rounded-xl text-lg font-medium hover:bg-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="isLoading">Connexion en cours...</span>
          <span v-else>Se connecter</span>
        </button>
      </form>

      <p class="text-gray-600 text-lg">
        Pas encore de compte ?
        <router-link to="/login" class="text-primary-600 font-semibold underline">Inscrivez-vous</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/services'

const router = useRouter()
const { login, isAuthenticated, isLoading } = useAuth()

// Form data
const credentials = ref({
  email: '',
  password: ''
})
const rememberMe = ref(false)
const loginError = ref('')

// Redirection automatique si déjà connecté
onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/dashboard')
  }
})

async function handleLogin() {
  try {
    loginError.value = ''
    
    // Call the login service
    const response = await login(credentials.value)
    
    // Login successful - hard redirect to dashboard with page reload
    window.location.href = '/dashboard'
    
  } catch (error) {
    // Handle login errors
    if (error.response?.data?.message) {
      loginError.value = error.response.data.message
    } else if (error.response?.status === 401) {
      loginError.value = 'Email ou mot de passe incorrect'
    } else if (error.response?.status === 422) {
      loginError.value = 'Veuillez vérifier vos informations'
    } else {
      loginError.value = 'Une erreur est survenue. Veuillez réessayer.'
    }
    console.error('Login error:', error)
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
  z-index: 1;
  pointer-events: none;
}
</style>