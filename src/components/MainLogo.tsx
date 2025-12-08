import { createSignal } from "solid-js";

export default function MainLogo() {
  return (
    <div class="relative z-[70] flex items-center justify-center mt-2">
      <img src="/logo.svg" alt="Logo TLG" class="h-36 sm:h-44 md:h-48 w-auto object-contain" />
    </div>
  );
}
