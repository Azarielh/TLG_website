````markdown
# 🎮 TLG Website - The Legion E-sport

Site web officiel de **The Legion**, organisation e-sport française. Construit avec SolidJS et PocketBase pour offrir une expérience moderne et performante.

[![SolidJS](https://img.shields.io/badge/SolidJS-2C4F7C?style=for-the-badge&logo=solid&logoColor=white)](https://www.solidjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PocketBase](https://img.shields.io/badge/PocketBase-B8DBE4?style=for-the-badge&logo=pocketbase&logoColor=black)](https://pocketbase.io/)

## ✨ Fonctionnalités

### 🏠 Page d'accueil
- **Design e-sport moderne** avec effets visuels avancés
- **Logo dynamique** avec animation scale
- **Taglines rotatives** ("Nous construisons notre légende", etc.)
- **Cartes de statistiques** (Engagement, Activité, Potentiel, Membres)
- **Carrousel de news** avec rotation automatique (6s)
- **Section CTA** pour encourager l'engagement

### 📰 Système de News
- **Format blog vertical** pour une meilleure lisibilité
- **Support multimédia** :
  - Upload d'images (stockées dans PocketBase)
  - Intégration de vidéos par URL
- **Effets visuels fancy** :
  - Zoom au survol (scale-105)
  - Bordure gradient animée
  - Overlay gradient noir
  - Icône zoom apparaissant au hover
- **Filtres et tri** :
  - Par tags (multiples)
  - Chronologique (récent/ancien)
- **Système d'excerpt** : phrase courte d'accroche pour chaque article

### 🔐 Authentification
- **Google OAuth2** intégré
- **Système de permissions par Rank** :
  - `Dev` : Accès complet
  - `Admin` : Gestion du contenu
  - `Staff` : Création d'articles
- **Avatar utilisateur** affiché depuis Google
- **Session persistante** via PocketBase

### 🎨 Interface Utilisateur
- **Navigation responsive** avec menu mobile
- **Barre de réseaux sociaux** (Discord, YouTube, Twitch, X, TikTok, Instagram, Facebook)
  - Ombre violette pulsante pour attirer l'attention
- **Badge "En développement"** (position fixe en haut à gauche)
- **Bouton e-shop** animé (coin inférieur gauche)
- **Design dark mode** avec palette jaune/noir/violet

## 🚀 Démarrage rapide

### Prérequis
- **Bun** (ou Node.js v18+)
- Accès à l'instance **PocketBase** : `https://pocketbase-z88kow4kk8cow80ogcskoo08.caesarovich.xyz`

### Installation

```bash
# Installer les dépendances
bun install

# Lancer le serveur de développement
bun dev

# Ouvrir dans le navigateur
# Par défaut : http://localhost:3000
```

### Variables d'environnement

Créer un fichier `.env.local` :

```env
VITE_PB_URL=https://pocketbase-z88kow4kk8cow80ogcskoo08.caesarovich.xyz
VITE_GOOGLE_CLIENT_ID=606209303787-a6kkibvjdoq8gn8jgqbor4np49vsjfdq.apps.googleusercontent.com
```

## 📁 Structure du projet

```
/workspaces/TLG_website/
├── src/
│   ├── routes/              # Pages de l'application
│   │   ├── index.tsx        # Page d'accueil (hero, stats, carrousel)
│   │   ├── news.tsx         # Page des actualités (blog format)
│   │   ├── about.tsx        # À propos
│   │   ├── academy.tsx      # Académie
│   │   └── contact.tsx      # Contact
│   ├── components/          # Composants réutilisables
│   │   ├── NavMain.tsx      # Navigation principale
│   │   ├── MainLogo.tsx     # Logo TLG
│   │   ├── NewsItem.tsx     # Carte d'article (avec effets fancy)
│   │   ├── AddNewsModal.tsx # Formulaire de création d'article
│   │   ├── Auth.tsx         # Authentification Google OAuth
│   │   ├── following.tsx    # Barre réseaux sociaux
│   │   └── ...
│   ├── PB/
│   │   └── pocketbase.tsx   # Configuration PocketBase
│   └── app.tsx              # Point d'entrée principal
├── public/
│   ├── assets/              # Images et médias
│   └── social_media/        # Icônes réseaux sociaux
├── DOCS_NEWS_STRUCTURE.md   # Documentation de la structure news
├── app.config.ts            # Configuration Vinxi/Vite
├── tsconfig.json            # Configuration TypeScript
└── package.json             # Dépendances et scripts
```

## 🗄️ Collections PocketBase

### Collection `users`
- `email` : Email Google
- `name` : Nom complet
- `avatar` : URL de l'avatar Google
- `Rank` : Rôle (`Dev`, `Admin`, `Staff`, ou vide)

### Collection `news`
- `title` : Titre de l'article
- `excerpt` : Phrase courte d'accroche
- `content` : Contenu complet
- `tags` : Array de tags (JSON)
- `author` : Nom de l'auteur
- `image` : Fichier image uploadé (File)
- `Video_Url` : URL vidéo externe (URL)
- `created`, `updated` : Dates auto-générées

### Collection `tags`
- `Tags_name` : Nom du tag

## 🎯 Roadmap

- [ ] Page Académie fonctionnelle
- [ ] Système de gestion de tournois
- [ ] Profiles des joueurs
- [ ] Calendrier des événements
- [ ] Système de recrutement
- [ ] Galerie photos/vidéos
- [ ] Newsletter intégrée
- [ ] Mode clair/sombre toggle
- [ ] Internationalisation (FR/EN)

## 🛠️ Technologies utilisées

- **[SolidJS](https://www.solidjs.com/)** - Framework réactif ultra-performant
- **[SolidStart](https://start.solidjs.com/)** - Meta-framework SolidJS
- **[TypeScript](https://www.typescriptlang.org/)** - Typage statique
- **[TailwindCSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[PocketBase](https://pocketbase.io/)** - Backend BaaS (Database + Auth + Files)
- **[Bun](https://bun.sh/)** - Runtime JavaScript ultra-rapide
- **[Vinxi](https://vinxi.vercel.app/)** - Build system

## 📝 Conventions de développement

### Création d'articles
1. Seuls les utilisateurs avec `Rank` (`Dev`, `Admin`, `Staff`) peuvent créer
2. Les images sont uploadées directement dans PocketBase (champ `image`)
3. Les vidéos utilisent des URLs externes (champ `Video_Url`)
4. Les tags sont sélectionnés depuis la collection `tags`

### Structure des commits
```
feat: Nouvelle fonctionnalité
fix: Correction de bug
style: Améliorations visuelles
docs: Documentation
refactor: Refactorisation du code
```

## 🤝 Contribution

Ce projet est actuellement en développement actif par l'équipe The Legion. Les contributions externes ne sont pas acceptées pour le moment.

## 📧 Contact

- **Email** : thelegion.esport@hotmail.com
- **Discord** : [Rejoindre le serveur](https://discord.com/invite/wfSyp6xBnF)
- **YouTube** : [@TheLegion.esport](https://www.youtube.com/@TheLegion.esport)
- **Twitch** : [thelegionallstar](https://www.twitch.tv/thelegionallstar)

## 📄 License

Tous droits réservés © 2025 The Legion E-sport

---

**🎮 Champions aujourd'hui, légendes demain 🏆**
````
