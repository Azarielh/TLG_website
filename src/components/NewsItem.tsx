import { Component, Show } from "solid-js";

export interface NewsItemData {
  id: string;
  title: string;
  excerpt?: string; // Phrase courte (optionnel)
  content: string;
  tags: string[];
  created: string;
  updated: string;
  author?: string;
  // Média par fichier (upload PocketBase)
  media?: string; // Nom du fichier
  // OU média par URL
  mediaUrl?: string; // URL externe
  mediaType?: 'image' | 'video' | 'none'; // Type de média
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

  // Construire l'URL du média (fichier PocketBase ou URL externe)
  const getMediaUrl = () => {
    if (props.news.mediaUrl) {
      return props.news.mediaUrl; // URL externe
    }
    if (props.news.media && props.news.collectionName && props.news.id) {
      // Construire l'URL PocketBase
      const pbUrl = 'https://pocketbase-z88kow4kk8cow80ogcskoo08.caesarovich.xyz';
      return `${pbUrl}/api/files/${props.news.collectionName}/${props.news.id}/${props.news.media}`;
    }
    return null;
  };

  const mediaUrl = getMediaUrl();
  const hasMedia = props.news.mediaType && props.news.mediaType !== 'none' && mediaUrl;

  return (
    <article class="bg-gray-800/40 border border-gray-700/50 rounded-xl p-8 shadow-xl backdrop-blur-sm">
      {/* En-tête avec tags et date */}
      <div class="flex flex-wrap justify-between items-start gap-3 mb-6">
        <Show when={props.news.tags && props.news.tags.length > 0}>
          <div class="flex flex-wrap gap-2">
            {props.news.tags.map((tag) => (
              <span class="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
                {tag}
              </span>
            ))}
          </div>
        </Show>
        <time datetime={props.news.created} class="text-sm text-gray-500 whitespace-nowrap">
          {formatDate(props.news.created)}
        </time>
      </div>

      {/* Titre */}
      <h2 class="text-3xl sm:text-4xl font-bold mb-4 text-white leading-tight">
        {props.news.title}
      </h2>

      {/* Phrase courte (excerpt) */}
      <Show when={props.news.excerpt}>
        <p class="text-xl text-gray-300 font-medium mb-6 leading-relaxed border-l-4 border-yellow-400 pl-4 italic">
          {props.news.excerpt}
        </p>
      </Show>

      {/* Média (Image ou Vidéo) */}
      <Show when={hasMedia}>
        <div class="w-full mb-8 rounded-xl overflow-hidden bg-black/20 shadow-lg">
          <Show when={props.news.mediaType === 'image'}>
            <img
              src={mediaUrl!}
              alt={props.news.title}
              class="w-full h-auto object-cover"
            />
          </Show>
          <Show when={props.news.mediaType === 'video'}>
            <video
              controls
              class="w-full h-auto"
            >
              <source src={mediaUrl!} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </Show>
        </div>
      </Show>

      {/* Contenu complet */}
      <Show when={props.news.content}>
        <div class="text-gray-300 text-lg leading-relaxed mb-8 whitespace-pre-line">
          {props.news.content}
        </div>
      </Show>

      {/* Footer : Auteur */}
      <Show when={props.news.author}>
        <div class="flex items-center gap-3 pt-6 border-t border-gray-700/50">
          <div class="flex items-center gap-2 text-gray-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="font-medium">Par {props.news.author}</span>
          </div>
        </div>
      </Show>
    </article>
  );
};

export default NewsItem;
