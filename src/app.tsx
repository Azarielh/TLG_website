import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { AuthProvider, PocketBaseProvider } from "./PB/pocketbase";
import NavMain from "./components/NavMain";
import "./app.css";

export default function App() {
  return (
    <Router
      root={props => (
        <PocketBaseProvider url={import.meta.env.VITE_PB_URL}>
        <MetaProvider>
          <Title>SolidStart - Basic</Title>
          <NavMain />
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
        </PocketBaseProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
