import type { DownloadQualityQueueRow } from "@/types/downloadQualityControl";
import {
  downloadQueueGroupKey,
  downloadQueueGroupLabel,
} from "./groupDownloadQueueRows";

export type DownloadQueueAssetTypeOption = {
  key: string;
  label: string;
};

/** Distinct asset types on the current result page (`assetCategoryIdentifier`). */
export function uniqueAssetTypesFromQueueRows(
  rows: DownloadQualityQueueRow[],
): DownloadQueueAssetTypeOption[] {
  const keys = new Set<string>();
  for (const row of rows) {
    keys.add(downloadQueueGroupKey(row, "assetCategoryIdentifier"));
  }
  return [...keys]
    .sort((a, b) => a.localeCompare(b))
    .map((key) => ({
      key,
      label: downloadQueueGroupLabel(key),
    }));
}

export function filterQueueRowsByAssetType(
  rows: DownloadQualityQueueRow[],
  assetTypeKey: string,
): DownloadQualityQueueRow[] {
  return rows.filter(
    (row) =>
      downloadQueueGroupKey(row, "assetCategoryIdentifier") === assetTypeKey,
  );
}
