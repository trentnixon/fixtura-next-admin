"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Image as ImageIcon, Download, Clock } from "lucide-react";
import { SingleFixtureDetailResponse } from "@/types/fixtureDetail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { format } from "date-fns";

interface FixtureAdditionalProps {
    data: SingleFixtureDetailResponse;
}

export default function FixtureAdditional({ data }: FixtureAdditionalProps) {
    const { fixture, downloads, renderStatus, context, meta } = data;
    const [showContent, setShowContent] = useState(false);
    const [showRenders, setShowRenders] = useState(false);
    const [showAdmin, setShowAdmin] = useState(false);

    const hasContent =
        fixture.content.gameContext ||
        fixture.content.basePromptInformation ||
        fixture.content.upcomingFixturePrompt;

    const hasDownloads = downloads && downloads.length > 0;

    const hasRenders =
        (renderStatus.upcomingGamesRenders && renderStatus.upcomingGamesRenders.length > 0) ||
        (renderStatus.gameResultsRenders && renderStatus.gameResultsRenders.length > 0);

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
            title="Additional Information"
            description="Content, downloads, renders, and admin data"
        >
            <div className="space-y-4">
                {/* Content Section */}
                {hasContent && (
                    <div className="border rounded-lg">
                        <Button
                            variant="ghost"
                            onClick={() => setShowContent(!showContent)}
                            className="w-full justify-between p-4"
                        >
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span className="font-medium">AI Content & Prompts</span>
                                {fixture.content.hasBasePrompt && fixture.content.hasUpcomingFixturePrompt && (
                                    <Badge variant="default" className="ml-2">Complete</Badge>
                                )}
                            </div>
                            {showContent ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                        {showContent && (
                            <div className="p-4 pt-0 space-y-3">
                                {fixture.content.gameContext && (
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-1">Game Context</div>
                                        <div className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                                            {fixture.content.gameContext}
                                        </div>
                                    </div>
                                )}
                                {fixture.content.basePromptInformation && (
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-1">Base Prompt</div>
                                        <div className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-900 rounded whitespace-pre-wrap">
                                            {fixture.content.basePromptInformation}
                                        </div>
                                    </div>
                                )}
                                {fixture.content.upcomingFixturePrompt && (
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-1">Upcoming Fixture Prompt</div>
                                        <div className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-900 rounded whitespace-pre-wrap">
                                            {fixture.content.upcomingFixturePrompt}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Downloads Section */}
                {hasDownloads && (
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Download className="w-4 h-4" />
                            <span className="font-medium">Downloads & Media ({downloads.length})</span>
                        </div>
                        <div className="space-y-2">
                            {downloads.map((download) => (
                                <div
                                    key={download.id}
                                    className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-900"
                                >
                                    <div className="flex items-center gap-2">
                                        {download.type?.includes("image") ? (
                                            <ImageIcon className="w-4 h-4 text-gray-500" />
                                        ) : (
                                            <FileText className="w-4 h-4 text-gray-500" />
                                        )}
                                        <span className="text-sm">{download.name || `Download #${download.id}`}</span>
                                        {download.type && (
                                            <Badge variant="outline" className="text-xs">
                                                {download.type}
                                            </Badge>
                                        )}
                                    </div>
                                    {download.url && (
                                        <Button variant="ghost" size="sm" asChild>
                                            <a href={download.url} target="_blank" rel="noopener noreferrer">
                                                View
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Renders Section */}
                {hasRenders && (
                    <div className="border rounded-lg">
                        <Button
                            variant="ghost"
                            onClick={() => setShowRenders(!showRenders)}
                            className="w-full justify-between p-4"
                        >
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                <span className="font-medium">Render Status</span>
                            </div>
                            {showRenders ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                        {showRenders && (
                            <div className="p-4 pt-0 space-y-3">
                                {renderStatus.upcomingGamesRenders && renderStatus.upcomingGamesRenders.length > 0 && (
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-2">
                                            Upcoming Games ({renderStatus.upcomingGamesRenders.length})
                                        </div>
                                        <div className="space-y-1">
                                            {renderStatus.upcomingGamesRenders.map((render) => (
                                                <div key={render.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-900 rounded">
                                                    <span>Render #{render.id}</span>
                                                    <div className="flex items-center gap-2">
                                                        {render.status && <Badge variant="outline">{render.status}</Badge>}
                                                        {render.processedAt && (
                                                            <span className="text-xs text-gray-500">{formatDate(render.processedAt)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {renderStatus.gameResultsRenders && renderStatus.gameResultsRenders.length > 0 && (
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-2">
                                            Game Results ({renderStatus.gameResultsRenders.length})
                                        </div>
                                        <div className="space-y-1">
                                            {renderStatus.gameResultsRenders.map((render) => (
                                                <div key={render.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-900 rounded">
                                                    <span>Render #{render.id}</span>
                                                    <div className="flex items-center gap-2">
                                                        {render.status && <Badge variant="outline">{render.status}</Badge>}
                                                        {render.processedAt && (
                                                            <span className="text-xs text-gray-500">{formatDate(render.processedAt)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Admin Context */}
                <div className="border rounded-lg">
                    <Button
                        variant="ghost"
                        onClick={() => setShowAdmin(!showAdmin)}
                        className="w-full justify-between p-4"
                    >
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">Admin & Timestamps</span>
                        </div>
                        {showAdmin ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                    {showAdmin && (
                        <div className="p-4 pt-0">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                {context.admin.createdAt && (
                                    <div>
                                        <div className="text-xs font-medium text-gray-500">Created</div>
                                        <div className="text-gray-700 dark:text-gray-300">{formatDate(context.admin.createdAt)}</div>
                                    </div>
                                )}
                                {context.admin.updatedAt && (
                                    <div>
                                        <div className="text-xs font-medium text-gray-500">Updated</div>
                                        <div className="text-gray-700 dark:text-gray-300">{formatDate(context.admin.updatedAt)}</div>
                                    </div>
                                )}
                                {context.admin.publishedAt && (
                                    <div>
                                        <div className="text-xs font-medium text-gray-500">Published</div>
                                        <div className="text-gray-700 dark:text-gray-300">{formatDate(context.admin.publishedAt)}</div>
                                    </div>
                                )}
                                <div>
                                    <div className="text-xs font-medium text-gray-500">Generated</div>
                                    <div className="text-gray-700 dark:text-gray-300">{formatDate(meta.generatedAt)}</div>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                                Performance: {meta.performance.totalTimeMs}ms (fetch: {meta.performance.fetchTimeMs}ms, process: {meta.performance.processingTimeMs}ms)
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SectionContainer>
    );
}
