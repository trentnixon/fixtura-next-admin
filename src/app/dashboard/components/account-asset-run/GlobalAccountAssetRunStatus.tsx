"use client";

import { RenderActivitySection } from "./RenderActivitySection";

/** @deprecated Use RenderActivitySection directly */
export default function GlobalAccountAssetRunStatus() {
  return (
    <RenderActivitySection
      defaultPageSize={25}
      title="Asset runs"
      description="Recent on-demand and scheduled asset orchestration runs"
    />
  );
}
