import { Link } from "@solidjs/meta";

export default function NavMain() {
  return (
    <nav>
      <a rel="icon" href="/about">A propos</a>
      <a rel="icon" href="/games">Nos Jeux</a>
      <a rel="icon" href="/academy">Académie</a>
      <a rel="icon" href="/contact">Contact</a>
    </nav>
  );
}