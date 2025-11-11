// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

// Force l'import des styles côté client
import "./app.css";

mount(() => <StartClient />, document.getElementById("app")!);
