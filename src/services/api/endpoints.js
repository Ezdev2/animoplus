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
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    CHANGE_PASSWORD: '/auth/change-password'
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
    UPDATE_AVATAR: '/user/avatar', // PUT - Mettre à jour l'avatar avec URL
    UPGRADE_TO_PRO: '/user/upgrade-to-pro' // POST - Passer au compte Pro
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

  // Lost Animals (Coopération)
  LOST_ANIMALS: {
    LIST: '/lost-animals',
    CREATE: '/lost-animals',
    DETAIL: (id) => `/lost-animals/${id}`,
    UPDATE: (id) => `/lost-animals/${id}`,
    DELETE: (id) => `/lost-animals/${id}`,
    RESOLVE: (id) => `/lost-animals/${id}/resolve`,
    CONFIRM_RESOLUTION: (id) => `/lost-animals/${id}/confirm-resolution`,
    
    // Photos
    ADD_PHOTOS: (id) => `/lost-animals/${id}/photos`,
    DELETE_PHOTO: (photoId) => `/lost-animals/photos/${photoId}`,
    
    // Modération (Admin/Vétérinaires)
    PENDING: '/lost-animals/pending',
    APPROVE: (id) => `/lost-animals/${id}/approve`,
    REJECT: (id) => `/lost-animals/${id}/reject`,
    
    // Routes par statut (nouvelles routes de la collection Postman)
    APPROVED: '/lost-animals/approved',
    
    // Routes utilisateur - Mes annonces
    MY_ANIMALS: '/user/lost-animals',
    REJECTED: '/lost-animals/rejected',
    RESOLVED: '/lost-animals/resolved',
    
    // Notifications
    NOTIFY_AREA: (id) => `/lost-animals/${id}/notify-area`,
    NOTIFICATIONS: '/lost-animals/notifications',
    
    // Recherche avancée
    SEARCH: '/lost-animals/search',
    SEARCH_LOCATION: '/lost-animals/search/location',
    
    // Statistiques
    STATS: '/lost-animals/stats',
    
    // Endpoints de base (compatibilité)
    BASE: '/lost-animals'
  },

  // Notifications généralisées
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_UNREAD: (id) => `/notifications/${id}/unread`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    DELETE: (id) => `/notifications/${id}`,
    STATS: '/notifications/stats'
  },

  // Animals (basé sur la collection Postman)
  ANIMALS: {
    LIST: '/animaux',
    CREATE: '/animaux',
    GET_BY_ID: (id) => `/animaux/${id}`,
    UPDATE: (id) => `/animaux/${id}`,
    DELETE: (id) => `/animaux/${id}`,
    UPLOAD_PHOTO: (id) => `/animaux/${id}/photo`,
    SEARCH: '/animaux/search',
    BY_OWNER: '/animaux/owner',
    BY_SPECIES: '/animaux/species',
    
    // Endpoints pour les espèces et races
    SPECIES: {
      LIST: '/especes',
      GET_BY_ID: (id) => `/especes/${id}`,
      RACES: (id) => `/especes/${id}/races`
    },
    
    RACES: {
      LIST: '/races',
      GET_BY_ID: (id) => `/races/${id}`,
      BY_SPECIES: (especeId) => `/races/espece/${especeId}`
    }
  },

  // Appointments (basé sur la collection Postman Appointments_Collection)
  APPOINTMENTS: {
    LIST: '/appointments',
    CREATE: '/appointments',
    DETAIL: (id) => `/appointments/${id}`,
    UPDATE: (id) => `/appointments/${id}`,
    DELETE: (id) => `/appointments/${id}`,
    
    // Actions sur les statuts
    UPDATE_STATUS: (id) => `/appointments/${id}/status`,
    CONFIRM: (id) => `/appointments/${id}/confirm`,
    CANCEL: (id) => `/appointments/${id}/cancel`,
    COMPLETE: (id) => `/appointments/${id}/complete`,
    
    // Requêtes spécialisées
    CLIENT_APPOINTMENTS: (clientId) => `/clients/${clientId}/appointments`,
    PROFESSIONAL_APPOINTMENTS: (professionalId) => `/professionals/${professionalId}/appointments`,
    AVAILABLE_SLOTS: '/appointments/available-slots',
    STATS: '/appointments/stats',
    
    // Anciens endpoints (compatibilité)
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
    LIST: '/services',
    MY_SERVICES: '/services/my-services',
    CREATE: '/services',
    DETAIL: (id) => `/services/${id}`,
    UPDATE: (id) => `/services/${id}`,
    DELETE: (id) => `/services/${id}`,
    USER_SERVICES: (userId) => `/users/${userId}/services`,
    TOGGLE_STATUS: (id) => `/services/${id}/toggle-status`,
    TYPES: '/services/types'
  },

  // Service Types
  SERVICE_TYPES: {
    LIST: '/service-types',
    CREATE: '/service-types',
    DETAIL: (id) => `/service-types/${id}`,
    UPDATE: (id) => `/service-types/${id}`,
    DELETE: (id) => `/service-types/${id}`,
    TOGGLE_STATUS: (id) => `/service-types/${id}/toggle-status`,
    STATS: '/service-types/stats'
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
    CONVERSATIONS: '/messages/conversations',
    BY_CONVERSATION: '/messages' // Pour récupérer les messages d'une conversation avec ?conversation_id=
  },

  // Messagerie
  MESSAGING: {
    CONVERSATIONS: {
      LIST: '/conversations',
      CREATE: '/conversations',
      DETAIL: (id) => `/conversations/${id}`,
      UPDATE: (id) => `/conversations/${id}`,
      DELETE: (id) => `/conversations/${id}`,
      START_OR_FIND: '/conversations/start-or-find',
      MESSAGES: (id) => `/conversations/${id}/messages`,
      SEND_MESSAGE: (id) => `/conversations/${id}/messages`,
      MARK_READ: (id) => `/conversations/${id}/mark-read`,
      TYPING: (id) => `/conversations/${id}/typing`
    },
    USERS: {
      SEARCH: '/users/search'
    }
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

  // Tasks (basé sur la collection Postman Tasks_Collection)
  TASKS: {
    LIST: '/tasks',
    CREATE: '/tasks',
    DETAIL: (id) => `/tasks/${id}`,
    UPDATE: (id) => `/tasks/${id}`,
    DELETE: (id) => `/tasks/${id}`,
    
    // Actions sur les tâches
    COMPLETE: (id) => `/tasks/${id}/complete`,
    UNCOMPLETE: (id) => `/tasks/${id}/uncomplete`,
    ASSIGN: (id) => `/tasks/${id}/assign`,
    UNASSIGN: (id) => `/tasks/${id}/unassign`,
    
    // Requêtes spécialisées
    MY_TASKS: '/tasks/my-tasks',
    ASSIGNED_TASKS: '/tasks/assigned',
    OVERDUE_TASKS: '/tasks/overdue',
    COMPLETED_TASKS: '/tasks/completed',
    PRIORITY_TASKS: '/tasks/priority',
    
    // Statistiques et rapports
    STATS: '/tasks/stats',
    SUMMARY: '/tasks/summary',
    
    // Anciens endpoints (compatibilité)
    BASE: '/tasks',
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


  // Actifs (basé sur la collection Postman Actifs_Collection)
  ACTIFS: {
    LIST: '/actifs',
    CREATE: '/actifs',
    DETAIL: (id) => `/actifs/${id}`,
    UPDATE: (id) => `/actifs/${id}`,
    DELETE: (id) => `/actifs/${id}`,
    SEARCH: '/actifs/search'
  },

  // Stocks endpoints
  STOCKS: {
    LIST: '/stocks',
    MY_STOCKS: '/stocks/my-stocks',
    CREATE: '/stocks',
    DETAIL: (id) => `/stocks/${id}`,
    UPDATE: (id) => `/stocks/${id}`,
    DELETE: (id) => `/stocks/${id}`,
    SEARCH: '/stocks/search'
  },

  // Expenses endpoints
  EXPENSES: {
    LIST: '/expenses',
    MY_EXPENSES: '/expenses/my-expenses',
    CREATE: '/expenses',
    DETAIL: (id) => `/expenses/${id}`,
    UPDATE: (id) => `/expenses/${id}`,
    DELETE: (id) => `/expenses/${id}`,
    SEARCH: '/expenses/search',
    UPDATE_STATUS: (id) => `/expenses/${id}/status`,
    RESTORE: (id) => `/expenses/${id}/restore`,
    STATS: '/expenses/stats'
  },

  // Specialites endpoints (basé sur la collection Postman Specialites_Collection)
  SPECIALITES: {
    LIST: '/specialites',
    CREATE: '/specialites',
    DETAIL: (id) => `/specialites/${id}`,
    UPDATE: (id) => `/specialites/${id}`,
    DELETE: (id) => `/specialites/${id}`,
    SEARCH: '/specialites/search',
    TOGGLE_STATUS: (id) => `/specialites/${id}/toggle-status`,
    VETERINARIANS: (id) => `/specialites/${id}/veterinarians`
  },

  // User Specialites endpoints (basé sur la collection Postman User_Specialites_Collection)
  USER_SPECIALITES: {
    LIST: '/user/specialties',
    CREATE: '/user/specialties',
    DETAIL: (id) => `/user/specialties/${id}`,
    UPDATE: (id) => `/user/specialties/${id}`,
    DELETE: (id) => `/user/specialties/${id}`
  }
}

// Helper function pour remplacer les paramètres dans l'URL
export const buildEndpoint = (template, params = {}) => {
  let url = template
  
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

// === COMPTABILITÉ ===
export const COMPTA_ENDPOINTS = {
  // Statistiques financières
  STATS: '/compta/stats',
  
  // Statistiques multiples (année, mois, semaine)
  MULTI_STATS: '/compta/multi-stats',
  
  // Tendances et évolutions
  TRENDS: '/compta/trends',
  
  // Comparaisons périodiques
  COMPARISON: '/compta/comparison',
  
  // Rapports financiers
  REPORTS: '/compta/reports',
  
  // Analyses détaillées
  ANALYSIS: '/compta/analysis',
  
  // Prévisions
  FORECASTS: '/compta/forecasts'
}

// === REVENUS ===
export const REVENUE_ENDPOINTS = {
  // CRUD de base
  LIST: '/revenues',
  CREATE: '/revenues',
  DETAIL: (id) => `/revenues/${id}`,
  UPDATE: (id) => `/revenues/${id}`,
  DELETE: (id) => `/revenues/${id}`,
  
  // Statistiques revenus
  STATS: '/revenues/stats',
  
  // Catégories de revenus
  CATEGORIES: '/revenues/categories',
  
  // Recherche et filtres
  SEARCH: '/revenues/search',
  
  // Validation et approbation
  VALIDATE: (id) => `/revenues/${id}/validate`,
  APPROVE: (id) => `/revenues/${id}/approve`,
  REJECT: (id) => `/revenues/${id}/reject`,
  
  // Rapports revenus
  REPORTS: '/revenues/reports',
  
  // Export données
  EXPORT: '/revenues/export'
}
