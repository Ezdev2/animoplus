import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Pinia pour la gestion d'état
import { pinia } from './stores/index.js'

// TanStack Query pour la gestion des requêtes
import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClientConfig } from './plugins/query.js'

// Utilitaires de test pour le développement
if (import.meta.env.DEV) {
  import('./utils/testAuthConsistency.js').then(() => {
    console.log('🔧 Utilitaires de test disponibles dans la console:')
    console.log('  - testAuthConsistency() : Vérifier la cohérence')
    console.log('  - testNoDuplication() : Vérifier l\'élimination des doublons')
    console.log('  - testAxiosIntegration() : Tester l\'intégration Axios')
    console.log('  - testAutoRefresh() : Tester l\'auto-refresh des tokens')
    console.log('  - testProfileSync() : Vérifier la synchronisation du profil')
    console.log('  - testAvatarUpload() : Tester la configuration avatar/Cloudinary')
    console.log('  - testAvatarSync() : Vérifier la synchronisation avatar')
    console.log('  - testRolePermissions() : Tester les permissions par rôle')
    console.log('  - cleanAuthData() : Nettoyer les anciennes données')
    console.log('  - simulateLogin("client"|"veterinarian") : Simuler connexion')
    console.log('  - simulateLogout() : Simuler déconnexion')
  })
}

const app = createApp(App)

// Configuration des plugins
app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, queryClientConfig)

app.mount('#app')
