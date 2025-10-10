<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Gestion des Annonces</h2>
          <p class="text-gray-600">Administration complète des annonces d'animaux perdus/trouvés</p>
        </div>
        <div class="flex gap-3">
          <button @click="refreshData" :disabled="isLoading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
            <span v-if="isLoading">🔄</span>
            <span v-else>🔄</span>
            {{ isLoading ? 'Chargement...' : 'Actualiser' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Statistiques globales -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total</p>
            <p class="text-2xl font-semibold text-gray-900">{{ totalAnnouncements }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">En attente</p>
            <p class="text-2xl font-semibold text-gray-900">{{ pendingCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Approuvées</p>
            <p class="text-2xl font-semibold text-gray-900">{{ approvedCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Rejetées</p>
            <p class="text-2xl font-semibold text-gray-900">{{ rejectedCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Résolues</p>
            <p class="text-2xl font-semibold text-gray-900">{{ resolvedCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
          <input type="text" v-model="filters.search" @input="debouncedSearch" placeholder="Nom, description..." 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
          <select v-model="filters.status" @change="applyFilters" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvées</option>
            <option value="rejected">Rejetées</option>
            <option value="resolved">Résolues</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select v-model="filters.type" @change="applyFilters" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">Tous les types</option>
            <option value="lost">Animaux perdus</option>
            <option value="found">Animaux trouvés</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Animal</label>
          <select v-model="filters.animal_type" @change="applyFilters" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">Tous les animaux</option>
            <option value="chien">Chien</option>
            <option value="chat">Chat</option>
            <option value="oiseau">Oiseau</option>
            <option value="lapin">Lapin</option>
            <option value="autre">Autre</option>
          </select>
        </div>
      </div>
      
      <div class="flex justify-between items-center mt-4">
        <div class="text-sm text-gray-600">
          {{ announcements.length }} annonce(s) trouvée(s)
          <span v-if="pagination.total > 0">
            ({{ pagination.from }}-{{ pagination.to }} sur {{ pagination.total }})
          </span>
        </div>
        
        <button @click="clearFilters" 
          class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
          🗑️ Effacer les filtres
        </button>
      </div>
    </div>

    <!-- Liste des annonces -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Annonces</h3>
      </div>
      
      <!-- Loading state -->
      <div v-if="isLoading" class="p-6 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Chargement des annonces...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="p-6 text-center">
        <div class="text-red-500 text-lg mb-2">❌</div>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="refreshData" 
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Réessayer
        </button>
      </div>
      
      <!-- Liste des annonces -->
      <div v-else-if="announcements.length > 0" class="divide-y divide-gray-200">
        <div v-for="announcement in announcements" :key="announcement.id" 
          class="p-6 hover:bg-gray-50 transition-colors">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <!-- En-tête de l'annonce -->
              <div class="flex items-center gap-3 mb-3">
                <span :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  announcement.type === 'lost'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                ]">
                  {{ announcement.type === 'lost' ? '❌ PERDU' : '✅ TROUVÉ' }}
                </span>
                
                <span :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  getStatusClass(announcement.status)
                ]">
                  {{ getStatusLabel(announcement.status) }}
                </span>
                
                <span class="text-sm text-gray-500">
                  ID: #{{ announcement.id }}
                </span>
                
                <span class="text-sm text-gray-500">
                  {{ formatDate(announcement.created_at) }}
                </span>
              </div>
              
              <!-- Informations principales -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-1">{{ announcement.name }}</h4>
                  <p class="text-gray-700 text-sm mb-2">{{ announcement.description }}</p>
                  
                  <div class="flex items-center gap-4 text-sm text-gray-600">
                    <span>🐕 {{ announcement.animal_type }}</span>
                    <span>📍 {{ announcement.location }}</span>
                  </div>
                </div>
                
                <div>
                  <div class="text-sm text-gray-600 space-y-1">
                    <div><strong>Contact:</strong> {{ announcement.contact_name }}</div>
                    <div><strong>Téléphone:</strong> {{ announcement.contact_phone }}</div>
                    <div><strong>Email:</strong> {{ announcement.contact_email }}</div>
                    <div v-if="announcement.reward">
                      <strong class="text-yellow-600">💰 Récompense:</strong> {{ announcement.reward }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Photos -->
              <div class="mb-4">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-sm font-medium text-gray-700">📸 Photos:</span>
                  <span v-if="announcement.photos && announcement.photos.length > 0" 
                    class="text-xs text-gray-500">
                    ({{ announcement.photos.length }} photo{{ announcement.photos.length > 1 ? 's' : '' }})
                  </span>
                </div>
                
                <div class="flex items-center gap-3">
                  <!-- Cas 1: Aucune photo - Image par défaut -->
                  <div v-if="!announcement.photos || announcement.photos.length === 0" 
                    class="relative w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <div class="absolute -bottom-1 -right-1 bg-gray-300 text-gray-600 text-xs px-1 rounded">
                      Aucune
                    </div>
                  </div>
                  
                  <!-- Cas 2: 1-3 photos - Affichage direct -->
                  <template v-else-if="announcement.photos.length <= 3">
                    <div v-for="(photo, index) in announcement.photos" :key="photo.id"
                      class="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                      @click="openPhotoModal(announcement.photos, index)">
                      <img :src="photo.photo_url" :alt="`Photo ${index + 1} de ${announcement.name}`"
                        class="w-full h-full object-cover" 
                        @error="handleImageError($event)" />
                      <div v-if="photo.is_primary" 
                        class="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                        ⭐
                      </div>
                    </div>
                  </template>
                  
                  <!-- Cas 3: 4+ photos - Affichage avec compteur -->
                  <template v-else>
                    <!-- Première photo -->
                    <div class="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                      @click="openPhotoModal(announcement.photos, 0)">
                      <img :src="announcement.photos[0].photo_url" :alt="`Photo 1 de ${announcement.name}`"
                        class="w-full h-full object-cover" 
                        @error="handleImageError($event)" />
                      <div v-if="announcement.photos[0].is_primary" 
                        class="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                        ⭐
                      </div>
                    </div>
                    
                    <!-- Deuxième photo -->
                    <div class="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                      @click="openPhotoModal(announcement.photos, 1)">
                      <img :src="announcement.photos[1].photo_url" :alt="`Photo 2 de ${announcement.name}`"
                        class="w-full h-full object-cover" 
                        @error="handleImageError($event)" />
                      <div v-if="announcement.photos[1].is_primary" 
                        class="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                        ⭐
                      </div>
                    </div>
                    
                    <!-- Compteur pour les photos restantes -->
                    <div class="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                      @click="openPhotoModal(announcement.photos, 2)">
                      <img :src="announcement.photos[2].photo_url" :alt="`Photo 3 de ${announcement.name}`"
                        class="w-full h-full object-cover opacity-60" 
                        @error="handleImageError($event)" />
                      <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span class="text-white font-bold text-sm">+{{ announcement.photos.length - 2 }}</span>
                      </div>
                    </div>
                  </template>
                  
                  <!-- Bouton voir toutes les photos (si plus de 1 photo) -->
                  <button v-if="announcement.photos && announcement.photos.length > 1"
                    @click="openPhotoModal(announcement.photos, 0)"
                    class="px-3 py-1 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-300 rounded transition-colors">
                    Voir tout
                  </button>
                </div>
              </div>
              
              <!-- Informations supplémentaires -->
              <div class="flex items-center gap-4 text-xs text-gray-500">
                <span>Diffusion: {{ announcement.authorize_diffusion ? '✅ Autorisée' : '❌ Non autorisée' }}</span>
                <span v-if="announcement.updated_at !== announcement.created_at">
                  Modifié: {{ formatDate(announcement.updated_at) }}
                </span>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex flex-col gap-2 ml-4">
              <!-- Actions selon le statut -->
              <div v-if="announcement.status === 'pending'" class="flex gap-2">
                <button @click="approveAnnouncement(announcement)" 
                  class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                  ✅ Approuver
                </button>
                <button @click="rejectAnnouncement(announcement)" 
                  class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                  ❌ Rejeter
                </button>
              </div>
              
              <div v-else class="flex gap-2">
                <button @click="viewDetails(announcement)" 
                  class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                  👁️ Détails
                </button>
                
                <button v-if="announcement.status === 'approved'" @click="markAsResolved(announcement)" 
                  class="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors">
                  🎉 Résoudre
                </button>
                
                <button v-if="announcement.status === 'rejected'" @click="approveAnnouncement(announcement)" 
                  class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                  ↩️ Approuver
                </button>
              </div>
              
              <!-- Actions supplémentaires -->
              <div class="flex gap-2">
                <button @click="editAnnouncement(announcement)" 
                  class="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors">
                  ✏️ Modifier
                </button>
                <button @click="deleteAnnouncement(announcement)" 
                  class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- État vide -->
      <div v-else class="text-center py-12">
        <div class="text-gray-400 text-lg mb-2">📋</div>
        <p class="text-gray-500">Aucune annonce trouvée</p>
        <p class="text-sm text-gray-400 mt-2">Essayez de modifier vos filtres</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Page {{ pagination.current_page }} sur {{ pagination.last_page }}
        </div>
        
        <div class="flex gap-2">
          <button @click="goToPage(pagination.current_page - 1)" 
            :disabled="pagination.current_page <= 1"
            class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            ← Précédent
          </button>
          
          <button v-for="page in getVisiblePages()" :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-1 border rounded',
              page === pagination.current_page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            ]">
            {{ page }}
          </button>
          
          <button @click="goToPage(pagination.current_page + 1)" 
            :disabled="pagination.current_page >= pagination.last_page"
            class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Suivant →
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de détails -->
    <div v-if="selectedAnnouncement" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-semibold text-gray-900">Détails de l'annonce #{{ selectedAnnouncement.id }}</h3>
          <button @click="selectedAnnouncement = null" class="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- Contenu du modal avec tous les détails -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Type</label>
              <p class="text-gray-900">{{ selectedAnnouncement.type === 'lost' ? 'Animal perdu' : 'Animal trouvé' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Statut</label>
              <span :class="['inline-block px-2 py-1 rounded text-sm', getStatusClass(selectedAnnouncement.status)]">
                {{ getStatusLabel(selectedAnnouncement.status) }}
              </span>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Nom/Description</label>
            <p class="text-gray-900">{{ selectedAnnouncement.name }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Description détaillée</label>
            <p class="text-gray-900">{{ selectedAnnouncement.description }}</p>
          </div>
          
          <!-- Plus de détails... -->
        </div>
      </div>
    </div>
  </div>

  <!-- Modal pour afficher les photos -->
  <div v-if="photoModal.isOpen" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" @click="closePhotoModal">
    <div class="relative max-w-4xl max-h-full p-4" @click.stop>
      <!-- Bouton fermer -->
      <button @click="closePhotoModal" 
        class="absolute top-2 right-2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      
      <!-- Navigation -->
      <button v-if="photoModal.photos.length > 1" @click="previousPhoto"
        class="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <button v-if="photoModal.photos.length > 1" @click="nextPhoto"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      
      <!-- Image principale -->
      <div class="bg-white rounded-lg overflow-hidden shadow-2xl">
        <img :src="photoModal.photos[photoModal.currentIndex]?.photo_url" 
          :alt="`Photo ${photoModal.currentIndex + 1}`"
          class="max-w-full max-h-[80vh] object-contain mx-auto" 
          @error="handleImageError($event)" />
        
        <!-- Informations de la photo -->
        <div class="p-4 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-700">
                Photo {{ photoModal.currentIndex + 1 }} sur {{ photoModal.photos.length }}
              </span>
              <span v-if="photoModal.photos[photoModal.currentIndex]?.is_primary" 
                class="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                ⭐ Photo principale
              </span>
            </div>
            
            <!-- Miniatures -->
            <div v-if="photoModal.photos.length > 1" class="flex gap-1">
              <button v-for="(photo, index) in photoModal.photos" :key="photo.id"
                @click="photoModal.currentIndex = index"
                :class="[
                  'w-8 h-8 rounded overflow-hidden border-2 transition-colors',
                  index === photoModal.currentIndex 
                    ? 'border-blue-500' 
                    : 'border-gray-300 hover:border-gray-400'
                ]">
                <img :src="photo.photo_url" :alt="`Miniature ${index + 1}`"
                  class="w-full h-full object-cover" 
                  @error="handleImageError($event)" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useLostAnimalsQuery } from '@/services/lostAnimals/lostAnimalsQueries.js'
import { lostAnimalsService } from '@/services/lostAnimals/lostAnimalsService.js'

// État réactif
const announcements = ref([])
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0
})
const isLoading = ref(false)
const error = ref(null)
const selectedAnnouncement = ref(null)

// État pour le modal photo
const photoModal = ref({
  isOpen: false,
  photos: [],
  currentIndex: 0
})

// Filtres
const filters = ref({
  search: '',
  status: '',
  type: '',
  animal_type: '',
  page: 1
})

// Statistiques calculées
const totalAnnouncements = computed(() => pagination.value.total || announcements.value.length)
const pendingCount = computed(() => announcements.value.filter(a => a.status === 'pending').length)
const approvedCount = computed(() => announcements.value.filter(a => a.status === 'approved').length)
const rejectedCount = computed(() => announcements.value.filter(a => a.status === 'rejected').length)
const resolvedCount = computed(() => announcements.value.filter(a => a.status === 'resolved').length)

// Debounce pour la recherche
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

// Méthodes
const fetchAnnouncements = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const result = await lostAnimalsService.getLostAnimals({
      ...filters.value,
      page: filters.value.page,
      per_page: 15
    })
    
    if (result.success) {
      announcements.value = result.data
      pagination.value = result.pagination
    } else {
      error.value = result.error || 'Erreur lors du chargement des annonces'
    }
  } catch (err) {
    error.value = err.message || 'Erreur lors du chargement des annonces'
    console.error('Erreur fetch annonces:', err)
  } finally {
    isLoading.value = false
  }
}

const refreshData = () => {
  fetchAnnouncements()
}

const applyFilters = () => {
  filters.value.page = 1 // Reset à la page 1 lors du filtrage
  fetchAnnouncements()
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: '',
    type: '',
    animal_type: '',
    page: 1
  }
  fetchAnnouncements()
}

const goToPage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    filters.value.page = page
    fetchAnnouncements()
  }
}

const getVisiblePages = () => {
  const current = pagination.value.current_page
  const total = pagination.value.last_page
  const pages = []
  
  // Afficher 5 pages max autour de la page courante
  const start = Math.max(1, current - 2)
  const end = Math.min(total, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
}

// Actions sur les annonces
const approveAnnouncement = async (announcement) => {
  // Sauvegarder l'état original pour rollback si erreur
  const originalStatus = announcement.status
  
  try {
    console.log('🟢 Approbation annonce:', announcement.id)
    
    // ✅ OPTIMISTIC UPDATE - Mise à jour immédiate de l'interface
    announcement.status = 'approved'
    
    // Appel API en arrière-plan
    const response = await lostAnimalsService.approveLostAnimal(announcement.id)
    
    if (response.success) {
      console.log('✅ Annonce approuvée avec succès:', response.message)
      // L'interface est déjà mise à jour, pas besoin de refreshData()
    } else {
      // Rollback en cas d'erreur API
      announcement.status = originalStatus
      console.error('❌ Erreur approbation:', response.error)
      alert('Erreur lors de l\'approbation: ' + response.error)
    }
  } catch (error) {
    // Rollback en cas d'erreur
    announcement.status = originalStatus
    console.error('❌ Erreur approbation:', error)
    alert('Erreur lors de l\'approbation: ' + (error.message || 'Erreur inconnue'))
  }
}

const rejectAnnouncement = async (announcement) => {
  if (confirm(`Êtes-vous sûr de vouloir rejeter l'annonce "${announcement.name}" ?`)) {
    // Sauvegarder l'état original pour rollback si erreur
    const originalStatus = announcement.status
    
    try {
      console.log('🔴 Rejet annonce:', announcement.id)
      
      // ✅ OPTIMISTIC UPDATE - Mise à jour immédiate de l'interface
      announcement.status = 'rejected'
      
      // Appel API en arrière-plan
      const response = await lostAnimalsService.rejectLostAnimal(announcement.id, {
        reason: 'Rejetée par l\'administrateur'
      })
      
      if (response.success) {
        console.log('✅ Annonce rejetée avec succès:', response.message)
        // L'interface est déjà mise à jour, pas besoin de refreshData()
      } else {
        // Rollback en cas d'erreur API
        announcement.status = originalStatus
        console.error('❌ Erreur rejet:', response.error)
        alert('Erreur lors du rejet: ' + response.error)
      }
    } catch (error) {
      // Rollback en cas d'erreur
      announcement.status = originalStatus
      console.error('❌ Erreur rejet:', error)
      alert('Erreur lors du rejet: ' + (error.message || 'Erreur inconnue'))
    }
  }
}

const markAsResolved = async (announcement) => {
  if (confirm(`Marquer l'annonce "${announcement.name}" comme résolue ?`)) {
    // Sauvegarder l'état original pour rollback si erreur
    const originalStatus = announcement.status
    
    try {
      console.log('🎉 Résolution annonce:', announcement.id)
      
      // ✅ OPTIMISTIC UPDATE - Mise à jour immédiate de l'interface
      announcement.status = 'resolved'
      
      // Appel API en arrière-plan
      const response = await lostAnimalsService.resolveLostAnimal(announcement.id)
      
      if (response.success) {
        console.log('✅ Annonce résolue avec succès:', response.message)
        // L'interface est déjà mise à jour, pas besoin de refreshData()
      } else {
        // Rollback en cas d'erreur API
        announcement.status = originalStatus
        console.error('❌ Erreur résolution:', response.error)
        alert('Erreur lors de la résolution: ' + response.error)
      }
    } catch (error) {
      // Rollback en cas d'erreur
      announcement.status = originalStatus
      console.error('❌ Erreur résolution:', error)
      alert('Erreur lors de la résolution: ' + (error.message || 'Erreur inconnue'))
    }
  }
}

const viewDetails = (announcement) => {
  selectedAnnouncement.value = announcement
}

const editAnnouncement = (announcement) => {
  // TODO: Ouvrir modal d'édition
  console.log('Modifier annonce:', announcement.id)
}

const deleteAnnouncement = async (announcement) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'annonce "${announcement.name}" ?\n\nCette action est irréversible.`)) {
    try {
      console.log('🗑️ Suppression annonce:', announcement.id)
      
      // ✅ OPTIMISTIC UPDATE - Suppression immédiate de l'interface
      const announcementIndex = announcements.value.findIndex(a => a.id === announcement.id)
      if (announcementIndex !== -1) {
        announcements.value.splice(announcementIndex, 1)
      }
      
      // Appel API en arrière-plan
      const response = await lostAnimalsService.deleteLostAnimal(announcement.id)
      
      if (response.success) {
        console.log('✅ Annonce supprimée avec succès:', response.message)
        // L'interface est déjà mise à jour, pas besoin de refreshData()
      } else {
        // Rollback en cas d'erreur API - remettre l'annonce dans la liste
        if (announcementIndex !== -1) {
          announcements.value.splice(announcementIndex, 0, announcement)
        }
        console.error('❌ Erreur suppression:', response.error)
        alert('Erreur lors de la suppression: ' + response.error)
      }
    } catch (error) {
      // Rollback en cas d'erreur - remettre l'annonce dans la liste
      const announcementIndex = announcements.value.findIndex(a => a.id === announcement.id)
      if (announcementIndex === -1) {
        announcements.value.push(announcement)
      }
      console.error('❌ Erreur suppression:', error)
      alert('Erreur lors de la suppression: ' + (error.message || 'Erreur inconnue'))
    }
  }
}

// Utilitaires
const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    resolved: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    approved: 'Approuvée',
    rejected: 'Rejetée',
    resolved: 'Résolue'
  }
  return labels[status] || status
}

