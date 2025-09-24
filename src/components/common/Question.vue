<template>
  <div class="question">
    <p class="text-sm font-medium text-gray-600">{{ label }}</p>
    <div class="flex flex-col gap-1 mt-1">
      <label 
        v-for="opt in options" 
        :key="getOptionKey(opt)" 
        class="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="radio"
          :value="getOptionValue(opt)"
          :checked="getOptionValue(opt) === modelValue"
          @change="$emit('update:modelValue', getOptionValue(opt))"
        />
        <span>{{ getOptionText(opt) }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  options: { type: Array, required: true },
  modelValue: { type: [String, Number], default: null }
})

defineEmits(['update:modelValue'])

// Fonctions utilitaires pour gérer les options
const getOptionKey = (opt) => {
  return typeof opt === 'object' ? opt.value : opt
}

const getOptionValue = (opt) => {
  return typeof opt === 'object' ? opt.value : opt
}

const getOptionText = (opt) => {
  return typeof opt === 'object' ? opt.text : opt
}
</script>

<style scoped>
.question {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
