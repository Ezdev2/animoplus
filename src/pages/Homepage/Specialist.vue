<template>
  <div class="w-full px-40 py-6 mt-20 bg-white">
    <div class="max-w-7xl mx-auto space-y-20">
      <!-- Header Section -->
      <div class="text-center space-y-6">
        <h1 class="text-green-600 text-5xl font-extrabold">
          ANNUAIRE DES PROFESSIONNELS
        </h1>
        <p class="text-green-600 text-lg font-normal max-w-3xl mx-auto">
          Découvrez l'ensemble des professionnels du secteur animalier référencés sur DoctoPet.
        </p>
        
        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto">
          <div class="flex items-center bg-white border border-gray-300 rounded-full px-6 py-3 shadow-sm">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Rechercher un professionnel ou une spécialité..."
              class="flex-1 bg-transparent border-none outline-none text-base text-neutral-600 placeholder:text-neutral-400" 
            />
            <router-link to="/specialist" class="ml-3">
              <img :src="searchIcon" alt="Rechercher" />
            </router-link>
          </div>
        </div>
      </div>

      <!-- Professionals Section -->
      <div class="space-y-6">
        <div class="flex items-center gap-4">
          <h2 class="text-zinc-800 text-2xl font-bold">
            Liste des Spécialités
          </h2>
        </div>
        
        <hr class="border-stone-300/50" />
        
        <!-- Professionals Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="professional in filteredProfessionals" 
            :key="professional.id"
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div class="flex flex-col items-center space-y-4">
              <!-- Profile Image -->
              <img 
                :src="professional.image" 
                :alt="professional.name"
                class="w-24 h-24 rounded-full border-2 border-lime-500 object-cover"
              />
              
              <!-- Name -->
              <h3 class="text-green-600 text-xl font-extrabold text-center">
                {{ professional.name }}
              </h3>
              
              <!-- Specialty Label -->
              <div class="flex items-center gap-3">
                <img :src="docIcon" alt="Spécialité" class="w-4 h-4" />
                <span class="text-gray-600 text-base font-normal">
                  Spécialité :
                </span>
              </div>
              
              <!-- Specialty -->
              <div class="text-gray-600 text-base font-extrabold text-center">
                {{ professional.specialty }}
              </div>
              
              <!-- View Profile Button -->
              <router-link 
                :to="`/profile/${professional.id}`"
                class="px-4 py-2 bg-green-600/20 rounded-lg hover:bg-green-600/30 transition-colors duration-200"
              >
                <span class="text-green-600 text-base font-extrabold">
                  Voir le profil
                </span>
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredProfessionals.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">Aucun professionnel trouvé pour cette recherche.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import searchIcon from '@/assets/icons/search-icon.svg'
import docIcon from '@/assets/icons/doc.svg'

// Search functionality
const searchQuery = ref('')

const professionals = ref([
  {
    id: 1,
    name: 'Dr. Marie Dubois',
    specialty: 'Vétérinaire généraliste',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Jean Martin',
    specialty: 'Toiletteur professionnel',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Sophie Leroy',
    specialty: 'Éducateur canin',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 4,
    name: 'Dr. Pierre Moreau',
    specialty: 'Dentiste animalier',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 5,
    name: 'Claire Bernard',
    specialty: 'Ostéopathe animalier',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 6,
    name: 'Lucas Petit',
    specialty: 'Pet-sitter',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 7,
    name: 'Dr. Amélie Rousseau',
    specialty: 'Chirurgien vétérinaire',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 8,
    name: 'Thomas Laurent',
    specialty: 'Comportementaliste',
    image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 9,
    name: 'Isabelle Girard',
    specialty: 'Nutritionniste animalier',
    image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop&crop=face'
  }
])

// Computed property for filtered professionals
const filteredProfessionals = computed(() => {
  if (!searchQuery.value) {
    return professionals.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return professionals.value.filter(professional => 
    professional.name.toLowerCase().includes(query) ||
    professional.specialty.toLowerCase().includes(query)
  )
})
</script>

<style scoped>

</style>