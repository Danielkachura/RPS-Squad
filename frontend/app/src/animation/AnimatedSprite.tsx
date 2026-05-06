import { CSSProperties, useRef } from "react";
import { STRIP_REGISTRY, StripName } from "./strips";
import { useAnimation } from "./useAnimation";

interface AnimatedSpriteProps {
  name: StripName;
  className?: string;
  style?: CSSProperties;
  onEnd?: () => void;
}

export function AnimatedSprite({ name, className, style, onEnd }: AnimatedSpriteProps) {
  const firstAsset = STRIP_REGISTRY[name].frames[0].asset;

  if (firstAsset.type === "sheet") {
    return <SheetSprite name={name} className={className} style={style} onEnd={onEnd} />;
  }

  return <FileSprite name={name} className={className} style={style} onEnd={onEnd} />;
}

function FileSprite({ name, className, style, onEnd }: AnimatedSpriteProps) {
  const ref = useRef<HTMLImageElement>(null);
  useAnimation(ref, name, onEnd);

  return (
    <img
      ref={ref}
      alt=""
      draggable={false}
      className={className}
      data-testid={`animated-sprite-${name}`}
      style={style}
    />
  );
}

function SheetSprite({ name, className, style, onEnd }: AnimatedSpriteProps) {
  const ref = useRef<HTMLDivElement>(null);
  useAnimation(ref, name, onEnd);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={className}
      data-testid={`animated-sprite-${name}`}
      style={style}
    />
  );
}
