"use client";

import { DatabaseIcon, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Download } from "@/types/download";
import { useForceDownloadDetailRerender } from "@/hooks/downloads/useForceDownloadAssetRerender";
import CMSNavigationButtons from "./CMSNavigationButtons";

interface DownloadHeaderProps {
  download: Download;
}

export default function DownloadHeader({ download }: DownloadHeaderProps) {
  const { strapiLocation } = useGlobalContext();
  const { downloadID } = useParams();

  // Get render ID from download data if available
  const renderId = download?.attributes?.render?.data?.id;
  const forceRerender = useForceDownloadDetailRerender(
    String(download.id),
    renderId,
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {renderId && (
          <Button variant="accent" asChild>
            <Link href={`/dashboard/renders/${renderId}`}>Back to Render</Link>
          </Button>
        )}
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/renders/download-quality-control">
            Download attention
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={forceRerender.isPending}
          onClick={() => forceRerender.mutate()}
        >
          {forceRerender.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
          Force rerender
        </Button>
        {/* CMS Navigation Buttons (Account, Scheduler, Render) */}
        <CMSNavigationButtons download={download} />

        {/* Download CMS Link */}
        <Link
          href={`${strapiLocation.download}${downloadID}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" size="sm">
            <DatabaseIcon className="h-4 w-4 mr-2" />
            Download CMS
          </Button>
        </Link>
      </div>
    </div>
  );
}
