import { buildTemplateStylePreview, thumbnailFrames } from "./buildTemplateStylePreview";

const style = {
  useBackground: "Animated" as const,
  categorySlug: "TwoColumnClassic",
  mode: "light",
  palette: "primaryOnWhite",
  theme: {
    primary: "#352466",
    secondary: "#ffa500",
    dark: "#111",
    white: "#FFF",
  },
  gradient: { type: "primary", direction: "HORIZONTAL" },
  animation: { type: "default-preset" },
  texture: null,
  imagePasteUrl: "",
  image: {
    animationType: "none",
    animationDirection: "in",
    overlayStyle: "none",
    gradientType: "linear",
    overlayOpacity: null,
  },
  videoPasteUrl: "",
  video: {
    position: "center",
    size: "cover",
    loop: true,
    muted: true,
    offthread: true,
    volume: 1,
    rate: 1,
    overlay: null,
  },
  luminanceUrl: null,
};

function fixture(timings: { FPS_INTRO: number; FPS_MAIN: number; FPS_OUTRO: number }) {
  return {
    data: [{ team: "A" }],
    timings,
    videoMeta: {
      club: { name: "International Cricket Demo Preview", sponsors: { primary: [] } },
      video: {
        metadata: { compositionId: "CricketUpcoming" },
        appearance: { template: "TwoColumnClassic", theme: { primary: "#000" } },
        media: { HeroImage: { url: "", ratio: "landscape" } },
        templateVariation: {
          useBackground: "Texture",
          pattern: { name: "file-pattern" },
          noise: { type: "grain" },
          particle: { type: "dots" },
          texture: { name: "file-texture", url: "" },
          gradient: { type: "file", direction: "VERTICAL" },
        },
      },
    },
  };
}

