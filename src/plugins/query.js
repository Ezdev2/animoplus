import { VueQueryPlugin } from '@tanstack/vue-query'

// Configuration par défaut de TanStack Query
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Temps de cache par défaut (5 minutes)
      staleTime: 5 * 60 * 1000,
      // Temps avant garbage collection (10 minutes)
      cacheTime: 10 * 60 * 1000,
      // Retry automatique en cas d'erreur
      retry: (failureCount, error) => {
        // Ne pas retry les erreurs 4xx
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        // Retry jusqu'à 3 fois pour les autres erreurs
        return failureCount < 3
      },
      // Délai entre les retries (exponentiel)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch automatique quand la fenêtre reprend le focus
      refetchOnWindowFocus: false,
      // Refetch automatique à la reconnexion
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry automatique pour les mutations
      retry: 1,
      // Délai entre les retries pour les mutations
      retryDelay: 1000,
    }
  }
}

// Plugin Vue Query avec configuration
export const vueQueryPlugin = {
  install(app) {
    app.use(VueQueryPlugin, queryClientConfig)
  }
}

// Clés de requête standardisées
export const queryKeys = {
  // Authentification
  auth: {
    me: ['auth', 'me'],
    check: ['auth', 'check']
  },
  
  // Utilisateurs
  users: {
    all: ['users'],
    profile: (id) => ['users', 'profile', id],
    current: ['users', 'current']
  },
  
  // Animaux
  animals: {
    all: ['animals'],
    byClient: (clientId) => ['animals', 'client', clientId],
    detail: (id) => ['animals', id],
    species: ['animals', 'species'],
    races: (speciesId) => ['animals', 'races', speciesId]
  },
  
  // Rendez-vous
  appointments: {
    all: ['appointments'],
    byUser: (userId) => ['appointments', 'user', userId],
    availability: (date) => ['appointments', 'availability', date],
    detail: (id) => ['appointments', id]
  },
  
  // Cliniques
  clinics: {
    all: ['clinics'],
    detail: (id) => ['clinics', id],
    schedules: (id) => ['clinics', id, 'schedules']
  },
  
  // Services
  services: {
    all: ['services'],
    bySpecialty: (specialtyId) => ['services', 'specialty', specialtyId]
  },
  
  // Spécialités
  specialties: {
    all: ['specialties']
  },
  
  // Messages
  messages: {
    conversations: ['messages', 'conversations'],
    conversation: (id) => ['messages', 'conversation', id]
  },
  
  // Documents
  documents: {
    all: ['documents'],
    byAnimal: (animalId) => ['documents', 'animal', animalId]
  },
  
  // Stock
  stock: {
    all: ['stock'],
    lowStock: ['stock', 'low'],
    suppliers: ['stock', 'suppliers']
  }
}

// Helpers pour la gestion des erreurs
export const queryErrorHandlers = {
  // Gestionnaire d'erreur global
  onError: (error) => {
    console.error('Erreur de requête:', error)
    
    // Gestion spécifique selon le type d'erreur
    if (error?.response?.status === 401) {
      // Token expiré, rediriger vers login
      console.warn('Token expiré, redirection vers login')
      // Le router sera géré dans les composants
    } else if (error?.response?.status === 403) {
      console.warn('Accès refusé')
    } else if (error?.response?.status >= 500) {
      console.error('Erreur serveur')
    }
  },
  
  // Gestionnaire de succès global
  onSuccess: (data) => {
    // Log en mode développement
    if (import.meta.env.DEV) {
      console.log('Requête réussie:', data)
    }
  }
}
