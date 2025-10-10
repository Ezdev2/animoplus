# Guide d'Intégration - Solution Anti-Déconnexions Brutales

## 🎯 Objectif
Éliminer les déconnexions brutales et améliorer l'expérience utilisateur avec une gestion gracieuse des erreurs de connexion.

## 📋 Étapes d'Intégration

### Étape 1: Intégrer le Plugin de Gestion de Connexion

**Fichier: `src/main.js`**
```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// NOUVEAU: Importer le plugin de gestion de connexion
import connectionManager from '@/plugins/connectionManager.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// NOUVEAU: Activer la gestion de connexion globale
app.use(connectionManager)

app.mount('#app')
```

### Étape 2: Ajouter la Bannière de Statut dans App.vue

**Fichier: `src/App.vue`**
```vue
<template>
  <div id="app">
    <!-- NOUVEAU: Bannière de statut de connexion -->
    <ConnectionStatusBanner />
    
    <!-- Contenu existant -->
    <router-view />
  </div>
</template>

<script setup>
// Le composant ConnectionStatusBanner est automatiquement disponible
// grâce au plugin connectionManager
</script>
```

### Étape 3: Remplacer la Configuration API

**Fichier: Mettre à jour tous les imports de `config.js`**

Rechercher dans le projet:
```bash
# Rechercher tous les fichiers qui importent l'ancienne config
grep -r "from.*api/config" src/
```

Remplacer:
```javascript
// ❌ ANCIEN
import { apiClient } from '@/services/api/config.js'

// ✅ NOUVEAU
import { apiClient } from '@/services/api/configImproved.js'
```

### Étape 4: Mettre à Jour le Store d'Authentification

**Fichier: `src/stores/authPinia.js`**

Ajouter la méthode de déconnexion gracieuse:
```javascript
// Ajouter cette méthode dans le store authPinia.js
const gracefulLogout = async (reason = 'Session expirée') => {
  try {
    console.log(`🚪 Déconnexion gracieuse: ${reason}`)
    
    // Notifier l'utilisateur
    if (window.connectionStatus) {
      window.connectionStatus.showUserNotification(
        'Session expirée',
        'Vous allez être redirigé vers la page de connexion.',
        'info'
      )
    }
    
    // Attendre un peu pour que l'utilisateur voie la notification
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Déconnexion propre
    await logout()
    
  } catch (error) {
    console.error('❌ Erreur déconnexion gracieuse:', error)
    // Fallback vers déconnexion normale
    await logout()
  }
}

// Ajouter gracefulLogout dans le return du store
return {
  // ... autres propriétés existantes
  gracefulLogout
}
```

### Étape 5: Intégrer dans les Composables Existants

**Fichier: `src/composables/useMessaging.js`**

Ajouter la gestion d'erreurs:
```javascript
// Ajouter au début du composable
import { useConnectionStatus } from '@/composables/useConnectionStatus.js'

export function useMessaging() {
  // Composables existants...
  const connectionStatus = useConnectionStatus()
  
  // Wrapper pour les requêtes avec gestion d'erreurs
  const safeApiCall = async (apiCall, fallbackValue = null) => {
    try {
      const result = await apiCall()
      connectionStatus.reportSuccessfulRequest()
      return result
    } catch (error) {
      connectionStatus.reportFailedRequest(error)
      console.error('❌ Erreur API dans useMessaging:', error)
      return fallbackValue
    }
  }
  
  // Modifier refreshConversations pour utiliser safeApiCall
  const refreshConversations = async () => {
    return safeApiCall(
      () => conversationsQuery.refetch(),
      { data: [] }
    )
  }
  
  // Retourner safeApiCall pour utilisation dans d'autres méthodes
  return {
    // ... propriétés existantes
    safeApiCall
  }
}
```

## 🔧 Configuration Personnalisée

### Ajuster les Seuils de Tolérance

**Fichier: `src/config/connectionConfig.js`** (nouveau)
```javascript
export const CONNECTION_CONFIG = {
  // Nombre d'échecs avant affichage d'alerte
  maxFailedRequests: 3,
  
  // Délai entre les tentatives de retry (ms)
  retryDelay: 1000,
  
  // Intervalle de vérification de connexion (ms)
  connectionCheckInterval: 30000,
  
  // Durée d'affichage des notifications (ms)
  notificationDuration: 2000,
  
  // Timeout des requêtes API (ms)
  apiTimeout: 30000,
  
  // Nombre maximum de tentatives de retry
  maxRetries: 3
}
```

