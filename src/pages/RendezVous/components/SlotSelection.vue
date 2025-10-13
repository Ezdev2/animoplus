<template>
  <div>
    <h2 class="text-xl font-semibold mb-4 text-center">Choisissez votre créneau</h2>
    <div v-for="pharmacy in pharmacies" :key="pharmacy.id" class="pharmacy-card bg-white p-4 rounded-lg shadow-md mb-4">
      <div class="flex items-center mb-2">
        <span class="text-green-600 text-lg mr-2">📍</span>
        <div>
          <h3 class="font-bold text-green-700">{{ pharmacy.name }}</h3>
          <p class="text-sm text-gray-500">{{ pharmacy.address }}</p>
        </div>
      </div>
      <div class="schedule grid grid-cols-5 gap-2 text-center">
        <div v-for="day in pharmacy.schedule" :key="day.date">
          <p class="font-semibold text-sm">{{ day.day }}</p>
          <p class="text-xs text-gray-500">{{ day.date }}</p>
          <div class="mt-2">
            <button v-for="slot in day.slots" :key="slot" 
                    @click="$emit('select-slot', { pharmacy: pharmacy.name, date: day.date, time: slot })"
                    class="slot-btn w-full py-1 mb-1 rounded text-sm transition-colors"
                    :class="{'bg-green-100 text-green-700 hover:bg-green-200': slot !== '-', 'bg-gray-200 text-gray-400 cursor-not-allowed': slot === '-'}">
              {{ slot }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const pharmacies = ref([
  {
    id: 1,
    name: 'Pharmacie de Charrière Blanche',
    address: '24 Chemin de Charrière Blanche, 69130 Ecully',
    schedule: [
      { day: 'vendredi', date: '26 sept.', slots: ['14:30', '15:15', '16:00', '16:45'] },
      { day: 'samedi', date: '27 sept.', slots: ['09:00', '09:45', '-', '-'] },
      { day: 'dimanche', date: '28 sept.', slots: ['-', '-', '-', '-'] },
      { day: 'lundi', date: '29 sept.', slots: ['09:00', '09:45', '14:30', '-'] },
      { day: 'mardi', date: '30 sept.', slots: ['09:00', '09:45', '10:30', '14:30'] },
    ]
  },
  {
    id: 2,
    name: 'Pharmacie du Village - Ecully',
    address: '6 Place Charles de Gaulle, 69130 Ecully',
    schedule: [
      { day: 'vendredi', date: '26 sept.', slots: ['14:45', '16:15', '-', '-'] },
      { day: 'samedi', date: '27 sept.', slots: ['08:45', '10:15', '-', '-'] },
      { day: 'dimanche', date: '28 sept.', slots: ['-', '-', '-', '-'] },
      { day: 'lundi', date: '29 sept.', slots: ['08:45', '10:15', '11:45', '13:15'] },
      { day: 'mardi', date: '30 sept.', slots: ['08:45', '10:15', '11:45', '13:15'] },
    ]
  },
]);
</script>

<style scoped>
.slot-btn {
  border: 1px solid #d1d5db;
}
</style>