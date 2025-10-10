<template>
  <div class="loading-preferences-panel">
    <div class="panel-header">
      <h3 class="panel-title">Préférences de chargement</h3>
      <p class="panel-subtitle">Personnalisez l'affichage des indicateurs de chargement</p>
    </div>
    
    <div class="panel-content">
      <!-- Type de chargement -->
      <div class="preference-group">
        <label class="group-label">Type d'indicateur</label>
        <div class="option-grid">
          <div 
            v-for="type in loadingTypes" 
            :key="type.value"
            class="option-card"
            :class="{ active: loadingType === type.value }"
            @click="setLoadingType(type.value)"
          >
            <div class="option-preview">
              <component 
                :is="getPreviewComponent(type.value)"
                v-bind="getPreviewProps(type.value)"
              />
            </div>
            <div class="option-info">
              <div class="option-name">{{ type.name }}</div>
              <div class="option-description">{{ type.description }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Vitesse d'animation -->
      <div class="preference-group">
        <label class="group-label">Vitesse d'animation</label>
        <div class="speed-selector">
          <div 
            v-for="speed in animationSpeeds"
            :key="speed.value"
            class="speed-option"
            :class="{ active: animationSpeed === speed.value }"
            @click="setAnimationSpeed(speed.value)"
          >
            <div class="speed-indicator" :class="`speed-${speed.value}`"></div>
            <span class="speed-label">{{ speed.name }}</span>
          </div>
        </div>
      </div>
      
      <!-- Options d'affichage -->
      <div class="preference-group">
        <label class="group-label">Options d'affichage</label>
        <div class="toggle-options">
          <div class="toggle-option">
            <label class="toggle-label">
              <input 
                type="checkbox" 
                :checked="showMessages" 
                @change="toggleMessages"
                class="toggle-input"
              >
              <span class="toggle-slider"></span>
              <span class="toggle-text">Afficher les messages</span>
            </label>
            <p class="toggle-description">Affiche des messages descriptifs pendant le chargement</p>
          </div>
          
          <div class="toggle-option">
            <label class="toggle-label">
              <input 
                type="checkbox" 
                :checked="showProgress" 
                @change="toggleProgress"
                class="toggle-input"
              >
              <span class="toggle-slider"></span>
              <span class="toggle-text">Afficher la progression</span>
            </label>
            <p class="toggle-description">Affiche une barre de progression quand disponible</p>
          </div>
        </div>
      </div>
      
      <!-- Préréglages -->
      <div class="preference-group">
        <label class="group-label">Préréglages</label>
        <div class="preset-buttons">
          <button 
            v-for="(preset, name) in presets"
            :key="name"
            class="preset-button"
            @click="applyPreset(name)"
          >
            {{ getPresetName(name) }}
          </button>
        </div>
      </div>
      
      <!-- Aperçu en temps réel -->
      <div class="preference-group">
        <label class="group-label">Aperçu</label>
        <div class="preview-container">
          <LoadingState
            v-if="loadingType !== 'skeleton'"
            :type="loadingType"
            size="medium"
            :title="showMessages ? 'Exemple de chargement...' : ''"
            :subtitle="showMessages ? 'Ceci est un aperçu' : ''"
            :show-message="showMessages"
            :show-progress="showProgress"
            :progress="showProgress ? 65 : null"
          />
          <SkeletonLoader
            v-else
            type="messages"
            :count="2"
            :animated="true"
          />
        </div>
      </div>
    </div>
    
    <div class="panel-footer">
      <button class="reset-button" @click="resetPreferences">
        Réinitialiser
      </button>
      <button class="save-button" @click="savePreferences">
        Sauvegarder
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLoadingPreferences } from '@/composables/useLoadingPreferences.js'
import LoadingState from '@/components/LoadingState.vue'
import SkeletonLoader from '@/components/SkeletonLoaderSimple.vue'

// Composable des préférences
const {
  loadingType,
  animationSpeed,
  showProgress,
  showMessages,
  setLoadingType,
  setAnimationSpeed,
  toggleProgress,
  toggleMessages,
  resetPreferences,
  savePreferences,
  applyPreset,
  presets
} = useLoadingPreferences()

