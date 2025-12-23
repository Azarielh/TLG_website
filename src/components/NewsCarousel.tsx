import { Component, Show, For, createEffect } from "solid-js";
import { A } from "@solidjs/router";
import type { NewsItemData } from "./NewsItem";

interface NewsCarouselProps {
  news: NewsItemData[];
  isLoading: boolean;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  compact?: boolean;
}

const NewsCarousel: Component<NewsCarouselProps> = (props) => {
  // Auto-rotation du carrousel
  createEffect(() => {
    if (props.news.length === 0) return;
    const interval = setInterval(() => {
      props.onIndexChange((props.currentIndex + 1) % props.news.length);
    }, 6000);
    return () => clearInterval(interval);
  });
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const getCarouselImageUrl = (news: any) => {
    if (news.image && news.collectionName && news.id) {
      const pbUrl = 'https://pocketbase-z88kow4kk8cow80ogcskoo08.caesarovich.xyz';
      return `${pbUrl}/api/files/${news.collectionName}/${news.id}/${news.image}`;
    }
    return null;
  };

  return (
    <Show when={!props.isLoading && props.news.length > 0} fallback={
      <div class="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-12 text-center">
        <Show when={props.isLoading}>
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p class="text-gray-400">Chargement des actualités...</p>
        </Show>
        <Show when={!props.isLoading && props.news.length === 0}>
          <p class="text-gray-400">Aucune actualité pour le moment.</p>
        </Show>
      </div>
    }>
      <div class="relative">
        <div class="relative overflow-hidden rounded-2xl border border-gray-700/50 shadow-2xl mb-6 min-h-[180px] md:min-h-[210px] flex items-center justify-center">
          <For each={props.news}>
            {(news, index) => {
              const imageUrl = getCarouselImageUrl(news);
              return (
              <A href="/news" class="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out cursor-pointer" style={{
                display: props.currentIndex === index() ? 'block' : 'none',
                opacity: props.currentIndex === index() ? 1 : 0
              }}>
                {/* Background image */}
                <Show when={imageUrl}>
                  <img 
                    src={imageUrl!} 
                    alt={news.title}
                    class="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </Show>

                {/* Overlay gradient pour la lisibilité */}
                <div class="absolute inset-0 bg-linear-to-t from-gray-900/95 via-gray-900/70 to-gray-900/40"></div>
                
                {/* Contenu avec positioning au-dessus du background */}
                <div class={`absolute inset-0 ${props.compact ? "p-4 sm:p-6" : "p-4 sm:p-6 md:p-10"} flex flex-col justify-end`}>
                  <h3 class={props.compact ? "text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 sm:mb-3 leading-tight" : "text-2xl sm:text-3xl md:text-5xl font-black text-white mb-3 sm:mb-4 leading-tight"} style="font-family: 'Varsity', serif;">{news.title}</h3>
                  <Show when={news.headlines} fallback={
                    <p class={props.compact ? "text-lg text-gray-300 mb-4 leading-relaxed italic" : "text-xl text-gray-300 mb-6 leading-relaxed italic"}>
                      [Aucun résumé disponible]
                    </p>
                  }>
                    <p class={props.compact ? "text-base sm:text-lg text-gray-300 mb-3 sm:mb-4 leading-relaxed" : "text-lg sm:text-xl text-gray-300 mb-4 sm:mb-6 leading-relaxed"}>{news.headlines}</p>
                  </Show>
                  <div class="flex flex-col items-center justify-center gap-2">
                    <time class="text-sm text-gray-300">{formatDate(news.created)}</time>

                    {/* Indicateurs intégrés au bloc pour la version compact (layout split) */}
                    <Show when={props.compact && props.news.length > 1}>
                      <div class="flex justify-center gap-2">
                        <For each={props.news}>
                          {(_, idx) => (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                props.onIndexChange(idx());
                              }}
                              class="transition-all duration-300"
                              aria-label={`Aller à la news ${idx() + 1}`}
                            >
                              <div class={`h-2 rounded-full transition-all duration-300 ${props.currentIndex === idx() ? 'w-8 bg-yellow-400' : 'w-2 bg-gray-400 hover:bg-gray-300'}`} />
                            </button>
                          )}
                        </For>
                      </div>
                    </Show>
                  </div>
                </div>
              </A>
            );
            }}
          </For>
        </div>

        <Show when={!props.compact && props.news.length > 1}>
          <div class="flex justify-center gap-2">
            <For each={props.news}>
              {(_, index) => (
                <button onClick={() => props.onIndexChange(index())} class="transition-all duration-300" aria-label={`Aller à la news ${index() + 1}`}>
                  <div class={`h-2 rounded-full transition-all duration-300 ${props.currentIndex === index() ? 'w-8 bg-yellow-400' : 'w-2 bg-gray-600 hover:bg-gray-500'}`} />
                </button>
              )}
            </For>
          </div>
        </Show>
      </div>
    </Show>
  );
};

export default NewsCarousel;
