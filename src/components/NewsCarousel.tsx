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
        <div class="relative overflow-hidden rounded-2xl border border-gray-700/50 shadow-2xl mb-6 w-[95vw] mx-auto min-h-[300px] md:min-h-[350px]">
          <For each={props.news}>
            {(news, index) => {
              const imageUrl = getCarouselImageUrl(news);
              return (
              <A href="/news" class="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out cursor-pointer" style={{
                display: props.currentIndex === index() ? 'block' : 'none',
                opacity: props.currentIndex === index() ? 1 : 0
              }}>
                {/* Layout: Image 100% en arrière-plan, partie gauche en overlay */}
                <div class="w-full h-full relative">
                  {/* Background image 100% */}
                  <Show when={imageUrl}>
                    <img 
                      src={imageUrl!} 
                      alt={news.title}
                      class="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  </Show>

                  {/* Overlay gradient pour la lisibilité globale */}
                  <div class="absolute inset-0 bg-linear-to-r from-gray-900/90 via-gray-900/50 to-transparent z-0"></div>
                  
                  {/* Partie gauche: 20% - Titre, Author, Date - overlay translucide */}
                  <div class="absolute left-0 top-0 h-full w-1/5 bg-gray-900/80 p-6 flex flex-col justify-between relative z-10">
                    <div>
                      <h3 class="text-xl font-black text-white mb-4 leading-tight line-clamp-5 break-keep hyphens-none" style="font-family: 'Varsity', serif;">
                        {news.title}
                      </h3>
                      
                      {/* Ligne de séparation */}
                      <div class="border-b border-gray-600 mb-4"></div>
                      
                      {/* Auteur */}
                      <Show when={news.author}>
                        <p class="text-sm text-gray-300 font-medium">Par {news.author}</p>
                      </Show>
                    </div>
                    
                    {/* Tags - centré verticalement */}
                    <Show when={news.tags && news.tags.length > 0}>
                      <div class="flex flex-wrap gap-2 justify-center items-center content-center">
                        <For each={news.tags}>
                          {(tag: any) => {
                            // Extraire le nom du tag, peu importe le format
                            let tagName = '';
                            if (typeof tag === 'string') {
                              tagName = tag;
                            } else if (tag?.name) {
                              tagName = tag.name;
                            } else if (tag?.title) {
                              tagName = tag.title;
                            } else if (tag?.id) {
                              // Fallback à l'ID si rien d'autre n'est disponible
                              tagName = tag.id;
                            } else {
                              tagName = String(tag);
                            }
                            return (
                              <span class="inline-block px-2 py-1 text-xs bg-yellow-400/20 text-yellow-300 border border-yellow-400/50 rounded">
                                {tagName}
                              </span>
                            );
                          }}
                        </For>
                      </div>
                    </Show>
                    
                    {/* Date en bas */}
                    <time class="text-sm text-gray-400">{formatDate(news.created)}</time>
                  </div>

                  {/* Partie droite: 80% - Headlines */}
                  <div class="absolute right-0 top-0 h-full w-4/5 p-6 md:p-8 flex flex-col justify-end items-start z-20 bg-gradient-to-l from-black/60 to-transparent">
                    <Show when={news.headlines && news.headlines.trim()} fallback={
                      <p class="text-lg text-gray-400 leading-relaxed italic">
                        [Aucun résumé disponible]
                      </p>
                    }>
                      <p class="text-base md:text-lg text-white leading-relaxed font-medium drop-shadow-2xl max-w-2xl text-left">
                        {news.headlines}
                      </p>
                    </Show>
                  </div>
                </div>
              </A>
            );
            }}
          </For>
        </div>

        {/* Indicateurs de navigation */}
        <Show when={props.news.length > 1}>
          <div class="flex justify-center gap-2 mt-6">
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

