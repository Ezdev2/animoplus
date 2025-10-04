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

                <button class="load-more" @click="handleRefresh" :disabled="isLoading">
                    <img :src="refreshIcon" alt="refresh" class="icon" />
                    {{ isLoading ? 'Chargement...' : 'Charger plus de conversations' }}
                </button>

                <!-- États de chargement et d'erreur -->
                <div v-if="isLoading && conversations.length === 0" class="loading-state">
                    <p>Chargement des conversations...</p>
                </div>

                <div v-if="error" class="error-state">
                    <p>Erreur lors du chargement des conversations</p>
                    <button @click="handleRefresh" class="retry-btn">Réessayer</button>
                </div>

                <!-- Liste des messages -->
                <div v-if="!isLoading || conversations.length > 0" class="message-list">
                    <div v-if="conversations.length === 0" class="empty-state">
                        <p>Aucune conversation trouvée</p>
                    </div>
                    
                    <div
                        v-for="conv in conversations"
                        :key="conv.id"
                        class="message-item"
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
                <div class="mp-header" v-if="selectedConversationInfo">
                    <img :src="selectedConversationInfo.avatar" :alt="selectedConversationInfo.name" class="user-pic" />
                    <div class="mp-header-info">
                        <span class="mp-username">{{ selectedConversationInfo.name }}</span>
                        <span class="mp-user-pro" :class="{ 'patient': selectedConversationInfo.userType === 'PATIENT' }">
                            {{ selectedConversationInfo.userType }}
                        </span>
                    </div>
                    <div class="mp-header-status">
                        <img :src="ellipse" alt="online" class="mp-status-dot" />
                        <span class="mp-status-text">
                            {{ selectedConversationInfo.isActive ? 'Vous collaborez actuellement' : 'Hors ligne' }}
                        </span>
                    </div>
                </div>
                <div class="mp-header" v-else>
                    <div class="no-conversation-selected">
                        <span>Sélectionnez une conversation pour commencer</span>
                    </div>
                </div>

                <!-- <div class="rdv-card">
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

                </div> -->

                <div class="conversation-list">
                    <!-- Aucune conversation sélectionnée - État par défaut -->
                    <div v-if="!selectedConversationId" class="no-conversation">
                        <p>Sélectionnez une conversation pour voir les messages</p>
                    </div>

                    <!-- État de chargement des messages -->
                    <div v-else-if="isLoadingMessages" class="messages-loading">
                        <p>Chargement des messages...</p>
                    </div>

                    <!-- Erreur lors du chargement des messages -->
                    <div v-else-if="messagesError" class="messages-error">
                        <p>Erreur lors du chargement des messages</p>
                        <button @click="refetchMessages" class="retry-btn">Réessayer</button>
                    </div>

                    <!-- Messages de la conversation -->
                    <div v-else-if="conversationMessages.length === 0" class="no-messages">
                        <p>Aucun message dans cette conversation</p>
                    </div>

                    <!-- Liste des messages -->
                    <template v-else>
                        <div 
                            v-for="message in conversationMessages" 
                            :key="message.id"
                            class="message-row"
                            :class="{ 'left': !message.isCurrentUser, 'right': message.isCurrentUser }"
                        >
                            <img 
                                v-if="!message.isCurrentUser"
                                :src="message.senderAvatar" 
                                :alt="message.senderName" 
                                class="msg-avatar" 
                            />
                            <div class="message-bubble">
                                <div class="message-content">{{ message.content }}</div>
                                <div class="message-meta">
                                    <span class="message-time">{{ message.formattedTime }}</span>
                                    <span v-if="message.isEdited" class="edited-indicator">(modifié)</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>

                <div class="input-message-row" v-if="selectedConversationId">
                    <input 
                        type="text" 
                        class="input-message" 
                        placeholder="Écrire vos messages ici ..." 
                        v-model="newMessageContent"
                        @keypress="handleKeyPress"
                        :disabled="isSendingMessage || isLoadingMessages"
                    />
                    <button 
                        class="send-btn" 
                        @click="sendMessage"
                        :disabled="!newMessageContent.trim() || isSendingMessage || isLoadingMessages"
                        :class="{ 'sending': isSendingMessage }"
                    >
                        <img v-if="!isSendingMessage" :src="sendIcon" alt="Envoyer" />
                        <div v-else class="spinner"></div>
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal Nouveau message -->
        <!-- Debug: {{ showNewMessageModal }} -->
        <div v-if="showNewMessageModal" class="modal-overlay" @click="closeNewMessageModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>Nouveau message</h3>
                    <button class="close-btn" @click="closeNewMessageModal">&times;</button>
                </div>
                
                <div class="modal-body">
                    <!-- Barre de recherche -->
                    <div class="search-input-container">
                        <div class="search-input-wrapper">
                            <input 
                                type="text" 
                                v-model="searchQuery"
                                placeholder="Rechercher un utilisateur..."
                                class="search-input"
                                @input="handleSearchInput"
                                @keypress.enter="performSearch"
                            />
                            <button 
                                class="search-btn"
                                @click="performSearch"
                                :disabled="!searchQuery.trim() || searchQuery.length < 2"
                            >
                                Rechercher
                            </button>
                        </div>
                        
                        <!-- Filtres de recherche -->
                        <div class="search-filters">
                            <label class="filter-option">
                                <input 
                                    type="checkbox" 
                                    v-model="searchOnlyVeterinarians"
                                    @change="handleFilterChange"
                                />
                                <span>Vétérinaires uniquement</span>
                            </label>
                        </div>
                    </div>

                    <!-- Résultats de recherche -->
                    <div class="search-results">
                        <!-- Debug: {{ debugDisplay }} -->
                        <!-- Debug Loading: {{ debugLoading }} -->
                        <!-- État de chargement -->
                        <div v-if="isManualSearching" class="search-loading">
                            <p>Recherche en cours...</p>
                        </div>

                        <!-- Erreur de validation -->
                        <div v-else-if="searchQuery.length > 0 && searchQuery.length < 2" class="validation-error">
                            <p>⚠️ Veuillez saisir au moins 2 caractères avant de rechercher</p>
                        </div>

                        <!-- Erreur générale -->
                        <div v-else-if="searchError && searchQuery.length >= 2" class="search-error">
                            <p>❌ Erreur lors de la recherche</p>
                            <p class="error-details">{{ searchError.message }}</p>
                        </div>

                        <!-- Aucun résultat -->
                        <div v-else-if="actualSearchQuery && safeSearchResults.length === 0 && !isSearching" class="no-results">
                            <p>Aucun utilisateur trouvé pour "{{ actualSearchQuery }}"</p>
                        </div>

                        <!-- Liste des utilisateurs -->
                        <div v-else-if="safeSearchResults.length > 0" class="users-list">
                            <div 
                                v-for="user in safeSearchResults" 
                                :key="user.id"
                                class="user-item"
                                @click="selectUser(user)"
                            >
                                <img :src="user.avatar || defaultAvatar" :alt="user.name" class="user-avatar" />
                                <div class="user-info">
                                    <span class="user-name">{{ user.name }}</span>
                                    <span class="user-email">{{ user.email }}</span>
                                    <span class="user-type" :class="getUserTypeClass(user.user_type)">
                                        {{ getUserTypeLabel(user.user_type) }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Message initial -->
                        <div v-else class="search-placeholder">
                            <p>Saisissez un nom d'utilisateur et cliquez sur "Rechercher"</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useMessaging } from '@/composables/useMessaging.js'
import { useStartOrFindConversation, useMessagesQuery, useSendMessage } from '@/services/messaging/messagingQueries.js'
import { useUserSearch } from '@/services/users/userQueries.js'
// Plus besoin du store auth, le backend gère l'identification
import searchIcon from '@/assets/icons/breeder-search-black.svg'
import refreshIcon from '@/assets/icons/refresh.svg'
import defaultAvatar from '@/assets/images/default-avatar.svg'

import ellipse from '@/assets/layers/Ellipse.svg'
import calendar from '@/assets/icons/calendar.svg'
import sendIcon from '@/assets/icons/send-icon.svg'

// Utiliser le composable messaging
const { useConversations, formatMessageDate, formatMessageTime, truncateText } = useMessaging()

// ✅ Plus besoin de récupérer l'utilisateur connecté, le backend gère tout

// État pour la conversation sélectionnée - Initialisé à null pour éviter les requêtes automatiques
const selectedConversationId = ref(null)
const selectedConversation = ref(null)

// Récupérer les conversations avec les options nécessaires
const { conversations: apiConversations, isPending: isLoading, error, refetch } = useConversations({
  with_participants: true,
  with_last_message: true,
  with_unread_count: true,
  per_page: 20
})

// Query pour récupérer les messages de la conversation sélectionnée
const { 
  data: messagesData, 
  isPending: isLoadingMessages, 
  error: messagesError,
  refetch: refetchMessages 
} = useMessagesQuery(selectedConversationId, {
  per_page: 50,
  sort_by: 'sent_at',
  sort_order: 'asc'
})

// Hook pour envoyer des messages
const sendMessageMutation = useSendMessage()

// Hook pour démarrer/trouver une conversation
const startOrFindConversationMutation = useStartOrFindConversation()

// État pour l'input de message
const newMessageContent = ref('')
const isSendingMessage = ref(false)

// État pour le modal nouveau message
const showNewMessageModal = ref(false)

// États pour la recherche d'utilisateurs
const searchQuery = ref('')
const actualSearchQuery = ref('')
const searchOnlyVeterinarians = ref(false)
const isManualSearching = ref(false) // État pour le chargement manuel

// Computed pour les filtres de recherche dynamiques
const searchFilters = computed(() => {
  const filters = {
    per_page: 15, // Limite raisonnable pour conversations
    with_profile: true,
    with_user: true
  }
  
  // Ajouter filtre vétérinaires si activé
  if (searchOnlyVeterinarians.value) {
    filters.user_type = 'veterinarian'
    console.log('🩺 Filtre vétérinaires activé')
  }
  
  return filters
})

// Hook de recherche d'utilisateurs - utiliser actualSearchQuery avec filtres dynamiques
const { data: searchResults, isPending: isSearching, error: searchError } = useUserSearch(
  computed(() => actualSearchQuery.value),
  computed(() => searchFilters.value)
)

// Computed pour gérer les résultats de recherche de manière sûre
const safeSearchResults = computed(() => {
  console.log('🔍 Search results:', searchResults.value)
  console.log('🔍 Search query (input):', searchQuery.value)
  console.log('🔍 Actual search query (API):', actualSearchQuery.value)
  console.log('🔍 Is searching:', isSearching.value)
  console.log('🔍 Search error:', searchError.value)
  console.log('🔍 Results count:', searchResults.value?.length || 0)
  console.log('🔍 Results type:', typeof searchResults.value)
  console.log('🔍 Results is array:', Array.isArray(searchResults.value))
  
  if (searchResults.value && searchResults.value.length > 0) {
    console.log('👤 Premier utilisateur:', searchResults.value[0])
  }
  
  return searchResults.value || []
})

// Computed pour diagnostiquer l'affichage
const debugDisplay = computed(() => {
  const conditions = {
    isSearching: isSearching.value,
    validationError: searchQuery.value.length > 0 && searchQuery.value.length < 2,
    generalError: searchError.value && searchQuery.value.length >= 2,
    noResults: actualSearchQuery.value && safeSearchResults.value.length === 0 && !isSearching.value,
    hasResults: safeSearchResults.value.length > 0,
    fallback: 'none of the above'
  }
  
  console.log('🎯 Display conditions:', conditions)
  return conditions
})

// Computed pour diagnostiquer les états de chargement
const debugLoading = computed(() => {
  const loadingStates = {
    isSearching: isSearching.value,
    isManualSearching: isManualSearching.value,
    isLoadingConversations: isLoading.value,
    isLoadingMessages: isLoadingMessages.value,
    isPendingConversation: startOrFindConversationMutation.isPending,
    isPendingSendMessage: sendMessageMutation.isPending
  }
  
  console.log('⏳ Loading states:', loadingStates)
  return loadingStates
})

// Watcher pour désactiver isManualSearching quand la recherche TanStack Query se termine
watch([isSearching, searchResults], ([searching, results]) => {
  if (!searching && results && isManualSearching.value) {
    console.log('✅ Recherche terminée, désactivation du chargement manuel')
    isManualSearching.value = false
  }
})

// Transformer les données API pour l'affichage
const conversations = computed(() => {
  if (!apiConversations.value || apiConversations.value.length === 0) {
    return []
  }
  
  return apiConversations.value.map(conv => {
    // ✅ Utiliser la nouvelle propriété other_participant du backend
    let displayName = 'Conversation'
    let avatarUrl = defaultAvatar
    let userType = 'PRO' // Par défaut PRO pour cette section
    
    if (conv.type === 'direct' && conv.other_participant) {
      // ✅ Le backend nous donne directement l'autre participant
      displayName = conv.other_participant.name || 'Utilisateur'
      avatarUrl = conv.other_participant.avatar || defaultAvatar
      // Déterminer le type d'utilisateur basé sur user_type
      userType = conv.other_participant.user_type === 'client' ? 'PATIENT' : 'PRO'
    } else if (conv.type === 'group' && conv.title) {
      displayName = conv.title
    }
    
    // Formater le dernier message
    let lastMessageText = 'Aucun message'
    let messageTime = ''
    
    if (conv.last_message) {
      lastMessageText = truncateText(conv.last_message.content, 40)
      messageTime = formatMessageTime(conv.last_message.created_at)
    }
    
    return {
      id: String(conv.id), // S'assurer que l'ID est une chaîne
      name: displayName,
      message: lastMessageText,
      time: messageTime,
      unread: conv.unread_count > 0,
      unreadCount: conv.unread_count || 0,
      image: avatarUrl,
      type: conv.type,
      userType: userType,
      lastActivity: conv.last_activity_at,
      isActive: conv.is_active,
      isArchived: conv.is_archived
    }
  })
})

// Nombre total de conversations
const totalConversations = computed(() => {
  return conversations.value.length
})

// Fonction pour recharger les conversations
const handleRefresh = async () => {
  console.log('🔄 Rechargement des conversations...')
  await refetch()
}

// Messages de la conversation sélectionnée
const conversationMessages = computed(() => {
  console.log('🔍 messagesData.value:', messagesData.value)
  console.log('🔍 messagesData.value?.data:', messagesData.value?.data)
  
  // La structure réelle est messagesData.value.data (Array) directement
  if (!messagesData.value?.data || !Array.isArray(messagesData.value.data)) {
    console.log('❌ Pas de données de messages trouvées ou format incorrect')
    return []
  }
  
  const messages = messagesData.value.data.map(message => {
    // ✅ Utiliser la nouvelle propriété is_own_message de l'API
    const isCurrentUser = message.is_own_message
    console.log(`📝 Message "${message.content}" - Sender: ${message.sender?.name} - is_own_message: ${message.is_own_message}`)
    
    return {
      id: message.id,
      content: message.content,
      senderId: message.sender_id,
      senderName: message.sender?.name || 'Utilisateur',
      senderAvatar: message.sender?.avatar || defaultAvatar,
      senderType: message.sender?.user_type || 'client',
      sentAt: message.sent_at,
      formattedTime: formatMessageTime(message.sent_at),
      isCurrentUser: isCurrentUser, // ✅ Directement depuis l'API
      messageType: message.message_type,
      isEdited: message.is_edited,
      editedAt: message.edited_at
    }
  }).sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt)) // Trier par ordre chronologique
  
  console.log('✅ Messages transformés:', messages)
  console.log('✅ Nombre de messages:', messages.length)
  return messages
})