### Personnaliser les Messages

**Fichier: `src/config/messages.js`** (nouveau)
```javascript
export const CONNECTION_MESSAGES = {
  offline: {
    title: 'Hors ligne',
    message: 'Vérifiez votre connexion internet et réessayez.'
  },
  connecting: {
    title: 'Reconnexion',
    message: 'Tentative de reconnexion en cours...'
  },
  sessionExpired: {
    title: 'Session expirée',
    message: 'Votre session a expiré. Reconnexion nécessaire.'
  },
  serverError: {
    title: 'Problème serveur',
    message: 'Le serveur rencontre des difficultés. Réessayez dans quelques instants.'
  }
}
```

## 🧪 Tests et Validation

### Test 1: Simulation de Perte de Connexion
```javascript
// Dans la console du navigateur
// Simuler une perte de connexion
window.navigator.onLine = false
window.dispatchEvent(new Event('offline'))

// Vérifier que la bannière s'affiche
// Rétablir la connexion
window.navigator.onLine = true
window.dispatchEvent(new Event('online'))
```

### Test 2: Simulation d'Erreur 401
```javascript
// Modifier temporairement le token pour le rendre invalide
localStorage.setItem('data', JSON.stringify({
  token: 'invalid_token',
  refreshToken: 'invalid_refresh'
}))

// Faire une requête API et vérifier la gestion gracieuse
```

### Test 3: Simulation d'Erreur Serveur
```javascript
// Utiliser les DevTools pour simuler des erreurs 500
// Network tab > Right click > Block request URL
```

## 📊 Monitoring et Métriques

### Ajouter des Métriques Personnalisées

**Fichier: `src/utils/analytics.js`** (nouveau)
```javascript
export const trackConnectionEvent = (eventType, details = {}) => {
  console.log(`📊 Connection Event: ${eventType}`, details)
  
  // Intégrer avec votre système d'analytics
  // Par exemple: Google Analytics, Mixpanel, etc.
  if (window.gtag) {
    window.gtag('event', 'connection_issue', {
      event_category: 'connectivity',
      event_label: eventType,
      value: details.failedRequestsCount || 0
    })
  }
}
```

## 🚀 Déploiement

### Checklist Avant Déploiement

- [ ] Plugin connectionManager intégré dans main.js
- [ ] ConnectionStatusBanner ajouté dans App.vue
- [ ] Tous les imports config.js mis à jour vers configImproved.js
- [ ] Store authPinia.js mis à jour avec gracefulLogout
- [ ] Tests de simulation effectués
- [ ] Configuration personnalisée ajustée
- [ ] Métriques de monitoring configurées

### Variables d'Environnement

Ajouter dans `.env`:
```env
# Configuration de connexion
VITE_CONNECTION_MAX_RETRIES=3
VITE_CONNECTION_RETRY_DELAY=1000
VITE_API_TIMEOUT=30000
VITE_CONNECTION_CHECK_INTERVAL=30000
```

## 🔍 Dépannage

### Problème: La bannière ne s'affiche pas
**Solution:** Vérifier que le plugin est bien enregistré dans main.js

### Problème: Les notifications ne fonctionnent pas
**Solution:** Vérifier que window.connectionStatus est disponible

### Problème: Les requêtes échouent toujours
**Solution:** Vérifier la configuration du timeout et des retry

### Problème: Déconnexions toujours brutales
**Solution:** Vérifier que configImproved.js est bien utilisé partout

## 📈 Améliorations Futures

1. **Système de notification toast** plus sophistiqué
2. **Métriques de performance** en temps réel
3. **Mode hors ligne** avec cache local
4. **Synchronisation automatique** après reconnexion
5. **Prédiction des déconnexions** basée sur les patterns

## 🎯 Résultats Attendus

Après intégration complète:
- ✅ Fin des déconnexions brutales
- ✅ Notifications informatives pour l'utilisateur
- ✅ Récupération automatique des erreurs temporaires
- ✅ Expérience utilisateur fluide et professionnelle
- ✅ Monitoring et métriques de connexion
