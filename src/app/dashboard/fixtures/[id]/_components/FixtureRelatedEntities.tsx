"use client";

import { Download, Image as ImageIcon, FileText, ExternalLink } from "lucide-react";
import { SingleFixtureDetailResponse } from "@/types/fixtureDetail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { format } from "date-fns";

interface FixtureRelatedEntitiesProps {
  data: SingleFixtureDetailResponse;
}

export default function FixtureRelatedEntities({
  data,
}: FixtureRelatedEntitiesProps) {
  const { grade, downloads, renderStatus } = data;

  const hasDownloads = downloads && downloads.length > 0;
  const hasRenderStatus =
    (renderStatus.upcomingGamesRenders &&
      renderStatus.upcomingGamesRenders.length > 0) ||
    (renderStatus.gameResultsRenders &&
      renderStatus.gameResultsRenders.length > 0);

  if (!grade && !hasDownloads && !hasRenderStatus) {
    return null;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "PPp");
    } catch {
      return dateString;
    }
  };

  return (
    <SectionContainer
      title="Related Entities"
      description="Associated grade, downloads, and render status"
    >
      <div className="space-y-6">
        {/* Grade Information */}
        {grade && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Grade
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border">
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {grade.gradeName}
              </div>
              {grade.association && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Association: {grade.association.name}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Downloads/Media */}
        {hasDownloads && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>Downloads & Media ({downloads.length})</span>
            </div>
            <div className="space-y-2">
              {downloads.map((download) => (
                <div
                  key={download.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {download.type?.includes("image") ? (
                      <ImageIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {download.name || `Download #${download.id}`}
                    </span>
                    {download.type && (
                      <Badge variant="outline" className="text-xs">
                        {download.type}
                      </Badge>
                    )}
                  </div>
                  {download.url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="flex-shrink-0"
                    >
                      <a
                        href={download.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Render Status */}
        {hasRenderStatus && (
          <div className="space-y-4">
            {/* Upcoming Games Renders */}
            {renderStatus.upcomingGamesRenders &&
              renderStatus.upcomingGamesRenders.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Upcoming Games Renders (
                    {renderStatus.upcomingGamesRenders.length})
                  </div>
                  <div className="space-y-2">
                    {renderStatus.upcomingGamesRenders.map((render) => (
                      <div
                        key={render.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Render #{render.id}
                          </span>
                          {render.status && (
                            <Badge variant="outline" className="text-xs">
                              {render.status}
                            </Badge>
                          )}
                        </div>
                        {render.processedAt && (
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {formatDate(render.processedAt)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Game Results Renders */}
            {renderStatus.gameResultsRenders &&
              renderStatus.gameResultsRenders.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Game Results Renders (
                    {renderStatus.gameResultsRenders.length})
                  </div>
                  <div className="space-y-2">
                    {renderStatus.gameResultsRenders.map((render) => (
                      <div
                        key={render.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Render #{render.id}
                          </span>
                          {render.status && (
                            <Badge variant="outline" className="text-xs">
                              {render.status}
                            </Badge>
                          )}
                        </div>
                        {render.processedAt && (
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {formatDate(render.processedAt)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}


