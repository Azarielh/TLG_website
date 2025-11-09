import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";

export default function Home() {
  return (
    <main id="home">
      <Title>TLG: The Legion</Title>
      <h1>Bienvenue sur le site de TLG</h1>
      <Counter />
      <p>
        Visitez{" "}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{" "}
        to learn how to build SolidStart apps.
      </p>
    </main>
  );
}
