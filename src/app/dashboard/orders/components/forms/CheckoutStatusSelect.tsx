"use client";

import { CheckoutStatus } from "@/types/orderOverview";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckoutStatusSelectProps } from "./types";
import { CHECKOUT_STATUS_OPTIONS } from "./constants";
import { cn } from "@/lib/utils";

/**
 * CheckoutStatusSelect Component
 *
 * A reusable select dropdown for choosing checkout status values.
 * Supports both create and edit form contexts with optional "None" option.
 *
 * @example
 * ```tsx
 * <CheckoutStatusSelect
 *   value={formData.checkoutStatus}
 *   onChange={(value) => setFormData({ ...formData, checkoutStatus: value })}
 *   required
 *   error={errors.checkoutStatus}
 * />
 * ```
 */
export function CheckoutStatusSelect({
  value,
  onChange,
  id = "checkout-status",
  label = "Checkout Status",
  required = false,
  error,
  disabled = false,
  includeNone = false,
  placeholder = "Select checkout status",
  className,
}: CheckoutStatusSelectProps) {
  // Normalize value: convert null/undefined/empty string to "none" for display when includeNone is true
  // Otherwise, use empty string (Select component can handle this as uncontrolled)
  const displayValue =
    value === null || value === undefined || value === ""
      ? includeNone
        ? "none"
        : ""
      : String(value);

  const handleValueChange = (selectedValue: string) => {
    if (selectedValue === "none") {
      onChange(null);
    } else {
      onChange(selectedValue as CheckoutStatus);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Select
        value={displayValue}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger id={id} className={error ? "border-destructive" : ""}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {includeNone && <SelectItem value="none">None</SelectItem>}
          {CHECKOUT_STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

