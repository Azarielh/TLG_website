
export default function NavMain() {
  return (
      <div class="h-10 w-auto flex items-center justify-start gap-4 p-2">
        <a href="/"><img class="object-scale-down h-8 w-auto object-contain mr-3"src="../../Assets/logo.png" alt="Logo" /></a>
        <a href="/about" class="text-sm">A propos</a>
        <a href="/games" class="text-sm">Nos Jeux</a>
        <a href="/academy" class="text-sm">Académie</a>
        <a href="/contact" class="text-sm">Contact</a>
      </div>
  );
}
