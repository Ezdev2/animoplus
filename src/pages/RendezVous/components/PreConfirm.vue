<template>
  <div class="max-w-4xl mx-auto space-y-8">
    
    <div class="text-center">
      <h1 class="text-xl font-semibold text-indigo-700">Service : Première rencontre</h1>
    </div>

    <div class="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 class="flex items-center text-lg font-bold text-gray-800 mb-4">
        <span class="mr-2 text-pink-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zm0 2a3 3 0 003 3v2H7V7a3 3 0 003-3z" />
          </svg>
        </span>
        Détails du Service
      </h2>
      
      <div class="space-y-3 text-gray-700">
        <p class="flex items-center">
          <span class="mr-3 text-pink-500">👩‍💼</span>
          <span class="font-semibold w-28 inline-block">Consultant :</span> 
          Dominique BOST
        </p>
        <p class="flex items-center">
          <span class="mr-3 text-pink-500">📍</span>
          <span class="font-semibold w-28 inline-block">Adresse :</span> 
          7 rue Antoine de Saint Exupéry, 69380 CHAZAY-D'AZERGUES
        </p>
        <p class="flex items-center">
          <span class="mr-3 text-pink-500">📞</span>
          <span class="font-semibold w-28 inline-block">Téléphone :</span> 
          0609035703
        </p>
        <p class="flex items-center">
          <span class="mr-3 text-pink-500">🍹</span>
          <span class="font-semibold w-28 inline-block">Durée :</span> 
          60 minutes
        </p>
        <p class="flex items-center">
          <span class="mr-3 text-pink-500">💰</span>
          <span class="font-semibold w-28 inline-block">Prix :</span> 
          <span class="font-bold text-green-600">0.00 €</span>
        </p>
        
        <div class="pt-3">
          <p class="font-semibold mb-1">Description :</p>
          <p class="text-sm leading-relaxed">
            Je vous propose un premier échange entre nous, pour établir une relation de confiance. Ce rendez-vous nous permettra de discuter des besoins spécifiques de votre animal, des attentes de chacun et d'assurer une prise en charge adaptée et sécurisée.
          </p>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="flex items-center text-lg font-bold text-gray-800">
        <span class="mr-2 text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
          </svg>
        </span>
        Disponibilités
      </h2>
      
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div class="text-center mb-6">
          <h3 class="text-lg font-bold text-gray-800">Semaine du 29 septembre 2025 au 05 octobre 2025</h3>
        </div>
        
        <div class="flex justify-between mb-8">
          <button class="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
            <span class="mr-1">←</span> Semaine précédente
          </button>
          <button class="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            Semaine suivante <span class="ml-1">→</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
            <h4 class="font-bold text-gray-800 mb-3">samedi 27 septembre</h4>
            <div class="flex flex-wrap justify-center gap-2">
              <button class="bg-green-100 text-green-700 hover:bg-green-200 px-1">12:00 - 13:00</button>
              <button class="bg-green-100 text-green-700 hover:bg-green-200 px-1">12:30 - 13:30</button>
              <button class="bg-green-100 text-green-700 hover:bg-green-200 px-1">13:00 - 14:00</button>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
            <h4 class="font-bold text-gray-800 mb-3">dimanche 28 septembre</h4>
            <div class="flex flex-wrap justify-center gap-2">
              <button class="bg-green-100 text-green-700 hover:bg-green-200 px-1">12:00 - 13:00</button>
              <button class="bg-green-100 text-green-700 hover:bg-green-200 px-1">12:30 - 13:30</button>
              <button class="bg-green-100 text-green-700 hover:bg-green-200 px-1">13:00 - 14:00</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>

</style>