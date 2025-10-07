import { ref, reactive, nextTick } from 'vue'

/**
 * Composable pour gérer les notifications toast spécifiques aux problèmes de connexion
 */
export function useConnectionToast() {
  // État des toasts
  const toasts = ref([])
  const maxToasts = 3
  const defaultDuration = 5000

  // Types de toast avec leurs configurations
  const toastTypes = {
    success: {
      icon: '✅',
      bgColor: 'bg-green-500',
      textColor: 'text-white',
      borderColor: 'border-green-600'
    },
    error: {
      icon: '❌',
      bgColor: 'bg-red-500',
      textColor: 'text-white',
      borderColor: 'border-red-600'
    },
    warning: {
      icon: '⚠️',
      bgColor: 'bg-orange-500',
      textColor: 'text-white',
      borderColor: 'border-orange-600'
    },
    info: {
      icon: 'ℹ️',
      bgColor: 'bg-blue-500',
      textColor: 'text-white',
      borderColor: 'border-blue-600'
    },
    loading: {
      icon: '🔄',
      bgColor: 'bg-gray-500',
      textColor: 'text-white',
      borderColor: 'border-gray-600'
    }
  }

  // Générer un ID unique pour chaque toast
  const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Ajouter un toast
  const addToast = (message, type = 'info', options = {}) => {
    const toast = {
      id: generateId(),
      message,
      type,
      duration: options.duration || defaultDuration,
      persistent: options.persistent || false,
      action: options.action || null,
      createdAt: Date.now(),
      ...toastTypes[type]
    }

    // Limiter le nombre de toasts affichés
    if (toasts.value.length >= maxToasts) {
      toasts.value.shift() // Supprimer le plus ancien
    }

    toasts.value.push(toast)

    // Auto-suppression si pas persistant
    if (!toast.persistent) {
      setTimeout(() => {
        removeToast(toast.id)
      }, toast.duration)
    }

    return toast.id
  }

  // Supprimer un toast
  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  // Supprimer tous les toasts
  const clearAllToasts = () => {
    toasts.value = []
  }

  // Mettre à jour un toast existant
  const updateToast = (id, updates) => {
    const toast = toasts.value.find(t => t.id === id)
    if (toast) {
      Object.assign(toast, updates)
    }
  }

  // Méthodes spécifiques pour les problèmes de connexion
  const showConnectionError = (message = 'Problème de connexion détecté') => {
    return addToast(message, 'error', {
      duration: 8000,
      action: {
        label: 'Réessayer',
        handler: () => window.location.reload()
      }
    })
  }

  const showConnectionRestored = (message = 'Connexion rétablie') => {
    return addToast(message, 'success', {
      duration: 3000
    })
  }

  const showSessionExpired = (message = 'Session expirée') => {
    return addToast(message, 'warning', {
      persistent: true,
      action: {
        label: 'Se reconnecter',
        handler: () => window.location.href = '/login'
      }
    })
  }

  const showReconnecting = (message = 'Reconnexion en cours...') => {
    return addToast(message, 'loading', {
      persistent: true
    })
  }

  const showOffline = (message = 'Vous êtes hors ligne') => {
    return addToast(message, 'warning', {
      persistent: true,
      action: {
        label: 'Vérifier',
        handler: () => {
          if (navigator.onLine) {
            showConnectionRestored('Connexion internet rétablie')
            clearAllToasts()
          }
        }
      }
    })
  }

  // Méthodes de convenance
  const success = (message, options) => addToast(message, 'success', options)
  const error = (message, options) => addToast(message, 'error', options)
  const warning = (message, options) => addToast(message, 'warning', options)
  const info = (message, options) => addToast(message, 'info', options)
  const loading = (message, options) => addToast(message, 'loading', options)

  return {
    // État
    toasts,
    
    // Actions générales
    addToast,
    removeToast,
    clearAllToasts,
    updateToast,
    
    // Actions spécifiques connexion
    showConnectionError,
    showConnectionRestored,
    showSessionExpired,
    showReconnecting,
    showOffline,
    
    // Méthodes de convenance
    success,
    error,
    warning,
    info,
    loading
  }
}

// Instance globale singleton
let globalToastInstance = null

export function useGlobalToast() {
  if (!globalToastInstance) {
    globalToastInstance = useConnectionToast()
  }
  return globalToastInstance
}
