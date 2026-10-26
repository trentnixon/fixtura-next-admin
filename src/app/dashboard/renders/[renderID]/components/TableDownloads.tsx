"use client";

import { useParams } from "next/navigation";
import { Fragment, useMemo, useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useDownloadsQuery } from "@/hooks/downloads/useDownloadsQuery";
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
import {
  assetTypeFromRef,
  assetTypeRefFromDownload,
  groupByAssetType,
} from "@/lib/downloads/groupDownloadsByAssetType";
import type { Download } from "@/types/download";

const ALL_ASSET_TYPES = "all";

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

function resolveDownloadAssetType(download: Download) {
  const asset = download.attributes.asset?.data?.attributes;
  return assetTypeFromRef(
    assetTypeRefFromDownload({
      compositionId: asset?.CompositionID,
      assetTypeName: asset?.asset_type?.data?.attributes?.Name,
      assetName: asset?.Name,
    }),
  );
}

function attentionInputFromDownload(download: Download) {
  const { hasError, hasBeenProcessed, errorHandler } = download.attributes;
  return { hasError, hasBeenProcessed, errorHandler };
}

type DownloadFileLink = {
  url: string;
};

function isDownloadFileLink(value: unknown): value is DownloadFileLink {
  if (typeof value !== "object" || value === null) return false;
  if (!("url" in value)) return false;
  return typeof value.url === "string" && value.url.length > 0;
}

function downloadFileLinks(downloads: unknown): DownloadFileLink[] {
  if (!Array.isArray(downloads)) return [];
  return downloads.filter(isDownloadFileLink);
}

