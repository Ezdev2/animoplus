import { ref, computed, watch } from 'vue'

/**
 * Composable pour gérer les préférences d'affichage de chargement
 */
export function useLoadingPreferences() {
  // Préférences stockées dans localStorage
  const STORAGE_KEY = 'animoplus_loading_preferences'
  
  // Valeurs par défaut
  const defaultPreferences = {
    loadingType: 'skeleton', // 'skeleton', 'spinner', 'dots', 'pulse', 'bars'
    animationSpeed: 'normal', // 'slow', 'normal', 'fast'
    showProgress: false,
    showMessages: true,
    theme: 'light' // 'light', 'dark', 'auto'
  }
  
  // État réactif des préférences
  const preferences = ref({ ...defaultPreferences })
  
  // Charger les préférences depuis localStorage
  const loadPreferences = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        preferences.value = { ...defaultPreferences, ...parsed }
      }
    } catch (error) {
      console.error('Erreur chargement préférences loading:', error)
      preferences.value = { ...defaultPreferences }
    }
  }
  
  // Sauvegarder les préférences dans localStorage
  const savePreferences = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences.value))
    } catch (error) {
      console.error('Erreur sauvegarde préférences loading:', error)
    }
  }
  
  // Watcher pour sauvegarder automatiquement
  watch(preferences, savePreferences, { deep: true })
  
  // Getters computed
  const loadingType = computed(() => preferences.value.loadingType)
  const animationSpeed = computed(() => preferences.value.animationSpeed)
  const showProgress = computed(() => preferences.value.showProgress)
  const showMessages = computed(() => preferences.value.showMessages)
  const theme = computed(() => preferences.value.theme)
  
  // Configuration pour les composants de chargement
  const loadingConfig = computed(() => {
    const config = {
      type: loadingType.value,
      animated: true,
      showMessage: showMessages.value,
      showProgress: showProgress.value
    }
    
    // Ajuster la vitesse d'animation
    switch (animationSpeed.value) {
      case 'slow':
        config.animationDuration = '2s'
        break
      case 'fast':
        config.animationDuration = '0.8s'
        break
      default:
        config.animationDuration = '1.5s'
    }
    
    return config
  })
  
  // Méthodes pour modifier les préférences
  const setLoadingType = (type) => {
    if (['skeleton', 'spinner', 'dots', 'pulse', 'bars'].includes(type)) {
      preferences.value.loadingType = type
    }
  }
  
  const setAnimationSpeed = (speed) => {
    if (['slow', 'normal', 'fast'].includes(speed)) {
      preferences.value.animationSpeed = speed
    }
  }
  
  const toggleProgress = () => {
    preferences.value.showProgress = !preferences.value.showProgress
  }
  
  const toggleMessages = () => {
    preferences.value.showMessages = !preferences.value.showMessages
  }
  
  const setTheme = (newTheme) => {
    if (['light', 'dark', 'auto'].includes(newTheme)) {
      preferences.value.theme = newTheme
    }
  }
  
  // Réinitialiser aux valeurs par défaut
  const resetPreferences = () => {
    preferences.value = { ...defaultPreferences }
  }
  
  // Préférences prédéfinies
  const presets = {
    minimal: {
      loadingType: 'skeleton',
      animationSpeed: 'fast',
      showProgress: false,
      showMessages: false,
      theme: 'light'
    },
    detailed: {
      loadingType: 'spinner',
      animationSpeed: 'normal',
      showProgress: true,
      showMessages: true,
      theme: 'light'
    },
    modern: {
      loadingType: 'dots',
      animationSpeed: 'normal',
      showProgress: false,
      showMessages: true,
      theme: 'auto'
    }
  }
  
  const applyPreset = (presetName) => {
    if (presets[presetName]) {
      preferences.value = { ...presets[presetName] }
    }
  }
  
  // Initialisation
  loadPreferences()
  
  return {
    // État
    preferences,
    
    // Getters
    loadingType,
    animationSpeed,
    showProgress,
    showMessages,
    theme,
    loadingConfig,
    
    // Actions
    setLoadingType,
    setAnimationSpeed,
    toggleProgress,
    toggleMessages,
    setTheme,
    resetPreferences,
    applyPreset,
    
    // Utilitaires
    loadPreferences,
    savePreferences,
    presets
  }
}

