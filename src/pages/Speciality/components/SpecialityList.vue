<template>
    <section class="speciality-section">
        <h2 class="section-title">Liste des Spécialités</h2>

        <!-- Séparateur -->
        <hr class="h-px bg-[rgba(197,197,197,0.5)] my-4 border-none" />

        <!-- Filtre de recherche -->
        <div class="search-container mb-6">
            <input 
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher une spécialité..."
                class="search-input"
            />
            <div class="search-icon">🔍</div>
        </div>

        <!-- État de chargement -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#43A047]"></div>
            <span class="ml-3 text-gray-600">Chargement des spécialités...</span>
        </div>

        <!-- Liste des spécialités -->
        <div v-else-if="filteredSpecialities.length > 0" class="speciality-grid">
            <div v-for="item in filteredSpecialities" :key="item.id" class="speciality-card">
                <img :src="item.image" :alt="item.name" class="speciality-img" />
                <h3 class="speciality-title">{{ item.title }}</h3>
                <p class="speciality-description">{{ item.description }}</p>
                <button 
                  @click="viewVeterinarians(item)" 
                  class="speciality-btn"
                  :disabled="isLoadingVeterinarians"
                >
                  {{ isLoadingVeterinarians && selectedSpecialityId === item.id ? 'Chargement...' : 'Voir les professionnels' }}
                </button>
            </div>
        </div>

        <!-- Afficher plus de spécialités -->
        <div v-if="hasMoreSpecialities" class="text-center mt-6">
            <button @click="showMore" class="show-more-btn">
                Afficher plus de spécialités ({{ remainingCount }} restantes)
            </button>
        </div>

        <!-- Aucune spécialité -->
        <div v-else class="text-center py-8">
            <p class="text-gray-500">Aucune spécialité disponible</p>
        </div>

        <!-- Modal des vétérinaires -->
        <div 
          v-if="showVeterinariansModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          @click.self="closeVeterinariansModal"
        >
          <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <!-- En-tête modal -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 class="text-xl font-bold text-gray-900">
                  Vétérinaires spécialisés en {{ selectedSpeciality?.title }}
                </h3>
                <p class="text-gray-600 mt-1">
                  {{ veterinarians.length }} vétérinaire{{ veterinarians.length > 1 ? 's' : '' }} trouvé{{ veterinarians.length > 1 ? 's' : '' }}
                </p>
              </div>
              <button 
                @click="closeVeterinariansModal"
                class="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <!-- Contenu modal -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <!-- État de chargement -->
              <div v-if="isLoadingVeterinarians" class="flex items-center justify-center py-12">
                <div class="flex items-center gap-3">
                  <div class="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  <span class="text-gray-600">Chargement des vétérinaires...</span>
                </div>
              </div>

              <!-- Erreur -->
              <div v-else-if="veterinariansError" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-red-700 font-medium">Erreur de chargement</span>
                </div>
                <p class="text-red-600 mt-1">{{ veterinariansError }}</p>
              </div>

              <!-- Aucun vétérinaire -->
              <div v-else-if="veterinarians.length === 0" class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                <h4 class="text-lg font-medium text-gray-900 mb-2">Aucun vétérinaire trouvé</h4>
                <p class="text-gray-600">Aucun vétérinaire n'est spécialisé dans ce domaine pour le moment.</p>
              </div>

              <!-- Liste des vétérinaires -->
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="vet in veterinarians"
                  :key="vet.id"
                  class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <!-- Avatar et nom -->
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {{ getVetInitials(vet.name) }}
                    </div>
                    <div>
                      <h4 class="font-semibold text-gray-900">{{ vet.name }}</h4>
                      <p class="text-sm text-gray-600">{{ vet.email }}</p>
                    </div>
                  </div>

                  <!-- Informations -->
                  <div class="space-y-2 text-sm">
                    <div v-if="vet.clinic_name" class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                      <span class="text-gray-700">{{ vet.clinic_name }}</span>
                    </div>
                    
                    <div v-if="vet.phone" class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                      <span class="text-gray-700">{{ vet.phone }}</span>
                    </div>

                    <div v-if="vet.clinic_address" class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span class="text-gray-700">{{ vet.clinic_address }}</span>
                    </div>
                  </div>

                  <!-- Niveau de certification -->
                  <div v-if="vet.pivot?.certification_level" class="mt-3">
                    <span 
                      class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
                      :style="{ backgroundColor: getCertificationColor(vet.pivot.certification_level) }"
                    >
                      {{ getCertificationIcon(vet.pivot.certification_level) }} 
                      {{ getCertificationLabel(vet.pivot.certification_level) }}
                    </span>
                  </div>

                  <!-- Statut -->
                  <div class="flex items-center justify-between mt-3">
                    <div class="flex items-center gap-2">
                      <div 
                        class="w-2 h-2 rounded-full"
                        :class="vet.is_active ? 'bg-green-500' : 'bg-gray-400'"
                      ></div>
                      <span class="text-sm text-gray-600">
                        {{ vet.is_active ? 'Actif' : 'Inactif' }}
                      </span>
                    </div>
                    
                    <div v-if="vet.pivot?.is_primary" class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Spécialité principale
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useSpecialites } from '@/composables/useSpecialites.js'
import { specialiteService } from '@/services/specialites/specialiteService.js'
import chirurgienImg from '@/assets/images/chirurgien.svg'
import imagerieImg from '@/assets/images/imagerie.svg'
import dermatologueImg from '@/assets/images/dermatologue.svg'
import cardiologueImg from '@/assets/images/cardiologue.svg'
import ophtalmoImg from '@/assets/images/ophtalmo.svg'
import neurologueImg from '@/assets/images/neurologue.svg'

