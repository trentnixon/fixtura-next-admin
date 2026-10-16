import { DownloadQualityControlWorkspace } from "../components/DownloadQualityControlWorkspace";
import { RendersWorkspaceShell } from "../components/RendersWorkspaceShell";

export default function DownloadQualityControlPage() {
  return (
    <RendersWorkspaceShell
      title="Download attention"
      byLine="Renders · download attention"
      byLineBottom="Needs-attention queue only. All download statuses live on Downloads."
    >
      <DownloadQualityControlWorkspace />
    </RendersWorkspaceShell>
  );
}
