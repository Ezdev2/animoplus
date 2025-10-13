<template>
  <section class="mt-12 w-full min-h-[90vh] px-40 flex items-center justify-center">
    <div class="mx-auto flex flex-col items-center gap-8">
      <div class="flex gap-[44px] flex-col items-center">
        <div class="relative flex flex-col items-center">
          <!-- <img width="250" :src="logo" /> -->
          <!-- Titre principal -->
          <h1 class="text-white text-center font-bold text-[64px] leading-28 drop-shadow-md">
            BESOIN D'UN
            {{ typedText }}<span class="border-r-2 border-white animate-pulse"></span>
          </h1>
          <span class="absolute top-24 right-4">
            <img :src="layerYellow" alt="layer green" />
          </span>
        </div>
        <!-- Sous-titre -->
        <p class="text-white text-center text-[1.2rem] font-normal leading-relaxed min-h-[2rem]">
          La plateforme qui connecte les propriétaires d'animaux aux meilleurs professionnels vétérinaires
        </p>
        <!-- Formulaire de prise de rendez-vous -->
        <div class="flex flex-wrap items-center justify-center bg-white rounded-[50px] p-2 gap-2 shadow-md max-w-3xl w-full mb-16">
          <!-- Email avec icône -->
          <div class="flex items-center bg-white px-4 py-2 rounded-lg gap-2 flex-1 min-w-[150px]">
            <img :src="emailIcon" alt="email icon" class="w-5 h-5" />
            <input type="email" placeholder="Enter your email"
              class="flex-1 text-sm border-none outline-none font-montserrat placeholder:text-primary-600" />
          </div>
          <!-- Barre verticale -->
          <span class="w-px h-6 bg-gray-400 mr-2 hidden md:inline-block"></span>
          <!-- Localisation avec icône -->
          <div class="flex items-center bg-white px-4 py-2 rounded-lg gap-2 flex-1 min-w-[150px]">
            <img :src="locationIcon" alt="location icon" class="w-5 h-5" />
            <input type="text" value="Antananarivo 101"
              class="flex-1 text-sm border-none outline-none text-primary-600 font-montserrat cursor-default" />
          </div>
          <!-- Bouton avec flèche -->
          <router-link to="/rendez-vous"
            class="flex items-center bg-primary-600 text-white px-5 py-4 rounded-[50px] text-base font-semibold font-montserrat gap-2 hover:bg-primary-500"
            >
            Prendre un rendez-vous
            <img :src="arrowIcon" alt="arrow icon" class="w-4 h-4" />
          </router-link>
        </div>
        <ActionCards />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import logo from '@/assets/animoplus_header.png'
import layerYellow from '@/assets/layers/layer-yellow.svg';
import emailIcon from '@/assets/icons/email-icon.svg';
import locationIcon from '@/assets/icons/location-icon.svg';
import arrowIcon from '@/assets/icons/arrow-icon.svg';
import ActionCards from './ActionCards.vue';

// Liste des textes à faire défiler
const texts = ["TOILETTEUR", "VÉTÉRINAIRE", "ÉDUCATEUR CANIN", "OSTÉOPATHE", "PETSITTER"];

const typedText = ref('');
let currentTextIndex = 0;
let charIndex = 0;
let isDeleting = false;
let timeoutId = null;

const typeWriter = () => {
  const currentText = texts[currentTextIndex];
  
  if (isDeleting) {
    // Suppression des caractères
    typedText.value = currentText.substring(0, charIndex - 1);
    charIndex--;
    
    if (charIndex === 0) {
      isDeleting = false;
      // Passer au texte suivant
      currentTextIndex = (currentTextIndex + 1) % texts.length;
      // Pause courte avant de commencer à taper le nouveau mot
      timeoutId = setTimeout(typeWriter, 300);
    } else {
      timeoutId = setTimeout(typeWriter, 50);
    }
  } else {
    // Ajout des caractères
    typedText.value = currentText.substring(0, charIndex + 1);
    charIndex++;
    
    if (charIndex === currentText.length) {
      isDeleting = true;
      // Pause plus longue après avoir tapé le mot complet
      timeoutId = setTimeout(typeWriter, 2000);
    } else {
      timeoutId = setTimeout(typeWriter, 100);
    }
  }
};

onMounted(() => {
  typeWriter();
});

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});
</script>