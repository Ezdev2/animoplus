<template>
    <section class="border border-neutral-200 rounded-[10px] p-8 flex flex-col gap-8">

      <TitleDashboard title="Mes animaux" :has-button="true" btn-title="Ajouter un animal" :icon="animalIcon" @on-click-btn="showModal = true" />

      <hr />

      <Alert alert-description="Adoptez votre futur compagnon avec nos éleveurs partenaires !">
        <div class="flex flex-col gap-4">
          <p class="text-[#222]">
            Trouvez un éleveur près de chez vous et adoptez un animal en toute confiance.
          </p>
          <button
          @click="$emit('showFindBreeder')"
            class="bg-[#43A047] text-white px-4 py-3 rounded-[10px] flex items-center w-fit gap-2">
            <img :src="searchIcon" alt="icone recherche" />
            <span>Trouver un éleveur</span>
          </button>
        </div>
      </Alert>

      <!-- Section des animaux de compagnie -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center font-bold gap-4">
          <img :src="petIcon" alt="icone animal" />
          <h3>Animaux de Compagnie</h3>
        </div>

        <hr />

        <!-- État de chargement -->
        <div v-if="loadingAnimals" class="flex flex-col items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <p class="mt-2 text-gray-600">Chargement des animaux...</p>
        </div>

        <!-- Erreur de chargement -->
        <div v-else-if="animalsError" class="flex flex-col items-center py-8">
          <p class="text-red-600">Erreur lors du chargement des animaux</p>
          <button 
            @click="refetchAnimals()" 
            class="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Réessayer
          </button>
        </div>

        <!-- Si aucun animal enregistré -->
        <div v-else-if="animals.length < 1" class="flex flex-col items-center py-8">
          <img :src="bigPaw" alt="patte" />
          <p class="text-gray-600 mt-4">Aucun animal enregistré pour le moment</p>
          <p class="text-sm text-gray-500">Cliquez sur "Ajouter un animal" pour commencer</p>
        </div>

        <!-- Sinon on affiche les animaux -->
        <div v-else class="animal-cards">
          <div class="animal-card" v-for="animal in animals" :key="animal.id">
            <img 
              :src="getAnimalImage(animal)" 
              :alt="`Photo de ${animal.nom}`" 
              class="animal-image" 
              @error="handleImageError"
            />
            <div class="animal-info">
              <p class="animal-name">{{ animal.nom }}</p>
              <p class="animal-species">{{ animal.espece?.nom || 'Espèce inconnue' }}</p>
              <p v-if="animal.race?.nom" class="animal-race">{{ animal.race.nom }}</p>
              <p v-if="animal.date_naissance" class="animal-age">{{ getAnimalAge(animal.date_naissance) }}</p>
              <div class="animal-gender">
                <span class="gender-badge" :class="animal.sexe === 'M' ? 'male' : 'female'">
                  {{ animal.sexe === 'M' ? '♂ Mâle' : '♀ Femelle' }}
                </span>
              </div>
            </div>
            
            <!-- Menu contextuel -->
            <ContextMenu 
              @edit="editAnimal(animal)"
              @delete="confirmDeleteAnimal(animal)"
              title="Options de l'animal"
              position="bottom-left"
              class="animal-context-menu"
            />
          </div>
        </div>

      </div>
    </section>
    <AddAnimal v-if="showModal" @close="handleModalClose" />
    <EditAnimal v-if="showEditModal" :animal="animalToEdit" @close="handleEditModalClose" @animal-updated="handleAnimalUpdated" />
    <DeleteConfirmModal 
      v-if="showDeleteModal" 
      :title="'Supprimer l\'animal'"
      :confirm-title="'Supprimer définitivement ?'"
      :message="'Vous êtes sur le point de supprimer cet animal. Cette action supprimera toutes les données associées (historique médical, rendez-vous, etc.).'"
      :item-details="animalToDelete?.nom"
      :item-label="'Animal'"
      :permanent-warning="'Cette suppression est permanente et irréversible'"
      @close="handleDeleteModalClose"
      @confirm="deleteAnimal"
    />

