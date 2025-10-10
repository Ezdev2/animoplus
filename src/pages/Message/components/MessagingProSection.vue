<template>
    <!-- Cadre principal -->
    <div class="messaging-wrapper">

        <div class="header">
            <h2 class="title">Messagerie</h2>
            <button class="collab-btn">Collaboration active</button>
        </div>

        <hr class="h-px bg-[rgba(197,197,197,0.5)] my-4 border-none" />

        <!-- Barre de recherche -->
        <div class="search-bar">
            <img :src="searchIcon" alt="Search" class="icon" />
            <input type="text" placeholder="Rechercher" />
        </div>

        <!-- Contenu principal -->
        <div class="messaging-container">
            
            <!-- Colonne gauche -->
            <div class="sidebar">
                <div class="messages-header">
                    <span class="label">Mes messages</span>
                    <span class="count">{{ totalConversations }}</span>
                </div>

                <!-- Bouton Nouveau message -->
                <button class="new-message-btn" @click="openNewMessageModal">
                    <span class="plus-icon">+</span>
                    Nouveau message
                </button>

                <!-- Bouton Rafraîchir -->
                <button class="load-more" @click="handleRefresh" :disabled="isLoadingConversations">
                    <img :src="refreshIcon" alt="refresh" class="icon" />
                    {{ isLoadingConversations ? 'Chargement...' : 'Charger plus de conversations' }}
                </button>

                <!-- États de chargement et d'erreur -->
                <div v-if="isLoadingConversations && conversations.length === 0" class="loading-state">
                    <p>Chargement des conversations...</p>
                </div>

                <!-- Liste des messages -->
                <div v-if="!isLoadingConversations || conversations.length > 0" class="message-list">
                    <div v-if="conversations.length === 0" class="empty-state">
                        <p>Aucune conversation trouvée</p>
                    </div>
                    
                    <div
                        v-for="conv in conversations"
                        :key="conv.id"
                        class="message-item"
                        :class="{ 'selected': selectedConversationId === conv.id }"
                        @click="selectConversation(conv)"
                    >
                        <div class="avatar-wrapper">
                          <img :src="conv.image" :alt="conv.name" class="avatar" />
                          <span class="dot" :class="{ 'unread': conv.unread }"></span>
                        </div>

                        <div class="message-info">
                            <div class="top-row">
                                <div class="name-wrapper">
                                  <span class="name">{{ conv.name }}</span>
                                </div>
                            </div>
                            <div class="message-bottom-row">
                              <p class="preview">{{ conv.message }}</p>
                              <span class="time">{{ conv.time }}</span>
                            </div>
                        </div>
                        <span v-if="conv.userType === 'PATIENT'" class="badge">PATIENT</span>
                        <span v-else class="badge2">PRO</span>
                    </div>
                </div>
            </div>

            <!-- Colonne droite -->
            <div class="message-page">
                <!-- État vide - Aucune conversation sélectionnée -->
                <div v-if="!selectedConversationId" class="empty-chat-state">
                    <div class="empty-chat-content">
                        <div class="empty-chat-icon">💬</div>
                        <h3>Sélectionnez une conversation</h3>
                        <p>Choisissez une conversation dans la liste pour commencer à discuter</p>
                    </div>
                </div>

                <!-- Conversation sélectionnée -->
                <div v-else class="chat-content">
                    <!-- Header de la conversation -->
                    <div class="mp-header">
                        <img :src="selectedConversation?.otherParticipant?.avatar || image1" alt="User" class="user-pic" />
                        <div class="mp-header-info">
                            <span class="mp-username">{{ selectedConversation?.otherParticipant?.name || 'Utilisateur' }}</span>
                            <span class="mp-user-pro">{{ selectedConversation?.otherParticipant?.user_type === 'client' ? 'PATIENT' : 'PRO' }}</span>
                        </div>
                        <div class="mp-header-status">
                            <img :src="ellipse" alt="online" class="mp-status-dot" />
                            <span class="mp-status-text">{{ selectedConversation?.is_active ? 'En ligne' : 'Hors ligne' }}</span>
                        </div>
                    </div>

                    <!-- Messages de la conversation -->
                    <div ref="messagesContainer" class="conversation-list">
                        <!-- État de chargement des messages -->
                        <div v-if="isLoadingMessages" class="loading-messages">
                            <p>Chargement des messages...</p>
                        </div>

                        <!-- Messages -->
                        <div v-else-if="conversationMessages.length > 0">
                            <div
                                v-for="message in conversationMessages"
                                :key="message.id"
                                class="message-row"
                                :class="{ 'right': message.is_own_message, 'left': !message.is_own_message }"
                            >
                                <img 
                                    v-if="!message.is_own_message" 
                                    :src="message.sender?.avatar || image1" 
                                    alt="User" 
                                    class="msg-avatar" 
                                />
                                <div class="message-bubble">
                                    {{ message.content }}
                                    <div class="message-time">{{ formatMessageTime(message.sent_at) }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Aucun message -->
                        <div v-else class="no-messages">
                            <p>Aucun message dans cette conversation</p>
                        </div>
                    </div>

                    <!-- Zone de saisie -->
                    <div class="input-message-row">
                        <input 
                            type="text" 
                            class="input-message" 
                            placeholder="Écrire votre message ici ..." 
                            v-model="newMessageContent"
                            @keyup.enter="sendMessage"
                        />
                        <button class="send-btn" @click="sendMessage" :disabled="!newMessageContent.trim()">
                            <img :src="sendIcon" alt="Envoyer" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Nouveau message -->
        <NewMessageModal 
          :isOpen="isNewMessageModalOpen" 
          :isCreatingConversation="startOrFindConversationMutation.isPending?.value || false"
          @close="closeNewMessageModal"
          @userSelected="handleUserSelected"
        />
    </div>
</template>

<script setup>
import { computed, ref, nextTick, watch } from 'vue'
import { useMessaging } from '@/composables/useMessaging.js'
import { useConversationQuery, useMessagesQuery, useSendMessage, useStartOrFindConversation } from '@/services/messaging/messagingQueries.js'
import NewMessageModal from '@/components/NewMessageModal.vue'
import searchIcon from '@/assets/icons/breeder-search-black.svg'
import refreshIcon from '@/assets/icons/refresh.svg'
import defaultAvatar from '@/assets/images/default_avatar.svg'

import image1 from '@/assets/images/image1.svg'
import ellipse from '@/assets/layers/Ellipse.svg'
import calendar from '@/assets/icons/calendar.svg'
import sendIcon from '@/assets/icons/send-icon.svg'

// État local pour la conversation sélectionnée
const selectedConversationId = ref(null)
const newMessageContent = ref('')
const messagesContainer = ref(null)

// État pour le modal nouveau message
const isNewMessageModalOpen = ref(false)

// Utiliser le composable de messagerie
const {
  conversations: apiConversations,
  isLoadingConversations,
  totalUnreadCount,
  refreshConversations,
  formatMessageTime,
  formatUserName,
  getUserAvatar,
  truncateText
} = useMessaging()

// Query pour la conversation sélectionnée
const selectedConversationQuery = useConversationQuery(selectedConversationId, {
  with_participants: true,
  with_messages: true,
  with_unread_count: true
})
const messagesQuery = useMessagesQuery(selectedConversationId, {
  with_sender: true,
  with_read_status: true,
  per_page: 100,
  sort_by: 'sent_at',
  sort_order: 'desc' // Récents en premier depuis l'API
})
const sendMessageMutation = useSendMessage()
const startOrFindConversationMutation = useStartOrFindConversation()

// Transformer les données API pour l'affichage
const conversations = computed(() => {
  if (!apiConversations.value || apiConversations.value.length === 0) {
    return []
  }
  
  console.log('🔄 Transformation des conversations API:', apiConversations.value)
  
  return apiConversations.value.map(conv => {
    // Utiliser other_participant de la réponse API
    const otherParticipant = conv.other_participant
    let displayName = 'Conversation'
    let avatarUrl = defaultAvatar
    let userType = 'PATIENT'

    if (conv.type === 'direct' && otherParticipant) {
      // Le backend nous donne directement l'autre participant
      displayName = formatUserName(otherParticipant) || otherParticipant.name || 'Utilisateur'
      avatarUrl = getUserAvatar(otherParticipant, defaultAvatar)
      // Déterminer le type d'utilisateur basé sur user_type
      userType = otherParticipant.user_type === 'client' ? 'PATIENT' : 'PRO'
    } else if (conv.type === 'group' && conv.title) {
      displayName = conv.title
    }

    // Formater le dernier message
    let lastMessage = 'Aucun message'
    let lastMessageTime = ''
    
    if (conv.last_message) {
      lastMessage = truncateText(conv.last_message.content, 50)
      lastMessageTime = formatMessageTime(conv.last_message.sent_at)
    } else if (conv.last_activity_at) {
      lastMessageTime = formatMessageTime(conv.last_activity_at)
    } else if (conv.created_at) {
      lastMessage = 'Nouvelle conversation'
      lastMessageTime = formatMessageTime(conv.created_at)
    }

    return {
      id: conv.id,
      name: displayName,
      image: avatarUrl,
      userType: userType,
      isActive: conv.is_active,
      unread: conv.unread_count > 0,
      unreadCount: conv.unread_count || 0,
      message: lastMessage,
      time: lastMessageTime,
      // Données brutes pour référence
      rawData: conv
    }
  })
})

// Nombre total de conversations
const totalConversations = computed(() => {
  return conversations.value.length
})

// Fonction pour recharger les conversations
const handleRefresh = async () => {
  try {
    console.log('🔄 Rafraîchissement des conversations...')
    await refreshConversations()
    console.log('✅ Conversations rafraîchies')
  } catch (error) {
    console.error('❌ Erreur lors du rafraîchissement:', error)
  }
}

// Computed properties pour la conversation sélectionnée
const selectedConversation = computed(() => {
  const conversation = selectedConversationQuery.data?.value?.data
  if (!conversation) return null

  // Trouver l'autre participant (pas l'utilisateur actuel)
  const otherParticipant = conversation.participants?.find(p => 
    p.pivot?.role !== 'owner' // Assumant que l'utilisateur actuel est le owner
  ) || conversation.participants?.[0] // Fallback au premier participant

  return {
    ...conversation,
    otherParticipant
  }
})

const conversationMessages = computed(() => {
  const messages = messagesQuery.data?.value?.data || []
  
  console.log('🔍 Messages bruts avant tri:', messages.map(m => ({
    id: m.id,
    content: m.content.substring(0, 20) + '...',
    sent_at: m.sent_at,
    date_parsed: new Date(m.sent_at)
  })))
  
  // L'API retourne les messages en ordre DESC (récents en premier)
  // On inverse pour avoir récents en bas près de l'input
  const sortedMessages = [...messages].reverse()
  
  console.log('🔍 Messages après tri:', sortedMessages.map(m => ({
    id: m.id,
    content: m.content.substring(0, 20) + '...',
    sent_at: m.sent_at
  })))
  
  return sortedMessages
})

const isLoadingMessages = computed(() => {
  return messagesQuery.isLoading?.value || false
})

// Fonction pour scroller vers le bas
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Watcher pour scroller automatiquement quand les messages changent
watch(conversationMessages, () => {
  scrollToBottom()
}, { flush: 'post' })

// Fonction pour sélectionner une conversation
const selectConversation = (conversation) => {
  console.log('🎯 Sélection de la conversation:', conversation)
  console.log('🔍 ID de la conversation:', conversation.id)
  console.log('🔍 Type de l\'ID:', typeof conversation.id)
  
  // S'assurer que l'ID est une chaîne
  const conversationId = conversation.rawData?.id || conversation.id
  console.log('🔍 ID final utilisé:', conversationId)
  
  selectedConversationId.value = String(conversationId)
}

// Fonction pour envoyer un message
const sendMessage = async () => {
  if (!newMessageContent.value.trim() || !selectedConversationId.value) return

  try {
    console.log('📤 Envoi du message:', newMessageContent.value)
    
    await sendMessageMutation.mutateAsync({
      conversationId: selectedConversationId.value,
      messageData: {
        content: newMessageContent.value.trim(),
        type: 'text'
      }
    })

    // Vider le champ de saisie
    newMessageContent.value = ''
    console.log('✅ Message envoyé avec succès')
    
    // Scroller vers le bas après l'envoi
    await scrollToBottom()
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi du message:', error)
  }
}

// Fonctions pour le modal nouveau message
const openNewMessageModal = () => {
  isNewMessageModalOpen.value = true
}

const closeNewMessageModal = () => {
  isNewMessageModalOpen.value = false
}

const handleUserSelected = async (user) => {
  console.log('👤 Utilisateur sélectionné pour nouveau message:', user)
  
  try {
    // Créer ou trouver une conversation avec cet utilisateur
    const result = await startOrFindConversationMutation.mutateAsync({
      user_id: user.id
    })
    
    console.log('✅ Conversation créée/trouvée:', result)
    
    // Sélectionner automatiquement la conversation
    if (result.data?.conversation?.id) {
      selectedConversationId.value = result.data.conversation.id
      console.log('🎯 Conversation sélectionnée:', result.data.conversation.id)
    }
    
    // Rafraîchir la liste des conversations pour voir la nouvelle/mise à jour
    await refreshConversations()
    
  } catch (error) {
    console.error('❌ Erreur lors de la création/recherche de conversation:', error)
  }
}
</script>

<style scoped>
.messaging-wrapper {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 24px;
  background-color: #fff;
}
/* header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.title {
  font-size: 19px;
  font-weight: bold;
  color: #232323;
  margin: 0;
}
.collab-btn {
  background-color: #A0522D;
  box-shadow: 0 4px 12px 0 rgba(245, 158, 11, 0.25);
  color: #fff;
  font-size: 15px;
  border-radius: 20px;
  border: none;
  padding: 10px 28px;
  font-weight: 500;
  cursor: pointer;
  transition: filter 0.2s;
}
/* barre de recherche */
.search-bar {
  display: flex;
  align-items: center;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 8px 12px;
  background-color: #fff;
  width: 100%;
  margin-bottom: 0;
}

.search-bar .icon {
  width: 16px;
  margin-right: 8px;
}

.search-bar input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #2E2E30;
  background: transparent;
}
/* Conteneur principal */
.messaging-container {
  display: flex;
  gap: 20px;
  height: 600px; /* Hauteur fixe pour le conteneur */
}
/* Colonne gauche */
.sidebar {
  flex: 0 0 350px; /* Largeur fixe de 350px, ne rétrécit pas */
  padding: 20px;
  overflow-y: auto; /* Scroll si nécessaire */
}
.messages-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 500;
}
.new-message-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  cursor: pointer;
  width: 100%;
  height: 45px;
  transition: all 0.2s;
}

