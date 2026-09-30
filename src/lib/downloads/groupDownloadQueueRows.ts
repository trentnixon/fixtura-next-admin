import type { DownloadQualityQueueRow } from "@/types/downloadQualityControl";
import type { DownloadQcGroupBy } from "./downloadQualityControlParams";

const UNCATEGORIZED_KEY = "__uncategorized__";

export function downloadQueueGroupKey(
  row: DownloadQualityQueueRow,
  groupBy: DownloadQcGroupBy,
): string {
  switch (groupBy) {
    case "groupingCategory":
      return row.groupingCategory?.trim() || UNCATEGORIZED_KEY;
    case "assetCategoryIdentifier":
      return row.assetCategoryIdentifier?.trim() || UNCATEGORIZED_KEY;
    case "assetCategoryName":
      return row.assetCategoryName?.trim() || UNCATEGORIZED_KEY;
    default:
      return "";
  }
}

export function downloadQueueGroupLabel(key: string): string {
  return key === UNCATEGORIZED_KEY ? "Uncategorized" : key;
}

export type DownloadQueueRowGroup = {
  key: string;
  label: string;
  rows: DownloadQualityQueueRow[];
};

export function groupDownloadQueueRows(
  rows: DownloadQualityQueueRow[],
  groupBy: DownloadQcGroupBy,
): DownloadQueueRowGroup[] {
  if (groupBy === "none") {
    return [{ key: "__flat__", label: "", rows }];
  }

  const map = new Map<string, DownloadQualityQueueRow[]>();
  for (const row of rows) {
    const key = downloadQueueGroupKey(row, groupBy);
    const list = map.get(key) ?? [];
    list.push(row);
    map.set(key, list);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, groupRows]) => ({
      key,
      label: downloadQueueGroupLabel(key),
      rows: groupRows,
    }));
}
