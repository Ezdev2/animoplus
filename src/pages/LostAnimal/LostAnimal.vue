<template>
  <section class="border border-neutral-200 rounded-[10px] p-8 flex flex-col gap-8">
    <div>
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Communauté Animaux Perdus</h1>
          <p class="text-gray-600">
            Aidez-nous à retrouver nos compagnons perdus et à réunir les familles
          </p>
        </div>
        <div class="flex gap-3">
          <button @click="showMyAnnouncements = true"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 font-medium transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Mes annonces
          </button>
          <button @click="showAddPost = true"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 font-medium transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Créer une annonce
          </button>
        </div>
      </div>
    </div>

    <hr />

    <div class="grid md:grid-cols-2 gap-4">
      <div class="bg-green-50 rounded-lg p-6 flex flex-col items-start shadow-sm">
        <h2 class="text-lg font-bold text-green-800 mb-2">
          J'ai vu un animal errant
        </h2>
        <p class="text-green-700 mb-4">
          Aidez d'autres utilisateurs en signalant un animal que vous avez trouvé.
        </p>
        <button @click="showAddPost = true"
          class="mt-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors">
          Signaler un animal trouvé
        </button>
      </div>

      <div class="bg-yellow-50 rounded-lg p-6 flex flex-col items-start shadow-sm">
        <h2 class="text-lg font-bold text-yellow-800 mb-2">
          Et après... Si vous avez perdu votre animal, voici quelques étapes importantes.
        </h2>
        <p class="text-yellow-700 ">
          🟡​ Déposez plainte s'il y a une suspicion de vol et partagez l'annonce sur vos réseaux sociaux personnels
          (Facebook, Instagram, etc.).
        </p>
        <a href="https://www.i-cad.fr/articles/animal_perdu" target="_blank"
          class="mt-auto text-yellow-600 hover:text-yellow-700 font-medium">
          🟡​ Déclarer la perte à l'I-CAD <span class="underline">(Cliquez ici)</span>
        </a>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex flex-wrap gap-2">
          <button @click="filters.type = 'all'" :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            filters.type === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]">
            Tous
          </button>
          <button @click="filters.type = 'lost'" :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            filters.type === 'lost'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]">
            Animaux perdus
          </button>
          <button @click="filters.type = 'found'" :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            filters.type === 'found'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]">
            Animaux trouvés
          </button>
        </div>

        <div class="relative flex-1 min-w-64">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          <input type="text" placeholder="Filtrer par adresse..." v-model="filters.address"
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full" />
        </div>

        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-700">Rayon:</span>
          <div class="flex items-center gap-2">
            <input type="range" min="2" max="20" v-model="filters.radius" class="w-24" />
            <span class="text-sm font-medium text-gray-700 min-w-12">
              {{ filters.radius }} km
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoadingAnimals" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Chargement des annonces...</p>
      </div>
    </div>

    <!-- Message si aucune annonce -->
    <div v-else-if="filteredPosts.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">🐾</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucune annonce trouvée</h3>
      <p class="text-gray-600 mb-4">
        {{ filters.type === 'all' ? 'Aucune annonce disponible pour le moment.' : 
           filters.type === 'lost' ? 'Aucun animal perdu signalé.' : 
           'Aucun animal trouvé signalé.' }}
      </p>
      <button @click="showAddPost = true" 
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
        + Créer la première annonce
      </button>
    </div>

    <!-- Liste des annonces -->
    <div v-else class="space-y-4">
      <!-- En-tête avec compteur -->
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ filteredPosts.length }} annonce{{ filteredPosts.length > 1 ? 's' : '' }} 
          {{ filters.type === 'all' ? '' : filters.type === 'lost' ? 'd\'animaux perdus' : 'd\'animaux trouvés' }}
        </h3>
        <button @click="refreshAnimals" :disabled="isLoadingAnimals"
          class="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50">
          🔄 Actualiser
        </button>
      </div>
      <div v-for="post in filteredPosts" :key="post.id" class="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                post.type === 'lost'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              ]">
                {{ post.type === 'lost' ? '❌ PERDU' : '✅ TROUVÉ' }}
              </div>
              <div class="text-2xl">
                {{ getAnimalIcon(post.animal_type) }}
              </div>
              <div>
                <h3 class="font-bold text-lg">{{ post.name }}</h3>
                <p class="text-gray-600 text-sm">{{ post.animal_type }}</p>
              </div>
            </div>
            <div class="text-right text-sm text-gray-500">
              <div class="flex items-center gap-1">
                <span>📅</span>
                {{ formatDate(post.created_at) }}
              </div>
              <div class="flex items-center gap-1 mt-1" v-if="post.reward">
                <span>💰</span>
                {{ post.reward }}
              </div>
            </div>
          </div>

          <p class="text-gray-700 mb-4">{{ post.description }}</p>

          <div class="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div class="flex items-center gap-1">
              <span>📍</span>
              {{ post.location }}
            </div>
          </div>

          <div v-if="post.reward" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div class="flex items-center gap-2">
              <span class="text-yellow-600">💰</span>
              <span class="font-medium text-yellow-800">
                Récompense: {{ post.reward }}
              </span>
            </div>
          </div>
          <hr>
          <div class="pt-4">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-gray-900">Contact</h4>
              <div class="flex gap-2">
                <button @click="callContact(post.contact_phone)"
                  class="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <span>📞</span>
                  {{ post.contact_phone }}
                </button>
                <button @click="emailContact(post.contact_email)"
                  class="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <span>✉️</span>
                  Email
                </button>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-4">
              Contact: {{ post.contact_name }}
            </p>
          </div>
          <hr>
          <div class="pt-4 flex justify-between items-center">
            <div class="flex gap-2">
              <button @click="sharePost(post)"
                class="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                <span class="mr-2">📲</span>Partager
              </button>
              <button @click="markAsFound(post)"
                class="bg-green-50 text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-100 transition-colors">
                <span class="mr-2">🎉</span>J'ai retrouvé l'animal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAddPost" class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="showAddPost = false">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto" @click.stop>
        <div class="p-6 border-b">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold">Créer une annonce</h2>
            <button @click="showAddPost = false" class="text-gray-500 hover:text-gray-700 text-2xl">
              ×
            </button>
          </div>
        </div>

        <form @submit.prevent="handleAddPost" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Type d'annonce
            </label>
            <div class="flex gap-4">
              <label class="flex items-center cursor-pointer">
                <input type="radio" name="postType" value="lost" v-model="newPost.type" class="mr-2" />
                <span class="text-red-600 font-medium">❌ J'ai perdu un animal</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input type="radio" name="postType" value="found" v-model="newPost.type" class="mr-2" />
                <span class="text-green-600 font-medium">✅ J'ai trouvé un animal</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Type d'animal
            </label>
            <select v-model="newPost.animalType"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
              <option v-for="type in animalTypes" :key="type.value" :value="type.value">
                {{ type.icon }} {{ type.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ newPost.type === 'lost' ? 'Nom de l\'animal' : 'Description courte' }}
            </label>
            <input type="text" v-model="newPost.name"
              :placeholder="newPost.type === 'lost' ? 'Max, Minou...' : 'Chat tigré, Chien berger...'"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Lieu {{ newPost.type === 'lost' ? 'de disparition' : 'de découverte' }}
            </label>
            <input type="text" v-model="newPost.location" placeholder="Adresse, quartier, repères..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Photo (obligatoire)
            </label>
            <input type="file" @change="handleFileChange" class="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description détaillée (signes distinctifs, collier...)
            </label>
            <textarea v-model="newPost.description" rows="4"
              placeholder="Description physique, comportement, signes distinctifs..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Informations supplémentaires (optionnel)
            </label>
            <textarea v-model="newPost.additionalInfo" rows="2" placeholder="Nom du vétérinaire, puce, maladie, etc."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <!-- ✅ SUPPRIMÉ : Champs de contact - Auto-remplis par le backend depuis l'utilisateur connecté -->

          <div v-if="newPost.type === 'lost'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Récompense (optionnel)
            </label>
            <input type="text" v-model="newPost.reward" placeholder="100€, Gratification, etc."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" id="diffuse-annonce" v-model="newPost.authorizeDiffusion" class="rounded" />
            <label for="diffuse-annonce" class="text-sm text-gray-700">
              J’autorise Animo+ à diffuser cette annonce à ses utilisateurs
            </label>
          </div>

          <div class="flex justify-end gap-4 pt-4 border-t">
            <button type="button" @click="showAddPost = false"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button type="submit" :disabled="isCreatingAnimal"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="isCreatingAnimal" class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création en cours...
              </span>
              <span v-else>Publier l'annonce</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Mes Annonces -->
    <div v-if="showMyAnnouncements" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col">
        <!-- En-tête du modal -->
        <div class="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h2 class="text-xl font-bold text-gray-900">Mes Annonces</h2>
          </div>
          <button @click="showMyAnnouncements = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Contenu du modal -->
        <div class="flex-1 p-4 sm:p-6 overflow-y-auto">
          <!-- Filtres rapides -->
          <div class="flex flex-wrap gap-2 mb-6">
            <button @click="loadMyAnnouncements()" 
              class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
              📋 Toutes
            </button>
            <button @click="loadMyAnnouncements({ status: 'pending' })" 
              class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium hover:bg-yellow-200 transition-colors">
              ⏳ En attente
            </button>
            <button @click="loadMyAnnouncements({ status: 'approved' })" 
              class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition-colors">
              ✅ Approuvées
            </button>
            <button @click="loadMyAnnouncements({ status: 'rejected' })" 
              class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium hover:bg-red-200 transition-colors">
              ❌ Refusées
            </button>
            <button @click="loadMyAnnouncements({ type: 'lost' })" 
              class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors">
              🔍 Perdus
            </button>
            <button @click="loadMyAnnouncements({ type: 'found' })" 
              class="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium hover:bg-teal-200 transition-colors">
              📍 Trouvés
            </button>
          </div>

          <!-- État de chargement -->
          <div v-if="isLoadingMyAnnouncements" class="flex justify-center items-center py-12">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p class="text-gray-600">Chargement de vos annonces...</p>
            </div>
          </div>

          <!-- Aucune annonce -->
          <div v-else-if="myAnnouncements.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune annonce</h3>
            <p class="text-gray-600 mb-4">Vous n'avez pas encore créé d'annonce.</p>
            <button @click="showMyAnnouncements = false; showAddPost = true" 
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Créer ma première annonce
            </button>
          </div>

          <!-- Liste des annonces -->
          <div v-else class="space-y-4">
            <div v-for="announcement in myAnnouncements" :key="announcement.id" 
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              
              <!-- En-tête de l'annonce -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
                    :class="announcement.type === 'lost' ? 'bg-red-500' : 'bg-green-500'">
                    {{ announcement.type === 'lost' ? '🔍' : '📍' }}
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ announcement.name }}</h3>
                    <p class="text-sm text-gray-600">{{ announcement.animal_type }} • {{ announcement.location }}</p>
                  </div>
                </div>
                
                <!-- Statut de l'annonce -->
                <div class="flex items-center gap-2">
                  <span v-if="announcement.status === 'approved'" 
                    class="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    ✅ Approuvée
                  </span>
                  <span v-else-if="announcement.status === 'pending'" 
                    class="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                    ⏳ En attente
                  </span>
                  <span v-else-if="announcement.status === 'rejected'" 
                    class="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                    ❌ Refusée
                  </span>
                  <span v-else 
                    class="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                    {{ announcement.status }}
                  </span>
                </div>
              </div>

              <!-- Description -->
              <p class="text-gray-700 text-sm mb-3 line-clamp-2">{{ announcement.description }}</p>

              <!-- Informations supplémentaires -->
              <div class="flex items-center justify-between text-sm text-gray-500">
                <div class="flex items-center gap-4">
                  <span>📅 {{ new Date(announcement.created_at).toLocaleDateString() }}</span>
                  <span v-if="announcement.reward">💰 {{ announcement.reward }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span>Contact: {{ announcement.contact_name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pied du modal -->
        <div class="flex-shrink-0 flex justify-between items-center p-4 border-t bg-gray-50">
          <div class="text-sm text-gray-600">
            Total: {{ myAnnouncements.length }} annonce(s)
          </div>
          <div class="flex gap-3">
            <button @click="loadMyAnnouncements()" :disabled="isLoadingMyAnnouncements"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50">
              🔄 Actualiser
            </button>
            <button @click="showMyAnnouncements = false"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import TitleDashboard from '@/components/common/TitleDashboard.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useLostAnimals } from '@/composables/useLostAnimals.js'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'

// Authentification
const { getCurrentUser } = useSimpleAuth()

// Composable Lost Animals
const { 
  loadApprovedAnimals, 
  loadMyAnimals,
  createAnimal,
  isLoading: isLoadingAnimals,
  isCreating: isCreatingAnimal,
  error: animalsError
} = useLostAnimals()

// Fonction pour rafraîchir les annonces approuvées
const refreshAnimals = async () => {
  try {
    console.log('🔄 Chargement des annonces approuvées...')
    
    const response = await loadApprovedAnimals({
      per_page: 20, // Charger 20 annonces par page
      type: filters.value.type !== 'all' ? filters.value.type : undefined
    })
    
    if (response.success) {
      posts.value = response.data || []
      console.log('✅ Annonces approuvées chargées:', posts.value.length)
    } else {
      console.error('❌ Erreur récupération annonces approuvées:', response.error)
      posts.value = [] // Vider la liste en cas d'erreur
    }
  } catch (error) {
    console.error('❌ Erreur rafraîchissement:', error)
    posts.value = [] // Vider la liste en cas d'erreur
  }
}

// Fonction pour charger mes annonces (toutes, peu importe le statut)
const loadMyAnnouncements = async (filters = {}) => {
  try {
    isLoadingMyAnnouncements.value = true
    console.log('🔄 Chargement de mes annonces...')
    
    // Utiliser la nouvelle fonction loadMyAnimals qui appelle /api/user/lost-animals
    const response = await loadMyAnimals({
      per_page: 50, // Charger toutes mes annonces
      ...filters // Permettre le filtrage par statut, type, etc.
    })
    
    if (response.success) {
      myAnnouncements.value = response.data || []
      console.log('✅ Mes annonces chargées:', myAnnouncements.value.length)
      console.log('📊 Détails pagination:', response.pagination)
    } else {
      console.error('❌ Erreur récupération mes annonces:', response.error)
      myAnnouncements.value = []
    }
  } catch (error) {
    console.error('❌ Erreur chargement mes annonces:', error)
    myAnnouncements.value = []
  } finally {
    isLoadingMyAnnouncements.value = false
  }
}

// États pour le formulaire
const isSubmitting = ref(false)
const submitError = ref('')

// State reactif
const posts = ref([])
const showAddPost = ref(false)
const showMyAnnouncements = ref(false)
const myAnnouncements = ref([])
const isLoadingMyAnnouncements = ref(false)
const newComment = ref('')

const filters = ref({
  type: 'all', // 'all', 'lost', 'found'
  address: '',
  radius: 5
})

const newPost = ref({
  type: 'lost',
  animalType: 'chien',
  name: '',
  description: '',
  location: '',
  // ✅ SUPPRIMÉ : contactName, contactPhone, contactEmail - Auto-remplis par le backend
  photo: null, // Champ pour la photo
  additionalInfo: '', // Champ pour les infos sup.
  reward: '',
  authorizeDiffusion: true // Case à cocher
})

// Types d'animaux
const animalTypes = [
  { value: 'chien', label: 'Chien', icon: '🐕' },
  { value: 'chat', label: 'Chat', icon: '🐱' },
  { value: 'oiseau', label: 'Oiseau', icon: '🐦' },
  { value: 'lapin', label: 'Lapin', icon: '🐰' },
  { value: 'autre', label: 'Autre', icon: '🐾' }
]

// Watcher pour recharger les données quand les filtres changent
watch(() => filters.value.type, async (newType) => {
  console.log('🔄 Filtre type changé:', newType)
  await refreshAnimals()
}, { immediate: false })

// Watcher pour charger les annonces quand le modal s'ouvre
watch(() => showMyAnnouncements.value, async (isOpen) => {
  if (isOpen) {
    console.log('📖 Ouverture modal mes annonces')
    await loadMyAnnouncements()
  }
})

// Computed properties
const filteredPosts = computed(() => {
  let filtered = posts.value || []

  // Filtre par adresse (le filtre par type est déjà appliqué côté API)
  if (filters.value.address.trim()) {
    filtered = filtered.filter(post =>
      post.location?.toLowerCase().includes(filters.value.address.toLowerCase())
    )
  }

  // Tri par date de création (le plus récent en premier)
  filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  return filtered
})

// Méthodes
const getAnimalIcon = (animalType) => {
  const animal = animalTypes.find(type => type.value === animalType)
  return animal ? animal.icon : '🐾'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Date inconnue'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const callContact = (phone) => {
  alert(`Appel vers ${phone}`)
  window.location.href = `tel:${phone}`
}

const emailContact = (email) => {
  alert(`Email vers ${email}`)
  window.location.href = `mailto:${email}`
}

const sharePost = (post) => {
  const message = `😢 Mon animal ${post.name ? post.name + ' ' : ''}(${post.animalType}) a disparu... Vue pour la dernière fois à ${post.location}, le ${formatDate(post.date)}.
Chaque partage compte, merci du fond du cœur ❤️
(Signalement fait sur Animo +)`

  if (navigator.share) {
    navigator.share({
      title: 'Alerte animal perdu',
      text: message,
    }).catch(error => console.log('Erreur de partage', error))
  } else {
    // Fallback pour les navigateurs non compatibles
    alert('Fonction de partage non prise en charge par votre navigateur. Copiez le message ci-dessous :\n\n' + message)
  }
}

const markAsFound = (post) => {
  const isConfirmed = confirm(`Avez-vous retrouvé ${post.name} ? L'annonce sera retirée.`)
  if (isConfirmed) {
    posts.value = posts.value.filter(p => p.id !== post.id)
    alert('Annonce retirée ! Le propriétaire sera notifié.')
    // Ici, vous enverriez une notification au propriétaire via une API
  }
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    newPost.value.photo = file
    console.log('Photo sélectionnée :', file.name)
  }
}

const handleAddPost = async () => {
  try {
    // Validation des données avant envoi
    if (!newPost.value.name?.trim()) {
      alert(' Le nom de l\'animal est requis')
      return
    }
    
    if (!newPost.value.description?.trim()) {
      alert(' La description est requise')
      return
    }
    
    if (!newPost.value.location?.trim()) {
      alert(' La localisation est requise')
      return
    }

    // Préparer les données pour l'API selon la documentation backend
    const animalData = {
      type: newPost.value.type, // 'lost' ou 'found'
      animal_type: newPost.value.animalType, // 'chien', 'chat', etc.
      name: newPost.value.name.trim(),
      description: newPost.value.description.trim(),
      additional_info: newPost.value.additionalInfo?.trim() || null,
      location: newPost.value.location.trim(),
      latitude: newPost.value.latitude || null,
      longitude: newPost.value.longitude || null,
      // 🔧 TEMPORAIRE : Envoyer champs avec valeurs par défaut pour éviter erreur validation backend
      contact_name: getCurrentUser.value?.name || 'Utilisateur AnimoPlus',
      contact_phone: getCurrentUser.value?.phone || '06 00 00 00 00',
      contact_email: getCurrentUser.value?.email || 'user@animoplus.com',
      reward: newPost.value.reward?.trim() || null,
      authorize_diffusion: newPost.value.authorizeDiffusion || false,
      photos: newPost.value.photos || [] // Support upload photos
    }

    console.log('🔍 Utilisateur connecté:', getCurrentUser.value)
    console.log('📞 Téléphone utilisateur:', getCurrentUser.value?.phone)
    console.log('📧 Email utilisateur:', getCurrentUser.value?.email)
    console.log('Création annonce avec données API:', animalData)

    // Utiliser le composable createAnimal
    const result = await createAnimal(animalData)

    if (result.success) {
      console.log('Annonce créée avec succès:', result.data)
      
      // Définir le label du type d'annonce
      const typeLabel = animalData.type === 'lost' ? 'Animal perdu' : 'Animal trouvé'
      
      // Afficher message de succès selon le type
      if (animalData.authorize_diffusion) {
        // Si diffusion autorisée, l'annonce sera modérée puis diffusée
        alert(`✅ Votre annonce "${animalData.name}" (${typeLabel}) a été soumise avec succès !\n\n🔍 Elle sera examinée par nos modérateurs avant diffusion.\n📧 Vous recevrez une notification une fois approuvée.`)
        
        // Log pour le système de notification (sera implémenté côté backend)
        console.log(`Notification programmée pour diffusion de l'annonce ${result.data.id}`)
      } else {
        // Si pas de diffusion, annonce visible uniquement localement
        alert(`✅ Votre annonce "${animalData.name}" (${typeLabel}) a été créée avec succès !\n\n👀 Elle est maintenant visible dans la liste des annonces.`)
      }

      // Fermer le modal et réinitialiser le formulaire
      showAddPost.value = false
      resetForm()
      
      // Recharger la liste pour afficher la nouvelle annonce
      await refreshAnimals()
      
    } else {
      console.error('Erreur création annonce:', result.error)
      alert(`Erreur lors de la création de l'annonce :\n${result.error}`)
    }
    
  } catch (error) {
    console.error('Erreur inattendue création annonce:', error)
    
    // Gestion d'erreurs spécifiques
    if (error.response?.status === 422) {
      // Erreurs de validation
      const validationErrors = error.response.data.errors
      if (validationErrors) {
        const errorMessages = Object.values(validationErrors).flat().join('\n')
        alert(`Erreurs de validation :\n${errorMessages}`)
      } else {
        alert('Données invalides. Veuillez vérifier le formulaire.')
      }
    } else if (error.response?.status === 401) {
      alert('Vous devez être connecté pour créer une annonce.')
    } else if (error.response?.status === 413) {
      alert('Les photos sont trop volumineuses. Veuillez réduire leur taille.')
    } else {
      alert(`❌ Erreur lors de la création de l'annonce :\n${error.message || 'Erreur inconnue'}`)
    }
  }
}

// Fonction pour réinitialiser le formulaire
const resetForm = () => {
  newPost.value = {
    type: 'lost',
    animalType: 'chien',
    name: '',
    description: '',
    location: '',
    // ✅ SUPPRIMÉ : contactName, contactPhone, contactEmail - Auto-remplis par le backend
    photo: null,
    additionalInfo: '',
    reward: '',
    authorizeDiffusion: true
  }
  console.log('📝 Formulaire réinitialisé')
}

// Initialisation
onMounted(async () => {
  console.log('🚀 Initialisation page Animaux Perdus')
  
  // Charger les annonces approuvées depuis l'API
  try {
    await refreshAnimals()
    console.log('✅ Page Animaux Perdus initialisée avec', posts.value.length, 'annonces approuvées')
  } catch (error) {
    console.error('❌ Erreur chargement initial des annonces:', error)
    posts.value = [] // Liste vide si erreur API
  }
})
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
.max-h-90vh {
  max-height: 90vh;
}

input[type="range"] {
  accent-color: #2563eb;
}

input[type="radio"],
input[type="checkbox"] {
  accent-color: #2563eb;
}

/* Animation pour les transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Focus styles */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.focus\:border-transparent:focus {
  border-color: transparent;
}

/* Responsive */
@media (max-width: 768px) {
  .min-w-64 {
    min-width: 100%;
  }

  .flex-wrap {
    flex-direction: column;
    align-items: stretch;
  }

  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>
