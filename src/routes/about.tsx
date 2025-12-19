import { Title } from "@solidjs/meta";

export default function About() {
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

        {/* Grille de cartes */}
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
