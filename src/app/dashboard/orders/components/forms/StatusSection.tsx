"use client";

import { CheckoutStatusSelect } from "./CheckoutStatusSelect";
import { PaymentStatusSelect } from "./PaymentStatusSelect";
import { StatusSectionProps } from "./types";
import { SECTION_DEFAULTS, GRID_COLUMNS } from "./constants";
import { cn } from "@/lib/utils";

/**
 * StatusSection Component
 *
 * A reusable section component that combines checkout status and payment status selects.
 * Includes section header, description, and grid layout.
 *
 * @example
 * ```tsx
 * <StatusSection
 *   checkoutStatus={formData.checkoutStatus}
 *   paymentStatus={formData.payment_status}
 *   onCheckoutStatusChange={(value) => setFormData({ ...formData, checkoutStatus: value })}
 *   onPaymentStatusChange={(value) => setFormData({ ...formData, payment_status: value })}
 *   errors={{
 *     checkoutStatus: errors.checkoutStatus,
 *     paymentStatus: errors.payment_status,
 *   }}
 *   disabled={false}
 * />
 * ```
 */
export function StatusSection({
  checkoutStatus,
  paymentStatus,
  onCheckoutStatusChange,
  onPaymentStatusChange,
  errors,
  disabled = false,
  title,
  description,
  className,
  includeNone = false,
  required = true,
}: StatusSectionProps) {
  const sectionTitle = title || SECTION_DEFAULTS.status.title;
  const sectionDescription = description || SECTION_DEFAULTS.status.description;

  return (
    <div className={cn("space-y-4", className)}>
      {(sectionTitle || sectionDescription) && (
        <div>
          {sectionTitle && (
            <h3 className="text-lg font-semibold">{sectionTitle}</h3>
          )}
          {sectionDescription && (
            <p className="text-sm text-muted-foreground mt-1">
              {sectionDescription}
            </p>
          )}
        </div>
      )}

      <div className={cn("grid gap-4", GRID_COLUMNS.default)}>
        <CheckoutStatusSelect
          value={checkoutStatus}
          onChange={onCheckoutStatusChange}
          required={required}
          error={errors?.checkoutStatus}
          disabled={disabled}
          includeNone={includeNone}
        />
        <PaymentStatusSelect
          value={paymentStatus}
          onChange={onPaymentStatusChange}
          required={required}
          error={errors?.paymentStatus}
          disabled={disabled}
          includeNone={includeNone}
        />
      </div>
    </div>
  );
}

