"use client";

import { Badge } from "@/components/ui/badge";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { DownloadAttentionBadge } from "@/app/dashboard/renders/components/DownloadAttentionBadge";
import {
  classifyDownloadAttention,
  extractErrorHandlerTypes,
  resolveDownloadPrimaryErrorMessage,
} from "@/lib/downloads/downloadAttention";
import type { Download } from "@/types/download";

export function DownloadAttentionSection({ download }: { download: Download }) {
  const { hasError, hasBeenProcessed, errorHandler, UserErrorMessage } =
    download.attributes;

  const bucket = classifyDownloadAttention({
    hasError,
    hasBeenProcessed,
    errorHandler,
  });
  const primaryError = resolveDownloadPrimaryErrorMessage(
    UserErrorMessage,
    errorHandler,
  );
  const errorTypes = extractErrorHandlerTypes(errorHandler);

  return (
    <SectionContainer
      title="Download attention"
      description="Output quality from Creator flags and errorHandler (same rules as render Downloads and fleet QC)."
      variant="compact"
    >
      <div className="space-y-3">
        <DownloadAttentionBadge bucket={bucket} />
        {primaryError ? (
          <p className="text-sm text-red-900 whitespace-pre-wrap">{primaryError}</p>
        ) : bucket !== "ok" ? (
          <p className="text-sm text-muted-foreground">No error message on this row.</p>
        ) : null}
        {errorTypes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {errorTypes.map((type) => (
              <Badge key={type} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
