import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { lostAnimalsService } from './lostAnimalsService.js'
import { useToast } from '@/composables/useToast.js'

// === QUERY KEYS ===
export const LOST_ANIMALS_QUERY_KEYS = {
  all: ['lost-animals'],
  lists: () => [...LOST_ANIMALS_QUERY_KEYS.all, 'list'],
  list: (filters) => [...LOST_ANIMALS_QUERY_KEYS.lists(), { filters }],
  details: () => [...LOST_ANIMALS_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...LOST_ANIMALS_QUERY_KEYS.details(), id],
  pending: () => [...LOST_ANIMALS_QUERY_KEYS.all, 'pending'],
  approved: () => [...LOST_ANIMALS_QUERY_KEYS.all, 'approved'],
  resolved: () => [...LOST_ANIMALS_QUERY_KEYS.all, 'resolved'],
  search: (params) => [...LOST_ANIMALS_QUERY_KEYS.all, 'search', params],
  stats: () => [...LOST_ANIMALS_QUERY_KEYS.all, 'stats'],
  myAnimals: () => [...LOST_ANIMALS_QUERY_KEYS.all, 'my-animals']
}

// === QUERIES ===

/**
 * Hook pour récupérer la liste des annonces
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useLostAnimalsQuery = (options = {}) => {
  return useQuery({
    queryKey: LOST_ANIMALS_QUERY_KEYS.list(options),
    queryFn: () => lostAnimalsService.getLostAnimals(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour récupérer une annonce par ID
 * @param {string} animalId - ID de l'annonce
 * @returns {Object} Query result
 */
