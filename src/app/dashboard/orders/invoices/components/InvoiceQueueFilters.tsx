"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INVOICE_REQUEST_STATUSES } from "@/lib/services/orders/adminInvoiceTransitions";
import type { InvoiceRequestStatus } from "@/types/adminInvoice";
import {
  formatInvoiceRequestStatusLabel,
  hasActiveInvoiceQueueFilters,
  type FetchAdminInvoicesSort,
  type FetchAdminInvoicesSortDir,
} from "../utils/invoiceQueueFormatters";
import type { InvoiceQueueFilterState } from "../utils/invoiceQueueParams";

interface InvoiceQueueFiltersProps {
  filters: InvoiceQueueFilterState;
  onFiltersChange: (next: InvoiceQueueFilterState) => void;
  onClearFilters: () => void;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const SORT_OPTIONS: { value: FetchAdminInvoicesSort; label: string }[] = [
  { value: "submittedAt", label: "Submitted date" },
  { value: "updatedAt", label: "Updated date" },
  { value: "requestedAmount", label: "Requested amount" },
  { value: "status", label: "Status" },
];

const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

function resetPage<T extends InvoiceQueueFilterState>(filters: T): T {
  return { ...filters, page: 1 };
}

export default function InvoiceQueueFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  page,
  totalPages,
  totalItems,
  onPageChange,
}: InvoiceQueueFiltersProps) {
  const showClearFilters = hasActiveInvoiceQueueFilters({
    preset: filters.preset,
    search: "",
    status: filters.status,
    accountIdInput: "",
    sort: filters.sort,
    sortDir: filters.sortDir,
    pageSize: filters.pageSize,
  });

  const canPrev = page > 1;
  const canNext = totalPages > 0 && page < totalPages;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect
          label="Status"
          value={filters.status ?? "all"}
          onValueChange={(value) => {
            if (value === "all") {
              onFiltersChange(
                resetPage({
                  ...filters,
                  status: undefined,
                })
              );
              return;
            }

            onFiltersChange(
              resetPage({
                ...filters,
                preset: "all",
                status: value as InvoiceRequestStatus,
              })
            );
          }}
          options={[
            { id: "all", label: "All" },
            ...INVOICE_REQUEST_STATUSES.map((status) => ({
              id: status,
              label: formatInvoiceRequestStatusLabel(status),
            })),
          ]}
        />

        <FilterSelect
          label="Sort"
          value={filters.sort}
          onValueChange={(value) =>
            onFiltersChange(
              resetPage({
                ...filters,
                sort: value as FetchAdminInvoicesSort,
              })
            )
          }
          options={SORT_OPTIONS.map((option) => ({
            id: option.value,
            label: option.label,
          }))}
          triggerClassName="w-[160px]"
        />

        <FilterSelect
          label="Direction"
          value={filters.sortDir}
          onValueChange={(value) =>
            onFiltersChange(
              resetPage({
                ...filters,
                sortDir: value as FetchAdminInvoicesSortDir,
              })
            )
          }
          options={[
            { id: "desc", label: "Descending" },
            { id: "asc", label: "Ascending" },
          ]}
        />

        <FilterSelect
          label="Page size"
          value={String(filters.pageSize)}
          onValueChange={(value) =>
            onFiltersChange(
              resetPage({
                ...filters,
                pageSize: Number(value),
              })
            )
          }
          options={PAGE_SIZE_OPTIONS.map((size) => ({
            id: String(size),
            label: String(size),
          }))}
        />

        {showClearFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
          >
            Clear filters
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        <span className="tabular-nums">
          Page {page}
          {totalPages > 0 ? ` of ${totalPages}` : ""}
          {totalItems > 0
            ? ` · ${totalItems} request${totalItems !== 1 ? "s" : ""}`
            : ""}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
  triggerClassName,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ id: string; label: string }>;
  triggerClassName?: string;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className={`h-8 w-[132px] bg-white text-xs shadow-none ${triggerClassName ?? ""}`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(({ id, label: optionLabel }) => (
            <SelectItem key={id} value={id}>
              {optionLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
