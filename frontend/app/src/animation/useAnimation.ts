import { RefObject, useEffect } from "react";
import { animationAgent, StripName } from "./strips";

export function useAnimation(
  ref: RefObject<HTMLElement>,
  stripName: StripName,
  onEnd?: () => void,
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    animationAgent.play(stripName, el, onEnd);

    return () => {
      animationAgent.stop(el);
    };
  }, [onEnd, ref, stripName]);
}
