import { Component, Show, createSignal, onMount } from "solid-js";
import { usePocketBase } from "../app";

export interface NewsItemData {
  id: string;
  title: string;
  headlines?: string;
  content: string;
  tags: string[];
  created: string;
  updated: string;
  author?: string;
  image?: string;
  video_url?: string;
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
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    setMounted(true);
    if (pb) {
      const check = () => {
        const rec = pb.authStore.record as any;
        // Priorité à la règle serveur (Rank)
        const serverRank = rec?.Rank as string | undefined;
        const isAdminOrDevServer = serverRank === 'Admin' || serverRank === 'Dev';
        // Fallback client pour dev/prévisualisation
        const r = rec?.role ?? rec?.rank;
        const roleLc = r ? String(r).toLowerCase() : '';
        const isAdminOrDevClient = roleLc === 'admin' || roleLc === 'dev';
        setIsAdminOrDev(!!rec && (isAdminOrDevServer || isAdminOrDevClient));
      };
      check();
      const unsub = pb.authStore.onChange(() => check());
      // cleanup non nécessaire ici (component persistent) — acceptable pour small app
    }
  });
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

  const normalizedTags = (() => {
    // Priorité à expand.tags (objets complets), sinon fallback sur tags (IDs)
    const expandedTags = (props.news as any).expand?.tags;
    
    if (expandedTags && Array.isArray(expandedTags)) {
      // Tags expandés : extraire le nom
      return expandedTags.map((t: any) => t?.name ?? t?.title ?? t?.id ?? '').filter(Boolean);
    }
    
    // Fallback : si tags est un tableau d'IDs ou de strings
    const rawTags = (props.news as any).tags;
    if (Array.isArray(rawTags)) {
      return rawTags.map((t: any) => {
        if (typeof t === 'string') {
          // Si c'est juste un ID, on ne peut pas afficher le nom sans expansion
          // On pourrait faire un lookup, mais mieux vaut s'assurer que expand fonctionne
          return '';
        }
        return t?.name ?? t?.title ?? t?.id ?? '';
      }).filter(Boolean);
    }
    
    return [] as string[];
  })();

  // Construire l'URL du média (fichier PocketBase ou URL vidéo)
  const getImageUrl = () => {
    // Priorité : image_url (URL externe)
    const imageUrl = (props.news as any).image_url;
    if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
      return imageUrl;
    }
    
    // Fallback : image (fichier uploadé sur PocketBase)
    if (props.news.image && props.news.collectionName && props.news.id) {
      const pbUrl = 'https://pocketbase-z88kow4kk8cow80ogcskoo08.caesarovich.xyz';
      return `${pbUrl}/api/files/${props.news.collectionName}/${props.news.id}/${props.news.image}`;
    }
    return null;
  };

  const imageUrl = getImageUrl();
  const videoUrl = props.news.video_url || null;
  const hasMedia = imageUrl || videoUrl;

  return (
    <article class="group relative bg-linear-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm hover:border-yellow-400/50 transition-all duration-500">
      {/* Glow effect sur hover */}
      <div class="absolute inset-0 bg-linear-to-br from-yellow-400/0 to-yellow-600/0 group-hover:from-yellow-400/5 group-hover:to-yellow-600/5 transition-all duration-500 pointer-events-none"></div>
      
      {/* Admin menu button - position absolue en haut à droite */}
      <Show when={mounted() && isAdminOrDev()}>
        <div class="absolute top-4 right-4 z-20">
          <button
            onClick={() => setMenuOpen(!menuOpen())}
            aria-label="Actions"
            class="p-2 rounded-md bg-gray-800/90 hover:bg-gray-700 border border-gray-700 text-gray-300 backdrop-blur-sm shadow-lg"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v.01M12 12v.01M12 18v.01" />
            </svg>
          </button>

          <Show when={menuOpen()}>
            <div class="absolute right-0 top-full mt-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('news:edit', { detail: { id: props.news.id } }));
                  setMenuOpen(false);
                }}
                class="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-t-md"
              >
                Modifier
              </button>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('news:delete', { detail: { id: props.news.id } }));
                  setMenuOpen(false);
                }}
                class="w-full text-left px-4 py-2 hover:bg-red-700 hover:text-white rounded-b-md"
              >
                Supprimer
              </button>
            </div>
          </Show>
        </div>
      </Show>

      <div class="relative z-10 p-8 md:p-10">
        {/* En-tête avec tags uniquement */}
        <Show when={normalizedTags && normalizedTags.length > 0}>
          <div class="flex flex-wrap gap-2 mb-6">
            {normalizedTags.map((tag) => (
              <span class="px-4 py-1.5 text-xs font-bold rounded-full bg-yellow-400/15 text-yellow-400 border border-yellow-400/40 backdrop-blur-sm hover:bg-yellow-400/25 hover:scale-105 transition-all duration-300 cursor-default">
                {tag}
              </span>
            ))}
          </div>
        </Show>

        {/* Titre avec gradient */}
        <h2 class={`text-3xl sm:text-5xl font-black mb-6 leading-tight bg-linear-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:via-yellow-200 group-hover:to-white transition-all duration-500 ${props.centerTitle ? 'text-center' : ''}`} style="font-family: 'Varsity', serif;">
          {props.news.title}
        </h2>

        {/* Layout responsive : image sous le titre (mobile) et à droite du texte (desktop) */}
        <div class="mb-10">
          <div class="flex flex-col md:flex-row md:items-start gap-6">
            {/* Media box: DOM-first so it appears under title on mobile, moved to right on md+ */}
            <Show when={hasMedia}>
              <div class="w-full md:w-1/3 md:min-w-[260px] shrink-0 ...">
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
                  <div class="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
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

        {/* Tags en bas de l'article (uniquement les tags associés à cet article) */}
        <Show when={normalizedTags && normalizedTags.length > 0}>
          <div class="mt-8 pt-6 border-t border-gray-700/50">
            <div class="flex flex-wrap gap-2">
              {normalizedTags.map((tag) => (
                <span class="px-4 py-1.5 text-xs font-bold rounded-full bg-yellow-400/15 text-yellow-400 border border-yellow-400/40 backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Show>

        {/* Footer : Auteur et date */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 mt-8 border-t border-gray-700/50">
          <Show when={props.news.author} fallback={
            <div class="flex-1"></div>
          }>
            <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-700/30 border border-gray-600/30 hover:border-yellow-400/40 transition-all duration-300">
              <div class="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500 font-medium">Rédigé par</span>
                <span class="font-bold text-white">{props.news.author}</span>
              </div>
            </div>
          </Show>
          
          <time datetime={props.news.created} class="flex items-center gap-2 text-sm text-gray-400 font-medium px-4 py-3 rounded-xl bg-gray-700/30 border border-gray-600/30">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDate(props.news.created)}
          </time>
        </div>
      </div>
    </article>
  );
};

export default NewsItem;
