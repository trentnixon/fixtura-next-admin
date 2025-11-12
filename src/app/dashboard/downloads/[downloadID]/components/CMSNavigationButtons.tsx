"use client";

import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import Link from "next/link";
import { Download } from "@/types/download";
import { User, Calendar, Video } from "lucide-react";
import { getCommonAssetDetails } from "@/utils/downloadAsset";

interface CMSNavigationButtonsProps {
  download: Download;
  className?: string;
}

/**
 * CMSNavigationButtons Component
 *
 * Displays buttons for navigating to CMS (Strapi) admin pages:
 * - Account: Links to account admin page
 * - Scheduler: Links to scheduler admin page
 * - Render: Links to render admin page
 *
 * Only shows buttons when IDs are available.
 */
export default function CMSNavigationButtons({
  download,
  className = "",
}: CMSNavigationButtonsProps) {
  const { strapiLocation } = useGlobalContext();

  // Get IDs from multiple sources (prioritize common asset details from OBJ)
  const commonDetails = getCommonAssetDetails(download);

  // Account ID - from common details (OBJ.account.accountId)
  const accountId = commonDetails?.account?.accountId || null;

  // Scheduler ID - from common details (OBJ.render.schedulerId)
  const schedulerId = commonDetails?.render?.schedulerId || null;

  // Render ID - from common details (OBJ.render.renderId) or download object
  const renderId =
    commonDetails?.render?.renderId ||
    download?.attributes?.render?.data?.id ||
    null;

  // Build URLs
  const accountUrl = accountId
    ? `${strapiLocation.account}${accountId}`
    : null;
  const schedulerUrl = schedulerId
    ? `${strapiLocation.scheduler}${schedulerId}`
    : null;
  const renderUrl = renderId ? `${strapiLocation.render}${renderId}` : null;

  // Don't render if no IDs are available
  if (!accountId && !schedulerId && !renderId) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Account Button */}
      {accountUrl && (
        <Button variant="primary" asChild size="sm">
          <Link href={accountUrl} target="_blank" rel="noopener noreferrer">
            <User className="h-4 w-4 mr-2" />
            Account
          </Link>
        </Button>
      )}

      {/* Scheduler Button */}
      {schedulerUrl && (
        <Button variant="primary" asChild size="sm">
          <Link
            href={schedulerUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Scheduler
          </Link>
        </Button>
      )}

      {/* Render Button */}
      {renderUrl && (
        <Button variant="primary" asChild size="sm">
          <Link href={renderUrl} target="_blank" rel="noopener noreferrer">
            <Video className="h-4 w-4 mr-2" />
            Render
          </Link>
        </Button>
      )}
    </div>
  );
}

