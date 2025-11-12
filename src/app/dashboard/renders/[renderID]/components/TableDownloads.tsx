"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { CheckIcon, DatabaseIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useDownloadsQuery } from "@/hooks/downloads/useDownloadsQuery";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { SubsectionTitle, Label } from "@/components/type/titles";
import Text from "@/components/ui-library/foundation/Text";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";

// Helper to group data
function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return items.reduce((result, item) => {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export default function TableDownloads() {
  const { renderID } = useParams();
  const { strapiLocation } = useGlobalContext();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch data
  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchDownloads,
  } = useDownloadsQuery(renderID as string);

  // Group downloads by `grouping_category` and then by asset name
  const groupedByCategory = groupBy(
    data || [],
    (download) => download.attributes.grouping_category || "Uncategorized"
  );

  // Auto-select first category when data is loaded
  useEffect(() => {
    const categoryKeys = Object.keys(groupedByCategory);
    if (categoryKeys.length > 0 && selectedCategory === "all") {
      setSelectedCategory(categoryKeys[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupedByCategory]);

  // UI: Loading State
  if (isLoading) {
    return <LoadingState message="Loading downloads…" />;
  }

  // UI: Error State
  if (isError) {
    return (
      <ErrorState
        variant="card"
        title="Unable to load downloads"
        error={error}
        onRetry={() => refetchDownloads()}
      />
    );
  }

  // UI: Empty State - No downloads
  if (!data || data.length === 0) {
    return (
      <EmptyState
        variant="card"
        title="No downloads available"
        description="No downloads found for this render."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Groups List */}
      {Object.keys(groupedByCategory).length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <SubsectionTitle>Download Categories</SubsectionTitle>
          <div className="flex items-center gap-2">
            <Label>Filter by category:</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(groupedByCategory).map(
                  ([category, downloads]) => {
                    const uniqueAssets = groupBy(
                      downloads,
                      (download) =>
                        download.attributes.asset?.data?.attributes?.Name ||
                        "Unknown Asset"
                    );
                    const assetCount = Object.keys(uniqueAssets).length;
                    return (
                      <SelectItem key={category} value={category}>
                        {category} ({assetCount} asset
                        {assetCount > 1 ? "s" : ""})
                      </SelectItem>
                    );
                  }
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {Object.keys(groupedByCategory).length > 0 && selectedCategory !== "all"
        ? Object.entries(groupedByCategory)
            .filter(([category]) => selectedCategory === category)
            .map(([category, downloads]) => {
              // Group downloads within each category by asset name
              const groupedByAsset = groupBy(
                downloads,
                (download) =>
                  download.attributes.asset?.data?.attributes?.Name ||
                  "Unknown Asset"
              );

              return (
                <ElementContainer
                  key={category}
                  title={category}
                  border={false}
                  padding="none"
                  margin="lg"
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">Asset</TableHead>
                        <TableHead className="text-center">Processed</TableHead>
                        <TableHead className="text-center">Errors</TableHead>
                        <TableHead className="text-center">Downloads</TableHead>
                        <TableHead className="text-center">Strapi</TableHead>
                        <TableHead className="text-center">View</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(groupedByAsset).map(
                        ([assetName, assetDownloads]) => {
                          // Check overall status for this asset group
                          const allProcessed = assetDownloads.every(
                            (d) => d.attributes.hasBeenProcessed
                          );
                          const hasErrors = assetDownloads.some(
                            (d) => d.attributes.hasError
                          );

                          return (
                            <TableRow key={assetName}>
                              <TableCell className="text-left">
                                <div className="font-medium">{assetName}</div>
                                <Text
                                  variant="small"
                                  className="text-slate-500"
                                >
                                  {assetDownloads.length} item
                                  {assetDownloads.length > 1 ? "s" : ""}
                                </Text>
                              </TableCell>

                              <TableCell className="text-center">
                                {allProcessed ? (
                                  <div className="flex justify-center items-center">
                                    <CheckIcon className="text-green-500 w-4 h-4" />
                                  </div>
                                ) : (
                                  <div className="flex justify-center items-center">
                                    <XIcon className="text-red-500 w-4 h-4" />
                                  </div>
                                )}
                              </TableCell>

                              <TableCell className="text-center">
                                {hasErrors ? (
                                  <div className="flex justify-center items-center">
                                    <XIcon className="text-red-500 w-4 h-4" />
                                  </div>
                                ) : (
                                  <div className="flex justify-center items-center">
                                    <CheckIcon className="text-green-500 w-4 h-4" />
                                  </div>
                                )}
                              </TableCell>

                              <TableCell className="text-center">
                                <div className="flex flex-col gap-1">
                                  {/* Show type badges */}
                                  {assetDownloads.map((download) => {
                                    const assetType =
                                      download.attributes.asset_category?.data
                                        ?.attributes?.Identifier || "Unknown";
                                    return (
                                      <span
                                        key={`type-${download.id}`}
                                        className={`text-xs px-2 py-1 rounded font-medium ${
                                          assetType === "VIDEO"
                                            ? "bg-blue-100 text-blue-800"
                                            : assetType === "IMAGE" ||
                                              assetType === "PHOTO"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {assetType}
                                      </span>
                                    );
                                  })}

                                  {/* Show download links */}
                                  {assetDownloads
                                    .filter(
                                      (download) =>
                                        download?.attributes?.downloads &&
                                        Array.isArray(
                                          download.attributes.downloads
                                        ) &&
                                        download.attributes.downloads.length > 0
                                    )
                                    .map((download) => (
                                      <a
                                        key={`download-${download.id}`}
                                        href={
                                          (
                                            download.attributes.downloads as {
                                              url: string;
                                            }[]
                                          )[0].url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline text-sm"
                                      >
                                        {download.attributes.Name.length > 20
                                          ? `${download.attributes.Name.substring(
                                              0,
                                              20
                                            )}...`
                                          : download.attributes.Name}
                                      </a>
                                    ))}
                                </div>
                              </TableCell>

                              <TableCell className="text-center">
                                <div className="flex flex-col gap-1">
                                  {assetDownloads.map((download) => (
                                    <Link
                                      key={download.id}
                                      href={`${strapiLocation.download}${download.id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Button variant="outline" size="sm">
                                        <DatabaseIcon size="14" />
                                      </Button>
                                    </Link>
                                  ))}
                                </div>
                              </TableCell>

                              <TableCell className="text-center">
                                <div className="flex flex-col gap-1">
                                  {assetDownloads.map((download) => (
                                    <Link
                                      key={download.id}
                                      href={`/dashboard/downloads/${download.id}`}
                                    >
                                      <Button variant="outline" size="sm">
                                        View
                                      </Button>
                                    </Link>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </ElementContainer>
              );
            })
        : null}
    </div>
  );
}
