<template>
  <section class="w-full mx-auto flex flex-col gap-4 py-10">
    <h2 class="text-xl font-semibold mb-4 text-center">POUR QUEL TYPE DE SERVICE ?</h2>
    <div
      v-for="(item, index) in services"
      :key="index"
      class="flex justify-between items-center border border-gray-300 rounded-2xl p-4 md:p-6 hover:shadow-md transition relative"
      :class="item.active ? 'bg-blue-100 border-blue-300' : 'bg-white'"
    >
      <!-- Texte -->
      <div class="flex flex-col">
        <h3
          class="font-bold text-gray-800 text-base md:text-lg uppercase tracking-wide"
        >
          {{ item.title }}
        </h3>
        <p class="text-gray-600 text-sm md:text-base max-w-[400px]">
          {{ item.description }}
        </p>
      </div>

      <!-- Image décorative -->
      <div
        class="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0"
      >
        <img
          :src="item.image"
          :alt="item.title"
          class="w-full h-full object-cover rounded-[40%_60%_70%_30%/60%_30%_40%_70%] border border-gray-200"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
const services = [
  {
    title: "VÉTÉRINAIRE",
    description:
      "Conseils vétérinaires généraux pour animaux de compagnie et NAC",
    image: "https://picsum.photos/200",
  },
  {
    title: "TOILETTEUR",
    description:
      "Astuces et conseils d’hygiène, d’entretien et de soins esthétiques à distance",
    image: "https://picsum.photos/200",
  },
  {
    title: "ÉDUCATEUR CANIN",
    description:
      "Accompagnement en ligne pour l’éducation et la socialisation de votre chien",
    image: "https://picsum.photos/200",
  },
  {
    title: "OSTÉOPATHE ANIMALIER",
    description:
      "Conseils pour améliorer la mobilité et soulager les douleurs à distance",
    image: "https://picsum.photos/200",
    active: true, // pour la carte mise en avant (fond bleu)
  },
  {
    title: "NUTRITIONNISTE VÉTÉRINAIRE",
    description:
      "Conseils personnalisés pour l’alimentation et la nutrition de vos animaux",
    image: "https://picsum.photos/200",
  },
  {
    title: "KINÉSIOLOGUE ANIMALIER",
    description:
      "Accompagnement émotionnel et conseils pour réduire le stress et améliorer le bien-être",
    image: "https://picsum.photos/200",
  },
];
</script>
