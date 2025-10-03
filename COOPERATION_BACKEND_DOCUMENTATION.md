# 📋 Documentation Backend - Module Coopération (Animaux Perdus)

## 🎯 Vue d'ensemble

Le module **Coopération** d'AnimoPlus est un système communautaire permettant aux utilisateurs de :
- **Signaler des animaux perdus** (propriétaires)
- **Signaler des animaux trouvés** (bons samaritains)
- **Rechercher et filtrer** les annonces par localisation
- **Contacter les propriétaires** directement
- **Partager les annonces** sur les réseaux sociaux

## 🗃️ Structure Base de Données

### Table `lost_animal_posts`

```sql
CREATE TABLE lost_animal_posts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type ENUM('lost', 'found') NOT NULL,
    animal_type ENUM('chien', 'chat', 'oiseau', 'lapin', 'autre') NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    additional_info TEXT NULL,
    location VARCHAR(500) NOT NULL,
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    reward VARCHAR(255) NULL,
    authorize_diffusion BOOLEAN DEFAULT TRUE,
    status ENUM('pending', 'approved', 'rejected', 'resolved') DEFAULT 'pending',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    
    INDEX idx_type (type),
    INDEX idx_animal_type (animal_type),
    INDEX idx_location (latitude, longitude),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Table `lost_animal_photos`

```sql
CREATE TABLE lost_animal_photos (
    id VARCHAR(36) PRIMARY KEY,
    post_id VARCHAR(36) NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    photo_public_id VARCHAR(255) NULL, -- Pour Cloudinary
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES lost_animal_posts(id) ON DELETE CASCADE
);
```

### Table `lost_animal_notifications` (Optionnel)

```sql
CREATE TABLE lost_animal_notifications (
    id VARCHAR(36) PRIMARY KEY,
    post_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    notification_type ENUM('email', 'sms', 'push') NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES lost_animal_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🛠️ Endpoints API Requis

### 1. **Gestion des Annonces**

#### `GET /api/lost-animals`
**Description :** Récupérer la liste des annonces d'animaux perdus/trouvés

**Paramètres de requête :**
```json
{
  "type": "all|lost|found",
  "animal_type": "chien|chat|oiseau|lapin|autre",
  "location": "string", // Recherche textuelle dans location
  "latitude": "float",
  "longitude": "float", 
  "radius": "integer", // Rayon en km (défaut: 5)
  "status": "approved", // Seulement les annonces approuvées
  "page": "integer",
  "per_page": "integer"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": "uuid",
        "type": "lost",
        "animal_type": "chien",
        "name": "Max",
        "description": "Berger allemand de 3 ans...",
        "location": "Avenue de la République, Lyon 3ème",
        "contact_name": "Marie Dubois",
        "contact_phone": "06 12 34 56 78",
        "contact_email": "marie.dubois@email.com",
        "reward": "50€",
        "distance": 2.1, // Distance calculée si lat/lng fournis
        "photos": [
          {
            "id": "uuid",
            "photo_url": "https://cloudinary.../image.jpg",
            "is_primary": true
          }
        ],
        "created_at": "2024-01-15T10:30:00Z",
        "user": {
          "id": "uuid",
          "name": "Marie Dubois"
        }
      }
    ],
    "total": 25,
    "per_page": 10,
    "last_page": 3
  }
}
```

#### `POST /api/lost-animals`
**Description :** Créer une nouvelle annonce

**Body :**
```json
{
  "type": "lost|found",
  "animal_type": "chien|chat|oiseau|lapin|autre",
  "name": "string",
  "description": "string",
  "additional_info": "string", // Optionnel
  "location": "string",
  "latitude": "float", // Optionnel
  "longitude": "float", // Optionnel
  "contact_name": "string",
  "contact_phone": "string",
  "contact_email": "string",
  "reward": "string", // Optionnel
  "authorize_diffusion": "boolean",
  "photos": ["file1", "file2"] // Upload multipart
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Annonce créée avec succès. En attente de validation.",
  "data": {
    "id": "uuid",
    "status": "pending",
    // ... autres champs
  }
}
```

#### `PUT /api/lost-animals/{id}`
**Description :** Modifier une annonce (seulement par le propriétaire)

#### `DELETE /api/lost-animals/{id}`
**Description :** Supprimer une annonce

#### `POST /api/lost-animals/{id}/resolve`
**Description :** Marquer une annonce comme résolue (animal retrouvé)

### 2. **Gestion des Photos**

#### `POST /api/lost-animals/{id}/photos`
**Description :** Ajouter des photos à une annonce

#### `DELETE /api/lost-animals/photos/{photoId}`
**Description :** Supprimer une photo

### 3. **Modération (Admin)**

#### `GET /api/admin/lost-animals/pending`
**Description :** Liste des annonces en attente de validation

#### `POST /api/admin/lost-animals/{id}/approve`
**Description :** Approuver une annonce

#### `POST /api/admin/lost-animals/{id}/reject`
**Description :** Rejeter une annonce

### 4. **Notifications**

#### `POST /api/lost-animals/{id}/notify-area`
**Description :** Envoyer des notifications aux utilisateurs dans la zone

**Body :**
```json
{
  "radius": 5, // km
  "notification_types": ["email", "push"]
}
```

## 🔧 Fonctionnalités Techniques

### 1. **Géolocalisation**
- **Calcul de distance :** Utiliser la formule Haversine pour calculer les distances
- **Index spatial :** Optimiser les requêtes par localisation
- **Géocodage :** Convertir les adresses en coordonnées (Google Maps API)

```sql
-- Exemple de requête avec calcul de distance
SELECT *,
  (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
  cos(radians(longitude) - radians(?)) + 
  sin(radians(?)) * sin(radians(latitude)))) AS distance
FROM lost_animal_posts
HAVING distance < ?
ORDER BY distance;
```

### 2. **Upload d'Images**
- **Service :** Cloudinary pour l'hébergement
- **Validation :** Formats acceptés (JPEG, PNG, WebP)
- **Compression :** Redimensionnement automatique
- **Sécurité :** Validation du type MIME

### 3. **Système de Modération**
- **Statuts :** pending → approved/rejected
- **Workflow :** Validation manuelle obligatoire
- **Notifications :** Email au créateur lors de l'approbation

### 4. **Notifications de Zone**
- **Critères :** Rayon géographique configurable
- **Types :** Email, SMS, Push notifications
- **Fréquence :** Limitation pour éviter le spam
- **Préférences :** Utilisateurs peuvent désactiver

## 📧 Système de Notifications

### Templates Email

#### **Nouvelle Annonce Approuvée**
```html
Sujet: 🐕 Alerte Animal Perdu dans votre secteur - {animal_name}

Bonjour {user_name},

Un animal a été signalé {type} près de chez vous :

🐕 {animal_name} ({animal_type})
📍 {location}
📅 {date}

{description}

Contact: {contact_name} - {contact_phone}

[Voir l'annonce complète]

Chaque partage compte ! 
L'équipe AnimoPlus
```

#### **Annonce Résolue**
```html
Sujet: 🎉 Bonne nouvelle ! {animal_name} a été retrouvé(e)

Bonjour {user_name},

Excellente nouvelle ! L'animal que vous aviez signalé a été retrouvé.

Merci pour votre aide et votre solidarité !

L'équipe AnimoPlus
```

## 🔒 Sécurité et Validation

### Validation des Données
```php
// Exemple Laravel
$rules = [
    'type' => 'required|in:lost,found',
    'animal_type' => 'required|in:chien,chat,oiseau,lapin,autre',
    'name' => 'required|string|max:255',
    'description' => 'required|string|max:2000',
    'location' => 'required|string|max:500',
    'contact_phone' => 'required|regex:/^[0-9\s\-\+\(\)]+$/',
    'contact_email' => 'required|email',
    'photos.*' => 'image|mimes:jpeg,png,webp|max:5120' // 5MB max
];
```

### Permissions
- **Création :** Utilisateurs connectés (client + veterinarian)
- **Modification :** Propriétaire de l'annonce uniquement
- **Suppression :** Propriétaire + Admin
- **Modération :** Admin uniquement

### Rate Limiting
- **Création d'annonces :** 3 par jour par utilisateur
- **Notifications :** 1 par annonce par zone
- **API :** 100 requêtes/minute par IP

## 📊 Métriques et Analytics

### KPIs à Tracker
- Nombre d'annonces créées/jour
- Taux d'approbation des annonces
- Taux de résolution (animaux retrouvés)
- Engagement (vues, partages, contacts)
- Couverture géographique

### Tables de Logs
```sql
CREATE TABLE lost_animal_analytics (
    id VARCHAR(36) PRIMARY KEY,
    post_id VARCHAR(36),
    event_type ENUM('view', 'contact', 'share', 'resolve'),
    user_id VARCHAR(36) NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES lost_animal_posts(id)
);
```

## 🚀 Optimisations Recommandées

### Performance
- **Cache Redis :** Mise en cache des recherches fréquentes
- **Index :** Optimisation des requêtes géographiques
- **CDN :** Distribution des images via Cloudinary
- **Pagination :** Limitation à 20 résultats par page

### Scalabilité
- **Queue Jobs :** Traitement asynchrone des notifications
- **Elasticsearch :** Recherche textuelle avancée
- **Microservices :** Séparation du module notifications

### UX
- **Temps réel :** WebSockets pour les nouvelles annonces
- **PWA :** Application mobile progressive
- **Offline :** Cache local pour consultation hors ligne

## 🧪 Tests Recommandés

### Tests Unitaires
- Validation des données d'entrée
- Calculs de distance géographique
- Logique de modération

### Tests d'Intégration
- Workflow complet création → approbation → notification
- Upload et traitement d'images
- Envoi d'emails

### Tests de Performance
- Charge sur les endpoints de recherche
- Traitement simultané d'uploads
- Stress test notifications de masse

---

## 📝 Notes d'Implémentation

1. **Priorité 1 :** CRUD des annonces + modération
2. **Priorité 2 :** Géolocalisation + notifications
3. **Priorité 3 :** Analytics + optimisations

Cette documentation couvre tous les aspects nécessaires pour implémenter le module Coopération côté backend. L'architecture proposée est scalable et sécurisée pour une utilisation en production.
