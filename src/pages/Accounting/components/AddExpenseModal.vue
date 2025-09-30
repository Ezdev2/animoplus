<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Ajouter une dépense</h3>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- Titre -->
        <div class="form-group">
          <label for="title" class="form-label">
            Titre <span class="required">*</span>
          </label>
          <input 
            id="title"
            type="text" 
            v-model="form.title"
            placeholder="Ex: Achat médicaments vétérinaires"
            class="form-input"
            :class="{ 'error': errors.title }"
            required
          />
          <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
        </div>

        <!-- Montant et Catégorie -->
        <div class="form-row">
          <div class="form-group">
            <label for="amount" class="form-label">
              Montant (€) <span class="required">*</span>
            </label>
            <input 
              id="amount"
              type="number" 
              v-model="form.amount"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              class="form-input"
              :class="{ 'error': errors.amount }"
              required
            />
            <span v-if="errors.amount" class="error-message">{{ errors.amount }}</span>
          </div>

          <div class="form-group">
            <label for="category" class="form-label">
              Catégorie <span class="required">*</span>
            </label>
            <select 
              id="category" 
              v-model="form.category"
              class="form-select"
              :class="{ 'error': errors.category }"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="medical">Médical</option>
              <option value="equipment">Équipement</option>
              <option value="supplies">Fournitures</option>
              <option value="transport">Transport</option>
              <option value="office">Bureau</option>
              <option value="marketing">Marketing</option>
              <option value="training">Formation</option>
              <option value="other">Autre</option>
            </select>
            <span v-if="errors.category" class="error-message">{{ errors.category }}</span>
          </div>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="description" class="form-label">Description</label>
          <textarea 
            id="description" 
            v-model="form.description"
            placeholder="Description de la dépense"
            rows="3"
            class="form-textarea"
          ></textarea>
        </div>

        <!-- Fournisseur et Date -->
        <div class="form-row">
          <div class="form-group">
            <label for="supplier" class="form-label">Fournisseur</label>
            <input 
              id="supplier"
              type="text" 
              v-model="form.supplier"
              placeholder="Nom du fournisseur"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="expense_date" class="form-label">
              Date <span class="required">*</span>
            </label>
            <input 
              id="expense_date"
              type="date" 
              v-model="form.expense_date"
              class="form-input"
              :class="{ 'error': errors.expense_date }"
              required
            />
            <span v-if="errors.expense_date" class="error-message">{{ errors.expense_date }}</span>
          </div>
        </div>

        <!-- Méthode de paiement et Déduction fiscale -->
        <div class="form-row">
          <div class="form-group">
            <label for="payment_method" class="form-label">Méthode de paiement</label>
            <select 
              id="payment_method" 
              v-model="form.payment_method"
              class="form-select"
            >
              <option value="card">Carte bancaire</option>
              <option value="cash">Espèces</option>
              <option value="check">Chèque</option>
              <option value="transfer">Virement</option>
            </select>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="form.tax_deductible"
                class="form-checkbox"
              />
              <span class="checkbox-text">Déductible fiscalement</span>
            </label>
          </div>
        </div>

        <!-- Notes -->
        <div class="form-group">
          <label for="notes" class="form-label">Notes</label>
          <textarea 
            id="notes" 
            v-model="form.notes"
            placeholder="Notes additionnelles"
            rows="2"
            class="form-textarea"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="closeModal">
            Annuler
          </button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Ajout...' : 'Ajouter la dépense' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useExpenses } from '@/composables/useExpenses.js'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'submit'])

// Composables
const { createExpense } = useExpenses()

// État local
const isSubmitting = ref(false)
const errors = ref({})

// Formulaire
const form = reactive({
  title: '',
  description: '',
  amount: '',
  category: '',
  supplier: '',
  expense_date: new Date().toISOString().split('T')[0], // Date d'aujourd'hui par défaut
  payment_method: 'card',
  tax_deductible: false,
  notes: ''
})

// Réinitialiser le formulaire quand la modal s'ouvre
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    resetForm()
    clearErrors()
  }
})

// Fonctions
const resetForm = () => {
  form.title = ''
  form.description = ''
  form.amount = ''
  form.category = ''
  form.supplier = ''
  form.expense_date = new Date().toISOString().split('T')[0]
  form.payment_method = 'card'
  form.tax_deductible = false
  form.notes = ''
}

const clearErrors = () => {
  errors.value = {}
}

const validateForm = () => {
  clearErrors()
  let isValid = true

  // Validation des champs requis
  if (!form.title.trim()) {
    errors.value.title = 'Le titre est requis'
    isValid = false
  }

  if (!form.amount || parseFloat(form.amount) <= 0) {
    errors.value.amount = 'Le montant doit être supérieur à 0'
    isValid = false
  }

  if (!form.category) {
    errors.value.category = 'La catégorie est requise'
    isValid = false
  }

  if (!form.expense_date) {
    errors.value.expense_date = 'La date est requise'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    isSubmitting.value = true

    // Préparer les données (structure exacte de l'API)
    const expenseData = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      amount: parseFloat(form.amount),
      category: form.category,
      expense_date: form.expense_date,
      supplier: form.supplier.trim() || null,
      invoice_number: null, // Pas dans ce formulaire
      tax_amount: null, // Calculé automatiquement si nécessaire
      tax_deductible: form.tax_deductible,
      payment_method: form.payment_method,
      status: 'pending', // Par défaut
      notes: form.notes.trim() || null
    }

    console.log('📝 Données de la dépense à créer:', expenseData)
    
    const response = await createExpense(expenseData)
    
    if (response.success) {
      console.log('✅ Dépense créée avec succès')
      emit('submit', response.data)
      closeModal()
    } else {
      console.error('❌ Erreur lors de la création:', response.error)
      alert('Erreur lors de la création de la dépense: ' + response.error)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de la dépense:', error)
    alert('Erreur lors de la création de la dépense')
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.required {
  color: #ef4444;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error,
.form-select.error {
  border-color: #ef4444;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: 8px;
}

.form-checkbox {
  margin-right: 8px;
  width: 16px;
  height: 16px;
}

.checkbox-text {
  font-size: 14px;
  color: #374151;
}

.error-message {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #ef4444;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-submit {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 14px;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-submit {
  background: #3b82f6;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #2563eb;
}

.btn-submit:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 640px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .modal-content {
    max-height: 95vh;
  }
}
</style>
