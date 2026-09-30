"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Text from "@/components/ui-library/foundation/Text";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { useTemplateAnimations } from "@/hooks/template-animation/useTemplateAnimation";
import { useTemplateCategories } from "@/hooks/template-category/useTemplateCategory";
import { useTemplateGradients } from "@/hooks/template-gradient/useTemplateGradient";
import { useTemplateImages } from "@/hooks/template-image/useTemplateImage";
import { useTemplateLuminances } from "@/hooks/template-luminance/useTemplateLuminance";
import { useTemplateModes } from "@/hooks/template-mode/useTemplateMode";
import { useTemplatePalettes } from "@/hooks/template-palette/useTemplatePalette";
import { useTemplateTextures } from "@/hooks/template-texture/useTemplateTexture";
import { usePreviewVideos } from "@/hooks/template-video/usePreviewVideos";
import {
  buildTemplateStylePreview,
  CRICKET_SAMPLE_FIXTURES,
  CricketSampleFixtureId,
  LADDER_THEME,
  PREVIEW_BACKGROUNDS,
  PreviewBackground,
} from "@/lib/template-style-preview/buildTemplateStylePreview";
import { sectionTabListClass, sectionTabTriggerClass } from "@/lib/actions/siteNavigationButtonStyles";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { resolveStrapiMediaUrl } from "@/lib/utils/strapiMediaUrl";

const RemotionPreviewPlayer = dynamic(
  () => import("./RemotionPreviewPlayer").then((mod) => mod.RemotionPreviewPlayer),
  { ssr: false },
);

function animationStyle(presetId: string, configuration: unknown): Record<string, unknown> {
  const style: Record<string, unknown> = {};
  if (configuration && typeof configuration === "object" && !Array.isArray(configuration)) {
    for (const [key, value] of Object.entries(configuration)) {
      if (key !== "type") style[key] = value;
    }
  }
  style.type = presetId;
  return style;
}

function rowLabel(name: string, id: number, publishedAt: string | null, extra?: string) {
  const state = publishedAt ? "" : " · Draft";
  return `${name || "Untitled"} #${id}${extra ? ` · ${extra}` : ""}${state}`;
}

function preferId<T extends { id: number }>(rows: T[]): T | undefined {
  return rows.find((row) => row.id === 1) ?? rows[0];
}

function chosenId(selected: number | null, rows: { id: number }[]): number | null {
  if (selected !== null) return selected;
  return preferId(rows)?.id ?? null;
}

function defaultAnimationId(
  rows: { id: number; isDefault: boolean; publishedAt: string | null }[],
): number | null {
  return (rows.find((row) => row.isDefault && row.publishedAt) ?? preferId(rows))?.id ?? null;
}

