import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { DownloadQualityControlWorkspace } from "../components/DownloadQualityControlWorkspace";
import { RendersWorkspaceShell } from "../components/RendersWorkspaceShell";

export default function DownloadQualityControlPage() {
  return (
    <RendersWorkspaceShell
      title="Download quality control"
      byLine="Renders · download attention"
      byLineBottom="Fleet triage for download output failures. Integrity audit and pipeline failures use separate views."
      headerActions={
        <DashboardLinkButton href="/dashboard/schedulers" trailingIcon="external">
          Schedulers
        </DashboardLinkButton>
      }
    >
      <DownloadQualityControlWorkspace />
    </RendersWorkspaceShell>
  );
}
