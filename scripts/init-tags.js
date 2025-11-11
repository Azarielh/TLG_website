/**
 * Script pour initialiser les tags dans PocketBase
 * 
 * Usage: node scripts/init-tags.js
 */

import PocketBase from 'pocketbase';

const PB_URL = process.env.VITE_PB_URL || 'https://pocketbase-z88kow4kk8cow80ogcskoo08.caesarovich.xyz';

const DEFAULT_TAGS = [
  "Annonce",
  "Événement",
  "Tournoi",
  "Recrutement",
  "Mise à jour",
  "Communauté",
  "Partenariat",
  "Résultat",
  "Classement",
  "Staff"
];

async function initTags() {
  console.log('🔧 Connecting to PocketBase:', PB_URL);
  const pb = new PocketBase(PB_URL);

  try {
    // Vérifier si la collection tags existe
    console.log('🔍 Checking if tags collection exists...');
    const collections = await pb.collections.getFullList();
    const tagsCollection = collections.find(c => c.name === 'tags');

    if (!tagsCollection) {
      console.error('❌ Collection "tags" not found!');
      console.log('📝 Please create the "tags" collection in PocketBase Admin:');
      console.log('   1. Go to Collections');
      console.log('   2. Create new collection "tags"');
      console.log('   3. Add field "name" (Text, Required, Unique)');
      console.log('   4. Set API Rules to allow authenticated users to read');
      return;
    }

    console.log('✅ Tags collection found');

    // Récupérer les tags existants
    const existingTags = await pb.collection('tags').getFullList();
    console.log(`📋 Found ${existingTags.length} existing tags`);

    // Ajouter les tags manquants
    let added = 0;
    for (const tagName of DEFAULT_TAGS) {
      const exists = existingTags.find(t => t.name === tagName);
      if (!exists) {
        try {
          await pb.collection('tags').create({ name: tagName });
          console.log(`✅ Added tag: ${tagName}`);
          added++;
        } catch (err) {
          console.error(`❌ Failed to add tag "${tagName}":`, err.message);
        }
      } else {
        console.log(`⏭️  Tag already exists: ${tagName}`);
      }
    }

    console.log(`\n🎉 Done! Added ${added} new tags.`);
    console.log(`📊 Total tags: ${existingTags.length + added}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.status === 401 || error.status === 403) {
      console.log('⚠️  This script requires admin authentication.');
      console.log('💡 Run this directly in PocketBase admin console instead.');
    }
  }
}

initTags();
