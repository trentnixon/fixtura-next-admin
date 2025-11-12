"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentStatusSelectProps } from "./types";
import { PAYMENT_STATUS_OPTIONS } from "./constants";
import { cn } from "@/lib/utils";

/**
 * PaymentStatusSelect Component
 *
 * A reusable select dropdown for choosing payment status values.
 * Supports both create and edit form contexts with optional "None" option.
 *
 * @example
 * ```tsx
 * <PaymentStatusSelect
 *   value={formData.payment_status}
 *   onChange={(value) => setFormData({ ...formData, payment_status: value })}
 *   required
 *   error={errors.payment_status}
 * />
 * ```
 */
export function PaymentStatusSelect({
  value,
  onChange,
  id = "payment-status",
  label = "Payment Status",
  required = false,
  error,
  disabled = false,
  includeNone = false,
  placeholder = "Select payment status",
  className,
}: PaymentStatusSelectProps) {
  // Normalize value: convert null/undefined/empty string to "none" for display when includeNone is true
  // Otherwise, use empty string (Select component can handle this as uncontrolled)
  const displayValue =
    !value || value === "" ? (includeNone ? "none" : "") : String(value);

  const handleValueChange = (selectedValue: string) => {
    if (selectedValue === "none") {
      onChange("");
    } else {
      onChange(selectedValue);
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
          {PAYMENT_STATUS_OPTIONS.map((option) => (
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

