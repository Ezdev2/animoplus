<template>
    <CardLayout title="Mes messages" link="/message">
        <!-- État de chargement avec skeleton -->
        <SkeletonLoader 
            v-if="isLoadingConversations"
            type="messages"
            :count="3"
            :animated="true"
        />
        
        <!-- Liste des messages -->
        <div v-else-if="messages.length > 0" class="self-stretch inline-flex flex-col justify-start items-center">
            <div v-for="(message, index) in messages" :key="message.id || index"
                class="self-stretch px-6 py-3 border-b border-slate-100 flex flex-col justify-center items-center gap-2.5"
                :class="{ 'bg-gray-50': message.unread }">
                <div class="self-stretch inline-flex justify-start items-start gap-3.5">
                    <div class="relative">
                        <img class="w-12 h-12 rounded-lg object-cover" 
                             :src="message.image || defaultAvatar" 
                             :alt="message.name + ' Avatar'"
                             @error="$event.target.src = defaultAvatar" />
                        <div class="absolute top-[-2px] right-[-2px] w-2 h-2 rounded-full"
                            :class="message.unread ? 'bg-indigo-500' : 'bg-slate-300'">
                        </div>
                    </div>
                    <div class="flex-1 self-stretch inline-flex flex-col justify-between items-start">
                        <div class="self-stretch inline-flex justify-between items-center">
                            <div class="justify-start text-zinc-700 text-base font-medium font-['League_Spartan']">
                                {{ message.name }}
                            </div>
                            <div class="opacity-0 flex justify-start items-start gap-2">
                                <div class="justify-start text-gray-400 text-xs font-normal font-['League_Spartan']">
                                    12 Sept 2022
                                </div>
                            </div>
                            <div v-if="message.unread" class="flex justify-start items-center gap-3">
                                <div
                                    class="px-1.5 py-0.5 bg-orange-50 rounded-lg flex justify-start items-start gap-2.5">
                                    <div
                                        class="text-right justify-start text-zinc-900 text-xs font-normal font-['League_Spartan']">
                                        Non lu
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="self-stretch inline-flex justify-between items-end">
                            <div
                                class="flex-1 justify-start text-neutral-400 text-xs font-normal font-['League_Spartan']">
                                {{ message.content }}
                            </div>
                            <div class="flex justify-start items-start gap-14">
                                <div
                                    class="text-right justify-start text-neutral-400 text-xs font-normal font-['League_Spartan']">
                                    {{ message.time }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- État vide quand aucune conversation -->
        <div v-else class="self-stretch flex flex-col justify-center items-center gap-4 py-8">
            <div class="text-6xl">💬</div>
            <div class="text-center">
                <div class="text-color-gray-100 text-sm font-medium font-['League_Spartan'] leading-none mb-2">
                    Aucune conversation
                </div>
                <div class="text-color-gray-80 text-xs font-normal font-['League_Spartan'] leading-tight">
                    Commencez une nouvelle conversation
                </div>
            </div>
        </div>
    </CardLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useMessaging } from '@/composables/useMessaging.js'
import CardLayout from "./CardLayout.vue";
import LoadingState from "@/components/LoadingState.vue";
import SkeletonLoader from "@/components/SkeletonLoaderSimple.vue";
import defaultAvatar from '@/assets/images/default_avatar.svg'

// Utiliser le composable de messagerie (même que MessagingProSection)
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

// Transformer les données API pour l'affichage (même logique que MessagingProSection)
const conversations = computed(() => {
  try {
    if (!apiConversations.value || apiConversations.value.length === 0) {
      return []
    }
    
    console.log('💬 Transformation des conversations pour dashboard:', apiConversations.value)
    
    return apiConversations.value.map(conv => {
      // Utiliser other_participant de la réponse API
      const otherParticipant = conv.other_participant
      const lastMessage = conv.last_message
      
      return {
        id: conv.id,
        name: formatUserName(otherParticipant),
        image: getUserAvatar(otherParticipant, defaultAvatar),
        content: lastMessage ? truncateText(lastMessage.content, 50) : 'Aucun message',
        time: lastMessage ? formatMessageTime(lastMessage.created_at) : '',
        unread: conv.unread_count > 0,
        userType: otherParticipant?.user_type?.toUpperCase() || 'PATIENT'
      }
    })
  } catch (error) {
    console.error('Erreur transformation conversations dashboard:', error)
    return []
  }
})

// Récupérer seulement les 3 conversations les plus récentes pour le dashboard
const messages = computed(() => {
  try {
    return conversations.value.slice(0, 3)
  } catch (error) {
    console.error('Erreur récupération messages dashboard:', error)
    return []
  }
})

// Initialisation
onMounted(() => {
  console.log('💬 Chargement des conversations pour le dashboard...')
  refreshConversations()
})
</script>
