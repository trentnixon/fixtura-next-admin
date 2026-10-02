import { humanizeToken } from "../humanizeToken";

const motionLabels: Record<string, string> = {
  kenburns: "Ken Burns",
  focusblur: "Focus blur",
};

const overlayLabels: Record<string, string> = {
  colorFilter: "Colour filter",
};

export function imageMotionLabel(type: string): string {
  return motionLabels[type] ?? (humanizeToken(type) || "No motion");
}

export function imageOverlayLabel(style: string): string {
  return overlayLabels[style] ?? (humanizeToken(style) || "No overlay");
}
