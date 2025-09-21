// Service pour l'intégration Cloudinary
export const cloudinaryService = {
  // Configuration depuis les variables d'environnement
  getConfig() {
    return {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY, // Optionnel pour les uploads signés
    }
  },

  // Valider la configuration
  validateConfig() {
    const config = this.getConfig()
    
    if (!config.cloudName) {
      throw new Error('VITE_CLOUDINARY_CLOUD_NAME manquant dans .env')
    }
    
    if (!config.uploadPreset) {
      throw new Error('VITE_CLOUDINARY_UPLOAD_PRESET manquant dans .env')
    }
    
    return config
  },

  // Upload d'image vers Cloudinary
  async uploadImage(file, options = {}) {
    try {
      const config = this.validateConfig()
      
      // Validation du fichier
      if (!file) {
        throw new Error('Aucun fichier fourni')
      }
      
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image')
      }
      
      const maxSize = options.maxSize || 10 * 1024 * 1024 // 10MB par défaut
      if (file.size > maxSize) {
        throw new Error(`Le fichier est trop volumineux (max ${Math.round(maxSize / 1024 / 1024)}MB)`)
      }

      // Préparer FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', config.uploadPreset)
      
      // Options additionnelles
      if (options.folder) {
        formData.append('folder', options.folder)
      }
      
      if (options.publicId) {
        formData.append('public_id', options.publicId)
      }
      
      if (options.tags) {
        formData.append('tags', Array.isArray(options.tags) ? options.tags.join(',') : options.tags)
      }

      // URL de l'API Cloudinary
      const uploadUrl = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`
      
      console.log('🚀 Upload vers Cloudinary:', {
        cloudName: config.cloudName,
        uploadPreset: config.uploadPreset,
        fileName: file.name,
        fileSize: file.size,
        options
      })

      // Appel API
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || `Erreur HTTP ${response.status}`)
      }

      const result = await response.json()
      
      console.log('✅ Upload Cloudinary réussi:', {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        size: `${result.width}x${result.height}`,
        bytes: result.bytes
      })

      return {
        success: true,
        data: result
      }

    } catch (error) {
      console.error('❌ Erreur upload Cloudinary:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Upload multiple d'images
  async uploadMultipleImages(files, options = {}) {
    try {
      const results = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileOptions = {
          ...options,
          publicId: options.publicId ? `${options.publicId}_${i + 1}` : undefined
        }
        
        const result = await this.uploadImage(file, fileOptions)
        results.push(result)
      }
      
      return {
        success: true,
        data: results
      }
      
    } catch (error) {
      console.error('❌ Erreur upload multiple Cloudinary:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Générer une URL de transformation
  generateTransformUrl(publicId, transformations = {}) {
    const config = this.getConfig()
    
    if (!config.cloudName || !publicId) {
      return null
    }
    
    let transformString = ''
    
    // Construire la chaîne de transformation
    const transforms = []
    
    if (transformations.width) transforms.push(`w_${transformations.width}`)
    if (transformations.height) transforms.push(`h_${transformations.height}`)
    if (transformations.crop) transforms.push(`c_${transformations.crop}`)
    if (transformations.quality) transforms.push(`q_${transformations.quality}`)
    if (transformations.format) transforms.push(`f_${transformations.format}`)
    
    if (transforms.length > 0) {
      transformString = transforms.join(',') + '/'
    }
    
    return `https://res.cloudinary.com/${config.cloudName}/image/upload/${transformString}${publicId}`
  },

  // Supprimer une image (nécessite API Key et signature)
  async deleteImage(publicId) {
    try {
      const config = this.getConfig()
      
      if (!config.apiKey) {
        throw new Error('API Key Cloudinary requise pour la suppression')
      }
      
      // Note: La suppression nécessite une signature côté serveur
      // Cette méthode est un placeholder pour une implémentation future
      console.warn('⚠️ Suppression Cloudinary non implémentée (nécessite signature serveur)')
      
      return {
        success: false,
        error: 'Suppression non implémentée (nécessite signature serveur)'
      }
      
    } catch (error) {
      console.error('❌ Erreur suppression Cloudinary:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Utilitaires
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // Valider un fichier image
  validateImageFile(file, options = {}) {
    const errors = []
    
    if (!file) {
      errors.push('Aucun fichier fourni')
      return errors
    }
    
    if (!file.type.startsWith('image/')) {
      errors.push('Le fichier doit être une image')
    }
    
    const maxSize = options.maxSize || 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      errors.push(`Fichier trop volumineux (max ${Math.round(maxSize / 1024 / 1024)}MB)`)
    }
    
    const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`)
    }
    
    return errors
  }
}

export default cloudinaryService
