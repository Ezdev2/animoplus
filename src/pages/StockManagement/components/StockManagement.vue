<template>
  <div class="stock-container">
    <div class="header-row">
      <h2>Gestion de stock</h2>
      <div class="header-actions">
        <button class="columns-btn" @click="showColumnsModal = true">
          <span class="columns-icon">⚙️</span>
          Colonnes
        </button>
        <button class="add-btn" @click="showAddModal = true">
          <span class="plus">+</span>
          Ajouter un produit
        </button>
      </div>
    </div>

    <!-- Modal de sélection des colonnes -->
    <div v-if="showColumnsModal" class="modal-overlay" @click="showColumnsModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Colonnes à afficher</h3>
          <button class="close-btn" @click="showColumnsModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="columns-grid">
            <label v-for="column in availableColumns" :key="column.key" class="column-option">
              <input 
                type="checkbox" 
                v-model="column.visible" 
                @change="updateVisibleColumns"
              />
              <span class="checkmark"></span>
              <span class="column-label">{{ column.label }}</span>
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="reset-btn" @click="resetColumns">Réinitialiser</button>
          <button class="apply-btn" @click="showColumnsModal = false">Appliquer</button>
        </div>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="stock-table">
        <thead>
          <tr>
            <th v-if="visibleColumns.actif" class="sortable" @click="sort('actif')">
              PRODUIT
              <span class="sort-icon" :class="getSortClass('actif')">↕️</span>
            </th>
            <th v-if="visibleColumns.lot_numero" class="sortable" @click="sort('lot_numero')">
              LOT
              <span class="sort-icon" :class="getSortClass('lot_numero')">↕️</span>
            </th>
            <th v-if="visibleColumns.quantite" class="sortable" @click="sort('quantite')">
              QUANTITÉ
              <span class="sort-icon" :class="getSortClass('quantite')">↕️</span>
            </th>
            <th v-if="visibleColumns.prix_unitaire" class="sortable" @click="sort('prix_unitaire')">
              PRIX UNITAIRE
              <span class="sort-icon" :class="getSortClass('prix_unitaire')">↕️</span>
            </th>
            <th v-if="visibleColumns.seuil_alerte" class="sortable" @click="sort('seuil_alerte')">
              SEUIL ALERTE
              <span class="sort-icon" :class="getSortClass('seuil_alerte')">↕️</span>
            </th>
            <th v-if="visibleColumns.date_expiration" class="sortable" @click="sort('date_expiration')">
              EXPIRATION
              <span class="sort-icon" :class="getSortClass('date_expiration')">↕️</span>
            </th>
            <th v-if="visibleColumns.notes">
              NOTES
            </th>
            <th v-if="visibleColumns.total_value" class="sortable" @click="sort('total_value')">
              VALEUR TOTALE
              <span class="sort-icon" :class="getSortClass('total_value')">↕️</span>
            </th>
            <th v-if="visibleColumns.is_active">
              STATUT
            </th>
            <th v-if="visibleColumns.actions">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Données API réelles avec fallback mock -->
          <tr v-if="isLoading">
            <td :colspan="visibleColumnsCount" class="loading-state">
              <div class="loading-content">
                <div class="loading-spinner">⏳</div>
                <p class="loading-text">Chargement des stocks...</p>
              </div>
            </td>
          </tr>
          <tr v-else-if="error">
            <td :colspan="visibleColumnsCount" class="error-state">
              <div class="error-content">
                <div class="error-icon">❌</div>
                <p class="error-text">{{ error.message || 'Erreur lors du chargement' }}</p>
                <button class="retry-btn" @click="refetch()">Réessayer</button>
              </div>
            </td>
          </tr>
          <tr v-else-if="displayedStocks.length === 0">
            <td :colspan="visibleColumnsCount" class="empty-state">
              <div class="empty-content">
                <div class="empty-icon">📦</div>
                <h3 class="empty-title">Aucun stock trouvé</h3>
                <p class="empty-subtitle">Commencez par ajouter des produits à votre inventaire</p>
              </div>
            </td>
          </tr>
          <tr v-else v-for="stock in displayedStocks" :key="stock.id">
            <td v-if="visibleColumns.actif" class="product-cell">
              <div class="product-info">
                <span class="product-name">{{ stock.actif?.nom || 'Produit inconnu' }}</span>
                <span class="product-code">{{ stock.actif?.description || '' }}</span>
              </div>
            </td>
            <td v-if="visibleColumns.lot_numero" class="lot-cell">
              <span class="lot-badge">{{ stock.lot_numero || '-' }}</span>
            </td>
            <td v-if="visibleColumns.quantite" class="quantity-cell">
              <span :class="getQuantityClass(stock)">{{ stock.quantite }}</span>
            </td>
            <td v-if="visibleColumns.prix_unitaire" class="price-cell">
              {{ formatPrice(stock.prix_unitaire || 0) }}
            </td>
            <td v-if="visibleColumns.seuil_alerte" class="threshold-cell">
              {{ stock.actif?.seuil_alerte || 0 }}
            </td>
            <td v-if="visibleColumns.date_expiration" class="expiration-cell">
              <span :class="getExpirationClass(stock)">{{ formatExpirationDate(stock.date_expiration || null) }}</span>
            </td>
            <td v-if="visibleColumns.notes" class="notes-cell">
              {{ stock.notes || '' }}
            </td>
            <td v-if="visibleColumns.total_value" class="price-cell">
              {{ formatPrice(stock.total_value || 0) }}
            </td>
            <td v-if="visibleColumns.is_active" class="status-cell">
              <span :class="stock.is_active ? 'status-active' : 'status-inactive'">
                {{ stock.is_active ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td v-if="visibleColumns.actions" class="actions-cell">
              <button class="edit-btn" @click="editStock(stock)">
                <span class="edit-icon">✏️</span>
                Modifier
              </button>
              <button class="delete-btn" @click="deleteStock(stock)">
                <span class="delete-icon">🗑️</span>
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="auto-order-section">
      <div class="auto-order-header">
        <img :src="storeIcon" alt="Store" class="icon" />
        <span class="auto-order-title">Commande automatique</span>
      </div>
      <p class="auto-order-text">
        Des produits sont en dessous du seuil minimal. Un email automatique peut être généré vers le fournisseur avec les quantités recommandées.
      </p>
      <button class="auto-order-btn">Générer une commande fournisseur</button>
    </div>

    <!-- Modal d'ajout de stock -->
    <AddStockModal 
      :isVisible="showAddModal"
      @close="showAddModal = false"
      @submit="handleAddStock"
    />

    <!-- Modal de modification de stock -->
    <EditStockModal 
      :isVisible="showEditModal"
      :stockData="selectedStock"
      @close="showEditModal = false"
      @submit="handleEditStock"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useStocks } from '@/composables/useStocks.js'
import AddStockModal from './AddStockModal.vue'
import EditStockModal from './EditStockModal.vue'
import storeIcon from '@/assets/icons/store-icon.svg'

// État pour les modals
const showColumnsModal = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedStock = ref(null)

// Configuration des colonnes disponibles (basée sur l'API réelle)
const availableColumns = ref([
  { key: 'actif', label: 'Produit', visible: true },
  { key: 'lot_numero', label: 'Numéro de lot', visible: true },
  { key: 'quantite', label: 'Quantité', visible: true },
  { key: 'prix_unitaire', label: 'Prix unitaire', visible: true },
  { key: 'seuil_alerte', label: 'Seuil d\'alerte', visible: true },
  { key: 'date_expiration', label: 'Date d\'expiration', visible: false },
  { key: 'notes', label: 'Notes', visible: false },
  { key: 'total_value', label: 'Valeur totale', visible: false },
  { key: 'is_active', label: 'Statut', visible: false },
  { key: 'actions', label: 'Actions', visible: true }
])

// Colonnes visibles calculées
const visibleColumns = computed(() => {
  const visible = {}
  availableColumns.value.forEach(col => {
    visible[col.key] = col.visible
  })
  return visible
})

// Nombre de colonnes visibles pour colspan
const visibleColumnsCount = computed(() => {
  return availableColumns.value.filter(col => col.visible).length
})

// Tri
const sortBy = ref('quantite')
const sortOrder = ref('desc')

// Intégration API réelle avec useStocks
const { useMyStocks } = useStocks()

// Options de requête pour mes stocks
const stockOptions = ref({
  page: 1,
  per_page: 15,
  with_actif: true,
  with_user: false,
  active_only: true
})

// Hook pour récupérer mes stocks
const { stocks, pagination, isLoading, error, refetch } = useMyStocks(stockOptions)

// Stocks affichés (API ou fallback mock)
const displayedStocks = computed(() => {
  if (stocks.value && stocks.value.length > 0) {
    return stocks.value
  }
  // Fallback mock data si pas de données API
  return mockStocksFallback.value
})

// Données mock de fallback (structure conforme à l'API)
const mockStocksFallback = ref([
  {
    id: '1',
    actif: { nom: 'Paracétamol 500mg', description: 'Antalgique', seuil_alerte: 10 },
    lot_numero: 'LOT2025001',
    quantite: 5,
    prix_unitaire: '4.00',
    date_expiration: '2025-06-15T00:00:00.000000Z',
    notes: 'Stock faible - à commander',
    is_active: true,
    is_expired: false,
    is_expiring_soon: true,
    total_value: 20.00
  },
  {
    id: '2',
    actif: { nom: 'Amoxicilline 250mg', description: 'Antibiotique', seuil_alerte: 15 },
    lot_numero: 'LOT2025002',
    quantite: 40,
    prix_unitaire: '6.50',
    date_expiration: '2025-12-31T00:00:00.000000Z',
    notes: 'Stock normal',
    is_active: true,
    is_expired: false,
    is_expiring_soon: false,
    total_value: 260.00
  }
])

// Fonctions de gestion des colonnes
const updateVisibleColumns = () => {
  // Fonction appelée quand une colonne est cochée/décochée
  console.log('Colonnes mises à jour:', visibleColumns.value)
}

const resetColumns = () => {
  // Réinitialiser aux colonnes par défaut
  availableColumns.value.forEach(col => {
    col.visible = ['actif', 'lot_numero', 'quantite', 'prix_unitaire', 'seuil_alerte', 'actions'].includes(col.key)
  })
}

// Fonctions de tri
const sort = (column) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'asc'
  }
  // TODO: Implémenter le tri réel avec l'API
  console.log(`Tri par ${column} ${sortOrder.value}`)
}

