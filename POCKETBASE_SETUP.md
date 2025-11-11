# Configuration PocketBase pour la collection News

## 📋 Configuration de la collection `news`

### Champs requis

1. **title** (Text)
   - Type : Text
   - Required : Oui
   - Max length : 200

2. **content** (Editor/Text)
   - Type : Editor ou Text
   - Required : Oui
   - Max length : 5000+

3. **tags** (Select - Multiple)
   - Type : **Select**
   - ⚠️ **IMPORTANT** : Cochez "Allow multiple values"
   - Values (choix prédéfinis) :
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
   - Required : Non

4. **author** (Text)
   - Type : Text
   - Required : Non
   - Default : "Anonyme"

5. **created** et **updated** (automatiques)
   - PocketBase les crée automatiquement

## 🔐 Règles d'API

### List/Search Rule
```javascript
// Tout le monde peut voir les news
@request.auth.id != ""
```

### View Rule
```javascript
// Tout le monde peut voir une news
@request.auth.id != ""
```

### Create Rule
```javascript
// Seuls les utilisateurs authentifiés avec un Rank peuvent créer
@request.auth.id != "" && @request.auth.Rank != ""
```

### Update Rule
```javascript
// Seuls les admins peuvent modifier
@request.auth.Rank = "admin"
```

### Delete Rule
```javascript
// Seuls les admins peuvent supprimer
@request.auth.Rank = "admin"
```

## 🎯 Test de la configuration

Pour vérifier que tout fonctionne :

1. Ouvrez l'admin PocketBase : `https://votre-url-pocketbase.xyz/_/`
2. Allez dans **Collections** → **news**
3. Vérifiez que le champ `tags` est bien de type **Select** avec **Allow multiple values** activé
4. Vérifiez que les valeurs prédéfinies sont bien listées
5. Testez la création d'une news manuellement pour vérifier les permissions

## 🔧 Logs de débogage

Lorsque vous ouvrez le modal "Ajouter une News", vous devriez voir dans la console :

```
🔍 Fetching news collection schema...
📋 News collection schema: {...}
🏷️ Tags field schema: {type: "select", options: {values: [...], maxSelect: ...}}
✅ Available tags from PocketBase: ["Annonce", "Événement", ...]
```

Si vous voyez une erreur :
- ❌ Collection 'news' introuvable → Créez la collection
- ❌ Tags field not found → Ajoutez le champ `tags`
- ⚠️ No tag options found → Configurez les valeurs prédéfinies du champ

## 📝 Format des données envoyées

Lors de la création d'une news, le frontend envoie :

```json
{
  "title": "Titre de la news",
  "content": "Contenu de la news...",
  "tags": ["Annonce", "Tournoi"],
  "author": "Nom de l'utilisateur"
}
```

PocketBase attend que `tags` soit un **tableau de strings** correspondant aux valeurs prédéfinies dans le schéma.
