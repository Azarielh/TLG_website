import { Component, createSignal, For } from 'solid-js';

type NavLink = { href: string; label: string; class?: string };

interface NavTabProps {
  brand?: string;
  links?: NavLink[];
}

const defaultLinks: NavLink[] = [
  { href: 'TLG_old/index.html', label: 'Back', class: 'works' },
  { href: '#about', label: 'A propos' },
  { href: '#games', label: 'Nos jeux' },
  { href: '#academy', label: 'Académie' },
  { href: '#community', label: 'Communauté' },
  { href: '#contact', label: 'Contact' },
];

const NavTab: Component<NavTabProps> = (props) => {
  const [open, setOpen] = createSignal(false);

  const links = props.links ?? defaultLinks;

  return (
    <nav class="top-nav">
      <div class="nav-container">
        <a href="#" class="nav-brand">{props.brand ?? 'The Legion'}</a>

        {/* LoginButton is mounted into this node by existing bootstrap code */}
        <div id="login-root"></div>

        <div class="nav-links">
          <For each={links}>{(link) => (
            <a href={link.href} class={link.class ?? 'incoming'}>{link.label}</a>
          )}</For>
        </div>

        {/* mobile toggle - visible only on very small screens via CSS */}
        <button class="nav-toggle" aria-label="Ouvrir le menu" aria-expanded={open()} aria-controls="mobile-menu" onClick={() => setOpen(!open())}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>

        {open() && (
          <div id="mobile-menu" class="mobile-menu" role="menu">
            <For each={links}>{(link) => (
              <a role="menuitem" href={link.href} class={link.class ?? 'incoming'} onClick={() => setOpen(false)}>{link.label}</a>
            )}</For>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavTab;
