import { Component, createSignal, Show, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import { usePocketBase } from "../app";

interface RoleDescriptionProps {
  isOpen: boolean;
  onClose: () => void;
  roleName: string;
}

const RoleDescription: Component<RoleDescriptionProps> = (props) => {
  const pb = usePocketBase();
  const [description, setDescription] = createSignal("");
  const [icon, setIcon] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  // Charger la description du rôle depuis PocketBase
  const loadRoleDescription = async (roleName: string) => {
    if (!pb || !roleName) return;

    setIsLoading(true);
    setError("");
    
    try {
      console.log('🔍 Searching for role:', roleName);
      
      // Rechercher le rang par la propriété "name" qui correspond au rôle
      // Utiliser des simples quotes dans le filtre
      const records = await pb.collection("Role").getFullList({
        filter: `name = '${roleName}'`,
        requestKey: null, // Désactiver l'auto-annulation
      });

      console.log('📦 Records found:', records);

      if (records.length > 0) {
        const roleData = records[0] as any;
        console.log('✅ Role data:', roleData);
        console.log('📝 Description:', roleData.description);
        console.log('🎨 Icon:', roleData.icon);
        
        // Stocker l'icône depuis la DB
        if (roleData.icon) {
          setIcon(roleData.icon);
        } else {
          setIcon("📋"); // Icône par défaut
        }
        
        // Utiliser un placeholder si la description est vide
        if (roleData.description && roleData.description.trim() !== "") {
          setDescription(roleData.description);
        } else {
          setDescription("Pas encore de description disponible pour ce rôle. Revenez bientôt !");
        }
      } else {
        console.warn('⚠️ No role found with name:', roleName);
        setIcon("📋");
        setDescription("Aucune description trouvée pour ce rôle.");
      }
    } catch (err: any) {
      console.error("❌ Error loading role description:", err);
      console.error("❌ Error details:", {
        status: err.status,
        message: err.message,
        data: err.data
      });
      
      // Si c'est une erreur 403 (permissions), afficher un message spécifique
      if (err.status === 403) {
        setError("Les descriptions de rôles ne sont pas encore configurées. Contactez un administrateur.");
      } else if (err.status === 400) {
        setError("Erreur de requête. Vérifiez la configuration de la collection Rank.");
      } else {
        setError("Erreur lors du chargement de la description");
      }
      setDescription("");
    } finally {
      setIsLoading(false);
    }
  };

  // Charger la description quand le modal s'ouvre ou que le rôle change
  createEffect(() => {
    if (props.isOpen && props.roleName) {
      loadRoleDescription(props.roleName);
    }
  });

  return (
    <Show when={props.isOpen}>
      <Portal>
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div class="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div class="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-center">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30">
                  <span class="text-2xl">{icon()}</span>
                </div>
                <h2 class="text-2xl font-bold text-white">{props.roleName}</h2>
              </div>
              <button
                onClick={props.onClose}
                class="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div class="p-6">
              <Show when={isLoading()}>
                <div class="flex justify-center items-center py-12">
                  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                </div>
              </Show>

              <Show when={error()}>
                <div class="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                  {error()}
                </div>
              </Show>

              <Show when={!isLoading() && !error() && description()}>
                <div class="space-y-6">
                  <div>
                    <h3 class="text-xl font-bold text-yellow-400 mb-3">Description du rôle</h3>
                    <div 
                      class="text-gray-300 text-lg leading-relaxed"
                      innerHTML={description()}
                    />
                  </div>

                  <div class="border-t border-gray-700 pt-6">
                    <button
                      onClick={props.onClose}
                      class="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 rounded-xl text-black font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/50"
                    >
                      Candidater pour ce rôle
                    </button>
                  </div>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
};

export default RoleDescription;
