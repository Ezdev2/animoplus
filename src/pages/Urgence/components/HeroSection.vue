<template>
  <section class="w-full min-h-[70vh] px-40 flex items-center justify-center">
    <div class="mx-auto flex flex-col items-center gap-16">
      <div class="relative flex flex-col items-center">
        <h1 class="text-white text-center font-bold text-[100px] leading-32 drop-shadow-md">
          L'ONGLET URGENCE
        </h1>
        <span class="absolute top-28 right-10">
          <img width="300" :src="layer" alt="layer green" />
        </span>
      </div>
      <p class="max-w-6xl italic text-3xl text-white text-center">En cas d’urgence vétérinaire, il est recommandé de
        contacter votre
        vétérinaire habituel. Si celui-ci n’est pas disponible, les numéros 3115
        et 112 Vétérinaire peuvent vous aider à trouver une assistance.</p>
    </div>
  </section>
</template>

<script setup>
import layer from '@/assets/layers/line-green.svg';
</script>