<template>
  <div class="flex flex-col space-y-8 items-center overflow-x-hidden relative">
    <div class="background">
      <BubbleGreen class="bubble bubble-1" />
      <BubbleYellow class="bubble bubble-2" />
      <BubbleBrown class="bubble bubble-3" />
      <BubbleGray class="bubble bubble-5" />
      <BubbleGreenTwo class="bubble bubble-6" />

      <HeroSection />
    </div>
    <div class="w-full mt-16 px-40 flex flex-col gap-[80px] items-center justify-center z-1">
      <div class="animal-selection-container flex flex-col gap-8 w-full relative">
        <h1 class="text-primary-600 text-6xl font-extrabold uppercase">SÉLECTIONNEZ VOTRE ANIMAL :</h1>
        <div class="select-wrapper relative">
          <select
            class="w-full p-3 md:p-4 pr-10 border border-primary-600 border-3 rounded-full text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
            <option value="" disabled selected>Choisir mon animal</option>
            <option value="chien">Chien</option>
            <option value="chat">Chat</option>
            <option value="nac">NAC</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="chat-container w-full bg-white rounded-lg shadow-lg p-6 flex flex-col h-96">
        <div class="chat-messages flex-grow overflow-y-auto mb-4 space-y-4">
          <div class="flex justify-end">
            <div class="bg-gray-200 text-gray-800 rounded-lg p-3 max-w-xs shadow-sm">
              <p>comment vas tu</p>
            </div>
          </div>
          <div class="flex justify-start">
            <div class="relative bg-gray-100 text-gray-700 rounded-lg p-3 max-w-xs shadow-sm">
              <p class="font-bold text-sm mb-1">L'Assistant IA de Animo+ a dit :</p>
              <div class="flex items-center space-x-2">
                <span class="text-green-500 font-bold">Animo+</span>
                <p>Une erreur est survenue. Veuillez réessayer plus tard.</p>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <div class="bg-gray-200 text-gray-800 rounded-lg p-3 max-w-xs shadow-sm">
              <p>mon chien tousse</p>
            </div>
          </div>
          <div class="flex justify-start">
            <div class="relative bg-gray-100 text-gray-700 rounded-lg p-3 max-w-xs shadow-sm">
              <p class="font-bold text-sm mb-1">L'Assistant IA de Animo+ a dit :</p>
              <div class="flex items-center space-x-2">
                <span class="text-green-500 font-bold">Animo+</span>
                <p>Une erreur est survenue. Veuillez réessayer plus tard.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input-area flex items-center mt-4">
          <input type="text" placeholder="Posez votre question à Animo+ AI."
            class="flex-grow p-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500">
          <button class="bg-green-500 text-white font-bold py-3 px-6 rounded-r-lg hover:bg-green-600 transition-colors">
            Envoyer
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import HeroSection from './HeroSection.vue';
import BubbleGreen from '@/assets/bubbles/1_green.vue';
import BubbleYellow from '@/assets/bubbles/1_yellow.vue';
import BubbleBrown from '@/assets/bubbles/1_brown.vue';
import BubbleGreenTwo from '@/assets/bubbles/2_green.vue';
import BubbleGray from '@/assets/bubbles/1_gray.vue';

const messages = ref([]);
const newMessage = ref('');

function sendMessage() {
  if (newMessage.value.trim() === '') {
    return;
  }

  messages.value.push({
    text: newMessage.value,
    sender: 'user',
  });

  newMessage.value = '';

  setTimeout(() => {
    messages.value.push({
      text: "Une erreur est survenue. Veuillez réessayer plus tard.",
      sender: 'ai',
    });
  }, 1000);
}
</script>

<style scoped>
.animal-selection-container {
  position: relative;
  overflow: hidden;
}

.select-wrapper {
  position: relative;
}

.chat-container {
  height: 500px;
}

.background {
  width: 100vw;
  height: 70vh;
  background-color: #43a047;
}

.bubble {
  position: absolute;
  opacity: 1;
}

.bubble-1 {
  top: 12%;
  left: 10px;
}

.bubble-3 {
  top: 12%;
  right: -50px;
}

.bubble-2 {
  opacity: 1;
  bottom: 300px;
  left: 10px;
}

.bubble-5 {
  opacity: 1;
  bottom: 600px;
  right: -100px;
}

.bubble-6 {
  opacity: 1;
  bottom: 10px;
  transform: translate(-50%, -50%);
}
</style>