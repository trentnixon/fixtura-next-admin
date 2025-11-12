"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyInputProps } from "./types";
import { CURRENCIES } from "./constants";
import { cn } from "@/lib/utils";

/**
 * CurrencyInput Component
 *
 * A reusable currency input component that supports both input and select modes.
 * - Input mode: Free-form text input (3 characters max, uppercase)
 * - Select mode: Dropdown with predefined currency options
 *
 * @example
 * ```tsx
 * // Input mode (for edit forms)
 * <CurrencyInput
 *   value={formData.currency}
 *   onChange={(value) => setFormData({ ...formData, currency: value })}
 *   mode="input"
 *   required
 * />
 *
 * // Select mode (for create forms)
 * <CurrencyInput
 *   value={formData.currency}
 *   onChange={(value) => setFormData({ ...formData, currency: value })}
 *   mode="select"
 *   required
 * />
 * ```
 */
export function CurrencyInput({
  value,
  onChange,
  id = "currency",
  label = "Currency",
  required = false,
  error,
  disabled = false,
  mode = "input",
  placeholder = "AUD",
  className,
}: CurrencyInputProps) {
  if (mode === "select") {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label htmlFor={id}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger
            id={id}
            className={error ? "border-destructive" : ""}
          >
            <SelectValue placeholder={placeholder || "Select currency"} />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.label}
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

  // Input mode
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
        value={value}
        onChange={(e) => {
          const upperValue = e.target.value.toUpperCase();
          onChange(upperValue);
        }}
        placeholder={placeholder}
        maxLength={3}
        disabled={disabled}
        className={error ? "border-destructive" : ""}
      />
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

