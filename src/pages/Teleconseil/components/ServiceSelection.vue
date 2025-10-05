<template>
  <div>
    <h2 class="text-xl font-semibold mb-4 text-center">POUR QUEL TYPE DE SERVICE ?</h2>
    <div class="grid gap-4">
      <div v-for="service in services" :key="service.name" 
           @click="$emit('select-service', service)"
           class="service-card cursor-pointer p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-green-500 transition-colors">
        <div class="flex items-center">
          <div class="flex-grow">
            <h3 class="font-bold">{{ service.name }}</h3>
            <p class="text-sm text-gray-600">{{ service.description }}</p>
          </div>
          <div class="w-16 h-16 ml-4 bg-gray-200 rounded-full overflow-hidden">
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const services = ref([
  { name: 'VETERINAIRE', description: 'Conseils vétérinaires généraux pour animaux de compagnie et NAC' },
  { name: 'TOILETTEUR', description: 'Astuces et conseils d\'hygiène, d\'entretien et de soins esthétiques à distance' },
  { name: 'EDUCATEUR CANIN', description: 'Accompagnement en ligne pour l\'éducation et la socialisation de votre chien' },
  { name: 'OSTEOPATHE ANIMALIER', description: 'Conseils pour améliorer la mobilité et soulager les douleurs à distance' },
  { name: 'NUTRITIONNISTE VETERINAIRE', description: 'Conseils personnalisés pour l\'alimentation et la nutrition de vos animaux' },
  { name: 'KINESIOLOGUE ANIMALIER', description: 'Accompagnement émotionnel et conseils pour réduire le stress et améliorer le bien-être' },
]);
</script>