describe("buildTemplateStylePreview", () => {
  it("uses intro, main, and the file outro", () => {
    const result = buildTemplateStylePreview(
      fixture({ FPS_INTRO: 40, FPS_MAIN: 100, FPS_OUTRO: 30 }),
      style,
    );

    expect(result.durationInFrames).toBe(170);
    expect(result.mount).toBe(true);
  });

  it("keeps the fixture rows and clears leftover backgrounds while Animated", () => {
    const result = buildTemplateStylePreview(
      fixture({ FPS_INTRO: 90, FPS_MAIN: 2295, FPS_OUTRO: 30 }),
      style,
    );
    const video = (result.data.videoMeta as { video: { templateVariation: Record<string, unknown>; appearance: { theme: { primary: string } } } }).video;

    expect(result.durationInFrames).toBe(2415);
    expect((result.data.data as unknown[])[0]).toEqual({ team: "A" });
    expect(video.appearance.theme.primary).toBe("#352466");
    expect(video.templateVariation.useBackground).toBe("Animated");
    expect(video.templateVariation.pattern).toBeUndefined();
    expect(video.templateVariation.noise).toBeUndefined();
    expect(video.templateVariation.particle).toBeUndefined();
    expect(video.templateVariation.texture).toBeUndefined();
    expect(video.templateVariation.gradient).toBeUndefined();
    expect(video.templateVariation.animation).toEqual({ type: "default-preset" });
  });

  it("writes the session gradient only while Gradient is active", () => {
    const result = buildTemplateStylePreview(fixture({ FPS_INTRO: 10, FPS_MAIN: 10, FPS_OUTRO: 5 }), {
      ...style,
      useBackground: "Gradient",
    });
    const variation = (result.data.videoMeta as { video: { templateVariation: { gradient: { type: string; direction: string } } } }).video.templateVariation;

    expect(variation.gradient).toEqual({ type: "primary", direction: "HORIZONTAL" });
  });

  it("replaces the fixture texture when Texture is active", () => {
    const result = buildTemplateStylePreview(fixture({ FPS_INTRO: 10, FPS_MAIN: 10, FPS_OUTRO: 5 }), {
      ...style,
      useBackground: "Texture",
      texture: { name: "Turf", url: "https://cdn.example.com/turf.png", repeat: "cover", scale: "100%" },
    });
    const variation = (result.data.videoMeta as { video: { templateVariation: { texture: { url: string } } } }).video.templateVariation;

    expect(variation.texture.url).toBe("https://cdn.example.com/turf.png");
  });

  it("uses the scene photo when the image paste is empty, and the paste when it is set", () => {
    const empty = buildTemplateStylePreview(fixture({ FPS_INTRO: 1, FPS_MAIN: 1, FPS_OUTRO: 9 }), {
      ...style,
      useBackground: "Image",
    });
    const pasted = buildTemplateStylePreview(fixture({ FPS_INTRO: 1, FPS_MAIN: 1, FPS_OUTRO: 9 }), {
      ...style,
      useBackground: "Image",
      imagePasteUrl: "https://cdn.example.com/photo.jpg",
    });
    const emptyImage = (empty.data.videoMeta as { video: { templateVariation: { image: { url: string } } } }).video.templateVariation.image;
    const pastedImage = (pasted.data.videoMeta as { video: { templateVariation: { image: { url: string } } } }).video.templateVariation.image;

    const emptyHero = (empty.data.videoMeta as { video: { media: { HeroImage: { url: string; ratio: string } } } }).video.media.HeroImage;

    expect(emptyImage.url).toBe("https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=1000");
    expect(pastedImage.url).toBe("https://cdn.example.com/photo.jpg");
    expect(emptyHero.url).toBe("https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=1000");
    expect(emptyHero.ratio).toBe("landscape");
    expect(empty.mount).toBe(true);
  });

  it("uses the scene video when the paste is empty, and the paste when it is set", () => {
    const empty = buildTemplateStylePreview(fixture({ FPS_INTRO: 1, FPS_MAIN: 1, FPS_OUTRO: 9 }), {
      ...style,
      useBackground: "Video",
    });
    const pasted = buildTemplateStylePreview(fixture({ FPS_INTRO: 1, FPS_MAIN: 1, FPS_OUTRO: 9 }), {
      ...style,
      useBackground: "Video",
      videoPasteUrl: "https://cdn.example.com/clip.mp4",
    });
    const emptyVideo = (empty.data.videoMeta as { video: { templateVariation: { video: { url: string } } } }).video.templateVariation.video;
    const pastedVideo = (pasted.data.videoMeta as { video: { templateVariation: { video: { url: string } } } }).video.templateVariation.video;

    expect(emptyVideo.url).toBe("https://fixtura.s3.ap-southeast-2.amazonaws.com/1943483_uhd_3840_2160_25fps_1238f00c5a.mp4");
    expect(pastedVideo.url).toBe("https://cdn.example.com/clip.mp4");
    expect(empty.mount).toBe(true);
  });

  it("keeps the session style when the fixture changes", () => {
    const ladder = buildTemplateStylePreview(fixture({ FPS_INTRO: 90, FPS_MAIN: 2295, FPS_OUTRO: 30 }), style);
    const upcoming = buildTemplateStylePreview(fixture({ FPS_INTRO: 40, FPS_MAIN: 100, FPS_OUTRO: 30 }), style);
    const ladderLook = (ladder.data.videoMeta as { video: { templateVariation: { useBackground: string }; appearance: { theme: { primary: string } } } }).video;
    const upcomingLook = (upcoming.data.videoMeta as { video: { templateVariation: { useBackground: string }; appearance: { theme: { primary: string } } } }).video;

    expect(ladder.durationInFrames).toBe(2415);
    expect(upcoming.durationInFrames).toBe(170);
    expect(ladderLook.templateVariation.useBackground).toBe(upcomingLook.templateVariation.useBackground);
    expect(ladderLook.appearance.theme.primary).toBe(upcomingLook.appearance.theme.primary);
  });

  it("does not mount luminance without an absolute plate URL", () => {
    const missing = buildTemplateStylePreview(fixture({ FPS_INTRO: 1, FPS_MAIN: 1, FPS_OUTRO: 0 }), {
      ...style,
      useBackground: "Luminance",
      luminanceUrl: "/uploads/plate.png",
    });
    const ready = buildTemplateStylePreview(fixture({ FPS_INTRO: 1, FPS_MAIN: 1, FPS_OUTRO: 0 }), {
      ...style,
      useBackground: "Luminance",
      luminanceUrl: "https://cdn.example.com/plate.png",
    });

    expect(missing.mount).toBe(false);
    expect(ready.mount).toBe(true);

    const blank = buildTemplateStylePreview(fixture({ FPS_INTRO: 1, FPS_MAIN: 1, FPS_OUTRO: 0 }), {
      ...style,
      useBackground: "Luminance",
      luminanceUrl: null,
    });
    expect(blank.mount).toBe(false);
  });

  it("keeps numeric frames that sit inside the preview", () => {
    expect(thumbnailFrames({ frames: [45, 240, -1, "x", 2415] }, 2415)).toEqual([45, 240]);
    expect(thumbnailFrames({}, 2415)).toEqual([]);
  });
});
