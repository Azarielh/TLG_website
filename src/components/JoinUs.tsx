import { A } from "@solidjs/router";

export default function JoinUs() {
  return (
    <section class="max-w-4xl mx-auto">
      <div class="relative overflow-hidden rounded-2xl bg-linear-to-br from-yellow-400/20 via-yellow-600/10 to-transparent border border-yellow-400/30 p-12 text-center backdrop-blur-sm">
        <div class="absolute inset-0 bg-linear-to-r from-yellow-400/10 to-transparent blur-3xl"></div>
        <div class="relative z-10">
          <h2 class="text-3xl md:text-5xl font-black text-white mb-4" style="font-family: 'Varsity', serif;">
            Prêt à rejoindre la <span class="text-yellow-400">Légion</span> ?
          </h2>
          <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté et soyez les premiers informés du lancement de notre plateforme e-sport.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <A href="/contact" class="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-black text-lg font-black transition-all duration-300 hover:scale-105 shadow-2xl shadow-yellow-400/30">
              Nous Contacter
            </A>
            <A href="/news" class="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-lg text-white text-lg font-bold transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              Découvrir Plus
            </A>
          </div>
        </div>
      </div>
    </section>
  );
}
