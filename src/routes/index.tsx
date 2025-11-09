import { Title } from "@solidjs/meta";
import MainLogo from "../components/MainLogo";

export default function Home() {
  return (
    <main id="home">
      <Title>TLG: The Legion</Title>
      <h1>Bienvenue sur le site de TLG</h1>
      <MainLogo />
        <p class="mt-5 mx-auto text-center max-w-[45ch] min-h-[3rem] leading-relaxed break-words [word-spacing:0.28rem]">
            Nous construisons notre <span class="highlight text-[2rem] text-[#D4AF37]" style="font-size:2rem; color: #D4AF37;">légende</span>. Rejoignez notre communauté et soyez les premiers informés lors du lancement de notre nouvelle plateforme esports.
        </p>
    </main>
  );
}
