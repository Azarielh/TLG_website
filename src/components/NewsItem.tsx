import { Component, Show } from "solid-js";

export interface NewsItemData {
  id: string;
  title: string;
  headlines?: string; // Phrase courte (optionnel)
  content: string;
  tags: string[];
  created: string;
  updated: string;
  author?: string;
  // Image uploadée via PocketBase (nom du fichier)
  image?: string;
  // OU vidéo via URL externe
  Video_Url?: string;
  collectionId?: string; // Pour construire l'URL du fichier PocketBase
  collectionName?: string;
}

interface NewsItemProps {
  news: NewsItemData;
}

const NewsItem: Component<NewsItemProps> = (props) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Construire l'URL du média (fichier PocketBase ou URL vidéo)
  const getImageUrl = () => {
    if (props.news.image && props.news.collectionName && props.news.id) {
      // Construire l'URL PocketBase pour l'image
      const pbUrl = 'https://pocketbase-z88kow4kk8cow80ogcskoo08.caesarovich.xyz';
      return `${pbUrl}/api/files/${props.news.collectionName}/${props.news.id}/${props.news.image}`;
    }
    return null;
  };

  const imageUrl = getImageUrl();
  const videoUrl = props.news.Video_Url || null;
  const hasMedia = imageUrl || videoUrl;

  return (
    <article class="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm hover:border-yellow-400/50 transition-all duration-500">
      {/* Glow effect sur hover */}
      <div class="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-yellow-600/0 group-hover:from-yellow-400/5 group-hover:to-yellow-600/5 transition-all duration-500 pointer-events-none"></div>
      
      <div class="relative z-10 p-8 md:p-10">
        {/* En-tête avec tags et date */}
        <div class="flex flex-wrap justify-between items-start gap-3 mb-6">
          <Show when={props.news.tags && props.news.tags.length > 0}>
            <div class="flex flex-wrap gap-2">
              {props.news.tags.map((tag) => (
                <span class="px-4 py-1.5 text-xs font-bold rounded-full bg-yellow-400/15 text-yellow-400 border border-yellow-400/40 backdrop-blur-sm hover:bg-yellow-400/25 hover:scale-105 transition-all duration-300 cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </Show>
          <time datetime={props.news.created} class="flex items-center gap-2 text-sm text-gray-400 font-medium whitespace-nowrap">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDate(props.news.created)}
          </time>
        </div>

        {/* Titre avec gradient */}
        <h2 class="text-3xl sm:text-5xl font-black mb-6 leading-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:via-yellow-200 group-hover:to-white transition-all duration-500">
          {props.news.title}
        </h2>

        {/* Phrase courte (headlines) avec design amélioré */}
        <Show when={props.news.headlines}>
          <div class="relative mb-8">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
              <p class="text-xl md:text-2xl text-gray-200 font-medium leading-relaxed pl-6 italic">
              "{props.news.headlines}"
            </p>
          </div>
        </Show>

        {/* Média (Image ou Vidéo) avec effets fancy */}
        <Show when={hasMedia}>
          <div class="relative w-full mb-10 group/media">
            {/* Container avec effet de bordure animée */}
            <div class="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400 rounded-2xl opacity-0 group-hover/media:opacity-100 blur-lg transition-all duration-500"></div>
            
            <div class="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-700/50 group-hover/media:ring-yellow-400/50 transition-all duration-500">
              <Show when={imageUrl}>
                {/* Overlay gradient sur hover */}
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                
                <img
                  src={imageUrl!}
                  alt={props.news.title}
                  class="w-full h-auto object-cover transform group-hover/media:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                
                {/* Icône zoom sur hover */}
                <div class="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-full p-3 opacity-0 group-hover/media:opacity-100 transition-all duration-300 z-20">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </Show>
              
              <Show when={videoUrl}>
                <video
                  controls
                  class="w-full h-auto"
                  preload="metadata"
                >
                  <source src={videoUrl!} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </Show>
            </div>
          </div>
        </Show>

        {/* Contenu complet avec meilleure typographie */}
        <Show when={props.news.content}>
          <div class="prose prose-lg prose-invert max-w-none mb-8">
            <div class="text-gray-200 text-lg leading-relaxed whitespace-pre-line [&>p]:mb-4">
              {props.news.content}
            </div>
          </div>
        </Show>

        {/* Footer : Auteur avec design amélioré */}
        <Show when={props.news.author}>
          <div class="flex items-center gap-3 pt-8 mt-8 border-t border-gray-700/50">
            <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-700/30 border border-gray-600/30 hover:border-yellow-400/40 transition-all duration-300">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500 font-medium">Rédigé par</span>
                <span class="font-bold text-white">{props.news.author}</span>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </article>
  );
};

export default NewsItem;
