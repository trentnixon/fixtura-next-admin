"use client";

import { useState } from "react";
import type { CommonAssetDetails } from "@/types/downloadAsset";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";

interface MetadataTableProps {
  commonDetails: CommonAssetDetails;
}

/**
 * MetadataTable Component
 *
 * Displays metadata in a compact table format:
 * - Asset Metadata (Asset ID, Asset Type ID, Asset Category ID, Assets Link ID)
 * - Render Metadata (Scheduler ID, Render ID)
 * - Account Metadata (Account ID)
 * - Render Timings (FPS Main, FPS Intro, FPS Outro, FPS Ladder, FPS Scorecard)
 * - Frames (Frame Count, Frame Numbers)
 */
export default function MetadataTable({
  commonDetails,
}: MetadataTableProps) {
  const [copiedAssetId, setCopiedAssetId] = useState(false);
  const [copiedAssetsLinkId, setCopiedAssetsLinkId] = useState(false);
  const [copiedRenderId, setCopiedRenderId] = useState(false);

  const { asset, render, account, timings, frames } = commonDetails;

  // Copy functions
  const handleCopyAssetId = () => {
    if (asset.assetID) {
      navigator.clipboard.writeText(String(asset.assetID));
      setCopiedAssetId(true);
      setTimeout(() => setCopiedAssetId(false), 2000);
    }
  };

  const handleCopyAssetsLinkId = () => {
    if (asset.assetsLinkID) {
      navigator.clipboard.writeText(asset.assetsLinkID);
      setCopiedAssetsLinkId(true);
      setTimeout(() => setCopiedAssetsLinkId(false), 2000);
    }
  };

  const handleCopyRenderId = () => {
    if (render.renderId) {
      navigator.clipboard.writeText(String(render.renderId));
      setCopiedRenderId(true);
      setTimeout(() => setCopiedRenderId(false), 2000);
    }
  };

  return (
    <SectionContainer
      title="Metadata"
      description="Technical metadata and identification information"
    >
      <div className="">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Category</TableHead>
              <TableHead className="w-[200px]">Field</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
                {/* Asset Metadata */}
                <TableRow>
                  <TableCell
                    rowSpan={asset.assetsLinkID ? 4 : 3}
                    className="font-medium align-top"
                  >
                    Asset Metadata
                  </TableCell>
                  <TableCell>Asset ID</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{asset.assetID || "N/A"}</span>
                      {asset.assetID && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={handleCopyAssetId}
                              >
                                {copiedAssetId ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{copiedAssetId ? "Copied!" : "Copy Asset ID"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Asset Type ID</TableCell>
                  <TableCell className="font-mono">
                    {asset.assetTypeID || "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Asset Category ID</TableCell>
                  <TableCell className="font-mono">
                    {asset.assetCategoryID || "N/A"}
                  </TableCell>
                </TableRow>
                {asset.assetsLinkID && (
                  <TableRow>
                    <TableCell>Assets Link ID</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs break-all">
                          {asset.assetsLinkID}
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 flex-shrink-0"
                                onClick={handleCopyAssetsLinkId}
                              >
                                {copiedAssetsLinkId ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {copiedAssetsLinkId
                                  ? "Copied!"
                                  : "Copy Assets Link ID"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Render Metadata */}
                <TableRow>
                  <TableCell rowSpan={2} className="font-medium align-top">
                    Render Metadata
                  </TableCell>
                  <TableCell>Scheduler ID</TableCell>
                  <TableCell className="font-mono">
                    {render.schedulerId || "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Render ID</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{render.renderId || "N/A"}</span>
                      {render.renderId && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={handleCopyRenderId}
                              >
                                {copiedRenderId ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {copiedRenderId ? "Copied!" : "Copy Render ID"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                </TableRow>

                {/* Account Metadata */}
                <TableRow>
                  <TableCell className="font-medium">Account Metadata</TableCell>
                  <TableCell>Account ID</TableCell>
                  <TableCell className="font-mono">
                    {account.accountId || "N/A"}
                  </TableCell>
                </TableRow>

                {/* Render Timings */}
                <TableRow>
                  <TableCell
                    rowSpan={5}
                    className="font-medium align-top"
                  >
                    Render Timings
                  </TableCell>
                  <TableCell>FPS Main</TableCell>
                  <TableCell className="font-mono">
                    {timings.FPS_MAIN || 0} fps
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>FPS Intro</TableCell>
                  <TableCell className="font-mono">
                    {timings.FPS_INTRO || 0} fps
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>FPS Outro</TableCell>
                  <TableCell className="font-mono">
                    {timings.FPS_OUTRO || 0} fps
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>FPS Ladder</TableCell>
                  <TableCell className="font-mono">
                    {timings.FPS_LADDER || 0} fps
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>FPS Scorecard</TableCell>
                  <TableCell className="font-mono">
                    {timings.FPS_SCORECARD || 0} fps
                  </TableCell>
                </TableRow>

                {/* Frames */}
                <TableRow>
                  <TableCell
                    rowSpan={frames.length > 0 ? 2 : 1}
                    className="font-medium align-top"
                  >
                    Frames
                  </TableCell>
                  <TableCell>Frame Count</TableCell>
                  <TableCell className="font-mono">{frames.length || 0}</TableCell>
                </TableRow>
                {frames.length > 0 && (
                  <TableRow>
                    <TableCell>Frame Numbers</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {frames.map((frame, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-slate-50 text-slate-700 border-slate-200 font-mono"
                          >
                            {frame}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
    </SectionContainer>
  );
}

