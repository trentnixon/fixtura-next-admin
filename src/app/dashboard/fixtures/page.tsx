"use client";

import { RefreshCcw } from "lucide-react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { Button } from "@/components/ui/button";
import { siteNavigationCtaClass } from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import { useFixtureInsights } from "@/hooks/fixtures/useFixtureInsights";
import FixturesOverview from "./_components/FixturesOverview";

export default function FixturesPage() {
  const { isLoading, isFetching, refetch } = useFixtureInsights();

  return (
    <>
      <CreatePageTitle
        title="Fixtures"
        byLine="Fixture directory and operational insight"
        byLineBottom="Browse coverage, schedules, and match status across associations"
      >
        <Button
          size="sm"
          variant="ghost"
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className={cn(siteNavigationCtaClass, "shrink-0 self-end sm:self-auto")}
        >
          <RefreshCcw className="h-4 w-4 shrink-0 text-current" aria-hidden />
          Refresh
        </Button>
      </CreatePageTitle>
      <PageContainer padding="xs" spacing="lg">
        <FixturesOverview />
      </PageContainer>
    </>
  );
}
