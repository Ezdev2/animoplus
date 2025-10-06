<template>
  <div class="bg-gray-50 min-h-screen p-4 md:py-8 md:px-40">
    
    <div class="search-section w-full mx-auto mb-10">
      <h1 class="text-xl md:text-2xl font-bold text-gray-800 text-center mb-4">Rechercher un article</h1>
      <div class="relative">
        <input 
          type="text" 
          placeholder="Santé, bien-être, éducation..." 
          class="w-full p-4 pl-12 border-2 border-green-500 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    </div>
    
    <div class="articles-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
      <div v-for="article in articles" :key="article.id" class="article-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <img :src="article.image" :alt="article.title" class="w-full h-48 object-cover">
        <div class="p-4">
          <h2 class="font-semibold text-lg mb-1">{{ article.title }}</h2>
          <p class="text-sm text-gray-600 line-clamp-3">{{ article.description }}</p>
        </div>
      </div>
    </div>
    
    <div class="contact-section w-full mx-auto mt-10 bg-orange-600 text-white rounded-lg shadow-lg p-6 text-center">
      <h2 class="text-2xl font-bold mb-1">ENVIE D'UN ARTICLE ? CLIQUEZ ICI</h2>
      <p class="text-sm">Notre équipe reviendra vers vous rapidement</p>
    </div>
    
    <div class="articles-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto mt-10">
      <div v-for="article in articles" :key="article.id" class="article-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <img :src="article.image" :alt="article.title" class="w-full h-48 object-cover">
        <div class="p-4">
          <h2 class="font-semibold text-lg mb-1">{{ article.title }}</h2>
          <p class="text-sm text-gray-600 line-clamp-3">{{ article.description }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

const articles = ref([
  {
    id: 1,
    image: 'https://picsum.photos/200',
    title: 'Diana et les bienfaits des promenades dans la nature',
    description: 'Que ce soit à travers une promenade tranquille dans un parc ou une randonnée en montagne, inclure plus de nature dans nos vie...',
  },
  {
    id: 2,
    image: 'https://picsum.photos/200',
    title: 'La routine d\'Elizabeth II pour bien démarrer sa journée',
    description: 'La routine matinale de la Reine Elizabeth II, soigneusement orchestrée, reflétait une combinaison de traditions royales et de...',
  },
  {
    id: 3,
    image: 'https://picsum.photos/200',
    title: 'Elizabeth II et les femmes dans l\'armée. Leur rôle clé en 1940-45',
    description: 'En 1945, à l\'aube de ses 19 ans, la princesse Elizabeth de Windsor s\'engage dans l\'armée britannique au sein de l\'Auxiliary Territorial...',
  },
]);
</script>

<style scoped>
/* You can add any custom styles here if needed */
/* The line-clamp-3 class is a custom Tailwind plugin or a utility from a library like `@tailwindcss/line-clamp` */
</style>