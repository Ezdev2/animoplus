<template>
  <!-- Fenêtre principale de la popup de chat -->
  <div class="fixed bottom-5 right-5 w-[450px] rounded-[15px] shadow-lg bg-white overflow-hidden z-[1000]">

    <div class="bg-green-600 p-4 flex justify-between items-center border-b border-gray-300">
      <div class="flex items-center gap-2 flex-1">
        <img :src="chatIcon" alt="Avatar IA" />
        <span class="text-white font-league">Conseiller Virtuel IA</span>
      </div>

      <img @click="$emit('close-pop-up')" :src="closeIcon" alt="close" class="cursor-pointer" >
    </div>

    <!-- Corps du message -->
    <div class="flex items-start gap-2.5 p-5 bg-white min-h-[300px]">
      <img :src="chatIcon" alt="Avatar IA" class="chat-avatar-body" />
      <p class="message-bubble">
        Bonjour ! Je suis votre assistant vétérinaire virtuel propulsé par l’IA DeepSeek.
        Comment puis-je vous aider avec votre animal aujourd’hui ?
      </p>
    </div>

    <!-- Pied du chat -->
    <div class="flex items-center p-4 bg-white">
      <div class="relative flex-1">
        <input
          type="text"
          v-model="userMessage"
          placeholder="Écrire vos messages ici ..."
          class="w-full h-[50px] text-sm px-4 pr-12 rounded-[10px] border border-gray-200 outline-none"
        />
        <button @click="sendMessage" class="absolute top-1/2 right-2 -translate-y-1/2 w-7 h-7 flex items-center justify-center">
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
import { ref } from 'vue';

const userMessage = ref("")

const emit = defineEmits(['close-pop-up']);
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

.message-bubble {
  max-width: 95%;
  padding: 10px 16px;
  color: #43A047;
  font-size: 15px;
  font-weight: 500;
  line-height: 24px;
  border-radius: 12px;
  border: 1px solid rgba(22, 163, 74, 0.15);
  background: rgba(16, 185, 129, 0.05);
  word-wrap: break-word;
}
</style>