// Configuration des types de chargement
const loadingTypes = [
  {
    value: 'skeleton',
    name: 'Skeleton',
    description: 'Aperçu de la structure du contenu'
  },
  {
    value: 'default',
    name: 'Spinner',
    description: 'Indicateur rotatif classique'
  },
  {
    value: 'dots',
    name: 'Points',
    description: 'Animation de points rebondissants'
  },
  {
    value: 'pulse',
    name: 'Pulsation',
    description: 'Effet de pulsation douce'
  },
  {
    value: 'bars',
    name: 'Barres',
    description: 'Barres animées verticales'
  }
]

// Configuration des vitesses
const animationSpeeds = [
  { value: 'slow', name: 'Lente' },
  { value: 'normal', name: 'Normale' },
  { value: 'fast', name: 'Rapide' }
]

// Méthodes pour l'aperçu
const getPreviewComponent = (type) => {
  return type === 'skeleton' ? SkeletonLoader : LoadingState
}

const getPreviewProps = (type) => {
  if (type === 'skeleton') {
    return {
      type: 'messages',
      count: 1,
      animated: true
    }
  }
  
  return {
    type: type,
    size: 'small',
    showMessage: false
  }
}

const getPresetName = (name) => {
  const names = {
    minimal: 'Minimal',
    detailed: 'Détaillé',
    modern: 'Moderne'
  }
  return names[name] || name
}
</script>

<style scoped>
.loading-preferences-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 600px;
  margin: 0 auto;
}

.panel-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.panel-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  font-family: 'League Spartan', sans-serif;
}

.panel-subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
  font-family: 'League Spartan', sans-serif;
}

.panel-content {
  padding: 24px;
}

.preference-group {
  margin-bottom: 32px;
}

.preference-group:last-child {
  margin-bottom: 0;
}

.group-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
  font-family: 'League Spartan', sans-serif;
}

/* Types de chargement */
.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.option-card {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.option-card:hover {
  border-color: #d1d5db;
  transform: translateY(-2px);
}

.option-card.active {
  border-color: #6366f1;
  background: #f8faff;
}

.option-preview {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.option-name {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
  font-family: 'League Spartan', sans-serif;
}

.option-description {
  font-size: 12px;
  color: #6b7280;
  font-family: 'League Spartan', sans-serif;
}

/* Vitesse d'animation */
.speed-selector {
  display: flex;
  gap: 16px;
}

.speed-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.speed-option:hover {
  border-color: #d1d5db;
}

.speed-option.active {
  border-color: #6366f1;
  background: #f8faff;
}

.speed-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #6366f1;
}

.speed-indicator.speed-slow {
  animation: pulse 2s infinite;
}

.speed-indicator.speed-normal {
  animation: pulse 1.5s infinite;
}

.speed-indicator.speed-fast {
  animation: pulse 0.8s infinite;
}

.speed-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  font-family: 'League Spartan', sans-serif;
}

/* Options toggle */
.toggle-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.toggle-option {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.toggle-input {
  display: none;
}

.toggle-slider {
  width: 44px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  position: relative;
  transition: background 0.2s ease;
}

.toggle-slider::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.toggle-input:checked + .toggle-slider {
  background: #6366f1;
}

.toggle-input:checked + .toggle-slider::after {
  transform: translateX(20px);
}

.toggle-text {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  font-family: 'League Spartan', sans-serif;
}

.toggle-description {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  margin-left: 56px;
  font-family: 'League Spartan', sans-serif;
}

/* Préréglages */
.preset-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.preset-button {
  padding: 10px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'League Spartan', sans-serif;
}

.preset-button:hover {
  border-color: #6366f1;
  color: #6366f1;
}

/* Aperçu */
.preview-container {
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  background: #f9fafb;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Footer */
.panel-footer {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.reset-button,
.save-button {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'League Spartan', sans-serif;
}

.reset-button {
  border: 2px solid #e5e7eb;
  background: white;
  color: #6b7280;
}

.reset-button:hover {
  border-color: #d1d5db;
  color: #374151;
}

.save-button {
  border: 2px solid #6366f1;
  background: #6366f1;
  color: white;
}

.save-button:hover {
  background: #5856eb;
  border-color: #5856eb;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .panel-content {
    padding: 16px;
  }
  
  .option-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .speed-selector {
    flex-direction: column;
  }
  
  .panel-footer {
    flex-direction: column;
  }
  
  .reset-button,
  .save-button {
    width: 100%;
  }
}
</style>