export const useLostAnimalQuery = (animalId) => {
  return useQuery({
    queryKey: LOST_ANIMALS_QUERY_KEYS.detail(animalId),
    queryFn: () => lostAnimalsService.getLostAnimalById(animalId),
    enabled: !!animalId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour récupérer les annonces en attente (modération)
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const usePendingAnimalsQuery = (options = {}) => {
  return useQuery({
    queryKey: LOST_ANIMALS_QUERY_KEYS.pending(),
    queryFn: () => lostAnimalsService.getLostAnimals({ status: 'pending', ...options }),
    staleTime: 1 * 60 * 1000, // 1 minute (plus fréquent pour modération)
    cacheTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 2 * 60 * 1000, // Refresh toutes les 2 minutes
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour recherche géographique
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude  
 * @param {number} radius - Rayon en km
 * @param {Object} options - Options additionnelles
 * @returns {Object} Query result
 */
export const useLocationSearchQuery = (latitude, longitude, radius = 5, options = {}) => {
  const searchParams = { latitude, longitude, radius, ...options }
  
  return useQuery({
    queryKey: LOST_ANIMALS_QUERY_KEYS.search(searchParams),
    queryFn: () => lostAnimalsService.searchByLocation(latitude, longitude, radius, options),
    enabled: !!(latitude && longitude),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour récupérer les annonces approuvées
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useApprovedAnimalsQuery = (options = {}) => {
  return useQuery({
    queryKey: LOST_ANIMALS_QUERY_KEYS.approved(),
    queryFn: () => lostAnimalsService.getLostAnimals({ status: 'approved', ...options }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour récupérer les annonces résolues
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useResolvedAnimalsQuery = (options = {}) => {
  return useQuery({
    queryKey: LOST_ANIMALS_QUERY_KEYS.resolved(),
    queryFn: () => lostAnimalsService.getLostAnimals({ status: 'resolved', ...options }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour récupérer mes annonces
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useMyAnimalsQuery = (options = {}) => {
  return useQuery({
    queryKey: LOST_ANIMALS_QUERY_KEYS.myAnimals(),
    queryFn: () => lostAnimalsService.getMyAnimals(options),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour récupérer les statistiques des annonces
 * @returns {Object} Query result
 */
export const useAnimalsStatsQuery = () => {
  return useQuery({
    queryKey: LOST_ANIMALS_QUERY_KEYS.stats(),
    queryFn: () => lostAnimalsService.getAnimalsStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

// === MUTATIONS ===

/**
 * Hook pour créer une annonce
 * @param {Object} options - Options de callback
 * @returns {Object} Mutation result
 */
export const useCreateLostAnimal = (options = {}) => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  
  return useMutation({
    mutationFn: (animalData) => lostAnimalsService.createLostAnimal(animalData),
    onSuccess: (data, variables) => {
      console.log('✅ Annonce créée avec succès:', data)
      
      // Toast de succès
      showToast({
        type: 'success',
        title: 'Annonce créée',
        message: data.message || 'Votre annonce a été créée avec succès'
      })
      
      // Invalider les listes pour forcer le rechargement
      queryClient.invalidateQueries({
        queryKey: LOST_ANIMALS_QUERY_KEYS.lists()
      })
      
      // Invalider les statistiques
      queryClient.invalidateQueries({
        queryKey: LOST_ANIMALS_QUERY_KEYS.stats()
      })
      
      // Ajouter aux caches existants (optimistic update)
      queryClient.setQueriesData(
        { queryKey: LOST_ANIMALS_QUERY_KEYS.lists() },
        (oldData) => {
          if (!oldData?.data) return oldData
          
          // Ajouter la nouvelle annonce au début
          const newData = { ...oldData }
          if (Array.isArray(newData.data)) {
            newData.data.unshift(data.data)
          }
          
          return newData
        }
      )
      
      // Callback personnalisé
      if (options.onSuccess) {
        options.onSuccess(data, variables)
      }
    },
    onError: (error, variables) => {
      console.error('❌ Erreur création annonce:', error)
      
      // Toast d'erreur
      showToast({
        type: 'error',
        title: 'Erreur de création',
        message: error.response?.data?.message || error.message || 'Erreur lors de la création de l\'annonce'
      })
      
      if (options.onError) {
        options.onError(error, variables)
      }
    }
  })
}

/**
 * Hook pour modifier une annonce
 */
export const useUpdateLostAnimal = (options = {}) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => lostAnimalsService.updateLostAnimal(id, data),
    onSuccess: (data, variables) => {
      console.log('✅ Annonce modifiée avec succès:', data)
      
      // Mettre à jour le cache de l'annonce spécifique
      queryClient.setQueryData(
        LOST_ANIMALS_QUERY_KEYS.detail(variables.id),
        data
      )
      
      // Mettre à jour dans les listes
      queryClient.setQueriesData(
        { queryKey: LOST_ANIMALS_QUERY_KEYS.lists() },
        (oldData) => {
          if (!oldData?.data) return oldData
          
          const updateInArray = (array) => {
            return array.map(item => 
              item.id === variables.id ? { ...item, ...data.data } : item
            )
          }
          
          const newData = { ...oldData }
          if (Array.isArray(newData.data.data)) {
            newData.data.data = updateInArray(newData.data.data)
          } else if (Array.isArray(newData.data)) {
            newData.data = updateInArray(newData.data)
          }
          
          return newData
        }
      )
      
      if (options.onSuccess) {
        options.onSuccess(data, variables)
      }
    },
    onError: (error, variables) => {
      console.error('❌ Erreur modification annonce:', error)
      
      if (options.onError) {
        options.onError(error, variables)
      }
    }
  })
}

/**
 * Hook pour supprimer une annonce
 */
export const useDeleteLostAnimal = (options = {}) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => lostAnimalsService.deleteLostAnimal(id),
    onSuccess: (data, id) => {
      console.log('✅ Annonce supprimée avec succès:', id)
      
      // Supprimer du cache
      queryClient.removeQueries({
        queryKey: LOST_ANIMALS_QUERY_KEYS.detail(id)
      })
      
      // Supprimer des listes (optimistic update)
      queryClient.setQueriesData(
        { queryKey: LOST_ANIMALS_QUERY_KEYS.lists() },
        (oldData) => {
          if (!oldData?.data) return oldData
          
          const filterArray = (array) => array.filter(item => item.id !== id)
          
          const newData = { ...oldData }
          if (Array.isArray(newData.data.data)) {
            newData.data.data = filterArray(newData.data.data)
          } else if (Array.isArray(newData.data)) {
            newData.data = filterArray(newData.data)
          }
          
          return newData
        }
      )
      
      if (options.onSuccess) {
        options.onSuccess(data, id)
      }
    },
    onError: (error, id) => {
      console.error('❌ Erreur suppression annonce:', error)
      
      if (options.onError) {
        options.onError(error, id)
      }
    }
  })
}

/**
 * Hook pour résoudre une annonce
 */
export const useResolveLostAnimal = (options = {}) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data = {} }) => lostAnimalsService.resolveLostAnimal(id, data),
    onSuccess: (data, variables) => {
      console.log('✅ Annonce résolue avec succès:', variables.id)
      
      // Mettre à jour le statut dans les caches
      const updateStatus = (item) => 
        item.id === variables.id ? { ...item, status: 'resolved', ...data.data } : item
      
      // Mettre à jour le détail
      queryClient.setQueryData(
        LOST_ANIMALS_QUERY_KEYS.detail(variables.id),
        (oldData) => oldData ? { ...oldData, status: 'resolved', ...data } : oldData
      )
      
      // Mettre à jour dans les listes
      queryClient.setQueriesData(
        { queryKey: LOST_ANIMALS_QUERY_KEYS.lists() },
        (oldData) => {
          if (!oldData?.data) return oldData
          
          const newData = { ...oldData }
          if (Array.isArray(newData.data.data)) {
            newData.data.data = newData.data.data.map(updateStatus)
          } else if (Array.isArray(newData.data)) {
            newData.data = newData.data.map(updateStatus)
          }
          
          return newData
        }
      )
      
      if (options.onSuccess) {
        options.onSuccess(data, variables)
      }
    },
    onError: (error, variables) => {
      console.error('❌ Erreur résolution annonce:', error)
      
      if (options.onError) {
        options.onError(error, variables)
      }
    }
  })
}

/**
 * Hook pour approuver une annonce (modération)
 */
export const useApproveLostAnimal = (options = {}) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data = {} }) => lostAnimalsService.approveLostAnimal(id, data),
    onSuccess: (data, variables) => {
      console.log('✅ Annonce approuvée avec succès:', variables.id)
      
      // Invalider les listes pour refléter le changement de statut
      queryClient.invalidateQueries({
        queryKey: LOST_ANIMALS_QUERY_KEYS.lists()
      })
      
      queryClient.invalidateQueries({
        queryKey: LOST_ANIMALS_QUERY_KEYS.pending()
      })
      
      // Mettre à jour le détail
      queryClient.setQueryData(
        LOST_ANIMALS_QUERY_KEYS.detail(variables.id),
        (oldData) => oldData ? { ...oldData, status: 'approved', ...data } : oldData
      )
      
      if (options.onSuccess) {
        options.onSuccess(data, variables)
      }
    },
    onError: (error, variables) => {
      console.error('❌ Erreur approbation annonce:', error)
      
      if (options.onError) {
        options.onError(error, variables)
      }
    }
  })
}

/**
 * Hook pour rejeter une annonce (modération)
 */
export const useRejectLostAnimal = (options = {}) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data = {} }) => lostAnimalsService.rejectLostAnimal(id, data),
    onSuccess: (data, variables) => {
      console.log('✅ Annonce rejetée avec succès:', variables.id)
      
      // Invalider les listes
      queryClient.invalidateQueries({
        queryKey: LOST_ANIMALS_QUERY_KEYS.lists()
      })
      
      queryClient.invalidateQueries({
        queryKey: LOST_ANIMALS_QUERY_KEYS.pending()
      })
      
      // Mettre à jour le détail
      queryClient.setQueryData(
        LOST_ANIMALS_QUERY_KEYS.detail(variables.id),
        (oldData) => oldData ? { ...oldData, status: 'rejected', ...data } : oldData
      )
      
      if (options.onSuccess) {
        options.onSuccess(data, variables)
      }
    },
    onError: (error, variables) => {
      console.error('❌ Erreur rejet annonce:', error)
      
      if (options.onError) {
        options.onError(error, variables)
      }
    }
  })
}

/**
 * Hook pour ajouter des photos
 */
export const useAddPhotos = (options = {}) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ animalId, photos }) => lostAnimalsService.addPhotos(animalId, photos),
    onSuccess: (data, variables) => {
      console.log('✅ Photos ajoutées avec succès:', variables.animalId)
      
      // Invalider le détail pour recharger avec les nouvelles photos
      queryClient.invalidateQueries({
        queryKey: LOST_ANIMALS_QUERY_KEYS.detail(variables.animalId)
      })
      
      if (options.onSuccess) {
        options.onSuccess(data, variables)
      }
    },
    onError: (error, variables) => {
      console.error('❌ Erreur ajout photos:', error)
      
      if (options.onError) {
        options.onError(error, variables)
      }
    }
  })
}

