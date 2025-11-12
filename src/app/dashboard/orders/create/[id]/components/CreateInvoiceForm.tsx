"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminCreateInvoicePayload } from "@/types/orderDetail";
import { useAdminCreateInvoice } from "@/hooks/orders/useAdminCreateInvoice";
import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import { useSubscriptionTiers } from "@/hooks/subscription-tiers/useSubscriptionTiers";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  CurrencyInput,
  AmountInput,
  DateRangeInputs,
  SubscriptionTierSelect,
  AccountInfoSidebar,
  ReadOnlyField,
  StatusSection,
  OrderFlagsSection,
  SECTION_DEFAULTS,
} from "@/app/dashboard/orders/components/forms";

// Utils
import {
  createDefaultFormState,
  type InvoiceFormState,
} from "@/app/dashboard/orders/utils/formConstants";
import {
  getDefaultInvoiceDates,
  getInvoiceDueDate,
  calculateEndDateFromDaysInPass,
} from "@/app/dashboard/orders/utils/invoiceHelpers";
import {
  transformSubscriptionTiers,
  findSubscriptionTierById,
  type TransformedSubscriptionTier,
} from "@/app/dashboard/orders/utils/subscriptionTierHelpers";
import {
  validateInvoiceForm,
  isFormValid,
  type FormValidationErrors,
} from "@/app/dashboard/orders/utils/formValidationHelpers";
import { unitsToCents } from "@/app/dashboard/orders/utils/currencyHelpers";
import { DEFAULT_DAYS_UNTIL_DUE } from "@/app/dashboard/orders/utils/formConstants";
import { autoPopulateFromTier } from "@/app/dashboard/orders/utils/formHelpers";

interface CreateInvoiceFormProps {
  accountId: number;
}

