# Architecture PocketBase - Instance Globale Partagée

## 🏗️ Principe

PocketBase est maintenant créé comme une **instance unique globale** qui est partagée par tous les composants de l'application.

## 📁 Fichier : `src/app.tsx`

### Instance Globale

```typescript
// Créer une instance PocketBase UNIQUE et GLOBALE
const createPocketBaseInstance = () => {
  // Vérifier si on est côté client
  const isBrowser = typeof window !== 'undefined';
  
  if (!isBrowser) {
    // Côté serveur, retourner null pour éviter les erreurs
    return null;
  }

  const url = import.meta.env.VITE_PB_URL || 'https://pocketbase-...';
  const pb = new PocketBase(url);
  
  return pb;
};

// Instance GLOBALE - créée une seule fois
const globalPocketBase = createPocketBaseInstance();
```

### Contexte React/SolidJS

```typescript
export const PocketBaseContext = createContext<PocketBase | null>(globalPocketBase);

export function usePocketBase() {
  return useContext(PocketBaseContext);
}
```

## ✅ Avantages

1. **Une seule instance** : PocketBase n'est créé qu'une fois au chargement de l'application
2. **Partagée entre tous les composants** : Tous utilisent la même instance via `usePocketBase()`
3. **Auth persistante** : Le token d'authentification est conservé dans `pb.authStore`
4. **SSR-safe** : Retourne `null` côté serveur, évite les erreurs d'hydratation
5. **Performance** : Pas de recréation à chaque montage de composant

## 🔌 Utilisation dans les composants

### Import

```typescript
import { usePocketBase } from "../app";
```

### Dans un composant

```typescript
const pb = usePocketBase();

// Toujours vérifier si pb existe (SSR)
if (!pb) {
  console.error('❌ PocketBase not available (SSR context)');
  return;
}

// Utiliser pb normalement
const records = await pb.collection("news").getFullList();
```

## 🔐 AuthStore

L'état d'authentification est **automatiquement persisté** dans le localStorage via `pb.authStore`.

### Observer les changements

```typescript
createEffect(() => {
  if (!pb) return;
  
  // Écouter les changements d'auth
  const unsubscribe = pb.authStore.onChange((token, record) => {
    console.log('Auth changed!', record);
  });
  
  // Cleanup
  return unsubscribe;
});
```

### Accéder aux données utilisateur

```typescript
if (pb.authStore.isValid) {
  const user = pb.authStore.record;
  const token = pb.authStore.token;
}
```

## 🚀 Cycle de vie

1. **Chargement de l'app** : `globalPocketBase` est créé (côté client uniquement)
2. **Contexte créé** : `PocketBaseContext.Provider` enveloppe l'app avec l'instance
3. **Composants montés** : Chaque composant appelle `usePocketBase()` et reçoit la **même instance**
4. **Auth persistante** : Si un token existe dans localStorage, l'utilisateur reste connecté

## ⚠️ Cas SSR (Server-Side Rendering)

Côté serveur (SSR), `globalPocketBase` vaut `null` car :
- `window` n'existe pas côté serveur
- PocketBase nécessite le localStorage (navigateur uniquement)

**Toujours vérifier** `if (!pb) return;` dans vos composants.

## 📝 Exemples

### Charger des données

```typescript
const loadNews = async () => {
  if (!pb) return;
  
  const records = await pb.collection("news").getFullList({
    sort: "-created",
  });
  setNewsItems(records);
};
```

### Créer un enregistrement

```typescript
const createNews = async (data) => {
  if (!pb) {
    setError("PocketBase non disponible");
    return;
  }
  
  const result = await pb.collection("news").create(data);
  return result;
};
```

### Authentification

```typescript
const handleLogin = async () => {
  if (!pb) return;
  
  await pb.collection('users').authWithOAuth2({ provider: 'google' });
  // L'auth est automatiquement stockée dans pb.authStore
};
```

## 🎯 Points clés

- ✅ Une seule instance globale
- ✅ Partagée via Context
- ✅ SSR-safe (null côté serveur)
- ✅ Auth persistante automatique
- ✅ Pas de re-création inutile
- ✅ Tous les composants synchronisés
