<template>
  <section class="border border-neutral-200 rounded-[10px] p-8 flex flex-col gap-8">

    <TitleDashboard title="Mon profil" :has-text-btn="true" btn-title="Mettre à jour" :icon="editIcon"
      @on-click-btn="$emit('edit-profile')" />

    <hr />

    <!-- Informations utilisateur -->
    <div class="flex justify-between items-start mb-4">
      <div class="flex gap-5">
        <img :src="userAvatar" alt="photo de profil" class="w-[130px] h-[130px] rounded-full object-cover" />

        <div class="flex flex-col gap-2">
          <h3 class="text-[20px] font-semibold text-neutral-700">{{ userName }}</h3>
          <p class=" text-neutral-700">{{ userEmail }}</p>

          <!-- Infos personnelles -->
          <p class="flex items-start gap-2">
            <img :src="phoneIcon" alt="Téléphone" class="w-[16px]" />
            {{ userPhone }}
          </p>
          <p class="flex items-start gap-2">
            <img :src="locationIcon" alt="Localisation" class="w-[16px]" />
            {{ userAddress }}
          </p>
          <p class="flex items-start gap-2">
            <img :src="calendarIcon" alt="Date de naissance" class="w-[16px]" />
            {{ userBirthDate }}
          </p>
        </div>
      </div>

      <!-- Bouton Ajouter un animal -->
      <button v-if="isUserClient" @click="addAnimal"
        class="bg-accent-500 text-white px-4 py-3 rounded-[14px] shadow-md flex items-center gap-2">
        <img :src="animalIcon" alt="icone patte" class="w-fit" />
        Ajouter un animal
      </button>
      <button v-else 
        class="bg-accent-500 text-white px-4 py-3 rounded-[14px] shadow-md flex items-center gap-2">
        <img :src="animalIcon" alt="icone patte" class="w-fit" />
        Ajouter un service
      </button>
    </div>

    <Alert :alert-img="alertIcon" alert-description="Information confidentielle">
      <div class="flex flex-col gap-4">
        <p class="text-[#222]">
          Ces informations sont confidentielles et accessibles uniquement par vous et les spécialistes vétérinaires.
        </p>
      </div>
    </Alert>

    <!-- Section Animaux -->
    <div v-if="isUserClient" class="flex flex-col gap-4">
      <div class="flex items-center font-bold gap-4">
        <img :src="petIcon" alt="icone animal" />
        <h3>Animaux de Compagnie</h3>
      </div>

      <hr />

      <!-- Si aucun animal enregistré -->
      <div v-if="animals.length < 1" class="flex flex-col items-center">
        <img :src="bigPaw" alt="patte" />
        <p>Aucun animal enregistré pour le moment</p>
      </div>

      <!-- Sinon on affiche les animaux -->
      <div v-else class="animal-cards">
        <div class="animal-card" v-for="(animal, index) in animals" :key="index">
          <img :src="animal.image" alt="photo animal" class="animal-image" />
          <p class="animal-name">{{ animal.nom }}</p>
        </div>
      </div>
    </div>
  </section>
  <AddAnimal v-if="showModal" @close="showModal = false" />
  
  <!-- Debug API Tester - TEMPORAIRE -->
  <ApiTester v-if="showApiTester" @close="showApiTester = false" />
  
  <!-- Bouton pour ouvrir le testeur API -->
  <button @click="showApiTester = true" 
    class="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-full shadow-lg hover:bg-blue-600 z-40">
    🔧 API Test
  </button>

</template>

<script setup>
import ProfileImg from '@/assets/images/image1.svg'
import DefaultAvatar from '@/assets/images/default-avatar.svg'
import { getUserAvatar } from '@/utils/avatarUtils.js'
import phoneIcon from '@/assets/icons/small-phone.svg'
import locationIcon from '@/assets/icons/small-marker.svg'
import calendarIcon from '@/assets/icons/small-calendar.svg'
import animalIcon from '@/assets/icons/animal.svg'
import alertIcon from '@/assets/icons/alertGreen.svg'
import petIcon from '@/assets/icons/animalGreen.svg'
import bigPaw from '@/assets/icons/big-paw.svg'
import editIcon from '@/assets/icons/edit-icon.svg'

import TitleDashboard from '@/components/common/TitleDashboard.vue'
import Alert from '@/components/common/Alert.vue'

import AddAnimal from '@/pages/Animals/components/AddAnimal.vue'
import ApiTester from '@/components/debug/ApiTester.vue'
import { ref, computed, onMounted } from 'vue'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'

const props = defineProps({
  isClient: {
    type: Boolean,
    default: true
  }
})

// Utiliser le système d'auth ultra-simple
const auth = useSimpleAuth()

// Initialiser les données
auth.init()

// Données utilisateur - UNE SEULE SOURCE
const userData = computed(() => {
  return auth.getCurrentUser.value
})
const userName = computed(() => {
  if (!userData.value) return 'Utilisateur'
  return userData.value.name || `${userData.value.firstName || ''} ${userData.value.lastName || ''}`.trim() || 'Utilisateur'
})
const userEmail = computed(() => userData.value?.email || 'email@exemple.com')
const userPhone = computed(() => userData.value?.phone || '+261 00 000 00 00')
const userAddress = computed(() => userData.value?.address || 'Adresse inconnue')
const userBirthDate = computed(() => {
  if (userData.value?.birth_date) {
    return new Date(userData.value.birth_date).toLocaleDateString('fr-FR')
  }
  return '19/01/2002'
})
const userAvatar = computed(() => {
  // Utiliser l'utilitaire pour obtenir l'avatar approprié
  return getUserAvatar(userData.value, 130)
})

// Déterminer le type d'utilisateur
const isUserClient = computed(() => {
  return userData.value?.user_type === 'client' || userData.value?.role === 'client'
})

const animals = ref([
  {
    nom: 'Chien',
    image: new URL('@/assets/images/dog.svg', import.meta.url).href
  }
])

const showModal = ref(false)
const showApiTester = ref(false)

const emit = defineEmits(['edit-profile']);

function addAnimal () {
  showModal.value = true;
}

// Initialisation ultra-simple
onMounted(() => {
  console.log('🚀 Initialisation UserProfile - Version Simple')
  console.log('👤 Utilisateur:', userData.value?.name)
})

</script>

<style scoped>
.font-league {
  font-family: 'League Spartan', sans-serif;
}

.confidential-text p {
  margin-left: -40px;
}

.animal-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.animal-card {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  width: 200px;
  padding: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.animal-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
}

.animal-name {
  margin-top: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
}
</style>
