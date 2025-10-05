<template>
  <div class="doute-page font-sans bg-gray-50 min-h-screen p-4 md:p-8 flex flex-col items-center">
    
    <div class="animal-selection-container w-full max-w-2xl mb-8 relative">
      <h1 class="text-2xl md:text-3xl font-bold text-green-700 text-center mb-4">SÉLECTIONNEZ VOTRE ANIMAL :</h1>
      <div class="select-wrapper relative">
        <select class="w-full p-3 md:p-4 pr-10 border border-gray-300 rounded-full text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
          <option value="" disabled selected>Choisir mon animal</option>
          <option value="chien">Chien</option>
          <option value="chat">Chat</option>
          <option value="nac">NAC</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
      <div class="absolute top-0 right-0 w-24 h-24 bg-yellow-400 rounded-full -mt-4 -mr-4 transform rotate-12"></div>
    </div>
    
    <div class="chat-container w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 flex flex-col h-96">
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
        <input type="text" 
               placeholder="Posez votre question à Animo+ AI." 
               class="flex-grow p-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500">
        <button class="bg-green-500 text-white font-bold py-3 px-6 rounded-r-lg hover:bg-green-600 transition-colors">
          Envoyer
        </button>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref } from 'vue';

// On pourrait stocker les messages ici si on voulait rendre le chat fonctionnel
const messages = ref([]);
const newMessage = ref('');

function sendMessage() {
  if (newMessage.value.trim() === '') {
    return;
  }
  
  // Ajouter le message de l'utilisateur
  messages.value.push({
    text: newMessage.value,
    sender: 'user',
  });
  
  // Réinitialiser le champ de saisie
  newMessage.value = '';
  
  // Ici, vous enverriez le message à votre API d'assistant IA
  // et traiterez la réponse pour l'ajouter à la liste des messages
  // Pour cet exemple, on peut simuler une réponse
  setTimeout(() => {
    messages.value.push({
      text: "Une erreur est survenue. Veuillez réessayer plus tard.",
      sender: 'ai',
    });
  }, 1000);
}
</script>

<style scoped>
/* You can add any specific styling here if Tailwind utility classes are not sufficient */
.animal-selection-container {
  /* This could be styled to have the yellow shape as a pseudo-element */
  position: relative;
  overflow: hidden;
}

.select-wrapper {
  /* This is to create the custom dropdown icon */
  position: relative;
}

.chat-container {
  /* Setting a fixed height for the chat area for demonstration */
  height: 500px;
}
</style>