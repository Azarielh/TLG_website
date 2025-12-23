import { Title } from "@solidjs/meta";
import { createSignal, createEffect, For, Show, onMount } from "solid-js";
import { A } from "@solidjs/router";
import MainLogo from "../components/MainLogo";
import NewsCarousel from "../components/NewsCarousel";
import Taglines from "../components/Taglines";
import { fetchLatestNews } from "../tools/fetchnews";
import { usePocketBase } from "../app";
import type { NewsItemData } from "../components/NewsItem";
import "../app.css";

export default function Home() {
  const pb = usePocketBase();
  const [latestNews, setLatestNews] = createSignal<NewsItemData[]>([]);
  const [isLoadingNews, setIsLoadingNews] = createSignal(true);
  const [currentNewsIndex, setCurrentNewsIndex] = createSignal(0);
  const [layout, setLayout] = createSignal<'classic' | 'split'>('classic');

  // Charger les dernières news via utilitaire (client-only)
  createEffect(async () => {
    const client = pb;
    if (!client) return;
    try {
      setIsLoadingNews(true);
      const items = await fetchLatestNews(client, { perPage: 3 });
      setLatestNews(items);
    } catch (error) {
      console.error("Error loading latest news:", error);
    } finally {
      setIsLoadingNews(false);
    }
  });

  // Composant Stats Cards réutilisable
  const StatsCards = () => (
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto relative z-10">
      <div class="bg-linear-to-br from-yellow-400/10 to-yellow-600/5 border border-yellow-400/30 rounded-xl p-4 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
        <div class="text-3xl font-black text-yellow-400 mb-1">100%</div>
        <div class="text-sm text-gray-400 font-medium">Engagement</div>
      </div>
      <div class="bg-linear-to-br from-yellow-400/10 to-yellow-600/5 border border-yellow-400/30 rounded-xl p-4 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
        <div class="text-3xl font-black text-yellow-400 mb-1">24/7</div>
        <div class="text-sm text-gray-400 font-medium">Actif</div>
      </div>
      <div class="bg-linear-to-br from-yellow-400/10 to-yellow-600/5 border border-yellow-400/30 rounded-xl p-4 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
        <div class="text-3xl font-black text-yellow-400 mb-1">∞</div>
        <div class="text-sm text-gray-400 font-medium">Potentiel</div>
      </div>
      <div class="bg-linear-to-br from-yellow-400/10 to-yellow-600/5 border border-yellow-400/30 rounded-xl p-4 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
        <div class="text-3xl font-black text-yellow-400 mb-1">1</div>
        <div class="text-sm text-gray-400 font-medium">Membre</div>
      </div>
    </div>
  );

  // Composant CTA réutilisable
  const CTASection = () => (
    <section class="max-w-4xl mx-auto">
      <div class="relative overflow-hidden rounded-2xl bg-linear-to-br from-yellow-400/20 via-yellow-600/10 to-transparent border border-yellow-400/30 p-12 text-center backdrop-blur-sm">
        <div class="absolute inset-0 bg-linear-to-r from-yellow-400/10 to-transparent blur-3xl"></div>
        <div class="relative z-10">
          <h2 class="text-3xl md:text-5xl font-black text-white mb-4" style="font-family: 'Varsity', serif;">
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
  );

  return (
    <main id="home" class="pt-20 pb-32 px-4">
      <Title>TLG: The Legion - E-sport Excellence</Title>

      {/* Boutons de switch de layout */}
      <div class="fixed top-24 right-4 z-40 flex flex-col gap-2 backdrop-blur-sm">
        <button 
          onClick={() => setLayout('classic')}
          class={`px-4 py-2 rounded-lg font-bold transition-all duration-300 shadow-lg ${layout() === 'classic' ? 'bg-yellow-400 text-black' : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700'}`}
          aria-label="Layout Classique"
        >
          Classique
          
        </button>
        <button 
          onClick={() => setLayout('split')}
          class={`px-4 py-2 rounded-lg font-bold transition-all duration-300 shadow-lg ${layout() === 'split' ? 'bg-yellow-400 text-black' : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700'}`}
          aria-label="Layout Split"
        >
          Split
        </button>
      </div>

      {/* Layout Classique - Vertical classique */}
      <Show when={layout() === 'classic'}>
        <section class="max-w-7xl mx-auto text-center mb-10 relative">
          {/* Image de fond */}
          <div class="absolute inset-0 overflow-hidden rounded-2xl">
            <img 
              src="/pexels-yankrukov-9072394.jpg" 
              alt="Background" 
              class="w-full h-full object-cover opacity-20"
            />
          </div>
          
          {/* Contenu */}
          <div class="relative z-10">
            <div class="scale-125 mb-6">
              <MainLogo />
            </div>
            <Taglines />
            <StatsCards />
          </div>
        </section>

        <section class="max-w-6xl mx-auto mb-20">
          <h2 class="text-3xl md:text-4xl font-black text-white mb-8" style="font-family: 'Varsity', serif;">
            <span class="text-yellow-400">⚡</span> Dernières Actualités
          </h2>
          <NewsCarousel 
            news={latestNews()} 
            isLoading={isLoadingNews()} 
            currentIndex={currentNewsIndex()} 
            onIndexChange={setCurrentNewsIndex}
          />
        </section>

        <CTASection />
      </Show>

      {/* Layout Split - Logo à gauche, Carrousel à droite */}
      <Show when={layout() === 'split'}>
        <section class="max-w-7xl mx-auto mb-12 relative">
          {/* Image de fond */}
          <div class="absolute inset-0 overflow-hidden rounded-2xl">
            <img 
              src="/pexels-yankrukov-9072394.jpg" 
              alt="Background" 
              class="w-full h-full object-cover opacity-20"
            />
          </div>

          {/* Contenu */}
          <div class="relative z-10">
            {/* Taglines en haut centrées */}
            <div class="mb-8 text-center">
              <Taglines />
            </div>

            <div class="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-12">
              {/* Colonne gauche - Logo plus gros et centré verticalement */}
              <div class="text-center flex items-center justify-center">
                <div class="scale-[1.75]">
                  <MainLogo />
                </div>
              </div>

              {/* Colonne droite - Carrousel */}
              <div class="mt-2 md:mt-4">
                <NewsCarousel 
                  news={latestNews()} 
                  isLoading={isLoadingNews()} 
                  currentIndex={currentNewsIndex()} 
                  onIndexChange={setCurrentNewsIndex}
                  compact={true}
                />
              </div>
            </div>

            {/* Stats sous les actualités */}
            <div>
              <StatsCards />
            </div>
          </div>
        </section>

        <CTASection />
      </Show>


    </main>
  );
}