</template>

<script setup>
import { ref, computed, watch } from 'vue'

import TitleDashboard from '@/components/common/TitleDashboard.vue'
import Alert from '@/components/common/Alert.vue'

// Import des icônes
import animalIcon from '@/assets/icons/animal.svg'
import searchIcon from '@/assets/icons/breeder-search.svg'
import petIcon from '@/assets/icons/animalGreen.svg'
import bigPaw from '@/assets/icons/big-paw.svg'
import editIcon from '@/assets/icons/edit.svg'

// Import des composants modales
import AddAnimal from '@/pages/Animals/components/AddAnimal.vue'
import EditAnimal from '@/pages/Animals/components/EditAnimal.vue'
import ContextMenu from '@/components/common/ContextMenu.vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'

// Import des services API
import { useAnimalsStore } from '@/stores/animals.js'
import { useSpeciesCache } from '@/composables/useSpeciesCache.js'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'

// État local pour afficher ou cacher les modales
const showModal = ref(false)
const showEditModal = ref(false)
const animalToEdit = ref(null)
const showDeleteModal = ref(false)
const animalToDelete = ref(null)

// Authentification pour récupérer l'utilisateur connecté
const auth = useSimpleAuth()
const currentUser = computed(() => auth.getCurrentUser.value)

// Store Pinia pour les animaux (remplace les services directs)
const animalsStore = useAnimalsStore()

// Récupération des espèces et races avec cache optimisé
const { 
  species: speciesData, 
  isLoading: loadingSpecies, 
  stats: speciesStats,
  backgroundRefreshStatus 
} = useSpeciesCache({ withRaces: true })

// Filtrer les animaux par propriétaire depuis le store
const animals = computed(() => 
  animalsStore.getAnimalsByOwner(currentUser.value?.id)
)
const loadingAnimals = computed(() => animalsStore.isLoading)
const animalsError = computed(() => animalsStore.error)

// Fonction pour recharger les animaux
const refetchAnimals = () => {
  animalsStore.animalsQuery.refetch?.()
}

// Debug pour les animaux et le cache
watch(animals, (newAnimals) => {
  console.log('Animaux chargés:', newAnimals)
}, { immediate: true })

// Debug pour le cache des espèces
watch(speciesStats, (stats) => {
  console.log('📊 Stats cache espèces:', stats)
}, { immediate: true })

watch(backgroundRefreshStatus, (status) => {
  if (status === 'refreshing') {
    console.log('🔄 Mise à jour en arrière-plan des espèces...')
  } else if (status === 'success') {
    console.log('✅ Espèces mises à jour en arrière-plan')
  }
})

// Fonction pour gérer la fermeture du modal et rafraîchir les données
function handleModalClose() {
  showModal.value = false
  // Rafraîchir la liste des animaux après création
  refetchAnimals()
}

// Fonction pour gérer la fermeture du modal d'édition
function handleEditModalClose() {
  showEditModal.value = false
  animalToEdit.value = null
  // Rafraîchir la liste des animaux après modification
  refetchAnimals()
}

// Fonction pour gérer la mise à jour d'un animal
function handleAnimalUpdated(updatedAnimal) {
  console.log('Animal mis à jour:', updatedAnimal)
  showEditModal.value = false
  animalToEdit.value = null
  // Forcer le rafraîchissement de la liste
  refetchAnimals()
}

// Fonction pour ouvrir le modal d'édition
function editAnimal(animal) {
  animalToEdit.value = animal
  showEditModal.value = true
  console.log('Édition de l\'animal:', animal)
}

// Fonction pour confirmer la suppression d'un animal
function confirmDeleteAnimal(animal) {
  animalToDelete.value = animal
  showDeleteModal.value = true
  console.log('Demande de suppression de l\'animal:', animal)
}

