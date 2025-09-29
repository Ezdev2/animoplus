<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Ajouter un produit au stock</h3>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- Sélection du produit (Actif) -->
        <div class="form-group">
          <label for="actif" class="form-label">
            Produit <span class="required">*</span>
          </label>
          
          <!-- Indicateur de cache -->
          <div v-if="isUsingFallback" class="cache-warning">
            ⚠️ Données hors ligne - Actualisation en cours...
            <button type="button" @click="refreshActifs(true)" class="refresh-btn" :disabled="actifsLoading">
              🔄 Actualiser
            </button>
          </div>
          
          <!-- Champ de recherche -->
          <div class="search-wrapper">
            <input 
              type="text"
              v-model="actifSearchTerm"
              placeholder="Rechercher un produit..."
              class="form-input search-input"
              @focus="showActifSearch = true"
              @blur="setTimeout(() => showActifSearch = false, 200)"
            />
            <span class="search-icon">🔍</span>
          </div>
          
          <!-- Liste déroulante des actifs -->
          <div class="select-wrapper">
            <select 
              id="actif" 
              v-model="form.actif_id" 
              class="form-select"
              :class="{ 'error': errors.actif_id }"
              :disabled="actifsLoading"
              required
              @change="onActifSelected"
            >
              <option value="">
                {{ actifsLoading ? 'Chargement...' : 'Sélectionner un produit' }}
              </option>
              <option 
                v-for="actif in availableActifs" 
                :key="actif.id" 
                :value="actif.id"
                :title="`${actif.nom} - ${actif.description} (${actif.type})`"
              >
                {{ actif.nom }} - {{ actif.description }}
                <span v-if="actif._isFallback" class="fallback-indicator">(Hors ligne)</span>
              </option>
            </select>
            <span class="select-icon">▼</span>
          </div>
          
          <!-- Informations sur l'actif sélectionné -->
          <div v-if="selectedActif" class="actif-info">
            <div class="actif-details">
              <span class="actif-type">{{ selectedActif.type }}</span>
              <span class="actif-unit">{{ selectedActif.unite_mesure }}</span>
              <span v-if="selectedActif.prix_unitaire_defaut" class="actif-price">
                Prix suggéré: {{ formatPrice(selectedActif.prix_unitaire_defaut) }}
              </span>
            </div>
          </div>
          
          <span v-if="errors.actif_id" class="error-message">{{ errors.actif_id }}</span>
          <span v-if="actifsError" class="error-message">{{ actifsError }}</span>
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
            min="1"
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
          <div class="char-count">{{ form.notes.length }}/500</div>
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
            <span class="checkbox-label">Produit actif</span>
          </label>
          <p class="form-help">Un produit inactif ne sera pas visible dans les listes principales</p>
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
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="loading-spinner">⏳</span>
          {{ isSubmitting ? 'Ajout en cours...' : 'Ajouter au stock' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useActifsCache } from '@/composables/useActifsCache.js'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'submit'])

// Intégration du cache des actifs
const {
  actifs,
  activeActifs,
  isLoading: actifsLoading,
  error: actifsError,
  isUsingFallback,
  getActifById,
  searchActifs,
  refreshActifs
} = useActifsCache()

// État du formulaire
const form = ref({
  actif_id: '',
  quantite: null,
  prix_unitaire: null,
  date_expiration: '',
  lot_numero: '',
  notes: '',
  is_active: true
})

// État de soumission
const isSubmitting = ref(false)

// Erreurs de validation
const errors = ref({})

// État de recherche d'actifs
const actifSearchTerm = ref('')
const showActifSearch = ref(false)

// Date minimum (aujourd'hui)
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Actifs filtrés pour la sélection (seulement les actifs actifs)
const availableActifs = computed(() => {
  let filteredActifs = activeActifs.value

  // Filtrer par terme de recherche si présent
  if (actifSearchTerm.value && actifSearchTerm.value.length >= 2) {
    filteredActifs = searchActifs(actifSearchTerm.value)
      .filter(actif => actif.is_active)
  }

  return filteredActifs
})

// Actif sélectionné
const selectedActif = computed(() => {
  if (!form.value.actif_id) return null
  return getActifById(form.value.actif_id)
})