// Informations sur la conversation sélectionnée
const selectedConversationInfo = computed(() => {
  if (!selectedConversation.value) {
    return null
  }
  
  // ✅ Les informations sont déjà correctement formatées par la transformation ci-dessus
  return {
    name: selectedConversation.value.name, // Nom de l'interlocuteur
    avatar: selectedConversation.value.image, // Avatar de l'interlocuteur  
    userType: selectedConversation.value.userType, // Type de l'interlocuteur
    isActive: selectedConversation.value.isActive || false
  }
})

// Fonction pour sélectionner une conversation
const selectConversation = (conversation) => {
  console.log('📱 Conversation sélectionnée:', conversation)
  console.log('📱 ID de la conversation:', conversation.id, 'type:', typeof conversation.id)
  
  // Vérifier que l'ID existe et est valide
  if (!conversation.id) {
    console.error('❌ ID de conversation manquant')
    return
  }
  
  // S'assurer que l'ID est une chaîne valide
  const conversationId = String(conversation.id).trim()
  
  if (!conversationId || conversationId === 'null' || conversationId === 'undefined') {
    console.error('❌ ID de conversation invalide:', conversationId)
    return
  }
  
  selectedConversationId.value = conversationId
  selectedConversation.value = conversation
  
  console.log('✅ Conversation sélectionnée avec succès')
  console.log('📱 ID sélectionné:', selectedConversationId.value, 'type:', typeof selectedConversationId.value)
}