/**
 * Composable pour les messages de chargement contextuels améliorés
 */
export function useContextualLoadingMessages() {
  const messages = {
    // Messages par contexte
    dashboard: {
      messages: {
        loading: 'Synchronisation de vos conversations...',
        empty: 'Aucune conversation récente',
        error: 'Impossible de charger les messages'
      },
      appointments: {
        loading: 'Recherche de vos rendez-vous...',
        empty: 'Aucun rendez-vous planifié',
        error: 'Impossible de charger les rendez-vous'
      },
      stats: {
        loading: 'Calcul de vos statistiques...',
        empty: 'Aucune donnée disponible',
        error: 'Impossible de charger les statistiques'
      }
    },
    
    profile: {
      loading: 'Chargement de votre profil...',
      saving: 'Sauvegarde en cours...',
      uploading: 'Upload de votre photo...',
      error: 'Erreur lors du chargement du profil'
    },
    
    animals: {
      loading: 'Récupération de vos animaux...',
      saving: 'Enregistrement des informations...',
      uploading: 'Upload des photos...',
      error: 'Impossible de charger vos animaux'
    }
  }
  
  const getMessage = (context, action = 'loading') => {
    const contextMessages = messages[context]
    if (!contextMessages) return 'Chargement...'
    
    if (typeof contextMessages === 'object' && !contextMessages[action]) {
      return contextMessages.loading || 'Chargement...'
    }
    
    return contextMessages[action] || contextMessages.loading || 'Chargement...'
  }
  
  const getRandomMessage = (context) => {
    const variations = [
      'Préparation des données...',
      'Synchronisation en cours...',
      'Mise à jour...',
      'Chargement...',
      'Récupération des informations...'
    ]
    
    return variations[Math.floor(Math.random() * variations.length)]
  }
  
  return {
    getMessage,
    getRandomMessage,
    messages
  }
}

/**
 * Hook pour détecter les connexions lentes et adapter l'affichage
 */
export function useAdaptiveLoading() {
  const connectionSpeed = ref('fast') // 'slow', 'medium', 'fast'
  const loadingStartTime = ref(null)
  const adaptiveConfig = ref({})
  
  // Détecter la vitesse de connexion
  const detectConnectionSpeed = () => {
    if ('connection' in navigator) {
      const connection = navigator.connection
      const effectiveType = connection.effectiveType
      
      switch (effectiveType) {
        case 'slow-2g':
        case '2g':
          connectionSpeed.value = 'slow'
          break
        case '3g':
          connectionSpeed.value = 'medium'
          break
        case '4g':
        default:
          connectionSpeed.value = 'fast'
      }
    }
  }
  
  // Adapter la configuration selon la vitesse
  const getAdaptiveConfig = (baseConfig = {}) => {
    const config = { ...baseConfig }
    
    switch (connectionSpeed.value) {
      case 'slow':
        config.showProgress = true
        config.showMessages = true
        config.type = 'spinner' // Plus simple pour les connexions lentes
        config.animationSpeed = 'slow'
        break
        
      case 'medium':
        config.showProgress = false
        config.showMessages = true
        config.type = 'dots'
        config.animationSpeed = 'normal'
        break
        
      case 'fast':
      default:
        config.showProgress = false
        config.showMessages = false
        config.type = 'skeleton'
        config.animationSpeed = 'fast'
    }
    
    return config
  }
  
  // Démarrer le suivi du temps de chargement
  const startLoadingTimer = () => {
    loadingStartTime.value = Date.now()
  }
  
  // Calculer le temps de chargement
  const getLoadingDuration = () => {
    if (!loadingStartTime.value) return 0
    return Date.now() - loadingStartTime.value
  }
  
  // Initialisation
  detectConnectionSpeed()
  
  return {
    connectionSpeed,
    getAdaptiveConfig,
    startLoadingTimer,
    getLoadingDuration,
    detectConnectionSpeed
  }
}
