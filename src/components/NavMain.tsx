import { createSignal, Show } from "solid-js";
import SessionStatus from "./session_status";
import Auth from "./Auth";

export default function Nav() {
  const [showAuth, setShowAuth] = createSignal(false);
  const [showMobileMenu, setShowMobileMenu] = createSignal(false);

  return (
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
              Nos Jeux
            </a>
          </SessionStatus>
          <SessionStatus text="Section à venir" placement="bottom">
            <a class="text-gray-400 px-3 py-2 rounded-[10px] font-semibold hover:text-white hover:bg-[rgba(147,51,234,0.12)] hover:border-[rgba(168,85,247,0.18)]" href="/">
              Académie
            </a>
          </SessionStatus>
          {/* autres liens */}
        </div>

        {/* Mobile menu button */}
        <button
          class="sm:hidden text-white px-3 py-2 rounded-lg bg-[rgba(147,51,234,0.15)] hover:bg-[rgba(147,51,234,0.3)] font-semibold"
          onClick={() => setShowMobileMenu(!showMobileMenu())}
        >
          ☰
        </button>

        {/* Login button */}
        <button
          class="flex-shrink-0 text-white px-4 py-2 rounded-lg bg-[rgba(147,51,234,0.15)] hover:bg-[rgba(147,51,234,0.3)] transition-all font-semibold"
          onClick={() => setShowAuth(!showAuth())}
        >
          {showAuth() ? "Fermer" : "Connexion"}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      <Show when={showMobileMenu()}>
        <div class="sm:hidden bg-gray-900/90 p-4 flex flex-col gap-2 z-[60]">
          <SessionStatus text="🚧 En production" placement="bottom">
            <a class="text-gray-200 px-3 py-2 rounded-[10px] font-semibold hover:text-white hover:bg-[rgba(147,51,234,0.12)]" href="/about">
              À propos
            </a>
          </SessionStatus>
          <SessionStatus text="Section à venir" placement="bottom">
            <a class="text-gray-200 px-3 py-2 rounded-[10px] font-semibold hover:text-white hover:bg-[rgba(147,51,234,0.12)]" href="/">
              Nos Jeux
            </a>
          </SessionStatus>
          <SessionStatus text="Section à venir" placement="bottom">
            <a class="text-gray-200 px-3 py-2 rounded-[10px] font-semibold hover:text-white hover:bg-[rgba(147,51,234,0.12)]" href="/">
              Académie
            </a>
          </SessionStatus>
          {/* autres liens */}
        </div>
      </Show>

      {/* Popup Auth */}
      <Show when={showAuth()}>
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-end z-[70]"
          onClick={() => setShowAuth(false)}
        >
          <div
            class="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl w-[90%] max-w-md mt-16 mr-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Auth />
          </div>
        </div>
      </Show>

    </nav>
  );
}
