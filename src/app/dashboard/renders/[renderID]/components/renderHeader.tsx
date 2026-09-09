"use client";

import StatusFlags from "./StatusFlags";

interface RenderHeaderProps {
  render?: {
    Processing?: boolean;
    Complete?: boolean;
    forceRerender?: boolean;
    EmailSent?: boolean;
  } | null;
}

/** Render status badges — actions live in the page title CTA group. */
export default function RenderHeader({ render }: RenderHeaderProps) {
  if (!render) return null;

  return (
    <StatusFlags
      flags={{
        Processing: render.Processing ?? false,
        Complete: render.Complete ?? false,
        forceRerender: render.forceRerender ?? false,
        EmailSent: render.EmailSent ?? false,
      }}
    />
  );
}
