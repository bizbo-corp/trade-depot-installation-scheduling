import { createElement, forwardRef } from "react";
import type { HTMLAttributes } from "react";

export type DotLottiePlayerProps = HTMLAttributes<HTMLElement> & {
  src?: string;
  autoplay?: boolean;
  loop?: boolean;
  mode?: string;
  speed?: number;
};

export const DotLottiePlayer = forwardRef<HTMLElement, DotLottiePlayerProps>(
  ({ children, ...rest }, ref) =>
    createElement("dotlottie-player", { ref, ...rest }, children),
);

DotLottiePlayer.displayName = "DotLottiePlayer";