// Composable spécialités
const { 
  activeSpecialites, 
  isLoading, 
  loadActiveSpecialites
} = useSpecialites()

// État local pour la recherche et pagination
const searchQuery = ref('')
const displayLimit = ref(10)

// État pour la modal des vétérinaires
const showVeterinariansModal = ref(false)
const selectedSpeciality = ref(null)
const selectedSpecialityId = ref(null)
const veterinarians = ref([])
const isLoadingVeterinarians = ref(false)
const veterinariansError = ref(null)

// Mapping des images par nom de spécialité
const specialityImages = {
  'Chirurgie': chirurgienImg,
  'Imagerie': imagerieImg,
  'Dermatologie': dermatologueImg,
  'Cardiologie': cardiologueImg,
  'Ophtalmologie': ophtalmoImg,
  'Neurologie': neurologueImg,
  // Images par défaut pour les autres spécialités
  'Anesthésiologie': chirurgienImg,
  'Dentisterie': dermatologueImg,
  'Médecine d\'urgence': cardiologueImg,
  'Médecine générale': chirurgienImg,
  'Médecine interne': cardiologueImg,
  'Oncologie': dermatologueImg,
  'Orthopédie': chirurgienImg,
  'Radiologie': imagerieImg
}

// Spécialités formatées pour l'affichage (sans "Vétérinaire")
const specialities = computed(() => {
  if (!activeSpecialites.value || activeSpecialites.value.length === 0) {
    return []
  }
  
  return activeSpecialites.value.map(specialite => ({
    id: specialite.id,
    title: specialite.name, // CORRIGÉ : Enlever "Vétérinaire"
    description: specialite.description,
    image: specialityImages[specialite.name] || chirurgienImg, // Image par défaut
    name: specialite.name
  }))
})

// Spécialités filtrées par recherche
const filteredSpecialities = computed(() => {
  let filtered = specialities.value
  
  // Filtrer par recherche si query existe
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(specialite => 
      specialite.title.toLowerCase().includes(query) ||
      specialite.description.toLowerCase().includes(query)
    )
  }
  
  // Limiter l'affichage selon displayLimit
  return filtered.slice(0, displayLimit.value)
})

// Vérifier s'il y a plus de spécialités à afficher
const hasMoreSpecialities = computed(() => {
  let totalFiltered = specialities.value
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    totalFiltered = totalFiltered.filter(specialite => 
      specialite.title.toLowerCase().includes(query) ||
      specialite.description.toLowerCase().includes(query)
    )
  }
  
  return totalFiltered.length > displayLimit.value
})

// Nombre de spécialités restantes
const remainingCount = computed(() => {
  let totalFiltered = specialities.value
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    totalFiltered = totalFiltered.filter(specialite => 
      specialite.title.toLowerCase().includes(query) ||
      specialite.description.toLowerCase().includes(query)
    )
  }
  
  return Math.max(0, totalFiltered.length - displayLimit.value)
})

