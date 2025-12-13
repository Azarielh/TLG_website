import SessionStatus from "./session_status";

// MenuItem composant réutilisable
type MenuItemProps = {
  href: string;
  label: string;
  status?: string;
  class?: string;
};

export function MenuItem(props: MenuItemProps) {
  const wrapper = props.status ? (
    <SessionStatus text={props.status} placement="bottom">
      <a
        class={`px-2 lg:px-3 xl:px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap text-sm lg:text-base ${props.class || "text-gray-300 hover:text-cyan-300 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-purple-600/10 border border-transparent hover:border-cyan-400/30 hover:shadow-[0_0_8px_rgba(34,211,238,0.2)]"}`}
        href={props.href}
      >
        {props.label}
      </a>
    </SessionStatus>
  ) : (
    <a
      class={`px-2 lg:px-3 xl:px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap text-sm lg:text-base ${props.class || "text-gray-300 hover:text-cyan-300 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-purple-600/10 border border-transparent hover:border-cyan-400/30 hover:shadow-[0_0_8px_rgba(34,211,238,0.2)]"}`}
      href={props.href}
    >
      {props.label}
    </a>
  );

  return wrapper;
}

// Menu items définition
export const menuItems = [
  {
    id: "about",
    href: "/about",
    label: "À propos",
    status: "Qui sommes-nous ?",
  },
  {
    id: "news",
    href: "/news",
    label: "Actualités",
    status: "🚧 En production",
  },
  // {
  //   id: "agenda",
  //   href: "/",
  //   label: "Agenda",
  //   status: "Section à venir",
  // },
  {
    id: "recrutement",
    href: "/recrutement",
    label: "Recrutement",
    status: "Section à venir",
  },
  {
    id: "academy",
    href: "/",
    label: "Académie",
    status: "Section à venir",
  },
  // {
  //   id: "faq",
  //   href: "/",
  //   label: "FAQ",
  //   status: "Section à venir",
  // }
];

// Desktop Menu Component
export function DesktopMenu() {
  return (
    <div class="hidden lg:flex flex-1 justify-center gap-1 xl:gap-2.5">
      {menuItems.map((item) => (
        <MenuItem
          href={item.href}
          label={item.label}
          status={item.status}
        />
      ))}
    </div>
  );
}

// Mobile Menu Component
export function MobileMenu(props: { onClose: () => void }) {
  return (
    <div
      class="fixed top-14 md:top-16 left-0 right-0 z-75 bg-linear-to-b from-gray-900/98 to-gray-950/98 backdrop-blur-lg p-4 flex flex-col gap-2 lg:hidden border-b border-cyan-400/20 shadow-[0_4px_20px_rgba(34,211,238,0.3)] max-h-[calc(100vh-4rem)] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems
        .map((item) => (
          <div onClick={props.onClose}>
            <MenuItem
              href={item.href}
              label={item.label}
              status={item.status}
              class="text-gray-200 hover:text-white hover:bg-linear-to-r hover:from-cyan-500/15 hover:to-purple-600/15 border border-transparent hover:border-cyan-400/40 block w-full text-base py-3"
            />
          </div>
        ))}
    </div>
  );
}
