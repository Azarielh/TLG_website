import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createContext, useContext } from "solid-js";
import PocketBase from "pocketbase";
import NavMain from "./components/NavMain";
import Following from "./components/following";
import PagePanel from "./components/pagepanel";
import EshopButton from "./components/eshop_button";
import BuildInProgress from "./components/buildinprogress";
import "./app.css";

// Créer une instance PocketBase UNIQUE et GLOBALE
const createPocketBaseInstance = () => {
  // Vérifier si on est côté client
  const isBrowser = typeof window !== 'undefined';
  
  if (!isBrowser) {
    // Côté serveur, retourner null pour éviter les erreurs
    return null;
  }

  const url = import.meta.env.VITE_PB_URL || 'https://pocketbase-z88kow4kk8cow80ogcskoo08.caesarovich.xyz';
  
  console.log('🔧 Creating PocketBase instance...');
  console.log('🔧 PocketBase URL:', url);
  
  if (!url) {
    console.error('❌ No PocketBase URL provided!');
    return null;
  }
  
  const pb = new PocketBase(url);
  
  // S'assurer que le baseUrl ne contient pas le préfixe /_/
  if (pb.baseUrl.includes('/_/')) {
    console.log('⚠️ Removing /_/ from baseUrl');
    pb.baseUrl = pb.baseUrl.replace('/_/', '/');
  }
  
  console.log('✅ PocketBase instance created, baseUrl:', pb.baseUrl);
  
  return pb;
};

// Instance GLOBALE - créée une seule fois
const globalPocketBase = createPocketBaseInstance();

export const PocketBaseContext = createContext<PocketBase | null>(globalPocketBase);

export function usePocketBase() {
  return useContext(PocketBaseContext);
}

function PocketBaseProvider(props: { children?: any }) {
  return <PocketBaseContext.Provider value={globalPocketBase}>{props.children}</PocketBaseContext.Provider>;
}

export default function App() {
  return (
    <Router
      root={props => (
        <PocketBaseProvider>
          <MetaProvider>
            <Title>TLG Website</Title>
            <PagePanel overlayOpacity={0.8}>
              <NavMain />
              <Suspense>{props.children}</Suspense>
              <BuildInProgress />
            </PagePanel>
            <Following />
          </MetaProvider>
        </PocketBaseProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
