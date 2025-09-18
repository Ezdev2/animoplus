<template>
  <BaseModal
    title="Gestion des services"
    footerBtn="Ajouter"
    @close="$emit('close')"
  >
    <div class="p-4">
      <form class="space-y-5">
    <h3 class="text-lg font-semibold font-['League_Spartan'] mb-2">Ajouter un service</h3>
    <div>
      <label class="block text-sm font-medium font-['League_Spartan'] mb-1">Nom du service</label>
      <input
        type="text"
        placeholder="Ex: Soins dentaires"
        class="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 font-['League_Spartan']"
      />
    </div>
    <div>
      <label class="block text-sm font-medium font-['League_Spartan'] mb-1">Description</label>
      <textarea
        placeholder="Description du service..."
        class="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm min-h-[62px] focus:outline-none focus:ring-2 focus:ring-green-600 font-['League_Spartan']"
      ></textarea>
    </div>
    <div>
      <label class="block text-sm font-medium font-['League_Spartan'] mb-1">Prix (€)</label>
      <input
        type="text"
        placeholder="Ex: 600"
        class="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 font-['League_Spartan']"
      />
    </div>
    <div>
      <label class="block text-sm font-medium font-['League_Spartan'] mb-1">Horaire disponibles</label>
      <input
        type="text"
        placeholder="Ex: Lun-Ven 9h à 16h"
        class="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 font-['League_Spartan']"
      />
    </div>
  </form>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/common/BaseModal.vue';

defineEmits(['close']);
</script>