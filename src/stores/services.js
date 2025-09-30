import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Store Pinia pour la gestion des services utilisateur
 */
export const useServicesStore = defineStore('services', () => {
  // État
  const services = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const lastFetch = ref(null)

  // Getters
  const activeServices = computed(() => 
    services.value.filter(service => service.is_active)
  )

  const servicesByType = computed(() => {
    const grouped = {}
    services.value.forEach(service => {
      const typeId = service.service_type?.id || 'unknown'
      if (!grouped[typeId]) {
        grouped[typeId] = []
      }
      grouped[typeId].push(service)
    })
    return grouped
  })

  const getServiceById = computed(() => (id) => 
    services.value.find(service => service.id === id)
  )

  // Actions
  const setServices = (newServices) => {
    services.value = Array.isArray(newServices) ? newServices : []
    lastFetch.value = new Date().toISOString()
    console.log('📝 Services mis à jour dans le store:', services.value.length)
  }

  const addService = (service) => {
    if (service && service.id) {
      // Vérifier si le service existe déjà
      const existingIndex = services.value.findIndex(s => s.id === service.id)
      if (existingIndex === -1) {
        services.value.unshift(service) // Ajouter au début
        console.log('➕ Service ajouté au store:', service.name)
      } else {
        console.log('⚠️ Service déjà existant dans le store:', service.id)
      }
    }
  }

  const updateService = (updatedService) => {
    if (updatedService && updatedService.id) {
      const index = services.value.findIndex(s => s.id === updatedService.id)
      if (index !== -1) {
        services.value[index] = { ...services.value[index], ...updatedService }
        console.log('✏️ Service mis à jour dans le store:', updatedService.name)
      } else {
        console.log('⚠️ Service non trouvé pour mise à jour:', updatedService.id)
      }
    }
  }

  const removeService = (serviceId) => {
    console.log('🔍 removeService appelé avec ID:', serviceId, 'Type:', typeof serviceId)
    console.log('📝 IDs disponibles dans le store:', services.value.map(s => ({ id: s.id, type: typeof s.id, name: s.name })))
    
    // Tentative avec comparaison stricte
    let index = services.value.findIndex(s => s.id === serviceId)
    console.log('📍 Index trouvé (strict):', index)
    
    // Si pas trouvé avec comparaison stricte, essayer avec comparaison loose
    if (index === -1) {
      console.log('🔄 Tentative avec comparaison loose (==)')
      index = services.value.findIndex(s => s.id == serviceId)
      console.log('📍 Index trouvé (loose):', index)
    }
    
    // Si toujours pas trouvé, essayer avec conversion string
    if (index === -1) {
      console.log('🔄 Tentative avec conversion string')
      index = services.value.findIndex(s => String(s.id) === String(serviceId))
      console.log('📍 Index trouvé (string):', index)
    }
    
    if (index !== -1) {
      const removedService = services.value.splice(index, 1)[0]
      console.log('✅ Service supprimé du store:', removedService.name)
      console.log('📊 Nombre de services restants:', services.value.length)
    } else {
      console.log('❌ Service non trouvé pour suppression:', serviceId)
      console.log('🔍 Détails de comparaison:')
      services.value.forEach((s, idx) => {
        console.log(`   Service ${idx}: ${s.id} (${typeof s.id}) vs ${serviceId} (${typeof serviceId})`)
        console.log(`     Strict (===): ${s.id === serviceId}`)
        console.log(`     Loose (==): ${s.id == serviceId}`)
        console.log(`     String: ${String(s.id) === String(serviceId)}`)
      })
    }
  }

  const toggleServiceStatus = (serviceId) => {
    const service = services.value.find(s => s.id === serviceId)
    if (service) {
      service.is_active = !service.is_active
      console.log('🔄 Statut du service modifié:', service.name, service.is_active ? 'Actif' : 'Inactif')
    }
  }

  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const setError = (err) => {
    error.value = err
  }

  const clearServices = () => {
    services.value = []
    error.value = null
    lastFetch.value = null
    console.log('🗑️ Store services vidé')
  }

  // Utilitaires
  const getServicesByUserId = (userId) => {
    return services.value.filter(service => service.user_id === userId)
  }

  const getServicesByTypeId = (typeId) => {
    return services.value.filter(service => service.service_type?.id === typeId)
  }

  const searchServices = (query) => {
    if (!query) return services.value
    const lowerQuery = query.toLowerCase()
    return services.value.filter(service => 
      service.name?.toLowerCase().includes(lowerQuery) ||
      service.description?.toLowerCase().includes(lowerQuery) ||
      service.service_type?.name?.toLowerCase().includes(lowerQuery)
    )
  }

  return {
    // État
    services,
    isLoading,
    error,
    lastFetch,
    
    // Getters
    activeServices,
    servicesByType,
    getServiceById,
    
    // Actions
    setServices,
    addService,
    updateService,
    removeService,
    toggleServiceStatus,
    setLoading,
    setError,
    clearServices,
    
    // Utilitaires
    getServicesByUserId,
    getServicesByTypeId,
    searchServices
  }
})
