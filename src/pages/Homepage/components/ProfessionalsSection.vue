<template>
  <section
    class="w-full mx-auto mt-[80px] px-5 py-[84px] flex flex-col items-center gap-6 rounded-[30px] border border-gray-200 bg-white/70 backdrop-blur-md shadow-md">
    <div class="w-full flex flex-col items-center gap-6">
      <h1 class="text-gray-600 text-center text-[40px] font-extrabold uppercase m-0">
        ANNUAIRE DES PROFESSIONNELS
      </h1>

      <p class="text-center text-[18px] font-normal m-0">
        Découvrez l'ensemble des professionnels du secteur animalier référencés sur DoctorPet.
      </p>

      <div class="w-1/2">
        <div class="flex items-center w-full bg-white border border-gray-300 rounded-[12px] px-3 py-2">
          <input
            type="text"
            placeholder="Rechercher un professionnel ou une spécialité..."
            class="flex-1 bg-transparent border-none outline-none text-[16px] text-neutral-600 placeholder:text-neutral-400"
          />
          <img :src="searchIcon" alt="Rechercher" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import searchIcon from '@/assets/icons/search-icon.svg'
</script>
