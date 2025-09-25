# 📋 MAPPING - CHAMPS FORMULAIRE vs MODÈLE LARAVEL

## 🎯 **ANALYSE DE CORRESPONDANCE**

### **📝 Champs Fillable du Modèle Laravel**
```php
protected $fillable = [
    'service_id',           // ✅ MAPPÉ
    'user_id',             // ✅ MAPPÉ (client_id → user_id)
    'animal_id',           // ⚠️  À IMPLÉMENTER
    'specialized_service_id', // ⚠️  À IMPLÉMENTER
    'date',                // ✅ MAPPÉ
    'start_time',          // ✅ MAPPÉ
    'end_time',            // ✅ MAPPÉ
    'message',             // ✅ MAPPÉ (notes → message)
    'status',              // ✅ MAPPÉ (défaut: 'pending')
    'comment',             // ⚠️  PAS DANS LE FORMULAIRE
    'assign_specialist_id', // ⚠️  À IMPLÉMENTER
    'confirmation_token'    // ✅ GÉRÉ CÔTÉ SERVEUR
];
```

## 🔄 **CORRECTIONS APPORTÉES**

### **1. Mapping Corrigé dans submitAppointment**

**Avant (incorrect) :**
```javascript
const appointmentData = {
  client_id: auth.getCurrentUser.value?.id,  // ❌ Incorrect
  notes: form.value.notes,                   // ❌ Incorrect
  animal_type: form.value.animalType,        // ❌ Pas dans fillable
  // ... autres champs non mappés
}
```

**Après (correct) :**
```javascript
const appointmentData = {
  // Champs obligatoires du modèle Laravel
  service_id: form.value.selectedService?.id || null,
  user_id: auth.getCurrentUser.value?.id || null,     // ✅ client_id → user_id
  animal_id: null,                                    // ⚠️ À implémenter
  specialized_service_id: null,                       // ⚠️ À implémenter
  date: form.value.date,
  start_time: form.value.startTime,
  end_time: form.value.endTime,
  message: form.value.notes || null,                  // ✅ notes → message
  status: 'pending',
  comment: null,                                      // ⚠️ Pas dans formulaire
  assign_specialist_id: null,                         // ⚠️ À implémenter
  confirmation_token: null,                           // ✅ Géré côté serveur
  
  // Champs supplémentaires pour compatibilité
  animal_type: form.value.animalType,
  location_type: form.value.locationType,
  address: form.value.address,
  online_meeting_url: form.value.meetLink
}
```

## 📊 **TABLEAU DE CORRESPONDANCE**

| **Champ Laravel** | **Champ Formulaire** | **Statut** | **Action Requise** |
|-------------------|---------------------|------------|-------------------|
| `service_id` | `form.selectedService?.id` | ✅ **Mappé** | Aucune |
| `user_id` | `auth.getCurrentUser?.id` | ✅ **Mappé** | Aucune |
| `animal_id` | - | ⚠️ **Manquant** | **Ajouter sélection animal** |
| `specialized_service_id` | - | ⚠️ **Manquant** | Optionnel |
| `date` | `form.date` | ✅ **Mappé** | Aucune |
| `start_time` | `form.startTime` | ✅ **Mappé** | Aucune |
| `end_time` | `form.endTime` | ✅ **Mappé** | Aucune |
| `message` | `form.notes` | ✅ **Mappé** | Aucune |
| `status` | `'pending'` (défaut) | ✅ **Mappé** | Aucune |
| `comment` | - | ⚠️ **Manquant** | **Ajouter champ commentaire** |
| `assign_specialist_id` | - | ⚠️ **Manquant** | Optionnel |
| `confirmation_token` | - | ✅ **Serveur** | Géré automatiquement |

## 🚨 **CHAMPS MANQUANTS CRITIQUES**

### **1. animal_id (IMPORTANT)**

**Problème :** Le formulaire utilise `animal_type` (string) mais le modèle attend `animal_id` (foreign key).

**Solutions possibles :**

**Option A : Ajouter sélection d'animal existant**
```vue
<!-- Dans le formulaire -->
<div class="form-group">
  <label>Animal concerné</label>
  <select v-model="form.selectedAnimal">
    <option value="">Sélectionnez un animal</option>
    <option v-for="animal in userAnimals" :key="animal.id" :value="animal">
      {{ animal.name }} ({{ animal.species }})
    </option>
  </select>
</div>
```

