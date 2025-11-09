import { Component } from "solid-js";

type Props = {
  class?: string;
  bgImage?: string; // chemin vers une image (ex: "/assets/bg.jpg")
  overlayOpacity?: number; // 0..1, opacité par défaut 0.35
  children?: any;
};

const PagePanel: Component<Props> = (props) => {
  const overlay = `rgba(6,10,30,${props.overlayOpacity ?? 0.70})`;
  return (
    <div
      class={`fixed inset-y-0 left-1/2 -translate-x-1/2 w-[65vw] max-w-[1600px] z-0 pointer-events-none ${props.class ?? ""}`}
      aria-hidden="true"
    >
      {/* image de fond optionnelle */}
      <div
        class="absolute inset-0 bg-center bg-no-repeat bg-cover"
        style={{
          "background-image": props.bgImage ? `url(${props.bgImage})` : "black",
        }}
      />
      {/* voile sombre au-dessus de l'image */}
      <div class="absolute inset-0" style={{ background: overlay }} />
      {/* zone pour contenu visuel optionnel (activer pointer events si besoin) */}
      <div class="relative h-full w-full pointer-events-none">{props.children}</div>
    </div>
  );
};

export default PagePanel;