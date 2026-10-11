import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { RendersWorkspaceShell } from "@/app/dashboard/renders/components/RendersWorkspaceShell";
import { ReadinessCheckWorkspace } from "./ReadinessCheckWorkspace";

export default function ReadinessCheckPage() {
  return (
    <RendersWorkspaceShell
      title="Readiness check"
      byLine="Content production · result scrape"
      byLineBottom="Score an organisation's fixtures for a date, scrape every one, then score them again. Nothing is stored, and no render is created."
      headerActions={
        <DashboardLinkButton href="/dashboard/renders" trailingIcon="external">
          Renders
        </DashboardLinkButton>
      }
    >
      <ReadinessCheckWorkspace />
    </RendersWorkspaceShell>
  );
}
