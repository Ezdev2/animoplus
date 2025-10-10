// Intercepteurs personnalisés pour différents cas d'usage

// Intercepteur pour les requêtes de upload de fichiers
export const fileUploadInterceptor = {
  request: (config) => {
    // Pour les uploads, changer le Content-Type
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }
    return config
  }
}

// Intercepteur pour le logging des requêtes (développement)
export const loggingInterceptor = {
  request: (config) => {
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params
      })
    }
    return config
  },
  
  response: (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`, {
        data: response.data
      })
    }
    return response
  },
  
  error: (error) => {
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, {
        error: error.response?.data,
        message: error.message
      })
    }
    return Promise.reject(error)
  }
}

// Intercepteur pour la gestion des erreurs globales
export const errorHandlingInterceptor = {
  error: (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message

    switch (status) {
      case 400:
        console.error('Erreur de validation:', message)
        break
      case 401:
        console.error('Non autorisé:', message)
        break
      case 403:
        console.error('Accès refusé:', message)
        break
      case 404:
        console.error('Ressource non trouvée:', message)
        break
      case 422:
        console.error('Données invalides:', message)
        break
      case 500:
        console.error('Erreur serveur:', message)
        break
      default:
        console.error('Erreur réseau:', message)
    }

    return Promise.reject(error)
  }
}

// Intercepteur pour la gestion du cache
export const cacheInterceptor = {
  request: (config) => {
    // Ajouter des headers de cache pour les requêtes GET
    if (config.method === 'get') {
      config.headers['Cache-Control'] = 'max-age=300' // 5 minutes
    }
    return config
  }
}

// Intercepteur pour la gestion des timeouts personnalisés
export const timeoutInterceptor = {
  request: (config) => {
    // Timeout plus long pour les uploads
    if (config.data instanceof FormData) {
      config.timeout = 500000 // 500 secondes (8 minutes 20 secondes)
    }
    return config
  }
}
