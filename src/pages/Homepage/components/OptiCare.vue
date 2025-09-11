<template>
  <section
    class="bg-primary-600 w-full flex gap-4 justify-between text-white rounded-[30px] mx-auto mt-[80px] p-[64px] items-center"
  >
    <div class="flex flex-col gap-2">
      <div class="text-left">
        <h1 class="text-[40px] font-semibold uppercase">
          VOUS ÊTES <br />PROFESSIONNELS ?
        </h1>
      </div>

      <div class="flex flex-col gap-4">
        <ul class="list-none flex flex-col gap-4">
          <li
            v-for="(benefit, index) in benefits"
            :key="index"
            class="flex items-center gap-2"
          >
            <img :src="pointerIcon" alt="pointeur" />
            {{ benefit }}
          </li>
        </ul>

        <button
          class="mt-8 bg-primary-300 w-[fit-content] text-white px-6 py-3 rounded-lg text-base hover:bg-white hover:text-primary-600 transition"
        >
          En savoir plus sur nos solutions
        </button>
      </div>
    </div>

    <div class="p-8">
      <img
        src="@/assets/images/DocPicto.svg"
        alt="Docteur professionnel"
        class="w-auto object-contain"
      />
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
