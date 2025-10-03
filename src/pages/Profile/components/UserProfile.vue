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

      <!-- Boutons d'action -->
      <div v-if="isUserClient" class="flex flex-col gap-3">
        <button @click="addAnimal"
          class="bg-accent-500 text-white px-4 py-3 rounded-[14px] shadow-md flex items-center gap-2">
          <img :src="animalIcon" alt="icone patte" class="w-fit" />
          Ajouter un animal
        </button>
      </div>
      
      <div v-else class="flex flex-col gap-3">
        <button @click="addService"
          class="bg-accent-500 text-white px-4 py-3 rounded-[14px] shadow-md flex items-center gap-2">
          <img :src="animalIcon" alt="icone patte" class="w-fit" />
          Ajouter un service
        </button>
        
        <button @click="viewMyServices"
          class="bg-blue-500 text-white px-4 py-3 rounded-[14px] shadow-md flex items-center gap-2 hover:bg-blue-600 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="m2 17 10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="m2 12 10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          Voir mes services
        </button>
        
        <!-- Boutons conditionnels selon le statut Pro -->
        <div v-if="isVeterinarianPro" class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-[14px] shadow-md">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xl">⭐</span>
            <span class="font-semibold">Compte Pro Actif</span>
          </div>
          <div class="flex gap-2">
            <button @click="router.push('/pro-analytics')" 
              class="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-lg text-sm transition-all">
              📊 Analytics
            </button>
            <button @click="router.push('/pro-reports')" 
              class="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-lg text-sm transition-all">
              📋 Rapports
            </button>
          </div>
        </div>
        
        <!-- Boutons pour vétérinaires normaux -->
        <template v-else-if="isVeterinarian">
          <!-- Bouton Passer Pro -->
          <button @click="openUpgradeToProModal"
            class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-[14px] shadow-md flex items-center gap-2 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
            <span class="font-semibold">⭐ Passer Pro (API)</span>
          </button>
          
          <!-- Bouton Test Simulation -->
          <!-- <button @click="testSimulationUpgrade"
            class="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-3 rounded-[14px] shadow-md flex items-center gap-2 hover:from-green-700 hover:to-teal-700 transition-all duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.66 0 3.22.45 4.56 1.24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="font-semibold">🎭 Test Simulation</span>
          </button> -->
        </template>
      </div>
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

    <!-- Section Spécialités (pour les vétérinaires) -->
    <div v-if="!isUserClient" class="flex flex-col gap-4">
      <div class="flex items-center font-bold gap-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-accent-500">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="m2 17 10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="m2 12 10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        </svg>
        <h3>Mes Spécialités</h3>
      </div>

      <hr />

      <!-- État de chargement -->
      <div v-if="isLoadingSpecialities" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
        <span class="ml-3 text-gray-600">Chargement des spécialités...</span>
      </div>

      <!-- Si aucune spécialité enregistrée -->
      <div v-else-if="userSpecialities.length < 1" class="flex flex-col items-center py-8">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-gray-400 mb-4">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="m2 17 10 5 10-5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="m2 12 10 5 10-5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
        <p class="text-gray-500">Aucune spécialité enregistrée pour le moment</p>
        <p class="text-sm text-gray-400 mt-2">Ajoutez vos spécialités vétérinaires pour enrichir votre profil</p>
      </div>

      <!-- Sinon on affiche les spécialités -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="speciality in userSpecialities" 
          :key="speciality.id" 
          class="speciality-card border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          :class="{ 'ring-2 ring-accent-500 bg-accent-50': speciality.is_primary }"
        >
          <!-- En-tête de la carte -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ getCertificationLevelIcon(speciality.certification_level) }}</span>
              <div>
                <h4 class="font-semibold text-gray-800">{{ getSpecialityName(speciality) }}</h4>
                <p class="text-sm text-gray-600">{{ getSpecialityDescription(speciality) }}</p>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex items-center gap-2">
              <!-- Badge spécialité principale -->
              <div v-if="speciality.is_primary" class="bg-accent-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Principale
              </div>
              
              <!-- Bouton de suppression -->
              <button 
                @click="confirmDeleteSpeciality(speciality)"
                class="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-colors"
                :title="`Supprimer ${getSpecialityName(speciality)}`"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="m18 6-12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="m6 6 12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Niveau de certification -->
          <div class="flex items-center gap-2 mb-2">
            <span class="text-sm font-medium text-gray-700">Niveau :</span>
            <span 
              class="px-2 py-1 rounded-full text-xs font-medium text-white"
              :style="{ backgroundColor: getCertificationLevelColor(speciality.certification_level) }"
            >
              {{ getCertificationLevelLabel(speciality.certification_level) }}
            </span>
          </div>

          <!-- Informations supplémentaires -->
          <div v-if="speciality.certified_since || speciality.notes" class="text-xs text-gray-500 space-y-1">
            <div v-if="speciality.certified_since" class="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
              </svg>
              Certifié depuis : {{ new Date(speciality.certified_since).toLocaleDateString('fr-FR') }}
            </div>
            <div v-if="speciality.notes" class="italic">
              {{ speciality.notes }}
            </div>
          </div>
        </div>
      </div>

      <!-- Bouton d'ajout de spécialité -->
      <div class="flex justify-center mt-4">
        <button 
          class="bg-accent-500 text-white px-6 py-2 rounded-lg hover:bg-accent-600 transition-colors flex items-center gap-2"
          @click="addSpeciality"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
          </svg>
          Ajouter une spécialité
        </button>
      </div>
    </div>
  </section>
  <AddAnimal v-if="showModal" @close="showModal = false" />
  
  <!-- Modal des services utilisateur -->
  <UserServicesModal 
    v-if="showServicesModal" 
    :userId="currentUser?.id"
    @close="showServicesModal = false"
    @edit-service="handleEditService"
    @delete-service="handleDeleteService"
    @create-service="handleCreateService"
  />
  
  <!-- Modal d'ajout de service -->
  <AddServiceModal 
    v-if="showAddServiceModal"
    @close="handleAddServiceClose"
    @service-created="handleServiceCreated"
  />
  
  <!-- Modal d'édition de service -->
  <EditServiceModal 
    v-if="showEditServiceModal && selectedService"
    :service="selectedService"
    @close="handleEditServiceClose"
    @service-updated="handleServiceUpdated"
  />
  
  <!-- Modal d'ajout de spécialité utilisateur -->
  <AddUserSpecialityModal 
    :is-open="showAddSpecialityModal"
    @close="showAddSpecialityModal = false"
    @speciality-added="handleSpecialityAdded"
  />

  <!-- Modal de suppression de spécialité utilisateur -->
  <DeleteSpecialityModal 
    :is-open="showDeleteSpecialityModal"
    :speciality="specialityToDelete"
    @close="handleDeleteModalClose"
    @confirm-delete="handleDeleteSpeciality"
  />

  <!-- Modal Upgrade vers Pro -->
  <UpgradeToProModal 
    :is-open="showUpgradeToProModal"
    :use-simulation="false"
    @close="showUpgradeToProModal = false"
    @upgrade-success="handleUpgradeSuccess"
  />

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
import UserServicesModal from '@/components/services/UserServicesModal.vue'
import AddServiceModal from '@/components/services/AddServiceModal.vue'
import EditServiceModal from '@/components/services/EditServiceModal.vue'
import ApiTester from '@/components/debug/ApiTester.vue'
import AddUserSpecialityModal from '@/components/userSpecialities/AddUserSpecialityModal.vue'
import DeleteSpecialityModal from '@/components/userSpecialities/DeleteSpecialityModal.vue'
import UpgradeToProModal from '@/components/subscription/UpgradeToProModal.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'
import { useUserSpecialities } from '@/composables/useUserSpecialities.js'
import { useSubscription } from '@/composables/useSubscription.js'
import { useUserRole } from '@/composables/useUserRole.js'

