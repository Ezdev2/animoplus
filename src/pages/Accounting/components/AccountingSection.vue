<template>
  <div class="comptabilite-wrapper">
    <!-- Titre principal -->
    <h2 class="main-title">Comptabilité</h2>

    <!-- Séparateur -->
    <hr class="h-px bg-[rgba(197,197,197,0.5)] my-4 border-none" />

    <!-- Bloc Mois -->
    <div class="mois-section">
      <!-- Juin -->
      <div class="mois-row">
        <span class="mois-title">Juin</span>
        <div class="cards-row">
          <div class="stat-card gain">
            <span class="card-title">Gain</span>
            <div class="card-value">
              <span class="value-main">7,265</span>
              <span class="value-variation">
                + 7,265
                <img :src="arrowUp" alt="augmentation" class="arrow-icon" />
              </span>
            </div>
          </div>
          <div class="stat-card depense">
            <span class="card-title">Dépenses</span>
            <div class="card-value">
              <span class="value-main">7,265</span>
              <span class="value-variation">
                + 7,265
                <img :src="arrowUp" alt="augmentation" class="arrow-icon" />
              </span>
            </div>
          </div>
          <div class="stat-card benefice">
            <span class="card-title">Bénéfices</span>
            <div class="card-value">
              <span class="value-main">7,265</span>
              <span class="value-variation">
                + 7,265
                <img :src="arrowUp" alt="augmentation" class="arrow-icon" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Séparateur -->
      <hr class="h-px bg-[rgba(197,197,197,0.5)] my-4 border-none" />

      <!-- Mai -->
      <div class="mois-row">
        <span class="mois-title">Mai</span>
        <div class="cards-row">
          <div class="stat-card gain">
            <span class="card-title">Gain</span>
            <div class="card-value">
              <span class="value-main">7,265</span>
              <span class="value-variation">
                + 7,265
                <img :src="arrowUp" alt="augmentation" class="arrow-icon" />
              </span>
            </div>
          </div>
          <div class="stat-card depense">
            <span class="card-title">Dépenses</span>
            <div class="card-value">
              <span class="value-main">7,265</span>
              <span class="value-variation">
                + 7,265
                <img :src="arrowUp" alt="augmentation" class="arrow-icon" />
              </span>
            </div>
          </div>
          <div class="stat-card benefice">
            <span class="card-title">Bénéfices</span>
            <div class="card-value">
              <span class="value-main">7,265</span>
              <span class="value-variation">
                + 7,265
                <img :src="arrowUp" alt="augmentation" class="arrow-icon" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Séparateur -->
      <hr class="h-px bg-[rgba(197,197,197,0.5)] my-4 border-none" />
      
      <!-- Avril -->
      <div class="mois-row">
        <span class="mois-title">Avril</span>
        <div class="cards-row">
          <div class="stat-card gain">
            <span class="card-title">Gain</span>
            <div class="card-value">
              <span class="value-main">7,265</span>
              <span class="value-variation">
                + 7,265
                <img :src="arrowUp" alt="augmentation" class="arrow-icon" />
              </span>
            </div>
          </div>
          <div class="stat-card depense">
            <span class="card-title">Dépenses</span>
            <div class="card-value">
              <span class="value-main">7,265</span>
              <span class="value-variation">
                + 7,265
                <img :src="arrowUp" alt="augmentation" class="arrow-icon" />
              </span>
            </div>
          </div>
          <div class="stat-card benefice">
            <span class="card-title">Bénéfices</span>
            <div class="card-value">
              <span class="value-main">7,265</span>
              <span class="value-variation">
                + 7,265
                <img :src="arrowUp" alt="augmentation" class="arrow-icon" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des dépenses -->
    <div class="expenses-section">
      <div class="expenses-header">
        <h3 class="expenses-title">Mes Dépenses</h3>
        <button class="btn-add-expense" @click="openAddModal">
          Ajouter une dépense
        </button>
      </div>

      <!-- Modal d'ajout de dépense -->
      <AddExpenseModal 
        :isVisible="showAddModal"
        @close="closeAddModal"
        @submit="handleExpenseAdded"
      />

      <!-- Modal de modification de dépense -->
      <EditExpenseModal 
        :isVisible="showEditModal"
        :expenseData="selectedExpense"
        @close="closeEditModal"
        @submit="handleExpenseUpdated"
      />

      <!-- Modal de confirmation de suppression -->
      <DeleteConfirmModal
        v-if="showDeleteModal"
        :title="'Supprimer la dépense'"
        :confirmTitle="'Êtes-vous sûr de vouloir supprimer cette dépense ?'"
        :message="'Cette action est irréversible. La dépense sera définitivement supprimée.'"
        :itemLabel="'Dépense'"
        :itemDetails="selectedExpense ? `${selectedExpense.title} - ${formatAmount(selectedExpense.amount)}` : ''"
        :permanentWarning="'Cette action ne peut pas être annulée'"
        :isDeleting="isDeleting"
        @close="closeDeleteModal"
        @confirm="confirmDeleteExpense"
      />

      <!-- État de chargement -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Chargement des dépenses...</p>
      </div>

      <!-- État d'erreur -->
      <div v-else-if="error" class="error-state">
        <p class="error-message">{{ error }}</p>
        <button class="btn-retry" @click="fetchMyExpenses">Réessayer</button>
      </div>

      <!-- Liste des dépenses -->
      <div v-else-if="expenses.length > 0" class="expenses-list">
        <div class="expenses-table">
          <div class="table-header">
            <div class="header-cell">Date</div>
            <div class="header-cell">Titre</div>
            <div class="header-cell">Catégorie</div>
            <div class="header-cell">Fournisseur</div>
            <div class="header-cell">Montant</div>
            <div class="header-cell">Statut</div>
            <div class="header-cell">Actions</div>
          </div>
          
          <div class="table-body">
            <div 
              v-for="expense in expenses" 
              :key="expense.id" 
              class="table-row"
              :class="{ 'row-pending': expense.status === 'pending', 'row-approved': expense.status === 'approved', 'row-rejected': expense.status === 'rejected' }"
            >
              <div class="table-cell date-cell">
                {{ formatDate(expense.expense_date) }}
              </div>
              <div class="table-cell title-cell">
                <div class="expense-title">{{ expense.title }}</div>
                <div class="expense-description">{{ expense.description }}</div>
              </div>
              <div class="table-cell category-cell">
                <span class="category-badge" :class="getCategoryClass(expense.category)">
                  {{ getCategoryLabel(expense.category) }}
                </span>
              </div>
              <div class="table-cell supplier-cell">
                {{ expense.supplier || 'N/A' }}
              </div>
              <div class="table-cell amount-cell">
                <div class="amount-main">{{ formatAmount(expense.amount) }}</div>
                <div v-if="expense.is_tax_deductible" class="tax-info">
                  Déductible: {{ formatAmount(expense.tax_amount) }}
                </div>
              </div>
              <div class="table-cell status-cell">
                <span class="status-badge" :class="getStatusClass(expense.status)">
                  {{ getStatusLabel(expense.status) }}
                </span>
              </div>
              <div class="table-cell actions-cell">
                <button class="btn-action btn-edit" @click="editExpense(expense)">
                  ✏️
                </button>
                <button class="btn-action btn-delete" @click="deleteExpense(expense)">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.last_page > 1" class="pagination">
          <button 
            class="btn-page" 
            :disabled="pagination.current_page === 1"
            @click="changePage(pagination.current_page - 1)"
          >
            Précédent
          </button>
          <span class="page-info">
            Page {{ pagination.current_page }} sur {{ pagination.last_page }}
            ({{ pagination.total }} dépenses)
          </span>
          <button 
            class="btn-page" 
            :disabled="pagination.current_page === pagination.last_page"
            @click="changePage(pagination.current_page + 1)"
          >
            Suivant
          </button>
        </div>
      </div>

      <!-- État vide -->
      <div v-else class="empty-state">
        <div class="empty-icon">📄</div>
        <h4>Aucune dépense trouvée</h4>
        <p>Commencez par ajouter votre première dépense</p>
        <button class="btn-add-first" @click="openAddModal">
          Ajouter une dépense
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useExpenses } from '@/composables/useExpenses.js'
import AddExpenseModal from './AddExpenseModal.vue'
import EditExpenseModal from './EditExpenseModal.vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import arrowUp from '@/assets/icons/arrow-up.svg'

