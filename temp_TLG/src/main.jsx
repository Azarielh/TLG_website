import { render } from "solid-js/web";
import LoginButton from "./components/LoginButton";
import NavTab from "./components/NavTab";
import EshopLogo from "./components/EshopLogo";

// Mount NavTab into an existing container if present (#menu-root or #top-nav),
// otherwise create #menu-root and insert it at the top of the body.
const menuRoot = document.getElementById('menu-root') || document.getElementById('top-nav') || (() => {
  const el = document.createElement('div');
  el.id = 'menu-root';
  // insert at the top of the body so navigation appears first
  document.body.insertBefore(el, document.body.firstChild);
  return el;
})();
render(() => <NavTab />, menuRoot);

// Mount LoginButton into the existing #login-root inside the nav
const loginRoot = document.getElementById('login-root');
if (loginRoot) {
  render(() => <LoginButton />, loginRoot);
} else {
  console.warn('login-root not found; LoginButton not mounted');
}

// Mount EshopLogo so it appears on every page (create container if missing)
const eshopRoot = document.getElementById('eshop-root') || (() => {
  const el = document.createElement('div');
  el.id = 'eshop-root';
  document.body.appendChild(el);
  return el;
})();
render(() => <EshopLogo />, eshopRoot);
