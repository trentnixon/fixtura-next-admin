import CreatePage from "@/components/scaffolding/containers/createPage";
import RenderHeader from "./components/renderHeader";
import RenderOverview from "./components/renderOverview";
import { RenderTabs } from "./components/renderTabs";
export default function RenderID() {
  return (
    <CreatePage>
      <RenderHeader />
      <RenderOverview />
      <RenderTabs />
    </CreatePage>
  );
}
