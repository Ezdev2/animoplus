import axios from 'axios'

const API_BASE_URL = 'https://animoplus-bot-api.onrender.com'

/**
 * Service pour les interactions avec le chatbot AnimoPlus
 */
export class ChatbotService {
  /**
   * Envoie une question au chatbot et récupère la réponse
   * @param {string} question - La question de l'utilisateur
   * @returns {Promise<Object>} La réponse du chatbot
   */
  static async sendMessage(question) {
    try {
      const response = await axios.post(`${API_BASE_URL}/ask`, {
        question: question
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.data) {
        return {
          success: true,
          data: {
            formatted_response: response.data.formatted_response,
            matched_categories: response.data.matched_categories || [],
            is_unknown_question: response.data.is_unknown_question || false,
            is_off_topic: response.data.is_off_topic || false
          }
        }
      } else {
        throw new Error('Réponse invalide du serveur')
      }

    } catch (error) {
      console.error('Chatbot service error:', error)
      
      let errorMessage = 'Désolé, une erreur s\'est produite.'
      
      if (error.response?.status === 429) {
        errorMessage = 'Trop de requêtes. Veuillez patienter un moment.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorMessage = 'Problème de connexion. Vérifiez votre réseau.'
      }

      return {
        success: false,
        error: errorMessage
      }
    }
  }

  /**
   * Génère un ID unique pour un message
   * @returns {string} ID unique
   */
  static generateMessageId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  /**
   * Formate l'heure d'un message
   * @param {Date} date - La date du message
   * @returns {string} Heure formatée
   */
  static formatMessageTime(date) {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
}

export default ChatbotService
