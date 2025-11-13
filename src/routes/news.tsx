import { Title } from "@solidjs/meta";
import { Component, createSignal, createMemo, For, Show, createEffect, onMount, onCleanup } from "solid-js";
import NewsItem, { type NewsItemData } from "../components/NewsItem";
import AddNewsModal from "../components/AddNewsModal";
import { usePocketBase } from "../app";

type SortOption = "recent" | "oldest";
type FilterTag = string | "all";

export default function News() {
  const pb = usePocketBase();
  const [newsItems, setNewsItems] = createSignal<NewsItemData[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [sortBy, setSortBy] = createSignal<SortOption>("recent");
  const [selectedTag, setSelectedTag] = createSignal<FilterTag>("all");
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [editNews, setEditNews] = createSignal<NewsItemData | null>(null);
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

  // Écouter les events dispatchés par les NewsItem (edit/delete)
  onMount(() => {
    const onEdit = (e: any) => {
      const id = e?.detail?.id;
      if (!id) return;
      const found = newsItems().find((n) => n.id === id);
      if (found) {
        setEditNews(found);
        setIsModalOpen(true);
      } else {
        // reload then try to find
        loadNews().then(() => {
          const f2 = newsItems().find((n) => n.id === id);
          if (f2) {
            setEditNews(f2);
            setIsModalOpen(true);
          }
        });
      }
    };

    const onDelete = async (e: any) => {
      const id = e?.detail?.id;
      if (!id || !pb) return;
      if (!confirm('Confirmez la suppression de cette news ?')) return;
      try {
        await pb.collection('news').delete(id);
        await loadNews();
      } catch (err) {
        console.error('❌ Error deleting news:', err);
        alert('Erreur lors de la suppression. Voir console.');
      }
    };

    window.addEventListener('news:edit', onEdit as EventListener);
    window.addEventListener('news:delete', onDelete as EventListener);

    onCleanup(() => {
      window.removeEventListener('news:edit', onEdit as EventListener);
      window.removeEventListener('news:delete', onDelete as EventListener);
    });
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

      {/* En-tête amélioré avec gradient */}
      <div class="w-full max-w-4xl mb-12">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
          <div class="text-center sm:text-left">
            <h1 class="text-4xl sm:text-6xl font-black mb-3 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              Actualités
            </h1>
            <p class="text-gray-400 text-lg">
              Restez informé de toutes nos actualités
            </p>
          </div>
          
          {/* Bouton visible uniquement si connecté ET avec un Rank */}
          <Show when={canAddNews()}>
            <button
              onClick={() => setIsModalOpen(true)}
              class="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 rounded-xl text-black font-black transition-all duration-300 hover:scale-105 shadow-xl shadow-yellow-400/30 hover:shadow-2xl hover:shadow-yellow-400/50"
            >
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter une News
              </span>
            </button>
          </Show>
        </div>

        {/* Filtres et tri améliorés */}
        <div class="flex flex-wrap items-center gap-3 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
          {/* Label avec icône */}
          <span class="flex items-center gap-2 text-gray-400 text-sm font-bold">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtres
          </span>
          
          {/* Tri chronologique - Pills style amélioré */}
          <div class="flex gap-2">
            <button
              onClick={() => setSortBy("recent")}
              class={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                sortBy() === "recent"
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/40 scale-105"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105"
              }`}
            >
              ⚡ Récentes
            </button>
            <button
              onClick={() => setSortBy("oldest")}
              class={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                sortBy() === "oldest"
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/40 scale-105"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105"
              }`}
            >
              📅 Anciennes
            </button>
          </div>

          {/* Séparateur vertical */}
          <div class="hidden sm:block w-px h-8 bg-gray-600/50"></div>

          {/* Filtrage par tags - Dropdown amélioré */}
          <div class="flex items-center gap-2">
            <span class="text-gray-400 text-sm font-bold hidden sm:inline">🏷️ Tag :</span>
            <div class="relative">
              <select
                value={selectedTag()}
                
                onChange={(e) => setSelectedTag(e.currentTarget.value)}
                class="appearance-none pl-4 pr-10 py-2 bg-gray-700/70 border border-gray-600/50 rounded-xl text-white text-sm font-bold hover:bg-gray-700 hover:border-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 cursor-pointer transition-all"
              >
                <option value="all">Tous les tags</option>
                <For each={allTags()}>
                  {(tag) => <option value={tag}>{tag}</option>}
                </For>
              </select>
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-400">
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Indicateur de résultats avec badge */}
          <div class="ml-auto flex items-center gap-2">
            <span class="text-gray-500 text-sm font-medium">Résultats :</span>
            <span class="px-3 py-1 bg-yellow-400/20 text-yellow-400 text-sm font-black rounded-lg border border-yellow-400/30">
              {filteredAndSortedNews().length}
            </span>
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
                {(news) => <NewsItem news={news} centerTitle={true} />}
              </For>
            </div>
          </Show>
        </Show>
      </div>

      {/* Modal d'ajout de news */}
      <AddNewsModal
        isOpen={isModalOpen()}
        onClose={() => {
          setIsModalOpen(false);
          setEditNews(null);
        }}
        onNewsAdded={handleNewsAdded}
        existingNews={editNews()}
        onNewsUpdated={() => {
          // after update, reload and close
          loadNews();
          setIsModalOpen(false);
          setEditNews(null);
        }}
      />
    </main>
  );
}
