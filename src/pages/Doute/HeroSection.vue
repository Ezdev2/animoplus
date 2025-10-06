<template>
  <section class="w-full min-h-[70vh] px-40 flex items-center justify-center">
    <div class="mx-auto flex flex-col items-center gap-16">
      <div class="relative flex flex-col items-center">
        <h1 class="text-white text-center font-bold text-[100px] leading-32 drop-shadow-md">
          L'ONGLET DOUTE
        </h1>
        <span class="absolute top-28 right-10">
          <img width="300" :src="layer" alt="layer green" />
        </span>
      </div>
      <p class="max-w-6xl italic text-3xl text-white text-center">Notre conseiller est là pour vous indiquer les meilleures mesures à
        prendre, en aucun cas il agit comme un professionnel de santé, il est
        seulement mis à disposition pour vous donner des conseils.</p>
    </div>
  </section>
</template>

<script setup>
import layer from '@/assets/layers/line-green.svg';
</script>