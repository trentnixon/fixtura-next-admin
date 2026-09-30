"use client";

import { useRef } from "react";
import { Player, Thumbnail, type PlayerRef } from "@remotion/player";
import { FixturaTemplateScene } from "@/vendor/fixtura-remotion-assets/preview";
import { thumbnailFrames } from "@/lib/template-style-preview/buildTemplateStylePreview";
import "@/components/remotion/remotion-preview.css";

const COMPOSITION_WIDTH = 1080;
const COMPOSITION_HEIGHT = 1350;
const FPS = 30;

export function RemotionPreviewPlayer({
  data,
  durationInFrames,
}: {
  data: Record<string, unknown>;
  durationInFrames: number;
}) {
  const playerRef = useRef<PlayerRef>(null);
  const frames = thumbnailFrames(data, durationInFrames);
  const length = Math.max(durationInFrames, 1);

  return (
    <div className="mx-auto w-full max-w-[540px] space-y-3">
      <div className="relative aspect-[1080/1350] overflow-hidden rounded-xl border">
        <div data-remotion-preview-root className="not-prose absolute inset-0">
          <Player
            ref={playerRef}
            component={FixturaTemplateScene}
            inputProps={{ data }}
            durationInFrames={length}
            compositionWidth={COMPOSITION_WIDTH}
            compositionHeight={COMPOSITION_HEIGHT}
            fps={FPS}
            controls
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
      {frames.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {frames.map((frame) => (
            <button
              key={frame}
              type="button"
              className="w-24 shrink-0 space-y-1 text-left"
              onClick={() => playerRef.current?.seekTo(frame)}
              aria-label={`Show frame ${frame}`}
            >
              <div className="relative aspect-[1080/1350] overflow-hidden rounded-md border">
                <div data-remotion-preview-root className="not-prose absolute inset-0">
                  <Thumbnail
                    component={FixturaTemplateScene}
                    inputProps={{ data }}
                    frameToDisplay={frame}
                    durationInFrames={length}
                    compositionWidth={COMPOSITION_WIDTH}
                    compositionHeight={COMPOSITION_HEIGHT}
                    fps={FPS}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>
              <span className="block text-center text-[10px] text-muted-foreground">{frame}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
