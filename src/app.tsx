import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createContext } from "solid-js";
import PocketBase from "pocketbase";
import NavMain from "./components/NavMain";
import Following from "./components/following";
import PagePanel from "./components/pagepanel";
import EshopButton from "./components/eshop_button";
import BuildInProgress from "./components/buildinprogress";
import "./app.css";

const PocketBaseContext = createContext<PocketBase | null>(null);

function PocketBaseProvider(props: { url: string; children?: any }) {
  const pb = new PocketBase(props.url);
  return <PocketBaseContext.Provider value={pb}>{props.children}</PocketBaseContext.Provider>;
}

export default function App() {
  return (
    <Router
      root={props => (
        <PocketBaseProvider url={import.meta.env.VITE_PB_URL}>
          <MetaProvider>
            <Title>TLG Website</Title>
            <PagePanel bgImage="/assets/bg.jpg" overlayOpacity={0.6}>
              <NavMain />
              <Suspense>{props.children}</Suspense>
              <BuildInProgress />
            </PagePanel>
            <Following />
          </MetaProvider>
          <EshopButton />
        </PocketBaseProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
