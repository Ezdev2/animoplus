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

        <div class="flex gap-2 flex-1 min-w-64">
          <div class="relative flex-1">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input type="text" placeholder="Filtrer par adresse..." v-model="filters.address"
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full" />
          </div>
          <button 
            @click="getUserLocation"
            :disabled="userLocation.isLoading"
            class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 whitespace-nowrap"
          >
            <svg v-if="userLocation.isLoading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span v-if="userLocation.isLoading">...</span>
            <span v-else>📍</span>
          </button>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-sm font-medium text-gray-700">Rayon:</span>
          <div class="flex items-center gap-2">
            <input type="range" min="1" max="50000" v-model="filters.radius" class="w-32" />
            <span class="text-sm font-medium text-gray-700 min-w-20">
              {{ formatDistance(filters.radius) }}
            </span>
          </div>
          
          <!-- Valeurs rapides -->
          <div class="flex gap-1 flex-wrap">
            <button v-for="quickRadius in [5, 25, 100, 500, 2000, 10000]" :key="quickRadius"
              @click="filters.radius = quickRadius"
              :class="[
                'px-2 py-1 text-xs rounded border transition-colors',
                filters.radius == quickRadius
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              ]">
              {{ formatDistance(quickRadius) }}
            </button>
          </div>
          
          <!-- Indicateur de géolocalisation active -->
          <div v-if="userLocation.lat && userLocation.lng" 
            class="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>GPS actif</span>
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
        <div>
          <h3 class="text-lg font-semibold text-gray-900">
            {{ filteredPosts.length }} annonce{{ filteredPosts.length > 1 ? 's' : '' }} 
            {{ filters.type === 'all' ? '' : filters.type === 'lost' ? 'd\'animaux perdus' : 'd\'animaux trouvés' }}
          </h3>
          <!-- Indicateur de tri -->
          <div class="flex items-center gap-2 mt-1">
            <span class="text-xs text-gray-500">
              Tri par {{ userLocation.lat && userLocation.lng ? 'distance' : 'date' }}
            </span>
            <div v-if="userLocation.lat && userLocation.lng" 
              class="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>Plus proches en premier</span>
            </div>
          </div>
        </div>
        <button @click="refreshAnimals" :disabled="isLoadingAnimals"
          class="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50">
          🔄 Actualiser
        </button>
      </div>
      <!-- Indicateur de chargement du filtrage -->
      <div v-if="isFilteringByDistance" class="bg-white rounded-lg border border-blue-200 p-6 mb-4">
        <div class="flex items-center justify-center gap-3">
          <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div class="text-blue-800">
            <div class="font-medium">🗺️ Filtrage par distance en cours...</div>
            <div class="text-sm text-blue-600">Calcul des distances depuis votre position</div>
          </div>
        </div>
      </div>

      <div v-for="post in filteredPosts" :key="post.id" class="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                post.type === 'lost' && (post.status === 'resolved' || post.is_active === false)
                  ? 'bg-green-100 text-green-800'
                  : post.type === 'lost'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              ]">
                {{ 
                  post.type === 'lost' && (post.status === 'resolved' || post.is_active === false)
                    ? '✅ RETROUVÉ' 
                    : post.type === 'lost' 
                    ? '❌ PERDU' 
                    : '🔍 TROUVÉ' 
                }}
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
              
              <!-- Affichage du lieu -->
              <div class="flex items-center gap-1 mt-1" v-if="post.location">
                <span>📍</span>
                <span class="truncate max-w-32" :title="post.location">{{ post.location }}</span>
              </div>
              
              <!-- Affichage de la distance si GPS actif -->
              <div class="flex items-center gap-1 mt-1" v-if="userLocation.lat && userLocation.lng && formatPostDistance(post)">
                <span>🗺️</span>
                <span class="font-medium text-blue-600">{{ formatPostDistance(post) }}</span>
              </div>
              
              <div class="flex items-center gap-1 mt-1" v-if="post.reward">
                <span>💰</span>
                {{ post.reward }}
              </div>
            </div>
          </div>

          <p class="text-gray-700 mb-4">{{ post.description }}</p>

          <!-- Photos -->
          <div class="mb-4">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-sm font-medium text-gray-700">📸 Photos:</span>
              <span v-if="post.photos && post.photos.length > 0" 
                class="text-xs text-gray-500">
                ({{ post.photos.length }} photo{{ post.photos.length > 1 ? 's' : '' }})
              </span>
            </div>
            
            <div class="flex items-center gap-3">
              <!-- Cas 1: Aucune photo - Image par défaut -->
              <div v-if="!post.photos || post.photos.length === 0" 
                class="relative w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <div class="absolute -bottom-1 -right-1 bg-gray-300 text-gray-600 text-xs px-1 rounded">
                  Aucune
                </div>
              </div>
              
              <!-- Cas 2: 1-3 photos - Affichage direct -->
              <template v-else-if="post.photos.length <= 3">
                <div v-for="(photo, index) in post.photos" :key="photo.id"
                  class="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                  @click="openPhotoModal(post.photos, index)">
                  <img :src="photo.photo_url" :alt="`Photo ${index + 1} de ${post.name}`"
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
                <div class="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                  @click="openPhotoModal(post.photos, 0)">
                  <img :src="post.photos[0].photo_url" :alt="`Photo 1 de ${post.name}`"
                    class="w-full h-full object-cover" 
                    @error="handleImageError($event)" />
                  <div v-if="post.photos[0].is_primary" 
                    class="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                    ⭐
                  </div>
                </div>
                
                <!-- Deuxième photo -->
                <div class="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                  @click="openPhotoModal(post.photos, 1)">
                  <img :src="post.photos[1].photo_url" :alt="`Photo 2 de ${post.name}`"
                    class="w-full h-full object-cover" 
                    @error="handleImageError($event)" />
                  <div v-if="post.photos[1].is_primary" 
                    class="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                    ⭐
                  </div>
                </div>
                
                <!-- Compteur pour les photos restantes -->
                <div class="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                  @click="openPhotoModal(post.photos, 2)">
                  <img :src="post.photos[2].photo_url" :alt="`Photo 3 de ${post.name}`"
                    class="w-full h-full object-cover opacity-60" 
                    @error="handleImageError($event)" />
                  <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span class="text-white font-bold text-sm">+{{ post.photos.length - 2 }}</span>
                  </div>
                </div>
              </template>
              
              <!-- Bouton voir toutes les photos (si plus de 1 photo) -->
              <button v-if="post.photos && post.photos.length > 1"
                @click="openPhotoModal(post.photos, 0)"
                class="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-300 rounded-lg transition-colors">
                Voir tout
              </button>
            </div>
          </div>

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
            <div class="flex gap-2 flex-wrap">
              <button @click="sharePost(post)"
                class="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                <span class="mr-2">📲</span>Partager
              </button>
              
              <!-- Bouton "J'ai retrouvé" uniquement pour les animaux perdus non résolus -->
              <button v-if="post.type === 'lost' && post.status !== 'resolved' && post.is_active !== false" @click="markAsFound(post)" :disabled="isMarkingAsFound"
                class="bg-green-50 text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-100 transition-colors border border-green-200 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="isMarkingAsFound" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-else class="mr-2">🎉</span>
                {{ isMarkingAsFound ? 'Résolution en cours...' : 'J\'ai retrouvé cet animal' }}
              </button>
              
              <!-- Indicateur pour les annonces résolues -->
              <div v-if="post.type === 'lost' && (post.status === 'resolved' || post.is_active === false)" class="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
                <span class="mr-2">✅</span>Animal retrouvé !
                <div v-if="post.resolved_by_user" class="text-xs mt-1">
                  Trouvé par <strong>{{ post.resolved_by_user.name }}</strong>
                  <span v-if="post.resolved_at" class="ml-1">
                    le {{ formatDate(post.resolved_at) }}
                  </span>
                </div>
              </div>
              
              <!-- Informations pour les animaux trouvés -->
              <div v-if="post.type === 'found'" class="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
                <span class="mr-2">🔍</span>Animal trouvé - Contactez {{ post.contact_name }}
              </div>
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
              Photo (optionnelle)
            </label>
            <div class="space-y-2">
              <input type="file" @change="handleFileChange" 
                :disabled="isUploading"
                accept="image/*"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" />
              
              <!-- Indicateur de progression -->
              <div v-if="isUploading" class="space-y-2">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full animate-pulse" style="width: 100%"></div>
                </div>
                <p class="text-xs text-blue-600">📸 Upload en cours vers Cloudinary...</p>
              </div>
              
              <!-- Confirmation upload réussi -->
              <div v-if="newPost.photoUrl && !isUploading" class="text-xs text-green-600 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Photo uploadée avec succès !
              </div>
            </div>
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
            <button type="submit" :disabled="isCreatingAnimal || isUploading"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="isUploading" class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Upload en cours...
              </span>
              <span v-else-if="isCreatingAnimal" class="flex items-center gap-2">
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
import TitleDashboard from '@/components/common/TitleDashboard.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useLostAnimals } from '@/composables/useLostAnimals.js'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'
import { useResolveLostAnimalMutation } from '@/services/lostAnimals/lostAnimalsQueries.js'

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
const isUploading = ref(false)
const uploadProgress = ref(0)

