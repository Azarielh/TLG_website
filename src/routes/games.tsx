import { Title } from "@solidjs/meta";
import { createSignal, For, Show, onMount } from "solid-js";
import { usePocketBase } from "../app";

type GameRecord = {
  id: string;
  name: string;
  status?: string;
  how_many_roster?: number;
  winrate?: number;
};

// Mapping des couleurs par nom de jeu (basé sur la liste React fournie)
const GAME_COLORS: Record<string, { gradient: string; bg: string; border: string }> = {
  "valorant": {
    gradient: "from-red-500 to-pink-500",
    bg: "bg-red-500/10",
    border: "border-red-500/30"
  },
  "cs:go": {
    gradient: "from-orange-500 to-yellow-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30"
  },
  "rocket league": {
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30"
  },
  "delta force": {
    gradient: "from-green-500 to-emerald-500",
    bg: "bg-green-500/10",
    border: "border-green-500/30"
  },
  "among us": {
    gradient: "from-purple-500 to-pink-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30"
  },
  "fc25": {
    gradient: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30"
  },
  "fortnite": {
    gradient: "from-violet-500 to-purple-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30"
  },
  "league of legends": {
    gradient: "from-teal-500 to-cyan-500",
    bg: "bg-teal-500/10",
    border: "border-teal-500/30"
  },
  "roblox": {
    gradient: "from-pink-500 to-rose-500",
    bg: "bg-pink-500/10",
    border: "border-pink-500/30"
  },
  "teamfight tactics": {
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30"
  },
  // Fallback par défaut
  "default": {
    gradient: "from-gray-500 to-slate-500",
    bg: "bg-gray-500/10",
    border: "border-gray-500/30"
  }
};

const GAME_LOGOS: Record<string, string> = {
  "valorant": "/V_Logomark_Red.png",
  "league of legends": "/lol-logo-rendered-hi-res.png",
  "teamfight tactics": "/TFT_Logomark_Black.png",
};

