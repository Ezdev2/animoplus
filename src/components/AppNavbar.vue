<template>
  <div class="w-full py-4 flex justify-between items-center flex-wrap gap-4">
    <!-- Gauche : titre et support -->
    <div class="flex flex-col">
      <h1 class="text-black text-xl font-bold font-['League_Spartan']">
        {{ role === 'client' ? 'Profil client' : 'Profil professionnel' }}
      </h1>
      <a href="#" class="text-gray-600 text-base underline font-['League_Spartan']">
        Contacter le support
      </a>
    </div>

    <!-- Droite : Bot, profil et déconnexion -->
    <div class="flex items-center gap-8 flex-wrap">

      <!-- Bot -->
      <div class="p-2 rounded-full outline outline-1 outline-primary-600 flex items-center justify-center cursor-pointer">
        <img @click="$emit('show-pop-up')" :src="botIcon" alt="bot icon" class="feature-icon w-6">
      </div>

      <!-- Lien profil -->
      <router-link to="/profil" class="flex items-center gap-2 cursor-pointer no-underline">
        <img :src="userIcon" alt="user profil" class="feature-icon w-6" />
        <span class="text-primary-600 text-base font-normal font-['League_Spartan']">Mon profil</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import userIcon from '@/assets/icons/user-profil.svg';
import botIcon from '@/assets/icons/bot.svg';


defineProps({
  role: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['show-pop-up']);
</script>
