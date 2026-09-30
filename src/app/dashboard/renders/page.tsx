import { Suspense } from "react";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { RendersWorkspaceTabs } from "./components/RendersWorkspaceTabs";
import { RendersWorkspaceShell } from "./components/RendersWorkspaceShell";

export default function Renders() {
  return (
    <RendersWorkspaceShell
      title="Renders"
      byLine="Render operations workspace"
      byLineBottom="Monitor live processing, scheduler queues, analytics, and recent render output"
      headerActions={
        <DashboardLinkButton href="/dashboard/schedulers" trailingIcon="external">
          Schedulers
        </DashboardLinkButton>
      }
    >
      <Suspense fallback={null}>
        <RendersWorkspaceTabs />
      </Suspense>
    </RendersWorkspaceShell>
  );
}
