<template>
  <div class="flex justify-between items-center">
    <h2 class="text-[#2E2E30] text-[24px] font-bold font-league">{{ title }}</h2>
    <button 
      v-if="hasButton"
      @click="$emit('onClickBtn')"
      class="bg-accent-500 text-white px-4 py-3 rounded-[14px] shadow-md flex items-center gap-2">
      <img v-if="icon" :src="icon" alt="icone" class="" />
      {{ btnTitle }}
    </button>
    <div 
      v-if="hasTextBtn" 
      @click="$emit('onClickBtn')" 
      class="flex gap-2 items-center cursor-pointer"
    >
      <img v-if="icon" :src="icon" alt="icone" class="" />
      <span class="text-primary-600">{{ btnTitle }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  hasButton: {
    type: Boolean,
    default: false, 
  },
  hasTextBtn: {
    type: Boolean,
    default: false, 
  },
  icon: {
    type: String,
    default: "",
  },
  btnTitle: {
    type: String,
    default: "Textbtn",
  },
});

const emit = defineEmits(['onClickBtn']);
</script>
