"use client";

import { Player } from "@remotion/player";
import { FixturaTemplateScene } from "@/vendor/fixtura-remotion-assets/preview";
import "@/components/remotion/remotion-preview.css";

export function RemotionPreviewPlayer({
  data,
  durationInFrames,
}: {
  data: Record<string, unknown>;
  durationInFrames: number;
}) {
  return (
    <div className="mx-auto w-full max-w-[540px]">
      <div className="relative aspect-[1080/1350] overflow-hidden rounded-xl border">
        <div data-remotion-preview-root className="not-prose absolute inset-0">
          <Player
            component={FixturaTemplateScene}
            inputProps={{ data }}
            durationInFrames={Math.max(durationInFrames, 1)}
            compositionWidth={1080}
            compositionHeight={1350}
            fps={30}
            controls
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
