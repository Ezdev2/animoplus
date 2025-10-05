<template>
  <div class="bg-white p-6 rounded-lg shadow-md text-center">
    <h2 class="text-xl font-semibold mb-4 text-green-700">Confirmation du rendez-vous</h2>
    <p class="text-gray-600 mb-6">Merci de confirmer votre rendez-vous avec le spécialiste de santé.<br>Votre récapitulatif sera envoyé par mail</p>
    
    <div class="details-section mb-6 p-4 border border-gray-200 rounded-lg">
      <h3 class="font-bold text-lg mb-2 text-gray-800">Détails du Rendez-vous</h3>
      <div class="grid grid-cols-2 gap-2 text-left text-sm">
        <p><span class="font-semibold">Service :</span> Première rencontre</p>
        <p><span class="font-semibold">Prix :</span> 0.00€</p>
        <p><span class="font-semibold">Date :</span> 27/09/2025</p>
        <p><span class="font-semibold">Heure :</span> 13:00 - 14:00</p>
      </div>
    </div>

    <button @click="$emit('confirm')" class="w-full btn-primary">
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