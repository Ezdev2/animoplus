import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userService } from '../services/users/userService.js'

export const useUsersStore = defineStore('users', () => {
  // État
  const users = ref([])
  const currentUser = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1
  })
  const filters = ref({
    search: '',
    user_type: '',
    status: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  })

  // Getters
  const totalUsers = computed(() => pagination.value.total)
  const hasUsers = computed(() => users.value.length > 0)
  const clientUsers = computed(() => users.value.filter(user => user.user_type === 'client'))
  const veterinarianUsers = computed(() => users.value.filter(user => user.user_type === 'veterinarian'))
  const activeUsers = computed(() => users.value.filter(user => user.status === 'active'))
  const inactiveUsers = computed(() => users.value.filter(user => user.status === 'inactive'))

  // Actions
  const setUsers = (usersData) => {
    users.value = usersData
    error.value = null
  }

  const setCurrentUser = (userData) => {
    currentUser.value = userData
    error.value = null
  }

  const setPagination = (paginationData) => {
    pagination.value = { ...pagination.value, ...paginationData }
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const setLoading = (isLoading) => {
    loading.value = isLoading
  }

  const setError = (errorMessage) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = null
  }

  // Récupérer la liste des utilisateurs
  const fetchUsers = async (params = {}) => {
    setLoading(true)
    clearError()

    try {
      const queryParams = {
        page: pagination.value.current_page,
        per_page: pagination.value.per_page,
        ...filters.value,
        ...params
      }

      const result = await userService.getUsers(queryParams)
      
      if (result.success) {
        setUsers(result.data.data || result.data.users || [])
        setPagination(result.data.pagination || result.data.meta || {})
        return { success: true, data: result.data }
      } else {
        setError(result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      const errorMessage = 'Erreur lors de la récupération des utilisateurs'
      setError(errorMessage)
      console.error('Erreur fetchUsers:', error)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Récupérer un utilisateur par ID
  const fetchUser = async (id) => {
    setLoading(true)
    clearError()

    try {
      const result = await userService.getUser(id)
      
      if (result.success) {
        setCurrentUser(result.data)
        return { success: true, data: result.data }
      } else {
        setError(result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      const errorMessage = 'Erreur lors de la récupération de l\'utilisateur'
      setError(errorMessage)
      console.error('Erreur fetchUser:', error)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Créer un nouvel utilisateur
  const createUser = async (userData) => {
    setLoading(true)
    clearError()

    try {
      const result = await userService.createUser(userData)
      
      if (result.success) {
        // Ajouter le nouvel utilisateur à la liste
        users.value.unshift(result.data)
        
        // Mettre à jour la pagination
        pagination.value.total += 1
        
        return { success: true, data: result.data }
      } else {
        setError(result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      const errorMessage = 'Erreur lors de la création de l\'utilisateur'
      setError(errorMessage)
      console.error('Erreur createUser:', error)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Mettre à jour un utilisateur
  const updateUser = async (id, userData) => {
    setLoading(true)
    clearError()

    try {
      const result = await userService.updateUser(id, userData)
      
      if (result.success) {
        // Mettre à jour l'utilisateur dans la liste
        const index = users.value.findIndex(user => user.id === id)
        if (index !== -1) {
          users.value[index] = { ...users.value[index], ...result.data }
        }
        
        // Mettre à jour l'utilisateur courant si c'est le même
        if (currentUser.value?.id === id) {
          setCurrentUser({ ...currentUser.value, ...result.data })
        }
        
        return { success: true, data: result.data }
      } else {
        setError(result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      const errorMessage = 'Erreur lors de la mise à jour de l\'utilisateur'
      setError(errorMessage)
      console.error('Erreur updateUser:', error)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Supprimer un utilisateur
  const deleteUser = async (id) => {
    setLoading(true)
    clearError()

    try {
      const result = await userService.deleteUser(id)
      
      if (result.success) {
        // Supprimer l'utilisateur de la liste
        users.value = users.value.filter(user => user.id !== id)
        
        // Mettre à jour la pagination
        pagination.value.total -= 1
        
        // Nettoyer l'utilisateur courant si c'est le même
        if (currentUser.value?.id === id) {
          currentUser.value = null
        }
        
        return { success: true }
      } else {
        setError(result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      const errorMessage = 'Erreur lors de la suppression de l\'utilisateur'
      setError(errorMessage)
      console.error('Erreur deleteUser:', error)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Rechercher des utilisateurs
  const searchUsers = async (query, searchFilters = {}) => {
    setLoading(true)
    clearError()

    try {
      const result = await userService.searchUsers(query, searchFilters)
      
      if (result.success) {
        setUsers(result.data.data || result.data.users || [])
        setPagination(result.data.pagination || result.data.meta || {})
        return { success: true, data: result.data }
      } else {
        setError(result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      const errorMessage = 'Erreur lors de la recherche d\'utilisateurs'
      setError(errorMessage)
      console.error('Erreur searchUsers:', error)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Changer de page
  const changePage = async (page) => {
    pagination.value.current_page = page
    await fetchUsers()
  }

  // Changer le nombre d'éléments par page
  const changePerPage = async (perPage) => {
    pagination.value.per_page = perPage
    pagination.value.current_page = 1 // Reset à la première page
    await fetchUsers()
  }

  // Appliquer des filtres
  const applyFilters = async (newFilters) => {
    setFilters(newFilters)
    pagination.value.current_page = 1 // Reset à la première page
    await fetchUsers()
  }

  // Réinitialiser les filtres
  const resetFilters = async () => {
    setFilters({
      search: '',
      user_type: '',
      status: '',
      sort_by: 'created_at',
      sort_order: 'desc'
    })
    pagination.value.current_page = 1
    await fetchUsers()
  }

  // Nettoyer le store
  const clearStore = () => {
    users.value = []
    currentUser.value = null
    error.value = null
    pagination.value = {
      current_page: 1,
      per_page: 10,
      total: 0,
      last_page: 1
    }
  }

  return {
    // État
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
    
    // Actions
    setUsers,
    setCurrentUser,
    setPagination,
    setFilters,
    setLoading,
    setError,
    clearError,
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
    clearStore
  }
})
