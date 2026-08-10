import type {
  FetchAdminInvoicesParams,
  InvoiceRequestStatus,
} from "@/types/adminInvoice";
import {
  INVOICE_QUEUE_DEFAULTS,
  type FetchAdminInvoicesSort,
  type FetchAdminInvoicesSortDir,
  type InvoiceQueuePreset,
  parsePositiveAccountId,
} from "./invoiceQueueFormatters";

export interface InvoiceQueueFilterState {
  preset: InvoiceQueuePreset;
  search: string;
  status?: InvoiceRequestStatus;
  accountIdInput: string;
  sort: FetchAdminInvoicesSort;
  sortDir: FetchAdminInvoicesSortDir;
  page: number;
  pageSize: number;
}

export function createDefaultInvoiceQueueFilters(): InvoiceQueueFilterState {
  return {
    preset: INVOICE_QUEUE_DEFAULTS.preset,
    search: "",
    status: undefined,
    accountIdInput: "",
    sort: INVOICE_QUEUE_DEFAULTS.sort,
    sortDir: INVOICE_QUEUE_DEFAULTS.sortDir,
    page: INVOICE_QUEUE_DEFAULTS.page,
    pageSize: INVOICE_QUEUE_DEFAULTS.pageSize,
  };
}

export function buildInvoiceQueueParams(
  filters: InvoiceQueueFilterState,
  debouncedSearch: string
): FetchAdminInvoicesParams {
  const trimmedSearch = debouncedSearch.trim();
  const accountId = parsePositiveAccountId(filters.accountIdInput);

  const params: FetchAdminInvoicesParams = {
    page: filters.page,
    pageSize: filters.pageSize,
    sort: filters.sort,
    sortDir: filters.sortDir,
  };

  if (trimmedSearch) {
    params.search = trimmedSearch;
  }

  if (accountId != null) {
    params.accountId = accountId;
  }

  if (filters.status) {
    params.status = filters.status;
  } else if (filters.preset !== "all") {
    params.preset = filters.preset;
  }

  return params;
}

export function isUnfilteredInvoiceQueue(
  filters: InvoiceQueueFilterState,
  debouncedSearch: string
): boolean {
  return (
    filters.preset === INVOICE_QUEUE_DEFAULTS.preset &&
    !debouncedSearch.trim() &&
    !filters.status &&
    !parsePositiveAccountId(filters.accountIdInput) &&
    filters.sort === INVOICE_QUEUE_DEFAULTS.sort &&
    filters.sortDir === INVOICE_QUEUE_DEFAULTS.sortDir &&
    filters.pageSize === INVOICE_QUEUE_DEFAULTS.pageSize
  );
}
