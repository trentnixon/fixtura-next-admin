"use client";

import { useParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
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
import { ArrowRight, DatabaseIcon, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useDownloadsQuery } from "@/hooks/downloads/useDownloadsQuery";
import { useForceDownloadAssetRerender } from "@/hooks/downloads/useForceDownloadAssetRerender";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { SubsectionTitle, Label } from "@/components/type/titles";
import Text from "@/components/ui-library/foundation/Text";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Badge } from "@/components/ui/badge";
import { DownloadAttentionBadge } from "@/app/dashboard/renders/components/DownloadAttentionBadge";
import {
  classifyDownloadAttention,
  downloadMatchesAttentionFilter,
  extractErrorHandlerTypes,
  resolveDownloadPrimaryErrorMessage,
  type DownloadAttentionFilter,
} from "@/lib/downloads/downloadAttention";
import type { Download } from "@/types/download";

const ATTENTION_FILTERS: { value: DownloadAttentionFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "needs_attention", label: "Needs attention" },
  { value: "in_progress", label: "In progress" },
  { value: "failed", label: "Failed" },
];

function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string,
): Record<string, T[]> {
  return items.reduce(
    (result, item) => {
      const key = keyFn(item);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
      return result;
    },
    {} as Record<string, T[]>,
  );
}

function attentionInputFromDownload(download: Download) {
  const { hasError, hasBeenProcessed, errorHandler } = download.attributes;
  return { hasError, hasBeenProcessed, errorHandler };
}