// Fonction pour envoyer un message
const sendMessage = async () => {
  if (!selectedConversationId.value) {
    console.error('❌ Aucune conversation sélectionnée')
    return
  }
  
  const content = newMessageContent.value.trim()
  if (!content) {
    console.error('❌ Message vide')
    return
  }
  
  isSendingMessage.value = true
  
  try {
    const messageData = {
      conversation_id: selectedConversationId.value,
      content: content,
      message_type: 'text',
      priority: 'normal'
    }
    
    console.log('📤 Envoi du message:', messageData)
    
    await sendMessageMutation.mutateAsync(messageData)
    
    // Vider l'input après envoi réussi
    newMessageContent.value = ''
    
    console.log('✅ Message envoyé avec succès')
    
    // Optionnel: recharger les messages pour s'assurer de la synchronisation
    await refetchMessages()
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi du message:', error)
  } finally {
    isSendingMessage.value = false
  }
}

// Fonction pour gérer l'envoi avec Enter
const handleKeyPress = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

// Fonctions pour le modal nouveau message
const openNewMessageModal = () => {
  console.log('🔓 Ouverture du modal nouveau message')
  showNewMessageModal.value = true
  searchQuery.value = ''
  console.log('🔓 Modal state:', showNewMessageModal.value)
}

const closeNewMessageModal = () => {
  showNewMessageModal.value = false
  searchQuery.value = ''
  actualSearchQuery.value = '' // Réinitialiser aussi la query de recherche
  searchOnlyVeterinarians.value = false // Réinitialiser les filtres
  console.log('🔒 Modal fermé - Filtres réinitialisés')
}

