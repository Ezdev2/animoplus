import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { serviceService } from './serviceService.js'
import { useServicesStore } from '@/stores/services.js'

// Clés de requête pour les services
export const SERVICE_QUERY_KEYS = {
  all: ['services'],
  lists: () => [...SERVICE_QUERY_KEYS.all, 'list'],
  list: (filters) => [...SERVICE_QUERY_KEYS.lists(), filters],
  details: () => [...SERVICE_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...SERVICE_QUERY_KEYS.details(), id],
  userServices: (userId) => [...SERVICE_QUERY_KEYS.all, 'user', userId],
  serviceTypes: () => [...SERVICE_QUERY_KEYS.all, 'types'],
  search: (searchTerm, options) => [...SERVICE_QUERY_KEYS.all, 'search', searchTerm, options]
}

/**
 * Hook pour récupérer tous les services avec filtres
 * @param {Object} options - Options de requête
 * @returns {Object} Query TanStack Query
 */
export function useServices(options = {}) {
  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.list(options),
    queryFn: () => serviceService.getAllServices(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: true
  })
}

/**
 * Hook pour rechercher des services
 * @param {string} searchTerm - Terme de recherche
 * @param {Object} options - Options de recherche
 * @returns {Object} Query TanStack Query
 */
export function useSearchServices(searchTerm, options = {}) {
  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.search(searchTerm, options),
    queryFn: () => {
      // S'assurer que searchTerm est une string
      const searchString = typeof searchTerm === 'object' && searchTerm.value 
        ? String(searchTerm.value).trim() 
        : String(searchTerm || '').trim()
      
      console.log('🔍 useSearchServices - searchTerm:', searchTerm, typeof searchTerm)
      console.log('🔍 useSearchServices - searchString:', searchString, typeof searchString)
      
      return serviceService.getAllServices({
        search: searchString,
        ...options
      })
    },
    enabled: !!searchTerm && (
      typeof searchTerm === 'object' && searchTerm.value 
        ? searchTerm.value.length >= 2 
        : String(searchTerm).length >= 2
    ),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000,  // 5 minutes
  })
}

/**
 * Hook pour récupérer les types de services
 * @returns {Object} Query TanStack Query
 */
export function useServiceTypes() {
  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.serviceTypes(),
    queryFn: () => serviceService.getServiceTypes(),
    staleTime: 10 * 60 * 1000, // 10 minutes (les types changent rarement)
    cacheTime: 30 * 60 * 1000, // 30 minutes
    select: (data) => data?.data || []
  })
}

/**
 * Hook pour récupérer les services d'un utilisateur spécifique
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} options - Options de requête
 * @returns {Object} Query TanStack Query
 */
export function useUserServices(userId, options = {}) {
  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.userServices(userId),
    queryFn: () => serviceService.getUserServices(userId, options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!userId // Seulement si userId est fourni
  })
}

/**
 * Hook pour récupérer un service par son ID
 * @param {string} serviceId - ID du service
 * @param {Object} options - Options d'inclusion
 * @returns {Object} Query TanStack Query
 */
export function useService(serviceId, options = {}) {
  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.detail(serviceId),
    queryFn: () => serviceService.getServiceById(serviceId, options),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: !!serviceId
  })
}