**Option B : Créer animal à la volée**
```javascript
// Si pas d'animal sélectionné, créer un animal temporaire
if (!form.value.selectedAnimal && form.value.animalType) {
  // Appel API pour créer un animal
  const newAnimal = await createAnimal({
    species: form.value.animalType,
    name: form.value.animalName || 'Animal sans nom',
    owner_id: auth.getCurrentUser.value?.id
  })
  appointmentData.animal_id = newAnimal.id
}
```

### **2. comment (OPTIONNEL)**

**Ajouter un champ commentaire dans le formulaire :**
```vue
<div class="form-group">
  <label>Commentaire du professionnel (optionnel)</label>
  <textarea 
    v-model="form.comment" 
    placeholder="Commentaire interne..."
    class="form-textarea"
  ></textarea>
</div>
```

## 🔧 **AMÉLIORATIONS RECOMMANDÉES**

### **1. Validation Côté Client**

**Ajouter validation pour les champs obligatoires :**
```javascript
const isFormValid = computed(() => {
  return (
    form.value.date &&
    form.value.startTime &&
    form.value.endTime &&
    form.value.selectedService?.id &&  // service_id obligatoire
    (form.value.selectedAnimal?.id || form.value.animalType) && // animal requis
    auth.getCurrentUser.value?.id &&   // user_id obligatoire
    calculatedDuration.value > 0
  )
})
```

### **2. Gestion des Animaux**

**Ajouter composable pour gérer les animaux :**
```javascript
// Dans le composant
import { useAnimals } from '@/composables/useAnimals.js'

const { animals: userAnimals, createAnimal } = useAnimals()

// Charger les animaux de l'utilisateur
onMounted(async () => {
  if (auth.getCurrentUser.value?.id) {
    await loadUserAnimals(auth.getCurrentUser.value.id)
  }
})
```

### **3. Services Spécialisés**

**Si nécessaire, ajouter sélection de service spécialisé :**
```vue
<div v-if="form.selectedService?.hasSpecializations" class="form-group">
  <label>Service spécialisé</label>
  <select v-model="form.specializedService">
    <option value="">Service général</option>
    <option 
      v-for="spec in form.selectedService.specializations" 
      :key="spec.id" 
      :value="spec"
    >
      {{ spec.name }} (+{{ spec.price }}€)
    </option>
  </select>
</div>
```

## 🧪 **PLAN DE MISE À JOUR**

### **Phase 1 : Corrections Immédiates (FAIT)**
- ✅ Mapping `client_id` → `user_id`
- ✅ Mapping `notes` → `message`
- ✅ Ajout de tous les champs fillable
- ✅ Gestion des champs null

### **Phase 2 : Gestion des Animaux (À FAIRE)**
- [ ] Créer composable `useAnimals`
- [ ] Ajouter sélection d'animal dans le formulaire
- [ ] Gérer création d'animal à la volée
- [ ] Mettre à jour validation

### **Phase 3 : Améliorations (OPTIONNEL)**
- [ ] Ajouter champ commentaire
- [ ] Gérer services spécialisés
- [ ] Ajouter assignation de spécialiste
- [ ] Améliorer validation

## ✅ **ÉTAT ACTUEL**

**Le formulaire est maintenant compatible avec le modèle Laravel :**

### **Champs Correctement Mappés (8/12)**
- ✅ `service_id` : ID du service sélectionné
- ✅ `user_id` : ID de l'utilisateur connecté
- ✅ `date` : Date du rendez-vous
- ✅ `start_time` : Heure de début
- ✅ `end_time` : Heure de fin
- ✅ `message` : Notes du formulaire
- ✅ `status` : 'pending' par défaut
- ✅ `confirmation_token` : null (géré serveur)

### **Champs À Implémenter (4/12)**
- ⚠️ `animal_id` : **CRITIQUE** - Nécessite sélection d'animal
- ⚠️ `comment` : Optionnel - Champ commentaire
- ⚠️ `specialized_service_id` : Optionnel - Services spécialisés
- ⚠️ `assign_specialist_id` : Optionnel - Assignation spécialiste

**Le formulaire peut maintenant créer des rendez-vous, mais il faudra implémenter la gestion des animaux pour une fonctionnalité complète.** 📅✨

**Souhaitez-vous que j'implémente la gestion des animaux (animal_id) en priorité ?**
