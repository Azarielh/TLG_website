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

export const PocketBaseContext = createContext<PocketBase | null>(null);

export function usePocketBase() {
  return useContext(PocketBaseContext);
}

function PocketBaseProvider(props: { url: string; children?: any }) {
  const url = props.url || import.meta.env.VITE_PB_URL;
  console.log('PocketBase URL:', url);
  const pb = new PocketBase(url);
  
  // S'assurer que le baseUrl ne contient pas le préfixe /_/
  if (pb.baseUrl.includes('/_/')) {
    pb.baseUrl = pb.baseUrl.replace('/_/', '/');
  }
  
  console.log('PocketBase instance created, baseUrl:', pb.baseUrl);
  return <PocketBaseContext.Provider value={pb}>{props.children}</PocketBaseContext.Provider>;
}

export default function App() {
  return (
    <Router
      root={props => (
        <PocketBaseProvider url={import.meta.env.VITE_PB_URL}>
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
