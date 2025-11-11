import { Title } from "@solidjs/meta";
import { Component, createSignal, createMemo, For, Show } from "solid-js";
import NewsItem, { type NewsItemData } from "../components/NewsItem";
import AddNewsModal from "../components/AddNewsModal";
import { usePocketBase } from "../app";
import { createEffect } from "solid-js";

type SortOption = "recent" | "oldest";
type FilterTag = string | "all";

export default function News() {
  const pb = usePocketBase();
  const [newsItems, setNewsItems] = createSignal<NewsItemData[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [sortBy, setSortBy] = createSignal<SortOption>("recent");
  const [selectedTag, setSelectedTag] = createSignal<FilterTag>("all");
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [canAddNews, setCanAddNews] = createSignal(false); // Client-only pour éviter hydration mismatch

  // Fonction pour charger/recharger les news
  const loadNews = async () => {
    if (!pb) {
      console.error('❌ PocketBase not available (SSR context)');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const records = await pb.collection("news").getFullList({
        sort: "-created",
      });
      
      setNewsItems(records as unknown as NewsItemData[]);
    } catch (error) {
      console.error("❌ Error loading news:", error);
      setNewsItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les news au montage
  createEffect(() => {
    loadNews();
  });

  // Vérifier les permissions côté client uniquement
  createEffect(() => {
    if (pb) {
      // Vérifier immédiatement
      const checkPermissions = () => {
        const isValid = pb.authStore.isValid;
        const userRank = pb.authStore.record?.Rank;
        const allowedRanks = ['Dev', 'Admin', 'Staff']; // Ranks autorisés
        const hasAuthorizedRank = userRank && allowedRanks.includes(userRank);
        
        console.log('🔐 Checking permissions:', { 
          isValid, 
          userRank, 
          hasAuthorizedRank,
          allowedRanks 
        });
        
        setCanAddNews(isValid && hasAuthorizedRank);
      };
      
      checkPermissions();
      
      // Écouter les changements d'authentification
      const unsubscribe = pb.authStore.onChange(() => {
        console.log('🔄 Auth state changed');
        checkPermissions();
      });
      
      // Cleanup
      return () => {
        unsubscribe();
      };
    }
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
    <main class="relative z-10 flex flex-col items-center justify-start pt-20 pb-20 px-4 sm:px-6 min-h-screen">
      <Title>News - TLG</Title>

      {/* En-tête avec titre et bouton d'ajout */}
      <div class="w-full max-w-4xl mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white">Actualités</h1>
        
        {/* Bouton visible uniquement si connecté ET avec un Rank */}
        <Show when={canAddNews()} fallback={
          <div class="text-xs text-gray-600">
            {/* Debug invisible : {canAddNews() ? 'Authorized' : 'Not authorized'} */}
          </div>
        }>
          <button
            onClick={() => setIsModalOpen(true)}
            class="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-black font-bold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            + Ajouter une News
          </button>
        </Show>
      </div>

      {/* Filtres et tri */}
      <div class="w-full max-w-4xl mb-8">
        <div class="flex flex-wrap items-center gap-3 bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
          {/* Label */}
          <span class="text-gray-400 text-sm font-medium">Affichage :</span>
          
          {/* Tri chronologique - Pills style */}
          <div class="flex gap-2">
            <button
              onClick={() => setSortBy("recent")}
              class={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                sortBy() === "recent"
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/30"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              Récentes
            </button>
            <button
              onClick={() => setSortBy("oldest")}
              class={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                sortBy() === "oldest"
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/30"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              Anciennes
            </button>
          </div>

          {/* Séparateur vertical */}
          <div class="hidden sm:block w-px h-6 bg-gray-700"></div>

          {/* Filtrage par tags - Dropdown compact */}
          <div class="flex items-center gap-2">
            <span class="text-gray-400 text-sm font-medium hidden sm:inline">Tag :</span>
            <div class="relative">
              <select
                value={selectedTag()}
                onChange={(e) => setSelectedTag(e.currentTarget.value)}
                class="appearance-none pl-4 pr-10 py-1.5 bg-gray-700/50 border border-gray-600/50 rounded-full text-white text-sm font-medium hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 cursor-pointer transition-all"
              >
                <option value="all">Tous</option>
                <For each={allTags()}>
                  {(tag) => <option value={tag}>{tag}</option>}
                </For>
              </select>
              {/* Icône dropdown custom */}
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Indicateur de résultats */}
          <div class="ml-auto text-gray-500 text-sm font-medium">
            {filteredAndSortedNews().length} {filteredAndSortedNews().length > 1 ? 'news' : 'news'}
          </div>
        </div>
      </div>

      {/* Liste des news */}
      <div class="w-full max-w-4xl">
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
            {/* Format blog : liste verticale avec espacement */}
            <div class="flex flex-col gap-12">
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
