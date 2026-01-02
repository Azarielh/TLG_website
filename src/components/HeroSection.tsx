import MainLogo from "./MainLogo";
import Taglines from "./Taglines";
import StatsCards from "./StatsCards";
import PartnersFloating from "./PartnersFloating";

interface HeroSectionProps {
  memberCount?: number;
}

export default function HeroSection(props: HeroSectionProps) {
  return (
    <section class="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-10 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
      {/* Image de fond */}
      <div class="absolute inset-0 overflow-hidden">
        <img 
          src="/pexels-yankrukov-9072394.jpg" 
          alt="Background" 
          class="w-full h-full object-cover opacity-20"
        />
      </div>
      
      {/* Partenaires flottants */}
      <PartnersFloating />
      
      {/* Contenu */}
      <div class="relative z-10 max-w-7xl mx-auto text-center pt-8 sm:pt-10 md:pt-12 pb-6 sm:pb-8 md:pb-12">
        <div class="scale-125 mb-6">
          <MainLogo />
        </div>
        <Taglines />
        <StatsCards memberCount={props.memberCount} />
      </div>
    </section>
  );
}