const getSortClass = (column) => {
  if (sortBy.value !== column) return ''
  return sortOrder.value === 'asc' ? 'sort-asc' : 'sort-desc'
}

// Fonctions de formatage
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const formatExpirationDate = (date) => {
  if (!date) return '-'
  
  const expirationDate = new Date(date)
  const now = new Date()
  const diffTime = expirationDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return `Expiré depuis ${Math.abs(diffDays)} jour(s)`
  } else if (diffDays === 0) {
    return 'Expire aujourd\'hui'
  } else if (diffDays === 1) {
    return 'Expire demain'
  } else if (diffDays <= 30) {
    return `Expire dans ${diffDays} jour(s)`
  } else {
    return expirationDate.toLocaleDateString('fr-FR')
  }
}

// Fonctions de style conditionnel
const getQuantityClass = (stock) => {
  const seuil = stock.actif?.seuil_alerte || stock.seuil_alerte
  if (seuil && stock.quantite <= seuil) {
    return 'quantity-low'
  }
  return 'quantity-normal'
}

const getExpirationClass = (stock) => {
  if (!stock.date_expiration) return ''
  
  const expirationDate = new Date(stock.date_expiration)
  const now = new Date()
  const diffTime = expirationDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'expiration-expired'
  if (diffDays <= 30) return 'expiration-warning'
  return 'expiration-normal'
}

