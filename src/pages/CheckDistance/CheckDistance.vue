<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-sm p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">🌍 Calculateur de Distance Mondial</h1>
          <p class="text-gray-600">
            Testez le calcul de distance entre deux villes du monde entier pour le système de filtrage géographique
          </p>
        </div>

        <!-- Formulaire de test -->
        <div class="grid md:grid-cols-2 gap-6 mb-8">
          <!-- Ville 1 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                🏠 Ville de départ
              </label>
              <div class="space-y-2">
                <input 
                  type="text" 
                  v-model="city1"
                  placeholder="Ex: Paris, New York, Tokyo, Londres..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  @keyup.enter="calculateDistance"
                />
                <button 
                  @click="useCurrentLocation"
                  :disabled="isGettingLocation"
                  class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg v-if="isGettingLocation" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span v-if="isGettingLocation">Localisation en cours...</span>
                  <span v-else>📍 Utiliser ma position actuelle</span>
                </button>
              </div>
            </div>
            
            <!-- Coordonnées ville 1 -->
            <div v-if="coordinates1.lat && coordinates1.lng" 
              class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div class="text-sm text-blue-800">
                <div class="font-medium">📍 Coordonnées trouvées:</div>
                <div>Latitude: {{ coordinates1.lat.toFixed(6) }}</div>
                <div>Longitude: {{ coordinates1.lng.toFixed(6) }}</div>
              </div>
            </div>
          </div>

          <!-- Ville 2 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                🎯 Ville d'arrivée
              </label>
              <input 
                type="text" 
                v-model="city2"
                placeholder="Ex: Sydney, Dubai, São Paulo, Madrid..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @keyup.enter="calculateDistance"
              />
            </div>
            
            <!-- Coordonnées ville 2 -->
            <div v-if="coordinates2.lat && coordinates2.lng" 
              class="bg-green-50 border border-green-200 rounded-lg p-3">
              <div class="text-sm text-green-800">
                <div class="font-medium">📍 Coordonnées trouvées:</div>
                <div>Latitude: {{ coordinates2.lat.toFixed(6) }}</div>
                <div>Longitude: {{ coordinates2.lng.toFixed(6) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bouton de calcul -->
        <div class="text-center mb-8">
          <button 
            @click="calculateDistance"
            :disabled="isCalculating || !city1.trim() || !city2.trim()"
            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            <svg v-if="isCalculating" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="isCalculating">Calcul en cours...</span>
            <span v-else>📏 Calculer la distance</span>
          </button>
        </div>

        <!-- Résultat -->
        <div v-if="result.distance !== null" class="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-6">
          <div class="text-center">
            <div class="text-4xl font-bold text-purple-600 mb-2">
              {{ result.distance.toFixed(1) }} km
            </div>
            <div class="text-lg text-purple-800 mb-4">
              Distance entre <strong>{{ result.city1Name }}</strong> et <strong>{{ result.city2Name }}</strong>
            </div>
            
            <!-- Temps de trajet estimé -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div class="bg-white bg-opacity-50 rounded-lg p-3">
                <div class="text-purple-600 font-medium">🚗 En voiture</div>
                <div class="text-purple-800">≈ {{ Math.round(result.distance / 80) }}h {{ Math.round((result.distance / 80 % 1) * 60) }}min</div>
              </div>
              <div class="bg-white bg-opacity-50 rounded-lg p-3">
                <div class="text-purple-600 font-medium">🚄 En TGV</div>
                <div class="text-purple-800">≈ {{ Math.round(result.distance / 250) }}h {{ Math.round((result.distance / 250 % 1) * 60) }}min</div>
              </div>
              <div class="bg-white bg-opacity-50 rounded-lg p-3">
                <div class="text-purple-600 font-medium">🚶 À pied</div>
                <div class="text-purple-800">≈ {{ Math.round(result.distance / 5) }}h</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Erreurs -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-2 text-red-800">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="font-medium">Erreur:</span>
            <span>{{ error }}</span>
          </div>
        </div>

        <!-- Information géolocalisation -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="text-sm text-blue-800">
              <div class="font-medium mb-1">💡 Astuce Géolocalisation</div>
              <div>
                Le bouton "📍 Utiliser ma position actuelle" utilise le GPS de votre appareil pour détecter automatiquement votre ville. 
                Votre navigateur vous demandera l'autorisation d'accéder à votre position.
              </div>
            </div>
          </div>
        </div>

        <!-- Exemples prédéfinis -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">🎯 Exemples rapides</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <button 
              v-for="example in examples" 
              :key="example.id"
              @click="loadExample(example)"
              class="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div class="font-medium text-gray-900">{{ example.from }} → {{ example.to }}</div>
              <div class="text-sm text-gray-600">{{ example.description }}</div>
            </button>
          </div>
        </div>

        <!-- Informations techniques -->
        <div class="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">🔧 Informations Techniques</h3>
          <div class="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Méthode de calcul:</h4>
              <ul class="space-y-1">
                <li>• Géocodage mondial via OpenStreetMap</li>
                <li>• Formule de Haversine pour la distance</li>
                <li>• Calcul orthodromique (ligne droite)</li>
                <li>• Précision: ±100m partout dans le monde</li>
                <li>• Support de toutes les langues et pays</li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Utilisation dans AnimoPlus:</h4>
              <ul class="space-y-1">
                <li>• Filtrage mondial des annonces par proximité</li>
                <li>• Rayon de recherche configurable (2-20+ km)</li>
                <li>• Géolocalisation automatique utilisateur</li>
                <li>• Support voyages internationaux</li>
                <li>• Réseau d'entraide sans frontières</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// État réactif
const city1 = ref('')
const city2 = ref('')
const coordinates1 = ref({ lat: null, lng: null })
const coordinates2 = ref({ lat: null, lng: null })
const isCalculating = ref(false)
const isGettingLocation = ref(false)
const error = ref('')
const result = ref({
  distance: null,
  city1Name: '',
  city2Name: ''
})

// Exemples prédéfinis - Mondial
const examples = [
  // Exemples français
  {
    id: 1,
    from: 'Paris',
    to: 'Marseille',
    description: '🇫🇷 Nord-Sud France'
  },
  {
    id: 2,
    from: 'Lyon',
    to: 'Bordeaux',
    description: '🇫🇷 Est-Ouest France'
  },
  // Exemples européens
  {
    id: 3,
    from: 'Paris',
    to: 'Londres',
    description: '🇪🇺 France-Angleterre'
  },
  {
    id: 4,
    from: 'Madrid',
    to: 'Rome',
    description: '🇪🇺 Espagne-Italie'
  },
  // Exemples intercontinentaux
  {
    id: 5,
    from: 'Paris',
    to: 'New York',
    description: '🌍 Europe-Amérique'
  },
  {
    id: 6,
    from: 'Tokyo',
    to: 'Londres',
    description: '🌏 Asie-Europe'
  },
  {
    id: 7,
    from: 'Sydney',
    to: 'Los Angeles',
    description: '🌏 Océanie-Amérique'
  },
  {
    id: 8,
    from: 'Le Caire',
    to: 'Dubai',
    description: '🌍 Afrique-Moyen-Orient'
  },
  {
    id: 9,
    from: 'São Paulo',
    to: 'Buenos Aires',
    description: '🌎 Amérique du Sud'
  }
]

// Fonction pour géocoder une ville
const geocodeCity = async (cityName) => {
  try {
    // Utilisation de l'API Nominatim d'OpenStreetMap (gratuite) - Mondial
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`
    )
    
    if (!response.ok) {
      throw new Error('Erreur lors de la géolocalisation')
    }
    
    const data = await response.json()
    
    if (data.length === 0) {
      throw new Error(`Ville "${cityName}" non trouvée`)
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

// Fonction pour calculer la distance avec la formule de Haversine
const calculateHaversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Rayon de la Terre en kilomètres
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return distance
}

// Fonction utilitaire pour convertir en radians
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180)
}

// Fonction principale de calcul de distance
const calculateDistance = async () => {
  if (!city1.value.trim() || !city2.value.trim()) {
    error.value = 'Veuillez saisir les deux villes'
    return
  }
  
  isCalculating.value = true
  error.value = ''
  result.value = { distance: null, city1Name: '', city2Name: '' }
  coordinates1.value = { lat: null, lng: null }
  coordinates2.value = { lat: null, lng: null }
  
  try {
    console.log('🔍 Géocodage des villes:', city1.value, 'et', city2.value)
    
    // Géocoder les deux villes en parallèle
    const [geo1, geo2] = await Promise.all([
      geocodeCity(city1.value),
      geocodeCity(city2.value)
    ])
    
    console.log('📍 Coordonnées trouvées:')
    console.log('Ville 1:', geo1)
    console.log('Ville 2:', geo2)
    
    // Stocker les coordonnées pour l'affichage
    coordinates1.value = { lat: geo1.lat, lng: geo1.lng }
    coordinates2.value = { lat: geo2.lat, lng: geo2.lng }
    
    // Calculer la distance
    const distance = calculateHaversineDistance(
      geo1.lat, geo1.lng,
      geo2.lat, geo2.lng
    )
    
    console.log('📏 Distance calculée:', distance, 'km')
    
    // Stocker le résultat
    result.value = {
      distance: distance,
      city1Name: geo1.displayName.split(',')[0], // Premier élément = nom de ville
      city2Name: geo2.displayName.split(',')[0]
    }
    
  } catch (err) {
    console.error('❌ Erreur calcul distance:', err)
    error.value = err.message || 'Erreur lors du calcul de distance'
  } finally {
    isCalculating.value = false
  }
}

// Fonction pour utiliser la géolocalisation du navigateur
const useCurrentLocation = async () => {
  if (!navigator.geolocation) {
    error.value = 'La géolocalisation n\'est pas supportée par votre navigateur'
    return
  }

  isGettingLocation.value = true
  error.value = ''

  try {
    console.log('🌍 Demande de géolocalisation...')
    
    // Obtenir la position actuelle
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
    
    console.log('📍 Position obtenue:', { lat, lng })
    console.log('🎯 Précision:', position.coords.accuracy, 'mètres')

    // Stocker les coordonnées
    coordinates1.value = { lat, lng }

    // Géocodage inverse pour obtenir le nom de la ville
    console.log('🔍 Géocodage inverse en cours...')
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
    )

    if (!response.ok) {
      throw new Error('Erreur lors du géocodage inverse')
    }

    const data = await response.json()
    console.log('🏙️ Géocodage inverse réussi:', data)

    // Extraire le nom de la ville
    const address = data.address || {}
    const cityName = address.city || address.town || address.village || address.municipality || 
                    address.county || address.state || 'Position actuelle'
    
    const country = address.country || ''
    const displayName = country ? `${cityName}, ${country}` : cityName

    city1.value = displayName
    
    console.log('✅ Ville détectée:', displayName)
    
  } catch (err) {
    console.error('❌ Erreur géolocalisation:', err)
    
    if (err.code === 1) {
      error.value = 'Accès à la géolocalisation refusé. Veuillez autoriser la localisation dans votre navigateur.'
    } else if (err.code === 2) {
      error.value = 'Position indisponible. Vérifiez votre connexion et les paramètres de localisation.'
    } else if (err.code === 3) {
      error.value = 'Délai d\'attente dépassé. Réessayez.'
    } else {
      error.value = 'Erreur lors de la géolocalisation: ' + (err.message || 'Erreur inconnue')
    }
  } finally {
    isGettingLocation.value = false
  }
}

// Fonction pour charger un exemple
const loadExample = (example) => {
  city1.value = example.from
  city2.value = example.to
  // Auto-calculer après un court délai
  setTimeout(() => {
    calculateDistance()
  }, 100)
}
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
