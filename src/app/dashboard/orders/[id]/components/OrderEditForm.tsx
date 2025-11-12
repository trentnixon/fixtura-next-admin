"use client";

import { useState } from "react";
import { OrderDetail } from "@/types/orderDetail";
import { OrderUpdatePayload } from "@/lib/services/orders/updateAdminOrder";
import { CheckoutStatus } from "@/types/orderOverview";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import {
  CurrencyInput,
  DateRangeInputs,
  PaymentChannelSelect,
  ReadOnlyField,
  StatusSection,
  OrderFlagsSection,
  AccountInfoSidebar,
} from "@/app/dashboard/orders/components/forms";

interface OrderEditFormProps {
  order: OrderDetail;
  onSave: (data: OrderUpdatePayload) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

export default function OrderEditForm({
  order,
  onSave,
  onCancel,
  isSaving = false,
}: OrderEditFormProps) {
  // Fetch account details for sidebar display
  const accountId = order.account.id;
  const {
    data: accountData,
    isLoading: isAccountLoading,
    error: accountError,
  } = useAccountQuery(accountId?.toString() || "");

  const account = accountData?.data;

  const [formData, setFormData] = useState({
    name: order.name ?? "",
    currency: order.currency ?? "",
    payment: {
      channel: order.payment.channel ?? "none",
      orderPaid: order.payment.orderPaid ?? false,
      status: order.payment.status || "",
    },
    status: {
      display: (order.status.display ?? "").toLowerCase(),
      checkoutStatus: order.status.checkoutStatus ?? null,
      Status: order.status.Status ?? false,
      isActive: order.status.isActive ?? false,
      isPaused: order.status.isPaused ?? false,
      cancelAtPeriodEnd: order.status.cancelAtPeriodEnd ?? false,
      hasExpired: order.status.hasExpired ?? false,
      isExpiringSoon: order.status.isExpiringSoon ?? false,
      expireEmailSent: order.status.expireEmailSent ?? false,
      expiringSoonEmail: order.status.expiringSoonEmail ?? false,
    },
    schedule: {
      startOrderAt: order.schedule.startOrderAt
        ? new Date(order.schedule.startOrderAt).toISOString().slice(0, 16)
        : "",
      endOrderAt: order.schedule.endOrderAt
        ? new Date(order.schedule.endOrderAt).toISOString().slice(0, 16)
        : "",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Transform form data to API payload format (snake_case/PascalCase)
    // Note: name, startOrderAt, endOrderAt, account, and customer are not editable
    const updates: OrderUpdatePayload = {};

    // Currency
    if (formData.currency) {
      updates.currency = formData.currency;
    }

    // Payment fields
    if (formData.payment.channel !== "none") {
      updates.payment_channel = formData.payment.channel as
        | "stripe"
        | "invoice";
    } else if (formData.payment.channel === "none") {
      updates.payment_channel = null;
    }
    updates.OrderPaid = formData.payment.orderPaid;

    // Payment status
    if (formData.payment.status && formData.payment.status.trim() !== "") {
      updates.payment_status = formData.payment.status.trim();
    } else {
      updates.payment_status = null;
    }

    // Status fields
    // Send checkout_status - map display status to CheckoutStatus type
    if (
      formData.status.checkoutStatus !== null &&
      formData.status.checkoutStatus !== undefined
    ) {
      updates.checkout_status = formData.status.checkoutStatus;
    } else if (formData.status.display) {
      // Fallback: try to map display status to CheckoutStatus
      // Map common display values to CheckoutStatus
      const statusMap: Record<string, CheckoutStatus> = {
        paid: "complete",
        incomplete: "incomplete",
        canceled: "canceled",
        pending: "incomplete",
        past_due: "past_due",
      };
      updates.checkout_status = statusMap[formData.status.display] || null;
    }
    updates.Status = formData.status.Status;
    updates.isActive = formData.status.isActive;
    updates.isPaused = formData.status.isPaused;
    updates.cancel_at_period_end = formData.status.cancelAtPeriodEnd;

    updates.hasOrderExpired = formData.status.hasExpired;
    updates.isExpiringSoon = formData.status.isExpiringSoon;
    updates.expireEmailSent = formData.status.expireEmailSent;
    updates.expiringSoonEmail = formData.status.expiringSoonEmail;

    await onSave(updates);
  };

  return (
    <form id="order-edit-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form Section */}
        <SectionContainer
          title="Edit Order"
          description="Update order information. Name, start/end dates, account, and customer cannot be changed."
          className="col-span-2"
        >
          {/* Order Name and Currency */}
          <div className="grid gap-4 md:grid-cols-2">
            <ReadOnlyField
              label="Order Name"
              value={formData.name}
              id="order-name"
              placeholder="Order name"
            />
            <CurrencyInput
              value={formData.currency}
              onChange={(value) =>
                setFormData({ ...formData, currency: value })
              }
              mode="input"
              required={false}
            />
          </div>

          <Separator />

          {/* Stripe Customer ID and Payment Channel */}
          <div className="grid gap-4 md:grid-cols-2">
            <ReadOnlyField
              label="Stripe customer ID"
              value={order.customer.stripeCustomerId ?? ""}
              id="stripe-customer-id"
              placeholder="No customer ID"
            />
            <PaymentChannelSelect
              value={
                formData.payment.channel === "none"
                  ? null
                  : (formData.payment.channel as "stripe" | "invoice" | null)
              }
              onChange={(value) =>
                setFormData({
                  ...formData,
                  payment: {
                    ...formData.payment,
                    channel: value === null ? "none" : value,
                  },
                })
              }
              includeNone={true}
              required={false}
            />
          </div>

          <Separator />

          {/* Dates - Read Only */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Schedule</h3>
              <p className="text-sm text-muted-foreground">
                Start and end dates for this order (read-only).
              </p>
            </div>
            <DateRangeInputs
              startDate={formData.schedule.startOrderAt}
              endDate={formData.schedule.endOrderAt}
              onStartDateChange={() => {}} // Read-only, no-op
              onEndDateChange={() => {}} // Read-only, no-op
              readOnly={true}
              startLabel="Start Date"
              endLabel="End Date"
              startId="start-order-at"
              endId="end-order-at"
            />
          </div>

          <Separator />

          {/* Status & Payment Section */}
          <StatusSection
            checkoutStatus={formData.status.checkoutStatus}
            paymentStatus={formData.payment.status}
            onCheckoutStatusChange={(value) =>
              setFormData({
                ...formData,
                status: {
                  ...formData.status,
                  checkoutStatus: value,
                },
              })
            }
            onPaymentStatusChange={(value) =>
              setFormData({
                ...formData,
                payment: {
                  ...formData.payment,
                  status: value || "",
                },
              })
            }
            includeNone={true}
            required={false}
          />

          <Separator />

          {/* Boolean Status Fields */}
          <OrderFlagsSection
            switches={[
              {
                id: "status",
                label: "Status",
                field: "Status",
                checked: formData.status.Status,
              },
              {
                id: "is-active",
                label: "isActive",
                field: "isActive",
                checked: formData.status.isActive,
              },
              {
                id: "order-paid",
                label: "OrderPaid",
                field: "orderPaid",
                checked: formData.payment.orderPaid,
              },
              {
                id: "is-expiring-soon",
                label: "isExpiringSoon",
                field: "isExpiringSoon",
                checked: formData.status.isExpiringSoon,
              },
              {
                id: "expiring-soon-email",
                label: "expiringSoonEmail",
                field: "expiringSoonEmail",
                checked: formData.status.expiringSoonEmail,
              },
              {
                id: "has-order-expired",
                label: "hasOrderExpired",
                field: "hasExpired",
                checked: formData.status.hasExpired,
              },
              {
                id: "expire-email-sent",
                label: "expireEmailSent",
                field: "expireEmailSent",
                checked: formData.status.expireEmailSent,
              },
              {
                id: "cancel-at-period-end",
                label: "cancel_at_period_end",
                field: "cancelAtPeriodEnd",
                checked: formData.status.cancelAtPeriodEnd,
              },
              {
                id: "is-paused",
                label: "isPaused",
                field: "isPaused",
                checked: formData.status.isPaused,
              },
            ]}
            onChange={(field, checked) => {
              // Handle nested fields (status vs payment)
              if (field === "orderPaid") {
                setFormData({
                  ...formData,
                  payment: {
                    ...formData.payment,
                    orderPaid: checked,
                  },
                });
              } else {
                // All other fields are in status
                setFormData({
                  ...formData,
                  status: {
                    ...formData.status,
                    [field]: checked,
                  },
                });
              }
            }}
            columns={2}
          />
        </SectionContainer>

        {/* Account Info Sidebar */}
        {accountId && (
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
                  disabled={isSaving}
                  className="w-full"
                  form="order-edit-form"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="accent"
                  onClick={onCancel}
                  disabled={isSaving}
                  className="w-full"
                >
                  Cancel
                </Button>
              </>
            }
          />
        )}
      </div>
    </form>
  );
}