/**
 * Hook pour supprimer une photo
 */
export const useDeletePhoto = (options = {}) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (photoId) => lostAnimalsService.deletePhoto(photoId),
    onSuccess: (data, photoId) => {
      console.log('✅ Photo supprimée avec succès:', photoId)
      
      // Invalider toutes les annonces pour recharger les photos
      queryClient.invalidateQueries({
        queryKey: LOST_ANIMALS_QUERY_KEYS.all()
      })
      
      if (options.onSuccess) {
        options.onSuccess(data, photoId)
      }
    },
    onError: (error, photoId) => {
      console.error('❌ Erreur suppression photo:', error)
      
      if (options.onError) {
        options.onError(error, photoId)
      }
    }
  })
}

// === UTILITAIRES ===

/**
 * Hook pour invalider toutes les queries Lost Animals
 */
export const useInvalidateLostAnimals = () => {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.invalidateQueries({
      queryKey: LOST_ANIMALS_QUERY_KEYS.all()
    })
  }
}

/**
 * Hook pour précharger une annonce
 */
export const usePrefetchLostAnimal = () => {
  const queryClient = useQueryClient()
  
  return (id) => {
    queryClient.prefetchQuery({
      queryKey: LOST_ANIMALS_QUERY_KEYS.detail(id),
      queryFn: () => lostAnimalsService.getLostAnimalById(id),
      staleTime: 2 * 60 * 1000 // 2 minutes
    })
  }
}