const handleSearchInput = () => {
  console.log('🔍 Input changé:', searchQuery.value)
  
  // Si l'utilisateur vide complètement le champ, vider aussi les résultats
  if (searchQuery.value.trim() === '') {
    console.log('🧹 Champ vidé - Nettoyage des résultats')
    actualSearchQuery.value = ''
  }
  
  // Sinon, ne pas déclencher automatiquement la recherche
  // L'utilisateur doit cliquer sur "Rechercher" ou appuyer sur Entrée
}

const performSearch = () => {
  const trimmedQuery = searchQuery.value.trim()
  
  console.log('🔍 Tentative de recherche avec:', `"${trimmedQuery}"`, `(${trimmedQuery.length} caractères)`)
  
  if (trimmedQuery.length >= 2) {
    console.log('✅ Déclenchement de la recherche pour:', trimmedQuery)
    console.log('📊 Paramètres de recherche:', {
      search: trimmedQuery,
      ...searchFilters.value
    })
    
    // Activer l'état de chargement manuel
    isManualSearching.value = true
    actualSearchQuery.value = trimmedQuery
    
    // Désactiver l'état de chargement après un délai (sera géré par le hook)
    setTimeout(() => {
      isManualSearching.value = false
    }, 2000) // 2 secondes max
    
  } else if (trimmedQuery.length === 1) {
    console.log('⚠️ Validation échouée - Recherche trop courte (1 caractère):', trimmedQuery)
    console.log('📝 Selon collection Postman: minimum 2 caractères requis')
    // Réinitialiser la recherche pour afficher le message de validation
    actualSearchQuery.value = ''
  } else {
    console.log('❌ Recherche vide - aucune action')
    actualSearchQuery.value = ''
  }
}