// Composable pour les dépenses
const { 
  expenses, 
  isLoading, 
  error, 
  pagination,
  createExpense, 
  updateExpense, 
  deleteExpense: deleteExpenseAPI,
  refreshMyExpenses,
  formatAmount,
  formatDate,
  getStatusLabel,
  getCategoryLabel,
  validateExpenseData
} = useExpenses()

// État local
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedExpense = ref(null)
const isDeleting = ref(false)

console.log("bla bla 🚀 ~ AccountingSection.vue ~ expenses:", expenses.value)

// Fetch initial des dépenses utilisateur (simplifié comme useStocks)
const fetchMyExpenses = async () => {
  try {
    console.log('🔄 Chargement initial des dépenses...')
    await refreshMyExpenses()
    console.log('✅ Dépenses chargées avec succès')
  } catch (error) {
    console.error('❌ Erreur lors du chargement de mes dépenses:', error)
  }
}

// Fonctions pour la modal
const openAddModal = () => {
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const handleExpenseAdded = (newExpense) => {
  console.log('✅ Nouvelle dépense ajoutée:', newExpense)
  // La liste se met à jour automatiquement grâce au store
}

// Fonctions pour la modal de modification
const openEditModal = (expense) => {
  selectedExpense.value = expense
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedExpense.value = null
}

const handleExpenseUpdated = (updatedExpense) => {
  console.log('✅ Dépense modifiée:', updatedExpense)
  // La liste se met à jour automatiquement grâce au store
}

// Modifier une dépense
const editExpense = (expense) => {
  openEditModal(expense)
}

// Supprimer une dépense
const deleteExpense = (expense) => {
  openDeleteModal(expense)
}

// Fonctions pour la modal de suppression
const openDeleteModal = (expense) => {
  selectedExpense.value = expense
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedExpense.value = null
  isDeleting.value = false
}

const confirmDeleteExpense = async () => {
  if (!selectedExpense.value) return

  try {
    isDeleting.value = true
    console.log('🗑️ Suppression de la dépense:', selectedExpense.value.id)
    
    const response = await deleteExpenseAPI(selectedExpense.value.id)
    
    if (response.success) {
      console.log('✅ Dépense supprimée avec succès')
      closeDeleteModal()
    } else {
      console.error('❌ Erreur lors de la suppression:', response.error)
      alert('Erreur lors de la suppression: ' + response.error)
    }
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de la dépense:', error)
    alert('Erreur lors de la suppression de la dépense')
  } finally {
    isDeleting.value = false
  }
}

// Changer de page
const changePage = async (page) => {
  try {
    await refreshMyExpenses({ page })
  } catch (error) {
    console.error('Erreur lors du changement de page:', error)
  }
}

// Fonctions utilitaires pour l'affichage
const getCategoryClass = (category) => {
  const classes = {
    medical: 'category-medical',
    equipment: 'category-equipment', 
    supplies: 'category-supplies',
    transport: 'category-transport',
    office: 'category-office',
    other: 'category-other'
  }
  return classes[category] || 'category-default'
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'status-pending',
    approved: 'status-approved',
    rejected: 'status-rejected'
  }
  return classes[status] || 'status-default'
}

