import { Component } from "solid-js";

type Props = {
  class?: string;
  bgImage?: string; // chemin vers une image (ex: "/assets/bg.jpg")
  overlayOpacity?: number; // 0..1, opacité par défaut 0.70
  children?: any;
};

const PagePanel: Component<Props> = (props) => {
  const overlay = `rgba(6,10,30,${props.overlayOpacity ?? 0.70})`;

  return (
    <div
      class={`relative mx-auto w-[65vw] max-w-[1600px] min-h-[65vh] z-0 ${props.class ?? ""}`}
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
      {/* contenu */}
      <div class="relative w-full pointer-events-auto">
        {props.children}
      </div>
    </div>
  );
};

export default PagePanel;
