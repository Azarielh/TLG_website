import { Component } from "solid-js";
import logoUrl from "../../Assets/eshop_logo.svg";

const EshopLogo: Component = () => {
  return (
    <div class="eshop-logo" aria-hidden="false">
      <img src={logoUrl} alt="Eshop logo" />
    </div>
  );
};

export default EshopLogo;
