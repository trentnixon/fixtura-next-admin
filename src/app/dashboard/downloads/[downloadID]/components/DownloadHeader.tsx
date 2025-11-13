"use client";

import { DatabaseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Download } from "@/types/download";
import CMSNavigationButtons from "./CMSNavigationButtons";

interface DownloadHeaderProps {
  download: Download;
}

export default function DownloadHeader({ download }: DownloadHeaderProps) {
  const { strapiLocation } = useGlobalContext();
  const { downloadID } = useParams();

  // Get render ID from download data if available
  const renderId = download?.attributes?.render?.data?.id;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Left Side: Back to Render Button */}
      <div className="flex items-center">
        {renderId && (
          <Button variant="accent" asChild>
            <Link href={`/dashboard/renders/${renderId}`}>Back to Render</Link>
          </Button>
        )}
      </div>

      {/* Right Side: Account, Scheduler, Render, Download CMS Link */}
      <div className="flex gap-2 items-center">
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