export default function TableDownloads() {
  const { renderID } = useParams();
  const renderId = renderID as string;
  const { strapiLocation } = useGlobalContext();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [attentionFilter, setAttentionFilter] =
    useState<DownloadAttentionFilter>("all");

  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchDownloads,
  } = useDownloadsQuery(renderId);

  const forceRerender = useForceDownloadAssetRerender(renderId);

  const filteredDownloads = useMemo(() => {
    if (!data) return [];
    return data.filter((download) => {
      const bucket = classifyDownloadAttention(attentionInputFromDownload(download));
      return downloadMatchesAttentionFilter(bucket, attentionFilter);
    });
  }, [data, attentionFilter]);

  const groupedByCategory = useMemo(
    () =>
      groupBy(
        filteredDownloads,
        (download) => download.attributes.grouping_category || "Uncategorized",
      ),
    [filteredDownloads],
  );

  useEffect(() => {
    const categoryKeys = Object.keys(groupedByCategory);
    if (categoryKeys.length === 0) return;
    if (!categoryKeys.includes(selectedCategory)) {
      setSelectedCategory(categoryKeys[0]);
    }
  }, [groupedByCategory, selectedCategory]);

  if (isLoading) {
    return <LoadingState message="Loading downloads…" />;
  }

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

  if (!data || data.length === 0) {
    return (
      <EmptyState
        variant="card"
        title="No downloads available"
        description="No downloads found for this render."
      />
    );
  }

  if (filteredDownloads.length === 0) {
    return (
      <div className="space-y-4">
        <FilterBar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          attentionFilter={attentionFilter}
          onAttentionFilterChange={setAttentionFilter}
          allDownloads={data}
        />
        <EmptyState
          variant="card"
          title="No downloads match this filter"
          description="Try another attention filter or show all downloads."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FilterBar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        attentionFilter={attentionFilter}
        onAttentionFilterChange={setAttentionFilter}
        allDownloads={data}
      />

      {Object.keys(groupedByCategory).length > 0 && selectedCategory !== "all"
        ? Object.entries(groupedByCategory)
            .filter(([category]) => selectedCategory === category)
            .map(([category, downloads]) => (
              <ElementContainer
                key={category}
                title={category}
                border={false}
                padding="none"
                margin="lg"
              >
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="text-left">Output</TableHead>
                      <TableHead className="text-center">Attention</TableHead>
                      <TableHead className="text-left">Error detail</TableHead>
                      <TableHead>Files</TableHead>
                      <TableHead className="text-right">Strapi</TableHead>
                      <TableHead className="text-right">View</TableHead>
                      <TableHead className="text-right">Rerender</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {downloads.map((download) => {
                      const bucket = classifyDownloadAttention(
                        attentionInputFromDownload(download),
                      );
                      const errorTypes = extractErrorHandlerTypes(
                        download.attributes.errorHandler,
                      );
                      const primaryError = resolveDownloadPrimaryErrorMessage(
                        download.attributes.UserErrorMessage,
                        download.attributes.errorHandler,
                      );
                      const assetType =
                        download.attributes.asset_category?.data?.attributes
                          ?.Identifier || "Unknown";
                      const assetName =
                        download.attributes.asset?.data?.attributes?.Name ||
                        "Unknown asset";
                      const fileList = Array.isArray(download.attributes.downloads)
                        ? (download.attributes.downloads as { url: string }[])
                        : [];

                      return (
                        <TableRow key={download.id}>
                          <TableCell className="text-left align-top">
                            <div className="text-sm font-medium text-slate-900">
                              {download.attributes.Name}
                            </div>
                            <Text variant="small" className="text-slate-500">
                              {assetName} · #{download.id}
                            </Text>
                          </TableCell>
                          <TableCell className="text-center align-top">
                            <DownloadAttentionBadge bucket={bucket} />
                          </TableCell>
                          <TableCell className="align-top max-w-xs">
                            {primaryError ? (
                              <p className="text-sm text-red-900 whitespace-pre-wrap">
                                {primaryError}
                              </p>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                —
                              </span>
                            )}
                            {errorTypes.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {errorTypes.map((type) => (
                                  <Badge
                                    key={type}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {download.attributes.errorEmailSentToAdmin && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                Admin email sent
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="align-top">
                            <div className="flex flex-col items-start gap-1">
                              <span
                                className={`rounded border px-2 py-0.5 text-xs font-medium ${
                                  assetType === "VIDEO"
                                    ? "border-blue-200 bg-blue-50 text-blue-700"
                                    : assetType === "IMAGE" ||
                                        assetType === "PHOTO"
                                      ? "border-green-200 bg-green-50 text-green-700"
                                      : "border-slate-200 bg-slate-50 text-slate-700"
                                }`}
                              >
                                {assetType}
                              </span>
                              {fileList.length > 0 &&
                                fileList.map((file, index) => (
                                  <a
                                    key={`${download.id}-file-${index}`}
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-blue-600 hover:underline"
                                  >
                                    Open file
                                  </a>
                                ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right align-top">
                            <Button variant="primary" size="sm" asChild>
                              <Link
                                href={`${strapiLocation.download}${download.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Open
                                <DatabaseIcon size="14" />
                              </Link>
                            </Button>
                          </TableCell>
                          <TableCell className="text-right align-top">
                            <Button variant="primary" size="sm" asChild>
                              <Link href={`/dashboard/downloads/${download.id}`}>
                                View
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                          <TableCell className="text-right align-top">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={
                                forceRerender.isPending &&
                                forceRerender.variables === download.id
                              }
                              onClick={() =>
                                forceRerender.mutate(download.id)
                              }
                            >
                              {forceRerender.isPending &&
                              forceRerender.variables === download.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <RotateCcw className="h-4 w-4" />
                              )}
                              Rerender
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ElementContainer>
            ))
        : null}
    </div>
  );
}

function FilterBar({
  selectedCategory,
  onCategoryChange,
  attentionFilter,
  onAttentionFilterChange,
  allDownloads,
}: {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  attentionFilter: DownloadAttentionFilter;
  onAttentionFilterChange: (value: DownloadAttentionFilter) => void;
  allDownloads: Download[];
}) {
  const categoriesFromAll = groupBy(
    allDownloads,
    (download) => download.attributes.grouping_category || "Uncategorized",
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between mt-4">
      <SubsectionTitle>Downloads</SubsectionTitle>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Label>Attention:</Label>
          <Select
            value={attentionFilter}
            onValueChange={(v) =>
              onAttentionFilterChange(v as DownloadAttentionFilter)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ATTENTION_FILTERS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label>Category:</Label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoriesFromAll).map(([category, items]) => (
                <SelectItem key={category} value={category}>
                  {category} ({items.length})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
