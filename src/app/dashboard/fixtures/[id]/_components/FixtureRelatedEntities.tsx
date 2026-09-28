"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  Download,
  FileText,
  Image as ImageIcon,
  Layers,
  Link2,
} from "lucide-react";

import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SingleFixtureDetailResponse } from "@/types/fixtureDetail";

interface FixtureRelatedEntitiesProps {
  data: SingleFixtureDetailResponse;
  fixtureId: number;
}

function formatDate(dateString: string | null) {
  if (!dateString) return "—";
  try {
    return format(new Date(dateString), "PPp");
  } catch {
    return dateString;
  }
}

export default function FixtureRelatedEntities({
  data,
  fixtureId,
}: FixtureRelatedEntitiesProps) {
  const { grade, downloads, renderStatus } = data;

  const hasDownloads = downloads && downloads.length > 0;
  const hasRenderStatus =
    renderStatus.upcomingGamesRenders.length > 0 ||
    renderStatus.gameResultsRenders.length > 0;

  if (!grade && !hasDownloads && !hasRenderStatus) {
    return (
      <SectionContainer
        title="Related"
        description="Grade, downloads, and render links for this fixture."
        icon={<Link2 className="h-5 w-5 text-slate-500" aria-hidden />}
      >
        <p className="text-sm text-muted-foreground">
          No related entities are linked to fixture #{fixtureId}.
        </p>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer
      title="Related"
      description="Grade, downloads, and render links for this fixture."
      icon={<Link2 className="h-5 w-5 text-slate-500" aria-hidden />}
      action={
        grade?.id ? (
          <Button asChild variant="accent" size="sm">
            <Link href={`/dashboard/grades/${grade.id}`}>
              <Layers className="h-4 w-4" />
              View Grade
            </Link>
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-6">
        {grade ? (
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium uppercase text-slate-500">
              Grade
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {grade.gradeName}
            </p>
            {grade.association ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {grade.association.name}
              </p>
            ) : null}
          </div>
        ) : null}

        {hasDownloads ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
              <Download className="h-4 w-4 text-slate-500" />
              Downloads & media ({downloads.length})
            </div>
            <div className="space-y-2">
              {downloads.map((download) => (
                <div
                  key={download.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    {download.type?.includes("image") ? (
                      <ImageIcon className="h-4 w-4 shrink-0 text-slate-500" />
                    ) : (
                      <FileText className="h-4 w-4 shrink-0 text-slate-500" />
                    )}
                    <span className="truncate text-sm text-slate-900">
                      {download.name || `Download #${download.id}`}
                    </span>
                    {download.type ? (
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {download.type}
                      </Badge>
                    ) : null}
                  </div>
                  {download.url ? (
                    <DashboardLinkButton
                      href={download.url}
                      trailingIcon="external"
                      intent="supporting"
                    >
                      Open
                    </DashboardLinkButton>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {hasRenderStatus ? (
          <div className="space-y-4">
            {renderStatus.upcomingGamesRenders.length > 0 ? (
              <RenderGroup
                title="Upcoming games renders"
                renders={renderStatus.upcomingGamesRenders}
              />
            ) : null}
            {renderStatus.gameResultsRenders.length > 0 ? (
              <RenderGroup
                title="Game results renders"
                renders={renderStatus.gameResultsRenders}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </SectionContainer>
  );
}

function RenderGroup({
  title,
  renders,
}: {
  title: string;
  renders: { id: number; status: string | null; processedAt: string | null }[];
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-900">
        {title} ({renders.length})
      </p>
      <div className="space-y-2">
        {renders.map((render) => (
          <div
            key={render.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-900">
                Render #{render.id}
              </span>
              {render.status ? (
                <Badge variant="outline" className="text-xs">
                  {render.status}
                </Badge>
              ) : null}
            </div>
            <div className="flex items-center gap-3">
              {render.processedAt ? (
                <span className="text-xs text-muted-foreground">
                  {formatDate(render.processedAt)}
                </span>
              ) : null}
              <DashboardLinkButton
                href={`/dashboard/renders/${render.id}`}
                trailingIcon="arrow"
              >
                View
              </DashboardLinkButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
