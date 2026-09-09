"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Button } from "@/components/ui/button";
import { useSchedulerByID } from "@/hooks/scheduler/useSchedulerByID";
import { getAccountPagePath } from "@/lib/account-health/accountRoutes";
import {
  siteNavigationGroupDividerClass,
  siteNavigationGroupItemClass,
  siteNavigationGroupShellClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import SchedulerPage from "./SchedulerPage";
import TableOfRenders from "./TableofRenders";

function resolveAccountType(
  name: string | undefined,
): "club" | "association" | null {
  const normalized = name?.toLowerCase();
  if (normalized === "club" || normalized === "association") {
    return normalized;
  }
  return null;
}

function groupedItemClass(withDivider: boolean) {
  return cn(
    siteNavigationGroupItemClass,
    withDivider && siteNavigationGroupDividerClass,
  );
}

export default function SchedulerDetailClient() {
  const { schedulersID } = useParams();
  const schedulerId = Number(schedulersID);
  const { strapiLocation } = useGlobalContext();
  const { data, isLoading, isError, error, refetch } =
    useSchedulerByID(schedulerId);

  const account = data?.attributes.account?.data;
  const accountType = resolveAccountType(
    account?.attributes.account_type?.data?.attributes?.Name,
  );
  const accountHref =
    account && accountType
      ? getAccountPagePath(account.id, accountType)
      : null;
  const accountLabel =
    account &&
    [account.attributes.FirstName, account.attributes.LastName]
      .filter(Boolean)
      .join(" ");

  const byLine = useMemo(() => {
    const parts = [`Scheduler ID: ${schedulerId}`];
    if (account?.attributes.Sport) {
      parts.push(account.attributes.Sport);
    }
    if (accountType) {
      parts.push(accountType === "club" ? "Club" : "Association");
    }
    return parts.join(" · ");
  }, [account?.attributes.Sport, accountType, schedulerId]);

  if (isLoading) {
    return (
      <>
        <CreatePageTitle
          title="Scheduler"
          byLine={`Scheduler ID: ${schedulerId}`}
          byLineBottom="Loading scheduler details…"
        />
        <PageContainer padding="xs" spacing="lg">
          <LoadingState variant="default" message="Loading scheduler…" />
        </PageContainer>
      </>
    );
  }

  if (isError || !data) {
    return (
      <>
        <CreatePageTitle
          title="Scheduler"
          byLine={`Scheduler ID: ${schedulerId}`}
          byLineBottom="Could not load scheduler"
        />
        <PageContainer padding="xs" spacing="lg">
          <ErrorState
            variant="default"
            title="Could not load scheduler"
            error={
              error instanceof Error
                ? error
                : new Error("Scheduler details unavailable")
            }
            onRetry={() => refetch()}
          />
        </PageContainer>
      </>
    );
  }

  const scheduleDay =
    data.attributes.days_of_the_week?.data?.attributes?.Name ?? "Not set";
  const scheduleTime = data.attributes.Time?.slice(0, 5) ?? "--:--";

  return (
    <>
      <CreatePageTitle
        title={data.attributes.Name || `Scheduler #${data.id}`}
        byLine={byLine}
        byLineBottom={`Scheduled ${scheduleTime} on ${scheduleDay}${
          accountLabel ? ` · ${accountLabel}` : ""
        }`}
      >
        <div className={siteNavigationGroupShellClass}>
          <Button
            variant="ghost"
            size="sm"
            className={groupedItemClass(true)}
            asChild
          >
            <Link href="/dashboard/schedulers">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Schedulers
            </Link>
          </Button>
          {accountHref ? (
            <Button
              variant="ghost"
              size="sm"
              className={groupedItemClass(true)}
              asChild
            >
              <Link href={accountHref}>Account</Link>
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            className={groupedItemClass(false)}
            asChild
          >
            <Link
              href={`${strapiLocation.scheduler}${data.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              CMS
              <ExternalLink className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </CreatePageTitle>

      <PageContainer padding="xs" spacing="lg">
        <div className="space-y-6">
          <SchedulerPage scheduler={data} />
          <TableOfRenders scheduler={data} />
        </div>
      </PageContainer>
    </>
  );
}