// État pour le modal photo
const photoModal = ref({
  isOpen: false,
  photos: [],
  currentIndex: 0
})

// État pour la géolocalisation
const userLocation = ref({
  lat: null,
  lng: null,
  address: null,
  isLoading: false,
  error: null
})

// État pour le filtrage par distance
const isFilteringByDistance = ref(false)

// État pour le bouton "J'ai retrouvé"
const isMarkingAsFound = ref(false)

// Mutation pour résoudre une annonce
const resolveMutation = useResolveLostAnimalMutation()

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
  radius: 50 // Valeur par défaut plus raisonnable pour un usage mondial
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

  // 1. RECHERCHE TEXTUELLE : Filtrer par lieu mentionné dans l'annonce
  if (filters.value.address.trim()) {
    const searchTerm = filters.value.address.toLowerCase()
    filtered = filtered.filter(post => {
      // Rechercher dans le champ location de l'annonce
      const location = post.location?.toLowerCase() || ''
      const description = post.description?.toLowerCase() || ''
      
      // Chercher dans le lieu ET dans la description pour plus de résultats
      return location.includes(searchTerm) || description.includes(searchTerm)
    })
  }

  // 2. FILTRAGE PAR DISTANCE GÉOGRAPHIQUE : Calculer depuis notre position actuelle
  if (userLocation.value.lat && userLocation.value.lng && filters.value.radius > 0) {
    filtered = filtered.filter(post => {
      // Si l'annonce n'a pas de coordonnées GPS, on l'exclut du filtrage par distance
      if (!post.latitude || !post.longitude) {
        return false // Exclure les annonces sans coordonnées pour le filtrage par distance
      }

      // Calculer la distance entre notre position et le lieu de l'annonce
      const distance = calculateHaversineDistance(
        userLocation.value.lat,
        userLocation.value.lng,
        parseFloat(post.latitude),
        parseFloat(post.longitude)
      )

      console.log(`📏 Distance calculée pour "${post.name}": ${distance.toFixed(2)}km (limite: ${filters.value.radius}km)`)

      return distance <= filters.value.radius
    })
  }

  // Tri : par distance si GPS actif, sinon par date
  if (userLocation.value.lat && userLocation.value.lng) {
    // Tri par distance (plus proche en premier)
    filtered.sort((a, b) => {
      const distanceA = getDistanceToPost(a) || Infinity
      const distanceB = getDistanceToPost(b) || Infinity
      return distanceA - distanceB
    })
  } else {
    // Tri par date de création (le plus récent en premier)
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }

  return filtered
})