// Fonctions pour le modal photo
const openPhotoModal = (photos, startIndex = 0) => {
  photoModal.value = {
    isOpen: true,
    photos: photos || [],
    currentIndex: startIndex
  }
  console.log('📸 Ouverture modal photo:', photos.length, 'photos, index:', startIndex)
}

const closePhotoModal = () => {
  photoModal.value = {
    isOpen: false,
    photos: [],
    currentIndex: 0
  }
}

const nextPhoto = () => {
  if (photoModal.value.currentIndex < photoModal.value.photos.length - 1) {
    photoModal.value.currentIndex++
  } else {
    photoModal.value.currentIndex = 0 // Boucle vers la première photo
  }
}

const previousPhoto = () => {
  if (photoModal.value.currentIndex > 0) {
    photoModal.value.currentIndex--
  } else {
    photoModal.value.currentIndex = photoModal.value.photos.length - 1 // Boucle vers la dernière photo
  }
}

const handleImageError = (event) => {
  console.error('❌ Erreur chargement image:', event.target.src)
  // Remplacer par une image par défaut
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZMNC41ODYgMTUuNDE0QTIgMiAwIDAgMSA3LjQxNCAxNS40MTRMOSA5TDE2IDE2TTEwIDEwSDEwLjAxTTYgMjBIMThBMiAyIDAgMCAwIDIwIDE4VjZBMiAyIDAgMCAwIDE4IDRINkEyIDIgMCAwIDAgNCA2VjE4QTIgMiAwIDAgMCA2IDIwWiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  fetchAnnouncements()
})
</script>
