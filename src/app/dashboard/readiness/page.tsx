import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { RendersWorkspaceShell } from "@/app/dashboard/renders/components/RendersWorkspaceShell";
import { ReadinessCheckWorkspace } from "./ReadinessCheckWorkspace";

export default function ReadinessCheckPage() {
  return (
    <RendersWorkspaceShell
      title="Readiness check"
      byLine="Content production · result scrape"
      byLineBottom="Choose a date, an organisation type, then an organisation. The check scores fixtures from two weeks before that date through one week after it. Nothing is stored, and no render is created."
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
