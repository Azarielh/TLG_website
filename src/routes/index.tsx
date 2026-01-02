import { Title } from "@solidjs/meta";
import { createSignal, createEffect } from "solid-js";
import { A } from "@solidjs/router";
import HeroSection from "../components/HeroSection";
import NewsCarousel from "../components/NewsCarousel";
import JoinUs from "../components/JoinUs";
import { fetchLatestNews } from "../tools/fetchnews";
import { fetchUserCount } from "../tools/fetchstats";
import { usePocketBase } from "../app";
import type { NewsItemData } from "../components/NewsItem";
import "../app.css";

export default function Home() {
  const pb = usePocketBase();
  const [latestNews, setLatestNews] = createSignal<NewsItemData[]>([]);
  const [isLoadingNews, setIsLoadingNews] = createSignal(true);
  const [currentNewsIndex, setCurrentNewsIndex] = createSignal(0);
  const [userCount, setUserCount] = createSignal<number | undefined>(undefined);

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

  // Charger le nombre d'utilisateurs (client-only)
  createEffect(async () => {
    const client = pb;
    if (!client) return;
    try {
      const count = await fetchUserCount(client);
      setUserCount(count);
    } catch (error) {
      console.error("Error loading user count:", error);
    }
  });

  return (
    <main id="home" class="relative z-10 flex flex-col items-center justify-start pt-20 pb-32 px-4 sm:px-6 min-h-screen">
      <Title>TLG: The Legion - E-sport Excellence</Title>

      <HeroSection memberCount={userCount()} />

      <section class="mb-20">
        <div class="max-w-6xl mx-auto px-4 mb-8">
          <h2 class="text-3xl md:text-4xl font-black text-white" style="font-family: 'Varsity', serif;">
            <span class="text-yellow-400">⚡</span> <span class="bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">Dernières Actualités</span>
          </h2>
        </div>
        <NewsCarousel 
          news={latestNews()} 
          isLoading={isLoadingNews()} 
          currentIndex={currentNewsIndex()} 
          onIndexChange={setCurrentNewsIndex}
        />
      </section>

      <JoinUs />

    </main>
  );
}
