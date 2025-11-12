"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentChannelSelectProps } from "./types";
import { PAYMENT_CHANNEL_OPTIONS } from "./constants";
import { cn } from "@/lib/utils";

/**
 * PaymentChannelSelect Component
 *
 * A reusable select dropdown for choosing payment channel values.
 * Supports stripe, invoice, and none options with optional "None" option.
 *
 * @example
 * ```tsx
 * <PaymentChannelSelect
 *   value={formData.payment.channel}
 *   onChange={(value) => setFormData({ ...formData, payment: { ...formData.payment, channel: value } })}
 *   includeNone
 *   required={false}
 * />
 * ```
 */
export function PaymentChannelSelect({
  value,
  onChange,
  id = "payment-channel",
  label = "Payment Channel",
  required = false,
  error,
  disabled = false,
  includeNone = true,
  placeholder = "Select payment channel",
  className,
}: PaymentChannelSelectProps) {
  // Normalize value: convert null to "none" for display
  const displayValue = value === null ? "none" : value || "none";

  const handleValueChange = (selectedValue: string) => {
    if (selectedValue === "none") {
      onChange(null);
    } else {
      onChange(selectedValue as "stripe" | "invoice");
    }
  };

  // Filter options based on includeNone prop
  const options = includeNone
    ? PAYMENT_CHANNEL_OPTIONS
    : PAYMENT_CHANNEL_OPTIONS.filter((option) => option.value !== "none");

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
          {options.map((option) => (
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