// Validation du formulaire
const validateForm = () => {
  errors.value = {}

  // Validation actif_id
  if (!form.value.actif_id) {
    errors.value.actif_id = 'Veuillez sélectionner un produit'
  } else {
    // Vérifier que l'actif sélectionné existe dans la liste
    const actifExists = availableActifs.value.find(actif => actif.id === form.value.actif_id)
    if (!actifExists) {
      errors.value.actif_id = 'Produit sélectionné invalide'
    }
  }

  // Validation quantité
  if (!form.value.quantite || form.value.quantite <= 0) {
    errors.value.quantite = 'La quantité doit être supérieure à 0'
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

// Soumission du formulaire
const handleSubmit = async () => {
  if (!validateForm()) {
    console.log('❌ Erreurs de validation:', errors.value)
    return
  }

  isSubmitting.value = true

  try {
    // Préparer les données pour l'API (format exact de Postman)
    const stockData = {
      actif_id: form.value.actif_id,
      quantite: form.value.quantite,
      prix_unitaire: form.value.prix_unitaire,
      date_expiration: form.value.date_expiration,
      lot_numero: form.value.lot_numero.trim(),
      notes: form.value.notes.trim() || null,
      is_active: form.value.is_active
    }

    console.log('📤 Données à envoyer:', stockData)

    // Émettre l'événement avec les données - le parent gère l'API
    emit('submit', stockData)

    // Note: Le modal sera fermé par le parent après succès de l'API
    // Ne pas réinitialiser ici car le parent peut avoir besoin de gérer les erreurs

  } catch (error) {
    console.error('❌ Erreur lors de la soumission:', error)
    isSubmitting.value = false
  }
}

// Fermeture du modal
const closeModal = () => {
  if (!isSubmitting.value) {
    emit('close')
    resetForm()
  }
}

// Réinitialisation du formulaire
const resetForm = () => {
  form.value = {
    actif_id: '',
    quantite: null,
    prix_unitaire: null,
    date_expiration: '',
    lot_numero: '',
    notes: '',
    is_active: true
  }
  errors.value = {}
}

// Fonction appelée quand un actif est sélectionné
const onActifSelected = () => {
  // Effacer l'erreur d'actif si un actif valide est sélectionné
  if (form.value.actif_id && errors.value.actif_id) {
    delete errors.value.actif_id
  }
  
  if (selectedActif.value && selectedActif.value.prix_unitaire_defaut) {
    // Pré-remplir le prix unitaire avec le prix par défaut
    form.value.prix_unitaire = selectedActif.value.prix_unitaire_defaut
  }
}

// Fonction de formatage des prix
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

// Réinitialiser le formulaire quand le modal se ferme
watch(() => props.isVisible, (newValue) => {
  if (!newValue) {
    // Réinitialiser avec un petit délai pour permettre les animations
    setTimeout(() => {
      resetForm()
      actifSearchTerm.value = ''
      showActifSearch.value = false
      isSubmitting.value = false
    }, 300)
  }
})

// Initialisation au montage
onMounted(() => {
  console.log('🚀 AddStockModal monté avec cache des actifs')
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

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #b86b38;
  box-shadow: 0 0 0 3px rgba(184, 107, 56, 0.1);
}

.form-input.error, .form-select.error, .form-textarea.error {
  border-color: #dc2626;
}

.select-wrapper {
  position: relative;
}

.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
  font-size: 12px;
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

/* Styles pour le cache et la recherche d'actifs */
.cache-warning {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #92400e;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.refresh-btn {
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: #d97706;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-wrapper {
  position: relative;
  margin-bottom: 8px;
}

.search-input {
  padding-right: 35px;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
  font-size: 14px;
}

.fallback-indicator {
  color: #f59e0b;
  font-size: 11px;
  font-weight: 500;
}

.actif-info {
  margin-top: 8px;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.actif-details {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.actif-type {
  background: #dbeafe;
  color: #1e40af;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
}

.actif-unit {
  background: #f3f4f6;
  color: #374151;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.actif-price {
  background: #d1fae5;
  color: #065f46;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}
</style>
