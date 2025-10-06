<template>
  <div class="flex flex-col gap-6">
    <div class="bg-white p-6 rounded-lg shadow-md text-center">
      <h3 class="text-lg font-semibold mb-2">Nouveau sur Doctolib ?</h3>
      <button @click="$emit('register')"
              class="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors">
        S'INSCRIRE
      </button>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-md text-center">
      <h3 class="text-lg font-semibold mb-2">J'ai déjà un compte Doctolib</h3>
      <button @click="$emit('login')"
              class="w-full bg-yellow-400 text-white font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors">
        SE CONNECTER
      </button>
    </div>
  </div>
</template>