/**
 * Hook pour créer un nouveau service
 * @param {Object} options - Options de la mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useCreateService(options = {}) {
  const queryClient = useQueryClient()
  const servicesStore = useServicesStore()

  return useMutation({
    mutationFn: (serviceData) => serviceService.createService(serviceData),
    onSuccess: (data, variables) => {
      console.log('✅ Service créé avec succès:', data)
      
      // Mettre à jour le store Pinia avec le nouveau service
      if (data.success && data.data) {
        console.log('📝 Ajout du nouveau service au store Pinia:', data.data)
        servicesStore.addService(data.data)
      }
      
      // Invalider tous les caches de services pour forcer le rechargement
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.lists() })
      
      // Invalider spécifiquement le cache avec les options utilisées
      const currentOptions = { user_id: variables.user_id, with_service_type: true }
      queryClient.invalidateQueries({ 
        queryKey: SERVICE_QUERY_KEYS.list(currentOptions)
      })
      
      console.log('🔄 Caches invalidés pour forcer le rechargement des services')
    },
    onError: (error) => {
      console.error('❌ Erreur création service:', error)
      servicesStore.setError(error)
    },
    ...options
  })
}

/**
 * Hook pour mettre à jour un service
 * @param {Object} options - Options de la mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useUpdateService(options = {}) {
  const queryClient = useQueryClient()
  const servicesStore = useServicesStore()

  return useMutation({
    mutationFn: ({ id, data }) => serviceService.updateService(id, data),
    onSuccess: (data, variables) => {
      console.log('✅ Service modifié avec succès:', data)
      
      // Mettre à jour le store Pinia avec le service modifié
      if (data.success && data.data) {
        console.log('📝 Mise à jour du service dans le store Pinia:', data.data)
        servicesStore.updateService(data.data)
      }
      
      // Mettre à jour le cache TanStack Query
      queryClient.setQueryData(SERVICE_QUERY_KEYS.lists(), (oldData) => {
        if (!oldData || !oldData.data) return oldData
        
        const updatedTasks = oldData.data.map(service => 
          service.id === variables.id ? { ...service, ...data.data } : service
        )
        
        return { ...oldData, data: updatedTasks }
      })
      
      // Mettre à jour le cache du service spécifique
      queryClient.setQueryData(SERVICE_QUERY_KEYS.detail(variables.id), data)
    },
    onError: (error) => {
      console.error('❌ Erreur modification service:', error)
      servicesStore.setError(error)
    },
    ...options
  })
}

/**
 * Hook pour supprimer un service avec Optimistic Update
 * @param {Object} options - Options de la mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useDeleteService(options = {}) {
  const queryClient = useQueryClient()
  const servicesStore = useServicesStore()

  return useMutation({
    mutationFn: (id) => serviceService.deleteService(id),
    onSuccess: (data, serviceId) => {
      console.log('✅ Service supprimé avec succès:', data)
      
      // Mettre à jour le store Pinia en supprimant le service
      if (data.success) {
        console.log('🗑️ Suppression du service du store Pinia:', serviceId)
        servicesStore.removeService(serviceId)
      }
      
      // Mettre à jour le cache TanStack Query
      queryClient.setQueryData(SERVICE_QUERY_KEYS.lists(), (oldData) => {
        if (!oldData || !oldData.data) return oldData
        
        const filteredServices = oldData.data.filter(service => service.id !== serviceId)
        
        return { ...oldData, data: filteredServices }
      })
    },
    onError: (error) => {
      console.error('❌ Erreur suppression service:', error)
      servicesStore.setError(error)
    },
    ...options
  })
}

/**
 * Hook pour activer/désactiver un service
 * @param {Object} options - Options de la mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useToggleServiceStatus(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, enabled }) => serviceService.toggleServiceStatus(id, enabled),
    onSuccess: (data, variables) => {
      const { id } = variables
      
      // Mettre à jour le cache du service spécifique
      queryClient.setQueryData(SERVICE_QUERY_KEYS.detail(id), data)
      
      // Invalider les listes
      queryClient.invalidateQueries({ 
        queryKey: SERVICE_QUERY_KEYS.lists(),
        refetchType: 'active'
      })
      
      // Invalider les services utilisateur
      if (data?.data?.user_id) {
        queryClient.invalidateQueries({ 
          queryKey: SERVICE_QUERY_KEYS.userServices(data.data.user_id),
          refetchType: 'active'
        })
      }
    },
    ...options
  })
}


/**
 * Hook pour récupérer les services par type
 * @param {string} serviceTypeId - ID du type de service
 * @param {Object} options - Options supplémentaires
 * @returns {Object} Query TanStack Query
 */
export function useServicesByType(serviceTypeId, options = {}) {
  const typeOptions = {
    services_types_id: serviceTypeId,
    with_user: true,
    with_service_type: true,
    enabled_only: true,
    ...options
  }

  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.list(typeOptions),
    queryFn: () => serviceService.getAllServices(typeOptions),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: !!serviceTypeId
  })
}