.new-message-btn:hover {
  background: linear-gradient(135deg, #2563EB, #1E40AF);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.plus-icon {
  font-size: 18px;
  font-weight: bold;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.load-more {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #fff;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  color: #4B5563;
  margin-bottom: 20px;
  cursor: pointer;
  width: 100%;
  height: 45px;
}
.load-more .icon {
  width: 25px;
}
/* Liste de messages */
.message-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.message-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--Stroke, #F1F3F9);
  position: relative;
  transition: background-color 0.2s;
}
.message-item:hover {
  background-color: #F9FAFB;
}
.message-item.selected {
  background-color: #EBF8FF;
  border-left: 3px solid #3B82F6;
}
.avatar-wrapper {
  position: relative;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
}
.avatar {
  width: 42px;
  height: 42px;
  border-radius: 25%;
  object-fit: cover;
}
.message-info {
  flex: 1;
}
.top-row {
  display: flex;
  justify-content: space-between;
}
.name-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}
.dot {
  position: absolute;
  top: 1px;
  right: -4px;
  width: 10px;
  height: 10px;
  background-color: #D1D5DB;
  border: 2px solid white;
  border-radius: 50%;
}
.dot.unread {
  background-color: #3B82F6;
}
.name {
  font-weight: 700;
  font-size: 14px;
  color: #45464E;
}
.message-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.time {
  font-size: 11px;
  color: #A1A1AA;
}
.preview {
  font-size: 11px;
  color: #4B5563;
  margin-top: 2px;
}
.badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(251, 191, 36, 0.20);
  color: var(--Accent---500, #A0522D);
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 6px;
}
.badge2 {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(22, 163, 74, 0.15);
  color: var(--Primary---600, #43A047);
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 6px;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 20px;
  color: #6B7280;
}

/* Colonne droite */
.message-page {
  display: flex;
  flex: 1; /* Prend tout l'espace restant */
  padding: 0 0 24px 0;
  flex-direction: column;
  border-radius: 12px;
  border: 1px solid var(--Neutral---200, #E5E7EB);
  background: #FFF;
  margin-top: 20px;
  min-height: 0; /* Permet le scroll dans les enfants */
}
.mp-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #E5E7EB;
  width: 100%;
}
.user-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.mp-header-info {
  flex: 1;
}
.mp-username {
  font-weight: 600;
  font-size: 16px;
  color: #1F2937;
}
.mp-user-pro {
  font-size: 12px;
  color: #6B7280;
}
.mp-header-status {
  display: flex;
  align-items: center;
  gap: 8px;
}
.mp-status-dot {
  width: 8px;
  height: 8px;
}
.mp-status-text {
  font-size: 12px;
  color: #10B981;
}

.rdv-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  margin: 16px 20px;
  background: #F9FAFB;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
}
.mp-calendar {
  width: 24px;
  height: 24px;
}
.rdv-info {
  flex: 1;
}
.rdv-title {
  font-weight: 600;
  font-size: 14px;
  color: #1F2937;
}
.rdv-sub {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}
.mp-rdv-ellipse {
  width: 6px;
  height: 6px;
}
.rdv-with {
  font-size: 12px;
  color: #6B7280;
}

