"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Download } from "@/types/download";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Mail,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Text from "@/components/ui-library/foundation/Text";
import StyledLink from "@/components/ui-library/foundation/Link";
import { Label } from "@/components/type/titles";

interface DisplayDownloadProps {
  download: Download;
}

interface DownloadItem {
  url: string;
  [key: string]: unknown;
}

export default function DisplayDownload({ download }: DisplayDownloadProps) {
  // Hooks must be called before any early returns
  const [isRawDataOpen, setIsRawDataOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  // Get downloads array safely for useEffect
  const downloadsArray = download?.attributes?.downloads;

  // Handle keyboard navigation for image dialog
  useEffect(() => {
    if (
      selectedImageIndex === null ||
      !Array.isArray(downloadsArray) ||
      downloadsArray.length <= 1
    )
      return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSelectedImageIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : downloadsArray.length - 1
        );
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setSelectedImageIndex((prev) =>
          prev !== null && prev < downloadsArray.length - 1 ? prev + 1 : 0
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, downloadsArray]);

  // Check if data exists and destructure safely
  if (!download || !download.attributes) {
    return null;
  }

  const {
    Name,
    CompletionTime,
    DisplayCost,
    OutputFileSize,
    downloads,
    asset,
    asset_category,
    hasBeenProcessed,
    hasError,
    isAccurate,
    forceRerender,
    UserErrorMessage,
    numDownloads,
    assetLinkID,
    gameID,
    errorEmailSentToAdmin,
  } = download.attributes;

  return (
    <div className="space-y-6">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Download Details */}
        <Card className="shadow-none border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Download Details
            </CardTitle>
            <CardDescription>
              Completion time, cost, and file size information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Completion Time</p>
              <p className="font-medium">{CompletionTime || "N/A"}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Cost</p>
              <p className="font-medium">
                {DisplayCost ? `$${DisplayCost.toFixed(2)}` : "N/A"}
              </p>
            </div>
            {OutputFileSize && (
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">File Size</p>
                <p className="font-medium">{OutputFileSize}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 2: Asset Information */}
        <Card className="shadow-none border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Asset Information
            </CardTitle>
            <CardDescription>
              Asset details, category, and composition information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Asset Name</p>
              <p className="font-medium">
                {asset?.data?.attributes?.Name || "N/A"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Asset Category</p>
              {asset_category?.data?.attributes?.Identifier ? (
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  {asset_category.data.attributes.Identifier}
                </Badge>
              ) : (
                <p className="font-medium">N/A</p>
              )}
            </div>
            {asset?.data?.attributes?.CompositionID && (
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Composition ID</p>
                <p className="font-medium">
                  {asset.data.attributes.CompositionID}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Status */}
        <Card className="shadow-none border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Status</CardTitle>
            <CardDescription>
              Download processing status and accuracy indicators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {/* Processed Status */}
              <Badge
                variant="outline"
                className={
                  hasBeenProcessed
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }
              >
                {hasBeenProcessed ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                Processed
              </Badge>

              {/* Error Status */}
              <Badge
                variant="outline"
                className={
                  hasError
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }
              >
                {hasError ? (
                  <AlertCircle className="h-3 w-3 mr-1" />
                ) : (
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                )}
                {hasError ? "Has Error" : "No Errors"}
              </Badge>

              {/* Accurate Status - Only show if accurate */}
              {isAccurate && (
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Accurate
                </Badge>
              )}

              {/* Force Rerender - Only show if true */}
              {forceRerender && (
                <Badge
                  variant="outline"
                  className="bg-orange-50 text-orange-700 border-orange-200"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Force Rerender
                </Badge>
              )}

              {/* Error Email Sent - Only show if true */}
              {errorEmailSentToAdmin && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Error Email Sent
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Download Links Section */}
      <SectionContainer
        title="Download Links"
        description="Access download files and resources"
      >
        <div className="space-y-4">
          {Array.isArray(downloads) && downloads.length > 0 ? (
            <>
              {/* Video Player - Show if asset category is VIDEO */}
              {asset_category?.data?.attributes?.Identifier?.toUpperCase() ===
                "VIDEO" && (
                <div className="space-y-4">
                  {downloads.map((download: DownloadItem, index: number) => (
                    <div key={index} className="flex justify-center">
                      <div
                        className="relative rounded-lg border overflow-hidden bg-black"
                        style={{ width: "800px", height: "450px" }}
                      >
                        <video
                          controls
                          width="800"
                          height="450"
                          className="w-full h-full object-contain"
                          preload="metadata"
                        >
                          <source src={download.url} />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      {downloads.length > 1 && (
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Video {index + 1} of {downloads.length}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Image Gallery - Show if asset category is Image */}
              {asset_category?.data?.attributes?.Identifier?.toUpperCase() ===
                "IMAGE" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {downloads.map((download: DownloadItem, index: number) => (
                      <div
                        key={index}
                        className="relative group flex flex-col items-center"
                      >
                        <div
                          className="relative rounded-lg border overflow-hidden bg-slate-50 cursor-pointer group"
                          style={{ width: "300px", height: "375px" }}
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <Image
                            src={download.url}
                            alt={`Download ${index + 1} - ${Name || "Image"}`}
                            width={300}
                            height={375}
                            className="w-full h-full object-contain transition-transform duration-200 pointer-events-none group-hover:scale-105"
                            unoptimized
                            style={{ maxWidth: "300px", maxHeight: "375px" }}
                          />
                        </div>
                        {downloads.length > 1 && (
                          <p className="text-xs text-muted-foreground mt-2 text-center">
                            Image {index + 1} of {downloads.length}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Image Dialog */}
                  <Dialog
                    open={selectedImageIndex !== null}
                    onOpenChange={(open) =>
                      !open && setSelectedImageIndex(null)
                    }
                  >
                    <DialogContent
                      className="p-0 bg-black/95 border-none [&>button]:text-white [&>button]:hover:bg-white/20 [&>button]:right-2 [&>button]:top-2 focus:outline-none"
                      style={{ width: "900px", maxWidth: "90vw" }}
                    >
                      {/* Visually hidden title for accessibility */}
                      <DialogTitle className="sr-only">
                        {selectedImageIndex !== null
                          ? `Image ${selectedImageIndex + 1} of ${downloads.length} - ${Name || "Download"}`
                          : "Image Viewer"}
                      </DialogTitle>
                      {selectedImageIndex !== null && (
                        <div className="relative">
                          {/* Image */}
                          <div className="flex items-center justify-center p-6">
                            <Image
                              src={downloads[selectedImageIndex]?.url}
                              alt={`Download ${selectedImageIndex + 1} - ${
                                Name || "Image"
                              }`}
                              width={800}
                              height={1000}
                              className="object-contain"
                              unoptimized
                              style={{
                                maxWidth: "800px",
                                maxHeight: "600px",
                                width: "auto",
                                height: "auto",
                              }}
                            />
                          </div>

                          {/* Navigation Buttons - Only show if multiple images */}
                          {downloads.length > 1 && (
                            <>
                              {/* Previous Button */}
                              <Button
                                variant="secondary"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-white/20 z-10"
                                onClick={() =>
                                  setSelectedImageIndex(
                                    selectedImageIndex > 0
                                      ? selectedImageIndex - 1
                                      : downloads.length - 1
                                  )
                                }
                                aria-label="Previous image"
                              >
                                <ChevronLeft className="h-6 w-6" />
                              </Button>

                              {/* Next Button */}
                              <Button
                                variant="secondary"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-white/20 z-10"
                                onClick={() =>
                                  setSelectedImageIndex(
                                    selectedImageIndex < downloads.length - 1
                                      ? selectedImageIndex + 1
                                      : 0
                                  )
                                }
                                aria-label="Next image"
                              >
                                <ChevronRight className="h-6 w-6" />
                              </Button>

                              {/* Image Counter */}
                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-md text-sm z-10">
                                Image {selectedImageIndex + 1} of{" "}
                                {downloads.length}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </>
              )}

              {/* Fallback - Show link if not VIDEO or Image */}
              {asset_category?.data?.attributes?.Identifier?.toUpperCase() !==
                "VIDEO" &&
                asset_category?.data?.attributes?.Identifier?.toUpperCase() !==
                  "IMAGE" && (
                  <div className="space-y-2">
                    {downloads.map((download: DownloadItem, index: number) => (
                      <div key={index}>
                        <StyledLink href={download.url} external size="small">
                          {downloads.length > 1
                            ? `Download ${index + 1}`
                            : "Download File"}
                        </StyledLink>
                      </div>
                    ))}
                    {numDownloads && numDownloads > 1 && (
                      <Text variant="small" className="text-slate-600">
                        {numDownloads} download(s) available
                      </Text>
                    )}
                  </div>
                )}
            </>
          ) : (
            <Text>No download link available.</Text>
          )}
        </div>
      </SectionContainer>

      {/* Error Message & Related IDs Section */}
      {(hasError && UserErrorMessage) || assetLinkID || gameID ? (
        <SectionContainer
          title="Additional Information"
          description="Error messages and related IDs"
        >
          <div className="space-y-4">
            {/* Error Message */}
            {hasError && UserErrorMessage && (
              <div>
                <Label className="mb-2">Error Message:</Label>
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <Text className="text-red-700">{UserErrorMessage}</Text>
                </div>
              </div>
            )}

            {/* Related IDs */}
            {(assetLinkID || gameID) && (
              <div>
                <Label className="mb-2">Related IDs:</Label>
                <div className="space-y-1">
                  {assetLinkID && (
                    <Text>
                      <Text as="span" weight="semibold">
                        Asset Link ID:
                      </Text>{" "}
                      {assetLinkID}
                    </Text>
                  )}
                  {gameID && (
                    <Text>
                      <Text as="span" weight="semibold">
                        Game ID:
                      </Text>{" "}
                      {gameID}
                    </Text>
                  )}
                </div>
              </div>
            )}
          </div>
        </SectionContainer>
      ) : null}

      {/* Raw Data Section - Collapsible */}
      <SectionContainer
        title="Raw Data"
        description="Complete download data in JSON format"
      >
        <Collapsible open={isRawDataOpen} onOpenChange={setIsRawDataOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>{isRawDataOpen ? "Hide" : "Show"} Raw JSON Data</span>
              {isRawDataOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(download, null, 2)}
            </pre>
          </CollapsibleContent>
        </Collapsible>
      </SectionContainer>
    </div>
  );
}
