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

      <a
        href={discord}
        aria-label="Discord"
        class="p-2 rounded-md hover:bg-slate-800 transition-colors"
        rel="noopener noreferrer"
        target="_blank"
      >
        <img src={discord} alt="Discord" class="w-5 h-5" />
      </a>

      <a
        href={youtube}
        aria-label="YouTube"
        class="p-2 rounded-md hover:bg-slate-800 transition-colors"
        rel="noopener noreferrer"
        target="_blank"
      >
        <svg
          class="w-5 h-5 text-current"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <polygon points="10 15 15 12 10 9 10 15" />
        </svg>
      </a>

      <a
        href={twitch}
        aria-label="Twitch"
        class="p-2 rounded-md hover:bg-slate-800 transition-colors"
        rel="noopener noreferrer"
        target="_blank"
      >
        <svg
          class="w-5 h-5 text-current"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 2H3v16h5v4l4-4h5l4-4V2z" />
          <path d="M11 11V7" />
          <path d="M16 11V7" />
        </svg>
      </a>

      <a
        href={facebook}
        aria-label="Facebook"
        class="p-2 rounded-md hover:bg-slate-800 transition-colors"
        rel="noopener noreferrer"
        target="_blank"
      >
        <img src="/Assets/Facebook_logo.svg" alt="Facebook" className="w-5 h-5" />
      </a>
    </div>
  );
};

export default Following;