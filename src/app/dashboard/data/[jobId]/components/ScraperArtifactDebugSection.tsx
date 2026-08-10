"use client";

import { useMemo } from "react";
import Link from "next/link";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { useScraperArtifacts } from "@/hooks/data-collection/useScraperArtifacts";
import { resolveStrapiMediaUrl } from "@/lib/utils/strapiMediaUrl";
import type { ScraperArtifact } from "@/types/scraperArtifact";
import { Camera, ExternalLink, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScraperArtifactDebugSectionProps {
  jobId: string;
  highlightRunId?: string | null;
}

function isImageArtifact(artifact: ScraperArtifact): boolean {
  const mime = artifact.file?.mime ?? artifact.contentType ?? "";
  if (mime.startsWith("image/")) return true;
  return artifact.artifactType === "screenshot";
}

function ArtifactCard({
  artifact,
  cmsOrigin,
  strapiArtifactBase,
  highlight = false,
}: {
  artifact: ScraperArtifact;
  cmsOrigin: string;
  strapiArtifactBase: string;
  highlight?: boolean;
}) {
  const imageUrl = resolveStrapiMediaUrl(artifact.file?.url, cmsOrigin);
  const showImage = isImageArtifact(artifact) && imageUrl;
  const cmsHref = `${strapiArtifactBase}${artifact.id}`;
  const fileName = artifact.file?.name ?? "Screenshot";

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border bg-white",
        highlight ? "border-amber-300 ring-1 ring-amber-200" : "border-slate-200",
      )}
    >
      <div className="relative aspect-video bg-slate-100">
        {showImage ? (
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={fileName}
              className="h-full w-full object-contain bg-slate-950/5"
              loading="lazy"
            />
          </a>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No preview
          </div>
        )}
      </div>
      <div className="space-y-2 p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {artifact.artifactType && (
            <Badge variant="outline" className="text-[10px]">
              {artifact.artifactType}
            </Badge>
          )}
          {artifact.fixtureKey && (
            <Badge variant="secondary" className="font-mono text-[10px]">
              {artifact.fixtureKey}
            </Badge>
          )}
        </div>
        <p
          className="truncate text-xs font-medium text-foreground"
          title={fileName}
        >
          {fileName}
        </p>
        <dl className="grid grid-cols-1 gap-1 text-[11px] text-muted-foreground">
          {artifact.runId && (
            <div>
              <dt className="inline font-medium">Run: </dt>
              <dd className="inline font-mono break-all">{artifact.runId}</dd>
            </div>
          )}
          {artifact.contentType && (
            <div>
              <dt className="inline font-medium">Type: </dt>
              <dd className="inline">{artifact.contentType}</dd>
            </div>
          )}
        </dl>
        <div className="flex flex-wrap gap-2 pt-1">
          {imageUrl && (
            <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
              <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-3 w-3" />
                Open image
              </a>
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
            <Link href={cmsHref} target="_blank" rel="noopener noreferrer">
              CMS record
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ScraperArtifactDebugSection({
  jobId,
  highlightRunId,
}: ScraperArtifactDebugSectionProps) {
  const { Domain, strapiLocation } = useGlobalContext();
  const { artifacts, isLoading, error, refetch, isFetching } =
    useScraperArtifacts({
      jobId,
      highlightRunId,
    });

  const sortedArtifacts = useMemo(() => {
    if (!highlightRunId) return artifacts;
    const run = highlightRunId.trim();
    return [...artifacts].sort((a, b) => {
      const aMatch = a.runId === run ? 0 : 1;
      const bMatch = b.runId === run ? 0 : 1;
      return aMatch - bMatch;
    });
  }, [artifacts, highlightRunId]);

  const filterHint = `jobId ${jobId}`;

  return (
    <SectionContainer
      title="Debug screenshots"
      description={`Failure capture files stored in CMS (fixtura-scraper-artifact). Filtered by ${filterHint}.`}
      icon={<Camera className="h-5 w-5 text-muted-foreground" />}
      variant="compact"
      action={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          Refresh
        </Button>
      }
    >
      {isLoading && (
        <LoadingState message="Loading debug screenshots from CMS…" />
      )}

      {error && !isLoading && (
        <ErrorState
          title="Could not load screenshots"
          error={error}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !error && artifacts.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No artifact records in CMS for job{" "}
          <span className="font-mono">{jobId}</span>. Screenshots are created
          when the scraper uploads debug captures for failed steps.
        </p>
      )}

      {!isLoading && !error && sortedArtifacts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sortedArtifacts.map((artifact) => (
            <ArtifactCard
              key={artifact.id}
              artifact={artifact}
              cmsOrigin={Domain.strapi}
              strapiArtifactBase={strapiLocation.scraperArtifact}
              highlight={
                Boolean(
                  highlightRunId?.trim() &&
                    artifact.runId === highlightRunId.trim(),
                )
              }
            />
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
