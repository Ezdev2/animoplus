<template>
  <section
    class="bg-primary-600 w-full grid grid-cols-3 gap-4 justify-between text-white rounded-[30px] mx-auto mt-[80px] p-[64px] items-center">
    <div class="p-8">
      <img src="@/assets/images/DocPicto.svg" alt="Docteur professionnel" class="w-auto object-contain" />
    </div>
    <div class="col-span-2 flex flex-col gap-8">
      <div class="text-left">
        <h1 class="text-6xl font-semibold uppercase">
          PROFESSIONNELS DU <br />MONDE ANIMALIER ?
        </h1>
      </div>

      <div class="flex flex-col gap-4">
        <ul class="list-none flex flex-col gap-4">
          <li v-for="(benefit, index) in benefits" :key="index" class="flex items-center gap-4 text-lg">
            <img :src="pointerIcon" alt="pointeur" />
            {{ benefit }}
          </li>
        </ul>

        <router-link to="/professionnel"
          class="mt-8 bg-primary-300 w-[fit-content] text-white text-lg uppercase px-6 py-3 rounded-full text-base hover:bg-white hover:text-primary-600 transition">
          En savoir plus sur nos solutions
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import pointerIcon from "@/assets/layers/pointer.svg";

const benefits = [
  "Dispenser les meilleurs soins possibles à vos patients",
  "Profiter d'une meilleure qualité de vie au travail",
  "Augmenter les revenus de votre activité",
  "Optimiser votre temps grâce à notre interface professionnelle",
];
</script>
