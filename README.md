# 🎮 TLG Website - The Legion E-sport

Site web officiel de **The Legion**, organisation e-sport française. Construit avec SolidJS et PocketBase pour offrir une expérience moderne et performante.

[![SolidJS](https://img.shields.io/badge/SolidJS-2C4F7C?style=for-the-badge&logo=solid&logoColor=white)](https://www.solidjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PocketBase](https://img.shields.io/badge/PocketBase-B8DBE4?style=for-the-badge&logo=pocketbase&logoColor=black)](https://pocketbase.io/)

---

## ✨ Fonctionnalités

### 🏠 Page d'accueil

- Design e-sport moderne avec effets visuels avancés
- Logo dynamique avec animation scale (125%)
- Taglines rotatives toutes les 4 secondes
- Cartes de statistiques animées (Engagement, Activité, Potentiel, Membres)
- Carrousel de news automatique (rotation 6s)
- Section CTA (Call-to-Action) avec effets gradient

### 📰 Système de News

**Format et affichage :**
- Layout vertical type blog pour une meilleure lisibilité
- Support d'images uploadées (stockées dans PocketBase)
- Support de vidéos via URL externe
- Système d'excerpt (phrase d'accroche courte)

**Effets visuels :**
- Zoom au survol (scale-105)
- Bordure gradient animée
- Overlay gradient noir sur les images
- Icône zoom apparaissant au hover
- Titres avec gradient dynamique

**Filtres et navigation :**
- Filtrage par tags (sélection multiple)
- Tri chronologique (récent/ancien)
- Affichage des métadonnées (auteur, date)

### 🔐 Authentification

- Google OAuth2 intégré
- Système de contrôle d'accès pour la création de contenu
- Avatar utilisateur affiché depuis Google
- Session persistante via PocketBase

### 🎨 Interface Utilisateur

**Navigation :**
- Menu responsive avec version mobile
- Design dark mode avec palette jaune/noir/violet
- Navigation fluide entre les pages

**Éléments visuels :**
- Barre de réseaux sociaux (Discord, YouTube, Twitch, X, TikTok, Instagram, Facebook)
- Ombre violette pulsante sur la barre sociale
- Badge "En développement" fixe
- Bouton e-shop animé (coin inférieur gauche)
- Logo TLG cliquable

---

## 🚀 Installation et développement

### Prérequis

- **Bun** installé (ou Node.js v18+)
- Connexion internet pour accéder à PocketBase

### Démarrage rapide

```bash
# Cloner le projet
git clone <repository-url>
cd TLG_website

# Installer les dépendances
bun install

# Lancer le serveur de développement
bun dev
```

Le site sera accessible sur `http://localhost:3000`

---

## 📁 Architecture du projet

```
TLG_website/
│
├── src/
│   ├── routes/                    # Pages de l'application
│   │   ├── index.tsx              # 🏠 Page d'accueil
│   │   ├── news.tsx               # 📰 Liste des actualités
│   │   ├── about.tsx              # ℹ️ À propos
│   │   ├── academy.tsx            # 🎓 Académie
│   │   └── contact.tsx            # 📧 Contact
│   │
│   ├── components/                # Composants réutilisables
│   │   ├── NavMain.tsx            # Navigation principale
│   │   ├── MainLogo.tsx           # Logo TLG
│   │   ├── NewsItem.tsx           # Affichage d'un article
│   │   ├── AddNewsModal.tsx       # Formulaire de création d'article
│   │   ├── Auth.tsx               # Authentification Google
│   │   ├── following.tsx          # Barre réseaux sociaux
│   │   ├── buildinprogress.tsx   # Badge "En développement"
│   │   └── eshop_button.tsx       # Bouton e-shop
│   │
│   ├── PB/
│   │   └── pocketbase.tsx         # Configuration PocketBase
│   │
│   ├── app.tsx                    # Point d'entrée principal
│   └── app.css                    # Styles globaux
│
├── public/
│   ├── assets/                    # Images et ressources
│   └── social_media/              # Icônes réseaux sociaux
│
├── DOCS_NEWS_STRUCTURE.md         # 📖 Documentation structure news
├── app.config.ts                  # Configuration Vinxi
├── tsconfig.json                  # Configuration TypeScript
└── package.json                   # Dépendances
```

---

## 🗄️ Structure PocketBase

### Collection **users**

| Champ | Type | Description |
|-------|------|-------------|
| `email` | Email | Email de connexion Google |
| `name` | Text | Nom complet de l'utilisateur |
| `avatar` | URL | Photo de profil Google |

### Collection **news**

| Champ | Type | Description |
|-------|------|-------------|
| `title` | Text | Titre de l'article |
| `excerpt` | Text | Phrase courte d'accroche |
| `content` | Text | Contenu complet de l'article |
| `tags` | JSON | Array de tags |
| `author` | Text | Nom de l'auteur |
| `image` | File | Image uploadée (optionnel) |
| `Video_Url` | URL | Lien vidéo externe (optionnel) |
| `created` | Date | Date de création (auto) |
| `updated` | Date | Dernière modification (auto) |

### Collection **tags**

| Champ | Type | Description |
|-------|------|-------------|
| `Tags_name` | Text | Nom du tag |

---

## 🛠️ Stack technique

| Technologie | Usage |
|-------------|-------|
| **SolidJS** | Framework réactif ultra-performant |
| **SolidStart** | Meta-framework pour SolidJS |
| **TypeScript** | Typage statique et sécurité |
| **TailwindCSS** | Framework CSS utility-first |
| **PocketBase** | Backend (Database + Auth + Storage) |
| **Bun** | Runtime JavaScript rapide |
| **Vinxi** | Build system et bundler |

---

## 🎯 Roadmap

**En cours :**
- ✅ Système de news avec upload d'images
- ✅ Authentification Google OAuth2
- ✅ Page d'accueil avec carrousel

**À venir :**
- [ ] Page Académie fonctionnelle
- [ ] Système de gestion de tournois
- [ ] Profils des joueurs
- [ ] Calendrier des événements
- [ ] Système de recrutement
- [ ] Galerie photos/vidéos
- [ ] Newsletter
- [ ] Toggle mode clair/sombre
- [ ] Internationalisation (FR/EN)

---

## 📝 Conventions de code

### Création d'articles

1. Seuls les utilisateurs autorisés peuvent créer du contenu
2. Les images sont uploadées dans PocketBase (champ `image`)
3. Les vidéos utilisent des URLs externes (champ `Video_Url`)
4. Les tags sont sélectionnés depuis la collection `tags`

### Structure des commits

```
feat: Nouvelle fonctionnalité
fix: Correction de bug
style: Améliorations visuelles
docs: Documentation
refactor: Refactorisation
perf: Optimisation de performance
```

---

## 🤝 Contribution

Ce projet est actuellement en développement actif par l'équipe The Legion.  
Les contributions externes ne sont pas acceptées pour le moment.

---

## 📄 License

**Tous droits réservés © 2025 The Legion E-sport**

---

<div align="center">

### 🎮 Champions aujourd'hui, légendes demain 🏆

</div>
