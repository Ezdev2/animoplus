import { useQuery } from '@tanstack/vue-query'
import { computed, unref } from 'vue'
import { speciesService } from './speciesService.js'

// Clés de cache pour les espèces et races
export const SPECIES_QUERY_KEYS = {
  all: ['species'],
  lists: () => [...SPECIES_QUERY_KEYS.all, 'list'],
  list: (params) => [...SPECIES_QUERY_KEYS.lists(), params],
  details: () => [...SPECIES_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...SPECIES_QUERY_KEYS.details(), id],
  races: (especeId) => [...SPECIES_QUERY_KEYS.all, 'races', especeId]
}

export const RACE_QUERY_KEYS = {
  all: ['races'],
  lists: () => [...RACE_QUERY_KEYS.all, 'list'],
  list: (params) => [...RACE_QUERY_KEYS.lists(), params],
  details: () => [...RACE_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...RACE_QUERY_KEYS.details(), id],
  bySpecies: (especeId) => [...RACE_QUERY_KEYS.all, 'species', especeId]
}

/**
 * Hook pour récupérer toutes les espèces
 * @param {Object} options - Options de requête
 * @param {Object} queryOptions - Options de la requête TanStack Query
 * @returns {Object} Résultat de la requête
 */
export function useSpecies(options = {}, queryOptions = {}) {
  return useQuery({
    queryKey: SPECIES_QUERY_KEYS.list(options),
    queryFn: () => speciesService.getAllSpecies(options),
    staleTime: 15 * 60 * 1000, // 15 minutes (les espèces changent rarement)
    cacheTime: 30 * 60 * 1000, // 30 minutes
    ...queryOptions
  })
}

/**
 * Hook pour récupérer une espèce spécifique
 * @param {number} id - ID de l'espèce
 * @param {Object} options - Options d'inclusion
 * @param {Object} queryOptions - Options de la requête
 * @returns {Object} Résultat de la requête
 */
export function useSpeciesById(id, options = {}, queryOptions = {}) {
  return useQuery({
    queryKey: SPECIES_QUERY_KEYS.detail(id),
    queryFn: () => speciesService.getSpeciesById(id, options),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    ...queryOptions
  })
}

/**
 * Hook pour récupérer les races d'une espèce
 * @param {Ref<string>|string} especeId - ID de l'espèce (peut être réactif)
 * @param {Object} queryOptions - Options de la requête
 * @returns {Object} Résultat de la requête
 */
export function useRacesBySpecies(especeId, queryOptions = {}) {
  return useQuery({
    queryKey: computed(() => SPECIES_QUERY_KEYS.races(unref(especeId))),
    queryFn: () => {
      const id = unref(especeId)
      console.log('Fetching races for species ID:', id, typeof id)
      return speciesService.getRacesBySpecies(id)
    },
    enabled: computed(() => !!unref(especeId)),
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    ...queryOptions
  })
}

/**
 * Hook pour récupérer toutes les races
 * @param {Object} options - Options de requête
 * @param {Object} queryOptions - Options de la requête
 * @returns {Object} Résultat de la requête
 */
export function useRaces(options = {}, queryOptions = {}) {
  return useQuery({
    queryKey: RACE_QUERY_KEYS.list(options),
    queryFn: () => speciesService.getAllRaces(options),
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    ...queryOptions
  })
}

/**
 * Hook pour récupérer une race spécifique
 * @param {number} id - ID de la race
 * @param {Object} options - Options d'inclusion
 * @param {Object} queryOptions - Options de la requête
 * @returns {Object} Résultat de la requête
 */
export function useRace(id, options = {}, queryOptions = {}) {
  return useQuery({
    queryKey: RACE_QUERY_KEYS.detail(id),
    queryFn: () => speciesService.getRaceById(id, options),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    ...queryOptions
  })
}
