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
        class={`px-3 py-2 rounded-[10px] font-semibold transition-all ${props.class || "text-gray-400 hover:text-white hover:bg-[rgba(147,51,234,0.12)] hover:border-[rgba(168,85,247,0.18)]"}`}
        href={props.href}
      >
        {props.label}
      </a>
    </SessionStatus>
  ) : (
    <a
      class={`px-3 py-2 rounded-[10px] font-semibold transition-all ${props.class || "text-gray-400 hover:text-white hover:bg-[rgba(147,51,234,0.12)] hover:border-[rgba(168,85,247,0.18)]"}`}
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
    status: "🚧 En production",
  },
  {
    id: "news",
    href: "/",
    label: "Actualités",
    status: "Section à venir",
  },
  {
    id: "agenda",
    href: "/",
    label: "Agenda",
    status: "Section à venir",
  },
  {
    id: "recruitment",
    href: "/",
    label: "Recrutement",
    status: "Section à venir",
  },
  {
    id: "academy",
    href: "/",
    label: "Académie",
    status: "Section à venir",
  },
];

// Desktop Menu Component
export function DesktopMenu() {
  return (
    <div class="hidden sm:flex flex-1 justify-center gap-2.5">
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
      class="absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-sm p-4 flex flex-col gap-2 sm:hidden border-b border-[rgba(168,85,247,0.06)]"
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems
        .filter((item) => item.id !== "academy") // Académie pas en mobile pour ce premier jet
        .map((item) => (
          <div onClick={props.onClose}>
            <MenuItem
              href={item.href}
              label={item.label}
              status={item.status}
              class="text-gray-200 hover:text-white hover:bg-[rgba(147,51,234,0.12)] block w-full"
            />
          </div>
        ))}
    </div>
  );
}
