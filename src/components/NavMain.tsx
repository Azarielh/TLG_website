import SessionStatus from "./session_status";

export default function Nav() {
	return (
		<div class="fixed top-0 left-0 w-full min-h-[56px] z-[60] bg-[rgba(6,6,8,0.55)] backdrop-blur-md border-b border-[rgba(168,85,247,0.06)] overflow-visible">
			<div class="w-[min(1200px,92%)] mx-auto flex items-center justify-between gap-4 h-[56px] relative">
        <a href="/">The Legion</a>
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2.5 items-center whitespace-nowrap">
          <SessionStatus text="Section à venir" placement="bottom">
            <a class="text-[rgb(156,163,175)] px-3 py-2 rounded-[10px] transition-all duration-150 border border-transparent bg-transparent font-semibold hover:text-white hover:bg-[rgba(147,51,234,0.12)] hover:border-[rgba(168,85,247,0.18)]" href="/">A propos</a>
          </SessionStatus>
          <SessionStatus text="Section à venir" placement="bottom">
            <a class="text-[rgb(156,163,175)] px-3 py-2 rounded-[10px] transition-all duration-150 border border-transparent bg-transparent font-semibold hover:text-white hover:bg-[rgba(147,51,234,0.12)] hover:border-[rgba(168,85,247,0.18)]" href="/">Nos Jeux</a>
          </SessionStatus>
          <SessionStatus text="Section à venir" placement="bottom">
            <a class="text-[rgb(156,163,175)] px-3 py-2 rounded-[10px] transition-all duration-150 border border-transparent bg-transparent font-semibold hover:text-white hover:bg-[rgba(147,51,234,0.12)] hover:border-[rgba(168,85,247,0.18)]" href="/">Académie</a>
          </SessionStatus>
          <SessionStatus text="Section à venir" placement="bottom">
            <a class="text-[rgb(156,163,175)] px-3 py-2 rounded-[10px] transition-all duration-150 border border-transparent bg-transparent font-semibold hover:text-white hover:bg-[rgba(147,51,234,0.12)] hover:border-[rgba(168,85,247,0.18)]" href="/">Partenaires</a>
          </SessionStatus>
          <SessionStatus text="Section à venir" placement="bottom">
            <a class="text-[rgb(156,163,175)] px-3 py-2 rounded-[10px] transition-all duration-150 border border-transparent bg-transparent font-semibold hover:text-white hover:bg-[rgba(147,51,234,0.12)] hover:border-[rgba(168,85,247,0.18)]" href="/">Contacts</a>
          </SessionStatus>
        </div>
			<div class="navbar-end">
			</div>
      </div>
		</div>
	);
}