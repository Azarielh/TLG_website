import { Component } from "solid-js";

type Props = {
  class?: string;
  discordUrl?: string;
  youtubeUrl?: string;
  twitchUrl?: string;
  facebookUrl?: string;
};

const Following: Component<Props> = (props) => {
  const discord = props.discordUrl ?? "/Assets/Discord_logo.svg";
  const youtube = props.youtubeUrl ?? "https://www.youtube.com/@TheLegion.esport";
  const twitch = props.twitchUrl ?? "https://www.twitch.tv/thelegionallstar";
  const facebook = props.facebookUrl ?? "https://www.facebook.com/share/19tHcfLs1t";

  return (
    <div class={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-full bg-[rgba(6,6,8,0.6)] backdrop-blur-sm ${props.class ?? ""}`}>
      <span class="text-sm text-gray-400">Follow Us</span>

      <a href={discord} class="social-icon" aria-label="Discord">
          <img src="Assets/Discord_logo.svg" alt="Discord Icon" width="20" height="20"/>
      </a>
      <a href={youtube} class="social-icon" aria-label="Youtube">
          <img src="Assets/Youtube_logo.svg" alt="Youtube Icon" width="20" height="20"/>
      </a>
      <a href={twitch} class="social-icon" aria-label="Twitch">
          <img src="Assets/Twitch_logo.svg" alt="Twitch Icon" width="20" height="20"/>
      </a>
      <a href={facebook} class="social-icon" aria-label="Facebook">
          <img src="Assets/Facebook_logo.svg" alt="Facebook Icon" width="20" height="20"/>
      </a>
    </div>
  );
};

export default Following;