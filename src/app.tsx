import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createContext } from "solid-js";
import PocketBase from "pocketbase";
import NavMain from "./components/NavMain";
import Following from "./components/following";
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
            <NavMain />
            <Suspense>{props.children}</Suspense>
            <BuildInProgress />
            <Following />
          </MetaProvider>
        </PocketBaseProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
