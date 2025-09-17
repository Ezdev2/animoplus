<template>
  <div class="overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="font-bold">{{ title }}</h3>
        <img @click="$emit('close')" :src="closeIcon" class="cursor-pointer" alt="Fermer" />
      </div>

      <div class="modal-body">
        <slot />
      </div>

      <div v-if="footer" class="modal-footer">
        <div class="form-footer">
          <button @click="$emit('close')" type="button" class="btn-cancel">Annuler</button>
          <button @click="$emit('close')" type="submit" class="btn-submit">{{ footerBtn }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import closeIcon from '@/assets/icons/close-circle.svg'

defineProps({
  title: {
    type: String,
    default: 'Modal',
  },
  footer: {
    type: Boolean,
    default: true,
  },
  footerBtn: {
    type: String,
    default: 'Ajouter',
  }
})
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(47, 47, 47, 0.289);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  width: 600px;
  max-width: 95%;
  max-height: 80vh;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  margin-top: 1rem;
  overflow: scroll;
  height: 70vh;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

/* Pied du formulaire */
.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 15px;
}

.btn-cancel {
  background: transparent;
  border: none;
  color: #4B5563;
  cursor: pointer;
  margin-right: 20px;
}

.btn-submit {
  background: #43A047;
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
