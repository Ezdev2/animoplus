# 🐛 DEBUG - PROBLÈME CHARGEMENT RACES

## 🔍 **PROBLÈME IDENTIFIÉ**

### **URL Générée Incorrecte**
```
❌ URL actuelle: http://localhost:8000/api/especes/[object%20Object]/races
✅ URL attendue: http://localhost:8000/api/especes/9cbdb5ad-6c30-4557-be90-ecf5166a18c5/races
```

### **Cause Probable**
L'ID de l'espèce n'est pas correctement extrait ou est un objet au lieu d'une chaîne.

## 📊 **STRUCTURE DES DONNÉES**

### **Réponse API Espèces**
```json
{
  "success": true,
  "data": [
    {
      "id": "9cbdb5ad-6c30-4557-be90-ecf5166a18c5",  // ✅ UUID string
      "nom": "Chien",
      "nom_scientifique": "Canis lupus familiaris"
    }
  ]
}
```

### **Mapping Attendu**
```javascript
// Sélection utilisateur
formData.species = "Chien"

// Recherche dans la liste
const species = speciesList.find(s => s.nom === "Chien")
// species = { id: "9cbdb5ad-6c30-4557-be90-ecf5166a18c5", nom: "Chien", ... }

// Extraction ID
selectedSpeciesId = species.id
// selectedSpeciesId = "9cbdb5ad-6c30-4557-be90-ecf5166a18c5"
```

## 🔧 **CORRECTIONS APPORTÉES**

### **1. Hook useRacesBySpecies Amélioré**
```javascript
export function useRacesBySpecies(especeId, queryOptions = {}) {
  return useQuery({
    queryKey: computed(() => SPECIES_QUERY_KEYS.races(unref(especeId))),
    queryFn: () => {
      const id = unref(especeId)  // ✅ Extraction de la valeur réactive
      console.log('Fetching races for species ID:', id, typeof id)
      return speciesService.getRacesBySpecies(id)
    },
    enabled: computed(() => !!unref(especeId)),
    // ...
  })
}
```

### **2. Debug Amélioré dans AddAnimal.vue**
```javascript
// Debug pour l'ID sélectionné
watch(selectedSpeciesId, (newId) => {
  console.log('selectedSpeciesId changé:', newId, typeof newId)
})

// Debug pour les espèces
watch(() => formData.value.species, (newSpecies) => {
  console.log('Espèce changée:', newSpecies)
  console.log('Liste des espèces disponibles:', speciesList.value)
  console.log('ID calculé:', selectedSpeciesId.value)
})
```

## 🧪 **TESTS À EFFECTUER**

### **1. Vérifier le Chargement des Espèces**
1. Ouvrir le modal AddAnimal
2. Vérifier console : `Espèces chargées: [...]`
3. S'assurer que chaque espèce a un `id` de type string

### **2. Vérifier la Sélection d'Espèce**
1. Sélectionner "Chien" dans le dropdown
2. Vérifier console :
   ```
   Espèce changée: Chien
   Liste des espèces disponibles: [{id: "9cbdb5ad...", nom: "Chien"}, ...]
   ID calculé: 9cbdb5ad-6c30-4557-be90-ecf5166a18c5
   selectedSpeciesId changé: 9cbdb5ad-6c30-4557-be90-ecf5166a18c5 string
   ```

### **3. Vérifier l'Appel API Races**
1. Après sélection d'espèce
2. Vérifier console :
   ```
   Fetching races for species ID: 9cbdb5ad-6c30-4557-be90-ecf5166a18c5 string
   🚀 Requête API: {
     url: "/especes/9cbdb5ad-6c30-4557-be90-ecf5166a18c5/races",
     method: "GET"
   }
   ```

## 🚨 **POINTS DE VÉRIFICATION**

### **1. Configuration API**
- ✅ `baseURL`: `https://laravel-backend-4yxv.onrender.com/api`
- ✅ Endpoint races: `/especes/{id}/races`
- ✅ URL finale: `https://laravel-backend-4yxv.onrender.com/api/especes/{id}/races`

### **2. Types de Données**
- ✅ IDs espèces: UUID strings (pas de nombres)
- ✅ Extraction avec `unref()` pour les refs Vue
- ✅ Validation avec `typeof id` dans les logs

### **3. Réactivité Vue**
- ✅ `computed()` pour les queryKeys TanStack Query
- ✅ `unref()` pour extraire les valeurs des refs
- ✅ Watchers pour debug en temps réel

## 📋 **CHECKLIST DEBUG**

- [x] Hook `useRacesBySpecies` corrigé avec `unref()`
- [x] Debug logs ajoutés pour tracer l'ID
- [x] Watchers pour surveiller les changements
- [ ] **Test avec sélection d'espèce réelle**
- [ ] **Vérification URL générée dans Network tab**
- [ ] **Validation réponse API races**

## 🎯 **RÉSULTAT ATTENDU**

Après ces corrections, la sélection d'une espèce devrait :
1. ✅ Calculer correctement l'ID UUID
2. ✅ Générer l'URL correcte `/especes/{uuid}/races`
3. ✅ Charger les races correspondantes
4. ✅ Remplir le dropdown races

**Si le problème persiste, vérifier que l'API backend répond bien à l'endpoint `/especes/{id}/races`**
