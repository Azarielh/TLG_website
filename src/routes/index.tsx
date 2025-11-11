import { Title } from "@solidjs/meta";
import MainLogo from "../components/MainLogo";

export default function Home() {
  return (
    <main id="home" class="pt-20">
      <Title>TLG: The Legion</Title>
      <h1>Bienvenue sur le site de TLG</h1>
      <MainLogo />
        <p class="mt-5 mx-auto text-center w-[65vw] max-w-[1500px] min-h-[3rem] leading-relaxed break-words [word-spacing:0.28rem]">
            Nous construisons notre <span class="highlight text-[2rem] text-[#D4AF37]" style="font-size:2rem; color: #D4AF37;">légende</span>. Rejoignez notre communauté et soyez les premiers informés lors du lancement de notre nouvelle plateforme esports.
        </p>
        <div class="pagepanel mx-auto w-[65vw] max-w-[1500px] flex-1 min-h-[40vh] md:min-h-[60vh] h-[calc(100vh-20rem)] relative overflow-hidden flex items-center justify-center p-6">
          <div class="rounded-2xl p-1 animate-pulse ring-1 ring-yellow-400/70 ring-offset-2 ring-offset-transparent">
            <div class="flex-1 flex items-center justify-center px-4 rounded-xl bg-gradient-to-b from-black/40 to-black/20 min-h-[30vh]">
              <p class="moving-text text-center max-w-prose leading-relaxed text-white">
          <strong>Ceci est un texte temporaire. Un placeholder qui sera remplacé par des trucs chouette en théorie.</strong><br/><br/>La haut, vous avez une phrase qui en jette, elle bougera de temps en temps et on pourra même faire des variations, là bas, c'est un coffre, parce que c'est bien les coffres, les loots, ouais, j'aime bien les coffres, et là juste ici, des images qui bouge tout le temps qui mette de l'animation qui rendent le site vivant.
          Ouais...Ce sera bien ! Ce sera vraiment bien... Je reviens dans 1mois avec de la potion magique...peut être.<br/>A ceux reconnaitrons la ref remasterisée.
              </p>
            </div>
          </div>
        </div>
    </main>
  );
}
