import { Component, createSignal, Show, For } from "solid-js";
import { usePocketBase } from "../app";

interface AddNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewsAdded?: () => void;
}

const AddNewsModal: Component<AddNewsModalProps> = (props) => {
  const pb = usePocketBase();
  const [title, setTitle] = createSignal("");
  const [content, setContent] = createSignal("");
  const [tags, setTags] = createSignal<string[]>([]);
  const [currentTag, setCurrentTag] = createSignal("");
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleAddTag = () => {
    const tag = currentTag().trim();
    if (tag && !tags().includes(tag)) {
      setTags([...tags(), tag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags().filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!pb) return;

    setError("");
    setIsSubmitting(true);

    try {
      // Créer la news dans PocketBase
      await pb.collection("news").create({
        title: title(),
        content: content(),
        tags: tags(),
        author: pb.authStore.record?.username || pb.authStore.record?.email || "Anonyme",
      });

      // Réinitialiser le formulaire
      setTitle("");
      setContent("");
      setTags([]);
      setCurrentTag("");

      // Callback et fermeture
      props.onNewsAdded?.();
      props.onClose();
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la création de la news");
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
              <div class="flex gap-2 mb-3">
                <input
                  id="tags"
                  type="text"
                  value={currentTag()}
                  onInput={(e) => setCurrentTag(e.currentTarget.value)}
                  onKeyPress={handleKeyPress}
                  class="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                  placeholder="Ajouter un tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  class="px-4 py-2 bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/30 rounded-lg text-yellow-400 font-medium transition-colors"
                >
                  Ajouter
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <For each={tags()}>
                  {(tag) => (
                    <span class="px-3 py-1 text-sm rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 flex items-center gap-2">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        class="hover:text-yellow-300 font-bold"
                        aria-label={`Retirer ${tag}`}
                      >
                        ×
                      </button>
                    </span>
                  )}
                </For>
              </div>
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
