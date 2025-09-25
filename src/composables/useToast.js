import { ref, reactive } from 'vue'

// État global des toasts
const toasts = ref([])
let toastId = 0

/**
 * Composable pour gérer les notifications toast
 */
export function useToast() {
  
  /**
   * Ajouter un toast
   * @param {Object} options - Options du toast
   */
  function addToast(options) {
    const id = ++toastId
    const toast = {
      id,
      type: options.type || 'info', // success, error, warning, info
      title: options.title || '',
      message: options.message || '',
      duration: options.duration || 5000,
      persistent: options.persistent || false,
      actions: options.actions || []
    }
    
    toasts.value.push(toast)
    
    // Auto-suppression si pas persistant
    if (!toast.persistent && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration)
    }
    
    return id
  }
  
  /**
   * Supprimer un toast
   * @param {number} id - ID du toast
   */
  function removeToast(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  /**
   * Supprimer tous les toasts
   */
  function clearToasts() {
    toasts.value = []
  }
  
  /**
   * Toast de succès
   * @param {string} message - Message de succès
   * @param {Object} options - Options supplémentaires
   */
  function success(message, options = {}) {
    return addToast({
      type: 'success',
      title: options.title || 'Succès',
      message,
      duration: options.duration || 3000,
      ...options
    })
  }
  
  /**
   * Toast d'erreur
   * @param {string} message - Message d'erreur
   * @param {Object} options - Options supplémentaires
   */
  function error(message, options = {}) {
    return addToast({
      type: 'error',
      title: options.title || 'Erreur',
      message,
      duration: options.duration || 7000,
      ...options
    })
  }
  
  /**
   * Toast d'avertissement
   * @param {string} message - Message d'avertissement
   * @param {Object} options - Options supplémentaires
   */
  function warning(message, options = {}) {
    return addToast({
      type: 'warning',
      title: options.title || 'Attention',
      message,
      duration: options.duration || 5000,
      ...options
    })
  }
  
  /**
   * Toast d'information
   * @param {string} message - Message d'information
   * @param {Object} options - Options supplémentaires
   */
  function info(message, options = {}) {
    return addToast({
      type: 'info',
      title: options.title || 'Information',
      message,
      duration: options.duration || 4000,
      ...options
    })
  }
  
  /**
   * Toast avec action de restauration
   * @param {string} message - Message
   * @param {Function} onRestore - Fonction de restauration
   * @param {Object} options - Options supplémentaires
   */
  function errorWithRestore(message, onRestore, options = {}) {
    return addToast({
      type: 'error',
      title: options.title || 'Erreur de suppression',
      message,
      duration: options.duration || 10000,
      actions: [
        {
          label: 'Restaurer',
          action: onRestore,
          primary: true
        },
        {
          label: 'Ignorer',
          action: () => {} // Ne fait rien, le toast se fermera
        }
      ],
      ...options
    })
  }
  
  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
    errorWithRestore
  }
}
