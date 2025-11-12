"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { OrderStatusSwitchProps } from "./types";
import { SWITCH_STYLES } from "./constants";
import { cn } from "@/lib/utils";

/**
 * OrderStatusSwitch Component
 *
 * A reusable switch component for order status boolean flags.
 * Features emerald green checked state and consistent styling.
 *
 * @example
 * ```tsx
 * <OrderStatusSwitch
 *   id="is-active"
 *   label="Is Active"
 *   checked={formData.isActive}
 *   onChange={(checked) => setFormData({ ...formData, isActive: checked })}
 * />
 * ```
 */
export function OrderStatusSwitch({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className,
}: OrderStatusSwitchProps) {
  return (
    <div className={cn(SWITCH_STYLES.container, className)}>
      <Label htmlFor={id} className={SWITCH_STYLES.label}>
        {label}
      </Label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className={SWITCH_STYLES.checked}
      />
    </div>
  );
}