export default function TableDownloads() {
  const { renderID } = useParams();
  const renderId = renderID as string;
  const { strapiLocation } = useGlobalContext();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAssetType, setSelectedAssetType] =
    useState<string>(ALL_ASSET_TYPES);
  const [attentionFilter, setAttentionFilter] =
    useState<DownloadAttentionFilter>("all");

  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchDownloads,
  } = useDownloadsQuery(renderId);

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

  const assetTypeOptions = useMemo(() => {
    const inCategory = (data ?? []).filter(
      (download) =>
        (download.attributes.grouping_category || "Uncategorized") ===
        selectedCategory,
    );
    return groupByAssetType(inCategory, (download) => {
      const asset = download.attributes.asset?.data?.attributes;
      return assetTypeRefFromDownload({
        compositionId: asset?.CompositionID,
        assetTypeName: asset?.asset_type?.data?.attributes?.Name,
        assetName: asset?.Name,
      });
    }).map((group) => ({
      key: group.key,
      label: group.label,
      count: group.items.length,
    }));
  }, [data, selectedCategory]);

  useEffect(() => {
    const categoryKeys = Object.keys(groupedByCategory).sort((a, b) =>
      a.localeCompare(b),
    );
    if (categoryKeys.length === 0) return;
    if (!categoryKeys.includes(selectedCategory)) {
      setSelectedCategory(categoryKeys[0]);
    }
  }, [groupedByCategory, selectedCategory]);

  useEffect(() => {
    if (selectedAssetType === ALL_ASSET_TYPES) return;
    if (!assetTypeOptions.some((option) => option.key === selectedAssetType)) {
      setSelectedAssetType(ALL_ASSET_TYPES);
    }
  }, [assetTypeOptions, selectedAssetType]);

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
          selectedAssetType={selectedAssetType}
          onAssetTypeChange={setSelectedAssetType}
          assetTypeOptions={assetTypeOptions}
          attentionFilter={attentionFilter}
          onAttentionFilterChange={setAttentionFilter}
          allDownloads={data}
        />
        <EmptyState
          variant="card"
          title="No downloads match this filter"
          description="Try another attention filter, asset type, or grade."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FilterBar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedAssetType={selectedAssetType}
        onAssetTypeChange={setSelectedAssetType}
        assetTypeOptions={assetTypeOptions}
        attentionFilter={attentionFilter}
        onAttentionFilterChange={setAttentionFilter}
        allDownloads={data}
      />

      {Object.keys(groupedByCategory).length > 0 && selectedCategory !== "all"
        ? Object.entries(groupedByCategory)
            .filter(([category]) => selectedCategory === category)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([category, downloads]) => {
              const visibleDownloads = downloads.filter((download) => {
                if (selectedAssetType === ALL_ASSET_TYPES) return true;
                return (
                  resolveDownloadAssetType(download).key === selectedAssetType
                );
              });
              const assetGroups = groupByAssetType(
                visibleDownloads,
                (download) => {
                  const asset = download.attributes.asset?.data?.attributes;
                  return assetTypeRefFromDownload({
                    compositionId: asset?.CompositionID,
                    assetTypeName: asset?.asset_type?.data?.attributes?.Name,
                    assetName: asset?.Name,
                  });
                },
              );
              return (
              <ElementContainer
                key={category}
                title={category}
                border={false}
                padding="none"
                margin="lg"
              >
                {assetGroups.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No downloads for this asset type in this grade.
                  </p>
                ) : (
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="w-[36rem]">Output</TableHead>
                      <TableHead className="w-32 text-right">Attention</TableHead>
                      <TableHead className="text-right">Error detail</TableHead>
                      <TableHead className="w-28">Files</TableHead>
                      <TableHead className="w-52 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assetGroups.map((group) => (
                      <Fragment key={group.key}>
                        <TableRow className="bg-slate-100 hover:bg-slate-100">
                          <TableCell
                            colSpan={5}
                            className="py-2 text-sm font-semibold text-slate-800"
                          >
                            {group.label}
                            <span className="ml-2 font-normal text-slate-500">
                              {group.items.length}
                            </span>
                          </TableCell>
                        </TableRow>
                        {group.items.map((download) => {
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
                        download.attributes.asset?.data?.attributes?.asset_type
                          ?.data?.attributes?.Name?.trim() ||
                        download.attributes.asset?.data?.attributes?.Name ||
                        "Unknown asset";
                      const fileTypeClass =
                        assetType === "VIDEO"
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : assetType === "IMAGE" || assetType === "PHOTO"
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-slate-200 bg-slate-50 text-slate-700";
                      const fileList = downloadFileLinks(
                        download.attributes.downloads,
                      );

                      return (
                        <TableRow key={download.id}>
                          <TableCell className="w-[36rem] max-w-[36rem] align-top">
                            <div className="break-words text-sm font-medium text-slate-900">
                              {download.attributes.Name}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <Text variant="small" className="break-words text-slate-500">
                                {assetName} · #{download.id}
                              </Text>
                              <span
                                className={`rounded border px-2 py-0.5 text-xs font-medium ${fileTypeClass}`}
                              >
                                {assetType}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right align-top">
                            <div className="flex justify-end">
                              <DownloadAttentionBadge bucket={bucket} />
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs text-right align-top">
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
                              <div className="mt-1 flex flex-wrap justify-end gap-1">
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
                            {fileList.length > 0 ? (
                              <div className="flex flex-col items-start gap-1">
                                {fileList.map((file, index) => (
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
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right align-top">
                            <div className="inline-flex justify-end">
                              <Button
                                variant="primary"
                                size="sm"
                                className="!rounded-l-full !rounded-r-none"
                                asChild
                              >
                                <Link
                                  href={`${strapiLocation.download}${download.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Open CMS
                                </Link>
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                className="-ml-px !rounded-l-none !rounded-r-full border-l-0"
                                asChild
                              >
                                <Link href={`/dashboard/downloads/${download.id}`}>
                                  View
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
                )}
              </ElementContainer>
              );
            })
        : null}
    </div>
  );
}

function FilterBar({
  selectedCategory,
  onCategoryChange,
  selectedAssetType,
  onAssetTypeChange,
  assetTypeOptions,
  attentionFilter,
  onAttentionFilterChange,
  allDownloads,
}: {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedAssetType: string;
  onAssetTypeChange: (value: string) => void;
  assetTypeOptions: { key: string; label: string; count: number }[];
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
              {Object.entries(categoriesFromAll)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([category, items]) => (
                <SelectItem key={category} value={category}>
                  {category} ({items.length})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label>Asset type:</Label>
          <Select value={selectedAssetType} onValueChange={onAssetTypeChange}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="All asset types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_ASSET_TYPES}>All asset types</SelectItem>
              {assetTypeOptions.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  {option.label} ({option.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
