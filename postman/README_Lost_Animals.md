# 📋 Guide d'utilisation - Collection Lost Animals (Coopération)

## 🎯 Vue d'ensemble

Cette collection Postman permet de tester complètement le module **Coopération** d'AnimoPlus pour la gestion des animaux perdus/trouvés.

## 📦 Contenu de la collection

### 1. **📋 CRUD Operations**
- ✅ Liste des annonces avec filtres avancés
- ✅ Création d'annonces (perdus/trouvés)
- ✅ Détail d'une annonce
- ✅ Modification d'annonce
- ✅ Suppression d'annonce

### 2. **🔍 Recherche et Filtres**
- ✅ Recherche géographique avec rayon
- ✅ Filtrage par type (lost/found)
- ✅ Filtrage par type d'animal
- ✅ Recherche textuelle

### 3. **📸 Gestion des Photos**
- ✅ Ajouter des photos (URLs Cloudinary)
- ✅ Supprimer une photo
- ✅ Définir photo principale

### 4. **⚡ Actions Spéciales**
- ✅ Marquer comme résolu
- ✅ Partage social (à venir)

### 5. **👨‍⚕️ Modération (Vétérinaires)**
- ✅ Approuver une annonce
- ✅ Rejeter une annonce
- ✅ Liste des annonces en attente

### 6. **❌ Tests d'Erreurs**
- ✅ Validation des champs
- ✅ Authentification
- ✅ Autorisations
- ✅ Ressources non trouvées

## 🚀 Configuration

### Étape 1: Importer les fichiers
1. Importer `Lost_Animals_Collection.postman_collection.json`
2. Importer `Lost_Animals_Environment.postman_environment.json`

### Étape 2: Configurer l'environnement
1. Sélectionner l'environnement "AnimoPlus - Lost Animals Environment"
2. Modifier les variables si nécessaire :
   - `base_url` : URL de votre API (défaut: http://localhost:8000)
   - `user_email` / `user_password` : Identifiants utilisateur
   - `vet_email` / `vet_password` : Identifiants vétérinaire

### Étape 3: Authentification
1. Utiliser la collection "User Management" pour :
   - Créer des comptes (register)
   - Se connecter (login)
   - Récupérer les tokens JWT

2. Copier les tokens dans les variables :
   - `access_token` : Token utilisateur standard
   - `vet_access_token` : Token vétérinaire
   - `client_access_token` : Token client

## 📋 Ordre de test recommandé

### Phase 1: Tests de base
1. **Liste des annonces** (sans auth)
2. **Créer une annonce** (animal perdu)
3. **Créer une annonce** (animal trouvé)
4. **Détail d'une annonce**
5. **Modifier une annonce**

### Phase 2: Recherche et filtres
1. **Recherche géographique**
2. **Filtrer par type**
3. **Recherche textuelle**

### Phase 3: Actions spéciales
1. **Marquer comme résolu**
2. **Tests de modération** (avec token vétérinaire)

### Phase 4: Tests d'erreurs
1. **Validation des champs**
2. **Tests d'authentification**
3. **Tests d'autorisation**

## 🧪 Variables automatiques

La collection génère automatiquement :
- `lost_animal_id` : ID de l'annonce d'animal perdu créée
- `found_animal_id` : ID de l'annonce d'animal trouvé créée

Ces variables sont utilisées dans les tests suivants.

## 📊 Tests automatisés

Chaque requête inclut des tests automatisés qui vérifient :
- ✅ Status codes corrects
- ✅ Structure des réponses
- ✅ Données retournées
- ✅ Logique métier

## 🔧 Paramètres de recherche

### Recherche géographique
```
latitude: 48.8566 (Paris)
longitude: 2.3522 (Paris)
radius: 5 (km)
```

### Filtres disponibles
- `type`: all, lost, found
- `animal_type`: chien, chat, oiseau, lapin, autre
- `search`: terme de recherche textuelle
- `per_page`: nombre d'éléments par page (1-100)

## 🚨 Prérequis

1. **Serveur Laravel** démarré (`php artisan serve`)
2. **Base de données** migrée avec les tables lost_animals
3. **Utilisateurs créés** (standard + vétérinaire)
4. **Tokens JWT** valides dans l'environnement

## 📝 Notes importantes

- Les annonces nécessitent une **modération** (status: pending → approved)
- Seuls les **vétérinaires** peuvent modérer
- Les **propriétaires** peuvent modifier/supprimer leurs annonces
- La **géolocalisation** est optionnelle mais recommandée

## 🐛 Dépannage

### Erreur 401 (Unauthorized)
- Vérifier que `access_token` est défini
- Vérifier que le token n'est pas expiré
- Se reconnecter si nécessaire

### Erreur 422 (Validation)
- Vérifier les champs obligatoires
- Consulter les messages d'erreur détaillés
- Respecter les formats (email, téléphone, etc.)

### Erreur 403 (Forbidden)
- Vérifier les permissions utilisateur
- Utiliser un token vétérinaire pour la modération
- Vérifier la propriété de l'annonce

## 🎯 Résultats attendus

Après exécution complète :
- ✅ 2 annonces créées (1 perdue, 1 trouvée)
- ✅ 1 annonce approuvée par vétérinaire
- ✅ 1 annonce marquée comme résolue
- ✅ Tous les tests automatisés passent

---

**Bonne utilisation de la collection Lost Animals ! 🐕🐱**
