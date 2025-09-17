<template>
  <div class="w-full flex items-center justify-center my-16">
    <div class="background absolute inset-0 bg-cover bg-center bg-no-repeat z-0"></div>

    <div
      class="w-[572px] z-10 px-10 py-8 bg-white shadow-[0px_82px_40px_-14px_rgba(100,100,100,0.08)] outline outline-1 outline-neutral-200 rounded-xl flex flex-col items-center gap-8">

      <h1 class="text-primary-600 text-3xl font-bold text-center">Réinitialiser le mot de passe</h1>
      <p class="text-neutral-500 text-lg text-center">
        Entrez votre nouveau mot de passe ci-dessous
      </p>

      <div class="w-full flex flex-col gap-4">

        <!-- Nouveau mot de passe -->
        <label class="w-full flex flex-col gap-1">
          <span class="text-zinc-600 text-sm font-medium uppercase">Nouveau mot de passe</span>
          <input
            v-model="password"
            type="password"
            placeholder="********"
            class="w-full h-12 px-4 bg-white border border-neutral-200 rounded outline-none focus:ring-2 focus:ring-primary-600"
          />
        </label>

        <!-- Confirmation -->
        <label class="w-full flex flex-col gap-1">
          <span class="text-zinc-600 text-sm font-medium uppercase">Confirmer le mot de passe</span>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="********"
            class="w-full h-12 px-4 bg-white border border-neutral-200 rounded outline-none focus:ring-2 focus:ring-primary-600"
          />
        </label>

        <!-- Bouton -->
        <button
          @click="resetPassword"
          class="w-full py-3 bg-primary-600 text-white rounded-xl text-lg font-medium hover:bg-primary-500 transition"
        >
          Réinitialiser le mot de passe
        </button>
      </div>

      <p class="text-gray-600 text-lg">
        Vous souvenez de votre mot de passe ?
        <router-link to="/login" class="text-primary-600 font-semibold underline">Retour à la connexion</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const password = ref('')
const confirmPassword = ref('')

function resetPassword() {
  if (password.value !== confirmPassword.value) {
    alert("Les mots de passe ne correspondent pas.")
    return
  }

  console.log("Nouveau mot de passe :", password.value)

  // Redirection après succès
  router.push('/login')
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
