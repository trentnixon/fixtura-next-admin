import { DownloadStatusTimelineWorkspace } from "../components/DownloadStatusTimelineWorkspace";
import { RendersWorkspaceShell } from "../components/RendersWorkspaceShell";

export default function RendersDownloadsPage() {
  return (
    <RendersWorkspaceShell
      title="Downloads"
      byLine="Renders · downloads"
      byLineBottom="Fleet timeline of Download output status by last activity. Not Download attention triage."
    >
      <DownloadStatusTimelineWorkspace />
    </RendersWorkspaceShell>
  );
}
