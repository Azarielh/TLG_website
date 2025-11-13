import { Component, Show, createSignal } from "solid-js";
import { usePocketBase } from "../app";

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
  centerTitle?: boolean;
}

const NewsItem: Component<NewsItemProps> = (props) => {
  const pb = usePocketBase();
  const [menuOpen, setMenuOpen] = createSignal(false);

  // Vérifier si l'utilisateur a le rôle Admin/Dev pour afficher le bouton (reactif)
  const [isAdminOrDev, setIsAdminOrDev] = createSignal(false);

  if (pb) {
    const check = () => {
      const r = pb.authStore.record?.Rank;
      setIsAdminOrDev(!!r && (r === 'Admin' || r === 'Dev'));
    };
    check();
    const unsub = pb.authStore.onChange(() => check());
    // cleanup non nécessaire ici (component persistent) — acceptable for small app
  }
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
        <div class="flex flex-wrap justify-between items-start gap-3 mb-6 relative">
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

          {/* Admin menu button (only for Admin/Dev) */}
          <Show when={isAdminOrDev}>
            <div class="ml-2 relative">
              <button
                onClick={() => setMenuOpen(!menuOpen())}
                aria-label="Actions"
                class="p-2 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v.01M12 12v.01M12 18v.01" />
                </svg>
              </button>

              <Show when={menuOpen()}>
                <div class="absolute right-full top-0 mr-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                  <button
                    onClick={() => {
                      // Dispatch custom event to let parent handle edit
                      window.dispatchEvent(new CustomEvent('news:edit', { detail: { id: props.news.id } }));
                      setMenuOpen(false);
                    }}
                    class="w-full text-left px-4 py-2 hover:bg-gray-700"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      // Dispatch custom event to let parent handle delete
                      window.dispatchEvent(new CustomEvent('news:delete', { detail: { id: props.news.id } }));
                      setMenuOpen(false);
                    }}
                    class="w-full text-left px-4 py-2 hover:bg-red-700 hover:text-white"
                  >
                    Supprimer
                  </button>
                </div>
              </Show>
            </div>
          </Show>
        </div>

        {/* Titre avec gradient */}
        <h2 class={`text-3xl sm:text-5xl font-black mb-6 leading-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:via-yellow-200 group-hover:to-white transition-all duration-500 ${props.centerTitle ? 'text-center' : ''}`}>
          {props.news.title}
        </h2>

        {/* Layout responsive : image sous le titre (mobile) et à droite du texte (desktop) */}
        <div class="mb-10">
          <div class="flex flex-col md:flex-row md:items-start gap-6">
            {/* Media box: DOM-first so it appears under title on mobile, moved to right on md+ */}
            <Show when={hasMedia}>
              <div class="w-full md:w-1/3 order-first md:order-2">
                <div class="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-700/50 group-hover:ring-yellow-400/50 transition-all duration-500">
                  <Show when={imageUrl}>
                    <img
                      src={imageUrl!}
                      alt={props.news.title}
                      class="w-full h-48 md:h-[220px] lg:h-[260px] object-cover block"
                      loading="lazy"
                    />
                  </Show>

                  <Show when={videoUrl}>
                    <video controls class="w-full h-48 md:h-[220px] lg:h-[260px] object-cover block" preload="metadata">
                      <source src={videoUrl!} type="video/mp4" />
                      Votre navigateur ne supporte pas la lecture de vidéos.
                    </video>
                  </Show>
                </div>
              </div>
            </Show>

            {/* Texte (headlines + content) */}
            <div class="flex-1 order-last md:order-1">
              {/* Phrase courte (headlines) avec design amélioré */}
              <Show when={props.news.headlines}>
                <div class="relative mb-6">
                  <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                  <p class="text-xl md:text-2xl text-gray-200 font-medium leading-relaxed pl-6 italic">
                    "{props.news.headlines}"
                  </p>
                </div>
              </Show>

              {/* Contenu complet avec meilleure typographie */}
              <Show when={props.news.content}>
                <div class="prose prose-lg prose-invert max-w-none">
                  <div class="text-gray-200 text-lg leading-relaxed whitespace-pre-line [&>p]:mb-4">
                    {props.news.content}
                  </div>
                </div>
              </Show>
            </div>
          </div>
        </div>

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