// Chargement initial
onMounted(() => {
  fetchMyExpenses()
})
</script>


<style scoped>
.comptabilite-wrapper {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 32px 24px 24px 24px;
 width: 100%;
  margin: 0 auto;
  font-family: 'Poppins', Arial, sans-serif;
}
.main-title {
  color: #2E2E30;
  font-family: "League Spartan";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.mois-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.mois-row {
  margin-bottom: 4px;
}
.mois-title {
  font-size: 20px;
  font-weight: 500;
  color: var(--Primary---600, #43A047);
  font-family: "League Spartan";
  margin-bottom: 10px;
  display: block;
  margin-left: 4px;
}
.cards-row {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}
.stat-card {
  flex: 1;
  border-radius: 12px;
  padding: 18px 24px 30px 30px;
  min-width: 200px;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.stat-card.gain {
  background: #a5d6a7;
}
.stat-card.depense {
  background: #e5cfc6;
}
.stat-card.benefice {
  background: #e3e5e8;
}
.card-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 8px;
}
.card-value {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.value-main {
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 1px;
}
.value-variation {
  font-size: 13px;
  color: #000000;
  margin-left: 10px;
  display: flex;
  align-items: center;
}
.arrow-icon {
  width: 16px;
  height: 16px;
  margin-left: 4px;
  vertical-align: middle;
  display: inline-block;
}

.ajouter-depense-section {
  background: #fff;
  border-radius: 10px;
  margin-top: 32px;
  padding-top: 16px;
}
.ajouter-title {
  color: #000;
  font-family: "League Spartan";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 20px;
}
.form-row {
  display: flex;
  gap: 18px;
  margin-bottom: 12px;
}
.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-size: 14px;
  margin-bottom: 6px;
  font-weight: 500;
  color: var(--Neutral---600, #4B5563);
  font-family: "League Spartan";
}
.form-group input {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 15px;
}
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}
.btn-cancel {
  background: none;
  color: var(--Neutral---600, #4B5563);
  font-family: "League Spartan";
  border: none;
  font-size: 16px;
  padding: 8px 18px;
  border-radius: 7px;
  cursor: pointer;
}
.btn-add {
  background: var(--Primary---600, #43A047);
  color: #fff;
  border: none;
  font-size: 15px;
  padding: 8px 22px;
  border-radius: 7px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.15s;
}

/* Nouveaux styles pour la gestion des dépenses */

/* Section des dépenses */
.expenses-section {
  margin-top: 32px;
}

.expenses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.expenses-title {
  color: #2E2E30;
  font-family: "League Spartan";
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.btn-add-expense {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-expense:hover {
  background: #0056b3;
}

/* Mise à jour du formulaire d'ajout */
.form-group textarea,
.form-group select {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 15px;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.btn-add:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

/* États de chargement et erreur */
.loading-state, .error-state {
  text-align: center;
  padding: 40px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #dc3545;
  margin-bottom: 16px;
}

.btn-retry {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-retry:hover {
  background: #c82333;
}

/* Table des dépenses */
.expenses-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.table-header {
  display: grid;
  grid-template-columns: 100px 2fr 120px 150px 120px 100px 80px;
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
}

.header-cell {
  padding: 16px 12px;
  font-weight: 600;
  color: #495057;
  font-size: 14px;
  text-align: left;
}

.table-body {
  max-height: 600px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 100px 2fr 120px 150px 120px 100px 80px;
  border-bottom: 1px solid #dee2e6;
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-row.row-pending {
  border-left: 4px solid #ffc107;
}

.table-row.row-approved {
  border-left: 4px solid #28a745;
}

.table-row.row-rejected {
  border-left: 4px solid #dc3545;
}

.table-cell {
  padding: 16px 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.date-cell {
  color: #6c757d;
  font-size: 13px;
}

.title-cell {
  flex-direction: column;
  align-items: flex-start;
}

.expense-title {
  font-weight: 600;
  color: #2E2E30;
  margin-bottom: 4px;
}

.expense-description {
  color: #6c757d;
  font-size: 12px;
  line-height: 1.3;
}

.category-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.category-medical { background: #e3f2fd; color: #1976d2; }
.category-equipment { background: #f3e5f5; color: #7b1fa2; }
.category-supplies { background: #e8f5e8; color: #388e3c; }
.category-transport { background: #fff3e0; color: #f57c00; }
.category-office { background: #fce4ec; color: #c2185b; }
.category-other { background: #f5f5f5; color: #616161; }
.category-default { background: #f5f5f5; color: #616161; }

.amount-cell {
  flex-direction: column;
  align-items: flex-end;
}

.amount-main {
  font-weight: 600;
  color: #2E2E30;
}

.tax-info {
  font-size: 11px;
  color: #28a745;
  margin-top: 2px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-pending { background: #fff3cd; color: #856404; }
.status-approved { background: #d4edda; color: #155724; }
.status-rejected { background: #f8d7da; color: #721c24; }
.status-default { background: #f5f5f5; color: #616161; }

.actions-cell {
  gap: 8px;
}

.btn-action {
  background: none;
  border: none;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 16px;
}

.btn-action:hover {
  background: #f8f9fa;
}

.btn-edit:hover {
  background: #e3f2fd;
}

.btn-delete:hover {
  background: #ffebee;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 16px 0;
}

.btn-page {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-page:hover:not(:disabled) {
  background: #0056b3;
}

.btn-page:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.page-info {
  color: #6c757d;
  font-size: 14px;
}

/* État vide */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h4 {
  color: #2E2E30;
  margin-bottom: 8px;
}

.empty-state p {
  margin-bottom: 24px;
}

.btn-add-first {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-add-first:hover {
  background: #0056b3;
}

</style>
