import { createPinia } from 'pinia'

// Créer l'instance Pinia
export const pinia = createPinia()

// Plugin pour persister certains stores dans localStorage
const persistPlugin = ({ store }) => {
  // Liste des stores à persister
  const persistedStores = ['auth', 'user']
  
  if (persistedStores.includes(store.$id)) {
    // Charger l'état depuis localStorage au démarrage
    const savedState = localStorage.getItem(`pinia-${store.$id}`)
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        store.$patch(parsedState)
      } catch (error) {
        console.error(`Erreur lors du chargement du store ${store.$id}:`, error)
      }
    }

    // Sauvegarder l'état à chaque changement
    store.$subscribe((mutation, state) => {
      try {
        localStorage.setItem(`pinia-${store.$id}`, JSON.stringify(state))
      } catch (error) {
        console.error(`Erreur lors de la sauvegarde du store ${store.$id}:`, error)
      }
    })
  }
}

// Ajouter le plugin de persistance
pinia.use(persistPlugin)

export default pinia