const handleFilterChange = () => {
  console.log('🎛️ Filtre vétérinaires changé:', searchOnlyVeterinarians.value)
  
  // Si une recherche est en cours, la relancer avec les nouveaux filtres
  if (actualSearchQuery.value && actualSearchQuery.value.length >= 2) {
    console.log('🔄 Relance de la recherche avec nouveaux filtres')
    performSearch()
  }
}

// Fonctions utilitaires pour l'affichage des types d'utilisateurs
const getUserTypeLabel = (userType) => {
  const labels = {
    'client': '👤 Patient',
    'veterinarian': '🩺 Vétérinaire',
    'veterinarian_pro': '⭐ Vétérinaire Pro',
    'admin': '🛡️ Administrateur'
  }
  return labels[userType] || '👤 Utilisateur'
}

const getUserTypeClass = (userType) => {
  const classes = {
    'client': 'user-type-client',
    'veterinarian': 'user-type-vet',
    'veterinarian_pro': 'user-type-vet-pro',
    'admin': 'user-type-admin'
  }
  return classes[userType] || 'user-type-default'
}

const selectUser = async (user) => {
  console.log('👤 Utilisateur sélectionné:', user)
  console.log('📧 Email:', user.email)
  console.log('🏷️ Type:', user.user_type)
  
  try {
    // Appeler l'API start-or-find avec le payload simple
    const response = await startOrFindConversationMutation.mutateAsync({
      user_id: user.id
    })
    
    console.log('✅ Réponse API:', response)
    
    if (response.success && response.data.conversation) {
      const conversation = response.data.conversation
      const isNew = response.data.is_new || false
      
      console.log(`🎯 ${isNew ? 'Nouvelle conversation créée' : 'Conversation existante trouvée'}:`, conversation.id)
      console.log('👥 Autre participant:', conversation.other_participant?.name)
      console.log('📊 Messages non lus:', conversation.unread_count)
      
      // Transformer les données pour l'affichage
      const formattedConversation = {
        id: conversation.id,
        name: conversation.other_participant?.name || user.name,
        image: conversation.other_participant?.avatar || defaultAvatar,
        userType: conversation.other_participant?.user_type === 'client' ? 'PATIENT' : 'PRO',
        isActive: conversation.is_active,
        unread: conversation.unread_count || 0,
        message: conversation.last_message?.content || (isNew ? 'Nouvelle conversation' : ''),
        time: conversation.last_activity_at || conversation.created_at
      }
      
      console.log('📝 Conversation formatée:', formattedConversation)
      
      // Sélectionner la conversation (si la fonction existe)
      if (typeof selectConversation === 'function') {
        selectConversation(formattedConversation)
      }
      
      // Fermer le modal de recherche
      closeNewMessageModal()
      
      // Recharger la liste des conversations pour afficher la nouvelle/mise à jour
      await refetch()
      
    } else {
      console.error('❌ Réponse API invalide:', response)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la création/recherche de conversation:', error)
    
    // Afficher un message d'erreur à l'utilisateur
    if (error.response?.data?.message) {
      alert('Erreur: ' + error.response.data.message)
    } else {
      alert('Erreur lors de l\'ouverture de la conversation')
    }
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
  width: 100%; /* ✅ Prendre toute la largeur disponible */
  box-sizing: border-box; /* ✅ Inclure padding dans la largeur */
}

/* Colonne gauche */
.sidebar {
  width: 30%;
  padding: 20px;
  min-width: 300px; /* ✅ Largeur minimum pour éviter que ce soit trop étroit */
  box-sizing: border-box; /* ✅ Inclure padding dans la largeur */
}

.messages-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 500;
}

.count {
  color: #999;
}

/* Bouton Nouveau message */
.new-message-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.new-message-btn:hover {
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.plus-icon {
  font-size: 18px;
  font-weight: bold;
  line-height: 1;
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
  width: 100%; /* ✅ Prendre toute la largeur disponible */
  height: 45px;
  max-width: 100%; /* ✅ Éviter le débordement */
  box-sizing: border-box; /* ✅ Inclure padding et border dans la largeur */
}

.load-more .icon {
  width: 25px;
}

.load-more:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* États de chargement et d'erreur */
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 20px;
  color: #6B7280;
  font-size: 14px;
}

.error-state {
  color: #EF4444;
}

.retry-btn {
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 8px;
}

.retry-btn:hover {
  background-color: #2563EB;
}

/* Liste de messages */
.message-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%; /* ✅ Prendre toute la largeur disponible */
}

