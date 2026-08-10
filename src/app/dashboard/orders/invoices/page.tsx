"use client";

import { useMemo, useState } from "react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useAdminInvoicesData } from "@/hooks/orders/useAdminInvoices";
import { isCmsApiError } from "@/lib/services/utils/cms-api-error";
import InvoiceRequestTable from "./components/InvoiceRequestTable";
import InvoiceQueueFilters from "./components/InvoiceQueueFilters";
import InvoiceQueuePresetTabs from "./components/InvoiceQueuePresetTabs";
import {
  buildInvoiceQueueParams,
  createDefaultInvoiceQueueFilters,
  isUnfilteredInvoiceQueue,
  type InvoiceQueueFilterState,
} from "./utils/invoiceQueueParams";
import {
  hasActiveInvoiceQueueFilters,
  type InvoiceQueuePreset,
} from "./utils/invoiceQueueFormatters";

function getInvoiceQueueErrorDescription(error: unknown): string {
  if (isCmsApiError(error)) {
    if (error.status === 403) {
      return "Permission denied. Verify the Strapi staff token includes adminInvoicesList, adminInvoicesDetail, and adminInvoicesUpdate.";
    }
    if (error.isNetworkError) {
      return "Network error while loading invoice requests. Check your connection and try again.";
    }
    if (error.status === 408 || error.message.toLowerCase().includes("timeout")) {
      return "The request timed out. Try again or narrow your filters.";
    }
    if (error.status != null && error.status >= 500) {
      return "The CMS returned an unexpected server error. Try again shortly.";
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred while loading invoice requests.";
}

export default function AdminInvoicesPage() {
  const [filters, setFilters] = useState<InvoiceQueueFilterState>(
    createDefaultInvoiceQueueFilters
  );

  const params = useMemo(
    () => buildInvoiceQueueParams(filters, ""),
    [filters]
  );

  const { items, total, meta, isLoading, isError, error, refetch, isFetching } =
    useAdminInvoicesData(params);

  const showInitialLoading = isLoading;
  const showTableLoading = isFetching && !isLoading && items.length === 0;
  const showTable = !showInitialLoading && !isError && items.length > 0;
  const showEmpty = !showInitialLoading && !isError && items.length === 0;

  const filtersActive = hasActiveInvoiceQueueFilters({
    preset: filters.preset,
    search: "",
    status: filters.status,
    accountIdInput: "",
    sort: filters.sort,
    sortDir: filters.sortDir,
    pageSize: filters.pageSize,
  });

  const handleClearFilters = () => {
    setFilters(createDefaultInvoiceQueueFilters());
  };

  const handlePresetChange = (preset: InvoiceQueuePreset) => {
    setFilters((current) => ({
      ...current,
      preset,
      status: undefined,
      page: 1,
    }));
  };

  const queueDescription = !showInitialLoading && !isError
    ? `${total} request${total !== 1 ? "s" : ""}${
        filtersActive ? " matching current filters" : ""
      }`
    : "Find, review and issue invoice requests";

  return (
    <>
      <CreatePageTitle
        title="Invoice Requests"
        byLine="Invoice Management Workspace"
        byLineBottom="Staff queue for manual invoice requests and linked orders"
      />

      <InvoiceQueuePresetTabs
        value={filters.preset}
        onValueChange={handlePresetChange}
      />

      <PageContainer padding="xs" spacing="lg">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-slate-900">
                Invoice queue
              </h2>
              <p className="text-sm text-muted-foreground">{queueDescription}</p>
            </div>
            <Button
              variant="accent"
              size="sm"
              className="shrink-0"
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label="Refresh invoice queue"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-4">
            <InvoiceQueueFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
              page={filters.page}
              totalPages={meta?.totalPages ?? 0}
              totalItems={total}
              onPageChange={(page) =>
                setFilters((current) => ({ ...current, page }))
              }
            />
          </div>

          <div className="rounded-md border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Invoice queue table
              </h3>
              <p className="text-xs text-muted-foreground">
                Manual invoice requests in the selected preset and filters.
              </p>
            </div>
            <div className="p-4">
              {showInitialLoading && (
                <LoadingState variant="skeleton" message="Loading invoices…" />
              )}

              {showTableLoading && (
                <LoadingState variant="skeleton" message="Loading invoices…" />
              )}

              {isError && (
                <ErrorState
                  variant="card"
                  error={getInvoiceQueueErrorDescription(error)}
                  title="Error loading invoices"
                  onRetry={() => refetch()}
                />
              )}

              {showEmpty && (
                <EmptyState
                  variant="card"
                  title={
                    isUnfilteredInvoiceQueue(filters, "")
                      ? "No invoice requests"
                      : "No matching invoice requests"
                  }
                  description={
                    isUnfilteredInvoiceQueue(filters, "")
                      ? "There are no invoice requests in the queue yet."
                      : "No requests match the current filters. Try adjusting or clearing them."
                  }
                  action={
                    filtersActive ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                      >
                        Clear filters
                      </Button>
                    ) : undefined
                  }
                />
              )}

              {showTable && (
                <div
                  className={
                    isFetching ? "opacity-70 transition-opacity" : undefined
                  }
                  aria-busy={isFetching}
                >
                  <InvoiceRequestTable items={items} />
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
