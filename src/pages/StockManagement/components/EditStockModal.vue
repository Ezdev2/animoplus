<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Modifier le stock</h3>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- Informations du produit (lecture seule) -->
        <div class="form-group">
          <label class="form-label">Produit</label>
          <div class="product-info-readonly">
            <div class="product-details">
              <span class="product-name">{{ stockData?.actif?.nom || 'Produit inconnu' }}</span>
              <span class="product-description">{{ stockData?.actif?.description || '' }}</span>
            </div>
            <div class="product-meta">
              <span class="product-type">{{ stockData?.actif?.type || '' }}</span>
              <span class="product-unit">{{ stockData?.actif?.unite_mesure || '' }}</span>
            </div>
          </div>
        </div>

        <!-- Quantité -->
        <div class="form-group">
          <label for="quantite" class="form-label">
            Quantité <span class="required">*</span>
          </label>
          <input 
            id="quantite"
            type="number" 
            v-model.number="form.quantite" 
            class="form-input"
            :class="{ 'error': errors.quantite }"
            placeholder="Ex: 25"
            min="0"
            step="1"
            required
          />
          <span v-if="errors.quantite" class="error-message">{{ errors.quantite }}</span>
        </div>

        <!-- Prix unitaire -->
        <div class="form-group">
          <label for="prix_unitaire" class="form-label">
            Prix unitaire (€) <span class="required">*</span>
          </label>
          <input 
            id="prix_unitaire"
            type="number" 
            v-model.number="form.prix_unitaire" 
            class="form-input"
            :class="{ 'error': errors.prix_unitaire }"
            placeholder="Ex: 15.99"
            min="0"
            step="0.01"
            required
          />
          <span v-if="errors.prix_unitaire" class="error-message">{{ errors.prix_unitaire }}</span>
        </div>

        <!-- Date d'expiration -->
        <div class="form-group">
          <label for="date_expiration" class="form-label">
            Date d'expiration <span class="required">*</span>
          </label>
          <input 
            id="date_expiration"
            type="date" 
            v-model="form.date_expiration" 
            class="form-input"
            :class="{ 'error': errors.date_expiration }"
            :min="minDate"
            required
          />
          <span v-if="errors.date_expiration" class="error-message">{{ errors.date_expiration }}</span>
        </div>

        <!-- Numéro de lot -->
        <div class="form-group">
          <label for="lot_numero" class="form-label">
            Numéro de lot <span class="required">*</span>
          </label>
          <input 
            id="lot_numero"
            type="text" 
            v-model="form.lot_numero" 
            class="form-input"
            :class="{ 'error': errors.lot_numero }"
            placeholder="Ex: LOT2025001"
            maxlength="50"
            required
          />
          <span v-if="errors.lot_numero" class="error-message">{{ errors.lot_numero }}</span>
        </div>

        <!-- Notes -->
        <div class="form-group">
          <label for="notes" class="form-label">Notes</label>
          <textarea 
            id="notes"
            v-model="form.notes" 
            class="form-textarea"
            :class="{ 'error': errors.notes }"
            placeholder="Notes optionnelles sur ce stock..."
            rows="3"
            maxlength="500"
          ></textarea>
          <div class="char-count">{{ (form.notes || '').length }}/500</div>
          <span v-if="errors.notes" class="error-message">{{ errors.notes }}</span>
        </div>

        <!-- Statut actif -->
        <div class="form-group">
          <label class="checkbox-wrapper">
            <input 
              type="checkbox" 
              v-model="form.is_active"
              class="form-checkbox"
            />
            <span class="checkmark"></span>
            <span class="checkbox-label">Stock actif</span>
          </label>
          <p class="form-help">Un stock inactif ne sera pas visible dans les listes principales</p>
        </div>
      </form>

      <div class="modal-footer">
        <button type="button" class="cancel-btn" @click="closeModal">
          Annuler
        </button>
        <button 
          type="submit" 
          class="submit-btn" 
          @click="handleSubmit"
          :disabled="isSubmitting || !hasChanges"
        >
          <span v-if="isSubmitting" class="loading-spinner">⏳</span>
          {{ isSubmitting ? 'Modification en cours...' : 'Modifier le stock' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  stockData: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'submit'])

// État du formulaire
const form = ref({
  quantite: null,
  prix_unitaire: null,
  date_expiration: '',
  lot_numero: '',
  notes: '',
  is_active: true
})

// Valeurs originales pour détecter les changements
const originalValues = ref({})

// État de soumission
const isSubmitting = ref(false)

// Erreurs de validation
const errors = ref({})

// Date minimum (aujourd'hui)
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Détection des changements (dirty tracking)
const hasChanges = computed(() => {
  if (!originalValues.value || Object.keys(originalValues.value).length === 0) {
    return false
  }

  return (
    form.value.quantite !== originalValues.value.quantite ||
    form.value.prix_unitaire !== originalValues.value.prix_unitaire ||
    form.value.date_expiration !== originalValues.value.date_expiration ||
    form.value.lot_numero !== originalValues.value.lot_numero ||
    form.value.notes !== originalValues.value.notes ||
    form.value.is_active !== originalValues.value.is_active
  )
})

