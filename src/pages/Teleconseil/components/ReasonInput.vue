<template>
  <div>
    <h2 class="text-xl font-semibold mb-4 text-center">Pour quel motif ?</h2>
    <textarea v-model="reason"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="4"
              placeholder="Précisez le motif de votre demande de téléconseil"></textarea>
    <div class="flex justify-center mt-4">
      <button @click="$emit('submit-reason', reason)" class="btn-primary">Valider</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const reason = ref('');
</script>