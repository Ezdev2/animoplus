<template>
  <div class=" mx-auto">
    <h2 class="text-xl font-semibold mb-4 text-gray-800">Sélectionnez un professionnel</h2>

    <div class="flex gap-3 mb-5">
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="Rechercher par nom..."
        class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-base outline-none transition-colors duration-300 focus:border-green-600"
      />
      
      <select v-model="sortBy" class="px-4 py-3 border-2 border-gray-200 rounded-lg text-base outline-none bg-white cursor-pointer">
        <option value="rating">Mieux notés</option>
        <option value="distance">Plus proches</option>
        <option value="availability">Disponibilité</option>
      </select>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div 
        v-for="professional in filteredProfessionals" 
        :key="professional.id"
        @click="selectProfessional(professional)"
        class="bg-white p-5 rounded-xl border-2 border-gray-200 cursor-pointer transition-all duration-300 flex gap-5 hover:border-green-600 hover:shadow-lg"
        :class="{ 'border-green-600 bg-green-50': selectedProfessional?.id === professional.id }"
      >
        <div class="flex-shrink-0">
          <img 
            :src="professional.avatar" 
            :alt="professional.name"
            class="w-[100px] h-[100px] rounded-full object-cover"
          />
        </div>
        
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-gray-900 mb-1">{{ professional.name }}</h3>
          <p class="text-sm text-green-600 font-medium mb-2">{{ professional.specialty }}</p>
          <p class="text-sm text-gray-600 mb-3">{{ professional.address }}</p>
          
          <div class="flex gap-5 items-center mb-3">
            <div class="flex items-center gap-1.5 text-sm font-medium">
              <span class="text-base">⭐</span>
              <span>{{ professional.rating }}</span>
              <span class="text-gray-500 font-normal">({{ professional.reviewCount }} avis)</span>
            </div>
            <div class="text-sm text-gray-600">
              📍 {{ professional.distance }} km
            </div>
          </div>

          <div>
            <span 
              class="inline-block px-3 py-1 rounded-xl text-xs font-medium" 
              :class="{ 
                'bg-green-100 text-green-800': professional.available, 
                'bg-red-100 text-red-800': !professional.available 
              }"
            >
              {{ professional.available ? 'Disponible' : 'Peu disponible' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredProfessionals.length === 0" class="text-center py-10">
      <p class="text-gray-500">Aucun professionnel trouvé</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['select-professional']);

const searchQuery = ref('');
const sortBy = ref('rating');
const selectedProfessional = ref(null);

const professionals = ref([
  {
    id: 1,
    name: 'Dr. Marie Dubois',
    specialty: 'Vétérinaire généraliste',
    address: '12 rue de la Paix, Paris',
    rating: 4.8,
    reviewCount: 156,
    distance: 2.3,
    available: true,
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 2,
    name: 'Dr. Jean Martin',
    specialty: 'Chirurgien vétérinaire',
    address: '45 avenue des Champs, Paris',
    rating: 4.9,
    reviewCount: 203,
    distance: 3.7,
    available: true,
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: 3,
    name: 'Dr. Sophie Laurent',
    specialty: 'Spécialiste NAC',
    address: '8 boulevard Saint-Michel, Paris',
    rating: 4.7,
    reviewCount: 89,
    distance: 1.8,
    available: false,
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 4,
    name: 'Dr. Pierre Rousseau',
    specialty: 'Vétérinaire équin',
    address: '23 rue du Commerce, Paris',
    rating: 4.6,
    reviewCount: 127,
    distance: 5.2,
    available: true,
    avatar: 'https://i.pravatar.cc/150?img=13'
  }
]);

const filteredProfessionals = computed(() => {
  let result = [...professionals.value];
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(prof => 
      prof.name.toLowerCase().includes(query) ||
      prof.specialty.toLowerCase().includes(query)
    );
  }
  
  // Sort
  result.sort((a, b) => {
    switch(sortBy.value) {
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        return a.distance - b.distance;
      case 'availability':
        return b.available - a.available;
      default:
        return 0;
    }
  });
  
  return result;
});

function selectProfessional(professional) {
  selectedProfessional.value = professional;
  emit('select-professional', professional);
}
</script>