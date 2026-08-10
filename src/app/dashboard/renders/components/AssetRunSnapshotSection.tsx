"use client";

import { useAccountAssetRunGlobalStatus } from "@/hooks/account-asset-run/useAccountAssetRunGlobalStatus";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { GlobalAccountAssetRunTable } from "@/app/dashboard/components/account-asset-run/GlobalAccountAssetRunTable";
import { AssetRunSnapshotRollup } from "./AssetRunSnapshotRollup";

const GLOBAL_LIMIT = 25;

export function AssetRunSnapshotSection() {
  const { data, isLoading, error, refetch, isError } =
    useAccountAssetRunGlobalStatus(GLOBAL_LIMIT);

  if (isLoading) {
    return (
      <SectionContainer
        title="Asset runs"
        description="Recent orchestration runs (last 25) — metrics below are from this list only"
        variant="compact"
      >
        <LoadingState variant="default" message="Loading asset runs…" />
      </SectionContainer>
    );
  }

  if (isError && error) {
    return (
      <SectionContainer
        title="Asset runs"
        description="Recent orchestration runs"
        variant="compact"
      >
        <ErrorState
          error={error instanceof Error ? error : new Error(String(error))}
          title="Could not load asset runs"
          variant="default"
        />
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-2 text-sm text-primary underline"
        >
          Retry
        </button>
      </SectionContainer>
    );
  }

  const rows = data?.data ?? [];

  return (
    <SectionContainer
      title="Asset runs"
      description="Recent orchestration runs (last 25). Open a run for step detail; render links appear when CMS has linked a render."
      variant="compact"
    >
      <div className="space-y-4">
        <AssetRunSnapshotRollup rows={rows} />
        <GlobalAccountAssetRunTable rows={rows} />
      </div>
    </SectionContainer>
  );
}
