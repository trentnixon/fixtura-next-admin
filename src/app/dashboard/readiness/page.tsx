import { Suspense } from "react";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { RendersWorkspaceShell } from "@/app/dashboard/renders/components/RendersWorkspaceShell";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { ReadinessCheckWorkspace } from "./ReadinessCheckWorkspace";

export default function ReadinessCheckPage() {
  return (
    <RendersWorkspaceShell
      title="Readiness check"
      byLine="Content production · result scrape"
      byLineBottom="Choose a date, an organisation type, then an organisation. Most fixtures are scored from 7 days before that date through 7 days after it. Only Two Day+ fixtures use the 14 days before it. Nothing is stored, and no render is created."
      headerActions={
        <DashboardLinkButton href="/dashboard/renders" trailingIcon="external">
          Renders
        </DashboardLinkButton>
      }
    >
      <Suspense fallback={<LoadingState message="Loading check..." />}>
        <ReadinessCheckWorkspace />
      </Suspense>
    </RendersWorkspaceShell>
  );
}
