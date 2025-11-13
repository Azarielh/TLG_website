import { Title } from "@solidjs/meta";
import { createSignal, createEffect, For, Show, onMount } from "solid-js";
import { A } from "@solidjs/router";
import MainLogo from "../components/MainLogo";
import { usePocketBase } from "../app";
import type { NewsItemData } from "../components/NewsItem";
import "../app.css";

export default function Home() {
  const pb = usePocketBase();
  const [latestNews, setLatestNews] = createSignal<NewsItemData[]>([]);
  const [isLoadingNews, setIsLoadingNews] = createSignal(true);
  const [currentNewsIndex, setCurrentNewsIndex] = createSignal(0);
  
  // Taglines dynamiques
  const taglines = [
    "Nous construisons notre légende",
    "Une team, une passion, une victoire",
    "Champions aujourd'hui, légendes demain"
  ];
  const [currentTagline, setCurrentTagline] = createSignal(0);

  // Rotation des taglines
  onMount(() => {
    const taglineInterval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(taglineInterval);
  });

  // Charger les dernières news
  createEffect(async () => {
    if (!pb) return;
    try {
      const records = await pb.collection("news").getList(1, 3, {
        sort: "-created",
        filter: 'content != ""',
      });
      setLatestNews(records.items as unknown as NewsItemData[]);
    } catch (error) {
      console.error("Error loading latest news:", error);
    } finally {
      setIsLoadingNews(false);
    }
  });

  // Auto-rotation du carrousel
  createEffect(() => {
    if (latestNews().length === 0) return;
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % latestNews().length);
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

  return (
    <main id="home" class="pt-20 pb-16 px-4">
      <Title>TLG: The Legion - E-sport Excellence</Title>

      <section class="max-w-7xl mx-auto text-center mb-[2.5rem]">
        <div class="scale-125 mb-6">
          <MainLogo />
        </div>
        
        <div class="relative mb-[2.5rem] overflow-visible z-[99] min-h-[4rem]">
          <For each={taglines}>
            {(tagline, index) => (
              <p 
                class="absolute inset-x-0 flex items-center justify-center text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 transition-all duration-1000 z-[99] py-2"
                style={{
                  opacity: currentTagline() === index() ? 1 : 0,
                  transform: currentTagline() === index() ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                {tagline}
              </p>
            )}
          </For>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10 relative z-10">
          <div class="bg-gradient-to-br from-yellow-400/10 to-yellow-600/5 border border-yellow-400/30 rounded-xl p-4 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <div class="text-3xl font-black text-yellow-400 mb-1">100%</div>
            <div class="text-sm text-gray-400 font-medium">Engagement</div>
          </div>
          <div class="bg-gradient-to-br from-yellow-400/10 to-yellow-600/5 border border-yellow-400/30 rounded-xl p-4 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <div class="text-3xl font-black text-yellow-400 mb-1">24/7</div>
            <div class="text-sm text-gray-400 font-medium">Actif</div>
          </div>
          <div class="bg-gradient-to-br from-yellow-400/10 to-yellow-600/5 border border-yellow-400/30 rounded-xl p-4 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <div class="text-3xl font-black text-yellow-400 mb-1">∞</div>
            <div class="text-sm text-gray-400 font-medium">Potentiel</div>
          </div>
          <div class="bg-gradient-to-br from-yellow-400/10 to-yellow-600/5 border border-yellow-400/30 rounded-xl p-4 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <div class="text-3xl font-black text-yellow-400 mb-1">1</div>
            <div class="text-sm text-gray-400 font-medium">Membre</div>
          </div>
        </div>
      </section>

      <section class="max-w-6xl mx-auto mb-20">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl md:text-4xl font-black text-white">
            <span class="text-yellow-400">⚡</span> Dernières Actualités
          </h2>
          <A href="/news" class="px-6 py-3 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/30 hover:border-yellow-400 rounded-lg text-yellow-400 font-bold transition-all duration-300 hover:scale-105">
            Voir toutes →
          </A>
        </div>

        <Show when={!isLoadingNews() && latestNews().length > 0} fallback={
          <div class="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-12 text-center">
            <Show when={isLoadingNews()}>
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p class="text-gray-400">Chargement des actualités...</p>
            </Show>
            <Show when={!isLoadingNews() && latestNews().length === 0}>
              <p class="text-gray-400">Aucune actualité pour le moment.</p>
            </Show>
          </div>
        }>
          <div class="relative">
            <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 backdrop-blur-sm shadow-2xl mb-6">
              <For each={latestNews()}>
                {(news, index) => (
                  <div class="transition-all duration-700 ease-in-out" style={{
                    display: currentNewsIndex() === index() ? 'block' : 'none',
                    opacity: currentNewsIndex() === index() ? 1 : 0
                  }}>
                    <div class="p-8 md:p-12">
                      <Show when={news.tags && news.tags.length > 0}>
                        <div class="flex flex-wrap gap-2 mb-4">
                          <For each={news.tags.slice(0, 3)}>
                            {(tag) => (
                              <span class="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">{tag}</span>
                            )}
                          </For>
                        </div>
                      </Show>
                      <h3 class="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">{news.title}</h3>
                      <Show when={news.headlines}>
                        <p class="text-xl text-gray-300 mb-6 leading-relaxed">{news.headlines}</p>
                      </Show>
                      <div class="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-700/50">
                        <div class="flex items-center gap-4 text-sm text-gray-400">
                          <Show when={news.author}>
                            <span class="flex items-center gap-2">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {news.author}
                            </span>
                          </Show>
                          <span>•</span>
                          <time>{formatDate(news.created)}</time>
                        </div>
                        <A href="/news" class="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-black font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-400/20">
                          Lire l'article
                        </A>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>

            <Show when={latestNews().length > 1}>
              <div class="flex justify-center gap-2">
                <For each={latestNews()}>
                  {(_, index) => (
                    <button onClick={() => setCurrentNewsIndex(index())} class="transition-all duration-300" aria-label={`Aller à la news ${index() + 1}`}>
                      <div class={`h-2 rounded-full transition-all duration-300 ${currentNewsIndex() === index() ? 'w-8 bg-yellow-400' : 'w-2 bg-gray-600 hover:bg-gray-500'}`} />
                    </button>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </Show>
      </section>

      <section class="max-w-4xl mx-auto">
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400/20 via-yellow-600/10 to-transparent border border-yellow-400/30 p-12 text-center backdrop-blur-sm">
          <div class="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent blur-3xl"></div>
          <div class="relative z-10">
            <h2 class="text-3xl md:text-5xl font-black text-white mb-4">
              Prêt à rejoindre la <span class="text-yellow-400">Légion</span> ?
            </h2>
            <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Rejoignez notre communauté et soyez les premiers informés du lancement de notre plateforme e-sport.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <A href="/contact" class="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-black text-lg font-black transition-all duration-300 hover:scale-105 shadow-2xl shadow-yellow-400/30">
                Nous Contacter
              </A>
              <A href="/news" class="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-lg text-white text-lg font-bold transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                Découvrir Plus
              </A>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
