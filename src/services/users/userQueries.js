import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { userService } from './userService.js'

// Clés de cache pour les requêtes utilisateurs
export const USER_QUERY_KEYS = {
  all: ['users'],
  lists: () => [...USER_QUERY_KEYS.all, 'list'],
  list: (filters) => [...USER_QUERY_KEYS.lists(), { filters }],
  details: () => [...USER_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...USER_QUERY_KEYS.details(), id],
  profile: () => [...USER_QUERY_KEYS.all, 'profile'],
  search: (query) => [...USER_QUERY_KEYS.all, 'search', query]
}

// Hook pour récupérer la liste des utilisateurs
export function useUsers(params = {}) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.list(params),
    queryFn: () => userService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    select: (data) => data.success ? data.data : null
  })
}

// Hook pour récupérer un utilisateur par ID
export function useUser(id) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => userService.getUser(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    select: (data) => data.success ? data.data : null
  })
}

// Hook pour récupérer le profil de l'utilisateur connecté
export function useProfile() {
  return useQuery({
    queryKey: USER_QUERY_KEYS.profile(),
    queryFn: () => userService.getProfile(),
    staleTime: 2 * 60 * 1000, // 2 minutes pour le profil
    select: (data) => data.success ? data.data : null
  })
}

// Hook pour rechercher des utilisateurs
export function useUserSearch(query, filters = {}) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.search({ query, ...filters }),
    queryFn: () => userService.searchUsers(query, filters),
    enabled: !!query && query.length >= 2,
    staleTime: 30 * 1000, // 30 secondes pour la recherche
    select: (data) => data.success ? data.data : null
  })
}

// Hook pour créer un utilisateur
export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userData) => userService.createUser(userData),
    onSuccess: (data) => {
      if (data.success) {
        // Invalider et refetch la liste des utilisateurs
        queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() })
        
        // Ajouter le nouvel utilisateur au cache
        queryClient.setQueryData(
          USER_QUERY_KEYS.detail(data.data.id),
          { success: true, data: data.data }
        )
      }
    }
  })
}

// Hook pour mettre à jour un utilisateur
export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, userData }) => userService.updateUser(id, userData),
    onSuccess: (data, variables) => {
      if (data.success) {
        const { id } = variables
        
        // Mettre à jour le cache de l'utilisateur spécifique
        queryClient.setQueryData(
          USER_QUERY_KEYS.detail(id),
          { success: true, data: data.data }
        )
        
        // Invalider la liste pour refetch
        queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() })
      }
    }
  })
}

// Hook pour supprimer un utilisateur
export function useDeleteUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => userService.deleteUser(id),
    onSuccess: (data, id) => {
      if (data.success) {
        // Supprimer l'utilisateur du cache
        queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.detail(id) })
        
        // Invalider la liste pour refetch
        queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() })
      }
    }
  })
}

// Hook pour mettre à jour le profil
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (profileData) => userService.updateProfile(profileData),
    onSuccess: (data) => {
      if (data.success) {
        // Mettre à jour le cache du profil
        queryClient.setQueryData(
          USER_QUERY_KEYS.profile(),
          { success: true, data: data.data }
        )
        
        // Mettre à jour aussi le store utilisateur si nécessaire
        queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
      }
    }
  })
}

// Hook pour changer le mot de passe
export function useChangePassword() {
  return useMutation({
    mutationFn: (passwordData) => userService.changePassword(passwordData)
  })
}

// Hook pour upload d'avatar
export function useUploadAvatar() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (file) => userService.uploadAvatar(file),
    onSuccess: (data) => {
      if (data.success) {
        // Invalider le profil pour refetch avec le nouvel avatar
        queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.profile() })
        queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
      }
    }
  })
}
