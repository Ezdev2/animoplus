<template>
  <div class="flex flex-col space-y-8 items-center overflow-x-hidden relative">
    <div class="background">
      <BubbleGreen class="bubble bubble-1" />
      <BubbleYellow class="bubble bubble-2" />
      <BubbleBrown class="bubble bubble-3" />
      <BubbleGray class="bubble bubble-5" />
      <BubbleGreenTwo class="bubble bubble-6" />

      <HeroSection />
    </div>
    <div class="w-full -mt-28 px-40 flex flex-col gap-[80px] items-center justify-center z-1">
      <ActionCards />
      <Symptome />
      <QuestionsBanner />
    </div>

  </div>
</template>

<script setup>
import HeroSection from './components/HeroSection.vue';
import ActionCards from './components/ActionCards.vue';
import Symptome from './components/Symptome.vue';
import QuestionsBanner from '../Homepage/components/QuestionsBanner.vue';
import BubbleGreen from '@/assets/bubbles/1_green.vue';
import BubbleYellow from '@/assets/bubbles/1_yellow.vue';
import BubbleBrown from '@/assets/bubbles/1_brown.vue';
import BubbleGreenTwo from '@/assets/bubbles/2_green.vue';
import BubbleGray from '@/assets/bubbles/1_gray.vue';
</script>

<style scoped>

.background {
  width: 100vw;
  height: 70vh;
  background-color: #43a047;
}

.bubble {
  position: absolute;
  opacity: 1;
}

.bubble-1 {
  top: 12%;
  left: 10px;
}

.bubble-3 {
  top: 12%;
  right: -50px;
}

.bubble-2 {
  opacity: 1;
  bottom: 1500px;
  left: 10px;
}

.bubble-5 {
  opacity: 1;
  bottom: 1000px;
  right: -100px;
}

.bubble-6 {
  opacity: 1;
  bottom: 10px;
  transform: translate(-50%, -50%);
}
</style>