import { Component, createSignal, Show, For, createEffect, onMount } from "solid-js";
import { usePocketBase } from "../app";
import type { NewsItemData } from "./NewsItem";

interface AddNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewsAdded?: () => void;
  // When provided, modal will act in edit mode for this news
  existingNews?: NewsItemData | null;
  onNewsUpdated?: () => void;
  availableTags?: { id: string; name: string }[];
}

type Tag = {
  id: string;
  name: string;
};

const AddNewsModal: Component<AddNewsModalProps> = (props) => {
  const pb = usePocketBase();
  const [title, setTitle] = createSignal("");
  const [headlines, setHeadlines] = createSignal(""); // Phrase courte
  const [content, setContent] = createSignal("");
  const [selectedTags, setSelectedTags] = createSignal<string[]>([]);
  const [mediaType, setMediaType] = createSignal<'none' | 'image' | 'video'>('none');
  const [mediaUrl, setMediaUrl] = createSignal(""); // URL externe
  const [mediaFile, setMediaFile] = createSignal<File | null>(null); // Fichier uploadé
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [error, setError] = createSignal("");
  const [parutionDate, setParutionDate] = createSignal<string>(new Date().toISOString());
  const [doPublish, setDoPublish] = createSignal<boolean>(true);
  const [imageUrlField, setImageUrlField] = createSignal<string>("");

  // Use availableTags from props (passed from parent news.tsx)
  const isLoadingTags = () => !props.availableTags;

  const normalizeDateString = (value: string) => {
    try {
      return new Date(value).toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  // If editing, when the modal opens prefill the fields from existingNews
  createEffect(() => {
    if (props.isOpen && props.existingNews) {
      const n = props.existingNews;
      setTitle(n.title || "");
      setHeadlines(n.headlines || "");
      setContent(n.content || "");
      // Normalize tags to an array of ids
      setSelectedTags(
        Array.isArray((n as any).tags)
          ? (n as any).tags
              .map((t: any) => (typeof t === 'string' ? t : t?.id || t?.name || ''))
              .filter(Boolean)
          : []
      );
      setParutionDate((n as any).Parution_Date || new Date().toISOString());
      setDoPublish((n as any).do_publish ?? true);
      setImageUrlField((n as any).image_url || "");

      if (n.video_url) {
        setMediaType('video');
        setMediaUrl(n.video_url);
        setMediaFile(null);
      } else if (n.image) {
        setMediaType('image');
        // We don't have the actual File for existing image, keep mediaFile null and rely on image URL
        setMediaUrl("");
        setMediaFile(null);
      } else {
        setMediaType('none');
        setMediaUrl("");
        setMediaFile(null);
      }
    }
    // If modal closed, clear temporary upload file to avoid stale state
    if (!props.isOpen && !props.existingNews) {
      setTitle("");
      setHeadlines("");
      setContent("");
      setSelectedTags([]);
      setMediaType('none');
      setMediaUrl("");
      setMediaFile(null);
      setParutionDate(new Date().toISOString());
      setDoPublish(true);
      setImageUrlField("");
    }
  });

  // Tags are now provided via props from parent (news.tsx)
  // No need to load them again here to avoid auto-cancellation

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!pb) {
      setError("PocketBase non disponible - Veuillez rafraîchir la page");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // Validation média: au moins une image (fichier ou URL) ou une vidéo
      const hasImage = mediaType() === 'image' && (!!mediaFile() || !!imageUrlField());
      const hasVideo = mediaType() === 'video' && !!mediaUrl();
      if (!hasImage && !hasVideo) {
        setError("Au moins une image (fichier ou URL) ou une vidéo est requise.");
        setIsSubmitting(false);
        return;
      }
      // Préparer les données du formulaire
      const formData = new FormData();
      formData.append('title', title());
      formData.append('headlines', headlines());
      formData.append('content', content());
      const parutionValue = props.existingNews ? parutionDate() : new Date().toISOString();
      formData.append('Parution_Date', normalizeDateString(parutionValue));
      formData.append('event_date', normalizeDateString(parutionValue));
      formData.append('do_publish', 'true');
      // PocketBase (multipart) : répéter le même nom de champ pour chaque relation
      if (selectedTags().length > 0) {
        selectedTags().forEach((tagId) => formData.append('tags', tagId));
      }
      // Auteur: utiliser l'id utilisateur (souvent exigé par les règles PB)
      formData.append('author', pb.authStore.record?.id || "");
      
      // Ajouter le média selon le type
      if (mediaType() === 'image' && mediaFile()) {
        // Upload d'image - utiliser le champ 'image' de PocketBase
        // Fournir explicitement le nom du fichier au FormData (plus robuste)
        formData.append('image', mediaFile()!, mediaFile()!.name);
        if (imageUrlField()) formData.append('image_url', imageUrlField());
      } else if (mediaType() === 'video' && mediaUrl()) {
        // URL vidéo - champ video_url dans le schéma PB
        formData.append('video_url', mediaUrl());
        if (imageUrlField()) formData.append('image_url', imageUrlField());
      } else {
        // Pas de média : envoyer un champ vide pour respecter le schéma qui attend une string
        if (imageUrlField()) formData.append('image_url', imageUrlField());
      }
      
      // Construire un payload JSON quand il n'y a pas de fichier image pour garantir les bons types
      const basePayload: any = {
        title: title(),
        headlines: headlines(),
        content: content(),
        Parution_Date: normalizeDateString(parutionValue),
        event_date: normalizeDateString(parutionValue),
        do_publish: true,
        tags: selectedTags(),
        author: pb.authStore.record?.id || "",
      };
      if (imageUrlField()) basePayload.image_url = imageUrlField();
      if (mediaType() === 'video' && mediaUrl()) basePayload.video_url = mediaUrl();

      const useFormData = mediaType() === 'image' && !!mediaFile();

      let result;
      if (props.existingNews && props.existingNews.id) {
        // Update existing record
        result = await pb.collection("News").update(
          props.existingNews.id,
          useFormData ? formData : basePayload
        );

        // Callback et fermeture
        props.onNewsUpdated?.();
        props.onClose();
      } else {
        // Créer la news dans PocketBase
        result = await pb.collection("News").create(useFormData ? formData : basePayload);

        // Réinitialiser le formulaire
        setTitle("");
        setHeadlines("");
        setContent("");
        setSelectedTags([]);
        setMediaType('none');
        setMediaUrl("");
        setMediaFile(null);

        // Callback et fermeture
        props.onNewsAdded?.();
        props.onClose();
      }
    } catch (err: any) {
      console.error('Error creating/updating news:', err);
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
            <h2 class="text-2xl font-bold text-white" style="font-family: 'Varsity', serif;">Ajouter une News</h2>
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
              <label for="headlines" class="block text-sm font-medium text-gray-300 mb-2">
                Phrase courte / Résumé *
              </label>
              <input
                id="headlines"
                type="text"
                value={headlines()}
                onInput={(e) => setHeadlines(e.currentTarget.value)}
                required
                maxLength={200}
                class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                placeholder="Résumé en une phrase (max 200 caractères)"
              />
              <p class="text-xs text-gray-500 mt-1">
                {headlines().length}/200 caractères
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

            <div class="flex items-center gap-3">
              <input
                id="do-publish"
                type="checkbox"
                checked={doPublish()}
                disabled
                class="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-700 bg-gray-800 opacity-60 cursor-not-allowed"
              />
              <label for="do-publish" class="text-sm text-gray-300">Publier immédiatement (activé par défaut)</label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
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
                  when={props.availableTags && props.availableTags.length > 0}
                  fallback={
                    <p class="text-sm text-gray-500">Aucun tag disponible</p>
                  }
                >
                  <div class="flex flex-wrap gap-2">
                    <For each={props.availableTags || []}>
                      {(tag) => {
                        const isSelected = () => selectedTags().includes(tag.id);
                        return (
                          <button
                            type="button"
                            onClick={() => {
                              if (isSelected()) {
                                // Désélectionner
                                setSelectedTags(selectedTags().filter(t => t !== tag.id));
                              } else {
                                // Sélectionner
                                setSelectedTags([...selectedTags(), tag.id]);
                              }
                            }}
                            class={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isSelected()
                                ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/30 scale-105'
                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105'
                            }`}
                          >
                            {tag.name}
                          </button>
                        );
                      }}
                    </For>
                  </div>
                  <Show when={selectedTags().length > 0}>
                    <p class="text-xs text-gray-500 mt-3">
                      {selectedTags().length} tag{selectedTags().length > 1 ? 's' : ''} sélectionné{selectedTags().length > 1 ? 's' : ''}
                    </p>
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
                    setMediaType('image');
                    setMediaUrl("");
                    setMediaFile(null);
                    setImageUrlField("");
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
                    setImageUrlField("");
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
              <Show when={mediaType() === 'image'}>
                <div class="space-y-3">
                  <div>
                    <label for="mediaFile" class="block text-sm text-gray-400 mb-2">
                      Uploader une image
                    </label>
                    <input
                      id="mediaFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.currentTarget.files?.[0];
                        setMediaFile(file || null);
                      }}
                      class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:text-black file:font-medium hover:file:bg-yellow-500 file:cursor-pointer"
                    />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-400 mb-2">
                      Ou URL d'image externe
                    </label>
                    <input
                      type="url"
                      value={imageUrlField()}
                      onInput={(e) => setImageUrlField(e.currentTarget.value)}
                      placeholder="https://exemple.com/image.jpg"
                      class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                    />
                    <p class="text-xs text-gray-500 mt-1">Laissez vide si vous uploadez un fichier.</p>
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

              <Show when={mediaType() === 'video'}>
                <div class="space-y-3">
                  <div>
                    <label for="mediaUrl" class="block text-sm text-gray-400 mb-2">
                      URL de la vidéo (MP4 ou lien direct)
                    </label>
                    <input
                      id="mediaUrl"
                      type="url"
                      value={mediaUrl()}
                      onInput={(e) => {
                        setMediaUrl(e.currentTarget.value);
                        setMediaFile(null);
                      }}
                      placeholder="https://exemple.com/video.mp4"
                      class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-400 mb-2">(Optionnel) URL d'image d'aperçu</label>
                    <input
                      type="url"
                      value={imageUrlField()}
                      onInput={(e) => setImageUrlField(e.currentTarget.value)}
                      placeholder="https://exemple.com/cover.jpg"
                      class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                    />
                  </div>
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
