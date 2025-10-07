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
                <div class="mp-header">
                    <img :src="image1" alt="User" class="user-pic" />
                    <div class="mp-header-info">
                        <span class="mp-username">Jane Doe</span>
                        <span class="mp-user-pro">PRO</span>
                    </div>
                    <div class="mp-header-status">
                        <img :src="ellipse" alt="online" class="mp-status-dot" />
                        <span class="mp-status-text">Vous collaborez actuellement</span>
                    </div>
                </div>

                <div class="rdv-card">
                    <img :src="calendar" alt="calendar" class="mp-calendar" />

                    <div class="rdv-info">
                        <div class="rdv-title">Suivi de santé de Sandra</div>
                        <div class="rdv-sub">
                            <img :src="ellipse" alt="ellipse" class="mp-rdv-ellipse" />
                            <span class="rdv-with">Avec Jane Doe</span>
                        </div>
                    </div>

                    <div class="self-stretch inline-flex justify-center items-center gap-5">
                        <div
                            class="justify-center text-neutral-800 text-base font-semibold font-['League_Spartan'] leading-normal">
                            10:45 <br />AM
                        </div>
                        <div class="w-6 h-6 relative">
                            <div
                                class="w-[5.01px] h-[5.02px] left-[15.49px] top-[14.99px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-color-gray-100">
                            </div>
                            <div
                                class="w-4 h-0 left-[3.50px] top-[14.99px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-color-gray-100">
                            </div>
                            <div
                                class="w-[5.01px] h-[5.02px] left-[3.50px] top-[3.99px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-color-gray-100">
                            </div>
                            <div
                                class="w-4 h-0 left-[3.50px] top-[9.01px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-color-gray-100">
                            </div>
                            <div class="w-6 h-6 left-[24px] top-[24px] absolute origin-top-left -rotate-180 opacity-0"></div>
                        </div>
                        <div
                            class="justify-center text-neutral-800 text-base font-semibold font-['League_Spartan'] leading-normal">
                            10:45 <br />AM
                        </div>
                    </div>

                </div>

                <div class="conversation-list">
                    <!-- Message patient -->
                    <div class="message-row left">
                        <img :src="image1" alt="User" class="msg-avatar" />
                        <div class="message-bubble">
                            Bonjour, j'aimerais prendre rendez-vous pour mon chien lundi prochain. Est-ce possible ?
                        </div>
                    </div>

                    <!-- Message pro -->
                    <div class="message-row right">
                        <div class="message-bubble">
                            Bonjour ! Oui, nous avons des créneaux disponibles lundi matin et après-midi.  
                            Préférez-vous une consultation en ligne ou sur place ?
                        </div>
                    </div>

                    <!-- Message patient -->
                    <div class="message-row left">
                        <img :src="image1" alt="User" class="msg-avatar" />
                        <div class="message-bubble">
                            En ligne si possible, vers 10h ce serait parfait. Merci !
                        </div>
                    </div>
                </div>

                <div class="input-message-row">
                    <input type="text" class="input-message" placeholder="Écrire vos messages ici ..." />
                    <button class="send-btn">
                        <img :src="sendIcon" alt="Envoyer" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMessaging } from '@/composables/useMessaging.js'
import searchIcon from '@/assets/icons/breeder-search-black.svg'
import refreshIcon from '@/assets/icons/refresh.svg'
import defaultAvatar from '@/assets/images/default_avatar.svg'

import image1 from '@/assets/images/image1.svg'
import ellipse from '@/assets/layers/Ellipse.svg'
import calendar from '@/assets/icons/calendar.svg'
import sendIcon from '@/assets/icons/send-icon.svg'

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
}
/* Colonne gauche */
.sidebar {
  width: 30%;
  padding: 20px;
}
.messages-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 500;
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
  width: 354px;
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
  width: 90%;
  padding: 0 0 24px 0;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 12px;
  border: 1px solid var(--Neutral---200, #E5E7EB);
  background: #FFF;
  margin-top: 20px;
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
</style>
