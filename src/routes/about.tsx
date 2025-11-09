import { Title } from "@solidjs/meta";

export default function About() {
  return (
    <main>
      <Title>A propos</Title>
      <h1>A propos</h1>
    <div class="flex flex-col md:flex-row flex-wrap justify-center gap-6 overflow-y-auto">
      <article class="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 shadow-lg flex-1 min-w-[25rem] md:max-w-[30%] hover:translate-y-[-4px] transition-transform">
        <h3 class="text-xl font-bold">Esprit d’équipe</h3>
        <p class="mt-3 text-gray-300">Une organisation en squads, un encadrement attentif et une dynamique de progression commune.</p>
        <ul class="mt-4 space-y-2 text-sm text-gray-400">
          <li>• Squads organisées pour responsabiliser les joueurs</li>
          <li>• Leads attentifs qui accompagnent la montée en compétences</li>
          <li>• Parcours de progression partagés et mesurables</li>
        </ul>
      </article>
      <article class="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 shadow-lg flex-1 min-w-[25rem] md:max-w-[30%] hover:translate-y-[-4px] transition-transform">
        <h3 class="text-xl font-bold">Compétitif</h3>
        <p class="mt-3 text-gray-300">Des entraînements réguliers, des tournois encadrés et un accompagnement par la communauté.</p>
        <ul class="mt-4 space-y-2 text-sm text-gray-400">
          <li>• Scrims hebdomadaires pour se tester</li>
          <li>• Tournois internes et externes</li>
          <li>• Coaching communautaire orienté performance</li>
        </ul>
      </article>
      <article class="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 shadow-lg flex-1 min-w-[25rem] md:max-w-[30%] hover:translate-y-[-4px] transition-transform">
        <h3 class="text-xl font-bold">Ambiance</h3>
        <p class="mt-3 text-gray-300">Des événements conviviaux, des récompenses et une communauté active en continu.</p>
        <ul class="mt-4 space-y-2 text-sm text-gray-400">
          <li>• Events réguliers et streams communautaires</li>
          <li>• Giveaways, récompenses et reconnaissances</li>
          <li>• Discord actif 24/7 pour rester connecté</li>
        </ul>
      </article>
    </div>
    </main>
  );
}
