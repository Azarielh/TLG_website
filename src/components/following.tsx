import { Component } from "solid-js";

{/* <a href="https://www.flaticon.com/fr/icones-gratuites/discorde" title="discorde icônes">Discorde icônes créées par Freepik - Flaticon</a> */}
{/* <a href="https://www.flaticon.com/fr/icones-gratuites/youtube" title="youtube icônes">Youtube icônes créées par Freepik - Flaticon</a> */}
{/* <a href="https://www.flaticon.com/fr/icones-gratuites/twitchtv" title="twitch.tv icônes">Twitch.tv icônes créées par Vector Stall - Flaticon</a> */}
{/* <a href="https://www.flaticon.com/fr/icones-gratuites/tweeter" title="tweeter icônes">Tweeter icônes créées par Freepik - Flaticon</a> */}
{/* <a href="https://www.flaticon.com/fr/icones-gratuites/tic-tac" title="tic tac icônes">Tic tac icônes créées par Freepik - Flaticon</a> */}
{/* <a href="https://www.flaticon.com/fr/icones-gratuites/logo-instagram" title="logo instagram icônes">Logo instagram icônes créées par Freepik - Flaticon</a> */}


type Props = {
  class?: string;
  discordUrl?: string;
  youtubeUrl?: string;
  twitchUrl?: string;
  xUrl?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
};

const Following: Component<Props> = (props) => {
  const discord = props.discordUrl ?? "https://discord.com/invite/wfSyp6xBnF";
  const youtube = props.youtubeUrl ?? "https://www.youtube.com/@TheLegion.esport";
  const twitch = props.twitchUrl ?? "https://www.twitch.tv/thelegionallstar";
  const x = props.xUrl ?? "https://x.com/TheLegionAlStar";
  const tiktok = props.tiktokUrl ?? "https://www.tiktok.com/@thelegion.esport";
  const instagram = props.instagramUrl ?? "https://www.instagram.com/thelegion.esport";
  const facebook = props.facebookUrl ?? "https://www.facebook.com/share/19tHcfLs1t";

  return (
    <div class={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-full bg-[rgba(6,6,8,0.6)] backdrop-blur-sm shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-pulse ${props.class ?? ""}`}>
      <span class="text-sm text-gray-400">Suivez-nous !</span>

      <a href={discord} class="social-icon" aria-label="Discord">
          <img src="social_media/discordLogo.png" alt="Discord Icon" width="20" height="20"/>
      </a>
      <a href={youtube} class="social-icon" aria-label="Youtube">
          <img src="social_media/youtube_logo.png" alt="Youtube Icon" width="20" height="20"/>
      </a>
      <a href={twitch} class="social-icon" aria-label="Twitch">
          <img src="social_media/twitch_logo.png" alt="Twitch Icon" width="20" height="20"/>
      </a>
      <a href={x} class="social-icon" aria-label="X">
          <img src="social_media/x_logo.png" alt="X Icon" width="20" height="20"/>
      </a>
      <a href={tiktok} class="social-icon" aria-label="TikTok">
          <img src="social_media/tiktok_logo.png" alt="TikTok Icon" width="20" height="20"/>
      </a>
      <a href={instagram} class="social-icon" aria-label="Instagram">
          <img src="social_media/instagram_logo.png" alt="Instagram Icon" width="20" height="20"/>
      </a>
      <a href={facebook} class="social-icon" aria-label="Facebook">
          <img src="social_media/facebook_logo.svg" alt="Facebook Icon" width="20" height="20"/>
      </a>
    </div>
  );
};

export default Following;