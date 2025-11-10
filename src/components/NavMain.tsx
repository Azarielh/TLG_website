import { createSignal, onMount, onCleanup, Show } from "solid-js";
import SessionStatus from "./session_status";
import Auth from "./Auth";
import EshopButton from "./eshop_button";

export default function Nav() {
  const [showAuth, setShowAuth] = createSignal(false);
  const [showMobileMenu, setShowMobileMenu] = createSignal(false);
  const [isCompact, setIsCompact] = createSignal(false);

  onMount(() => {
    const size_breakpoint = 640;
    const handleResize = () => setIsCompact(window.innerWidth < size_breakpoint);
    window.addEventListener("resize", handleResize);
    handleResize();
    onCleanup(() => {
      window.removeEventListener("resize", handleResize);
    });
  });

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
          <div class="hidden sm:flex flex-1 justify-center gap-2.5">
            <SessionStatus text="🚧 En production" placement="bottom">
              <a class="text-gray-400 px-3 py-2 rounded-[10px] font-semibold hover:text-white hover:bg-[rgba(147,51,234,0.12)] hover:border-[rgba(168,85,247,0.18)]" href="/about">
                À propos
              </a>
            </SessionStatus>
            <SessionStatus text="Section à venir" placement="bottom">
              <a class="text-gray-400 px-3 py-2 rounded-[10px] font-semibold hover:text-white hover:bg-[rgba(147,51,234,0.12)] hover:border-[rgba(168,85,247,0.18)]" href="/">
                Actualités
              </a>
            </SessionStatus>
            <SessionStatus text="Section à venir" placement="bottom">
              <a class="text-gray-400 px-3 py-2 rounded-[10px] font-semibold hover:text-white hover:bg-[rgba(147,51,234,0.12)] hover:border-[rgba(168,85,247,0.18)]" href="/">
                Agenda
              </a>
            </SessionStatus>
            <SessionStatus text="Section à venir" placement="bottom">
              <a class="text-gray-400 px-3 py-2 rounded-[10px] font-semibold hover:text-white hover:bg-[rgba(147,51,234,0.12)] hover:border-[rgba(168,85,247,0.18)]" href="/">
                Recrutements
              </a>
            </SessionStatus>
            <SessionStatus text="Section à venir" placement="bottom">
              <a class="text-gray-400 px-3 py-2 rounded-[10px] font-semibold hover:text-white hover:bg-[rgba(147,51,234,0.12)] hover:border-[rgba(168,85,247,0.18)]" href="/">
                Académie
              </a>
            </SessionStatus>
          </div>

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
          {/* Auth button */}
          <button
            class="flex-shrink-0 ml-auto text-white px-4 py-2 rounded-lg bg-[rgba(147,51,234,0.15)] hover:bg-[rgba(147,51,234,0.3)] transition-all font-semibold"
            onClick={() => setShowAuth(!showAuth())}
          >
            {showAuth() ? "Fermer" : "👤"}
          </button>
        </div>
      </nav>

      {/* Overlay global pour popups */}
      <Show when={showAuth() || showMobileMenu()}>
        <div
          class="fixed inset-0 z-[70]"
          onClick={() => {
            setShowAuth(false);
            setShowMobileMenu(false);
          }}
        >
          {/* Mobile Menu */}
          <Show when={showMobileMenu()}>
            <div
              class="absolute top-16 left-0 bg-gray-900/90 p-4 flex flex-col gap-2 sm:hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <SessionStatus text="🚧 En production" placement="bottom">
                <a class="text-gray-200 px-3 py-2 rounded-[10px] font-semibold hover:text-white hover:bg-[rgba(147,51,234,0.12)]" href="/about">
                  À propos
                </a>
              </SessionStatus>
              <SessionStatus text="Section à venir" placement="bottom">
                <a class="text-gray-200 px-3 py-2 rounded-[10px] font-semibold hover:text-white hover:bg-[rgba(147,51,234,0.12)]" href="/">
                  Actualités
                </a>
              </SessionStatus>
              <SessionStatus text="Section à venir" placement="bottom">
                <a class="text-gray-200 px-3 py-2 rounded-[10px] font-semibold hover:text-white hover:bg-[rgba(147,51,234,0.12)]" href="/">
                  Agenda
                </a>
              </SessionStatus>
              <SessionStatus text="Section à venir" placement="bottom">
                <a class="text-gray-200 px-3 py-2 rounded-[10px] font-semibold hover:text-white hover:bg-[rgba(147,51,234,0.12)]" href="/">
                  Recrutement
                </a>
              </SessionStatus>
            </div>
          </Show>


        </div>
                  {/* Auth Popup */}
          <Show when={showAuth()}>
            <div
              class="absolute top-16 right-8 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl max-w-md w-[90%]"
              onClick={(e) => e.stopPropagation()}
            >
              <Auth />
            </div>
          </Show>
      </Show>
      <Show when={!isCompact()}>
        <EshopButton logoSrc="eshop_logo.svg" />
      </Show>
    </>
  );
}
