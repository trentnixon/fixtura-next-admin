"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type { QueryObserverResult } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAdminInvoiceUpdate } from "@/hooks/orders/useAdminInvoiceUpdate";
import {
  getAdminInvoiceErrorPresentation,
  getBlockedSaveMessage,
} from "@/lib/services/orders/adminInvoiceErrorMessages";
import {
  aggregateToFormValues,
  buildAdminInvoicePatch,
  NO_STATUS_CHANGE,
  type InvoiceEditorFormValues,
} from "@/lib/services/orders/buildAdminInvoicePatch";
import { getAllowedNextStatusesForAggregate } from "@/lib/services/orders/adminInvoiceTransitions";
import {
  isCmsApiError,
  isStaleConflict,
  type CmsApiError,
} from "@/lib/services/utils/cms-api-error";
import type {
  AdminInvoiceAggregate,
  AdminInvoicePatchPayload,
  AdminInvoicePatchResponse,
  InvoiceRequestStatus,
} from "@/types/adminInvoice";
import {
  collectInvoiceEditorDirtyState,
  reapplyDirtyInvoiceEditorFields,
  type InvoiceEditorDirtyState,
} from "@/lib/services/orders/reapplyDirtyInvoiceEditorFields";
import { validateInvoiceEditorForm } from "@/lib/services/orders/validateInvoiceEditorForm";
import { formatAdminInvoiceEmailStatus } from "../../utils/invoiceQueueFormatters";
import InvoiceIssuanceConfirmDialog from "./InvoiceIssuanceConfirmDialog";
import InvoiceMarkPaidConfirmDialog from "./InvoiceMarkPaidConfirmDialog";
import InvoiceExitConfirmDialog from "./InvoiceExitConfirmDialog";
import InvoiceInlineAlert from "./InvoiceInlineAlert";
import InvoiceNoLinkedOrderBanner from "./InvoiceNoLinkedOrderBanner";
import InvoiceStaleConflictDialog from "./InvoiceStaleConflictDialog";
import InvoiceLifecycleControls, {
  type InvoiceLifecycleAction,
} from "./InvoiceLifecycleControls";
import InvoiceBillingFields from "./InvoiceBillingFields";
import InvoiceRequestedServiceFields from "./InvoiceRequestedServiceFields";
import InvoiceLinkedOrderEditor from "./InvoiceLinkedOrderEditor";
import InvoiceFormWorkspace from "./InvoiceFormWorkspace";
import InvoiceEditorSidePanel from "./InvoiceEditorSidePanel";

interface InvoiceEditorProps {
  initialAggregate: AdminInvoiceAggregate;
  refetch: () => Promise<
    QueryObserverResult<AdminInvoiceAggregate, CmsApiError>
  >;
}

type IntegrityAlert = {
  title: string;
  description: string;
  severity: "error" | "warning";
};

type ConfirmDialogKind = "create_send" | "mark_paid" | "decline" | "cancel";

function applyAggregateToEditor(aggregate: AdminInvoiceAggregate): {
  form: InvoiceEditorFormValues;
  nextStatus: typeof NO_STATUS_CHANGE;
} {
  return {
    form: aggregateToFormValues(aggregate),
    nextStatus: NO_STATUS_CHANGE,
  };
}

function hasDirtyChanges(
  baseline: AdminInvoiceAggregate,
  form: InvoiceEditorFormValues,
  nextStatus: InvoiceRequestStatus | typeof NO_STATUS_CHANGE
): boolean {
  const buildResult = buildAdminInvoicePatch({ baseline, form, nextStatus });
  return buildResult.kind === "ready";
}

function successToastForAction(
  action: ConfirmDialogKind | "save",
  result: AdminInvoicePatchResponse
): { title: string; description: string } {
  const order = result.aggregate.order;
  const emailNote = formatAdminInvoiceEmailStatus(result.emailStatus ?? null);

  if (action === "create_send") {
    return {
      title: "Invoice created",
      description: [
        order
          ? `Order #${order.id} is invoice issued, unpaid, and inactive.`
          : null,
        emailNote,
      ]
        .filter(Boolean)
        .join(" "),
    };
  }

  if (action === "mark_paid") {
    return {
      title: "Invoice marked paid",
      description: order
        ? `Order #${order.id} is now ${order.checkoutStatus ?? "active"}, paid, and ${order.isActive ? "active" : "inactive"}.`
        : "Invoice request is paid.",
    };
  }

  if (action === "cancel") {
    return {
      title: "Invoice request cancelled",
      description: order
        ? `Order #${order.id} is ${order.checkoutStatus ?? "updated"} and no longer awaiting payment.`
        : "The invoice request is cancelled.",
    };
  }

  if (action === "decline") {
    return {
      title: "Invoice request declined",
      description: order
        ? `Order #${order.id} is ${order.checkoutStatus ?? "updated"} and no longer awaiting payment.`
        : "The invoice request is declined.",
    };
  }

  return {
    title: "Invoice saved",
    description:
      result.changedFields.length > 0
        ? `Updated ${result.changedFields.length} field(s): ${result.changedFields.join(", ")}.`
        : "No fields changed on the server.",
  };
}

