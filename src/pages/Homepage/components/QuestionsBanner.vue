<template>
  <section
    class="bg-primary-300 w-full flex text-white rounded-[30px] mx-auto mt-[80px] px-[64px] py-6 items-center justify-center">
    <div class="p-8">
      <img src="@/assets/images/DocPicto2.svg" alt="Docteur professionnel" class="w-auto object-contain" />
    </div>
    <div class="flex flex-col gap-2 items-center text-primary-600">
      <div class="text-left">
        <h1 class="text-[40px] font-bold text-center uppercase">DES<br />QUESTIONS ?
        </h1>
        <span class="">
            <img :src="layerYellow" alt="layer green" />
          </span>
      </div>
      <p class="text-[18px]">
        Contactez-nous via notre assistant virtuel intelligent
      </p>
      <button
        class="bg-primary-600 mt-6 text-white text-base px-6 py-4 rounded-[12px] flex items-center gap-2 hover:bg-accent-400 transition">
        <img :src="AskDiscussIcon" alt="Icône discussion" />
        DÉMARRER LA DISCUSSION
      </button>
    </div>

  </section>
</template>

<script setup>
import AskDiscussIcon from '@/assets/icons/Ask-Discuss.svg'
import layerYellow from '@/assets/layers/layer-yellow.svg';

</script>
