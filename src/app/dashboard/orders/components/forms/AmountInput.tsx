"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AmountInputProps } from "./types";
import { cn } from "@/lib/utils";

/**
 * AmountInput Component
 *
 * A reusable amount input component for dollar amounts with validation.
 * Supports helper text, currency display, and error messages.
 *
 * @example
 * ```tsx
 * <AmountInput
 *   value={formData.amount}
 *   onChange={(value) => setFormData({ ...formData, amount: value })}
 *   required
 *   error={errors.amount}
 *   currency="AUD"
 *   showHelperText
 * />
 * ```
 */
export function AmountInput({
  value,
  onChange,
  id = "amount",
  label = "Amount (in dollars)",
  required = false,
  error,
  disabled = false,
  currency,
  showHelperText = false,
  placeholder = "650.00",
  min = 0,
  max,
  step = "0.01",
  className,
}: AmountInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Input
        id={id}
        type="number"
        step={step}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={error ? "border-destructive" : ""}
      />
      {showHelperText && (
        <p className="text-xs text-muted-foreground">
          Enter amount in dollars (e.g., 650.00 for {currency || "$"}650.00)
        </p>
      )}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

