import { Title } from "@solidjs/meta";
import { createSignal, Show, onMount, For } from "solid-js";
import { Portal } from "solid-js/web";
import RoleDescription from "../components/RoleDescription";
import { usePocketBase } from "../app";

interface RankRecord {
  id: string;
  name: string | { id: string; name: string; [key: string]: any };
  icon?: string;
  expand?: {
    name?: { id: string; name: string; [key: string]: any } | { id: string; name: string; [key: string]: any }[];
    [key: string]: any;
  };
}

export default function academy() {
  const pb = usePocketBase();
  const [isRoleModalOpen, setIsRoleModalOpen] = createSignal(false);
  const [selectedRole, setSelectedRole] = createSignal("");
  const [hoveredRole, setHoveredRole] = createSignal<string | null>(null);

  // Vérifier si l'utilisateur a le rôle Admin/Dev pour afficher les boutons
  const [isAdminOrDev, setIsAdminOrDev] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = createSignal(false);

  // Tous les rôles disponibles depuis PocketBase
  const [allRoles, setAllRoles] = createSignal<RankRecord[]>([]);
  
  // Rôles actuellement affichés (stocke les IDs des rôles)
  const [displayedRoleIds, setDisplayedRoleIds] = createSignal<string[]>([]);

  const displayedRoles = () => allRoles().filter(role => displayedRoleIds().includes(role.id));

  const removeRole = async (roleId: string, roleName: string) => {
    if (confirm(`Voulez-vous vraiment retirer le rôle "${roleName}" de l'affichage ?`)) {
      try {
        // Supprimer le record de la collection 'recrutement'
        await pb?.collection('recrutement').delete(roleId);
        // Mettre à jour l'affichage local
        setDisplayedRoleIds(displayedRoleIds().filter(id => id !== roleId));
      } catch (error: any) {
        console.error('Erreur complète:', error);
        console.error('Message:', error?.message);
        console.error('Data:', error?.data);
        alert(`Erreur lors de la suppression du rôle: ${error?.message || error}`);
      }
    }
  };

  const addRole = async (roleId: string) => {
    if (!displayedRoleIds().includes(roleId)) {
      try {
        // Créer le record avec l'ID identique à celui du rôle
        await pb?.collection('recrutement').create({ id: roleId });
        // Ajouter à l'affichage local
        setDisplayedRoleIds([...displayedRoleIds(), roleId]);
        setIsAddMenuOpen(false);
      } catch (error: any) {
        console.error('Erreur complète:', error);
        console.error('Message:', error?.message);
        console.error('Data:', error?.data);
        alert(`Erreur lors de l'ajout du rôle: ${error?.message || error}`);
      }
    }
  };

  const availableRoles = () => allRoles().filter(role => !displayedRoleIds().includes(role.id));
  const hasMoreRoles = () => availableRoles().length > 0;

  const getRoleIcon = (role: RankRecord) => {
    return role.icon || "📋";
  };

  onMount(async () => {
    setMounted(true);
    if (pb) {
      // Vérifier le rôle Admin/Dev
      const check = () => {
        const rec = pb.authStore.record as any;
        // Priorité à Rank (règle serveur): 'Admin' ou 'Dev'
        const serverRank = rec?.Rank as string | undefined;
        const isAdminOrDevServer = serverRank === 'Admin' || serverRank === 'Dev';
        // Fallback client (role/rank en minuscules)
        const r = rec?.role ?? rec?.rank;
        const roleLc = r ? String(r).toLowerCase() : '';
        const isAdminOrDevClient = roleLc === 'admin' || roleLc === 'dev';
        setIsAdminOrDev(!!rec && (isAdminOrDevServer || isAdminOrDevClient));
      };
      check();
      pb.authStore.onChange(() => check());

      // Récupérer tous les rôles depuis PocketBase (sauf follower, student, player)
      try {
        // 1. Récupérer tous les rôles disponibles depuis la collection 'Role'
        const allRolesRecords = await pb?.collection('Role').getFullList<RankRecord>({
          sort: 'name'
        });
        
        // 2. Récupérer les rôles actuellement affichés (collection 'recrutement')
        // Les IDs de ces records sont identiques aux IDs de la collection 'Role'
        const displayedRecords = await pb?.collection('recrutement').getFullList<any>({
          sort: 'name'
        });
        
        // Filtrer les rôles qui ne sont pas recrutables
        const recruitableRoles = (allRolesRecords || []).filter(r => {
          const roleName = typeof r.name === 'string' ? r.name : r.name?.name || '';
          return !['follower', 'student', 'player'].includes(roleName.toLowerCase());
        });
        
        setAllRoles(recruitableRoles);
        
        // Extraire les IDs des rôles actuellement affichés (ids identiques à Role)
        const displayedIds = (displayedRecords || []).map((r: any) => r.id);
        setDisplayedRoleIds(displayedIds);
      } catch (error) {
        console.error('Erreur lors de la récupération des rôles:', error);
      }
    }
  });

  const handleRoleClick = (roleName: string) => {
    setSelectedRole(roleName);
    setIsRoleModalOpen(true);
  };
  const getRoleName = (role: RankRecord):string => {
    if (role.expand?.name) {
      const expanded = role.expand.name;
      if (Array.isArray(expanded)) {
        return expanded[0]?.name || '';
      }
      return (expanded as any).name || '';
    }
    return typeof role.name === 'string' ? role.name : role.name?.name || '';
  }

  return (
    <main class="relative z-10 flex flex-col items-center justify-start pt-20 pb-32 px-4 sm:px-6 min-h-screen">
      <Title>Recrutement - TLG</Title>

      {/* En-tête */}
      <div class="w-full max-w-6xl mb-16">
        <div class="text-center mb-12">
          <h1 class="text-4xl sm:text-6xl font-black mb-4 bg-linear-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent" style="font-family: 'Varsity', serif;">
            Rejoignez-nous
          </h1>
          <p class="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
            Nous vous proposons deux types de structures selon vos envies et votre niveau
          </p>
        </div>

        {/* Grille des sections */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section Roster */}
          <div class="bg-linear-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-yellow-400/50 transition-all duration-300 group flex flex-col">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 bg-linear-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 class="text-3xl font-black text-white" style="font-family: 'Varsity', serif;">Roster</h2>
            </div>
            
            <div class="space-y-4 flex-1">
              <div class="flex items-start gap-3">
                <span class="text-yellow-400 text-xl mt-1">🔸</span>
                <p class="text-gray-300 text-lg">Joueurs sérieux avec expérience compétitive</p>
              </div>
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

            <a href="https://discord.gg/3SP3kdu3gJ" target="_blank" rel="noopener noreferrer" class="mt-8 w-full block px-6 py-3 bg-linear-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 rounded-xl text-black font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/50 text-center">
              Postuler en tant que Pro Player
            </a>
          </div>

          {/* Section Académie */}
          <div class="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-yellow-400/50 transition-all duration-300 group flex flex-col">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 class="text-3xl font-black text-white" style="font-family: 'Varsity', serif;">Académie</h2>
            </div>
            
            <div class="space-y-4 flex-1">
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
                <p class="text-gray-300 text-lg font-semibold">Objectif : Progresser pour rivaliser avec les meilleurs et si le coeur t'en dit, intégrer un roster plus tard.</p>
              </div>
            </div>

            <a href="https://discord.gg/3SP3kdu3gJ" target="_blank" rel="noopener noreferrer" class="mt-8 w-full block px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 rounded-xl text-black font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/50 text-center">
              Rejoindre l'Académie
            </a>
          </div>

        </div>

        {/* Message d'invitation */}
        <div class="mt-12 text-center">
          <div class="max-w-3xl mx-auto bg-gradient-to-r from-yellow-400/10 via-yellow-500/10 to-yellow-400/10 border border-yellow-400/30 rounded-2xl p-8 backdrop-blur-sm relative">
            <h2 class="text-3xl font-black text-white mb-4" style="font-family: 'Varsity', serif;">
              Vous souhaitez vous investir pour la team ?
            </h2>
            <p class="text-gray-300 text-lg mb-6">
              Nous recherchons des personnes motivées pour nous aider à grandir et à créer du contenu de qualité
            </p>
            <div class="flex flex-wrap justify-center gap-3 mb-6">
              <For each={displayedRoles()}>
                {(role) => (
                  <div class="relative">
                    <button
                      type="button"
                      onClick={() => handleRoleClick(getRoleName(role))}
                      onMouseEnter={() => setHoveredRole(getRoleName(role))}
                      onMouseLeave={() => setHoveredRole(null)}
                      class="px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-lg border border-yellow-400/30 font-semibold hover:bg-yellow-400/30 transition-all duration-300 cursor-pointer"
                      classList={{
                        "scale-110 z-10": hoveredRole() === getRoleName(role),
                        "scale-90 opacity-60": hoveredRole() !== null && hoveredRole() !== getRoleName(role)
                      }}
                    >
                      {getRoleIcon(role)} {getRoleName(role)}
                    </button>
                    
                    {/* Bouton de suppression pour admin/dev */}
                    <Show when={mounted() && isAdminOrDev()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRole(role.id, getRoleName(role));
                        }}
                        class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-all duration-200 hover:scale-110"
                        title="Retirer ce rôle"
                      >
                        ×
                      </button>
                    </Show>
                  </div>
                )}
              </For>
              
              {/* Bouton + pour ajouter un rôle */}
              <Show when={mounted() && isAdminOrDev() && hasMoreRoles()}>
                <div class="relative">
                  <button
                    onClick={() => setIsAddMenuOpen(!isAddMenuOpen())}
                    class="px-4 py-2 bg-green-400/20 text-green-400 rounded-lg border border-green-400/30 font-semibold hover:bg-green-400/30 hover:scale-105 transition-all duration-300 cursor-pointer"
                    title="Ajouter un rôle"
                  >
                    <span class="hidden sm:inline">+ Ajouter</span>
                    <span class="sm:hidden">+</span>
                  </button>

                  {/* Menu de sélection des rôles */}
                  <Show when={isAddMenuOpen()}>
                    <Portal>
                      {/* Backdrop pour fermer au clic extérieur */}
                      <div
                        class="fixed inset-0 z-[90]"
                        onClick={() => setIsAddMenuOpen(false)}
                      ></div>
                      <div 
                        class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[100] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div class="p-2 bg-gray-700/50 border-b border-gray-600">
                          <p class="text-xs text-gray-400 font-semibold text-center">Sélectionner un rôle</p>
                        </div>
                        <div class="max-h-64 overflow-y-auto">
                          <For each={availableRoles()}>
                            {(role) => (
                              <button
                                onClick={() => addRole(role.id)}
                                class="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors duration-200 text-gray-200 border-b border-gray-700/50 last:border-b-0"
                              >
                              {getRoleIcon(role)} {getRoleName(role)}
                              </button>
                            )}
                          </For>
                        </div>
                      </div>
                    </Portal>
                  </Show>
                </div>
              </Show>
            </div>
            <a
              href="https://discord.gg/3SP3kdu3gJ"
              target="_blank"
              rel="noopener noreferrer"
              class="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 rounded-xl text-black font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/50 text-center inline-block"
            >
              Candidater au Staff
            </a>
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