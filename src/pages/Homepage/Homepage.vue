<template>
  <div class="w-full flex flex-col items-center justify-center">
    <div class="background"></div>

    <BubbleGreen class="bubble bubble-1" />
    <BubbleYellow class="bubble bubble-2" />
    <BubbleBrown class="bubble bubble-3" />
    <BubbleGray class="bubble bubble-5" />
    <BubbleGreenTwo class="bubble bubble-6" />

    <HeroSection />
    <div class="w-full px-40 flex flex-col gap-[80px] items-center justify-center background-body">
      <ProfessionalsSection />
      <!-- <SpecialityList /> -->
      <OptiCare />
      <CompanionPartner />
      <QuestionsBanner />
    </div>
  </div>
</template>

<script setup>
import HeroSection from './components/HeroSection.vue';
import ProfessionalsSection from './components/ProfessionalsSection.vue';
import SpecialityList from './components/SpecialityList.vue';
import OptiCare from './components/OptiCare.vue';
import CompanionPartner from './components/CompanionPartner.vue';
import QuestionsBanner from './components/QuestionsBanner.vue';


import BubbleGreen from '@/assets/bubbles/1_green.vue';
import BubbleYellow from '@/assets/bubbles/1_yellow.vue';
import BubbleBrown from '@/assets/bubbles/1_brown.vue';
import BubbleGreenTwo from '@/assets/bubbles/2_green.vue';
import BubbleGray from '@/assets/bubbles/1_gray.vue';

</script>
<style scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #43a047;
  z-index: -1;
}
.background-body {
  background: linear-gradient(180deg, #43A047 4.53%, #FFF 11.52%);
}

.bubble {
  position: absolute;
  opacity: 0.7;
}

.bubble-1 {
  top: 20%;
  left: -10px;
}

.bubble-2 {
  top: 15%;
  right: -50px;
}

.bubble-3 {
  opacity: 0.5;
  bottom: -200px;
  left: 10px;
}

.bubble-5 {
  opacity: 0.5;
  bottom: -100px;
  right: -200px;
}

.bubble-6 {
  opacity: 0.5;
  bottom: 0;
  transform: translate(-50%, -50%);
}
</style>