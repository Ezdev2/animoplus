<template>
  <div class="max-w-6xl mx-auto my-8 bg-white rounded-xl shadow-xl overflow-hidden">
    <div class="relative h-64 bg-gray-300">
      <img src="https://picsum.photos/1200/400?random=1" alt="Bannière" class="w-full h-full object-cover" />
      
      <div class="absolute inset-0 bg-black bg-opacity-30 flex items-end p-8">
        <div class="flex items-end w-full">
          <div class="w-32 h-32 rounded-full border-4 border-white shadow-lg -mb-16 bg-gray-100 flex-shrink-0">
            <img :src="professional.avatar" :alt="professional.name" class="w-full h-full object-cover rounded-full" />
          </div>
          
          <!-- <div class="ml-4 -mb-12 flex space-x-2">
            <div class="w-16 h-16 relative">
              <img src="https://via.placeholder.com/64x64.png?text=B1" alt="Badge 1" class="w-full h-full object-cover" />
              <span class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold" style="text-shadow: 0 0 3px #000;">PRO</span>
            </div>
            <div class="w-16 h-16 relative">
              <img src="https://via.placeholder.com/64x64.png?text=B2" alt="Badge 2" class="w-full h-full object-cover" />
              <span class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold" style="text-shadow: 0 0 3px #000;">BIEN</span>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <div class="p-8 pt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="md:col-span-2 space-y-8">
        <div>
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-800">{{ professional.name }} • Ostéopathie Animale Lyon</h1>
              <p class="text-green-600 text-lg">Ostéopathe animalier</p>
              <div class="flex items-center text-gray-500 text-sm mt-1">
                <span class="mr-1">📍</span>
                <span>Lyon</span>
              </div>
            </div>
            <button class="flex items-center text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
              <span class="mr-1">💬</span> Contacter
            </button>
          </div>
        </div>
        
        <div class="border-b border-gray-200 pb-4">
          <h3 class="text-xl font-semibold mb-3 text-pink-600">Agathe en quelques mots</h3>
          <p class="text-gray-700 leading-relaxed">
            Ostéopathe animalier biomécaniciste depuis 2022, je réalise des consultations canines, félines et Nacs au cabinet. Je me déplace également à domicile pour les animaux stressés ou les personnes ayant des difficultés de transport.<br>
            Il me tient à cœur de me former régulièrement, tant sur l'ostéopathie, la santé animale ou que sur le comportement, pour m'adapter au mieux à vos poils ! 😻
          </p>
        </div>

        <div class="space-y-4">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Prestations disponibles</h2>
          
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <h3 class="text-lg font-bold text-green-700 mb-2">Première rencontre</h3>
            <p class="text-gray-700 mb-4">
              Je vous propose un premier échange entre nous, pour établir une relation de confiance. Ce rendez-vous nous permettra de discuter des besoins spécifiques de votre animal, des attentes de chacun et d'assurer une prise en charge adaptée et sécurisée.
            </p>
            <div class="flex justify-between items-center text-gray-600 mb-4">
              <span class="font-semibold">Prix : <span class="text-gray-900 font-bold">0.00 €</span></span>
              <span class="font-semibold">Durée : <span class="text-gray-900 font-bold">60 minutes</span></span>
            </div>
            <button class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition w-full md:w-auto">
              Prendre rendez-vous
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-8">
        <div class="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 class="text-xl font-bold text-blue-800 mb-4">En résumé</h3>
          <ul class="space-y-3 text-gray-700">
            <li class="flex items-center">
              <span class="mr-3 text-blue-600">👤</span>
              Accepte les nouveaux patients sur Doctolib
            </li>
            <li class="flex items-center">
              <span class="mr-3 text-blue-600">🏥</span>
              Centre dentaire Saint-Ouen Dentelia
            </li>
            <li class="ml-6 text-sm">132 Avenue Gabriel Péri, 93400 Saint-Ouen</li>
          </ul>
          <button class="mt-4 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center w-full hover:bg-blue-700 transition">
            <span class="mr-2">📅</span> PRENDRE RENDEZ-VOUS
          </button>
        </div>

        <div class="p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Contact</h3>
          
          <div class="mb-4">
            <h4 class="font-semibold text-gray-700">Adresse</h4>
            <p class="text-gray-600">87 Rue Masséna, 69006 Lyon</p>
            <a href="#" class="text-pink-600 text-sm hover:underline">Voir sur la carte</a>
          </div>

          <div class="mb-4">
            <h4 class="font-semibold text-gray-700">Téléphone & Email</h4>
            <button class="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-orange-600 transition">
              Révéler les coordonnées
            </button>
          </div>

          <div class="mb-4">
            <h4 class="font-semibold text-gray-700">Site web</h4>
            <a href="http://osteopathieanimalel..." target="_blank" class="text-blue-600 hover:underline">http://osteopathieanimalel...</a>
          </div>

          <div>
            <h4 class="font-semibold text-gray-700">Réseaux sociaux</h4>
            <div class="flex space-x-3 text-2xl mt-1">
              <a href="#" class="text-gray-500 hover:text-pink-600">📷</a> <a href="#" class="text-gray-500 hover:text-blue-600">🇫</a> </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  professional: {
    type: Object,
    default: () => ({
      name: 'Agathe Libert-Coubard',
      avatar: 'https://i.pravatar.cc/150?img=53' 
    })
  }
});
</script>

<style scoped>

</style>