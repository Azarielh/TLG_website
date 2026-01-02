import { Component, JSX, createSignal } from "solid-js";
import { Portal } from "solid-js/web";

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
  const [isHovered, setIsHovered] = createSignal(false);
  let triggerRef: HTMLDivElement | undefined;

  const renderIcon = () => {
    if (!props.icon) return null;
    if (typeof props.icon === "string") {
      return <img src={props.icon} alt="" class="w-4 h-4 object-contain" />;
    }
    return props.icon as JSX.Element;
  };

  const getPosition = () => {
    if (!triggerRef) return {};
    const rect = triggerRef.getBoundingClientRect();
    const positions: Record<Placement, any> = {
      top: {
        left: `${rect.left + rect.width / 2}px`,
        top: `${rect.top - 8}px`,
        transform: "translateX(-50%) translateY(-100%)",
      },
      bottom: {
        left: `${rect.left + rect.width / 2}px`,
        top: `${rect.bottom + 8}px`,
        transform: "translateX(-50%)",
      },
      left: {
        left: `${rect.left - 8}px`,
        top: `${rect.top + rect.height / 2}px`,
        transform: "translateY(-50%) translateX(-100%)",
      },
      right: {
        left: `${rect.right + 8}px`,
        top: `${rect.top + rect.height / 2}px`,
        transform: "translateY(-50%)",
      },
    };
    return positions[placement];
  };

  return (
    <div 
      class={`inline-block relative ${props.class ?? ""}`} 
      ref={triggerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {props.children}

      <Portal>
        <div
          class={`fixed z-[9999] opacity-0 pointer-events-none transition-all duration-150 ease-out ${isHovered() ? 'opacity-100' : ''}`}
          aria-hidden="true"
          style={{
            left: getPosition().left,
            top: getPosition().top,
            transform: getPosition().transform,
          }}
        >
          <div class="flex items-center gap-2 bg-[#16862ed9] mt-4 text-white text-sm px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
            {renderIcon()}
            <span class="whitespace-nowrap">{props.text}</span>
          </div>

          <div
            class={`absolute w-3 h-3 bg-[#16862ed9] rotate-45 shadow-md ${arrowPosMap[placement]}`}
          />
        </div>
      </Portal>
    </div>
  );
};

export default SessionStatus;