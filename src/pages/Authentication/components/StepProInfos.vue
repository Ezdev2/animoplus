<template>
  <div class="flex flex-col gap-4">
    <input v-model="formData.firstname" placeholder="Prénom" class="w-full h-12 px-4 border border-gray-300 rounded" />
    <input v-model="formData.lastname" placeholder="Nom" class="w-full h-12 px-4 border border-gray-300 rounded" />
    <input v-model="formData.email" placeholder="Email" class="w-full h-12 px-4 border border-gray-300 rounded" />

    <label class="flex items-center gap-2">
      <input type="checkbox" v-model="formData.cgu" /> Accepter les CGU
    </label>
    <label class="flex items-center gap-2">
      <input type="checkbox" v-model="formData.cgv" /> Accepter les CGV
    </label>
    <label class="flex items-center gap-2">
      <input type="checkbox" v-model="formData.mentions" /> Mentions légales
    </label>
    <label class="flex items-center gap-2">
      <input type="checkbox" v-model="formData.contrat" /> Accepter les termes du contrat
    </label>
    <label class="flex items-center gap-2">
      <input type="checkbox" v-model="formData.newsletter" /> S’inscrire à la newsletter
    </label>

    <button class="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-500">Finaliser l’inscription</button>

    <div class="flex flex-wrap justify-between text-primary-600 underline text-sm">
      <a href="/#">Tarifs</a>
      <a href="/#">Sécurité</a>
      <a href="/#">Installation</a>
      <a href="/#">Service client</a>
      <a href="/#">Guide d’utilisation</a>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  formData: Object
})
</script>
