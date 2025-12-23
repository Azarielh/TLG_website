import { Component } from "solid-js";

interface StatsCardsProps {
  memberCount?: number;
}

const StatsCards: Component<StatsCardsProps> = (props) => {
  return (
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto relative z-10">
      <div class="bg-linear-to-br from-yellow-400/10 to-yellow-600/5 border border-yellow-400/30 rounded-xl p-4 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
        <div class="text-3xl font-black text-yellow-400 mb-1">100%</div>
        <div class="text-sm text-gray-400 font-medium">Engagement</div>
      </div>
      <div class="bg-linear-to-br from-yellow-400/10 to-yellow-600/5 border border-yellow-400/30 rounded-xl p-4 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
        <div class="text-3xl font-black text-yellow-400 mb-1">24/7</div>
        <div class="text-sm text-gray-400 font-medium">Actif</div>
      </div>
      <div class="bg-linear-to-br from-yellow-400/10 to-yellow-600/5 border border-yellow-400/30 rounded-xl p-4 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
        <div class="text-3xl font-black text-yellow-400 mb-1">∞</div>
        <div class="text-sm text-gray-400 font-medium">Potentiel</div>
      </div>
      <div class="bg-linear-to-br from-yellow-400/10 to-yellow-600/5 border border-yellow-400/30 rounded-xl p-4 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
        <div class="text-3xl font-black text-yellow-400 mb-1">
          {props.memberCount ?? "—"}
        </div>
        <div class="text-sm text-gray-400 font-medium">
          {props.memberCount !== undefined && props.memberCount > 1 ? "Membres" : "Membre"}
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
