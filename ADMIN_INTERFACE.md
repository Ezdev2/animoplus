# 🛡️ Interface d'Administration AnimoPlus

## Vue d'ensemble

L'interface d'administration AnimoPlus permet aux administrateurs de gérer les différents aspects de la plateforme. Elle est accessible uniquement aux utilisateurs avec le `user_type: "admin"`.

## 🚀 Accès à l'Interface Admin

### URLs disponibles :
- **Dashboard Admin** : `/admin`
- **Service Types** : `/admin/test/service-types`
- **Coopération Admin** : `/admin/coop-admin`

### Protection par rôle :
- Toutes les routes admin sont protégées par `meta: { requiresAuth: true, roles: ['admin'] }`
- Les utilisateurs non-admin sont redirigés vers `/access-denied`

## 🎯 Fonctionnalités

### 1. Dashboard Admin (`/admin`)
- **Statistiques générales** : Utilisateurs, annonces, signalements
- **Actions rapides** : Liens vers les principales sections
- **Activité récente** : Log des dernières actions

### 2. Service Types (`/admin/test/service-types`)
- **Gestion complète** des types de services
- **CRUD operations** : Créer, lire, modifier, supprimer
- **Filtrage et recherche** par nom, statut
- **Activation/désactivation** des service types

### 3. Coopération Admin (`/admin/coop-admin`)
- **Modération des annonces** d'animaux perdus/trouvés
- **Workflow de validation** : En attente → Approuvé/Rejeté → Résolu
- **Statistiques en temps réel** des annonces
- **Filtrage avancé** par statut, type, recherche

## 🎨 Design et UX

### Sidebar Admin
- **Couleur distinctive** : Rouge pour différencier de l'interface normale
- **Navigation intuitive** : Icônes et labels clairs
- **Retour au dashboard** : Lien rapide vers l'interface utilisateur normale

### Layout responsive
- **Mobile-friendly** : Adaptation automatique aux petits écrans
- **Grille flexible** : Statistiques et cartes adaptatives
- **Tableaux scrollables** : Gestion des grandes listes de données

## 🔧 Outils de Développement

### AdminTestHelper (Dev uniquement)
Un bouton flottant en bas à droite permet de :
- **Simuler différents rôles** : Admin, Vétérinaire, Client
- **Accès rapide** aux pages admin
- **Reset des permissions** pour revenir à l'état normal

### Page de test (`/test/admin-access`)
- **Vérification des permissions** en temps réel
- **Simulation de rôles** pour tester l'accès
- **Logs de navigation** pour débugger les problèmes

## 🛠️ Intégration Backend

### Endpoints requis :
```javascript
// Service Types
GET    /api/service-types          // Liste des service types
POST   /api/service-types          // Créer un service type
PUT    /api/service-types/:id      // Modifier un service type
DELETE /api/service-types/:id      // Supprimer un service type

// Coopération Admin
GET    /api/lost-animals           // Liste des annonces avec filtres
PUT    /api/lost-animals/:id/approve   // Approuver une annonce
PUT    /api/lost-animals/:id/reject    // Rejeter une annonce
PUT    /api/lost-animals/:id/resolve   // Marquer comme résolu

// Statistiques
GET    /api/admin/stats            // Statistiques générales
GET    /api/lost-animals/stats     // Statistiques coopération
```

### Authentification :
- Vérifier `user_type === 'admin'` côté backend
- Retourner 403 Forbidden si pas admin
- Middleware de protection sur toutes les routes admin

## 📱 Utilisation

### Pour les développeurs :
1. **Simuler un admin** : Utiliser le bouton flottant en dev
2. **Tester l'accès** : Aller sur `/test/admin-access`
3. **Naviguer** : Utiliser le sidebar rouge pour naviguer

### Pour les vrais admins :
1. **Se connecter** avec un compte admin
2. **Accéder via sidebar** : Cliquer sur "Administration"
3. **Ou URL directe** : Aller sur `/admin`

## 🔒 Sécurité

### Frontend :
- **Guard de route** : Vérification du rôle avant navigation
- **Affichage conditionnel** : Menu admin visible seulement aux admins
- **Redirection automatique** : Vers access-denied si pas autorisé

### Backend (à implémenter) :
- **Middleware d'authentification** sur toutes les routes admin
- **Vérification du user_type** dans la base de données
- **Logs d'audit** des actions administratives

## 🚧 TODO Backend

Les composants frontend sont prêts, il reste à implémenter côté backend :

1. **Routes API** pour les service types
2. **Endpoints de modération** pour les annonces
3. **Système de statistiques** en temps réel
4. **Middleware de protection** admin
5. **Logs d'audit** des actions admin

## 📞 Support

Pour toute question sur l'interface admin :
- Consulter les logs de navigation dans `/test/admin-access`
- Utiliser les outils de développement intégrés
- Vérifier les permissions dans la console du navigateur
