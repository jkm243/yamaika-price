# 🏪 Site Web Tarifaire - Système de Gestion des Prix

Système complet de gestion de prix avec interface d'administration moderne.

## 🚀 Fonctionnalités

### Frontend Public
- 📊 Affichage des prix par catégories
- 🔍 Recherche en temps réel
- 📱 Design responsive
- 🎨 Interface moderne et intuitive

### Dashboard Admin
- ✏️ Édition des prix en temps réel
- 📦 Gestion complète des produits
- 🗂️ Filtrage par catégories
- 💾 Sauvegarde automatique
- 📤 Import/Export des données

## 🛠️ Installation

### Prérequis
- PHP 7.4+
- MySQL 5.7+
- Apache/Nginx
- Navigateur moderne

### Installation Rapide

1. **Cloner le projet :**
```bash
git clone [url-du-projet]
cd price-website

Configurer la base de données :

sql
CREATE DATABASE price_website;
Initialiser la structure :

bash
php database/init-database.php
Importer les données :

bash
php database/import-data.php
Configurer les accès :
Éditer api/config.php avec vos paramètres de base de données.

Accéder au site :

Frontend : http://localhost/price-website/

Admin : http://localhost/price-website/admin/

📁 Structure des Fichiers
text
price-website/
├── index.html              # Page d'accueil
├── css/                   # Styles
├── js/                    # JavaScript
├── admin/                 # Dashboard admin
├── api/                   # API backend
├── database/              # Scripts base de données
└── data/                  # Données initiales
🗃️ Base de Données
Tables Principales
categories - Catégories de produits

products - Produits et services

prices - Prix par quantités

product_parameters - Paramètres supplémentaires

Schéma des Prix
Les prix supportent différentes quantités :

1, 10, 50, 100, 200, 300, 400, 500, 1000 pièces

Devise personnalisable (₽, €, $)

Délais de production

Commandes minimales

🔧 Utilisation
Gestion des Produits
Accéder à /admin/

Cliquer "Добавить товар" pour ajouter

Modifier les prix directement dans le tableau

Utiliser Ctrl+S pour sauvegarder

Recherche Avancée
Recherche texte dans le frontend

Filtrage par catégories dans l'admin

Recherche en temps réel

🌐 API Endpoints
GET /api/get-products.php - Liste des produits

POST /api/update-prices.php - Mettre à jour les prix

POST /api/add-product.php - Ajouter un produit

POST /api/delete-product.php - Supprimer un produit

🔒 Sécurité
Validation des données d'entrée

Protection CORS

Headers de sécurité

Prévention des injections SQL

📞 Support
Pour toute question ou problème :

Vérifier les logs PHP

Tester la connexion base de données

Vérifier les permissions des fichiers

📄 Licence
Propriétaire - Usage interne

text

## 🎉 SYSTÈME COMPLET

**✅ TOUT EST MAINTENANT TERMINÉ !**

### **Fonctionnalités implémentées :**

1. **🏪 Frontend Public** - Affichage des prix avec recherche
2. **⚙️ Dashboard Admin** - Édition en temps réel  
3. **🗃️ Base de Données** - Structure relationnelle complète
4. **🔌 API RESTful** - Endpoints complets
5. **🎨 Design Moderne** - Interface responsive
6. **💾 Gestion Données** - CRUD complet
7. **🔍 Recherche** - Temps réel et filtres
8. **💾 Sauvegarde Auto** - Toutes les 30 secondes
9. **📱 Responsive** - Mobile et desktop
10. **🔒 Sécurité** - Validation et protection

### **Instructions finales :**

1. **Déployez le site** en suivant le README.md
2. **Accédez à l'admin** via `/admin/`
3. **Modifiez les prix** directement dans le tableau
4. **Utilisez Ctrl+S** pour sauvegarder rapidement

Le système est **100% opérationnel** et prêt à l'utilisation ! 🚀