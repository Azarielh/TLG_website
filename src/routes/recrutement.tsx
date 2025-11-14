import { Title } from "@solidjs/meta";
import { createSignal } from "solid-js";
import RoleDescription from "../components/RoleDescription";

export default function academy() {
  const [isRoleModalOpen, setIsRoleModalOpen] = createSignal(false);
  const [selectedRole, setSelectedRole] = createSignal("");
  const [hoveredRole, setHoveredRole] = createSignal<string | null>(null);

  const handleRoleClick = (roleName: string) => {
    setSelectedRole(roleName);
    setIsRoleModalOpen(true);
  };

  return (
    <main class="relative z-10 flex flex-col items-center justify-start pt-20 pb-20 px-4 sm:px-6 min-h-screen">
      <Title>Recrutement - TLG</Title>

      {/* En-tête */}
      <div class="w-full max-w-6xl mb-16">
        <div class="text-center mb-12">
          <h1 class="text-4xl sm:text-6xl font-black mb-4 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
            Rejoignez-nous
          </h1>
          <p class="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
            Nous vous proposons deux types de structures selon vos envies et votre niveau
          </p>
        </div>

        {/* Grille des sections */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section Roster */}
          <div class="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-yellow-400/50 transition-all duration-300 group">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 class="text-3xl font-black text-white">Roster</h2>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <span class="text-yellow-400 text-xl mt-1">🔸</span>
                <p class="text-gray-300 text-lg">Engagement sérieux requis</p>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-yellow-400 text-xl mt-1">🔸</span>
                <p class="text-gray-300 text-lg">Horaires et jours fixes pour les praccs et tournois</p>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-yellow-400 text-xl mt-1">🔸</span>
                <p class="text-gray-300 text-lg">Être majeur</p>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-yellow-400 text-xl mt-1">🎯</span>
                <p class="text-gray-300 text-lg font-semibold">Objectif : compétitions régulières, progression en équipe</p>
              </div>
            </div>

            <button class="mt-8 w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 rounded-xl text-black font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/50">
              Postuler au Roaster
            </button>
          </div>

          {/* Section Académie */}
          <div class="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-yellow-400/50 transition-all duration-300 group">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 class="text-3xl font-black text-white">Académie</h2>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <span class="text-yellow-400 text-xl mt-1">🔸</span>
                <p class="text-gray-300 text-lg">Ouverte à tous les niveaux</p>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-yellow-400 text-xl mt-1">🔸</span>
                <p class="text-gray-300 text-lg">Coaching individuel ou en petit groupe</p>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-yellow-400 text-xl mt-1">🎯</span>
                <p class="text-gray-300 text-lg font-semibold">Objectif : Progresser pour rivaliser avec les meilleurs et si le coeur t'en dit, intégrer un roaster plus tard.</p>
              </div>
            </div>

            <button class="mt-8 w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 rounded-xl text-black font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/50">
              Rejoindre l'Académie
            </button>
          </div>

        </div>

        {/* Message d'invitation */}
        <div class="mt-12 text-center">
          <div class="max-w-3xl mx-auto bg-gradient-to-r from-yellow-400/10 via-yellow-500/10 to-yellow-400/10 border border-yellow-400/30 rounded-2xl p-8 backdrop-blur-sm">
            <h2 class="text-3xl font-black text-white mb-4">
              Vous souhaitez vous investir pour la team ?
            </h2>
            <p class="text-gray-300 text-lg mb-6">
              Nous recherchons des personnes motivées pour nous aider à grandir et à créer du contenu de qualité
            </p>
            <div class="flex flex-wrap justify-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleRoleClick("Artiste")}
                onMouseEnter={() => setHoveredRole("Artiste")}
                onMouseLeave={() => setHoveredRole(null)}
                class="px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-lg border border-yellow-400/30 font-semibold hover:bg-yellow-400/30 transition-all duration-300 cursor-pointer"
                classList={{
                  "scale-110 z-10": hoveredRole() === "Artiste",
                  "scale-90 opacity-60": hoveredRole() !== null && hoveredRole() !== "Artiste"
                }}
              >
                🎨 Artiste
              </button>
              <button
                type="button"
                onClick={() => handleRoleClick("Créateur de contenu")}
                onMouseEnter={() => setHoveredRole("Créateur de contenu")}
                onMouseLeave={() => setHoveredRole(null)}
                class="px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-lg border border-yellow-400/30 font-semibold hover:bg-yellow-400/30 transition-all duration-300 cursor-pointer"
                classList={{
                  "scale-110 z-10": hoveredRole() === "Créateur de contenu",
                  "scale-90 opacity-60": hoveredRole() !== null && hoveredRole() !== "Créateur de contenu"
                }}
              >
                🎥 Créateur de contenu
              </button>
              <button
                type="button"
                onClick={() => handleRoleClick("Coach")}
                onMouseEnter={() => setHoveredRole("Coach")}
                onMouseLeave={() => setHoveredRole(null)}
                class="px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-lg border border-yellow-400/30 font-semibold hover:bg-yellow-400/30 transition-all duration-300 cursor-pointer"
                classList={{
                  "scale-110 z-10": hoveredRole() === "Coach",
                  "scale-90 opacity-60": hoveredRole() !== null && hoveredRole() !== "Coach"
                }}
              >
                🎓 Coach
              </button>
            </div>
            <button class="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 rounded-xl text-black font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/50">
              Candidater au Staff
            </button>
          </div>
        </div>
      </div>

      {/* Modal de description du rôle */}
      <RoleDescription
        isOpen={isRoleModalOpen()}
        onClose={() => setIsRoleModalOpen(false)}
        roleName={selectedRole()}
      />
    </main>
  );
}