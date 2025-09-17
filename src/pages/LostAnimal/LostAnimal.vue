<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mx-auto">
      <!-- En-tête -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              Communauté Animaux Perdus/Trouvés
            </h1>
            <p class="text-gray-600">
              Aidez-nous à retrouver nos compagnons perdus et à réunir les familles
            </p>
          </div>
          <button
            @click="showAddPost = true"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <span class="text-lg">+</span>
            Créer une annonce
          </button>
        </div>
      </div>

      <!-- Filtres -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex flex-wrap gap-4 items-center">
          <!-- Type d'annonce -->
          <div class="flex gap-2">
            <button
              @click="filters.type = 'all'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                filters.type === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              Tous
            </button>
            <button
              @click="filters.type = 'lost'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                filters.type === 'lost' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              Animaux perdus
            </button>
            <button
              @click="filters.type = 'found'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                filters.type === 'found' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              Animaux trouvés
            </button>
          </div>

          <!-- Recherche par adresse -->
          <div class="relative flex-1 min-w-64">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Filtrer par adresse..."
              v-model="filters.address"
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>

          <!-- Rayon de recherche -->
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-700">Rayon:</span>
            <div class="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="50"
                v-model="filters.radius"
                class="w-24"
              />
              <span class="text-sm font-medium text-gray-700 min-w-12">
                {{ filters.radius }} km
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des posts -->
      <div class="space-y-4">
        <div v-for="post in filteredPosts" :key="post.id" class="bg-white rounded-lg shadow-sm overflow-hidden">
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
                  {{ getAnimalIcon(post.animalType) }}
                </div>
                <div>
                  <h3 class="font-bold text-lg">{{ post.name }}</h3>
                  <p class="text-gray-600 text-sm">{{ post.animalType }}</p>
                </div>
              </div>
              <div class="text-right text-sm text-gray-500">
                <div class="flex items-center gap-1">
                  <span>📅</span>
                  {{ formatDate(post.date) }}
                </div>
                <div class="flex items-center gap-1 mt-1">
                  <span>📍</span>
                  {{ post.distance }}
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

            <div class="border-t pt-4">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium text-gray-900">Contact</h4>
                <div class="flex gap-2">
                  <button 
                    @click="callContact(post.contactPhone)"
                    class="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>📞</span>
                    {{ post.contactPhone }}
                  </button>
                  <button 
                    @click="emailContact(post.contactEmail)"
                    class="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <span>✉️</span>
                    Email
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-600 mb-4">
                Contact: {{ post.contactName }}
              </p>
            </div>

            <!-- Commentaires -->
            <div class="border-t pt-4">
              <div class="flex items-center gap-2 mb-3">
                <span>💬</span>
                <span class="font-medium">
                  Commentaires ({{ post.comments.length }})
                </span>
              </div>

              <div v-for="comment in post.comments" :key="comment.id" class="bg-gray-50 rounded-lg p-3 mb-2">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-medium text-sm">{{ comment.author }}</span>
                  <span class="text-xs text-gray-500">
                    {{ formatDate(comment.date) }}
                  </span>
                </div>
                <p class="text-sm text-gray-700">{{ comment.text }}</p>
              </div>

              <!-- Ajouter un commentaire -->
              <div class="flex gap-2 mt-3">
                <input
                  type="text"
                  placeholder="Ajouter un commentaire..."
                  v-model="newComment"
                  @keyup.enter="addComment(post.id)"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  @click="addComment(post.id)"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>📤</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Ajouter une annonce -->
      <div v-if="showAddPost" class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50" @click="showAddPost = false">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto" @click.stop>
          <div class="p-6 border-b">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold">Créer une annonce</h2>
              <button
                @click="showAddPost = false"
                class="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          <form @submit.prevent="handleAddPost" class="p-6 space-y-4">
            <!-- Type d'annonce -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Type d'annonce
              </label>
              <div class="flex gap-4">
                <label class="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="postType"
                    value="lost"
                    v-model="newPost.type"
                    class="mr-2"
                  />
                  <span class="text-red-600 font-medium">❌ J'ai perdu un animal</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="postType"
                    value="found"
                    v-model="newPost.type"
                    class="mr-2"
                  />
                  <span class="text-green-600 font-medium">✅ J'ai trouvé un animal</span>
                </label>
              </div>
            </div>

            <!-- Type d'animal -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Type d'animal
              </label>
              <select
                v-model="newPost.animalType"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option v-for="type in animalTypes" :key="type.value" :value="type.value">
                  {{ type.icon }} {{ type.label }}
                </option>
              </select>
            </div>

            <!-- Nom -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ newPost.type === 'lost' ? 'Nom de l\'animal' : 'Description courte' }}
              </label>
              <input
                type="text"
                v-model="newPost.name"
                :placeholder="newPost.type === 'lost' ? 'Max, Minou...' : 'Chat tigré, Chien berger...'"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Description détaillée
              </label>
              <textarea
                v-model="newPost.description"
                rows="4"
                placeholder="Description physique, comportement, signes distinctifs..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            <!-- Lieu -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Lieu {{ newPost.type === 'lost' ? 'de disparition' : 'de découverte' }}
              </label>
              <input
                type="text"
                v-model="newPost.location"
                placeholder="Adresse, quartier, repères..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <!-- Informations de contact -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Votre nom
                </label>
                <input
                  type="text"
                  v-model="newPost.contactName"
                  placeholder="Nom et prénom"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  v-model="newPost.contactPhone"
                  placeholder="06 12 34 56 78"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                v-model="newPost.contactEmail"
                placeholder="votre.email@exemple.com"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <!-- Récompense (uniquement pour les animaux perdus) -->
            <div v-if="newPost.type === 'lost'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Récompense (optionnel)
              </label>
              <input
                type="text"
                v-model="newPost.reward"
                placeholder="100€, Gratification, etc."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                @click="showAddPost = false"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Publier l'annonce
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// State reactif
const posts = ref([])
const showAddPost = ref(false)
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
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  photos: [],
  reward: ''
})

