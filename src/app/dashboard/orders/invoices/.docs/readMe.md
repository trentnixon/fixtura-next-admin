# Folder Overview

Staff invoice management workspace: queue list, combined invoice-request/order editor, and CMS aggregate PATCH integration.

## Files

- `page.tsx`: Invoice request queue with presets, debounced search, filters, sorting, pagination, and operational states.
- `components/InvoiceQueueFilters.tsx`: Preset, search, status, account, sort, and page-size controls.
- `components/InvoiceQueuePagination.tsx`: Shared pagination wrapper for the queue.
- `components/InvoiceRequestTable.tsx`: Presentational queue table with detail links and formatting helpers.
- `utils/invoiceQueueFormatters.ts`: Status labels, currency/date formatting, availability text, account validation.
- `utils/invoiceQueueParams.ts`: Default filter state and CMS query serialization.
- `[invoiceRequestId]/page.tsx`: Detail shell with loading, 404, error/retry, aggregate summary, and editor.
- `[invoiceRequestId]/components/InvoiceBreadcrumbHeader.tsx`: Detail breadcrumb (Dashboard → Orders → Invoices → Request #id).
- `[invoiceRequestId]/components/InvoiceDetailToolbar.tsx`: Detail actions — View account, View order (when linked), Back to queue.
- `[invoiceRequestId]/components/InvoiceAggregateSummary.tsx`: Record panel for identity and linked context (status in header; account, plan, timestamps, order link).
- `utils/invoiceAccountRoute.ts`: Club vs association account detail route from aggregate account type.
- `utils/invoiceDetailPageTitle.ts`: Detail CreatePageTitle copy from aggregate org name and status.
- `[invoiceRequestId]/components/InvoiceEditor.tsx`: Editor orchestration with save, issuance, stale-conflict, and dirty state inside form workspace.
- `[invoiceRequestId]/components/InvoiceFormWorkspace.tsx`: Form workspace shell (header, main/aside body, footer actions) — `container.pattern.form-workspace`.
- `[invoiceRequestId]/components/InvoiceFormSection.tsx`: Compact section header inside the form workspace (no nested card). Intentional substitute for `SectionContainer variant="compact"` so inner sections are not card-in-card.
- `[invoiceRequestId]/components/InvoiceEditorSidePanel.tsx`: Side rail for account, order ops, and invoice URL open/copy actions.
- `[invoiceRequestId]/components/InvoiceUrlActions.tsx`: Shared Open/Copy controls for invoice URLs.
- `[invoiceRequestId]/components/InvoiceLifecycleControls.tsx`: Lifecycle workflow strip, next-status transitions, and request notes.
- `[invoiceRequestId]/components/InvoiceLifecycleSteps.tsx`: Read-only happy-path FSM workflow strip — `navigation.pattern.workflow-steps`.
- `[invoiceRequestId]/components/InvoiceBillingFields.tsx`: Billing organisation, contact, and email fields.
- `[invoiceRequestId]/components/InvoiceRequestedServiceFields.tsx`: Editable requested amount, currency, and service dates.
- `[invoiceRequestId]/components/InvoiceLinkedOrderEditor.tsx`: Editable linked-order invoice metadata and final terms.
- `[invoiceRequestId]/components/InvoiceFieldError.tsx`: Inline validation message helper.
- `[invoiceRequestId]/components/InvoiceStaleConflictDialog.tsx`: Discard / Keep my changes / Cancel review.
- `[invoiceRequestId]/components/InvoiceIssuanceConfirmDialog.tsx`: Issuance side-effect confirmation.
- `[invoiceRequestId]/components/InvoiceNoLinkedOrderBanner.tsx`: `order: null` repair banner.
- `[invoiceRequestId]/components/InvoiceInlineAlert.tsx`: Shared warning/error inline alert shell for repair + integrity banners.

## Child Modules

- `./.docs/readMe.md`
- `./.docs/QA-Invoice-Workspace-2026-07-23.md`
- `./.docs/Release-Checklist.md`

## Relations

- Parent: `src/app/dashboard/orders/readMe.md`
- Services: `src/lib/services/orders/fetchAdminInvoices.ts`, `fetchAdminInvoiceDetail.ts`, `updateAdminInvoice.ts`, `validateInvoiceEditorForm.ts`
- Hooks: `src/hooks/orders/useAdminInvoices.ts`, `useAdminInvoiceDetail.ts`, `useAdminInvoiceUpdate.ts`
- CMS handoff: `.comms/Strapi/handoff/cms-handoff-admin-invoice-workspace.md`
