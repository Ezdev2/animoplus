<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Modifier la dépense</h3>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- Informations de base (lecture seule) -->
        <div class="form-group">
          <label class="form-label">Informations</label>
          <div class="expense-info-readonly">
            <div class="expense-details">
              <span class="expense-id">ID: {{ expenseData?.id || 'N/A' }}</span>
              <span class="expense-created">Créée le: {{ formatDate(expenseData?.created_at) }}</span>
            </div>
            <div class="expense-meta">
              <span class="expense-status" :class="getStatusClass(expenseData?.status)">
                {{ getStatusLabel(expenseData?.status) }}
              </span>
              <span class="expense-user">Par: {{ expenseData?.user?.name || 'Utilisateur' }}</span>
            </div>
          </div>
        </div>

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

        <!-- Montant de taxe et Numéro de facture -->
        <div class="form-row">
          <div class="form-group">
            <label for="tax_amount" class="form-label">Montant de taxe (€)</label>
            <input 
              id="tax_amount"
              type="number" 
              v-model="form.tax_amount"
              placeholder="0.00"
              step="0.01"
              min="0"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="invoice_number" class="form-label">Numéro de facture</label>
            <input 
              id="invoice_number"
              type="text" 
              v-model="form.invoice_number"
              placeholder="Ex: INV-2024-001"
              class="form-input"
            />
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

        <!-- Indicateur de changements -->
        <div v-if="hasChanges" class="changes-indicator">
          ✏️ Des modifications ont été détectées
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="closeModal">
            Annuler
          </button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting || !hasChanges">
            {{ isSubmitting ? 'Modification...' : 'Modifier la dépense' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useExpenses } from '@/composables/useExpenses.js'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  expenseData: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'submit'])

// Composables
const { updateExpense, formatDate, getStatusLabel } = useExpenses()

// État local
const isSubmitting = ref(false)
const errors = ref({})
const originalValues = ref({})

// Formulaire
const form = reactive({
  title: '',
  description: '',
  amount: '',
  category: '',
  supplier: '',
  expense_date: '',
  payment_method: 'card',
  tax_deductible: false,
  tax_amount: '',
  invoice_number: '',
  notes: ''
})

// Dirty tracking - détection des changements
const hasChanges = computed(() => {
  if (!originalValues.value || Object.keys(originalValues.value).length === 0) {
    return false
  }
  
  return form.title !== originalValues.value.title ||
         form.description !== originalValues.value.description ||
         parseFloat(form.amount) !== parseFloat(originalValues.value.amount) ||
         form.category !== originalValues.value.category ||
         form.supplier !== originalValues.value.supplier ||
         form.expense_date !== originalValues.value.expense_date ||
         form.payment_method !== originalValues.value.payment_method ||
         form.tax_deductible !== originalValues.value.tax_deductible ||
         parseFloat(form.tax_amount || 0) !== parseFloat(originalValues.value.tax_amount || 0) ||
         form.invoice_number !== originalValues.value.invoice_number ||
         form.notes !== originalValues.value.notes
})

// Pré-remplir le formulaire quand la modal s'ouvre
watch(() => props.isVisible, (newValue) => {
  if (newValue && props.expenseData) {
    populateForm()
    clearErrors()
  }
})

// Fonctions
const populateForm = () => {
  const expense = props.expenseData
  
  form.title = expense.title || ''
  form.description = expense.description || ''
  form.amount = expense.amount || ''
  form.category = expense.category || ''
  form.supplier = expense.supplier || ''
  form.expense_date = expense.expense_date ? expense.expense_date.split('T')[0] : ''
  form.payment_method = expense.payment_method || 'card'
  form.tax_deductible = expense.tax_deductible || false
  form.tax_amount = expense.tax_amount || ''
  form.invoice_number = expense.invoice_number || ''
  form.notes = expense.notes || ''
  
  // Sauvegarder les valeurs originales pour le dirty tracking
  originalValues.value = { ...form }
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

const getChangedFields = () => {
  const changes = {}
  
  if (form.title !== originalValues.value.title) {
    changes.title = form.title.trim()
  }
  if (form.description !== originalValues.value.description) {
    changes.description = form.description.trim() || null
  }
  if (parseFloat(form.amount) !== parseFloat(originalValues.value.amount)) {
    changes.amount = parseFloat(form.amount)
  }
  if (form.category !== originalValues.value.category) {
    changes.category = form.category
  }
  if (form.supplier !== originalValues.value.supplier) {
    changes.supplier = form.supplier.trim() || null
  }
  if (form.expense_date !== originalValues.value.expense_date) {
    changes.expense_date = form.expense_date
  }
  if (form.payment_method !== originalValues.value.payment_method) {
    changes.payment_method = form.payment_method
  }
  if (form.tax_deductible !== originalValues.value.tax_deductible) {
    changes.tax_deductible = form.tax_deductible
  }
  if (parseFloat(form.tax_amount || 0) !== parseFloat(originalValues.value.tax_amount || 0)) {
    changes.tax_amount = form.tax_amount ? parseFloat(form.tax_amount) : null
  }
  if (form.invoice_number !== originalValues.value.invoice_number) {
    changes.invoice_number = form.invoice_number.trim() || null
  }
  if (form.notes !== originalValues.value.notes) {
    changes.notes = form.notes.trim() || null
  }
  
  return changes
}

const handleSubmit = async () => {
  if (!validateForm() || !hasChanges.value) {
    return
  }

  try {
    isSubmitting.value = true

    // Payload optimisé - seulement les champs modifiés
    const changedFields = getChangedFields()
    
    console.log('📝 Champs modifiés:', changedFields)
    
    const response = await updateExpense(props.expenseData.id, changedFields)
    
    if (response.success) {
      console.log('✅ Dépense modifiée avec succès')
      emit('submit', response.data)
      closeModal()
    } else {
      console.error('❌ Erreur lors de la modification:', response.error)
      alert('Erreur lors de la modification de la dépense: ' + response.error)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la modification de la dépense:', error)
    alert('Erreur lors de la modification de la dépense')
  } finally {
    isSubmitting.value = false
  }
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'status-pending',
    approved: 'status-approved',
    rejected: 'status-rejected'
  }
  return classes[status] || 'status-default'
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
  max-width: 700px;
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

.expense-info-readonly {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 4px;
}

.expense-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.expense-id {
  font-size: 12px;
  color: #6b7280;
  font-family: monospace;
}

.expense-created {
  font-size: 12px;
  color: #6b7280;
}

.expense-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.expense-status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.status-pending { background: #fff3cd; color: #856404; }
.status-approved { background: #d4edda; color: #155724; }
.status-rejected { background: #f8d7da; color: #721c24; }
.status-default { background: #f5f5f5; color: #616161; }

.expense-user {
  font-size: 12px;
  color: #6b7280;
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

.changes-indicator {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #92400e;
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