const props = defineProps({
  isClient: {
    type: Boolean,
    default: true
  }
})

// Utiliser le système d'auth ultra-simple
const auth = useSimpleAuth()
const router = useRouter()

// Composables pour les rôles
const { isClient, isVeterinarian, isVeterinarianPro, isAnyVeterinarian } = useUserRole()

// Composable pour les spécialités utilisateur
const { 
  userSpecialities, 
  primarySpeciality,
  isLoading: isLoadingSpecialities,
  loadUserSpecialities,
  removeUserSpeciality,
  getCertificationLevelLabel,
  getCertificationLevelIcon,
  getCertificationLevelColor
} = useUserSpecialities()

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
  const userType = userData.value?.user_type || userData.value?.role
  return userType === 'client'
})

const animals = ref([
  {
    nom: 'Chien',
    image: new URL('@/assets/images/dog.svg', import.meta.url).href
  }
])

const showModal = ref(false)
const showApiTester = ref(false)
const showAddSpecialityModal = ref(false)
const showDeleteSpecialityModal = ref(false)
const specialityToDelete = ref(null)
const showServicesModal = ref(false)
const showAddServiceModal = ref(false)
const showEditServiceModal = ref(false)
const selectedService = ref(null)
const showUpgradeToProModal = ref(false)

