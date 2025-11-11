import { Component, createSignal, Show, For, createEffect, onMount } from "solid-js";
import { usePocketBase } from "../app";

interface AddNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewsAdded?: () => void;
}

const AddNewsModal: Component<AddNewsModalProps> = (props) => {
  const pb = usePocketBase();
  const [title, setTitle] = createSignal("");
  const [excerpt, setExcerpt] = createSignal(""); // Phrase courte
  const [content, setContent] = createSignal("");
  const [selectedTags, setSelectedTags] = createSignal<string[]>([]);
  const [availableTags, setAvailableTags] = createSignal<string[]>([]);
  const [mediaType, setMediaType] = createSignal<'none' | 'image' | 'video'>('none');
  const [mediaUrl, setMediaUrl] = createSignal(""); // URL externe
  const [mediaFile, setMediaFile] = createSignal<File | null>(null); // Fichier uploadé
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [error, setError] = createSignal("");
  const [isLoadingTags, setIsLoadingTags] = createSignal(true);

  // Récupérer les tags depuis la collection tags
  onMount(async () => {
    if (!pb) {
      console.error('❌ PocketBase not available (SSR context)');
      setError("PocketBase non disponible - Veuillez rafraîchir la page");
      setIsLoadingTags(false);
      return;
    }

    try {
      console.log('🔍 Fetching tags from tags collection...');
      console.log('🔐 Current user:', pb.authStore.record);
      console.log('🔐 User Rank:', pb.authStore.record?.Rank);
      
      // Récupérer les tags depuis la collection dédiée (sans sort pour tester)
      const tagsRecords = await pb.collection("tags").getFullList();
      
      console.log('✅ Tags loaded from collection:', tagsRecords);
      
      // Extraire les noms des tags et trier côté client
      // Le champ s'appelle "Tags_name" dans votre collection
      const tagNames = tagsRecords
        .map((record: any) => record.Tags_name)
        .filter(name => name) // Filtrer les valeurs nulles/undefined
        .sort((a, b) => a.localeCompare(b));
      
      if (tagNames.length === 0) {
        console.warn('⚠️ No tags found in collection');
        setError("Aucun tag disponible. Créez des tags dans PocketBase.");
      }
      
      setAvailableTags(tagNames);
    } catch (err: any) {
      console.error('❌ Error fetching tags:', err);
      console.error('❌ Error details:', err.data);
      console.error('❌ Error status:', err.status);
      console.error('❌ Error response:', err.response);
      console.error('❌ Full error object:', JSON.stringify(err, null, 2));
      
      // Si la collection tags n'existe pas, utiliser des tags par défaut
      if (err.status === 404 || err.message?.includes('not found')) {
        console.warn('⚠️ Tags collection not found, using default tags');
        const defaultTags = [
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
        setAvailableTags(defaultTags);
        setError("Collection 'tags' non trouvée. Tags par défaut utilisés.");
      } else {
        setError(`Erreur lors du chargement des tags: ${err.message}`);
      }
    } finally {
      setIsLoadingTags(false);
    }
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!pb) {
      setError("PocketBase non disponible - Veuillez rafraîchir la page");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // Préparer les données du formulaire
      const formData = new FormData();
      formData.append('title', title());
      formData.append('excerpt', excerpt());
      formData.append('content', content());
      formData.append('tags', JSON.stringify(selectedTags()));
      formData.append('author', pb.authStore.record?.name || pb.authStore.record?.email || "Anonyme");
      
      // Ajouter le média selon le type
      if (mediaType() === 'image' && mediaFile()) {
        // Upload d'image - utiliser le champ 'image' de PocketBase
        formData.append('image', mediaFile()!);
      } else if (mediaType() === 'video' && mediaUrl()) {
        // URL vidéo - utiliser le champ 'Video_Url' de PocketBase
        formData.append('Video_Url', mediaUrl());
      }
      
      console.log('📝 Creating news with data:');
      console.log('  - Title:', title());
      console.log('  - Excerpt:', excerpt());
      console.log('  - Content length:', content().length);
      console.log('  - Tags:', selectedTags());
      console.log('  - Media type:', mediaType());
      console.log('  - Image file:', mediaFile()?.name);
      console.log('  - Video URL:', mediaUrl());
      
      // Créer la news dans PocketBase
      const result = await pb.collection("news").create(formData);
      
      console.log('✅ News created successfully:', result);

      // Réinitialiser le formulaire
      setTitle("");
      setExcerpt("");
      setContent("");
      setSelectedTags([]);
      setMediaType('none');
      setMediaUrl("");
      setMediaFile(null);

      // Callback et fermeture
      props.onNewsAdded?.();
      props.onClose();
    } catch (err: any) {
      console.error('❌ Error creating news:', err);
      console.error('❌ Error response:', err?.response);
      console.error('❌ Error data:', err?.data);
      setError(err?.data?.message || err?.message || "Erreur lors de la création de la news");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-white">Ajouter une News</h2>
            <button
              onClick={props.onClose}
              class="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} class="p-6 space-y-6">
            <Show when={error()}>
              <div class="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                {error()}
              </div>
            </Show>

            <div>
              <label for="title" class="block text-sm font-medium text-gray-300 mb-2">
                Titre *
              </label>
              <input
                id="title"
                type="text"
                value={title()}
                onInput={(e) => setTitle(e.currentTarget.value)}
                required
                class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                placeholder="Titre de la news"
              />
            </div>

            <div>
              <label for="excerpt" class="block text-sm font-medium text-gray-300 mb-2">
                Phrase courte / Résumé *
              </label>
              <input
                id="excerpt"
                type="text"
                value={excerpt()}
                onInput={(e) => setExcerpt(e.currentTarget.value)}
                required
                maxLength={200}
                class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                placeholder="Résumé en une phrase (max 200 caractères)"
              />
              <p class="text-xs text-gray-500 mt-1">
                {excerpt().length}/200 caractères
              </p>
            </div>

            <div>
              <label for="content" class="block text-sm font-medium text-gray-300 mb-2">
                Contenu *
              </label>
              <textarea
                id="content"
                value={content()}
                onInput={(e) => setContent(e.currentTarget.value)}
                required
                rows={8}
                class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 resize-y"
                placeholder="Contenu de la news"
              />
            </div>

            <div>
              <label for="tags" class="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <Show
                when={!isLoadingTags()}
                fallback={
                  <div class="flex items-center gap-2 text-gray-500">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                    <span class="text-sm">Chargement des tags...</span>
                  </div>
                }
              >
                <Show
                  when={availableTags().length > 0}
                  fallback={
                    <p class="text-sm text-gray-500">Aucun tag disponible</p>
                  }
                >
                  <select
                    multiple
                    size={Math.min(availableTags().length, 6)}
                    value={selectedTags()}
                    onChange={(e) => {
                      const options = Array.from(e.currentTarget.selectedOptions);
                      setSelectedTags(options.map(opt => opt.value));
                    }}
                    class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                  >
                    <For each={availableTags()}>
                      {(tag) => (
                        <option 
                          value={tag}
                          class="py-2 hover:bg-yellow-400/20"
                        >
                          {tag}
                        </option>
                      )}
                    </For>
                  </select>
                  <p class="text-xs text-gray-500 mt-2">
                    Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs tags
                  </p>
                  <Show when={selectedTags().length > 0}>
                    <div class="flex flex-wrap gap-2 mt-3">
                      <For each={selectedTags()}>
                        {(tag) => (
                          <span class="px-3 py-1 text-sm rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
                            {tag}
                          </span>
                        )}
                      </For>
                    </div>
                  </Show>
                </Show>
              </Show>
            </div>

            {/* Section Média */}
            <div class="border-t border-gray-700 pt-6">
              <label class="block text-sm font-medium text-gray-300 mb-3">
                Média (optionnel)
              </label>
              
              {/* Sélecteur de type de média */}
              <div class="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setMediaType('none');
                    setMediaUrl("");
                    setMediaFile(null);
                  }}
                  class={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mediaType() === 'none'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Aucun
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMediaType('image');
                    setMediaUrl("");
                    setMediaFile(null);
                  }}
                  class={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mediaType() === 'image'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Image
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMediaType('video');
                    setMediaUrl("");
                    setMediaFile(null);
                  }}
                  class={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mediaType() === 'video'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Vidéo
                </button>
              </div>

              {/* Upload de fichier ou URL selon le type */}
              <Show when={mediaType() !== 'none'}>
                <div class="space-y-3">
                  <div>
                    <label for="mediaFile" class="block text-sm text-gray-400 mb-2">
                      Uploader un fichier
                    </label>
                    <input
                      id="mediaFile"
                      type="file"
                      accept={mediaType() === 'image' ? 'image/*' : 'video/*'}
                      onChange={(e) => {
                        const file = e.currentTarget.files?.[0];
                        if (file) {
                          setMediaFile(file);
                          setMediaUrl(""); // Reset URL si fichier uploadé
                        }
                      }}
                      class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:text-black file:font-medium hover:file:bg-yellow-500 file:cursor-pointer"
                    />
                  </div>

                  <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                      <div class="w-full border-t border-gray-700"></div>
                    </div>
                    <div class="relative flex justify-center text-xs">
                      <span class="px-2 bg-gray-900 text-gray-500">OU</span>
                    </div>
                  </div>

                  <div>
                    <label for="mediaUrl" class="block text-sm text-gray-400 mb-2">
                      URL externe
                    </label>
                    <input
                      id="mediaUrl"
                      type="url"
                      value={mediaUrl()}
                      onInput={(e) => {
                        setMediaUrl(e.currentTarget.value);
                        setMediaFile(null); // Reset fichier si URL ajoutée
                      }}
                      placeholder={mediaType() === 'image' ? 'https://exemple.com/image.jpg' : 'https://youtube.com/watch?v=...'}
                      class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                    />
                  </div>

                  <Show when={mediaFile()}>
                    <div class="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Fichier sélectionné : {mediaFile()!.name}</span>
                    </div>
                  </Show>
                </div>
              </Show>
            </div>

            <div class="flex gap-4 pt-4">
              <button
                type="button"
                onClick={props.onClose}
                class="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting()}
                class="flex-1 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-black font-bold transition-colors"
              >
                {isSubmitting() ? "Création..." : "Publier"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Show>
  );
};

export default AddNewsModal;
