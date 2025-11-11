import { createSignal, onMount, onCleanup, Show, createEffect } from "solid-js";
import Auth from "./Auth";
import EshopButton from "./eshop_button";
import { DesktopMenu, MobileMenu } from "./NavMenuItems";
import { usePocketBase } from "../app";

export default function Nav() {
  const pb = usePocketBase();
  const [showAuth, setShowAuth] = createSignal(false);
  const [showMobileMenu, setShowMobileMenu] = createSignal(false);
  const [isCompact, setIsCompact] = createSignal(false);
  const [user, setUser] = createSignal<any>(null);
  const [avatarUrl, setAvatarUrl] = createSignal("");

  onMount(() => {
    const size_breakpoint = 640;
    const handleResize = () => setIsCompact(window.innerWidth < size_breakpoint);
    window.addEventListener("resize", handleResize);
    handleResize();
    onCleanup(() => {
      window.removeEventListener("resize", handleResize);
    });
  });

  // Observer l'état d'authentification
  createEffect(() => {
    if (!pb) {
      console.log('⏳ Waiting for PocketBase...');
      return;
    }
    
    console.log('🔐 PocketBase authStore.record:', pb.authStore.record);
    console.log('🔐 PocketBase authStore.isValid:', pb.authStore.isValid);
    console.log('🔐 PocketBase authStore.token:', pb.authStore.token);
    
    setUser(pb.authStore.record);
    
    // Écouter les changements d'authentification
    const unsubscribe = pb.authStore.onChange((token, record) => {
      console.log('🔄 Auth changed! Token:', token);
      console.log('🔄 Auth changed! Record:', record);
      setUser(record);
    });

    // Récupérer l'avatar de Google OAuth2
    if (pb.authStore.record) {
      const userData = pb.authStore.record;
      console.log('👤 User data:', userData);
      console.log('👤 User avatar field:', userData.avatar);
      console.log('👤 User avatarUrl field:', userData.avatarUrl);
      
      // L'avatar Google est stocké dans le champ avatar
      if (userData.avatar) {
        // Construire l'URL complète pour le fichier avatar
        const url = `${pb.baseUrl}/api/files/${userData.collectionName}/${userData.id}/${userData.avatar}`;
        console.log('🖼️ Avatar URL constructed:', url);
        setAvatarUrl(url);
      } else if (userData.avatarUrl) {
        // Parfois l'URL de l'avatar Google est directement disponible
        console.log('🖼️ Avatar URL direct:', userData.avatarUrl);
        setAvatarUrl(userData.avatarUrl);
      } else {
        // Fallback : initiales de l'utilisateur
        console.log('⚠️ No avatar found, using fallback');
        setAvatarUrl("");
      }
    } else {
      console.log('❌ No user authenticated');
      setAvatarUrl("");
    }
    
    // Cleanup
    onCleanup(() => {
      unsubscribe();
    });
  });

  const handleLogout = () => {
    if (pb) {
      pb.authStore.clear();
      setShowAuth(false);
    }
  };

  return (
    <>
      <nav class="fixed top-0 left-0 w-full min-h-[56px] z-[60] bg-[rgba(6,6,8,0.55)] backdrop-blur-md border-b border-[rgba(168,85,247,0.06)] overflow-visible">
        <div class="w-[min(1200px,92%)] mx-auto flex items-center justify-between py-2 gap-4">

          {/* Logo */}
          <a
            href="/"
            class="flex-shrink-0 text-white font-bold text-lg whitespace-nowrap min-w-[8rem]"
          >
            The Legion
          </a>

          {/* Desktop menu */}
          <DesktopMenu />

          {/* Mobile menu button */}
          <button
            class="sm:hidden text-white px-3 py-2 rounded-lg bg-[rgba(147,51,234,0.15)] hover:bg-[rgba(147,51,234,0.3)] font-semibold"
            onClick={() => setShowMobileMenu(!showMobileMenu())}
          >
            ☰
          </button>

          {/* Eshop button */}
          <Show when={isCompact()}>
            <EshopButton logoSrc="eshop_logo.svg" sizePx={80} class="flex-shrink-0" />
          </Show>
          
          {/* Auth button / User Avatar */}
          <Show 
            when={user()}
            fallback={
              <button
                class="flex-shrink-0 ml-auto text-white px-4 py-2 rounded-lg bg-[rgba(147,51,234,0.15)] hover:bg-[rgba(147,51,234,0.3)] transition-all font-semibold"
                onClick={() => setShowAuth(!showAuth())}
              >
                {showAuth() ? "Fermer" : "👤"}
              </button>
            }
          >
            <button
              onClick={() => setShowAuth(!showAuth())}
              class="flex-shrink-0 ml-auto cursor-pointer bg-transparent border-none p-0 hover:opacity-80 transition-opacity"
              title={user()?.name || user()?.email || "Utilisateur"}
            >
              <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-400/50 hover:border-yellow-400 transition-all">
                <Show 
                  when={avatarUrl()}
                  fallback={
                    <div class="w-full h-full bg-gradient-to-br from-purple-500 to-yellow-400 flex items-center justify-center text-white font-bold text-lg">
                      {(user()?.name || user()?.email || "?").charAt(0).toUpperCase()}
                    </div>
                  }
                >
                  <img 
                    src={avatarUrl()} 
                    alt="Avatar utilisateur" 
                    class="w-full h-full object-cover"
                  />
                </Show>
              </div>
            </button>
          </Show>
        </div>
      </nav>

      {/* Overlay global pour popups */}
      <Show when={showAuth() || showMobileMenu()}>
        <div
          class="fixed inset-0 z-[70] bg-black/20 backdrop-blur-sm"
          onClick={() => {
            setShowAuth(false);
            setShowMobileMenu(false);
          }}
        />
      </Show>

      {/* Mobile Menu */}
      <Show when={showMobileMenu()}>
        <MobileMenu onClose={() => setShowMobileMenu(false)} />
      </Show>

      {/* Auth Popup / User Menu */}
      <Show when={showAuth()}>
        <div
          class="fixed top-16 right-8 z-[80] bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl max-w-md w-[90%]"
          onClick={(e) => e.stopPropagation()}
        >
          <Show 
            when={user()}
            fallback={<Auth />}
          >
            {/* Menu utilisateur connecté */}
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-4 pb-4 border-b border-gray-700">
                <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400">
                  <Show 
                    when={avatarUrl()}
                    fallback={
                      <div class="w-full h-full bg-gradient-to-br from-purple-500 to-yellow-400 flex items-center justify-center text-white font-bold text-2xl">
                        {(user()?.name || user()?.email || "?").charAt(0).toUpperCase()}
                      </div>
                    }
                  >
                    <img 
                      src={avatarUrl()} 
                      alt="Avatar" 
                      class="w-full h-full object-cover"
                    />
                  </Show>
                </div>
                <div class="flex-1">
                  <h3 class="text-white font-bold text-lg">
                    {user()?.name || user()?.username || "Utilisateur"}
                  </h3>
                  <p class="text-gray-400 text-sm">{user()?.email}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                class="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 font-medium transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </Show>
        </div>
      </Show>
      
      <Show when={!isCompact()}>
        <EshopButton logoSrc="eshop_logo.svg" />
      </Show>
    </>
  );
}