export default function InvoiceEditor({
  initialAggregate,
  refetch,
}: InvoiceEditorProps) {
  const { mutateAsync, isPending } = useAdminInvoiceUpdate();

  const [baseline, setBaseline] = useState(initialAggregate);
  const [form, setForm] = useState<InvoiceEditorFormValues>(() =>
    aggregateToFormValues(initialAggregate)
  );
  const [nextStatus, setNextStatus] = useState<
    InvoiceRequestStatus | typeof NO_STATUS_CHANGE
  >(NO_STATUS_CHANGE);
  const [showValidation, setShowValidation] = useState(false);

  const [pendingPayload, setPendingPayload] =
    useState<AdminInvoicePatchPayload | null>(null);
  const [confirmKind, setConfirmKind] = useState<ConfirmDialogKind | null>(
    null
  );

  const [staleDialogOpen, setStaleDialogOpen] = useState(false);
  const [staleCode, setStaleCode] = useState<
    "STALE_INVOICE_REQUEST" | "STALE_ORDER"
  >("STALE_INVOICE_REQUEST");
  const [serverSnapshot, setServerSnapshot] =
    useState<AdminInvoiceAggregate | null>(null);
  const [dirtyStateAtConflict, setDirtyStateAtConflict] =
    useState<InvoiceEditorDirtyState | null>(null);
  const [formAtConflict, setFormAtConflict] =
    useState<InvoiceEditorFormValues | null>(null);

  const [integrityAlert, setIntegrityAlert] = useState<IntegrityAlert | null>(
    null
  );

  const currentStatus = baseline.invoiceRequest.status;
  const hasLinkedOrder = baseline.order != null;
  const allowedNextStatuses = getAllowedNextStatusesForAggregate(
    currentStatus,
    hasLinkedOrder
  );

  const validation = useMemo(
    () =>
      validateInvoiceEditorForm({
        form,
        nextStatus,
        baseline,
        allowedNextStatuses,
      }),
    [form, nextStatus, baseline, allowedNextStatuses]
  );

  const isDirty = useMemo(
    () => hasDirtyChanges(baseline, form, nextStatus),
    [baseline, form, nextStatus]
  );

  const canSave = isDirty && validation.isValid && !isPending;

  const replaceBaseline = useCallback((next: AdminInvoiceAggregate) => {
    setBaseline(next);
  }, []);

  const resetEditorFromAggregate = useCallback(
    (aggregate: AdminInvoiceAggregate) => {
      const next = applyAggregateToEditor(aggregate);
      setForm(next.form);
      setNextStatus(next.nextStatus);
      setShowValidation(false);
      replaceBaseline(aggregate);
    },
    [replaceBaseline]
  );

  const updateFormField = useCallback(
    <K extends keyof InvoiceEditorFormValues>(field: K, value: string) => {
      setForm((current) => ({ ...current, [field]: value }));
    },
    []
  );

  const closeConfirm = useCallback(() => {
    setConfirmKind(null);
    setPendingPayload(null);
  }, []);

  const submitPatch = useCallback(
    async (
      payload: AdminInvoicePatchPayload,
      action: ConfirmDialogKind | "save"
    ) => {
      try {
        const result = await mutateAsync({
          invoiceRequestId: baseline.invoiceRequest.id,
          payload,
        });

        resetEditorFromAggregate(result.aggregate);
        setIntegrityAlert(null);
        closeConfirm();

        const toastCopy = successToastForAction(action, result);
        toast.success(toastCopy.title, {
          description: toastCopy.description,
        });
      } catch (error) {
        if (isStaleConflict(error) && isCmsApiError(error)) {
          const code =
            error.cmsCode === "STALE_ORDER"
              ? "STALE_ORDER"
              : "STALE_INVOICE_REQUEST";

          const refetchResult = await refetch();
          const snapshot = refetchResult.data ?? null;

          setStaleCode(code);
          setServerSnapshot(snapshot);
          setDirtyStateAtConflict(
            collectInvoiceEditorDirtyState(baseline, form, nextStatus)
          );
          setFormAtConflict({ ...form });
          setStaleDialogOpen(true);
          closeConfirm();
          return;
        }

        const presentation = getAdminInvoiceErrorPresentation(error);
        if (presentation.showInlineAlert) {
          setIntegrityAlert({
            title: presentation.title,
            description: presentation.description,
            severity: presentation.severity,
          });
        }

        toast.error(presentation.title, {
          description: presentation.description,
        });
      }
    },
    [
      baseline,
      form,
      nextStatus,
      mutateAsync,
      refetch,
      resetEditorFromAggregate,
      closeConfirm,
    ]
  );

  function prepareLifecyclePayload(
    targetStatus: InvoiceRequestStatus
  ): AdminInvoicePatchPayload | null {
    setShowValidation(true);

    const lifecycleValidation = validateInvoiceEditorForm({
      form,
      nextStatus: targetStatus,
      baseline,
      allowedNextStatuses,
    });

    if (!lifecycleValidation.isValid) {
      toast.error("Fix validation errors", {
        description: "Correct the highlighted fields before continuing.",
      });
      return null;
    }

    const buildResult = buildAdminInvoicePatch({
      baseline,
      form,
      nextStatus: targetStatus,
    });

    if (buildResult.kind === "empty") {
      toast.info("Nothing to save", {
        description: "No invoice request or order fields were changed.",
      });
      return null;
    }

    if (buildResult.kind === "blocked") {
      const presentation = getBlockedSaveMessage(buildResult.reason);
      if (presentation.showInlineAlert) {
        setIntegrityAlert({
          title: presentation.title,
          description: presentation.description,
          severity: presentation.severity,
        });
      }
      toast.error(presentation.title, {
        description: presentation.description,
      });
      return null;
    }

    return buildResult.payload;
  }

  function handleLifecycleAction(action: InvoiceLifecycleAction) {
    const targetStatus: InvoiceRequestStatus =
      action === "create_send"
        ? "invoice_created"
        : action === "mark_paid"
          ? "paid"
          : action === "decline"
            ? "declined"
            : "cancelled";

    const payload = prepareLifecyclePayload(targetStatus);
    if (!payload) {
      return;
    }

    setNextStatus(targetStatus);
    setPendingPayload(payload);
    setConfirmKind(action);
  }

  function handleSaveClick() {
    setShowValidation(true);

    const saveValidation = validateInvoiceEditorForm({
      form,
      nextStatus: NO_STATUS_CHANGE,
      baseline,
      allowedNextStatuses,
    });

    if (!saveValidation.isValid) {
      toast.error("Fix validation errors", {
        description: "Correct the highlighted fields before saving.",
      });
      return;
    }

    const buildResult = buildAdminInvoicePatch({
      baseline,
      form,
      nextStatus: NO_STATUS_CHANGE,
    });

    if (buildResult.kind === "empty") {
      toast.info("Nothing to save", {
        description: "No invoice request or order fields were changed.",
      });
      return;
    }

    if (buildResult.kind === "blocked") {
      const presentation = getBlockedSaveMessage(buildResult.reason);
      toast.error(presentation.title, {
        description: presentation.description,
      });
      return;
    }

    void submitPatch(buildResult.payload, "save");
  }

  function handleConfirm() {
    if (!pendingPayload || !confirmKind) {
      return;
    }
    void submitPatch(pendingPayload, confirmKind);
  }

  function handleReset() {
    resetEditorFromAggregate(baseline);
    toast.message("Changes reverted", {
      description: "The form was reset to the last saved CMS state.",
    });
  }

  function handleStaleDiscard() {
    if (!serverSnapshot) {
      setStaleDialogOpen(false);
      return;
    }
    resetEditorFromAggregate(serverSnapshot);
    setDirtyStateAtConflict(null);
    setFormAtConflict(null);
    setStaleDialogOpen(false);
    toast.message("Loaded latest CMS state", {
      description: "Your unsaved edits were discarded.",
    });
  }

  function handleStaleKeepChanges() {
    if (!serverSnapshot || !dirtyStateAtConflict || !formAtConflict) {
      setStaleDialogOpen(false);
      return;
    }

    replaceBaseline(serverSnapshot);
    const reapplied = reapplyDirtyInvoiceEditorFields({
      serverSnapshot,
      dirtyState: dirtyStateAtConflict,
      userFormAtConflict: formAtConflict,
    });
    setForm(reapplied.form);
    setNextStatus(reapplied.nextStatus);
    setDirtyStateAtConflict(null);
    setFormAtConflict(null);
    setStaleDialogOpen(false);
    toast.message("Concurrency updated", {
      description:
        "Your edited fields were kept. Review the latest server state and submit again when ready.",
    });
  }

  const fieldErrors =
    showValidation || (isDirty && !validation.isValid)
      ? validation.errors
      : {};

  return (
    <div className="grid gap-6">
      <InvoiceFormWorkspace
        title="Edit invoice"
        description="Update request fields, lifecycle, and linked order terms."
        aside={
          <InvoiceEditorSidePanel
            account={baseline.account}
            order={baseline.order}
            hostedInvoiceUrl={form.hostedInvoiceUrl}
            invoicePdfUrl={form.invoicePdfUrl}
          />
        }
        footer={
          <>
            <div className="flex min-h-5 flex-1 flex-wrap items-center gap-3">
              {isDirty && (
                <span className="text-sm text-amber-700" aria-live="polite">
                  Unsaved changes
                </span>
              )}
              {isPending && (
                <span className="text-sm text-muted-foreground" aria-live="polite">
                  Saving…
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                disabled={!isDirty || isPending}
              >
                Reset changes
              </Button>
              <Button onClick={handleSaveClick} disabled={!canSave}>
                {isPending ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </>
        }
      >
        {!hasLinkedOrder && (
          <InvoiceNoLinkedOrderBanner aggregate={baseline} />
        )}

        {integrityAlert && (
          <InvoiceInlineAlert
            severity={integrityAlert.severity}
            title={integrityAlert.title}
          >
            {integrityAlert.description}
          </InvoiceInlineAlert>
        )}

        <InvoiceLifecycleControls
          currentStatus={currentStatus}
          hasLinkedOrder={hasLinkedOrder}
          requestNotes={form.requestNotes}
          isPending={isPending}
          onRequestNotesChange={(value) =>
            updateFormField("requestNotes", value)
          }
          onLifecycleAction={handleLifecycleAction}
        />

        <InvoiceBillingFields
          accountName={baseline.account.name}
          billingOrganisationName={form.billingOrganisationName}
          billingContactName={form.billingContactName}
          billingEmail={form.billingEmail}
          errors={fieldErrors}
          onChange={updateFormField}
        />

        <InvoiceRequestedServiceFields
          requestedAmount={form.requestedAmount}
          currency={form.currency}
          requestedStartDate={form.requestedStartDate}
          requestedEndDate={form.requestedEndDate}
          errors={fieldErrors}
          onChange={updateFormField}
        />

        {baseline.order && (
          <InvoiceLinkedOrderEditor
            order={baseline.order}
            invoiceNumber={form.invoiceNumber}
            invoiceDueDate={form.invoiceDueDate}
            hostedInvoiceUrl={form.hostedInvoiceUrl}
            invoicePdfUrl={form.invoicePdfUrl}
            orderTotal={form.orderTotal}
            orderCurrency={form.orderCurrency}
            startAt={form.startAt}
            endAt={form.endAt}
            errors={fieldErrors}
            onChange={updateFormField}
          />
        )}
      </InvoiceFormWorkspace>

      {baseline.order && (
        <InvoiceIssuanceConfirmDialog
          open={confirmKind === "create_send"}
          onOpenChange={(open) => {
            if (!open) {
              closeConfirm();
              setNextStatus(NO_STATUS_CHANGE);
            }
          }}
          invoiceRequestId={baseline.invoiceRequest.id}
          orderId={baseline.order.id}
          isPending={isPending}
          onConfirm={handleConfirm}
        />
      )}

      {baseline.order && (
        <InvoiceMarkPaidConfirmDialog
          open={confirmKind === "mark_paid"}
          onOpenChange={(open) => {
            if (!open) {
              closeConfirm();
              setNextStatus(NO_STATUS_CHANGE);
            }
          }}
          invoiceRequestId={baseline.invoiceRequest.id}
          orderId={baseline.order.id}
          isPending={isPending}
          onConfirm={handleConfirm}
        />
      )}

      <InvoiceExitConfirmDialog
        open={confirmKind === "decline" || confirmKind === "cancel"}
        onOpenChange={(open) => {
          if (!open) {
            closeConfirm();
            setNextStatus(NO_STATUS_CHANGE);
          }
        }}
        invoiceRequestId={baseline.invoiceRequest.id}
        orderId={baseline.order?.id ?? null}
        exitKind={confirmKind === "decline" ? "declined" : "cancelled"}
        isPending={isPending}
        onConfirm={handleConfirm}
      />

      <InvoiceStaleConflictDialog
        open={staleDialogOpen}
        onOpenChange={setStaleDialogOpen}
        staleCode={staleCode}
        serverSnapshot={serverSnapshot}
        onDiscard={handleStaleDiscard}
        onKeepChanges={handleStaleKeepChanges}
      />
    </div>
  );
}