// Utilisateur actuel pour le modal des services
const currentUser = computed(() => userData.value)

const emit = defineEmits(['edit-profile']);

function addAnimal () {
  showModal.value = true;
}

function addService() {
  console.log('🔧 Ajouter un service')
  showAddServiceModal.value = true
}

function viewMyServices() {
  console.log('👁️ Voir mes services')
  showServicesModal.value = true
}

function openUpgradeToProModal() {
  console.log('⭐ Ouvrir modal upgrade Pro (API réelle)')
  showUpgradeToProModal.value = true
}

function testSimulationUpgrade() {
  console.log('🎭 Test simulation upgrade Pro')
  // Utiliser directement le composable pour tester
  const { upgradeToPro } = useSubscription()
  upgradeToPro(true) // true = simulation
}

function handleUpgradeSuccess(upgradeData) {
  console.log('✅ Upgrade vers Pro réussi:', upgradeData)
  showUpgradeToProModal.value = false
  
  // Les données utilisateur ont déjà été mises à jour par le composable useSubscription
  // Mais on peut faire des actions supplémentaires ici
  
  if (upgradeData.user) {
    console.log('👤 Nouvelles données utilisateur:', upgradeData.user)
    
    // Vérifier si l'utilisateur est maintenant Pro
    const isPro = upgradeData.user.user_type === 'veterinarian_pro' || 
                  upgradeData.user.subscription_type === 'pro'
    
    if (isPro) {
      console.log('🎉 Utilisateur est maintenant Pro!')
      
      // Optionnel: Rediriger vers une page spécifique Pro
      // router.push('/pro-dashboard')
      
      // Optionnel: Recharger la page pour mettre à jour l'interface
      // window.location.reload()
    }
  }
  
  // Message personnalisé selon le mode
  const message = upgradeData.isSimulation 
    ? '🎭 Simulation réussie ! Votre compte est maintenant Pro (mode test).\n\nVous avez maintenant accès à toutes les fonctionnalités avancées.'
    : '🎉 Félicitations ! Votre compte est maintenant Pro !\n\nVous avez maintenant accès à toutes les fonctionnalités avancées.'
  
  // Afficher le message après un court délai pour laisser le toast s'afficher
  setTimeout(() => {
    alert(message)
  }, 2000)
}

// Gestionnaires d'événements du modal des services
function handleEditService(service) {
  console.log('✏️ Éditer le service:', service)
  selectedService.value = service
  showServicesModal.value = false // Fermer le modal des services
  showEditServiceModal.value = true // Ouvrir le modal d'édition
}

