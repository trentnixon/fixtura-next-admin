export const CRICKET_SAMPLE_FIXTURES = [
  { id: "CricketLadder", path: "/dummyAssetData/Cricket/Cricket_Ladder.json", label: "Ladder" },
  { id: "CricketUpcoming", path: "/dummyAssetData/Cricket/Cricket_upcoming.json", label: "Upcoming" },
  { id: "CricketTop5Batting", path: "/dummyAssetData/Cricket/Cricket_Top5Batters.json", label: "Top 5 batting" },
  { id: "CricketTop5Bowling", path: "/dummyAssetData/Cricket/Cricket_Top5Bowlers.json", label: "Top 5 bowling" },
  { id: "CricketBattingPerformances", path: "/dummyAssetData/Cricket/Cricket_BattingPerformances.json", label: "Batting performances" },
  { id: "CricketBowlingPerformances", path: "/dummyAssetData/Cricket/Cricket_BowlingPerformances.json", label: "Bowling performances" },
  { id: "CricketResults", path: "/dummyAssetData/Cricket/Cricket_Results.json", label: "Results" },
  { id: "CricketRoster", path: "/dummyAssetData/Cricket/Cricket_Roster.json", label: "Roster" },
  { id: "CricketResultSingle", path: "/dummyAssetData/Cricket/Cricket_WeekendResultsSingle.json", label: "Result single" },
  { id: "CricketTeamOfTheWeek", path: "/dummyAssetData/Cricket/Cricket_TeamOfTheWeek.json", label: "Team of the week" },
] as const;

export type CricketSampleFixtureId = (typeof CRICKET_SAMPLE_FIXTURES)[number]["id"];

export const LADDER_THEME = {
  primary: "#352466",
  secondary: "#ffa500",
  dark: "#111",
  white: "#FFF",
} as const;

export const IMAGE_FALLBACK_URL =
  "https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=1000";

export const VIDEO_FALLBACK_URL =
  "https://fixtura.s3.ap-southeast-2.amazonaws.com/1943483_uhd_3840_2160_25fps_1238f00c5a.mp4";

export const PREVIEW_BACKGROUNDS = [
  "Solid",
  "Gradient",
  "Video",
  "Image",
  "Texture",
  "Animated",
  "Luminance",
] as const;

export type PreviewBackground = (typeof PREVIEW_BACKGROUNDS)[number];

export interface PreviewTheme {
  primary: string;
  secondary: string;
  dark: string;
  white: string;
}

export interface TemplateStylePreviewInput {
  useBackground: PreviewBackground;
  categorySlug: string;
  mode: string;
  palette: string;
  theme: PreviewTheme;
  gradient: { type: string; direction: string } | null;
  animation: Record<string, unknown> | null;
  texture: {
    name: string;
    url: string;
    repeat: string;
    scale: string;
    overlay?: { opacity: number; blendMode: string };
  } | null;
  imagePasteUrl: string;
  image: {
    animationType: string;
    animationDirection: string;
    overlayStyle: string;
    gradientType: string;
    overlayOpacity: number | null;
  };
  videoPasteUrl: string;
  video: {
    position: string;
    size: string;
    loop: boolean;
    muted: boolean;
    offthread: boolean;
    volume: number | null;
    rate: number | null;
    overlay: unknown;
  };
  luminanceUrl: string | null;
}

export interface TemplateStylePreview {
  data: Record<string, unknown>;
  durationInFrames: number;
  mount: boolean;
}

const BACKGROUND_KEYS = [
  "pattern",
  "noise",
  "particle",
  "texture",
  "image",
  "video",
  "animation",
  "luminance",
] as const;

function record(value: unknown): Record<string, unknown> | null {
  if (value == null || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function ensure(parent: Record<string, unknown>, key: string): Record<string, unknown> {
  const current = record(parent[key]);
  if (current) return current;
  const next: Record<string, unknown> = {};
  parent[key] = next;
  return next;
}

function numberOrZero(value: unknown): number {
  return typeof value === "number" && !Number.isNaN(value) ? value : 0;
}

export function isAbsoluteHttpUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  return value.startsWith("http://") || value.startsWith("https://");
}

function isFrameNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function thumbnailFrames(data: Record<string, unknown>, durationInFrames: number): number[] {
  if (!Array.isArray(data.frames)) return [];
  const last = Math.max(durationInFrames, 1) - 1;
  return data.frames.filter(isFrameNumber).filter((frame) => frame >= 0 && frame <= last);
}

export function buildTemplateStylePreview(
  fixture: Record<string, unknown>,
  style: TemplateStylePreviewInput,
): TemplateStylePreview {
  const data = structuredClone(fixture);
  const timings = record(data.timings);
  const durationInFrames =
    numberOrZero(timings?.FPS_INTRO) +
    numberOrZero(timings?.FPS_MAIN) +
    numberOrZero(timings?.FPS_OUTRO);

  const videoMeta = ensure(data, "videoMeta");
  const video = ensure(videoMeta, "video");
  const appearance = ensure(video, "appearance");
  appearance.template = style.categorySlug;
  appearance.theme = { ...style.theme };

  const templateVariation = ensure(video, "templateVariation");
  templateVariation.useBackground = style.useBackground;
  templateVariation.mode = style.mode;
  templateVariation.palette = style.palette;
  const category = ensure(templateVariation, "category");
  category.slug = style.categorySlug;
  if (style.gradient && style.useBackground === "Gradient") {
    templateVariation.gradient = { ...style.gradient };
  } else {
    delete templateVariation.gradient;
  }

  for (const key of BACKGROUND_KEYS) {
    delete templateVariation[key];
  }

  if (style.useBackground === "Texture" && style.texture) {
    templateVariation.texture = { ...style.texture };
  }

  if (style.useBackground === "Image") {
    const url = style.imagePasteUrl.trim() || IMAGE_FALLBACK_URL;
    templateVariation.image = {
      url,
      type: style.image.animationType,
      direction: style.image.animationDirection,
      overlayStyle: style.image.overlayStyle,
      gradientType: style.image.gradientType,
      overlayOpacity: style.image.overlayOpacity,
    };
    const media = ensure(video, "media");
    const hero = record(media.HeroImage) ?? {};
    hero.url = url;
    media.HeroImage = hero;
  }

  if (style.useBackground === "Video") {
    templateVariation.video = {
      url: style.videoPasteUrl.trim() || VIDEO_FALLBACK_URL,
      position: style.video.position,
      size: style.video.size,
      loop: style.video.loop,
      muted: style.video.muted,
      useOffthreadVideo: style.video.offthread,
      volume: style.video.volume,
      playbackRate: style.video.rate,
      overlay: style.video.overlay,
    };
  }

  if (style.useBackground === "Animated" && style.animation) {
    templateVariation.animation = { ...style.animation };
  }

  if (style.useBackground === "Luminance") {
    const url = style.luminanceUrl?.trim() ?? "";
    if (!isAbsoluteHttpUrl(url)) {
      return { data, durationInFrames, mount: false };
    }
    templateVariation.luminance = {
      url,
      map: { kind: "theme", preset: "brand" },
      protection: "none",
      supersampleScale: 1,
    };
  }

  return { data, durationInFrames, mount: true };
}
