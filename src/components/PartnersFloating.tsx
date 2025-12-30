import { Component, createSignal, onMount, Show, createEffect } from "solid-js";
import { usePocketBase } from "../app";

interface Partner {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  category?: string;
}

const PartnersFloating: Component = () => {
  const pb = usePocketBase();
  const [partners, setPartners] = createSignal<Partner[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [progress, setProgress] = createSignal(0); // 0 à 1

  onMount(async () => {
    if (pb) {
      try {
        const records = await pb.collection("Partners").getFullList<Partner>({
          sort: "-created"
        });
        setPartners(records);
      } catch (error) {
        console.error("Erreur lors du chargement des partenaires:", error);
      } finally {
        setIsLoading(false);
      }
    }
  });

  const getLogoUrl = (partner: Partner) => {
    if (!partner.logo || !pb) return "";
    return `${pb.baseUrl}/api/files/Partners/${partner.id}/${partner.logo}?download=false`;
  };

  // Animation du logo flottant
  createEffect(() => {
    if (partners().length === 0) return;

    const animationDuration = 3000; // 3 secondes par cycle
    let isAnimating = true;

    const animate = () => {
      let cycleStartTime = Date.now();

      const animationFrame = () => {
        if (!isAnimating) return;

        const elapsed = Date.now() - cycleStartTime;
        
        // Quand l'animation est complète
        if (elapsed >= animationDuration) {
          setProgress(0);
          setCurrentIndex((prev) => (prev + 1) % partners().length);
          cycleStartTime = Date.now();
        }
        
        // Progression de 0 à 1
        setProgress((Date.now() - cycleStartTime) / animationDuration);
        requestAnimationFrame(animationFrame);
      };

      requestAnimationFrame(animationFrame);
    };

    // Démarre immédiatement sans pause initiale
    animate();

    return () => {
      isAnimating = false;
    };
  });

  // Calcul des positions basé sur la progression
  const getLogoPosition = () => {
    const prog = progress();
    
    // Mouvement vertical simple: de bas en haut
    // Commence au bord supérieur des taglines (~250px) et disparait plus haut (~50px)
    const startY = 250;
    const endY = 50;
    const y = startY - (prog * (startY - endY)); // Remonte de 250 à 50
    
    // Opacité: reste à 1 jusqu'à 85% de l'animation, puis disparait lentement
    const opacity = prog < 0.85 ? 1 : Math.max(0, 1 - (prog - 0.85) / 0.15);
    
    return {
      x: 0,
      y: y,
      opacity: opacity
    };
  };

  const currentPartner = () => {
    if (partners().length === 0) return null;
    return partners()[currentIndex()];
  };

  return (
    <Show when={!isLoading() && partners().length > 0}>
      <div class="absolute inset-0 pointer-events-none flex justify-end pr-4">
        {/* Logo flottant - aligné à droite */}
        <Show when={currentPartner()}>
          {(partner) => (
            <div
              class="absolute flex items-center justify-center"
              style={{
                top: `${getLogoPosition().y}px`,
                opacity: getLogoPosition().opacity,
                transition: "opacity 0.1s ease-out"
              }}
            >
              <Show when={getLogoUrl(partner())} fallback={
                <div class="text-center text-4xl">🤝</div>
              }>
                <img
                  src={getLogoUrl(partner())!}
                  alt={partner().name}
                  class="w-24 h-24 object-contain drop-shadow-lg"
                  loading="lazy"
                  title={partner().name}
                />
              </Show>
            </div>
          )}
        </Show>
      </div>
    </Show>
  );
};

export default PartnersFloating;
