import { computed } from 'vue'

/**
 * Composable pour la messagerie classique (API REST)
 * Utilitaires de formatage et helpers pour l'interface
 */
export function useMessaging() {
  
  /**
   * Formater la date d'un message
   * @param {string} dateString - Date ISO
   * @returns {string} Date formatée
   */
  const formatMessageDate = (dateString) => {
    if (!dateString) return ''
    
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = now.getTime() - date.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        return 'Aujourd\'hui'
      } else if (diffDays === 1) {
        return 'Hier'
      } else if (diffDays < 7) {
        return date.toLocaleDateString('fr-FR', { weekday: 'long' })
      } else {
        return date.toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'short' 
        })
      }
    } catch (error) {
      console.error('Erreur formatage date message:', error)
      return dateString
    }
  }

  /**
   * Formater l'heure d'un message
   * @param {string} dateString - Date ISO
   * @returns {string} Heure formatée
   */
  const formatMessageTime = (dateString) => {
    if (!dateString) return ''
    
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } catch (error) {
      console.error('Erreur formatage heure message:', error)
      return dateString
    }
  }

  /**
   * Tronquer un texte
   * @param {string} text - Texte à tronquer
   * @param {number} maxLength - Longueur maximale
   * @returns {string} Texte tronqué
   */
  const truncateText = (text, maxLength = 50) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  /**
   * Obtenir la classe CSS pour le type d'utilisateur
   * @param {string} userType - Type d'utilisateur
   * @returns {string} Classe CSS
   */
  const getUserTypeClass = (userType) => {
    switch (userType) {
      case 'veterinarian':
        return 'user-type-pro'
      case 'client':
        return 'user-type-client'
      default:
        return 'user-type-default'
    }
  }

  /**
   * Obtenir le label pour le type d'utilisateur
   * @param {string} userType - Type d'utilisateur
   * @returns {string} Label français
   */
  const getUserTypeLabel = (userType) => {
    switch (userType) {
      case 'veterinarian':
        return 'Vétérinaire'
      case 'client':
        return 'Client'
      default:
        return 'Utilisateur'
    }
  }

  /**
   * Formater le nom d'un utilisateur
   * @param {Object} user - Objet utilisateur
   * @returns {string} Nom formaté
   */
  const formatUserName = (user) => {
    if (!user) return 'Utilisateur'
    
    if (user.nom && user.prenom) {
      return `${user.prenom} ${user.nom}`
    } else if (user.name) {
      return user.name
    } else if (user.email) {
      return user.email.split('@')[0]
    }
    
    return 'Utilisateur'
  }

  /**
   * Vérifier si un message est récent (moins de 5 minutes)
   * @param {string} dateString - Date du message
   * @returns {boolean} True si récent
   */
  const isRecentMessage = (dateString) => {
    if (!dateString) return false
    
    try {
      const messageDate = new Date(dateString)
      const now = new Date()
      const diffMinutes = (now.getTime() - messageDate.getTime()) / (1000 * 60)
      return diffMinutes < 5
    } catch (error) {
      return false
    }
  }

  /**
   * Obtenir l'avatar par défaut ou l'avatar utilisateur
   * @param {Object} user - Objet utilisateur
   * @param {string} defaultAvatar - Avatar par défaut
   * @returns {string} URL de l'avatar
   */
  const getUserAvatar = (user, defaultAvatar) => {
    if (!user) return defaultAvatar
    return user.avatar || user.profile_picture || defaultAvatar
  }

  /**
   * Formater le statut de connexion
   * @param {boolean} isOnline - Statut en ligne
   * @param {string} lastSeen - Dernière connexion
   * @returns {string} Statut formaté
   */
  const formatConnectionStatus = (isOnline, lastSeen) => {
    if (isOnline) {
      return 'En ligne'
    }
    
    if (!lastSeen) {
      return 'Hors ligne'
    }
    
    try {
      const lastSeenDate = new Date(lastSeen)
      const now = new Date()
      const diffMinutes = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60)
      
      if (diffMinutes < 60) {
        return `Vu il y a ${Math.floor(diffMinutes)} min`
      } else if (diffMinutes < 1440) { // 24h
        return `Vu il y a ${Math.floor(diffMinutes / 60)} h`
      } else {
        return `Vu le ${lastSeenDate.toLocaleDateString('fr-FR')}`
      }
    } catch (error) {
      return 'Hors ligne'
    }
  }

  /**
   * Générer les initiales d'un utilisateur
   * @param {Object} user - Objet utilisateur
   * @returns {string} Initiales
   */
  const getUserInitials = (user) => {
    if (!user) return 'U'
    
    const name = formatUserName(user)
    const words = name.split(' ')
    
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase()
    } else if (words.length === 1 && words[0].length >= 2) {
      return words[0].substring(0, 2).toUpperCase()
    }
    
    return 'U'
  }

  // Fonction pour les conversations (placeholder pour compatibilité)
  const useConversations = () => {
    return {
      conversations: computed(() => []),
      isLoading: computed(() => false),
      error: computed(() => null)
    }
  }

  return {
    // Formatage
    formatMessageDate,
    formatMessageTime,
    truncateText,
    formatUserName,
    formatConnectionStatus,
    
    // Utilisateurs
    getUserTypeClass,
    getUserTypeLabel,
    getUserAvatar,
    getUserInitials,
    
    // Utilitaires
    isRecentMessage,
    
    // Conversations (placeholder)
    useConversations
  }
}
