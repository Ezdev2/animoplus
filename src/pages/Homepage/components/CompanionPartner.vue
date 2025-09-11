<template>
  <section class="w-full my-[80px] flex flex-col items-center">
    <div class="w-full flex flex-col items-center gap-[80px]">
      <div class="relative">
        <h1 class="text-primary-600 text-center text-[40px] font-extrabold uppercase">
          L’ALLIE DE VOTRE COMPAGNON
        </h1>
        <img :src="layerYellow" alt="layer yellow" class="absolute left-0" />
      </div>

      <div class="w-full flex flex-col gap-2 mt-2 md:gap-12 md:flex-row md:justify-between md:items-start">
        <div
          v-for="(item, index) in features"
          :key="index"
          class="flex flex-col items-center text-center gap-4 mt-8 relative"
        >
          <img :src="item.icon" :alt="item.alt" />
          <h3 class="text-[20px] font-bold text-gray-900 uppercase">
            {{ item.title }}
          </h3>
          <span class="absolute top-23">
            <img :src="lineGreen" alt="layer green" />
          </span>
          <p class="text-base text-gray-600">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import careIcon from '@/assets/icons/care.svg'
import followupIcon from '@/assets/icons/followup.svg'
import certifiedIcon from '@/assets/icons/certified.svg'
import layerYellow from '@/assets/layers/layer-yellow.svg'
import lineGreen from '@/assets/layers/line-green.svg'

const features = [
  {
    icon: careIcon,
    alt: 'Soins',
    title: "FACILITE L'ACCÈS AUX SOINS",
    description:
      'Trouvez rapidement un professionnel animalier près de chez vous et prenez rendez-vous en quelques clics.'
  },
  {
    icon: followupIcon,
    alt: 'Suivi',
    title: 'UN SUIVI SUR-MESURE',
    description:
      'Bénéficiez d’un suivi personnalisé de votre animal avec un accès à son dossier médical complet.'
  },
  {
    icon: certifiedIcon,
    alt: 'Certifiés',
    title: 'DES PROFESSIONNELS CERTIFIÉS',
    description:
      'Tous nos partenaires sont des professionnels vérifiés et certifiés afin de garantir un service fiable et sécurisé.'
  }
]
</script>
