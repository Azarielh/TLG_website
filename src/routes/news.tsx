import { Title } from "@solidjs/meta";
import { Component, createSignal, createMemo, For, Show } from "solid-js";
import NewsItem, { type NewsItemData } from "../components/NewsItem";
import AddNewsModal from "../components/AddNewsModal";
import { usePocketbase } from "../PB/pockectbase";
import { createEffect } from "solid-js";

type SortOption = "recent" | "oldest";
type FilterTag = string | "all";

export default function News() {
  const pb = usePocketbase();
  const [newsItems, setNewsItems] = createSignal<NewsItemData[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [sortBy, setSortBy] = createSignal<SortOption>("recent");
  const [selectedTag, setSelectedTag] = createSignal<FilterTag>("all");
  const [isModalOpen, setIsModalOpen] = createSignal(false);

  // Charger les news depuis PocketBase
  const loadNews = async () => {
    if (!pb) return;
    
    setIsLoading(true);
    try {
      const records = await pb.collection("news").getFullList({
        sort: "-created",
      });
      
      setNewsItems(records as unknown as NewsItemData[]);
    } catch (error) {
      console.error("Erreur lors du chargement des news:", error);
      // Pour l'instant, si la collection n'existe pas, on garde le tableau vide
      setNewsItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les news au montage
  createEffect(() => {
    loadNews();
  });

  // Extraire tous les tags uniques
  const allTags = createMemo(() => {
    const tagSet = new Set<string>();
    newsItems().forEach((news) => {
      news.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  });

  // Filtrer et trier les news
  const filteredAndSortedNews = createMemo(() => {
    let result = [...newsItems()];

    // Filtrage par tag
    if (selectedTag() !== "all") {
      result = result.filter((news) => news.tags?.includes(selectedTag() as string));
    }

    // Tri chronologique
    result.sort((a, b) => {
      const dateA = new Date(a.created).getTime();
      const dateB = new Date(b.created).getTime();
      return sortBy() === "recent" ? dateB - dateA : dateA - dateB;
    });

    return result;
  });

  const handleNewsAdded = () => {
    loadNews();
  };

  return (
    <main class="relative z-10 flex flex-col items-center justify-start pt-20 pb-8 px-4 sm:px-6 min-h-[65vh]">
      <Title>News - TLG</Title>

      {/* En-tête avec titre et bouton d'ajout */}
      <div class="w-full max-w-6xl mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white">Actualités</h1>
        
        <Show when={true || pb?.authStore.isValid}>
          <button
            onClick={() => setIsModalOpen(true)}
            class="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-black font-bold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            + Ajouter une News
          </button>
        </Show>
      </div>

      {/* Filtres et tri */}
      <div class="w-full max-w-6xl mb-8 flex flex-col lg:flex-row gap-4 bg-gray-800/40 border border-gray-700 rounded-xl p-4">
        {/* Tri chronologique */}
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Trier par
          </label>
          <div class="flex gap-2">
            <button
              onClick={() => setSortBy("recent")}
              class={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                sortBy() === "recent"
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Plus récentes
            </button>
            <button
              onClick={() => setSortBy("oldest")}
              class={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                sortBy() === "oldest"
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Plus anciennes
            </button>
          </div>
        </div>

        {/* Filtrage par tags */}
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Filtrer par tag
          </label>
          <select
            value={selectedTag()}
            onChange={(e) => setSelectedTag(e.currentTarget.value)}
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
          >
            <option value="all">Tous les tags</option>
            <For each={allTags()}>
              {(tag) => <option value={tag}>{tag}</option>}
            </For>
          </select>
        </div>
      </div>

      {/* Liste des news */}
      <div class="w-full max-w-6xl">
        <Show
          when={!isLoading()}
          fallback={
            <div class="flex justify-center items-center py-20">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
          }
        >
          <Show
            when={filteredAndSortedNews().length > 0}
            fallback={
              <div class="text-center py-20">
                <p class="text-xl text-gray-400">
                  {selectedTag() !== "all"
                    ? "Aucune news avec ce tag."
                    : "Aucune news pour le moment."}
                </p>
                <Show when={!pb?.authStore.isValid}>
                  <p class="text-sm text-gray-500 mt-2">
                    Connectez-vous pour ajouter des news.
                  </p>
                </Show>
              </div>
            }
          >
            <div class="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <For each={filteredAndSortedNews()}>
                {(news) => <NewsItem news={news} />}
              </For>
            </div>
          </Show>
        </Show>
      </div>

      {/* Modal d'ajout de news */}
      <AddNewsModal
        isOpen={isModalOpen()}
        onClose={() => setIsModalOpen(false)}
        onNewsAdded={handleNewsAdded}
      />
    </main>
  );
}
