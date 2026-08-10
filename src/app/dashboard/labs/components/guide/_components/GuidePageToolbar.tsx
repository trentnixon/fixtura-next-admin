"use client";

import CopyPromptTemplateButton from "../../_components/CopyPromptTemplateButton";

export default function GuidePageToolbar() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CopyPromptTemplateButton />
    </div>
  );
}