// Méthodes
const getAnimalIcon = (animalType) => {
  const animal = animalTypes.find(type => type.value === animalType)
  return animal ? animal.icon : '🐾'
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

// Fonctions de géolocalisation et calcul de distance
const calculateHaversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Rayon de la Terre en kilomètres
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const toRadians = (degrees) => {
  return degrees * (Math.PI / 180)
}

const geocodeAddress = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    )
    
    if (!response.ok) {
      throw new Error('Erreur lors du géocodage')
    }
    
    const data = await response.json()
    
    if (data.length === 0) {
      throw new Error(`Adresse "${address}" non trouvée`)
    }
    
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name
    }
  } catch (error) {
    console.error('Erreur géocodage:', error)
    throw error
  }
}

const getUserLocation = async () => {
  userLocation.value.isLoading = true
  userLocation.value.error = null
  
  try {
    console.log('🌍 Récupération de la position utilisateur...')
    
    // 1. Vérifier si l'utilisateur a une adresse dans son profil
    const currentUser = getCurrentUser.value
    if (currentUser?.address?.trim()) {
      console.log('📍 Utilisation de l\'adresse du profil:', currentUser.address)
      
      isFilteringByDistance.value = true
      const geocoded = await geocodeAddress(currentUser.address)
      
      userLocation.value.lat = geocoded.lat
      userLocation.value.lng = geocoded.lng
      userLocation.value.address = currentUser.address
      
      // NE PAS remplir le champ de recherche automatiquement
      // Le champ de recherche est pour la recherche textuelle, pas pour la géolocalisation
      
      console.log('✅ Position obtenue depuis le profil:', geocoded)
      return
    }
    
    // 2. Si pas d'adresse dans le profil, utiliser la géolocalisation
    if (!navigator.geolocation) {
      throw new Error('La géolocalisation n\'est pas supportée par votre navigateur')
    }
    
    console.log('📱 Utilisation de la géolocalisation du navigateur...')
    isFilteringByDistance.value = true
    
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })

    const lat = position.coords.latitude
    const lng = position.coords.longitude
    
    console.log('📍 Position GPS obtenue:', { lat, lng })

    // Géocodage inverse pour obtenir l'adresse
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
    )

    if (response.ok) {
      const data = await response.json()
      const address = data.address || {}
      const cityName = address.city || address.town || address.village || 
                      address.municipality || address.county || address.state || 'Position actuelle'
      const country = address.country || ''
      const displayAddress = country ? `${cityName}, ${country}` : cityName

      userLocation.value.address = displayAddress
      // NE PAS remplir le champ de recherche automatiquement
      
      console.log('🏙️ Adresse détectée:', displayAddress)
    }

    userLocation.value.lat = lat
    userLocation.value.lng = lng
    
    console.log('✅ Géolocalisation réussie')
    
  } catch (error) {
    console.error('❌ Erreur géolocalisation:', error)
    
    let errorMessage = 'Erreur lors de la géolocalisation'
    
    if (error.code === 1) {
      errorMessage = 'Accès à la géolocalisation refusé. Veuillez saisir votre adresse manuellement.'
    } else if (error.code === 2) {
      errorMessage = 'Position indisponible. Vérifiez votre connexion.'
    } else if (error.code === 3) {
      errorMessage = 'Délai d\'attente dépassé. Réessayez.'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    userLocation.value.error = errorMessage
    
    // Afficher une notification à l'utilisateur
    alert(errorMessage)
    
  } finally {
    userLocation.value.isLoading = false
    isFilteringByDistance.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Date inconnue'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDistance = (km) => {
  const distance = parseInt(km)
  
  if (distance < 1000) {
    return `${distance} km`
  } else {
    const thousands = Math.floor(distance / 1000)
    const remainder = distance % 1000
    
    if (remainder === 0) {
      return `${thousands} 000 km`
    } else {
      return `${thousands} ${remainder.toString().padStart(3, '0')} km`
    }
  }
}

// Calculer la distance depuis la position utilisateur vers une annonce
const getDistanceToPost = (post) => {
  if (!userLocation.value.lat || !userLocation.value.lng || !post.latitude || !post.longitude) {
    return null
  }
  
  const distance = calculateHaversineDistance(
    userLocation.value.lat,
    userLocation.value.lng,
    parseFloat(post.latitude),
    parseFloat(post.longitude)
  )
  
  return distance
}

// Formater la distance pour affichage sur les cartes
const formatPostDistance = (post) => {
  const distance = getDistanceToPost(post)
  if (distance === null) return null
  
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`
  } else if (distance < 10) {
    return `${distance.toFixed(1)} km`
  } else {
    return `${Math.round(distance)} km`
  }
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

const markAsFound = async (post) => {
  const isConfirmed = confirm(`Avez-vous vraiment retrouvé ${post.name} ?\n\nL'annonce sera marquée comme résolue et votre identité sera enregistrée comme ayant trouvé l'animal.`)
  
  if (!isConfirmed) return

  isMarkingAsFound.value = true

  try {
    console.log('🎉 Marquage comme résolu pour:', post.name, 'ID:', post.id)
    
    // Utiliser la mutation pour résoudre l'annonce
    const result = await resolveMutation.mutateAsync(post.id)
    
    console.log('✅ Annonce marquée comme résolue:', result.data)
    console.log('👤 Résolu par:', result.data.resolved_by_user)
    console.log('📅 Résolu le:', result.data.resolved_at)

    // Actualiser la liste des annonces
    await refreshAnimals()

    // Message de succès avec les vraies données
    const resolvedBy = result.data.resolved_by_user
    const resolvedAt = new Date(result.data.resolved_at).toLocaleDateString('fr-FR')
    
    alert(`✅ Parfait ! L'annonce de ${post.name} a été marquée comme résolue.\n\n` +
          `📋 Statut: ${result.data.status}\n` +
          `👤 Trouvé par: ${resolvedBy?.name || 'Vous'}\n` +
          `📞 Contact: ${resolvedBy?.phone || 'Non renseigné'}\n` +
          `📅 Date: ${resolvedAt}\n\n` +
          `Le propriétaire sera notifié !`)

  } catch (error) {
    console.error('❌ Erreur résolution annonce:', error)
    // Le toast d'erreur est géré par la mutation
    // Mais on peut ajouter une alerte personnalisée si besoin
    alert(`❌ Erreur lors de la résolution de l'annonce : ${error.error || error.message}`)
  } finally {
    isMarkingAsFound.value = false
  }
}

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (file) {
    console.log('📸 Photo sélectionnée :', file.name)
    
    try {
      // Afficher un indicateur de chargement
      isUploading.value = true
      uploadProgress.value = 0
      
      console.log('🚀 Upload photo vers Cloudinary:', file.name)
      
      // Upload vers Cloudinary
      const { cloudinaryService } = await import('@/services/cloudinary/cloudinaryService.js')
      
      const cloudinaryResult = await cloudinaryService.uploadImage(file, {
        folder: 'animoplus/lost-animals',
        maxSize: 10 * 1024 * 1024, // 10MB max pour les photos d'animaux
        tags: ['lost-animal', 'community'],
        publicId: `lost_animal_${Date.now()}`
      })
      
      if (!cloudinaryResult.success) {
        console.error('❌ Erreur upload Cloudinary:', cloudinaryResult.error)
        alert('Erreur lors de l\'upload de la photo: ' + (cloudinaryResult.error || 'Erreur inconnue'))
        return
      }
      
      const photoUrl = cloudinaryResult.data.secure_url
      console.log('✅ Photo uploadée sur Cloudinary:', photoUrl)
      
      // Stocker l'URL de la photo
      newPost.value.photo = file // Garder le fichier pour l'aperçu
      newPost.value.photoUrl = photoUrl // URL Cloudinary pour l'API
      newPost.value.photos = [photoUrl] // Array pour l'API
      
      console.log('📷 Photo URL stockée:', photoUrl)
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'upload:', error)
      alert('Erreur lors de l\'upload de la photo: ' + error.message)
    } finally {
      isUploading.value = false
      uploadProgress.value = 0
    }
  }
}

const handleAddPost = async () => {
  try {
    // Validation des données avant envoi
    if (!newPost.value.name?.trim()) {
      alert('Le nom de l\'animal est requis')
      return
    }
    
    if (!newPost.value.description?.trim()) {
      alert('La description est requise')
      return
    }
    
    // Photo optionnelle - pas de validation requise
    
    if (!newPost.value.location?.trim()) {
      alert('La localisation est requise')
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
