import { computed } from 'vue'
import { useUsersStore } from '../stores/users.js'
import { 
  useUsers as useUsersQuery,
  useUser as useUserQuery,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useUserSearch as useUserSearchQuery
} from '../services/users/userQueries.js'

export function useUsers() {
  const usersStore = useUsersStore()

  // États réactifs du store
  const users = computed(() => usersStore.users)
  const currentUser = computed(() => usersStore.currentUser)
  const loading = computed(() => usersStore.loading)
  const error = computed(() => usersStore.error)
  const pagination = computed(() => usersStore.pagination)
  const filters = computed(() => usersStore.filters)

  // Getters
  const totalUsers = computed(() => usersStore.totalUsers)
  const hasUsers = computed(() => usersStore.hasUsers)
  const clientUsers = computed(() => usersStore.clientUsers)
  const veterinarianUsers = computed(() => usersStore.veterinarianUsers)
  const activeUsers = computed(() => usersStore.activeUsers)
  const inactiveUsers = computed(() => usersStore.inactiveUsers)

  // Actions du store
  const fetchUsers = (params) => usersStore.fetchUsers(params)
  const fetchUser = (id) => usersStore.fetchUser(id)
  const createUser = (userData) => usersStore.createUser(userData)
  const updateUser = (id, userData) => usersStore.updateUser(id, userData)
  const deleteUser = (id) => usersStore.deleteUser(id)
  const searchUsers = (query, filters) => usersStore.searchUsers(query, filters)
  const changePage = (page) => usersStore.changePage(page)
  const changePerPage = (perPage) => usersStore.changePerPage(perPage)
  const applyFilters = (newFilters) => usersStore.applyFilters(newFilters)
  const resetFilters = () => usersStore.resetFilters()
  const clearStore = () => usersStore.clearStore()

  // Mutations TanStack Query
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  // Actions avec TanStack Query
  const createUserWithQuery = async (userData) => {
    try {
      const result = await createUserMutation.mutateAsync(userData)
      if (result.success) {
        // Optionnel: refetch la liste depuis le store
        await fetchUsers()
      }
      return result
    } catch (error) {
      console.error('Erreur lors de la création:', error)
      throw error
    }
  }

  const updateUserWithQuery = async (id, userData) => {
    try {
      const result = await updateUserMutation.mutateAsync({ id, userData })
      if (result.success) {
        // Optionnel: refetch la liste depuis le store
        await fetchUsers()
      }
      return result
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      throw error
    }
  }

  const deleteUserWithQuery = async (id) => {
    try {
      const result = await deleteUserMutation.mutateAsync(id)
      if (result.success) {
        // Optionnel: refetch la liste depuis le store
        await fetchUsers()
      }
      return result
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      throw error
    }
  }

  // Utilitaires
  const getUserById = (id) => {
    return users.value.find(user => user.id === id) || null
  }

  const getUsersByType = (userType) => {
    return users.value.filter(user => user.user_type === userType)
  }

  const getUsersByStatus = (status) => {
    return users.value.filter(user => user.status === status)
  }

  const isUserActive = (user) => {
    return user && user.status === 'active'
  }

  const isUserClient = (user) => {
    return user && user.user_type === 'client'
  }

  const isUserVeterinarian = (user) => {
    return user && user.user_type === 'veterinarian'
  }

  // Formatage et validation
  const formatUserName = (user) => {
    if (!user) return ''
    return user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim()
  }

  const getUserInitials = (user) => {
    if (!user) return ''
    const name = formatUserName(user)
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const validateUserData = (userData) => {
    const errors = {}
    
    if (!userData.name && (!userData.first_name || !userData.last_name)) {
      errors.name = 'Le nom est requis'
    }
    
    if (!userData.email) {
      errors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = 'L\'email n\'est pas valide'
    }
    
    if (!userData.user_type) {
      errors.user_type = 'Le type d\'utilisateur est requis'
    } else if (!['client', 'veterinarian'].includes(userData.user_type)) {
      errors.user_type = 'Le type d\'utilisateur doit être "client" ou "veterinarian"'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  return {
    // États
    users,
    currentUser,
    loading,
    error,
    pagination,
    filters,
    
    // Getters
    totalUsers,
    hasUsers,
    clientUsers,
    veterinarianUsers,
    activeUsers,
    inactiveUsers,
    
    // Actions Store
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    changePage,
    changePerPage,
    applyFilters,
    resetFilters,
    clearStore,
    
    // Actions avec TanStack Query
    createUserWithQuery,
    updateUserWithQuery,
    deleteUserWithQuery,
    
    // Mutations TanStack Query
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
    
    // Utilitaires
    getUserById,
    getUsersByType,
    getUsersByStatus,
    isUserActive,
    isUserClient,
    isUserVeterinarian,
    formatUserName,
    getUserInitials,
    validateUserData
  }
}

// Hook spécialisé pour la recherche avec TanStack Query
export function useUserSearch(query, filters = {}) {
  return useUserSearchQuery(query, filters)
}

// Hook spécialisé pour récupérer un utilisateur avec TanStack Query
export function useUserDetails(id) {
  return useUserQuery(id)
}

// Hook spécialisé pour récupérer la liste avec TanStack Query
export function useUsersList(params = {}) {
  return useUsersQuery(params)
}
