# Configuration de la collection Tags

## 📋 Étapes dans PocketBase Admin

### 1. Créer la collection `tags`

1. Ouvrez PocketBase Admin : `https://pocketbase-z88kow4kk8cow80ogcskoo08.caesarovich.xyz`
2. Allez dans **Collections**
3. Cliquez sur **New Collection**
4. Nom : `tags`
5. Type : **Base**

### 2. Ajouter le champ `Tags_name`

1. Cliquez sur **New field**
2. Type : **Text**
3. Name : `Tags_name`
4. Options :
   - ✅ Required
   - ✅ Unique
   - Min length : 1
   - Max length : 50

### 3. Configurer les API Rules

**⚠️ IMPORTANT** : Les règles vides = accès refusé à tout le monde !

#### List/Search Rule :
```javascript
@request.auth.id != ""
```
👉 Permet à tous les utilisateurs authentifiés de **lire** les tags

#### View Rule :
```javascript
@request.auth.id != ""
```
👉 Permet à tous les utilisateurs authentifiés de **voir** un tag

#### Create Rule :
```javascript
@request.auth.Rank = "Admin" || @request.auth.Rank = "Dev"
```
👉 Seuls les Admin et Dev peuvent **créer** des tags

#### Update Rule :
```javascript
@request.auth.Rank = "Admin" || @request.auth.Rank = "Dev"
```
👉 Seuls les Admin et Dev peuvent **modifier** des tags

#### Delete Rule :
```javascript
@request.auth.Rank = "Admin"
```
👉 Seuls les Admin peuvent **supprimer** des tags

### 4. Ajouter les tags

Dans l'onglet **Records**, ajoutez manuellement les tags suivants (ou utilisez l'API) :

- Annonce
- Événement
- Tournoi
- Recrutement
- Mise à jour
- Communauté
- Partenariat
- Résultat
- Classement
- Staff

## 🎯 Ou via l'API Console

Dans PocketBase Admin, allez dans **Settings** → **Import collections** et collez :

```json
[
  {
    "name": "tags",
    "type": "base",
    "schema": [
      {
        "name": "Tags_name",
        "type": "text",
        "required": true,
        "unique": true
      }
    ],
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.Rank = \"Admin\" || @request.auth.Rank = \"Dev\"",
    "updateRule": "@request.auth.Rank = \"Admin\" || @request.auth.Rank = \"Dev\"",
    "deleteRule": "@request.auth.Rank = \"Admin\""
  }
]
```

Puis ajoutez les records via l'interface ou l'API.

## ✅ Vérification

Une fois les tags créés, testez dans la console du navigateur :

```javascript
const pb = new PocketBase('https://pocketbase-z88kow4kk8cow80ogcskoo08.caesarovich.xyz');
const tags = await pb.collection('tags').getFullList();
console.log('Tags:', tags);
```

Vous devriez voir vos tags s'afficher !
