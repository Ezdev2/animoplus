<template>
  <div class="question">
    <p class="text-sm font-medium text-gray-600">{{ label }}</p>
    <div class="flex flex-col gap-1 mt-1">
      <label 
        v-for="opt in options" 
        :key="opt" 
        class="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="radio"
          :value="opt"
          :checked="opt === modelValue"
          @change="$emit('update:modelValue', opt)"
        />
        <span>{{ opt }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  options: { type: Array, required: true },
  modelValue: { type: String, default: '' }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.question {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
