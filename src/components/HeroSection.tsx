import MainLogo from "./MainLogo";
import Taglines from "./Taglines";
import StatsCards from "./StatsCards";

interface HeroSectionProps {
  memberCount?: number;
}

export default function HeroSection(props: HeroSectionProps) {
  return (
    <section class="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-10 pb-24">
      {/* Image de fond */}
      <div class="absolute inset-0 overflow-hidden">
        <img 
          src="/pexels-yankrukov-9072394.jpg" 
          alt="Background" 
          class="w-full h-full object-cover opacity-20"
        />
      </div>
      
      {/* Contenu */}
      <div class="relative z-10 max-w-7xl mx-auto text-center pt-12 pb-12">
        <div class="scale-125 mb-6">
          <MainLogo />
        </div>
        <Taglines />
        <StatsCards memberCount={props.memberCount} />
      </div>
    </section>
  );
}
