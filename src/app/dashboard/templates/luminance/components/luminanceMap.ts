const MIN_LIGHTNESS_SPREAD = 0.12;

export type LuminanceStop = { position: number; color: string };

export type BrandLuminanceMap = {
  preset: "brand" | "tonal-brand";
  stops: [LuminanceStop, LuminanceStop, LuminanceStop];
};

type Rgb = { r: number; g: number; b: number };
type Hsl = { h: number; s: number; l: number };

export function isHexColor(value: string): boolean {
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

function hexToRgb(hex: string): Rgb | null {
  const trimmed = hex.trim();
  if (!isHexColor(trimmed)) return null;
  const body = trimmed.slice(1);
  const full = body.length === 3 ? body.split("").map((char) => char + char).join("") : body;
  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex(color: Rgb): string {
  const channel = (value: number) => Math.round(value).toString(16).padStart(2, "0");
  return `#${channel(color.r)}${channel(color.g)}${channel(color.b)}`;
}

function rgbToHsl(color: Rgb): Hsl {
  const red = color.r / 255;
  const green = color.g / 255;
  const blue = color.b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: lightness };
  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;
  if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
  else if (max === green) hue = (blue - red) / delta + 2;
  else hue = (red - green) / delta + 4;
  return { h: hue / 6, s: saturation, l: lightness };
}

function hueToRgb(p: number, q: number, t: number): number {
  let channel = t;
  if (channel < 0) channel += 1;
  if (channel > 1) channel -= 1;
  if (channel < 1 / 6) return p + (q - p) * 6 * channel;
  if (channel < 1 / 2) return q;
  if (channel < 2 / 3) return p + (q - p) * (2 / 3 - channel) * 6;
  return p;
}

function hslToRgb(color: Hsl): Rgb {
  if (color.s === 0) {
    const gray = Math.round(color.l * 255);
    return { r: gray, g: gray, b: gray };
  }
  const q = color.l < 0.5 ? color.l * (1 + color.s) : color.l + color.s - color.l * color.s;
  const p = 2 * color.l - q;
  return {
    r: Math.round(hueToRgb(p, q, color.h + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, color.h) * 255),
    b: Math.round(hueToRgb(p, q, color.h - 1 / 3) * 255),
  };
}

function shiftLightness(hex: string, amount: number): string | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const hsl = rgbToHsl(rgb);
  const lightness = Math.min(1, Math.max(0, hsl.l + amount / 100));
  return rgbToHex(hslToRgb({ ...hsl, l: lightness }));
}

function lightness(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsl(rgb).l;
}

export function resolveBrandPresetStops(primary: string, secondary: string): BrandLuminanceMap | null {
  const primaryRgb = hexToRgb(primary);
  const secondaryRgb = hexToRgb(secondary);
  const dark = shiftLightness(primary, -10);
  const light = shiftLightness(primary, 10);
  if (!primaryRgb || !secondaryRgb || !dark || !light) return null;
  const primaryHex = rgbToHex(primaryRgb);
  const secondaryHex = rgbToHex(secondaryRgb);
  const levels = [dark, primaryHex, secondaryHex]
    .map(lightness)
    .filter((level): level is number => level !== null);
  if (levels.length !== 3) return null;
  const spread = Math.max(...levels) - Math.min(...levels);
  if (spread < MIN_LIGHTNESS_SPREAD) {
    return {
      preset: "tonal-brand",
      stops: [
        { position: 0, color: dark },
        { position: 0.45, color: primaryHex },
        { position: 1, color: light },
      ],
    };
  }
  return {
    preset: "brand",
    stops: [
      { position: 0, color: dark },
      { position: 0.65, color: primaryHex },
      { position: 1, color: secondaryHex },
    ],
  };
}

function mix(from: Rgb, to: Rgb, ratio: number): Rgb {
  return {
    r: Math.round(from.r + (to.r - from.r) * ratio),
    g: Math.round(from.g + (to.g - from.g) * ratio),
    b: Math.round(from.b + (to.b - from.b) * ratio),
  };
}

export function mapLuminanceByte(tone: number, stops: readonly LuminanceStop[]): Rgb {
  const parsed = stops.flatMap((stop) => {
    const color = hexToRgb(stop.color);
    return color ? [{ position: stop.position, color }] : [];
  });
  const position = Math.min(255, Math.max(0, tone)) / 255;
  const first = parsed[0];
  if (!first || position <= first.position) return first?.color ?? { r: 0, g: 0, b: 0 };
  const last = parsed[parsed.length - 1];
  if (!last || position >= last.position) return last?.color ?? { r: 0, g: 0, b: 0 };
  for (let index = 0; index < parsed.length - 1; index += 1) {
    const start = parsed[index];
    const end = parsed[index + 1];
    if (!start || !end) continue;
    if (position >= start.position && position <= end.position) {
      const range = end.position - start.position;
      const ratio = range === 0 ? 0 : (position - start.position) / range;
      return mix(start.color, end.color, ratio);
    }
  }
  return last.color;
}

export function luminanceByte(red: number, green: number, blue: number): number {
  return Math.round(0.2126 * red + 0.7152 * green + 0.0722 * blue);
}