export default function Games() {
  const pb = usePocketBase();
  const [games, setGames] = createSignal<GameRecord[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  onMount(async () => {
    if (!pb) {
      setError("PocketBase non disponible (SSR)");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const records = await pb.collection("Games").getFullList({ sort: "name" });
      setGames(records as unknown as GameRecord[]);
    } catch (err) {
      console.error("❌ Error loading Games:", err);
      setError("Impossible de charger les jeux");
      setGames([]);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <section id="games" class="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <Title>Jeux - TLG</Title>

      {/* Background Effect */}
      <div class="absolute inset-0 bg-linear-to-b from-transparent via-[#a855f7]/5 to-transparent" />

      <div class="relative max-w-7xl mx-auto">
        {/* Header */}
        <div class="text-center mb-16">
          <div class="inline-block px-4 py-2 bg-[#00e5ff]/10 border border-[#00e5ff]/30 rounded-full mb-4">
            <span class="text-[#00e5ff] tracking-wider">NOS DISCIPLINES</span>
          </div>
          <h2 class="text-5xl sm:text-6xl font-black mb-4 bg-linear-to-r from-[#00e5ff] via-[#a855f7] to-[#ff006e] bg-clip-text text-transparent" style="font-family: 'Varsity', serif;">
            10 Jeux, Une Ambition
          </h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">
            Nous construisons notre présence sur les principales scènes compétitives. Chaque match nous rapproche de la grandeur.
          </p>
        </div>

        {/* Error State */}
        <Show when={error()}>
          <div class="w-full mb-6 px-4 py-3 rounded-xl border border-red-500/40 bg-red-500/10 text-red-200 text-center">
            {error()}
          </div>
        </Show>

        {/* Loading State */}
        <Show
          when={!isLoading()}
          fallback={
            <div class="flex items-center justify-center py-16">
              <div class="flex items-center gap-3 text-gray-300">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00e5ff]" />
                <span class="text-lg">Chargement des jeux...</span>
              </div>
            </div>
          }
        >
          {/* Games Grid */}
          <Show
            when={games().length > 0}
            fallback={
              <div class="text-center text-gray-400 py-12">
                Aucun jeu trouvé pour le moment.
              </div>
            }
          >
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <For each={games()}>
                {(game) => {
                  const themeKey = (game.name || "").trim().toLowerCase();
                  const colors = GAME_COLORS[themeKey] ?? GAME_COLORS.default;
                  const logoSrc = GAME_LOGOS[themeKey];
                  const logoSize = themeKey === 'teamfight tactics'
                    ? 'w-[92px] h-[92px]'
                    : themeKey === 'valorant'
                      ? 'w-[76px] h-[76px]'
                      : 'w-[64px] h-[64px]';

                  return (
                    <div
                      class={`group relative p-8 ${colors.bg} border ${colors.border} rounded-2xl backdrop-blur-sm overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:-translate-y-1`}
                    >
                      <Show when={logoSrc}>
                        <div
                          class="absolute inset-0 pointer-events-none opacity-10"
                          style={{
                            "background-image": `url(${logoSrc})`,
                            "background-repeat": "no-repeat",
                            "background-size": "110%",
                            "background-position": "center",
                          }}
                        />
                      </Show>
                      {/* Hover Gradient Effect */}
                      <div class={`absolute inset-0 bg-linear-to-br ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />

                      <div class="relative z-10">
                        {/* Header with icons */}
                        <div class="flex items-start justify-between mb-6">
                          {logoSrc ? (
                            <img
                              src={logoSrc}
                              alt={`${game.name} logo`}
                              class={`${logoSize} object-contain`}
                              loading="lazy"
                              style={themeKey === 'valorant' ? { filter: 'grayscale(1) brightness(0)' } : undefined}
                            />
                          ) : (
                            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                            </svg>
                          )}
                          <div class={`px-3 py-1 bg-linear-to-r ${colors.gradient} rounded-full`}>
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20 2H4c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h1v1c0 2.97 2.16 5.43 5 5.91V19H8c-1.1 0-2 .9-2 2h12c0-1.1-.9-2-2-2h-2v-3.09c2.84-.48 5-2.94 5-5.91v-1h1c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 7c0 2.21-1.79 4-4 4s-4-1.79-4-4V5h8v4z"/>
                            </svg>
                          </div>
                        </div>

                        {/* Game Title */}
                        <h3 class="text-2xl font-black mb-4 text-white" style="font-family: 'Varsity', serif;">{game.name}</h3>

                        {/* Status Badge and CTA Button */}
                        <div class="flex items-center justify-between mb-6">
                          <div class={`flex items-center px-3 py-1 rounded-full ${colors.bg} ${colors.border} border`}>
                            <span class={`text-xs font-semibold bg-linear-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                              {game.status === 'open' ? 'Roster en formation' : game.status || 'En développement'}
                            </span>
                          </div>
                          <Show when={(game.how_many_roster ?? 0) > 0}>
                            <a
                              href="https://discord.gg/3SP3kdu3gJ"
                              target="_blank"
                              rel="noopener noreferrer"
                              class={`px-5 py-1.5 bg-linear-to-r ${colors.gradient} rounded-lg text-white text-sm font-semibold hover:shadow-lg transition-all hover:scale-[1.05]`}
                            >
                              Rejoindre
                            </a>
                          </Show>
                        </div>

                        {/* Stats */}
                        <div class="flex items-center justify-between pt-4 border-t border-white/10">
                          <div>
                            <div class="text-sm text-gray-400">Roster</div>
                            <Show
                              when={(game.how_many_roster ?? 0) === 0}
                              fallback={
                                <div class={`text-xl font-black bg-linear-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                                  {game.how_many_roster ?? "Bientôt"}
                                </div>
                              }
                            >
                              <a
                                href="https://discord.gg/3SP3kdu3gJ"
                                target="_blank"
                                rel="noopener noreferrer"
                                class={`inline-block px-4 py-1.5 bg-linear-to-r ${colors.gradient} rounded-lg text-white text-sm font-semibold hover:shadow-lg transition-all hover:scale-[1.05]`}
                              >
                                Rejoindre
                              </a>
                            </Show>
                          </div>
                          <div>
                            <div class="text-sm text-gray-400">Winrate</div>
                            <div class={`text-xl font-black bg-linear-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                              {game.winrate != null ? `${game.winrate}%` : "Bientôt"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Decorative Corner */}
                      <div class={`absolute -bottom-8 -right-8 w-32 h-32 bg-linear-to-br ${colors.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                    </div>
                  );
                }}
              </For>
            </div>
          </Show>
        </Show>

        {/* CTA Section */}
        <div class="mt-16 p-8 bg-linear-to-r from-[#00e5ff]/10 via-[#a855f7]/10 to-[#ff006e]/10 border border-white/10 rounded-2xl text-center">
          <h3 class="text-2xl font-black mb-3" style="font-family: 'Varsity', serif;">Rejoins l'Aventure</h3>
          <p class="text-gray-400 mb-6">
            Nous recrutons activement des talents exceptionnels sur tous nos titres compétitifs. Construis ta légende avec nous.
          </p>
          <a
            href="https://discord.gg/3SP3kdu3gJ"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block px-8 py-3 bg-linear-to-r from-[#00e5ff] via-[#a855f7] to-[#ff006e] rounded-xl hover:shadow-2xl hover:shadow-[#00e5ff]/50 transition-all font-semibold"
          >
            Postuler Maintenant
          </a>
        </div>
      </div>
    </section>
  );
}