import { Component, JSX } from "solid-js";

type Placement = "top" | "bottom" | "left" | "right";

type Props = {
  text: string;
  icon?: string | JSX.Element;
  placement?: Placement;
  class?: string;
  children?: any;
};

const placementMap: Record<Placement, string> = {
  top: "bottom-full left-[calc(50%+8px)] -translate-x-1/2 translate-y-10 group-hover:translate-y-0",
  bottom: "top-full left-[calc(50%+8px)] -translate-x-1/2 -translate-y-10 group-hover:translate-y-0",
  left: "right-full top-[calc(50%+8px)] -translate-y-1/2 -translate-x-2 group-hover:translate-x-0",
  right: "left-full top-[calc(50%+8px)] -translate-y-1/2 translate-x-2 group-hover:translate-x-0",
};

const arrowPosMap: Record<Placement, string> = {
  top: "bottom-[-6px] left-[calc(50%+8px)] -translate-x-1/2",
  bottom: "top-[-6px] left-[calc(50%+8px)] -translate-x-1/2",
  left: "right-[-6px] top-[calc(50%+8px)] -translate-y-1/2",
  right: "left-[-6px] top-[calc(50%+8px)] -translate-y-1/2",
};

const SessionStatus: Component<Props> = (props) => {
  const placement = props.placement ?? "top";

  const renderIcon = () => {
    if (!props.icon) return null;
    if (typeof props.icon === "string") {
      return <img src={props.icon} alt="" class="w-4 h-4 object-contain" />;
    }
    return props.icon as JSX.Element;
  };

  return (
    <div class={`group inline-block relative ${props.class ?? ""}`}>
      {props.children}

      <div
        class={`absolute ${placementMap[placement]} z-50 opacity-0 pointer-events-none group-hover:opacity-100 transform transition-all duration-150 ease-out`}
        aria-hidden="true"
      >
        <div class="flex items-center gap-2 bg-[#16862ed9] mt-4 text-white text-sm px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
          {renderIcon()}
          <span class="whitespace-nowrap">{props.text}</span>
        </div>

        <div
          class={`absolute w-3 h-3 bg-[#16862ed9] mt-4 rotate-45 ${arrowPosMap[placement]} shadow-md`}
        />
      </div>
    </div>
  );
};

export default SessionStatus;