function handleDeleteService(service) {
  console.log('🗑️ Supprimer le service:', service)
  // La suppression est maintenant gérée directement dans UserServicesModal
  // Le modal de confirmation s'ouvrira automatiquement
}

function handleCreateService() {
  console.log('➕ Créer un nouveau service depuis le modal des services')
  showServicesModal.value = false
  showAddServiceModal.value = true
}

// Gestionnaires du modal d'ajout de service
function handleAddServiceClose() {
  showAddServiceModal.value = false
}

function handleServiceCreated(service) {
  console.log('✅ Service créé:', service)
  showAddServiceModal.value = false
  // Le service sera automatiquement ajouté à la liste via TanStack Query
}

// Gestionnaires du modal d'édition de service
function handleEditServiceClose() {
  showEditServiceModal.value = false
  selectedService.value = null
  // Rouvrir le modal des services pour voir les changements
  showServicesModal.value = true
}

function handleServiceUpdated(service) {
  console.log('✅ Service modifié:', service)
  showEditServiceModal.value = false
  selectedService.value = null
  // Rouvrir le modal des services pour voir les changements
  showServicesModal.value = true
  // Le service sera automatiquement mis à jour dans la liste via TanStack Query
}

// Fonction pour ajouter une spécialité
function addSpeciality() {
  console.log('➕ Ouvrir modal ajout spécialité')
  showAddSpecialityModal.value = true
}

// Fonction appelée quand une spécialité est ajoutée
function handleSpecialityAdded(speciality) {
  console.log('✅ Spécialité ajoutée:', speciality)
  showAddSpecialityModal.value = false
  // Les données seront automatiquement mises à jour via le store Pinia
}

// Fonction pour ouvrir le modal de confirmation de suppression
function confirmDeleteSpeciality(speciality) {
  console.log('🗑️ Demande suppression spécialité:', speciality)
  specialityToDelete.value = speciality
  showDeleteSpecialityModal.value = true
}

// Fonction pour supprimer une spécialité (appelée par le modal)
async function handleDeleteSpeciality(specialityId) {
  try {
    console.log('🗑️ Suppression spécialité confirmée:', specialityId)
    
    const result = await removeUserSpeciality(specialityId)
    
    if (result.success) {
      console.log('✅ Spécialité supprimée avec succès:', result)
      // Fermer le modal
      showDeleteSpecialityModal.value = false
      specialityToDelete.value = null
      // Les données seront automatiquement mises à jour via le store Pinia
    }
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de la spécialité:', error)
    // Le modal gère déjà l'état d'erreur
  }
}

// Fonction pour fermer le modal de suppression
function handleDeleteModalClose() {
  showDeleteSpecialityModal.value = false
  specialityToDelete.value = null
}

// Fonctions utilitaires pour extraire les données de spécialité
function getSpecialityName(speciality) {
  // Essayer différentes propriétés possibles
  return speciality.specialty?.name || 
         speciality.specialite?.name || 
         speciality.name || 
         'Spécialité inconnue'
}

function getSpecialityDescription(speciality) {
  // Essayer différentes propriétés possibles
  return speciality.specialty?.description || 
         speciality.specialite?.description || 
         speciality.description || 
         ''
}

// Initialisation ultra-simple
onMounted(async () => {
  console.log('🚀 Initialisation UserProfile - Version Simple')
  console.log('👤 Utilisateur:', userData.value?.name)
  
  // Charger les spécialités utilisateur si c'est un vétérinaire
  if (!isUserClient.value) {
    try {
      await loadUserSpecialities()
      console.log('✅ Spécialités utilisateur chargées:', userSpecialities.value?.length || 0)
    } catch (error) {
      console.error('❌ Erreur chargement spécialités:', error)
    }
  }
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

/* Styles pour les cartes de spécialités */
.speciality-card {
  transition: all 0.2s ease;
}

.speciality-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Styles pour les badges de certification */
.certification-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Animation pour le chargement */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
