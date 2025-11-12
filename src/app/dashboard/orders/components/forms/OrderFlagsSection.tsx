"use client";

import { OrderStatusSwitches } from "./OrderStatusSwitches";
import { OrderFlagsSectionProps } from "./types";
import { SECTION_DEFAULTS } from "./constants";
import { cn } from "@/lib/utils";

/**
 * OrderFlagsSection Component
 *
 * A reusable section component that wraps OrderStatusSwitches with section header and description.
 * Provides a consistent way to display order status flags with contextual information.
 *
 * @example
 * ```tsx
 * <OrderFlagsSection
 *   switches={[
 *     { id: "is-active", label: "Is Active", field: "isActive", checked: formData.isActive },
 *     { id: "order-paid", label: "Order Paid", field: "OrderPaid", checked: formData.OrderPaid },
 *   ]}
 *   onChange={(field, checked) => setFormData({ ...formData, [field]: checked })}
 *   columns={3}
 * />
 * ```
 */
export function OrderFlagsSection({
  switches,
  onChange,
  disabled = false,
  columns = 3,
  title,
  description,
  className,
}: OrderFlagsSectionProps) {
  const sectionTitle = title || SECTION_DEFAULTS.orderFlags.title;
  const sectionDescription = description || SECTION_DEFAULTS.orderFlags.description;

  return (
    <div className={cn("space-y-4", className)}>
      <OrderStatusSwitches
        switches={switches}
        onChange={onChange}
        disabled={disabled}
        columns={columns}
        title={sectionTitle}
        description={sectionDescription}
      />
    </div>
  );
}

