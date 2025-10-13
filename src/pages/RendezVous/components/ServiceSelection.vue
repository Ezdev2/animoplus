<template>
  <div class="service-selection">
    <h2 class="text-xl font-semibold mb-6 text-gray-800 text-center">
      Comment souhaitez-vous prendre rendez-vous ?
    </h2>

    <div class="selection-types">
      <!-- Recherche par Service -->
      <div @click="selectSearchType('service')" class="selection-card"
        :class="{ 'selected': searchType === 'service' }">
        <div class="card-icon">🔍</div>
        <h3 class="card-title">Rechercher un service</h3>
        <p class="card-description">
          Choisissez le type de consultation ou de soin dont vous avez besoin
        </p>
        <div class="card-badge">Recommandé</div>
      </div>

      <!-- Recherche par Professionnel -->
      <div @click="selectSearchType('professional')" class="selection-card"
        :class="{ 'selected': searchType === 'professional' }">
        <div class="card-icon">👨‍⚕️</div>
        <h3 class="card-title">Rechercher un professionnel</h3>
        <p class="card-description">
          Trouvez et prenez rendez-vous avec un vétérinaire spécifique
        </p>
      </div>
    </div>

    <!-- Services List -- 'service' is selected -->
    <div v-if="searchType === 'service'" class="services-list-container flex flex-col gap-4">
      <div @click="selectService" v-for="(item, index) in services" :key="index"
        class="flex justify-between items-center border border-gray-300 rounded-2xl p-4 md:p-6 hover:shadow-md transition relative"
        :class="item.active ? 'bg-blue-100 border-blue-300' : 'bg-white'">
        <!-- Texte -->
        <div class="flex flex-col">
          <h3 class="font-bold text-gray-800 text-base md:text-lg uppercase tracking-wide">
            {{ item.title }}
          </h3>
          <p class="text-gray-600 text-sm md:text-base max-w-[400px]">
            {{ item.description }}
          </p>
        </div>

        <!-- Image décorative -->
        <div class="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
          <img :src="item.image" :alt="item.title"
            class="w-full h-full object-cover rounded-[40%_60%_70%_30%/60%_30%_40%_70%] border border-gray-200" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['select-service']);

const searchType = ref(null);
const searchQuery = ref('');
const selectedService = ref(null);

const services = [
  {
    title: "VÉTÉRINAIRE",
    description:
      "Conseils vétérinaires généraux pour animaux de compagnie et NAC",
    image: "https://picsum.photos/200",
  },
  {
    title: "TOILETTEUR",
    description:
      "Astuces et conseils d’hygiène, d’entretien et de soins esthétiques à distance",
    image: "https://picsum.photos/200",
  },
  {
    title: "ÉDUCATEUR CANIN",
    description:
      "Accompagnement en ligne pour l’éducation et la socialisation de votre chien",
    image: "https://picsum.photos/200",
  },
  {
    title: "OSTÉOPATHE ANIMALIER",
    description:
      "Conseils pour améliorer la mobilité et soulager les douleurs à distance",
    image: "https://picsum.photos/200",
    active: true,
  },
  {
    title: "NUTRITIONNISTE VÉTÉRINAIRE",
    description:
      "Conseils personnalisés pour l’alimentation et la nutrition de vos animaux",
    image: "https://picsum.photos/200",
  },
  {
    title: "KINÉSIOLOGUE ANIMALIER",
    description:
      "Accompagnement émotionnel et conseils pour réduire le stress et améliorer le bien-être",
    image: "https://picsum.photos/200",
  },
];
const filteredServices = computed(() => {
  if (!searchQuery.value) return services.value;

  const query = searchQuery.value.toLowerCase();
  return services.value.filter(service =>
    service.name.toLowerCase().includes(query) ||
    service.description.toLowerCase().includes(query)
  );
});



function selectSearchType(type) {
  searchType.value = type;

  if (type === 'professional') {
    emit('select-service', { searchType: 'professional' });
  }
}

function selectService(service) {
  selectedService.value = service;
  emit('select-service', {
    ...service,
    searchType: 'service'
  });
}
</script>

<style scoped>
.service-selection {
  max-width: 1000px;
  margin: 0 auto;
}

.selection-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.selection-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  border: 3px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  position: relative;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.selection-card:hover {
  border-color: #43a047;
  box-shadow: 0 8px 20px rgba(67, 160, 71, 0.2);
  transform: translateY(-4px);
}

.selection-card.selected {
  border-color: #43a047;
  background: #f1f8f4;
  box-shadow: 0 8px 20px rgba(67, 160, 71, 0.25);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.card-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #43a047;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.services-list-container {
  animation: fadeIn 0.4s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-box {
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #43a047;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.service-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.service-card:hover {
  border-color: #43a047;
  box-shadow: 0 4px 12px rgba(67, 160, 71, 0.15);
  transform: translateY(-2px);
}

.service-card.selected {
  border-color: #43a047;
  background: #f1f8f4;
}

.service-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.service-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.service-description {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 12px;
  line-height: 1.4;
}

.service-price {
  font-size: 14px;
  font-weight: 600;
  color: #43a047;
}

.confirmation-message {
  margin-top: 30px;
  padding: 20px;
  background: #f1f8f4;
  border: 2px solid #43a047;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 16px;
  animation: fadeIn 0.4s ease-in;
}

.message-icon {
  font-size: 32px;
  color: #43a047;
  background: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.confirmation-message p {
  color: #166534;
  font-weight: 500;
  font-size: 15px;
}
</style>