// Types d'animaux
const animalTypes = [
  { value: 'chien', label: 'Chien', icon: '🐕' },
  { value: 'chat', label: 'Chat', icon: '🐱' },
  { value: 'oiseau', label: 'Oiseau', icon: '🐦' },
  { value: 'lapin', label: 'Lapin', icon: '🐰' },
  { value: 'autre', label: 'Autre', icon: '🐾' }
]

// Données de démonstration
const initialPosts = [
  {
    id: 1,
    type: 'lost',
    animalType: 'chien',
    name: 'Max',
    description: 'Berger allemand de 3 ans, très gentil. Collier rouge avec médaille.',
    location: 'Avenue de la République, Lyon 3ème',
    contactName: 'Marie Dubois',
    contactPhone: '06 12 34 56 78',
    contactEmail: 'marie.dubois@email.com',
    photos: ['🐕'],
    date: '2024-01-15',
    distance: '2.1 km',
    comments: [
      { id: 1, author: 'Pierre L.', text: 'Je vais surveiller dans le quartier !', date: '2024-01-15' },
      { id: 2, author: 'Sophie M.', text: 'Partagé sur les réseaux sociaux', date: '2024-01-16' }
    ]
  },
  {
    id: 2,
    type: 'found',
    animalType: 'chat',
    name: 'Chat tigré inconnu',
    description: 'Chat tigré trouvé près du parc. Très affectueux, semble habitué aux humains.',
    location: 'Parc de la Tête d\'Or, Lyon 6ème',
    contactName: 'Jean Martin',
    contactPhone: '06 98 76 54 32',
    contactEmail: 'jean.martin@email.com',
    photos: ['🐱'],
    date: '2024-01-14',
    distance: '1.5 km',
    comments: [
      { id: 3, author: 'Claire R.', text: 'Il ressemble au chat de ma voisine !', date: '2024-01-14' }
    ]
  },
  {
    id: 3,
    type: 'lost',
    animalType: 'chat',
    name: 'Minou',
    description: 'Chat persan blanc, très craintif. Disparue depuis hier soir.',
    location: 'Rue de la Paix, Lyon 2ème',
    contactName: 'Anna Durand',
    contactPhone: '07 11 22 33 44',
    contactEmail: 'anna.durand@email.com',
    photos: ['🐱'],
    reward: '50€',
    date: '2024-01-13',
    distance: '3.8 km',
    comments: []
  }
]

// Computed properties
const filteredPosts = computed(() => {
  let filtered = posts.value

  // Filtre par type
  if (filters.value.type !== 'all') {
    filtered = filtered.filter(post => post.type === filters.value.type)
  }

  // Filtre par adresse
  if (filters.value.address.trim()) {
    filtered = filtered.filter(post =>
      post.location.toLowerCase().includes(filters.value.address.toLowerCase())
    )
  }

  return filtered
})

// Méthodes
const getAnimalIcon = (animalType) => {
  const animal = animalTypes.find(type => type.value === animalType)
  return animal ? animal.icon : '🐾'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const callContact = (phone) => {
  console.log(`Appel vers ${phone}`)
  alert(`Appel vers ${phone}`)
}

const emailContact = (email) => {
  console.log(`Email vers ${email}`)
  window.location.href = `mailto:${email}`
}

const addComment = (postId) => {
  if (!newComment.value.trim()) return

  const post = posts.value.find(p => p.id === postId)
  if (post) {
    const comment = {
      id: Date.now(),
      author: 'Moi',
      text: newComment.value,
      date: new Date().toISOString().split('T')[0]
    }
    post.comments.push(comment)
    newComment.value = ''
  }
}

const handleAddPost = () => {
  const post = {
    id: Date.now(),
    ...newPost.value,
    date: new Date().toISOString().split('T')[0],
    distance: '0.5 km',
    comments: []
  }
  
  posts.value.unshift(post)
  
  // Reset form
  newPost.value = {
    type: 'lost',
    animalType: 'chien',
    name: '',
    description: '',
    location: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    photos: [],
    reward: ''
  }
  
  showAddPost.value = false
}

// Initialisation
onMounted(() => {
  posts.value = [...initialPosts]
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

input[type="radio"] {
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