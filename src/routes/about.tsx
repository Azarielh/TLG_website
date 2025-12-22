import { Title } from "@solidjs/meta";
import { createSignal, onMount } from "solid-js";
import { usePocketBase } from "../app";

export default function About() {
  const pb = usePocketBase();
  const [isAuthorized, setIsAuthorized] = createSignal(false);

  const checkAuthorization = () => {
    if (!pb || !pb.authStore.isValid) return false;
    
    const record = pb.authStore.record;
    if (!record) return false;

    // Vérifier le rôle
    const serverRank = (record.Rank as string | undefined) || undefined;
    const canByServerRule = serverRank === 'Admin' || serverRank === 'Dev';
    
    // Fallback client
    const userRoleRaw = (record.role ?? record.rank) as string | undefined;
    const userRoleLc = userRoleRaw ? String(userRoleRaw).trim().toLowerCase() : undefined;
    const canByClientRole = userRoleLc ? ['admin', 'dev', 'staff'].includes(userRoleLc) : false;

    return canByServerRule || canByClientRole;
  };

  // Vérifier l'autorisation au montage côté client uniquement
  onMount(() => {
    setIsAuthorized(checkAuthorization());
  });

  return (
      <main class="relative z-10 flex flex-col items-center justify-start pt-20 pb-32 px-4 sm:px-6 min-h-screen">
        <Title>A propos - TLG</Title>
        
        {/* En-tête avec gradient */}
        <div class="text-center mb-16 max-w-4xl">
          <h1 class="text-4xl sm:text-6xl font-black mb-4 bg-linear-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent" style="font-family: 'Varsity', serif;">
            À propos de TLG
          </h1>
          <p class="text-gray-400 text-lg sm:text-xl">
            Découvrez nos valeurs et ce qui fait de TLG une organisation unique
          </p>
        </div>

        {/* Première ligne : Histoire et Palmarès (caché avec CSS si non autorisé) */}
        <div class="flex flex-col md:flex-row gap-8 w-full max-w-7xl mb-8" style={{"display": isAuthorized() ? "flex" : "none"}}>
          {/* Card Histoire */}
          <article class="bg-linear-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl flex-1 hover:-translate-y-2 hover:border-yellow-400/50 transition-all duration-300 backdrop-blur-sm group">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 bg-linear-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 class="text-2xl font-black text-white" style="font-family: 'Varsity', serif;">Histoire</h3>
            </div>
            <p class="text-gray-300 text-lg leading-relaxed">
              L'histoire de TLG, de ses débuts à aujourd'hui.
            </p>
            <div class="mt-6 text-sm text-gray-400 italic">
              Contenu à venir...
            </div>
          </article>

          {/* Card Palmarès */}
          <article class="bg-linear-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl flex-1 hover:-translate-y-2 hover:border-yellow-400/50 transition-all duration-300 backdrop-blur-sm group">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 bg-linear-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" />
                </svg>
              </div>
              <h3 class="text-2xl font-black text-white" style="font-family: 'Varsity', serif;">Palmarès</h3>
            </div>
            <p class="text-gray-300 text-lg leading-relaxed">
              Nos victoires et accomplissements en compétition.
            </p>
            <div class="mt-6 text-sm text-gray-400 italic">
              Contenu à venir...
            </div>
          </article>
        </div>

        {/* Deuxième ligne : Esprit d'équipe, Compétitif, Ambiance */}
        <div class="flex flex-col md:flex-row flex-wrap justify-center items-stretch gap-8 w-full max-w-7xl">
          
          {/* Card 1 - Esprit d'équipe */}
          <article class="bg-linear-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl flex-1 min-w-[18rem] md:max-w-[30%] hover:-translate-y-2 hover:border-yellow-400/50 transition-all duration-300 backdrop-blur-sm group">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-14 h-14 bg-linear-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 class="text-2xl font-black text-white" style="font-family: 'Varsity', serif;">Esprit d'équipe</h3>
            </div>
            <p class="mt-4 text-gray-300 text-lg leading-relaxed">
              Une organisation en squads, un encadrement attentif et une
              dynamique de progression commune.
            </p>
            <ul class="mt-6 space-y-3 text-sm text-gray-400">
              <li class="flex items-start gap-2">
                <span class="text-yellow-400 mt-0.5">✓</span>
                <span>Squads organisées pour responsabiliser les joueurs</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-yellow-400 mt-0.5">✓</span>
                <span>Leads attentifs qui accompagnent la montée en compétences</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-yellow-400 mt-0.5">✓</span>
                <span>Parcours de progression partagés et mesurables</span>
              </li>
            </ul>
          </article>

          {/* Card 2 - Compétitif */}
          <article class="bg-linear-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl flex-1 min-w-[18rem] md:max-w-[30%] hover:-translate-y-2 hover:border-yellow-400/50 transition-all duration-300 backdrop-blur-sm group">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-14 h-14 bg-linear-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 class="text-2xl font-black text-white" style="font-family: 'Varsity', serif;">Compétitif</h3>
            </div>
            <p class="mt-4 text-gray-300 text-lg leading-relaxed">
              Des entraînements réguliers, des tournois encadrés et un
              accompagnement par la communauté.
            </p>
            <ul class="mt-6 space-y-3 text-sm text-gray-400">
              <li class="flex items-start gap-2">
                <span class="text-yellow-400 mt-0.5">✓</span>
                <span>Scrims hebdomadaires pour se tester</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-yellow-400 mt-0.5">✓</span>
                <span>Tournois internes et externes</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-yellow-400 mt-0.5">✓</span>
                <span>Coaching communautaire orienté performance</span>
              </li>
            </ul>
          </article>

          {/* Card 3 - Ambiance */}
          <article class="bg-linear-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl flex-1 min-w-[18rem] md:max-w-[30%] hover:-translate-y-2 hover:border-yellow-400/50 transition-all duration-300 backdrop-blur-sm group">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-14 h-14 bg-linear-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-2xl font-black text-white" style="font-family: 'Varsity', serif;">Ambiance</h3>
            </div>
            <p class="mt-4 text-gray-300 text-lg leading-relaxed">
              Des événements conviviaux, des récompenses et une communauté active
              en continu.
            </p>
            <ul class="mt-6 space-y-3 text-sm text-gray-400">
              <li class="flex items-start gap-2">
                <span class="text-yellow-400 mt-0.5">✓</span>
                <span>Events réguliers et streams communautaires</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-yellow-400 mt-0.5">✓</span>
                <span>Giveaways, récompenses et reconnaissances</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-yellow-400 mt-0.5">✓</span>
                <span>Discord actif 24/7 pour rester connecté</span>
              </li>
            </ul>
          </article>
        </div>
      </main>
  );
}