// Initialiser le formulaire avec les données du stock
const initializeForm = () => {
  if (!props.stockData) return

  const stock = props.stockData
  
  // Convertir la date d'expiration au format YYYY-MM-DD
  let dateExpiration = ''
  if (stock.date_expiration) {
    const date = new Date(stock.date_expiration)
    dateExpiration = date.toISOString().split('T')[0]
  }

  // Remplir le formulaire
  form.value = {
    quantite: stock.quantite || 0,
    prix_unitaire: parseFloat(stock.prix_unitaire) || 0,
    date_expiration: dateExpiration,
    lot_numero: stock.lot_numero || '',
    notes: stock.notes || '',
    is_active: stock.is_active !== false
  }

  // Sauvegarder les valeurs originales pour le dirty tracking
  originalValues.value = { ...form.value }

  console.log('📝 Formulaire initialisé avec:', form.value)
  console.log('💾 Valeurs originales sauvegardées:', originalValues.value)
}

// Validation du formulaire
const validateForm = () => {
  errors.value = {}

  // Validation quantité
  if (form.value.quantite === null || form.value.quantite < 0) {
    errors.value.quantite = 'La quantité doit être supérieure ou égale à 0'
  }

  // Validation prix unitaire
  if (!form.value.prix_unitaire || form.value.prix_unitaire <= 0) {
    errors.value.prix_unitaire = 'Le prix unitaire doit être supérieur à 0'
  }

  // Validation date d'expiration
  if (!form.value.date_expiration) {
    errors.value.date_expiration = 'La date d\'expiration est requise'
  } else {
    const expirationDate = new Date(form.value.date_expiration)
    const today = new Date()
    if (expirationDate <= today) {
      errors.value.date_expiration = 'La date d\'expiration doit être dans le futur'
    }
  }

  // Validation numéro de lot
  if (!form.value.lot_numero || form.value.lot_numero.trim().length < 3) {
    errors.value.lot_numero = 'Le numéro de lot doit contenir au moins 3 caractères'
  }

  // Validation notes (optionnel mais limité)
  if (form.value.notes && form.value.notes.length > 500) {
    errors.value.notes = 'Les notes ne peuvent pas dépasser 500 caractères'
  }

  return Object.keys(errors.value).length === 0
}

// Calculer seulement les champs modifiés
const getChangedFields = () => {
  const changes = {}

  if (form.value.quantite !== originalValues.value.quantite) {
    changes.quantite = form.value.quantite
  }

  if (form.value.prix_unitaire !== originalValues.value.prix_unitaire) {
    changes.prix_unitaire = form.value.prix_unitaire
  }

  if (form.value.date_expiration !== originalValues.value.date_expiration) {
    changes.date_expiration = form.value.date_expiration
  }

  if (form.value.lot_numero !== originalValues.value.lot_numero) {
    changes.lot_numero = form.value.lot_numero.trim()
  }

  if (form.value.notes !== originalValues.value.notes) {
    changes.notes = form.value.notes?.trim() || null
  }

  if (form.value.is_active !== originalValues.value.is_active) {
    changes.is_active = form.value.is_active
  }

  return changes
}

// Soumission du formulaire
const handleSubmit = async () => {
  if (!validateForm()) {
    console.log('❌ Erreurs de validation:', errors.value)
    return
  }

  if (!hasChanges.value) {
    console.log('ℹ️ Aucune modification détectée')
    emit('close')
    return
  }

  isSubmitting.value = true

  try {
    // Calculer seulement les champs modifiés
    const changedFields = getChangedFields()
    
    console.log('📤 Champs modifiés à envoyer:', changedFields)
    console.log('🆔 ID du stock:', props.stockData?.id)

    // Émettre l'événement avec l'ID et les données modifiées
    emit('submit', {
      id: props.stockData.id,
      changes: changedFields
    })

    // Note: Le modal sera fermé par le parent après succès de l'API

  } catch (error) {
    console.error('❌ Erreur lors de la soumission:', error)
    isSubmitting.value = false
  }
}

// Fermeture du modal
const closeModal = () => {
  if (!isSubmitting.value) {
    emit('close')
  }
}

// Réinitialiser le formulaire quand le modal se ferme
watch(() => props.isVisible, (newValue) => {
  if (!newValue) {
    // Réinitialiser avec un petit délai pour permettre les animations
    setTimeout(() => {
      form.value = {
        quantite: null,
        prix_unitaire: null,
        date_expiration: '',
        lot_numero: '',
        notes: '',
        is_active: true
      }
      originalValues.value = {}
      errors.value = {}
      isSubmitting.value = false
    }, 300)
  }
})

// Initialiser le formulaire quand les données changent
watch(() => props.stockData, () => {
  if (props.isVisible && props.stockData) {
    initializeForm()
  }
}, { immediate: true })

// Initialisation au montage
onMounted(() => {
  console.log('🚀 EditStockModal monté')
})
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
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
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
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.required {
  color: #dc2626;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #b86b38;
  box-shadow: 0 0 0 3px rgba(184, 107, 56, 0.1);
}

.form-input.error, .form-textarea.error {
  border-color: #dc2626;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.form-checkbox {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  margin-right: 10px;
  position: relative;
  transition: all 0.2s;
}

.form-checkbox:checked + .checkmark {
  background: #b86b38;
  border-color: #b86b38;
}

.form-checkbox:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.form-help {
  font-size: 12px;
  color: #6b7280;
  margin: 4px 0 0 28px;
}

.error-message {
  display: block;
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.submit-btn {
  background: #b86b38;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  background: #a55a32;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  font-size: 16px;
}

/* Informations produit en lecture seule */
.product-info-readonly {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.product-name {
  font-weight: 600;
  color: #111827;
  font-size: 14px;
}

.product-description {
  font-size: 13px;
  color: #6b7280;
}

.product-meta {
  display: flex;
  gap: 12px;
}

.product-type {
  background: #dbeafe;
  color: #1e40af;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
}

.product-unit {
  background: #f3f4f6;
  color: #374151;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}
</style>
