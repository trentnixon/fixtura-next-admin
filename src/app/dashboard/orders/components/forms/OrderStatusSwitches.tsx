"use client";

import { OrderStatusSwitchesProps } from "./types";
import { OrderStatusSwitch } from "./OrderStatusSwitch";
import { GRID_COLUMNS } from "./constants";
import { cn } from "@/lib/utils";

/**
 * OrderStatusSwitches Component
 *
 * A reusable component for rendering a group of order status switches.
 * Supports configurable grid layouts and optional section header/description.
 *
 * @example
 * ```tsx
 * <OrderStatusSwitches
 *   switches={[
 *     { id: "status", label: "Status", field: "Status", checked: formData.Status },
 *     { id: "is-active", label: "Is Active", field: "isActive", checked: formData.isActive },
 *   ]}
 *   onChange={(field, checked) => setFormData({ ...formData, [field]: checked })}
 *   columns={3}
 *   title="Order Status & Flags"
 *   description="Configure order status and expiration flags"
 * />
 * ```
 */
export function OrderStatusSwitches({
  switches,
  onChange,
  disabled = false,
  columns = 3,
  title,
  description,
  className,
}: OrderStatusSwitchesProps) {
  const gridClass =
    columns === 3 ? GRID_COLUMNS.three : GRID_COLUMNS.default;

  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div>
          {title && (
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mb-4">
              {description}
            </p>
          )}
        </div>
      )}

      <div className={cn("grid gap-4", gridClass)}>
        {switches.map((switchConfig) => (
          <OrderStatusSwitch
            key={switchConfig.id}
            id={switchConfig.id}
            label={switchConfig.label}
            checked={switchConfig.checked}
            onChange={(checked) => onChange(switchConfig.field, checked)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

