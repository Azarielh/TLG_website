import { Title } from "@solidjs/meta";
import { createSignal, onMount, For, Show } from "solid-js";
import { usePocketBase } from "../app";

interface Partner {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  category?: string;
}

export default function Partenariat() {
  const pb = usePocketBase();
  const [partners, setPartners] = createSignal<Partner[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);

  onMount(async () => {
    if (pb) {
      setIsLoading(true);
      try {
        const records = await pb.collection("Partners").getFullList<Partner>({
          sort: "-created"
        });
        setPartners(records);
      } catch (error) {
        console.error("Erreur lors du chargement des partenaires:", error);
      } finally {
        setIsLoading(false);
      }
    }
  });

  const getLogoUrl = (partner: Partner) => {
    if (!partner.logo || !pb) return "";
    return `${pb.baseUrl}/api/files/Partners/${partner.id}/${partner.logo}?download=false`;
  };

  return (
    <main class="relative z-10 flex flex-col items-center justify-start pt-20 pb-32 px-4 sm:px-6 min-h-screen">
      <Title>Partenariat - TLG</Title>

      <div class="w-full max-w-6xl">
        {/* Section présentation */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Offre Sponsoring */}
          <div class="bg-linear-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-yellow-400/50 transition-all duration-300">
            <div class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 mb-4">
              <span class="text-2xl">🤝</span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-3">Sponsoring</h3>
            <p class="text-gray-300 leading-relaxed">
              Soutenez nos équipes compétitives et bénéficiez d'une visibilité auprès d'une communauté passionnée de gamers et d'esportifs.
            </p>
          </div>

          {/* Offre Partenariat */}
          <div class="bg-linear-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-yellow-400/50 transition-all duration-300">
            <div class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 mb-4">
              <span class="text-2xl">🎯</span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-3">Partenariat</h3>
            <p class="text-gray-300 leading-relaxed">
              Collaborez avec nos créateurs de contenu et développez votre présence auprès de notre audience engagée.
            </p>
          </div>

          {/* Offre Personnalisée */}
          <div class="bg-linear-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-yellow-400/50 transition-all duration-300">
            <div class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 mb-4">
              <span class="text-2xl">⚡</span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-3">Offre Personnalisée</h3>
            <p class="text-gray-300 leading-relaxed">
              Des solutions sur mesure adaptées à vos objectifs marketing et budget.
            </p>
          </div>
        </div>

        {/* Avantages */}
        <div class="mb-16 bg-linear-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
          <h2 class="text-3xl font-bold text-yellow-400 mb-8 text-center">Pourquoi nous choisir ?</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex gap-4">
              <span class="text-2xl">📈</span>
              <div>
                <h4 class="font-bold text-white mb-2">Audience qualifiée</h4>
                <p class="text-gray-300">Une communauté engagée de gamers et de passionnés d'esports</p>
              </div>
            </div>
            <div class="flex gap-4">
              <span class="text-2xl">🌐</span>
              <div>
                <h4 class="font-bold text-white mb-2">Multi-plateforme</h4>
                <p class="text-gray-300">Présents sur Discord, YouTube, Twitch et réseaux sociaux</p>
              </div>
            </div>
            <div class="flex gap-4">
              <span class="text-2xl">🎬</span>
              <div>
                <h4 class="font-bold text-white mb-2">Contenu de qualité</h4>
                <p class="text-gray-300">Productions professsionnelles avec nos équipes créatives</p>
              </div>
            </div>
            <div class="flex gap-4">
              <span class="text-2xl">🚀</span>
              <div>
                <h4 class="font-bold text-white mb-2">En Pleine Croissance</h4>
                <p class="text-gray-300">Une jeune organisation ambitieuse et dynamique avec une communauté en expansion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nos Partenaires */}
        <div>
          <h2 class="text-3xl font-bold text-white mb-12 text-center">Nos Partenaires</h2>
          
          <Show when={isLoading()}>
            <div class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
          </Show>

          <Show when={!isLoading() && partners().length > 0}>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <For each={partners()}>
                {(partner) => (
                  <a
                    href={partner.website || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="bg-linear-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-yellow-400/50 transition-all duration-300 group flex flex-col h-full"
                  >
                    {/* Top section: Logo + Titre avec padding */}
                    <div class="p-6 flex flex-col items-center gap-4">
                      <Show
                        when={partner.logo}
                        fallback={
                          <div class="h-24 w-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                            <span class="text-4xl">🎮</span>
                          </div>
                        }
                      >
                        <div class="h-24 flex items-center justify-center">
                          <img
                            src={getLogoUrl(partner)}
                            alt={partner.name}
                            class="max-h-24 max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </Show>
                      <div class="text-center">
                        <h3 class="font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                          {partner.name}
                        </h3>
                        <Show when={partner.category}>
                          <p class="text-sm text-gray-400">{partner.category}</p>
                        </Show>
                      </div>
                    </div>

                    {/* Bottom section: Description centrée verticalement */}
                    <Show when={partner.description}>
                      <div class="flex-grow p-6 flex items-center justify-center">
                        <p class="text-xs text-gray-400 text-center">{partner.description}</p>
                      </div>
                    </Show>
                  </a>
                )}
              </For>
            </div>
          </Show>

          <Show when={!isLoading() && partners().length === 0}>
            <div class="text-center py-12">
              <p class="text-gray-400 text-lg mb-6">Aucun partenaire pour le moment</p>
            </div>
          </Show>
        </div>

        {/* CTA Partenariat */}
        <div class="mt-16 bg-gradient-to-r from-yellow-400/10 via-yellow-500/10 to-yellow-400/10 border border-yellow-400/30 rounded-2xl p-8 backdrop-blur-sm text-center">
          <h2 class="text-3xl font-black text-white mb-4" style="font-family: 'Varsity', serif;">
            Vous souhaitez devenir partenaire ?
          </h2>
          <p class="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Contactez-nous pour discuter d'une collaboration adaptée à vos besoins et objectifs
          </p>
          <a
            href="/contact"
            class="inline-block px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 rounded-xl text-black font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/50"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </main>
  );
}
