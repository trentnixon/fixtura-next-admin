"use client";

import { DatabaseIcon, ExternalLinkIcon } from "lucide-react";
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

  // Get download URL if available
  const downloadUrl =
    Array.isArray(download?.attributes?.downloads) &&
    download.attributes.downloads.length > 0 &&
    download.attributes.downloads[0]?.url
      ? download.attributes.downloads[0].url
      : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* CMS Navigation Buttons */}
      <CMSNavigationButtons download={download} />

      {/* Action Buttons */}
      <div className="flex gap-2 items-center">
        {/* Back to Render Button - Only show if render ID is available */}
        {renderId && (
          <Button variant="primary" asChild>
            <Link href={`/dashboard/renders/${renderId}`}>Back to Render</Link>
          </Button>
        )}

        {/* External Link Button - Only show if download URL is available */}
        {downloadUrl && (
          <Link href={downloadUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="primary">
              <ExternalLinkIcon size="16" />
            </Button>
          </Link>
        )}

        {/* Strapi Link Button */}
        <Link
          href={`${strapiLocation.download}${downloadID}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary">
            <DatabaseIcon size="16" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