export function TemplateStylePreview() {
  const categories = useTemplateCategories();
  const modes = useTemplateModes();
  const palettes = useTemplatePalettes();
  const gradients = useTemplateGradients();
  const images = useTemplateImages();
  const textures = useTemplateTextures();
  const luminances = useTemplateLuminances();
  const animations = useTemplateAnimations();
  const videos = usePreviewVideos();
  const { Domain } = useGlobalContext();

  const [fixtureId, setFixtureId] = useState<CricketSampleFixtureId>("CricketLadder");
  const [fixture, setFixture] = useState<Record<string, unknown> | null>(null);
  const [fixtureError, setFixtureError] = useState<string | null>(null);
  const [useBackground, setUseBackground] = useState<PreviewBackground>("Animated");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [modeId, setModeId] = useState<number | null>(null);
  const [paletteId, setPaletteId] = useState<number | null>(null);
  const [gradientId, setGradientId] = useState<number | null>(null);
  const [imageId, setImageId] = useState<number | null>(null);
  const [videoId, setVideoId] = useState<number | null>(null);
  const [animationId, setAnimationId] = useState<number | null>(null);
  const [textureId, setTextureId] = useState<number | null>(null);
  const [luminanceId, setLuminanceId] = useState<number | null>(null);
  const [theme, setTheme] = useState({ ...LADDER_THEME });
  const [imagePasteUrl, setImagePasteUrl] = useState("");
  const [videoPasteUrl, setVideoPasteUrl] = useState("");
  const [group, setGroup] = useState("color");

  const fixturePath = CRICKET_SAMPLE_FIXTURES.find((item) => item.id === fixtureId)?.path;

  useEffect(() => {
    if (!fixturePath) return;
    let cancelled = false;
    setFixture(null);
    setFixtureError(null);
    fetch(fixturePath)
      .then((response) => {
        if (!response.ok) throw new Error("The cricket sample fixture did not load.");
        return response.json() as Promise<Record<string, unknown>>;
      })
      .then((data) => {
        if (!cancelled) setFixture(data);
      })
      .catch((error: unknown) => {
        if (!cancelled) setFixtureError(error instanceof Error ? error.message : "The fixture did not load.");
      });
    return () => {
      cancelled = true;
    };
  }, [fixturePath]);

  const categoryRows = categories.data?.data ?? [];
  const modeRows = modes.data?.data ?? [];
  const paletteRows = palettes.data?.data ?? [];
  const gradientRows = gradients.data?.data ?? [];
  const imageRows = images.data?.data ?? [];
  const videoRows = videos.data?.data ?? [];
  const animationRows = animations.data?.data ?? [];
  const resolvedCategoryId = chosenId(categoryId, categoryRows);
  const resolvedModeId = chosenId(modeId, modeRows);
  const resolvedPaletteId = chosenId(paletteId, paletteRows);
  const resolvedGradientId = chosenId(gradientId, gradientRows);
  const resolvedImageId = chosenId(imageId, imageRows);
  const resolvedVideoId = chosenId(videoId, videoRows);
  const resolvedAnimationId = animationId ?? defaultAnimationId(animationRows);
  const startPending =
    categories.isPending || modes.isPending || palettes.isPending || animations.isPending;

  const category = categoryRows.find((row) => row.id === resolvedCategoryId);
  const mode = modeRows.find((row) => row.id === resolvedModeId);
  const palette = paletteRows.find((row) => row.id === resolvedPaletteId);
  const gradient = gradientRows.find((row) => row.id === resolvedGradientId);
  const image = imageRows.find((row) => row.id === resolvedImageId);
  const video = videoRows.find((row) => row.id === resolvedVideoId);
  const animation = animationRows.find((row) => row.id === resolvedAnimationId);
  const texture = textures.data?.data.find((row) => row.id === textureId);
  const luminance = luminances.data?.data.find((row) => row.id === luminanceId);

  const preview = fixture && !startPending
    ? buildTemplateStylePreview(fixture, {
        useBackground,
        categorySlug: category?.slug || "TwoColumnClassic",
        mode: mode?.slug || "light",
        palette: palette?.value || "primaryOnWhite",
        theme,
        gradient:
          useBackground === "Gradient" && gradient
            ? { type: gradient.type, direction: gradient.direction }
            : null,
        animation: animation ? animationStyle(animation.presetId, animation.defaultConfiguration) : null,
        texture: texture
          ? {
              name: texture.name,
              url: resolveStrapiMediaUrl(texture.textureUrl, Domain.strapi) ?? "",
              repeat: "cover",
              scale: "100%",
              overlay: {
                opacity: texture.opacity ?? 0.8,
                blendMode: texture.blendMode || "multiply",
              },
            }
          : null,
        imagePasteUrl,
        image: {
          animationType: image?.animationType || "none",
          animationDirection: image?.animationDirection || "in",
          overlayStyle: image?.overlayStyle || "none",
          gradientType: image?.gradientType || "linear",
          overlayOpacity: image?.overlayOpacity ?? null,
        },
        videoPasteUrl,
        video: {
          position: video?.position || "center",
          size: video?.size || "cover",
          loop: video?.loop ?? true,
          muted: video?.muted ?? true,
          offthread: video?.offthread ?? true,
          volume: video?.volume ?? null,
          rate: video?.rate ?? null,
          overlay: video?.overlay ?? null,
        },
        luminanceUrl: luminance?.imageUrl ?? null,
      })
    : null;

  if (fixtureError) {
    return <ErrorState title="Failed to load the cricket sample fixture" error={new Error(fixtureError)} />;
  }

  const categoryChoices = (categories.data?.data ?? []).map((row) => ({
    id: row.id,
    label: rowLabel(row.name, row.id, row.publishedAt, row.isPrivate ? "Private" : undefined),
  }));
  const modeChoices = (modes.data?.data ?? []).map((row) => ({
    id: row.id,
    label: rowLabel(row.name, row.id, row.publishedAt, row.slug || "light"),
  }));
  const paletteChoices = (palettes.data?.data ?? []).map((row) => ({
    id: row.id,
    label: row.name || "Untitled",
  }));

  return (
    <div className="space-y-6">
      <SectionContainer
        title="Template style preview"
        description="Starts on the ladder with the new-account style and the ladder theme colours."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Asset type</Label>
            <Select value={fixtureId} onValueChange={(value) => setFixtureId(value as CricketSampleFixtureId)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CRICKET_SAMPLE_FIXTURES.map((item) => (
                  <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Template type</Label>
            <Select
              value={resolvedCategoryId === null ? undefined : String(resolvedCategoryId)}
              onValueChange={(value) => setCategoryId(Number(value))}
            >
              <SelectTrigger><SelectValue placeholder="Choose a category" /></SelectTrigger>
              <SelectContent>
                {categoryChoices.map((row) => (
                  <SelectItem key={row.id} value={String(row.id)}>{row.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(["primary", "secondary", "dark", "white"] as const).map((key) => (
              <div key={key} className="space-y-2">
                <Label>{key}</Label>
                <Input
                  value={theme[key]}
                  onChange={(event) => setTheme((current) => ({ ...current, [key]: event.target.value }))}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:items-start">
        <SectionContainer title="Style" description="Colour, contrast, and the background parent.">
          <Tabs value={group} onValueChange={setGroup}>
            <TabsList variant="primary" className={sectionTabListClass}>
              <TabsTrigger value="color" variant="section" className={sectionTabTriggerClass}>Color</TabsTrigger>
              <TabsTrigger value="contrast" variant="section" className={sectionTabTriggerClass}>Contrast</TabsTrigger>
              <TabsTrigger value="background" variant="section" className={sectionTabTriggerClass}>Background</TabsTrigger>
            </TabsList>
            <div className="min-w-0">
            <TabsContent value="color" className="mt-4 space-y-4">
              <Text variant="muted">Palette is the pairing.</Text>
              <OptionButtons value={resolvedPaletteId} rows={paletteChoices} onChange={setPaletteId} />
            </TabsContent>
            <TabsContent value="contrast" className="mt-4 space-y-3">
              <Text variant="muted">Contrast mode sits beside the category. It is not a background.</Text>
              <OptionButtons value={resolvedModeId} rows={modeChoices} onChange={setModeId} />
            </TabsContent>
            <TabsContent value="background" className="mt-4 space-y-4">
              <Text variant="muted">One background parent. Only the catalogue for that parent is listed.</Text>
              <OptionButtons
                value={useBackground}
                rows={PREVIEW_BACKGROUNDS.map((item) => ({ id: item, label: item }))}
                onChange={setUseBackground}
              />
              {useBackground === "Solid" ? (
                <Text variant="small">Solid uses the theme colours. It has no catalogue row.</Text>
              ) : null}
              {useBackground === "Gradient" ? (
                <ChoiceList
                  label="Gradient"
                  value={resolvedGradientId}
                  rows={(gradients.data?.data ?? []).map((row) => ({
                    id: row.id,
                    label: rowLabel(row.name, row.id, row.publishedAt),
                  }))}
                  onChange={setGradientId}
                />
              ) : null}
              {useBackground === "Animated" ? (
                <ChoiceList
                  label="Animation"
                  value={resolvedAnimationId}
                  rows={(animations.data?.data ?? []).map((row) => ({
                    id: row.id,
                    label: rowLabel(row.name, row.id, row.publishedAt, row.isActive ? undefined : "Inactive"),
                  }))}
                  onChange={setAnimationId}
                />
              ) : null}
              {useBackground === "Texture" ? (
                <ChoiceList
                  label="Texture"
                  value={textureId}
                  rows={(textures.data?.data ?? []).map((row) => ({
                    id: row.id,
                    label: rowLabel(row.name, row.id, row.publishedAt),
                  }))}
                  onChange={setTextureId}
                />
              ) : null}
              {useBackground === "Luminance" ? (
                <ChoiceList
                  label="Luminance"
                  value={luminanceId}
                  rows={(luminances.data?.data ?? []).map((row) => ({
                    id: row.id,
                    label: rowLabel(row.name, row.id, row.publishedAt),
                  }))}
                  onChange={setLuminanceId}
                />
              ) : null}
              {useBackground === "Image" ? (
                <>
                  <ChoiceList
                    label="Image motion"
                    value={resolvedImageId}
                    rows={(images.data?.data ?? []).map((row) => ({
                      id: row.id,
                      label: rowLabel(row.name, row.id, row.publishedAt),
                    }))}
                    onChange={setImageId}
                  />
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input value={imagePasteUrl} onChange={(event) => setImagePasteUrl(event.target.value)} />
                  </div>
                </>
              ) : null}
              {useBackground === "Video" ? (
                <>
                  <ChoiceList
                    label="Video"
                    value={resolvedVideoId}
                    rows={(videos.data?.data ?? []).map((row) => ({
                      id: row.id,
                      label: rowLabel(row.name, row.id, row.publishedAt),
                    }))}
                    onChange={setVideoId}
                  />
                  <div className="space-y-2">
                    <Label>Video URL</Label>
                    <Input value={videoPasteUrl} onChange={(event) => setVideoPasteUrl(event.target.value)} />
                  </div>
                </>
              ) : null}
            </TabsContent>
            </div>
          </Tabs>
        </SectionContainer>
        <SectionContainer title="Player" description="The cricket sample with this session style.">
          {!fixture || startPending || !preview ? (
            <LoadingState message="Loading the cricket sample fixture and the starting Template style..." />
          ) : preview.mount ? (
            <RemotionPreviewPlayer data={preview.data} durationInFrames={preview.durationInFrames} />
          ) : (
            <Text variant="muted">
              This luminance plate has no absolute http or https URL, so the player stays off. The row remains in the list.
            </Text>
          )}
        </SectionContainer>
      </div>
    </div>
  );
}

function OptionButtons<T extends string | number>({
  value,
  rows,
  onChange,
}: {
  value: T | null;
  rows: { id: T; label: string }[];
  onChange: (id: T) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1">
      {rows.map((row) => (
        <Button
          key={String(row.id)}
          type="button"
          size="sm"
          variant={value === row.id ? "default" : "outline"}
          className="h-auto whitespace-normal px-2 py-1.5"
          onClick={() => onChange(row.id)}
        >
          {row.label}
        </Button>
      ))}
    </div>
  );
}

function ChoiceList({
  label,
  value,
  rows,
  onChange,
}: {
  label: string;
  value: number | null;
  rows: { id: number; label: string }[];
  onChange: (id: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {rows.length === 0 ? (
        <Text variant="small">No rows yet.</Text>
      ) : (
        <ScrollArea className="h-64 rounded-md border">
          <div className="flex flex-col gap-1 p-1">
            {rows.map((row) => (
              <Button
                key={row.id}
                type="button"
                size="sm"
                variant={value === row.id ? "default" : "ghost"}
                className="h-auto justify-start whitespace-normal px-2 py-1.5 text-left"
                onClick={() => onChange(row.id)}
              >
                {row.label}
              </Button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