.message-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--Stroke, #F1F3F9);
  position: relative;
  transition: background-color 0.2s ease;
  width: 100%; /* ✅ Prendre toute la largeur disponible */
  box-sizing: border-box; /* ✅ Inclure padding dans la largeur */
}

.message-item:hover {
  background-color: #F9FAFB;
}

.message-item:active {
  background-color: #F3F4F6;
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

/* Colonne droite */
.message-page {
  display: flex;
  flex: 1; /* ✅ Prendre tout l'espace restant après la sidebar */
  padding: 0 0 24px 0;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 12px;
  border: 1px solid var(--Neutral---200, #E5E7EB);
  background: #FFF;
  margin-top: 20px;
  box-sizing: border-box; /* ✅ Inclure padding et border dans la largeur */
}

.mp-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #E5E7EB;
  width: 100%;
  box-sizing: border-box; /* ✅ Inclure padding dans la largeur */
}

.user-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.mp-header-info {
  flex: 1;
}

.mp-username {
  font-weight: 600;
  font-size: 16px;
  color: #1F2937;
  display: block;
}

.mp-user-pro {
  font-size: 12px;
  color: #10B981;
  background: rgba(16, 185, 129, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
  margin-top: 4px;
}

.mp-user-pro.patient {
  color: #A0522D;
  background: rgba(251, 191, 36, 0.20);
}

.no-conversation-selected {
  text-align: center;
  color: #6B7280;
  font-size: 14px;
  padding: 20px;
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
  font-size: 14px;
  color: #6B7280;
}

/* Carte RDV */
.rdv-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
  width: 100%;
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
  margin-bottom: 4px;
}

.rdv-sub {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mp-rdv-ellipse {
  width: 6px;
  height: 6px;
}

.rdv-with {
  font-size: 12px;
  color: #6B7280;
}

/* Conversation */
.conversation-list {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%; /* ✅ Prendre toute la largeur disponible */
  box-sizing: border-box; /* ✅ Inclure padding dans la largeur */
}

/* États des messages */
.messages-loading, .messages-error, .no-conversation, .no-messages {
  text-align: center;
  padding: 40px 20px;
  color: #6B7280;
  font-size: 14px;
}

.messages-error {
  color: #EF4444;
}

.no-conversation {
  color: #9CA3AF;
  font-style: italic;
}

.message-row {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.message-row.left {
  align-self: flex-start;
}

.message-row.right {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.message-bubble {
  background: #F3F4F6;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  color: #1F2937;
  max-width: 100%;
}

.message-row.right .message-bubble {
  background: #3B82F6;
  color: white;
}

.message-content {
  margin-bottom: 4px;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
}

.edited-indicator {
  font-size: 10px;
  opacity: 0.6;
  font-style: italic;
}

/* Input message */
.input-message-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #E5E7EB;
  width: 100%; /* ✅ Prendre toute la largeur disponible */
  box-sizing: border-box; /* ✅ Inclure padding dans la largeur */
}

.input-message {
  flex: 1;
  border: 1px solid #D1D5DB;
  border-radius: 24px;
  padding: 12px 16px;
  font-size: 14px;
  outline: none;
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
  transition: background-color 0.2s;
}

.send-btn:hover {
  background: #2563EB;
}

.send-btn img {
  width: 20px;
  height: 20px;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #9CA3AF;
}

.send-btn.sending {
  background: #6B7280;
}

/* Spinner pour l'état d'envoi */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Input désactivé */
.input-message:disabled {
  background-color: #F3F4F6;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Modal Nouveau message */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #E5E7EB;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6B7280;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #F3F4F6;
}

.modal-body {
  padding: 20px;
}

.search-input-container {
  margin-bottom: 20px;
}

.search-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.search-btn {
  background: #3B82F6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.search-btn:hover:not(:disabled) {
  background: #2563EB;
}

.search-btn:disabled {
  background: #9CA3AF;
  cursor: not-allowed;
  opacity: 0.6;
}

.search-filters {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #E5E7EB;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #4B5563;
  transition: color 0.2s;
}

.filter-option:hover {
  color: #1F2937;
}

.filter-option input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #3B82F6;
  cursor: pointer;
}

.search-input:focus {
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-results {
  max-height: 300px;
  overflow-y: auto;
}

.search-loading, .no-results, .search-placeholder, .validation-error, .search-error {
  text-align: center;
  padding: 40px 20px;
  color: #6B7280;
  font-size: 14px;
}

.validation-error {
  color: #F59E0B;
  background-color: #FEF3C7;
  border-radius: 8px;
  margin: 10px 0;
}

.search-error {
  color: #DC2626;
  background-color: #FEE2E2;
  border-radius: 8px;
  margin: 10px 0;
}

.error-details {
  font-size: 12px;
  margin-top: 8px;
  opacity: 0.8;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-item:hover {
  background-color: #F9FAFB;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-weight: 500;
  color: #1F2937;
  font-size: 14px;
}

.user-email {
  font-size: 12px;
  color: #9CA3AF;
  margin-bottom: 2px;
}

.user-type {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.user-type-client {
  background-color: #DBEAFE;
  color: #1E40AF;
}

.user-type-vet {
  background-color: #D1FAE5;
  color: #065F46;
}

.user-type-vet-pro {
  background-color: #FEF3C7;
  color: #92400E;
}

.user-type-admin {
  background-color: #F3E8FF;
  color: #6B21A8;
}

.user-type-default {
  background-color: #F3F4F6;
  color: #4B5563;
}

.user-item.loading {
  opacity: 0.6;
  pointer-events: none;
}

.user-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #E5E7EB;
  border-top: 2px solid #3B82F6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
</style>
