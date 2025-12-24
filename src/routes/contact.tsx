import { Title } from "@solidjs/meta";
import { createSignal, Show } from "solid-js";

export default function Contacts() {
  const [contactMethod, setContactMethod] = createSignal<"email" | "discord">("email");
  const [formData, setFormData] = createSignal({
    name: "",
    subject: "",
    message: "",
    email: "",
    discordHandle: ""
  });
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [submitStatus, setSubmitStatus] = createSignal<"idle" | "success" | "error">("idle");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!formData().name || !formData().subject || !formData().message) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (contactMethod() === "email" && !formData().email) {
      alert("Veuillez entrer votre adresse email");
      return;
    }

    if (contactMethod() === "discord" && !formData().discordHandle) {
      alert("Veuillez entrer votre identifiant Discord");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // TODO: Implémenter l'envoi du formulaire (mail ou API)
      console.log("Formulaire soumis:", {
        ...formData(),
        contactMethod: contactMethod()
      });
      
      setSubmitStatus("success");
      setFormData({
        name: "",
        subject: "",
        message: "",
        email: "",
        discordHandle: ""
      });
      
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main class="relative z-10 flex flex-col items-center justify-start pt-20 pb-32 px-4 sm:px-6 min-h-screen">
      <Title>Contact - TLG</Title>

      <div class="w-full max-w-2xl">
        {/* Header */}
        <div class="text-center mb-12">
          <h1 class="text-4xl sm:text-6xl font-black mb-4 bg-linear-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent" style="font-family: 'Varsity', serif;">
            Nous Contacter
          </h1>
          <p class="text-gray-400 text-lg sm:text-xl">
            Une question ? Une suggestion ? On t'écoute !
          </p>
        </div>

        {/* Formulaire de contact */}
        <div class="bg-linear-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
          
          {/* Message de statut */}
          <Show when={submitStatus() === "success"}>
            <div class="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center">
              ✅ Merci ! Ton message a été envoyé avec succès.
            </div>
          </Show>

          <Show when={submitStatus() === "error"}>
            <div class="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center">
              ❌ Une erreur s'est produite. Réessaie plus tard.
            </div>
          </Show>

          <form onSubmit={handleSubmit} class="space-y-6">
            
            {/* Choix de la méthode de contact */}
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-3">
                Méthode de contact *
              </label>
              <div class="flex gap-4">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="email"
                    checked={contactMethod() === "email"}
                    onChange={() => setContactMethod("email")}
                    class="w-4 h-4 cursor-pointer"
                  />
                  <span class="text-gray-300">📧 Par email</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="discord"
                    checked={contactMethod() === "discord"}
                    onChange={() => setContactMethod("discord")}
                    class="w-4 h-4 cursor-pointer"
                  />
                  <span class="text-gray-300">💬 Par Discord</span>
                </label>
              </div>
            </div>

            {/* Nom */}
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Nom *
              </label>
              <input
                type="text"
                value={formData().name}
                onInput={(e) => handleInputChange("name", e.currentTarget.value)}
                placeholder="Ton nom"
                class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-300"
                required
              />
            </div>

            {/* Email ou Discord Handle */}
            <Show when={contactMethod() === "email"}>
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-2">
                  Adresse email *
                </label>
                <input
                  type="email"
                  value={formData().email}
                  onInput={(e) => handleInputChange("email", e.currentTarget.value)}
                  placeholder="ton.email@exemple.com"
                  class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-300"
                  required
                />
              </div>
            </Show>

            <Show when={contactMethod() === "discord"}>
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-2">
                  Identifiant Discord *
                </label>
                <input
                  type="text"
                  value={formData().discordHandle}
                  onInput={(e) => handleInputChange("discordHandle", e.currentTarget.value)}
                  placeholder="Pseudo#0000 ou Pseudo"
                  class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-300"
                  required
                />
              </div>
            </Show>

            {/* Sujet */}
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Sujet *
              </label>
              <input
                type="text"
                value={formData().subject}
                onInput={(e) => handleInputChange("subject", e.currentTarget.value)}
                placeholder="De quoi ça parle ?"
                class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-300"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Message *
              </label>
              <textarea
                value={formData().message}
                onInput={(e) => handleInputChange("message", e.currentTarget.value)}
                placeholder="Raconte-nous tout..."
                rows="6"
                class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-300 resize-none"
                required
              ></textarea>
            </div>

            {/* Bouton d'envoi */}
            <button
              type="submit"
              disabled={isSubmitting()}
              class="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-500 disabled:to-gray-600 rounded-xl text-black font-bold transition-all duration-300 hover:scale-105 disabled:hover:scale-100 shadow-lg shadow-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/50 disabled:shadow-none"
            >
              {isSubmitting() ? "Envoi en cours..." : "Envoyer le message"}
            </button>

            {/* Texte d'aide */}
            <p class="text-xs text-gray-500 text-center">
              Les champs marqués d'un * sont obligatoires
            </p>
          </form>
        </div>

        {/* Section alternative Discord */}
        <div class="mt-8 text-center">
          <p class="text-gray-400 text-sm mb-4">
            Préfère une réponse plus rapide ?
          </p>
          <a
            href="https://discord.gg/3SP3kdu3gJ"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block px-8 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 rounded-xl text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50"
          >
            Rejoins-nous sur Discord
          </a>
        </div>
      </div>
    </main>
  );
}
