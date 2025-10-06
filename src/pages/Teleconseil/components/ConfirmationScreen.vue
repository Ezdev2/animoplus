<template>
  <div class="bg-white p-6 rounded-lg shadow-md text-center">
    <h2 class="text-xl font-semibold mb-4 text-green-700">Confirmation du rendez-vous</h2>
    <!-- Texte d’introduction -->
    <div class="text-center mb-6">
      <p class="text-gray-700 font-medium">
        Merci de confirmer votre rendez-vous avec le spécialiste de santé.
      </p>
      <p class="text-gray-500 text-sm">
        Votre récapitulatif sera envoyé par mail
      </p>
    </div>

    <!-- Section principale avec les 4 rôles -->
    <div
      class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white rounded-xl shadow p-4 w-full">
      <!-- Spécialiste -->
      <div class="flex items-center gap-3 border border-green-400 rounded-full px-4 py-2">
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center bg-green-50 border border-green-400 text-green-600 font-semibold text-sm">
          Spécial
        </div>
        <div class="text-left">
          <p class="font-semibold text-gray-800 text-sm">Dominique BOST</p>
          <p class="text-xs text-gray-500">Spécialiste de santé</p>
        </div>
      </div>

      <!-- Animal -->
      <div class="flex items-center gap-3 border border-blue-400 rounded-full px-4 py-2">
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 border border-blue-400 text-blue-600 font-semibold text-sm">
          Animal
        </div>
        <div class="text-left">
          <p class="font-semibold text-gray-800 text-sm">Odessa</p>
          <p class="text-xs text-gray-500">Animal concerné</p>
        </div>
      </div>

      <!-- Utilisateur -->
      <div class="flex items-center gap-3 border border-yellow-400 rounded-full px-4 py-2">
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-50 border border-yellow-400 text-yellow-600 font-semibold text-sm">
          Utilis
        </div>
        <div class="text-left">
          <p class="font-semibold text-gray-800 text-sm">Administration Doctopet</p>
          <p class="text-xs text-gray-500">Propriétaire</p>
        </div>
      </div>
    </div>

    <!-- Détails du rendez-vous -->
    <div class="w-full bg-white mt-6 rounded-xl shadow border border-gray-200 p-6 flex flex-col gap-4">
      <div class="flex items-center gap-2 text-green-600 font-semibold text-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2l4 -4m6 2a9 9 0 11-18 0a9 9 0 0118 0z" />
        </svg>
        Détails du Rendez-vous
      </div>

      <div class="flex flex-col md:flex-row justify-between text-gray-700 text-sm">
        <div class="flex flex-col">
          <p><span class="font-semibold">Service :</span> Première rencontre</p>
          <p><span class="font-semibold">Date :</span> 27/09/2025</p>
        </div>
        <div class="flex flex-col md:text-right">
          <p><span class="font-semibold">Prix :</span> 0.00€</p>
          <p><span class="font-semibold">Heure :</span> 13:00 - 14:00</p>
        </div>
      </div>
    </div>

    <button @click="$emit('confirm')" class="mt-6 bg-green-600 hover:bg-green-700 transition text-white font-semibold py-3 px-8 rounded-lg shadow">
      PROCÉDER AU PAIEMENT
    </button>
  </div>
</template>

<script setup>
// Props for displaying appointment data
const props = defineProps({
  appointmentData: {
    type: Object,
    required: true,
  },
});
</script>