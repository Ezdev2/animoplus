<template>
  <div>
    <h2 class="text-xl font-semibold mb-4 text-center">Pour quel animal ?</h2>
    <select v-model="selectedAnimal" @change="$emit('select-animal', selectedAnimal)"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
      <option value="">Sélectionnez un animal</option>
      <option value="chien">Chien</option>
      <option value="chat">Chat</option>
      <option value="nac">NAC</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedAnimal = ref('');
</script>