export default function CreateInvoiceForm({
  accountId,
}: CreateInvoiceFormProps) {
  const router = useRouter();
  const { mutate: createInvoice, isPending: isCreating } =
    useAdminCreateInvoice();

  // Fetch account details for display
  const {
    data: accountData,
    isLoading: isAccountLoading,
    error: accountError,
  } = useAccountQuery(accountId.toString());

  // Fetch subscription tiers for dropdown
  const {
    data: subscriptionTiersData,
    isLoading: isSubscriptionTiersLoading,
    error: subscriptionTiersError,
  } = useSubscriptionTiers();

  const account = accountData?.data;

  // Initialize default dates
  const defaultDates = useMemo(() => getDefaultInvoiceDates(), []);

  // Initialize form state with defaults
  const [formData, setFormData] = useState<InvoiceFormState>(() =>
    createDefaultFormState(defaultDates)
  );

  // Transform subscription tiers for the dropdown
  const subscriptionTiers = useMemo(() => {
    return transformSubscriptionTiers(subscriptionTiersData?.data);
  }, [subscriptionTiersData?.data]);

  // Find the selected tier for metadata display
  const selectedTier = useMemo<TransformedSubscriptionTier | undefined>(() => {
    return findSubscriptionTierById(
      subscriptionTiers,
      formData.subscriptionTierId
    );
  }, [formData.subscriptionTierId, subscriptionTiers]);

  // Auto-populate amount and currency when tier is selected
  useEffect(() => {
    if (!selectedTier) return;

    setFormData((prev) => autoPopulateFromTier(prev, selectedTier));
  }, [selectedTier]);

  // Auto-calculate endDate based on startDate + DaysInPass
  useEffect(() => {
    if (!selectedTier?.daysInPass || !formData.startDate) {
      return;
    }

    const calculatedEndDate = calculateEndDateFromDaysInPass(
      formData.startDate,
      selectedTier.daysInPass
    );

    if (calculatedEndDate) {
      setFormData((prev) => ({
        ...prev,
        endDate: calculatedEndDate,
      }));
    }
  }, [selectedTier?.id, selectedTier?.daysInPass, formData.startDate]);

  const [errors, setErrors] = useState<FormValidationErrors>({});

  // Due date is hardcoded to today, days until due is hardcoded to 30
  const dueDate = useMemo(() => getInvoiceDueDate(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateInvoiceForm(formData);
    setErrors(validationErrors);

    if (!isFormValid(validationErrors)) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    // Format dates to ISO strings
    const startDateISO = new Date(formData.startDate).toISOString();
    const endDateISO = new Date(formData.endDate).toISOString();
    const dueDateISO = dueDate;

    // Format amount - API expects cents (e.g., 65000 for $650.00)
    // User enters in dollars, we convert to cents
    const amountValue = unitsToCents(formData.amount);

    const payload: AdminCreateInvoicePayload = {
      // Required fields - use camelCase API field names
      accountId: accountId,
      subscriptionTierId: parseInt(formData.subscriptionTierId, 10),
      amount: amountValue, // number (not string)
      currency: formData.currency,
      startDate: startDateISO, // ISO date string
      endDate: endDateISO, // ISO date string
      dueDate: dueDateISO, // ISO date string (hardcoded to today)
      daysUntilDue: DEFAULT_DAYS_UNTIL_DUE, // Hardcoded to 30 days
      checkoutStatus: formData.checkoutStatus, // Checkout status
      payment_status: formData.payment_status, // Payment status

      // Optional fields
      invoice_id: formData.invoice_id.trim() || null, // Invoice ID

      // Boolean fields
      Status: formData.Status,
      isActive: formData.isActive,
      OrderPaid: formData.OrderPaid,
      isExpiringSoon: formData.isExpiringSoon,
      expiringSoonEmail: formData.expiringSoonEmail,
      hasOrderExpired: formData.hasOrderExpired,
      expireEmailSent: formData.expireEmailSent,
      cancel_at_period_end: formData.cancel_at_period_end,
      isPaused: formData.isPaused,
    };

    createInvoice(payload, {
      onSuccess: (response) => {
        toast.success("Invoice created successfully", {
          description: `Invoice #${response.order.id} has been created.`,
        });
        // Navigate to the created order detail page
        router.push(`/dashboard/orders/${response.order.id}`);
      },
      onError: (error) => {
        toast.error("Failed to create invoice", {
          description:
            error.message || "An error occurred while creating the invoice.",
        });
      },
    });
  };

  if (isAccountLoading || isSubscriptionTiersLoading) {
    return (
      <LoadingState variant="skeleton" message="Loading form data...">
        <div className="h-64 w-full" />
      </LoadingState>
    );
  }

  if (accountError) {
    return (
      <ErrorState
        error={accountError}
        title="Error Loading Account"
        variant="card"
      />
    );
  }

  if (subscriptionTiersError) {
    return (
      <ErrorState
        error={subscriptionTiersError}
        title="Error Loading Subscription Tiers"
        variant="card"
      />
    );
  }

  return (
    <form
      id="create-invoice-form"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form Section */}
        <SectionContainer
          title="Invoice Details"
          description="Fill in the details below to create a new invoice order for this account."
          className="col-span-2"
        >
          {/* Account ID (read-only) */}
          <ReadOnlyField label="Account ID" value={accountId} id="account-id" />

          <Separator />

          {/* Subscription Tier */}
          <SubscriptionTierSelect
            value={formData.subscriptionTierId}
            onChange={(value) =>
              setFormData({ ...formData, subscriptionTierId: value })
            }
            tiers={subscriptionTiers}
            showMetadata={true}
            required
            error={errors.subscriptionTierId}
            isLoading={isSubscriptionTiersLoading}
          />

          {/* Amount and Currency */}
          <div className="grid gap-4 md:grid-cols-2">
            <AmountInput
              value={formData.amount}
              onChange={(value) => setFormData({ ...formData, amount: value })}
              required
              error={errors.amount}
              currency={formData.currency}
              showHelperText
            />

            <CurrencyInput
              value={formData.currency}
              onChange={(value) =>
                setFormData({ ...formData, currency: value })
              }
              mode="select"
              required
              error={errors.currency}
            />
          </div>

          <Separator />

          {/* Invoice ID */}
          <div className="space-y-2">
            <Label htmlFor="invoice-id">Invoice ID</Label>
            <Input
              id="invoice-id"
              type="text"
              value={formData.invoice_id}
              onChange={(e) =>
                setFormData({ ...formData, invoice_id: e.target.value })
              }
              placeholder="Enter invoice ID (optional)"
              className={errors.invoice_id ? "border-destructive" : ""}
            />
            {errors.invoice_id && (
              <p className="text-sm text-destructive">{errors.invoice_id}</p>
            )}
          </div>

          <Separator />

          {/* Dates */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">
                {SECTION_DEFAULTS.dates.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                Set the start and end dates for this invoice. Due date is set to
                today automatically.
              </p>
            </div>

            <DateRangeInputs
              startDate={formData.startDate}
              endDate={formData.endDate}
              onStartDateChange={(value) =>
                setFormData({ ...formData, startDate: value })
              }
              onEndDateChange={(value) =>
                setFormData({ ...formData, endDate: value })
              }
              errors={{
                startDate: errors.startDate,
                endDate: errors.endDate,
              }}
              required
            />
          </div>

          <Separator />

          {/* Status & Payment Section */}
          <StatusSection
            checkoutStatus={formData.checkoutStatus}
            paymentStatus={formData.payment_status}
            onCheckoutStatusChange={(value) =>
              setFormData({
                ...formData,
                checkoutStatus: (value as string) || formData.checkoutStatus,
              })
            }
            onPaymentStatusChange={(value) =>
              setFormData({ ...formData, payment_status: value || "" })
            }
            errors={{
              checkoutStatus: errors.checkoutStatus,
              paymentStatus: errors.payment_status,
            }}
            required={true}
            includeNone={false}
          />

          <Separator />

          {/* Boolean Fields Section - Order Status & Flags */}
          <OrderFlagsSection
            switches={[
              {
                id: "status",
                label: "Status",
                field: "Status",
                checked: formData.Status,
              },
              {
                id: "is-active",
                label: "Is Active",
                field: "isActive",
                checked: formData.isActive,
              },
              {
                id: "order-paid",
                label: "Order Paid",
                field: "OrderPaid",
                checked: formData.OrderPaid,
              },
              {
                id: "is-expiring-soon",
                label: "Is Expiring Soon",
                field: "isExpiringSoon",
                checked: formData.isExpiringSoon,
              },
              {
                id: "expiring-soon-email",
                label: "Expiring Soon Email",
                field: "expiringSoonEmail",
                checked: formData.expiringSoonEmail,
              },
              {
                id: "has-order-expired",
                label: "Has Order Expired",
                field: "hasOrderExpired",
                checked: formData.hasOrderExpired,
              },
              {
                id: "expire-email-sent",
                label: "Expire Email Sent",
                field: "expireEmailSent",
                checked: formData.expireEmailSent,
              },
              {
                id: "cancel-at-period-end",
                label: "Cancel at Period End",
                field: "cancel_at_period_end",
                checked: formData.cancel_at_period_end,
              },
              {
                id: "is-paused",
                label: "Is Paused",
                field: "isPaused",
                checked: formData.isPaused,
              },
            ]}
            onChange={(field, checked) =>
              setFormData({ ...formData, [field]: checked })
            }
            columns={3}
          />
        </SectionContainer>
        {/* Account Info Sidebar */}
        <AccountInfoSidebar
          account={account}
          accountId={accountId}
          showViewButton={true}
          isLoading={isAccountLoading}
          error={accountError || undefined}
          actionButtons={
            <>
              <Button
                type="submit"
                variant="primary"
                disabled={isCreating}
                className="w-full"
                form="create-invoice-form"
              >
                {isCreating ? "Creating Invoice..." : "Create Invoice"}
              </Button>
              <Button
                type="button"
                variant="accent"
                onClick={() => router.back()}
                disabled={isCreating}
                className="w-full"
              >
                Cancel
              </Button>
            </>
          }
        />
      </div>
    </form>
  );
}
