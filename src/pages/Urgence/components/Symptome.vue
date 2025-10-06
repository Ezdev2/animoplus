<template>
  <div class="flex flex-col bg-primary-600 gap-8 p-24 border border-white border-2 rounded-4xl">
    <h2 class="text-white text-center text-6xl font-extrabold uppercase">
      quels sont les symptômes d’urgences ?
    </h2>

    <!-- Boucle sur chaque animal -->
    <section
      v-for="(animal, index) in animals"
      :key="index"
      class="px-24 pb-24 bg-primary-300 border-white border-2 w-full flex flex-col gap-4 justify-between text-white rounded-[30px] mx-auto items-center"
    >
      <div class="flex gap-8 items-center">
        <div class="p-8">
          <img
            src="@/assets/images/DocPicto.svg"
            alt="Docteur professionnel"
            class="w-auto object-contain"
          />
        </div>

        <div class="max-w-[400px] flex flex-col items-center gap-8">
          <div class="text-left">
            <div class="flex flex-col items-center">
              <h1 class="text-6xl text-center font-semibold uppercase">
                {{ animal.title }}
              </h1>
              <span>
                <img width="300" :src="layer" alt="layer green" />
              </span>
            </div>

            <p class="italic text-center text-lg">
              Si votre {{ animal.type }} a un de ces symptômes listés ci-dessous,
              cela peut être considéré comme une urgence :
            </p>
          </div>
        </div>
      </div>

      <ul class="list-none flex flex-col">
        <li
          v-for="(item, idx) in animal.symptoms"
          :key="idx"
          class="flex items-center gap-4 text-lg"
        >
          <img width="140" :src="pointerIcon" alt="pointeur" />
          {{ item }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import pointerIcon from "@/assets/layers/pointer.svg";
import layer from "@/assets/layers/line-green-primary.svg";

const animals = [
  {
    title: "Mon chien",
    type: "chien",
    symptoms: [
      "Mon chien est blessé.",
      "Mon chien a les muqueuses pâles.",
      "Mon chien a mal à l'œil et/ou à l'œil fermé.",
      "Mon chien urine du sang.",
      "Mon chien tousse ou a du mal à respirer.",
      "Mon chien vomit ou a la diarrhée.",
      "Mon chien a de la fièvre.",
    ],
  },
  {
    title: "Mon chat",
    type: "chat",
    symptoms: [
      "Mon chat bave.",
      "Mon chat urine du sang.",
      "Mon chat tousse ou a du mal à respirer.",
      "Mon chat vomit ou a la diarrhée.",
      "Mon chat a de la fièvre.",
    ],
  },
];
</script>