// Fonction pour gérer la fermeture du modal de suppression
function handleDeleteModalClose() {
  showDeleteModal.value = false
  animalToDelete.value = null
}

// Fonction pour supprimer l'animal
async function deleteAnimal() {
  if (!animalToDelete.value) return
  
  try {
    console.log('🗑️ Suppression de l\'animal:', animalToDelete.value.nom)
    await animalsStore.removeAnimal(animalToDelete.value.id)
    showDeleteModal.value = false
    animalToDelete.value = null
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    throw error
  }
}

// Fonction pour obtenir l'image par défaut selon l'espèce
function getAnimalImage(animal) {
  // Si l'animal a une image, l'utiliser
  if (animal?.photo) {
    return animal.photo
  }
  
  // Sinon, image par défaut selon l'espèce
  const speciesImages = {
    'Chien': new URL('@/assets/images/dog.svg', import.meta.url).href,
    'Chat': new URL('@/assets/images/cat.svg', import.meta.url).href,
    'Lapin': new URL('@/assets/images/rabbit.svg', import.meta.url).href,
    'Oiseau': new URL('@/assets/images/bird.svg', import.meta.url).href,
    'Poisson': new URL('@/assets/images/fish.svg', import.meta.url).href,
  }
  
  // Utiliser l'icône paw-gray.svg comme fallback (qui existe)
  return speciesImages[animal?.espece?.nom] || new URL('@/assets/icons/paw-gray.svg', import.meta.url).href
}

// Fonction pour gérer les erreurs d'image (éviter la boucle infinie)
function handleImageError(event) {
  // Éviter la boucle infinie en vérifiant si on a déjà mis l'image par défaut
  if (event.target.src.includes('paw-gray.svg')) {
    return // Ne rien faire si on est déjà sur l'image par défaut
  }
  
  // Mettre l'image par défaut (paw-gray.svg qui existe)
  event.target.src = new URL('@/assets/icons/paw-gray.svg', import.meta.url).href
}

// Fonction pour formater l'âge de l'animal
function getAnimalAge(birthDate) {
  if (!birthDate) return ''
  
  const today = new Date()
  const birth = new Date(birthDate)
  const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth())
  
  if (ageInMonths < 12) {
    return `${ageInMonths} mois`
  } else {
    const years = Math.floor(ageInMonths / 12)
    return `${years} an${years > 1 ? 's' : ''}`
  }
}

const emit = defineEmits(['showFindBreeder']);
</script>

<style scoped>
.animal-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.animal-card {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  width: 220px;
  padding: 12px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  position: relative;
}

.animal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.animal-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
}

.animal-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.animal-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.animal-species {
  font-size: 14px;
  font-weight: 500;
  color: #43A047;
}

.animal-race {
  font-size: 12px;
  color: #666;
  font-style: italic;
}

.animal-age {
  font-size: 12px;
  color: #888;
}

.animal-gender {
  margin-top: 8px;
}

.gender-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
}

.gender-badge.male {
  background-color: #E3F2FD;
  color: #1976D2;
}

.gender-badge.female {
  background-color: #FCE4EC;
  color: #C2185B;
}

/* Animation de chargement */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Styles pour le bouton d'édition */
.edit-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0;
  transform: scale(0.8);
}

.animal-card:hover .edit-btn {
  opacity: 1;
  transform: scale(1);
}

.edit-btn:hover {
  background-color: #43a047;
  border-color: #43a047;
  box-shadow: 0 2px 8px rgba(67, 160, 71, 0.3);
}

.edit-btn:hover .edit-icon {
  filter: brightness(0) invert(1);
}

.edit-icon {
  width: 16px;
  height: 16px;
  transition: filter 0.2s ease;
}

/* Styles pour le menu contextuel */
.animal-context-menu {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 1;
  transform: scale(1);
  transition: all 0.2s ease;
  z-index: 10;
}

.animal-context-menu:hover {
  transform: scale(1.05);
}
</style>