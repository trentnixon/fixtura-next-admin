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
    <div
      className={
        frames.length > 0
          ? "grid w-4/5 grid-cols-[minmax(0,1fr)_6rem] items-stretch gap-3"
          : "w-4/5"
      }
    >
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
        <div className="relative min-h-0">
          <div className="absolute inset-0 flex flex-col gap-2 overflow-y-auto pr-1">
            {frames.map((frame) => (
              <button
                key={frame}
                type="button"
                className="w-full shrink-0 space-y-1 text-left"
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
        </div>
      ) : null}
    </div>
  );
}
