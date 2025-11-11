import { Component, Show } from "solid-js";

export interface NewsItemData {
  id: string;
  title: string;
  excerpt: string; // Phrase courte
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
    <article class="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 shadow-lg hover:translate-y-[-4px] transition-all duration-300 hover:border-yellow-400/50">
      {/* Tags */}
      <Show when={props.news.tags && props.news.tags.length > 0}>
        <div class="flex flex-wrap gap-2 mb-4">
          {props.news.tags.map((tag) => (
            <span class="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
              {tag}
            </span>
          ))}
        </div>
      </Show>

      {/* Titre */}
      <h3 class="text-2xl sm:text-3xl font-bold mb-3 text-white">{props.news.title}</h3>

      {/* Phrase courte (excerpt) */}
      <Show when={props.news.excerpt}>
        <p class="text-lg text-yellow-400/90 font-medium mb-4 italic">
          {props.news.excerpt}
        </p>
      </Show>

      {/* Média (Image ou Vidéo) */}
      <Show when={hasMedia}>
        <div class="w-full mb-6 rounded-lg overflow-hidden bg-black/20">
          <Show when={props.news.mediaType === 'image'}>
            <img
              src={mediaUrl!}
              alt={props.news.title}
              class="w-full h-auto object-contain max-h-[500px]"
            />
          </Show>
          <Show when={props.news.mediaType === 'video'}>
            <video
              controls
              class="w-full h-auto max-h-[500px]"
            >
              <source src={mediaUrl!} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </Show>
        </div>
      </Show>

      {/* Contenu complet */}
      <div class="text-gray-300 leading-relaxed mb-6 whitespace-pre-line prose prose-invert max-w-none">
        {props.news.content}
      </div>

      {/* Footer : Auteur et Date */}
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-4 border-t border-gray-700/50 text-sm text-gray-400">
        <Show when={props.news.author}>
          <span class="font-medium">Par {props.news.author}</span>
        </Show>
        <time datetime={props.news.created}>
          {formatDate(props.news.created)}
        </time>
      </div>
    </article>
  );
};

export default NewsItem;
