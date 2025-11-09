import { createSignal } from "solid-js";

export default function MainLogo() {
  return (
    <div class="relative z-[70] min-h-[calc(100vh-56px)] flex items-start justify-center">
      <img src="..//../Assets/logo.png" alt="Logo TLG" class="h-100 w-auto object-contain" />
    </div>
  );
}
