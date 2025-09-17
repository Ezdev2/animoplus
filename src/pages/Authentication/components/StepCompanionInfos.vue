<template>
  <div class="flex flex-col gap-4">
    <label value="">Choisir un type d’animal</label>
    <select v-model="formData.species" class="w-full h-12 px-4 border border-gray-300 rounded">
      <option v-for="s in speciesData" :key="s.id" :value="s.id">{{ s.name }}</option>
    </select>

    <label value="">Choisir une race</label>
    <select v-model="formData.race" class="w-full h-12 px-4 border border-gray-300 rounded" v-if="formData.species">
      <option v-for="r in getRacesBySpeciesId(formData.species)" :key="r.id" :value="r.id">{{ r.name }}</option>
    </select>

    <input v-model="formData.weight" placeholder="Poids en kg" class="w-full h-12 px-4 border border-gray-300 rounded" />

    <div class="flex  gap-6 justify-between">
      <button class="w-[fit-content] py-3 px-4 bg-neutral-300 text-white rounded-lg font-medium hover:bg-primary-500" @click="$emit('prev')">Retour</button>
      <button class="w-[fit-content] py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-500">Terminer</button>
    </div>
  </div>
</template>

<script setup>
import { speciesData, getRacesBySpeciesId } from '@/pages/Animals/data/data'

const props = defineProps({
  formData: Object
})
</script>
