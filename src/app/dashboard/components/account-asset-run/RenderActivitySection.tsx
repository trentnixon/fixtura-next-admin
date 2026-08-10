"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Button } from "@/components/ui/button";
import { useAccountAssetRunRenderActivity } from "@/hooks/account-asset-run/useAccountAssetRunRenderActivity";
import {
  buildRenderActivityWindow,
  renderActivityStatusParam,
  type RenderActivityStatusFilter,
  type RenderActivityWindowPreset,
} from "@/lib/account-asset-run/renderActivityParams";
import type { AccountAssetRunRenderActivityParams } from "@/types/accountAssetRun";
import { RenderActivityCharts } from "./RenderActivityCharts";
import { RenderActivityControls } from "./RenderActivityControls";
import { RenderActivityTable } from "./RenderActivityTable";

interface RenderActivitySectionProps {
  accountId?: number;
  defaultPageSize?: number;
  showAccountColumn?: boolean;
  title?: string;
  description?: string;
  footerLink?: { href: string; label: string };
  pageSizeOptions?: readonly number[];
}

export function RenderActivitySection({
  accountId,
  defaultPageSize = 25,
  showAccountColumn = true,
  title = "Render activity",
  description = "Asset runs in the last 48 hours (UTC rolling window)",
  footerLink,
  pageSizeOptions,
}: RenderActivitySectionProps) {
  const [windowPreset, setWindowPreset] =
    useState<RenderActivityWindowPreset>("48h");
  const [statusFilter, setStatusFilter] =
    useState<RenderActivityStatusFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const queryParams = useMemo((): AccountAssetRunRenderActivityParams => {
    const window = buildRenderActivityWindow(windowPreset);
    const status = renderActivityStatusParam(statusFilter);

    return {
      from: window.from,
      to: window.to,
      page,
      pageSize,
      ...(status ? { status } : {}),
      ...(accountId != null ? { accountId } : {}),
      includeItems: false,
    };
  }, [windowPreset, statusFilter, page, pageSize, accountId]);

  const { data, isLoading, isError, error, refetch } =
    useAccountAssetRunRenderActivity(queryParams);

  const rows = data?.data ?? [];
  const meta = data?.meta;

  const handleWindowChange = (preset: RenderActivityWindowPreset) => {
    setWindowPreset(preset);
    setPage(1);
  };

  const handleStatusChange = (filter: RenderActivityStatusFilter) => {
    setStatusFilter(filter);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  if (isLoading) {
    return (
      <SectionContainer
        title={title}
        description={description}
        variant="compact"
      >
        <LoadingState variant="default" message="Loading render activity…" />
      </SectionContainer>
    );
  }

  if (isError && error) {
    return (
      <SectionContainer
        title={title}
        description={description}
        variant="compact"
      >
        <ErrorState
          error={error instanceof Error ? error : new Error(String(error))}
          title="Could not load render activity"
          variant="default"
        />
        <Button
          type="button"
          onClick={() => refetch()}
          className="mt-2"
          size="sm"
          variant="outline"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </SectionContainer>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {footerLink ? (
          <Button variant="accent" size="sm" className="shrink-0" asChild>
            <Link href={footerLink.href}>
              {footerLink.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 lg:flex-row lg:items-start lg:justify-between">
        <RenderActivityControls
          windowPreset={windowPreset}
          onWindowPresetChange={handleWindowChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusChange}
          page={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          meta={meta}
          pageSizeOptions={pageSizeOptions}
        />
      </div>

      <div className="rounded-md border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Render activity table
          </h3>
          <p className="text-xs text-muted-foreground">
            Account runs in the selected window.
          </p>
        </div>
        <div className="p-4">
          <RenderActivityTable
            rows={rows}
            showAccountColumn={showAccountColumn}
          />
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Render timing analysis
          </h3>
          <p className="text-xs text-muted-foreground">
            Slowest runs, processing span, and start/end overlap.
          </p>
        </div>
        <div className="p-4">
          <RenderActivityCharts rows={rows} meta={meta} />
        </div>
      </div>
    </div>
  );
}
