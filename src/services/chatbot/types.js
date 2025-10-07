/**
 * Types et constantes pour le service chatbot
 */

/**
 * Types de messages
 */
export const MESSAGE_TYPES = {
  USER: 'user',
  BOT: 'bot'
}

/**
 * États du chatbot
 */
export const CHATBOT_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error'
}

/**
 * Messages par défaut
 */
export const DEFAULT_MESSAGES = {
  WELCOME: 'Bonjour ! Je suis votre assistant vétérinaire virtuel propulsé par l\'IA DeepSeek. Comment puis-je vous aider avec votre animal aujourd\'hui ?',
  ERROR: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
  NETWORK_ERROR: 'Problème de connexion. Vérifiez votre réseau.',
  RATE_LIMIT: 'Trop de requêtes. Veuillez patienter un moment.'
}

/**
 * Configuration du chatbot
 */
export const CHATBOT_CONFIG = {
  MAX_MESSAGE_LENGTH: 1000,
  TYPING_DELAY: 1000,
  MAX_MESSAGES_HISTORY: 50
}

/**
 * Crée un nouveau message
 * @param {string} type - Type du message (user/bot)
 * @param {string} text - Contenu du message
 * @param {Object} options - Options supplémentaires
 * @returns {Object} Message formaté
 */
export function createMessage(type, text, options = {}) {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    type,
    text,
    timestamp: new Date(),
    categories: options.categories || [],
    isUnknownQuestion: options.isUnknownQuestion || false,
    isOffTopic: options.isOffTopic || false,
    ...options
  }
}

/**
 * Valide un message utilisateur
 * @param {string} message - Message à valider
 * @returns {Object} Résultat de la validation
 */
export function validateUserMessage(message) {
  if (!message || typeof message !== 'string') {
    return {
      isValid: false,
      error: 'Le message ne peut pas être vide'
    }
  }

  const trimmedMessage = message.trim()
  
  if (trimmedMessage.length === 0) {
    return {
      isValid: false,
      error: 'Le message ne peut pas être vide'
    }
  }

  if (trimmedMessage.length > CHATBOT_CONFIG.MAX_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: `Le message ne peut pas dépasser ${CHATBOT_CONFIG.MAX_MESSAGE_LENGTH} caractères`
    }
  }

  return {
    isValid: true,
    message: trimmedMessage
  }
}
