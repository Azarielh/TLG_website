import { splitProps } from "solid-js";
import type { JSX } from "solid-js";

type EshopButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  logoSrc?: string;
  sizePx?: number;
};

export default function EshopButton(props: EshopButtonProps) {
  const [local, rest] = splitProps(props, ["logoSrc", "sizePx", "class"]);
  const logoSrc = local.logoSrc ?? "/eshop_logo.svg";
  const sizePx = local.sizePx ?? 250; // Taille du bouton
  const extraClass = local.class ?? "";
  const ariaLabel = props["aria-label"] ?? "Open e-shop";

  return (
    <button
      type="button"
      {...rest}
      aria-label={ariaLabel}
      class={`fixed bottom-2 left-2 z-50
              w-[${sizePx}px] h-[${sizePx}px]
              hover:scale-110 transform transition-transform duration-150
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              ${extraClass}`}
      style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
    >
      <img
        src={logoSrc}
        alt="e-shop logo"
        class="w-full h-full object-contain select-none pointer-events-none"
        draggable={false}
      />
    </button>
  );
}
