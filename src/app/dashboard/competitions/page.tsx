"use client";

import { useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Button } from "@/components/ui/button";
import { siteNavigationCtaClass } from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import { useCompetitionAdminStats } from "@/hooks/competitions/useCompetitionAdminStats";
import CompetitionAdminStats from "./components/CompetitionAdminStats";
import { LookupGradeTeamsButton } from "./components/LookupGradeTeamsButton";
import { getSeasonsFromSummary } from "./components/CompetitionAdminStats/helpers";

export default function Competitions() {
  const [associationInput, setAssociationInput] = useState<string>("");
  const [seasonFilter, setSeasonFilter] = useState<string | undefined>(
    undefined,
  );

  const associationIdFilter = useMemo(() => {
    if (!associationInput.trim()) {
      return undefined;
    }

    const parsed = Number(associationInput);
    return Number.isNaN(parsed) ? undefined : parsed;
  }, [associationInput]);

  const params = useMemo(
    () => ({
      associationId: associationIdFilter,
      season: seasonFilter,
    }),
    [associationIdFilter, seasonFilter],
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useCompetitionAdminStats(params);

  const seasons = useMemo(() => getSeasonsFromSummary(data), [data]);

  const isAssociationInvalid =
    associationInput.trim().length > 0 &&
    Number.isNaN(Number(associationInput));

  return (
    <>
      <CreatePageTitle
        title="Competitions"
        byLine="CMS competition directory and operational insight"
        byLineBottom="Monitor activity, timing, and size across associations and seasons"
      >
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className={cn(siteNavigationCtaClass, "shrink-0")}
          >
            <RefreshCcw className="h-4 w-4 shrink-0 text-current" aria-hidden />
            Refresh
          </Button>
          <LookupGradeTeamsButton />
        </div>
      </CreatePageTitle>
      <PageContainer padding="xs" spacing="lg">
        {isError && !isLoading && (
          <SectionContainer title="Error">
            <ErrorState
              error={
                error instanceof Error
                  ? error
                  : new Error("Unable to load competition admin statistics.")
              }
              title="Failed to load competition statistics"
              onRetry={() => refetch()}
            />
          </SectionContainer>
        )}

        {!isError && (
          <CompetitionAdminStats
            data={data}
            isInitialLoading={isLoading && !data}
            associationInput={associationInput}
            setAssociationInput={setAssociationInput}
            seasonFilter={seasonFilter}
            setSeasonFilter={setSeasonFilter}
            seasons={seasons}
            isFetching={isFetching}
            isAssociationInvalid={isAssociationInvalid}
          />
        )}
      </PageContainer>
    </>
  );
}
