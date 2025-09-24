import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { animalService } from './animalService.js'

// Clés de cache pour les requêtes
export const ANIMAL_QUERY_KEYS = {
  all: ['animals'],
  lists: () => [...ANIMAL_QUERY_KEYS.all, 'list'],
  list: (params) => [...ANIMAL_QUERY_KEYS.lists(), params],
  details: () => [...ANIMAL_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...ANIMAL_QUERY_KEYS.details(), id],
  search: (term) => [...ANIMAL_QUERY_KEYS.all, 'search', term],
  byOwner: (ownerId) => [...ANIMAL_QUERY_KEYS.all, 'owner', ownerId],
  bySpecies: (speciesId) => [...ANIMAL_QUERY_KEYS.all, 'species', speciesId]
}

/**
 * Hook pour récupérer la liste des animaux avec pagination
 * @param {Object} params - Paramètres de requête
 * @param {Object} options - Options de la requête
 * @returns {Object} Résultat de la requête TanStack Query
 */
export function useAnimals(params = {}, options = {}) {
  return useQuery({
    queryKey: ANIMAL_QUERY_KEYS.list(params),
    queryFn: () => animalService.getAnimals(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    keepPreviousData: true, // Garde les données précédentes pendant le chargement
    ...options
  })
}

/**
 * Hook pour récupérer un animal spécifique
 * @param {number} id - ID de l'animal
 * @param {Object} includeOptions - Options d'inclusion des relations
 * @param {Object} options - Options de la requête
 * @returns {Object} Résultat de la requête TanStack Query
 */
export function useAnimal(id, includeOptions = {}, options = {}) {
  return useQuery({
    queryKey: ANIMAL_QUERY_KEYS.detail(id),
    queryFn: () => animalService.getAnimalById(id, includeOptions),
    enabled: !!id, // Ne lance la requête que si l'ID existe
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options
  })
}

/**
 * Hook pour rechercher des animaux
 * @param {string} searchTerm - Terme de recherche
 * @param {Object} searchOptions - Options de recherche
 * @param {Object} options - Options de la requête
 * @returns {Object} Résultat de la requête TanStack Query
 */
export function useSearchAnimals(searchTerm, searchOptions = {}, options = {}) {
  return useQuery({
    queryKey: ANIMAL_QUERY_KEYS.search(searchTerm),
    queryFn: () => animalService.searchAnimals(searchTerm, searchOptions),
    enabled: !!searchTerm && searchTerm.length >= 2, // Recherche à partir de 2 caractères
    staleTime: 2 * 60 * 1000, // 2 minutes pour les recherches
    cacheTime: 5 * 60 * 1000, // 5 minutes
    ...options
  })
}

/**
 * Hook pour récupérer les animaux d'un propriétaire
 * @param {number} ownerId - ID du propriétaire
 * @param {Object} queryOptions - Options de requête
 * @param {Object} options - Options de la requête
 * @returns {Object} Résultat de la requête TanStack Query
 */
export function useAnimalsByOwner(ownerId, queryOptions = {}, options = {}) {
  return useQuery({
    queryKey: ANIMAL_QUERY_KEYS.byOwner(ownerId),
    queryFn: () => animalService.getAnimalsByOwner(ownerId, queryOptions),
    enabled: !!ownerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options
  })
}

/**
 * Hook pour récupérer les animaux par espèce
 * @param {number} speciesId - ID de l'espèce
 * @param {Object} queryOptions - Options de requête
 * @param {Object} options - Options de la requête
 * @returns {Object} Résultat de la requête TanStack Query
 */
export function useAnimalsBySpecies(speciesId, queryOptions = {}, options = {}) {
  return useQuery({
    queryKey: ANIMAL_QUERY_KEYS.bySpecies(speciesId),
    queryFn: () => animalService.getAnimalsBySpecies(speciesId, queryOptions),
    enabled: !!speciesId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options
  })
}

/**
 * Hook pour créer un animal
 * @param {Object} options - Options de la mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useCreateAnimal(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (animalData) => animalService.createAnimal(animalData),
    onSuccess: (data, variables) => {
      // Invalider les listes d'animaux pour forcer le rechargement
      queryClient.invalidateQueries({ queryKey: ANIMAL_QUERY_KEYS.lists() })
      
      // Si on connaît le propriétaire, invalider sa liste d'animaux
      if (variables.proprietaire_id) {
        queryClient.invalidateQueries({ 
          queryKey: ANIMAL_QUERY_KEYS.byOwner(variables.proprietaire_id) 
        })
      }
      
      // Si on connaît l'espèce, invalider sa liste d'animaux
      if (variables.espece_id) {
        queryClient.invalidateQueries({ 
          queryKey: ANIMAL_QUERY_KEYS.bySpecies(variables.espece_id) 
        })
      }
    },
    ...options
  })
}

/**
 * Hook pour mettre à jour un animal
 * @param {Object} options - Options de la mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useUpdateAnimal(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => animalService.updateAnimal(id, data),
    onSuccess: (data, variables) => {
      const { id } = variables
      
      // Mettre à jour le cache de l'animal spécifique
      queryClient.setQueryData(ANIMAL_QUERY_KEYS.detail(id), data)
      
      // Invalider et refetch immédiatement les listes pour refléter les changements
      queryClient.invalidateQueries({ 
        queryKey: ANIMAL_QUERY_KEYS.lists(),
        refetchType: 'active' // Force le refetch des requêtes actives
      })
      queryClient.invalidateQueries({ 
        queryKey: ANIMAL_QUERY_KEYS.all,
        refetchType: 'active'
      })
      
      // Invalider aussi les requêtes par propriétaire si on a l'info
      if (data?.data?.proprietaire_id) {
        queryClient.invalidateQueries({ 
          queryKey: ANIMAL_QUERY_KEYS.byOwner(data.data.proprietaire_id),
          refetchType: 'active'
        })
      }
    },
    ...options
  })
}

/**
 * Hook pour supprimer un animal
 * @param {Object} options - Options de la mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useDeleteAnimal(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => animalService.deleteAnimal(id),
    onSuccess: (data, id) => {
      console.log('🗑️ Suppression réussie, mise à jour du cache pour l\'animal:', id)
      
      // Supprimer l'animal du cache
      queryClient.removeQueries({ queryKey: ANIMAL_QUERY_KEYS.detail(id) })
      
      // Invalider et refetch immédiatement toutes les listes d'animaux
      queryClient.invalidateQueries({ 
        queryKey: ANIMAL_QUERY_KEYS.lists(),
        refetchType: 'active'
      })
      queryClient.invalidateQueries({ 
        queryKey: ANIMAL_QUERY_KEYS.all,
        refetchType: 'active'
      })
      
      // Invalider aussi les requêtes par propriétaire
      queryClient.invalidateQueries({ 
        queryKey: ANIMAL_QUERY_KEYS.byOwner,
        refetchType: 'active'
      })
      
      console.log('✅ Cache invalidé, les listes vont se mettre à jour')
    },
    ...options
  })
}

/**
 * Hook pour uploader une photo d'animal
 * @param {Object} options - Options de la mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useUploadAnimalPhoto(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, file }) => animalService.uploadAnimalPhoto(id, file),
    onSuccess: (data, variables) => {
      const { id } = variables
      
      // Invalider le cache de l'animal pour récupérer la nouvelle photo
      queryClient.invalidateQueries({ queryKey: ANIMAL_QUERY_KEYS.detail(id) })
      
      // Invalider les listes pour mettre à jour les miniatures
      queryClient.invalidateQueries({ queryKey: ANIMAL_QUERY_KEYS.lists() })
    },
    ...options
  })
}

/**
 * Hook composé pour la gestion complète d'un animal
 * Combine récupération, mise à jour et suppression
 * @param {number} id - ID de l'animal
 * @returns {Object} Objet avec toutes les opérations disponibles
 */
export function useAnimalManagement(id) {
  const queryClient = useQueryClient()

  const animalQuery = useAnimal(id, { 
    with_espece: true, 
    with_race: true, 
    with_proprietaire: true 
  })

  const updateMutation = useUpdateAnimal({
    onSuccess: () => {
      // Notification de succès (à implémenter selon votre système de notifications)
      console.log('Animal mis à jour avec succès')
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour:', error)
    }
  })

  const deleteMutation = useDeleteAnimal({
    onSuccess: () => {
      console.log('Animal supprimé avec succès')
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression:', error)
    }
  })

  const photoMutation = useUploadAnimalPhoto({
    onSuccess: () => {
      console.log('Photo uploadée avec succès')
    },
    onError: (error) => {
      console.error('Erreur lors de l\'upload:', error)
    }
  })

  return {
    // Données
    animal: animalQuery.data?.data,
    isLoading: animalQuery.isLoading,
    isError: animalQuery.isError,
    error: animalQuery.error,
    
    // Actions
    updateAnimal: (data) => updateMutation.mutate({ id, data }),
    deleteAnimal: () => deleteMutation.mutate(id),
    uploadPhoto: (file) => photoMutation.mutate({ id, file }),
    
    // États des mutations
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    isUploadingPhoto: photoMutation.isLoading,
    
    // Utilitaires
    refetch: animalQuery.refetch,
    invalidate: () => queryClient.invalidateQueries({ 
      queryKey: ANIMAL_QUERY_KEYS.detail(id) 
    })
  }
}

/**
 * Hook pour précharger un animal
 * Utile pour optimiser les performances lors de la navigation
 * @param {number} id - ID de l'animal à précharger
 */
export function usePrefetchAnimal(id) {
  const queryClient = useQueryClient()

  return () => {
    queryClient.prefetchQuery({
      queryKey: ANIMAL_QUERY_KEYS.detail(id),
      queryFn: () => animalService.getAnimalById(id, {
        with_espece: true,
        with_race: true,
        with_proprietaire: true
      }),
      staleTime: 5 * 60 * 1000
    })
  }
}
