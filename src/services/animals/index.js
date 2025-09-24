// Export centralisé de tous les services et hooks pour les animaux

// Services
export { animalService } from './animalService.js'
export { speciesService } from './speciesService.js'

// Hooks TanStack Query pour les animaux
export {
  useAnimals,
  useAnimal,
  useSearchAnimals,
  useAnimalsByOwner,
  useAnimalsBySpecies,
  useCreateAnimal,
  useUpdateAnimal,
  useDeleteAnimal,
  useUploadAnimalPhoto,
  useAnimalManagement,
  usePrefetchAnimal,
  ANIMAL_QUERY_KEYS
} from './animalQueries.js'

// Hooks TanStack Query pour les espèces et races
export {
  useSpecies,
  useSpeciesById,
  useRacesBySpecies,
  useRaces,
  useRace,
  SPECIES_QUERY_KEYS,
  RACE_QUERY_KEYS
} from './speciesQueries.js'

// Composables Vue
export {
  useAnimalsComposable,
  useAnimalDetails,
  useAnimalSearch,
  useOwnerAnimals,
  animalUtils
} from '@/composables/useAnimals.js'

// Types et constantes utiles
export const ANIMAL_GENDERS = {
  MALE: 'M',
  FEMALE: 'F'
}

export const ANIMAL_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DECEASED: 'deceased'
}

// Validation schemas (peut être étendu avec Yup ou Zod plus tard)
export const ANIMAL_VALIDATION_RULES = {
  nom: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  espece_id: {
    required: true,
    type: 'number'
  },
  sexe: {
    required: true,
    enum: ['M', 'F']
  },
  proprietaire_id: {
    required: true,
    type: 'number'
  },
  poids: {
    type: 'number',
    min: 0,
    max: 1000
  },
  date_naissance: {
    type: 'date',
    maxDate: new Date()
  }
}

// Configuration par défaut pour les requêtes d'animaux
export const DEFAULT_ANIMAL_QUERY_OPTIONS = {
  with_espece: true,
  with_race: true,
  with_proprietaire: true,
  per_page: 10
}

// Utilitaires d'export
export const animalServiceUtils = {
  /**
   * Créer les paramètres de requête par défaut
   * @param {Object} customParams - Paramètres personnalisés
   * @returns {Object} Paramètres de requête complets
   */
  createDefaultParams(customParams = {}) {
    return {
      ...DEFAULT_ANIMAL_QUERY_OPTIONS,
      ...customParams
    }
  },

  /**
   * Valider les données d'animal avant envoi
   * @param {Object} animalData - Données à valider
   * @returns {Object} Résultat de validation
   */
  validateAnimalData(animalData) {
    const errors = {}
    
    Object.keys(ANIMAL_VALIDATION_RULES).forEach(field => {
      const rules = ANIMAL_VALIDATION_RULES[field]
      const value = animalData[field]
      
      if (rules.required && (!value || value === '')) {
        errors[field] = `Le champ ${field} est requis`
        return
      }
      
      if (value && rules.minLength && value.length < rules.minLength) {
        errors[field] = `Le champ ${field} doit contenir au moins ${rules.minLength} caractères`
      }
      
      if (value && rules.maxLength && value.length > rules.maxLength) {
        errors[field] = `Le champ ${field} ne peut pas dépasser ${rules.maxLength} caractères`
      }
      
      if (value && rules.enum && !rules.enum.includes(value)) {
        errors[field] = `Le champ ${field} doit être l'une des valeurs: ${rules.enum.join(', ')}`
      }
      
      if (value && rules.type === 'number' && isNaN(Number(value))) {
        errors[field] = `Le champ ${field} doit être un nombre`
      }
      
      if (value && rules.min && Number(value) < rules.min) {
        errors[field] = `Le champ ${field} doit être supérieur ou égal à ${rules.min}`
      }
      
      if (value && rules.max && Number(value) > rules.max) {
        errors[field] = `Le champ ${field} doit être inférieur ou égal à ${rules.max}`
      }
    })
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  /**
   * Formater les données d'animal pour l'API
   * @param {Object} animalData - Données brutes
   * @returns {Object} Données formatées
   */
  formatAnimalData(animalData) {
    const formatted = { ...animalData }
    
    // Convertir les chaînes vides en null
    Object.keys(formatted).forEach(key => {
      if (formatted[key] === '') {
        formatted[key] = null
      }
    })
    
    // Convertir les booléens
    if (typeof formatted.sterilise === 'string') {
      formatted.sterilise = formatted.sterilise === 'true' || formatted.sterilise === '1'
    }
    
    // Convertir les nombres
    if (formatted.poids) {
      formatted.poids = Number(formatted.poids)
    }
    
    if (formatted.espece_id) {
      formatted.espece_id = Number(formatted.espece_id)
    }
    
    if (formatted.race_id) {
      formatted.race_id = Number(formatted.race_id)
    }
    
    if (formatted.proprietaire_id) {
      formatted.proprietaire_id = Number(formatted.proprietaire_id)
    }
    
    return formatted
  }
}