const getStatusClass = (isActive) => {
  return isActive ? 'status-active' : 'status-inactive'
}

// Fonctions d'actions
const editStock = (stock) => {
  console.log('📝 Ouverture du modal de modification pour:', stock)
  selectedStock.value = stock
  showEditModal.value = true
}

const deleteStock = (stock) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le stock "${stock.actif?.nom}" ?`)) {
    console.log('Supprimer le stock:', stock)
    // TODO: Appeler l'API de suppression
  }
}

// Fonction de gestion de l'ajout de stock
const handleAddStock = async (stockData) => {
  try {
    console.log('📦 Nouveau stock à ajouter:', stockData)
    
    // Intégration avec l'API de création via le composable useStocks
    const { createStock } = useStocks()
    const response = await createStock(stockData)
    
    if (response.success) {
      console.log('✅ Stock créé avec succès:', response.data)
      
      // Fermer le modal après succès
      showAddModal.value = false
      
      // Pas besoin de refetch ! Le hook useCreateStock a déjà :
      // 1. Ajouté le nouveau stock au store Pinia
      // 2. Invalidé les caches TanStack Query
      // 3. L'affichage se met à jour automatiquement
      
      console.log('🎉 Stock ajouté avec succès - Affichage mis à jour automatiquement')
    } else {
      console.error('❌ Erreur création stock:', response.error)
      // Le modal reste ouvert pour permettre à l'utilisateur de corriger
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la création du stock:', error)
    // Le modal reste ouvert pour permettre à l'utilisateur de réessayer
  }
}

// Fonction de gestion de la modification de stock
const handleEditStock = async (updateData) => {
  try {
    console.log('📝 Modification du stock:', updateData)
    
    // Intégration avec l'API de modification via le composable useStocks
    const { updateStock } = useStocks()
    const response = await updateStock(updateData.id, updateData.changes)
    
    if (response.success) {
      console.log('✅ Stock modifié avec succès:', response.data)
      
      // Fermer le modal après succès
      showEditModal.value = false
      selectedStock.value = null
      
      // Pas besoin de refetch ! Le hook useUpdateStock a déjà :
      // 1. Mis à jour le stock dans le store Pinia
      // 2. Invalidé les caches TanStack Query
      // 3. L'affichage se met à jour automatiquement
      
      console.log('🎉 Stock modifié avec succès - Affichage mis à jour automatiquement')
    } else {
      console.error('❌ Erreur modification stock:', response.error)
      // Le modal reste ouvert pour permettre à l'utilisateur de corriger
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la modification du stock:', error)
    // Le modal reste ouvert pour permettre à l'utilisateur de réessayer
  }
}

// Initialisation au montage du composant
onMounted(() => {
  console.log(' Composant StockManagement monté')
  console.log('Options de requête:', stockOptions.value)
  console.log('Chargement des stocks...')
})
</script>

<style scoped>
.stock-container {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #ededed;
  padding: 24px 16px 0 16px;
  font-family: 'Inter', Arial, sans-serif;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.header-row h2 {
  font-size: 19px;
  font-weight: 700;
  color: #232323;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.columns-btn {
  background: #f8f9fa;
  color: #495057;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  padding: 8px 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
}

.columns-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.columns-icon {
  margin-right: 6px;
  font-size: 16px;
}

.add-btn {
  background: #b86b38;
  color: #fff;
  font-size: 15px;
  border-radius: 18px;
  border: none;
  padding: 10px 24px 10px 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: filter 0.2s;
}

.add-btn:hover {
  filter: brightness(0.92);
}

.add-btn .plus {
  font-size: 19px;
  margin-right: 8px;
}

/* Modal de sélection des colonnes */
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
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
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
  padding: 20px 24px;
}

.columns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.column-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.column-option:hover {
  background: #f9fafb;
}

.column-option input[type="checkbox"] {
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

.column-option input[type="checkbox"]:checked + .checkmark {
  background: #b86b38;
  border-color: #b86b38;
}

.column-option input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.column-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.reset-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #e5e7eb;
}

.apply-btn {
  background: #b86b38;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.apply-btn:hover {
  filter: brightness(0.92);
}

/* Tableau */
.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.stock-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background: #fff;
}

.stock-table thead th {
  background: #f9fafb;
  padding: 12px 16px;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.stock-table thead th.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.stock-table thead th.sortable:hover {
  background: #f3f4f6;
}

.sort-icon {
  margin-left: 4px;
  font-size: 12px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.sort-asc .sort-icon {
  opacity: 1;
  transform: rotate(180deg);
}

.sort-desc .sort-icon {
  opacity: 1;
}

.stock-table tbody td {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.stock-table tbody tr:hover {
  background: #f9fafb;
}

.stock-table tbody tr:last-child td {
  border-bottom: none;
}

/* Cellules spécialisées */
.product-cell {
  min-width: 200px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.product-name {
  font-weight: 600;
  color: #111827;
}

.product-code {
  font-size: 12px;
  color: #6b7280;
}

.lot-cell {
  min-width: 120px;
}

.lot-badge {
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.quantity-cell {
  min-width: 100px;
  text-align: center;
}

.quantity-low {
  color: #dc2626;
  font-weight: 600;
}

.quantity-normal {
  color: #059669;
  font-weight: 500;
}

.price-cell {
  min-width: 120px;
  text-align: right;
  font-weight: 600;
  color: #111827;
}

.threshold-cell {
  min-width: 100px;
  text-align: center;
  color: #6b7280;
}

.expiration-cell {
  min-width: 150px;
}

.expiration-expired {
  color: #dc2626;
  font-weight: 600;
}

.expiration-warning {
  color: #d97706;
  font-weight: 500;
}

.expiration-normal {
  color: #059669;
}

.supplier-cell {
  min-width: 150px;
  color: #6b7280;
}

.status-cell {
  min-width: 100px;
}

.status-active {
  background: #d1fae5;
  color: #065f46;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-inactive {
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.actions-cell {
  min-width: 150px;
}

.edit-btn {
  background: #d1fae5;
  color: #065f46;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 12px;
  margin-right: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: #a7f3d0;
}

.delete-btn {
  background: #fecaca;
  color: #dc2626;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.delete-btn:hover {
  background: #fca5a5;
}

/* États de chargement et erreur */
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 48px 24px;
}

.loading-content, .error-content, .empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.loading-spinner, .error-icon, .empty-icon {
  font-size: 48px;
  opacity: 0.7;
}

.loading-text, .error-text, .empty-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.empty-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.retry-btn {
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}

.retry-btn:hover {
  background: #d97706;
}

/* Cellule notes */
.notes-cell {
  min-width: 200px;
  max-width: 250px;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.4;
  word-wrap: break-word;
}

/* Section Commande automatique */
.auto-order-section {
  margin-top: 28px;
  border-left: 6px solid var(--Accent---500, #A0522D);
  background: rgba(245, 158, 11, 0.15);
  border-radius: 10px;
  padding: 16px 22px 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.auto-order-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--Accent---500, #A0522D);
}

.icon {
  font-size: 18px;
}

.auto-order-title {
  font-size: 15px;
}

.auto-order-text {
  font-size: 14px;
  color: var(--Black, #222);
  margin: 0;
}

.auto-order-btn {
  background: var(--Accent---500, #A0522D);
  box-shadow: 0px 4px 12px 0px rgba(245, 158, 11, 0.25);
  color: #fff;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  font-size: 15px;
  padding: 9px 24px;
  align-self: flex-start;
  margin-top: 6px;
  cursor: pointer;
  transition: filter 0.2s;
}

.auto-order-btn:hover {
  filter: brightness(0.92);
}
</style>