.conversation-list {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  scroll-behavior: smooth;
  min-height: 300px; /* Hauteur minimum */
}
.message-row {
  display: flex;
  margin-bottom: 16px;
}
.message-row.left {
  justify-content: flex-start;
}
.message-row.right {
  justify-content: flex-end;
}
.msg-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}
.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
}
.message-row.left .message-bubble {
  background: #F3F4F6;
  color: #1F2937;
}
.message-row.right .message-bubble {
  background: #3B82F6;
  color: white;
}

.input-message-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #E5E7EB;
}
.input-message {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 24px;
  outline: none;
  font-size: 14px;
}
.input-message:focus {
  border-color: #3B82F6;
}
.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3B82F6;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.send-btn:hover {
  background: #2563EB;
}
.send-btn img {
  width: 20px;
  height: 20px;
}

/* État vide du chat */
.empty-chat-state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 400px;
}

.empty-chat-content {
  text-align: center;
  color: #6B7280;
}

.empty-chat-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-chat-content h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

.empty-chat-content p {
  font-size: 14px;
  color: #6B7280;
}

/* États de chargement et messages */
.loading-messages, .no-messages {
  text-align: center;
  padding: 40px 20px;
  color: #6B7280;
}

.message-time {
  font-size: 11px;
  color: #9CA3AF;
  margin-top: 4px;
}

.message-row.right .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.chat-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0; /* Permet le scroll dans les enfants */
}
</style>
