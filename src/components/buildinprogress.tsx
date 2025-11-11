import { Component, Show } from "solid-js";

const BuildInProgress: Component = () => {
    return (
        <>
        <Show when={true}>
        <div class="fixed left-4 top-[calc(5rem+var(--navbar-height,0rem))] z-50">
            <span
                role="status"
                aria-live="polite"
                class="inline-flex items-center gap-5 px-3 py-2 rounded-full bg-purple-950 text-white text-sm font-semibold shadow-lg ring-2 ring-purple-900/60 animate-pulse"
                title="This website is under construction"
            >
                <span aria-hidden="true" class="text-lg">🚧</span>
                <span>Le site est en cours de développement</span>
            </span>
        </div>
        </Show>
        <Show when={true}>
        <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <span
                role="status"
                aria-live="polite"
                class="inline-flex items-center gap-3 px-3 py-2 rounded-full bg-purple-950 text-white text-sm font-semibold shadow-lg ring-2 ring-purple-900/60 animate-pulse"
                title="This website is under construction"
            >
                <span aria-hidden="true" class="text-lg">🚧</span>
            </span>
        </div>
        </Show>
        </>
    );
};

export default BuildInProgress;