<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">Test Cloudinary Upload</h1>
        
        <!-- Zone d'upload -->
        <div class="mb-6">
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="mt-4">
              <label for="file-upload" class="cursor-pointer">
                <span class="mt-2 block text-sm font-medium text-gray-900">
                  Cliquez pour sélectionner une image
                </span>
                <input id="file-upload" name="file-upload" type="file" class="sr-only" 
                       accept="image/*" @change="handleFileSelect" :disabled="uploading">
              </label>
              <p class="mt-1 text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
            </div>
          </div>
        </div>

        <!-- Bouton d'upload -->
        <button 
          @click="uploadToCloudinary" 
          :disabled="!selectedFile || uploading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="uploading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Upload en cours...
          </span>
          <span v-else>Upload vers Cloudinary</span>
        </button>

        <!-- Fichier sélectionné -->
        <div v-if="selectedFile" class="mt-4 p-3 bg-gray-100 rounded-md">
          <p class="text-sm text-gray-700">
            <strong>Fichier:</strong> {{ selectedFile.name }}
          </p>
          <p class="text-sm text-gray-500">
            <strong>Taille:</strong> {{ formatFileSize(selectedFile.size) }}
          </p>
        </div>

        <!-- Messages d'erreur -->
        <div v-if="error" class="mt-4 p-3 bg-red-100 border border-red-300 rounded-md">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>

        <!-- Résultat de l'upload -->
        <div v-if="uploadResult" class="mt-6 p-4 bg-green-100 border border-green-300 rounded-md">
          <h3 class="text-lg font-medium text-green-800 mb-3">✅ Upload réussi!</h3>
          
          <!-- Image uploadée -->
          <div class="mb-4">
            <img :src="uploadResult.secure_url" :alt="uploadResult.original_filename" 
                 class="max-w-full h-auto rounded-md shadow-sm mx-auto" style="max-height: 200px;">
          </div>

          <!-- Informations de l'upload -->
          <div class="text-left space-y-2 text-sm">
            <div>
              <strong>URL:</strong> 
              <a :href="uploadResult.secure_url" target="_blank" 
                 class="text-blue-600 hover:text-blue-800 break-all">
                {{ uploadResult.secure_url }}
              </a>
            </div>
            <div><strong>Public ID:</strong> {{ uploadResult.public_id }}</div>
            <div><strong>Format:</strong> {{ uploadResult.format }}</div>
            <div><strong>Taille:</strong> {{ uploadResult.width }}x{{ uploadResult.height }}px</div>
            <div><strong>Taille fichier:</strong> {{ formatFileSize(uploadResult.bytes) }}</div>
          </div>

          <!-- Bouton copier URL -->
          <button 
            @click="copyToClipboard(uploadResult.secure_url)"
            class="mt-3 bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700 transition-colors"
          >
            📋 Copier l'URL
          </button>
        </div>

        <!-- Historique des uploads -->
        <div v-if="uploadHistory.length > 0" class="mt-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Historique des uploads</h3>
          <div class="space-y-2">
            <div v-for="(upload, index) in uploadHistory" :key="index" 
                 class="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span class="text-sm text-gray-700 truncate">{{ upload.original_filename }}</span>
              <a :href="upload.secure_url" target="_blank" 
                 class="text-blue-600 hover:text-blue-800 text-sm">Voir</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// État réactif
const selectedFile = ref(null)
const uploading = ref(false)
const error = ref('')
const uploadResult = ref(null)
const uploadHistory = ref([])

// Gestion de la sélection de fichier
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validation du fichier
  if (!file.type.startsWith('image/')) {
    error.value = 'Veuillez sélectionner une image valide'
    return
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB
    error.value = 'Le fichier est trop volumineux (max 10MB)'
    return
  }

  selectedFile.value = file
  error.value = ''
  uploadResult.value = null
}

// Upload vers Cloudinary
const uploadToCloudinary = async () => {
  if (!selectedFile.value) return

  uploading.value = true
  error.value = ''

  try {
    // Créer FormData pour l'upload
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

    // URL de l'API Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`

    console.log('🚀 Upload vers Cloudinary:', {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      fileName: selectedFile.value.name
    })

    // Appel API Cloudinary
    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Erreur lors de l\'upload')
    }

    const result = await response.json()
    console.log('✅ Upload réussi:', result)

    uploadResult.value = result
    uploadHistory.value.unshift(result)

    // Réinitialiser le formulaire
    selectedFile.value = null
    const fileInput = document.getElementById('file-upload')
    if (fileInput) fileInput.value = ''

  } catch (err) {
    console.error('❌ Erreur upload Cloudinary:', err)
    error.value = err.message || 'Erreur lors de l\'upload vers Cloudinary'
  } finally {
    uploading.value = false
  }
}

// Utilitaires
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('URL copiée dans le presse-papiers!')
  } catch (err) {
    console.error('Erreur copie:', err)
    // Fallback pour les navigateurs plus anciens
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('URL copiée dans le presse-papiers!')
  }
}
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
