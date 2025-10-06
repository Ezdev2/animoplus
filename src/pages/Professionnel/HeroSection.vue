<template>
  <section class="w-full min-h-[70vh] px-40 flex items-center justify-center">
    <div class="mx-auto flex flex-col items-center gap-8">
      <div class="relative flex flex-col items-center">
        <h1 class="text-white text-center font-bold text-[100px] leading-32 drop-shadow-md">
          UNE SOLUTION <br> CRÉÉE PAR VOUS, <br> POUR VOUS !
        </h1>
        <span class="absolute top-94 right-44">
          <img width="300" :src="layer" alt="layer green" />
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
import layer from '@/assets/layers/line-green.svg';
</script>