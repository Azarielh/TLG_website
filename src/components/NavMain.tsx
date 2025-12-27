import { createSignal, onMount, onCleanup, Show, createEffect } from "solid-js";
import Auth from "./Auth";
import EshopButton from "./eshop_button";
import { DesktopMenu, MobileMenu } from "./NavMenuItems";
import { usePocketBase } from "../app";
import MainLogo from "../components/MainLogo";

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
      return;
    }
    
    setUser(pb.authStore.record);
    
    // Écouter les changements d'authentification
    const unsubscribe = pb.authStore.onChange((token, record) => {
      console.log('🔄 Auth changed! Token:', token);
      console.log('🔄 Auth changed! Record:', record);
      setUser(record);
    });

    // Récupérer l'avatar OAuth (Discord prioritaire, sinon fallback Google/file/avatarUrl)
    if (pb.authStore.record) {
      const userData = pb.authStore.record as any;
      const meta = userData?.rawUserMetaData ?? userData?.meta ?? {};

      // Discord: construire l'URL CDN si id + avatar hash présents
      const discordId = meta?.id;
      const discordAvatar = meta?.avatar;
      if (discordId && discordAvatar) {
        const url = `https://cdn.discordapp.com/avatars/${discordId}/${discordAvatar}.png?size=256`;
        setAvatarUrl(url);
        return;
      }

      // Si PocketBase a déjà une avatarUrl (Google/Discord)
      if (userData.avatarUrl) {
        setAvatarUrl(userData.avatarUrl);
        return;
      }

      // Avatar stocké en fichier dans PocketBase (Google ou upload)
      if (userData.avatar) {
        const url = `${pb.baseUrl}/api/files/${userData.collectionName}/${userData.id}/${userData.avatar}`;
        setAvatarUrl(url);
        return;
      }

      // Fallback : pas d'avatar
      setAvatarUrl("");
    } else {
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
      <nav class="fixed top-0 left-0 w-full min-h-14 z-60 bg-linear-to-b from-[rgba(6,6,8,0.75)] to-[rgba(6,6,8,0.55)] backdrop-blur-md border-b border-transparent shadow-[0_1px_0_0_rgba(34,211,238,0.15),0_4px_20px_-2px_rgba(147,51,234,0.3)] overflow-visible" style="border-image: linear-gradient(to right, rgba(34,211,238,0.3), rgba(59,130,246,0.3), rgba(147,51,234,0.3)) 1;">
        <div class="w-full flex items-center justify-between py-2 md:py-3 gap-2 md:gap-4 px-4 md:px-6">

          {/* Left side: Mobile menu button + Logo */}
          <div class="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Mobile menu button */}
            <button
              class="lg:hidden text-cyan-400 px-3 py-2 rounded-lg bg-linear-to-br from-cyan-500/10 to-purple-600/10 hover:from-cyan-500/20 hover:to-purple-600/20 border border-cyan-400/30 hover:border-cyan-400/60 font-semibold transition-all shadow-[0_0_10px_rgba(34,211,238,0.3)] text-xl"
              onClick={() => setShowMobileMenu(!showMobileMenu())}
              aria-label="Menu"
            >
              {showMobileMenu() ? "✕" : "☰"}
            </button>

            {/* Logo */}
            <div class="flex items-center gap-3 cursor-pointer">
              <a
                href="/"
                class="flex items-center gap-3 shrink-0 text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 font-black text-lg sm:text-xl md:text-2xl tracking-wide sm:tracking-wider md:tracking-widest whitespace-nowrap uppercase transition-all hover:scale-105"
                style="font-family: 'Audiowide', 'Orbitron', 'Exo 2', sans-serif; filter: drop-shadow(0 0 12px rgba(34,211,238,0.6)) drop-shadow(0 0 20px rgba(147,51,234,0.4));"
              >
                <img src="/logo.svg" alt="The Legion Esports Logo" class="w-12 h-12 object-contain" />
                <div class="flex flex-col">
                  <div class="text-xl font-black tracking-tight" style="font-family: 'Varsity', serif; letter-spacing: -0.05em;">THE LEGION</div>
                  <div class="text-xs text-[#00e5ff] tracking-widest" style="font-family: 'Varsity', serif;">ESPORTS</div>
                </div>
              </a>
              </div>
          </div>

          {/* Desktop menu - centered */}
          <div class="flex-1 flex justify-center">
            <DesktopMenu />
          </div>

          {/* Right side elements container */}
          <div class="flex items-center gap-2 md:gap-3 shrink-0">

            {/* Eshop button - hidden on mobile when compact */}
            <Show when={isCompact()}>
              <div class="hidden xs:block">
                <EshopButton logoSrc="eshop_logo.svg" sizePx={80} class="shrink-0" />
              </div>
            </Show>
            
            {/* Auth button / User Avatar */}
            <Show 
              when={user()}
              fallback={
                <button
                  class="shrink-0 px-4 sm:px-6 py-2 bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-lg hover:shadow-lg hover:shadow-cyan-400/50 transition-all text-sm sm:text-base whitespace-nowrap font-semibold flex items-center justify-center gap-2 text-black"
                  onClick={() => setShowAuth(!showAuth())}
                  aria-label="Connexion"
                >
                  <span class="hidden sm:inline">{showAuth() ? "✕ Fermer" : "Staff"}</span>
                  <span class="sm:hidden">{showAuth() ? "✕" : "👤"}</span>
                </button>
              }
            >
              <button
                onClick={() => setShowAuth(!showAuth())}
                class="shrink-0 cursor-pointer bg-transparent border-none p-0 hover:opacity-80 transition-opacity"
                title={user()?.name || user()?.email || "Utilisateur"}
                aria-label="Profil utilisateur"
              >
                <div class="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-cyan-400/50 hover:border-cyan-400 transition-all shadow-[0_0_10px_rgba(34,211,238,0.4)] hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]">
                  <Show 
                    when={avatarUrl()}
                    fallback={
                      <div class="w-full h-full bg-linear-to-br from-purple-500 to-yellow-400 flex items-center justify-center text-white font-bold text-base md:text-lg">
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
        </div>
      </nav>

      {/* Overlay global pour popups */}
      <Show when={showAuth() || showMobileMenu()}>
        <div
          class="fixed inset-0 z-70 bg-black/20 backdrop-blur-sm"
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
          class="fixed top-16 right-8 z-80 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl max-w-md w-[90%]"
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
                      <div class="w-full h-full bg-linear-to-br from-purple-500 to-yellow-400 flex items-center justify-center text-white font-bold text-2xl">
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
                  <h3 class="text-white font-bold text-lg" style="font-family: 'Varsity', serif;">
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
