"use client";

import type { CommonAssetDetails } from "@/types/downloadAsset";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, Sparkles } from "lucide-react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

interface SettingsProps {
  commonDetails: CommonAssetDetails;
}

/**
 * Settings Component
 *
 * Displays video settings, template settings, and theme:
 * - Video Settings (Fixture Category, Grouping Category, Template, Title, Video Title, Composition ID)
 * - Template Settings (Use Background, Mode, Category, Palette, Audio Bundle)
 * - Theme (Primary, Secondary, Dark, White color palette)
 */
export default function Settings({ commonDetails }: SettingsProps) {
  const { videoMeta } = commonDetails;

  return (
    <SectionContainer
      title="Settings"
      description="Video settings, template configuration, and theme"
    >
      <div className="space-y-6">
        {/* Grid Layout: Video & Template Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Settings Card */}
          <Card className="shadow-none border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Video Settings
              </CardTitle>
              <CardDescription>
                Video metadata and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {videoMeta.video.fixtureCategory && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Fixture Category
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {videoMeta.video.fixtureCategory}
                  </Badge>
                </div>
              )}
              {videoMeta.video.groupingCategory && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Grouping Category
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {videoMeta.video.groupingCategory}
                  </Badge>
                </div>
              )}
              {videoMeta.video.appearance.template && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Template
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200"
                  >
                    <Sparkles className="h-3 w-3 mr-1 inline" />
                    {videoMeta.video.appearance.template}
                  </Badge>
                </div>
              )}
              {videoMeta.video.metadata.title && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Title</span>
                  <span className="font-medium text-sm text-right">
                    {videoMeta.video.metadata.title}
                  </span>
                </div>
              )}
              {videoMeta.video.metadata.videoTitle && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Video Title
                  </span>
                  <span className="font-medium text-sm text-right">
                    {videoMeta.video.metadata.videoTitle}
                  </span>
                </div>
              )}
              {videoMeta.video.metadata.compositionId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Composition ID
                  </span>
                  <span className="font-mono text-xs text-slate-600 text-right">
                    {videoMeta.video.metadata.compositionId}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Template Settings Card */}
          {(videoMeta.video.templateVariation.useBackground ||
            videoMeta.video.templateVariation.mode ||
            videoMeta.video.templateVariation.category ||
            videoMeta.video.templateVariation.palette) && (
            <Card className="shadow-none border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Template Settings
                </CardTitle>
                <CardDescription>
                  Template configuration and variation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {videoMeta.video.templateVariation.useBackground && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Use Background
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-slate-50 text-slate-700 border-slate-200"
                    >
                      {videoMeta.video.templateVariation.useBackground}
                    </Badge>
                  </div>
                )}
                {videoMeta.video.templateVariation.mode && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Mode</span>
                    <Badge
                      variant="outline"
                      className="bg-slate-50 text-slate-700 border-slate-200"
                    >
                      {videoMeta.video.templateVariation.mode}
                    </Badge>
                  </div>
                )}
                {videoMeta.video.templateVariation.category?.name && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Category Name
                    </span>
                    <span className="font-medium text-sm text-right">
                      {videoMeta.video.templateVariation.category.name}
                    </span>
                  </div>
                )}
                {videoMeta.video.templateVariation.category?.slug && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Category Slug
                    </span>
                    <span className="font-mono text-xs text-slate-600 text-right">
                      {videoMeta.video.templateVariation.category.slug}
                    </span>
                  </div>
                )}
                {videoMeta.video.templateVariation.palette && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Palette
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-slate-50 text-slate-700 border-slate-200"
                    >
                      {videoMeta.video.templateVariation.palette}
                    </Badge>
                  </div>
                )}
                {videoMeta.video.templateVariation.category?.bundleAudio
                  ?.Name && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Audio Bundle Name
                    </span>
                    <span className="font-medium text-sm text-right">
                      {
                        videoMeta.video.templateVariation.category.bundleAudio
                          .Name
                      }
                    </span>
                  </div>
                )}
                {videoMeta.video.templateVariation.category?.bundleAudio
                  ?.audio_options &&
                  videoMeta.video.templateVariation.category.bundleAudio
                    .audio_options.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Audio Options
                        </span>
                        <span className="text-sm font-medium">
                          {
                            videoMeta.video.templateVariation.category
                              .bundleAudio.audio_options.length
                          }{" "}
                          option
                          {videoMeta.video.templateVariation.category
                            .bundleAudio.audio_options.length !== 1
                            ? "s"
                            : ""}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {videoMeta.video.templateVariation.category.bundleAudio.audio_options
                          .slice(0, 3)
                          .map((audio, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-slate-50 text-slate-600 border-slate-200 text-xs"
                            >
                              <Film className="h-3 w-3 mr-1 inline" />
                              {audio.Name}
                            </Badge>
                          ))}
                        {videoMeta.video.templateVariation.category
                          .bundleAudio.audio_options.length > 3 && (
                          <Badge
                            variant="outline"
                            className="bg-slate-50 text-slate-600 border-slate-200 text-xs"
                          >
                            +
                            {
                              videoMeta.video.templateVariation.category
                                .bundleAudio.audio_options.length - 3
                            }{" "}
                            more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Theme Settings Card - Full Width */}
        <Card className="shadow-none border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Theme</CardTitle>
            <CardDescription>
              Visual appearance and theme color palette
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Primary */}
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50/50">
                <div
                  className="w-12 h-12 rounded-md border-2 border-white shadow-sm flex-shrink-0"
                  style={{
                    backgroundColor: videoMeta.video.appearance.theme.primary,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700">
                    Primary
                  </p>
                  <p className="text-xs font-mono text-slate-500 truncate">
                    {videoMeta.video.appearance.theme.primary}
                  </p>
                </div>
              </div>

              {/* Secondary */}
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50/50">
                <div
                  className="w-12 h-12 rounded-md border-2 border-white shadow-sm flex-shrink-0"
                  style={{
                    backgroundColor:
                      videoMeta.video.appearance.theme.secondary,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700">
                    Secondary
                  </p>
                  <p className="text-xs font-mono text-slate-500 truncate">
                    {videoMeta.video.appearance.theme.secondary}
                  </p>
                </div>
              </div>

              {/* Dark */}
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50/50">
                <div
                  className="w-12 h-12 rounded-md border-2 border-white shadow-sm flex-shrink-0"
                  style={{
                    backgroundColor: videoMeta.video.appearance.theme.dark,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700">Dark</p>
                  <p className="text-xs font-mono text-slate-500 truncate">
                    {videoMeta.video.appearance.theme.dark}
                  </p>
                </div>
              </div>

              {/* White */}
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50/50">
                <div
                  className="w-12 h-12 rounded-md border-2 border-white shadow-sm flex-shrink-0"
                  style={{
                    backgroundColor: videoMeta.video.appearance.theme.white,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700">White</p>
                  <p className="text-xs font-mono text-slate-500 truncate">
                    {videoMeta.video.appearance.theme.white}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionContainer>
  );
}

