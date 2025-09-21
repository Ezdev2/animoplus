# Configuration Cloudinary pour AnimoPlus

## 📋 Variables d'environnement requises

Ajoutez ces variables dans votre fichier `.env` :

```env
# Configuration Cloudinary (OBLIGATOIRE)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here

# Optionnel (pour les uploads signés)
VITE_CLOUDINARY_API_KEY=your_api_key_here
```

## 🚀 Configuration étape par étape

### 1. Créer un compte Cloudinary
- Allez sur [https://cloudinary.com](https://cloudinary.com)
- Créez un compte gratuit
- Accédez à votre dashboard

### 2. Récupérer le Cloud Name
- Dans le dashboard, copiez votre **Cloud name**
- Ajoutez-le dans `.env` : `VITE_CLOUDINARY_CLOUD_NAME=votre_cloud_name`

### 3. Créer un Upload Preset
- Allez dans **Settings** > **Upload** > **Upload presets**
- Cliquez sur **Add upload preset**
- Configuration recommandée :
  ```
  Preset name: animoplus_unsigned
  Signing Mode: Unsigned
  Folder: animoplus
  Resource type: Image
  Access mode: Public
  ```
- Sauvegardez et copiez le nom du preset
- Ajoutez-le dans `.env` : `VITE_CLOUDINARY_UPLOAD_PRESET=animoplus_unsigned`

### 4. Configuration avancée (optionnel)
Pour les uploads signés, récupérez votre **API Key** :
- Dans **Settings** > **Security** > **Access Keys**
- Copiez l'**API Key**
- Ajoutez-le dans `.env` : `VITE_CLOUDINARY_API_KEY=votre_api_key`

## 🧪 Test de l'intégration

### Page de test
Accédez à `/test/cloudinary` pour tester l'upload :
- Interface simple avec drag & drop
- Validation des fichiers
- Affichage des résultats
- Historique des uploads

### Tests en console
```javascript
// Tester la configuration
import { cloudinaryService } from '@/services/cloudinary/cloudinaryService.js'
console.log(cloudinaryService.getConfig())

// Valider un fichier
const errors = cloudinaryService.validateImageFile(file)
console.log(errors)
```

## 📁 Structure des dossiers Cloudinary

```
animoplus/
├── avatars/          # Photos de profil utilisateurs
├── animals/          # Photos d'animaux
├── documents/        # Documents médicaux
└── temp/            # Uploads temporaires
```

## 🔧 Utilisation dans les composants

### Upload simple
```javascript
import { cloudinaryService } from '@/services/cloudinary/cloudinaryService.js'

const uploadImage = async (file) => {
  const result = await cloudinaryService.uploadImage(file, {
    folder: 'animoplus/avatars',
    tags: ['avatar', 'profile']
  })
  
  if (result.success) {
    console.log('URL:', result.data.secure_url)
  }
}
```

### Upload avec transformations
```javascript
// Générer une URL avec transformations
const thumbnailUrl = cloudinaryService.generateTransformUrl(publicId, {
  width: 150,
  height: 150,
  crop: 'fill',
  quality: 'auto'
})
```

## 🛡️ Sécurité

### Upload Preset sécurisé
Pour la production, configurez des restrictions :
- **Allowed formats** : jpg, png, gif, webp
- **Max file size** : 10MB
- **Max image dimensions** : 2048x2048
- **Auto tagging** : Activé

### Validation côté client
Le service inclut une validation automatique :
- Type de fichier (images uniquement)
- Taille maximale configurable
- Formats autorisés

## 📊 Monitoring

### Logs de debug
Tous les uploads sont loggés avec :
- Nom du fichier
- Taille
- URL résultante
- Temps d'upload

### Gestion d'erreurs
Erreurs communes et solutions :
- **Upload preset not found** : Vérifiez `VITE_CLOUDINARY_UPLOAD_PRESET`
- **Invalid cloud name** : Vérifiez `VITE_CLOUDINARY_CLOUD_NAME`
- **File too large** : Réduisez la taille ou augmentez la limite

## 🔗 Liens utiles

- [Documentation Cloudinary](https://cloudinary.com/documentation)
- [Upload API Reference](https://cloudinary.com/documentation/image_upload_api_reference)
- [Transformation Reference](https://cloudinary.com/documentation/image_transformation_reference)
- [Vue.js Integration](https://cloudinary.com/documentation/vue_integration)
