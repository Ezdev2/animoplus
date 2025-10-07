<template>
  <!-- Fenêtre principale de la popup de chat -->
  <div class="fixed bottom-5 right-5 w-[450px] rounded-[15px] shadow-lg bg-white overflow-hidden z-[1000]">

    <div class="bg-green-600 p-4 flex justify-between items-center border-b border-gray-300">
      <div class="flex items-center gap-2 flex-1">
        <img :src="chatIcon" alt="Avatar IA" />
        <span class="text-white font-league">Conseiller Virtuel IA</span>
      </div>

      <div class="flex items-center gap-2">
        <button @click="clearChat" class="text-white hover:text-gray-200 text-sm">
          Effacer
        </button>
        <img @click="$emit('close-pop-up')" :src="closeIcon" alt="close" class="cursor-pointer" >
      </div>
    </div>

    <!-- Corps des messages -->
    <div class="chat-messages bg-white min-h-[300px] max-h-[400px] overflow-y-auto" ref="messagesContainer">
      <div 
        v-for="message in messages" 
        :key="message.id"
        :class="['message-wrapper', message.type]"
      >
        <div class="flex items-start gap-2.5 p-3">
          <img 
            v-if="message.type === 'bot'" 
            :src="chatIcon" 
            alt="Avatar IA" 
            class="chat-avatar-body flex-shrink-0" 
          />
          <div 
            :class="[
              'message-bubble',
              message.type === 'user' ? 'user-message' : 'bot-message'
            ]"
          >
            <p class="message-text">{{ message.text }}</p>
            <div class="message-meta">
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              <span v-if="message.categories && message.categories.length > 0" class="message-categories">
                {{ message.categories.join(', ') }}
              </span>
              <span v-if="message.isUnknownQuestion" class="message-status unknown">
                Question inconnue
              </span>
              <span v-if="message.isOffTopic" class="message-status off-topic">
                Hors sujet
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Indicateur de frappe -->
      <div v-if="isLoading" class="message-wrapper bot">
        <div class="flex items-start gap-2.5 p-3">
          <img :src="chatIcon" alt="Avatar IA" class="chat-avatar-body flex-shrink-0" />
          <div class="message-bubble bot-message">
            <div class="typing-animation">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="message-meta">
              <span class="message-time">En train d'écrire...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pied du chat -->
    <div class="flex items-center p-4 bg-white border-t border-gray-100">
      <div class="relative flex-1">
        <input
          type="text"
          v-model="userMessage"
          @keyup.enter="sendMessage"
          placeholder="Écrire vos messages ici ..."
          :disabled="isLoading"
          class="w-full h-[50px] text-sm px-4 pr-12 rounded-[10px] border border-gray-200 outline-none disabled:bg-gray-50"
        />
        <button 
          @click="sendMessage" 
          :disabled="isLoading || !userMessage.trim()"
          class="absolute top-1/2 right-2 -translate-y-1/2 w-7 h-7 flex items-center justify-center disabled:opacity-50"
        >
          <img :src="sendIcon" alt="Envoyer" class="w-6 h-6" />
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
// Importation des icônes
import chatIcon from '@/assets/icons/chat-avatar.svg'
import closeIcon from '@/assets/icons/close-white.svg'
import sendIcon from '@/assets/icons/send-icon.svg'

// Importation des services
import ChatbotService from '@/services/chatbot/chatbotService.js'
import { createMessage, MESSAGE_TYPES, DEFAULT_MESSAGES, validateUserMessage } from '@/services/chatbot/types.js'

import { ref, onMounted, nextTick } from 'vue'

// État du composant
const userMessage = ref("")
const messages = ref([])
const isLoading = ref(false)
const messagesContainer = ref(null)

// Émissions
const emit = defineEmits(['close-pop-up'])

// Initialisation
onMounted(() => {
  initWelcomeMessage()
})

// Ajouter le message de bienvenue
const initWelcomeMessage = () => {
  if (messages.value.length === 0) {
    const welcomeMessage = createMessage(
      MESSAGE_TYPES.BOT,
      DEFAULT_MESSAGES.WELCOME
    )
    messages.value.push(welcomeMessage)
  }
}

// Envoyer un message
const sendMessage = async () => {
  const validation = validateUserMessage(userMessage.value)
  
  if (!validation.isValid) {
    console.warn(validation.error)
    return
  }

  if (isLoading.value) return

  const messageText = validation.message
  userMessage.value = ''

  // Ajouter le message utilisateur
  const userMsg = createMessage(MESSAGE_TYPES.USER, messageText)
  messages.value.push(userMsg)

  // Scroll pour montrer le nouveau message
  nextTick(() => scrollToBottom())

  // Démarrer le loading
  isLoading.value = true

  try {
    // Appeler le service chatbot
    const response = await ChatbotService.sendMessage(messageText)
    
    if (response.success) {
      // Ajouter la réponse du bot
      const botMessage = createMessage(
        MESSAGE_TYPES.BOT,
        response.data.formatted_response,
        {
          categories: response.data.matched_categories,
          isUnknownQuestion: response.data.is_unknown_question,
          isOffTopic: response.data.is_off_topic
        }
      )
      messages.value.push(botMessage)
    } else {
      // Ajouter un message d'erreur
      const errorMessage = createMessage(
        MESSAGE_TYPES.BOT,
        response.error || DEFAULT_MESSAGES.ERROR
      )
      messages.value.push(errorMessage)
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error)
    const errorMessage = createMessage(
      MESSAGE_TYPES.BOT,
      DEFAULT_MESSAGES.ERROR
    )
    messages.value.push(errorMessage)
  } finally {
    isLoading.value = false
    nextTick(() => scrollToBottom())
  }
}

// Effacer la conversation
const clearChat = () => {
  messages.value = []
  initWelcomeMessage()
}

// Scroll vers le bas
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Formater l'heure
const formatTime = (date) => {
  return ChatbotService.formatMessageTime(date)
}
</script>

<style scoped>
.chat-avatar-body {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(16, 185, 129, 0.15);
  padding: 8px;
  box-sizing: content-box;
}

.chat-messages {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f7fafc;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.message-wrapper.user {
  display: flex;
  justify-content: flex-end;
}

.message-wrapper.user .flex {
  flex-direction: row-reverse;
}

.message-bubble {
  max-width: 85%;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  border-radius: 18px;
  word-wrap: break-word;
  position: relative;
}

.bot-message {
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(22, 163, 74, 0.15);
  color: #43A047;
  margin-left: 8px;
}

.user-message {
  background: #42b883;
  color: white;
  margin-right: 8px;
  border-radius: 18px 18px 4px 18px;
}

.bot-message {
  border-radius: 18px 18px 18px 4px;
}

.message-text {
  margin: 0;
  margin-bottom: 6px;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  gap: 8px;
  flex-wrap: wrap;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  white-space: nowrap;
}

.message-categories {
  font-size: 10px;
  background-color: rgba(66, 184, 131, 0.2);
  color: #42b883;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 500;
}

.message-status {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 6px;
  font-weight: 500;
  white-space: nowrap;
}

.message-status.unknown {
  background-color: rgba(255, 193, 7, 0.2);
  color: #ff8c00;
}

.message-status.off-topic {
  background-color: rgba(220, 53, 69, 0.2);
  color: #dc3545;
}

/* Animation de frappe */
.typing-animation {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
}

.typing-animation span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #42b883;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-animation span:nth-child(1) {
  animation-delay: 0s;
}

.typing-animation span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-animation span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 480px) {
  .fixed.bottom-5.right-5 {
    right: 10px;
    left: 10px;
    width: auto;
  }
}
</style>
