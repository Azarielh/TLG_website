import { Component, For, createSignal, onMount } from "solid-js";

interface TaglinesProps {
  class?: string;
}

const Taglines: Component<TaglinesProps> = (props) => {
  // Taglines dynamiques
  const taglines = [
    "Nous construisons notre légende",
    "Une team, une passion, une victoire",
    "Champions aujourd'hui, légendes demain"
  ];
  const [currentTagline, setCurrentTagline] = createSignal(0);

  // Rotation des taglines
  onMount(() => {
    const taglineInterval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(taglineInterval);
  });

  return (
    <div class={`relative mb-10 overflow-visible z-99 min-h-16 ${props.class || ''}`}>
      <For each={taglines}>
        {(tagline, index) => (
          <p 
            class="absolute inset-x-0 flex items-center justify-center text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-yellow-200 to-yellow-400 transition-all duration-1000 z-99 py-2"
            style={{
              opacity: currentTagline() === index() ? 1 : 0,
              transform: currentTagline() === index() ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            {tagline}
          </p>
        )}
      </For>
    </div>
  );
};

export default Taglines;