// Fonction pour afficher plus de spécialités
const showMore = () => {
  displayLimit.value += 10
}

// Fonctions pour les vétérinaires
const viewVeterinarians = async (speciality) => {
  selectedSpeciality.value = speciality
  selectedSpecialityId.value = speciality.id
  showVeterinariansModal.value = true
  
  // Charger les vétérinaires
  await loadVeterinarians(speciality.id)
}

const loadVeterinarians = async (specialityId) => {
  isLoadingVeterinarians.value = true
  veterinariansError.value = null
  veterinarians.value = []
  
  try {
    console.log('🔍 Chargement vétérinaires pour spécialité:', specialityId)
    
    const response = await specialiteService.getSpecialiteVeterinarians(specialityId, {
      active_only: true,
      per_page: 15,
      with_profile: true,
      with_user: true
    })
    
    if (response.success) {
      veterinarians.value = response.data || []
      console.log('✅ Vétérinaires chargés:', veterinarians.value.length)
    } else {
      veterinariansError.value = response.error || 'Erreur lors du chargement des vétérinaires'
    }
  } catch (error) {
    console.error('❌ Erreur chargement vétérinaires:', error)
    veterinariansError.value = error.message || 'Erreur lors du chargement des vétérinaires'
  } finally {
    isLoadingVeterinarians.value = false
  }
}

const closeVeterinariansModal = () => {
  showVeterinariansModal.value = false
  selectedSpeciality.value = null
  selectedSpecialityId.value = null
  veterinarians.value = []
  veterinariansError.value = null
}

// Fonctions utilitaires pour les vétérinaires
const getVetInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getCertificationLabel = (level) => {
  const labels = {
    'junior': 'Junior',
    'senior': 'Senior',
    'expert': 'Expert'
  }
  return labels[level] || level
}

const getCertificationIcon = (level) => {
  const icons = {
    'junior': '🌱',
    'senior': '🎯',
    'expert': '⭐'
  }
  return icons[level] || '📋'
}

const getCertificationColor = (level) => {
  const colors = {
    'junior': '#10B981',
    'senior': '#3B82F6',
    'expert': '#F59E0B'
  }
  return colors[level] || '#6B7280'
}

// Charger les spécialités au montage
onMounted(async () => {
  console.log('🚀 Chargement des spécialités pour SpecialityList')
  try {
    await loadActiveSpecialites()
    console.log('✅ Spécialités chargées:', activeSpecialites.value?.length || 0)
  } catch (error) {
    console.error('❌ Erreur chargement spécialités:', error)
  }
})
</script>

<style scoped>
.speciality-section {
  border: 1px solid var(--Neutral---200, #E5E7EB);
  border-radius: 14px;
  padding: 24px;
  background-color: #fff;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
}

.section-title {
  color: #2E2E30;
  font-family: "League Spartan";
  font-size: 20px;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 20px;
  font-family: sans-serif;
}

.speciality-card {
  border: 1px solid var(--Neutral---200, #E5E7EB);
  border-radius: 12px;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.05);
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 12px;
  flex: 1 0 0;
}

.speciality-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.speciality-img {
  width: 100%;
  height: 153px;
  object-fit: cover;
  border-radius: 8px;
  align-self: stretch;
}

.speciality-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  color: var(--Neutral---600, #4B5563);
  line-height: normal;
}

.speciality-description {
  font-size: 14px;
  color: var(--Neutral---600, #4B5563);
  text-align: center;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin: 0;
  flex-grow: 1;
}

.speciality-btn {
  background: var(--Primary---600, #43A047);
  color: white;
  border: none;
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  transition: background-color 0.2s ease;
}

.speciality-btn:hover {
  background: #388E3C;
}

.speciality-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Styles pour le filtre de recherche */
.search-container {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 45px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #43A047;
  box-shadow: 0 0 0 3px rgba(67, 160, 71, 0.1);
}

.search-input::placeholder {
  color: #9CA3AF;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6B7280;
  font-size: 16px;
}

/* Styles pour le bouton "Afficher plus" */
.show-more-btn {
  background: transparent;
  color: #43A047;
  border: 2px solid #43A047;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.show-more-btn:hover {
  background: #43A047;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .speciality-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .speciality-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .search-container {
    max-width: 100%;
  }
}

/* Animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>