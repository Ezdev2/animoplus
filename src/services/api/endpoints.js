// Centralisation de tous les endpoints de l'API
export const API_ENDPOINTS = {
  // Authentification
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email'
  },

  // Gestion des utilisateurs
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    SHOW: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    SEARCH: '/users/search',
    PROFILE: '/auth/me', // GET - Récupérer le profil (route existante)
    UPDATE_PROFILE: '/user/profile', // PUT - Mettre à jour le profil
    CHANGE_PASSWORD: '/user/change-password', // PUT - Changer mot de passe
    DEACTIVATE: '/user/deactivate', // POST - Désactiver compte
    SESSIONS: '/user/sessions', // GET - Sessions actives
    REVOKE_SESSION: '/user/sessions/revoke', // DELETE - Révoquer session
    REVOKE_ALL_SESSIONS: '/user/sessions/revoke-all', // DELETE - Révoquer toutes
    UPLOAD_AVATAR: '/users/avatar',
    UPDATE_AVATAR: '/user/avatar' // PUT - Mettre à jour l'avatar avec URL
  },

  // Clients
  CLIENTS: {
    BASE: '/clients',
    PROFILE: '/clients/profile'
  },

  // Veterinarians
  VETERINARIANS: {
    BASE: '/veterinarians',
    PROFILE: '/veterinarians/profile',
    SPECIALTIES: '/veterinarians/specialties'
  },

  // Animals
  ANIMALS: {
    BASE: '/animals',
    BY_CLIENT: '/animals/client',
    SPECIES: '/animals/species',
    RACES: '/animals/races',
    PHOTOS: '/animals/photos'
  },

  // Appointments
  APPOINTMENTS: {
    BASE: '/appointments',
    SCHEDULE: '/appointments/schedule',
    AVAILABILITY: '/appointments/availability',
    EXTERNAL: '/appointments/external'
  },

  // Clinics
  CLINICS: {
    BASE: '/clinics',
    JOIN_REQUESTS: '/clinics/join-requests',
    SCHEDULES: '/clinics/schedules',
    CABINETS: '/clinics/cabinets'
  },

  // Services
  SERVICES: {
    BASE: '/services',
    SPECIALIZED: '/services/specialized',
    TYPES: '/services/types'
  },

  // Specialties
  SPECIALTIES: {
    BASE: '/specialties',
    SERVICE_TYPES: '/specialties/service-types'
  },

  // Messages
  MESSAGES: {
    BASE: '/messages',
    ADMIN: '/messages/admin',
    CONVERSATIONS: '/messages/conversations'
  },

  // Documents
  DOCUMENTS: {
    BASE: '/documents',
    UPLOAD: '/documents/upload',
    MEDICAL_RECORDS: '/documents/medical-records'
  },

  // Stock Management
  STOCK: {
    BASE: '/stock',
    TRIGGERS: '/stock/triggers',
    SUPPLIERS: '/stock/suppliers'
  },

  // Tasks
  TASKS: {
    BASE: '/tasks',
    ASSIGN: '/tasks/assign',
    STATUS: '/tasks/status'
  },

  // Accounting
  ACCOUNTING: {
    BASE: '/accounting',
    EXPENSES: '/accounting/expenses',
    REPORTS: '/accounting/reports'
  },

  // Reviews
  REVIEWS: {
    BASE: '/reviews',
    BY_VETERINARIAN: '/reviews/veterinarian'
  },

  // Reports/Signalements
  REPORTS: {
    BASE: '/reports',
    MODERATE: '/reports/moderate'
  },

  // Lost Animals
  LOST_ANIMALS: {
    BASE: '/lost-animals',
    SEARCH: '/lost-animals/search'
  }
}

// Helper function pour construire des URLs avec paramètres
export const buildEndpoint = (endpoint, params = {}) => {
  let url = endpoint
  
  // Remplacer les paramètres dans l'URL (ex: /users/:id)
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key])
  })
  
  return url
}

// Helper function pour construire des query strings
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams()
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      searchParams.append(key, params[key])
    }
  })
  
  return searchParams.toString()
}
