import { useConnectionStatus } from '@/composables/useConnectionStatus.js'
import { useGlobalToast } from '@/composables/useConnectionToast.js'
import ConnectionStatusBanner from '@/components/ConnectionStatusBanner.vue'
import ConnectionToast from '@/components/ConnectionToast.vue'

/**
 * Plugin global pour gérer l'état de connexion dans toute l'application
 */
export default {
  install(app) {
    // Créer une instance globale du gestionnaire de connexion
    const connectionStatus = useConnectionStatus()
    const globalToast = useGlobalToast()
    
    // Rendre disponible globalement
    app.config.globalProperties.$connectionStatus = connectionStatus
    app.config.globalProperties.$toast = globalToast
    window.connectionStatus = connectionStatus
    window.globalToast = globalToast
    
    // Enregistrer les composants globalement
    app.component('ConnectionStatusBanner', ConnectionStatusBanner)
    app.component('ConnectionToast', ConnectionToast)
    
    // Ajouter des méthodes utilitaires globales
    app.config.globalProperties.$isOnline = () => connectionStatus.isOnline.value
    app.config.globalProperties.$forceReconnect = () => connectionStatus.forceReconnect()
    
    // Gestionnaire global d'erreurs non capturées
    app.config.errorHandler = (error, instance, info) => {
      console.error('❌ Erreur Vue non capturée:', error, info)
      
      // Si c'est une erreur réseau, la signaler
      if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
        connectionStatus.reportFailedRequest(error)
      }
    }
    
    // Gestionnaire d'erreurs de promesses non capturées
    window.addEventListener('unhandledrejection', (event) => {
      console.error('❌ Promesse rejetée non capturée:', event.reason)
      
      // Si c'est une erreur d'API, la signaler
      if (event.reason?.config?.url) {
        connectionStatus.reportFailedRequest(event.reason)
      }
    })
    
    console.log('✅ Plugin ConnectionManager initialisé')
  }
}
