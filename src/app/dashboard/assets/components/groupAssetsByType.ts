import { Asset } from "@/types/asset";

export const NO_ASSET_TYPE = "No type";

export interface AssetTypeGroup {
  typeName: string;
  assets: Asset[];
}

export function assetTypeName(asset: Asset): string {
  const name = asset.attributes.asset_type?.data?.attributes?.Name?.trim();
  return name ? name : NO_ASSET_TYPE;
}

export function filterAssetsBySearch(assets: Asset[], searchTerm: string): Asset[] {
  const query = searchTerm.trim().toLowerCase();
  if (!query) return assets;

  return assets.filter((asset) => {
    const name = asset.attributes.Name.toLowerCase();
    const compositionId = (asset.attributes.CompositionID || "").toLowerCase();
    return name.includes(query) || compositionId.includes(query);
  });
}

export function groupAssetsByType(assets: Asset[]): AssetTypeGroup[] {
  const groups = new Map<string, Asset[]>();

  for (const asset of assets) {
    const typeName = assetTypeName(asset);
    const existing = groups.get(typeName);
    if (existing) {
      existing.push(asset);
    } else {
      groups.set(typeName, [asset]);
    }
  }

  for (const grouped of groups.values()) {
    grouped.sort((a, b) => {
      const byComposition = (a.attributes.CompositionID || "").localeCompare(
        b.attributes.CompositionID || "",
      );
      if (byComposition !== 0) return byComposition;
      return a.attributes.Name.localeCompare(b.attributes.Name);
    });
  }

  return [...groups.entries()]
    .sort(([a], [b]) => {
      if (a === NO_ASSET_TYPE) return 1;
      if (b === NO_ASSET_TYPE) return -1;
      return a.localeCompare(b);
    })
    .map(([typeName, grouped]) => ({ typeName, assets: grouped }));
}
