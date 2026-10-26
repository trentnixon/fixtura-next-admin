export type AssetTypeRef = {
  identifier?: string | null;
  name?: string | null;
};

export type AssetTypeGroup<T> = {
  key: string;
  label: string;
  items: T[];
};

const UNKNOWN_KEY = "UNKNOWN";

const COMPOSITION_LABELS: Record<string, string> = {
  cricketladder: "Ladder",
  cricketupcoming: "Upcoming",
  cricketresults: "Results",
  cricketresultsingle: "Single result",
  cricketroster: "Team list",
  crickettop5bowling: "Top 5 bowling",
  crickettop5batting: "Top 5 batting",
};

/** Turns CricketLadder into Ladder, and AFLUpcoming into Upcoming. */
export function compositionAssetTypeLabel(compositionId: string): string {
  const id = compositionId.trim();
  const known = COMPOSITION_LABELS[id.toLowerCase()];
  if (known) return known;
  const withoutSport = id.replace(
    /^(Cricket|AFL|Hockey|Netball|Basketball)/,
    "",
  );
  const words = withoutSport
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/(\d+)/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim();
  return words || id;
}

/**
 * Asset type is the composition (Ladder, Upcoming), not the output category (Video, Image).
 */
export function assetTypeRefFromDownload(source: {
  compositionId?: string | null;
  assetTypeName?: string | null;
  assetName?: string | null;
}): AssetTypeRef {
  const compositionId = source.compositionId?.trim() ?? "";
  if (compositionId) {
    return {
      identifier: compositionId,
      name: compositionAssetTypeLabel(compositionId),
    };
  }
  const typeName = source.assetTypeName?.trim() ?? "";
  if (typeName) return { name: typeName };
  const assetName = source.assetName?.trim() ?? "";
  return { name: assetName || null };
}

export function assetTypeFromRef(ref: AssetTypeRef): {
  key: string;
  label: string;
} {
  const identifier = ref.identifier?.trim() ?? "";
  const name = ref.name?.trim() ?? "";
  if (!identifier && !name) {
    return { key: UNKNOWN_KEY, label: "Unknown" };
  }
  return {
    key: (identifier || name).toUpperCase(),
    label: name || identifier,
  };
}

export function groupByAssetType<T>(
  items: readonly T[],
  resolve: (item: T) => AssetTypeRef,
): AssetTypeGroup<T>[] {
  const groups = new Map<string, AssetTypeGroup<T>>();

  for (const item of items) {
    const { key, label } = assetTypeFromRef(resolve(item));
    const existing = groups.get(key);
    if (existing) {
      existing.items.push(item);
      continue;
    }
    groups.set(key, { key, label, items: [item] });
  }

  return [...groups.values()].sort((a, b) => {
    if (a.key === UNKNOWN_KEY) return 1;
    if (b.key === UNKNOWN_KEY) return -1;
    return a.label.localeCompare(b.label);
  });
}
