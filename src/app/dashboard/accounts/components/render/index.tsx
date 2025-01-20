"use client";

import RenderHeader from "./components/renderHeader";
import RenderOverview from "./components/renderOverview";
import { RenderTabs } from "./components/renderTabs";

export default function DisplayRenderId() {
  return (
    <div className="p-6">
      <RenderHeader />
      <RenderOverview />
      <RenderTabs />
    </div>
  );
}
