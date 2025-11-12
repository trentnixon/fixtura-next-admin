"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubscriptionTierSelectProps } from "./types";
import { cn } from "@/lib/utils";

/**
 * SubscriptionTierSelect Component
 *
 * A reusable select dropdown for choosing subscription tiers.
 * Supports metadata display and tier selection callbacks.
 *
 * @example
 * ```tsx
 * <SubscriptionTierSelect
 *   value={formData.subscriptionTierId}
 *   onChange={(value) => setFormData({ ...formData, subscriptionTierId: value })}
 *   tiers={subscriptionTiers}
 *   showMetadata
 *   onTierSelect={(tier) => console.log("Selected tier:", tier)}
 *   required
 *   error={errors.subscriptionTierId}
 * />
 * ```
 */
export function SubscriptionTierSelect({
  value,
  onChange,
  tiers,
  id = "subscription-tier",
  label = "Subscription Tier",
  required = false,
  error,
  disabled = false,
  showMetadata = false,
  onTierSelect,
  placeholder = "Select subscription tier",
  isLoading = false,
  className,
}: SubscriptionTierSelectProps) {
  const selectedTier = tiers.find((tier) => tier.id.toString() === value);

  // Call onTierSelect when tier changes (only if callback is provided)
  React.useEffect(() => {
    if (onTierSelect) {
      onTierSelect(selectedTier);
    }
  }, [selectedTier, onTierSelect]);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled || isLoading || tiers.length === 0}
      >
        <SelectTrigger id={id} className={error ? "border-destructive" : ""}>
          <SelectValue
            placeholder={
              isLoading
                ? "Loading subscription tiers..."
                : tiers.length === 0
                ? "No subscription tiers available"
                : placeholder
            }
          />
        </SelectTrigger>
        <SelectContent>
          {tiers.map((tier) => (
            <SelectItem key={tier.id} value={tier.id.toString()}>
              {tier.displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {showMetadata && selectedTier && (
        <div className="mt-4 p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">
              Subscription Tier Details
            </h4>
          </div>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            {selectedTier.title && (
              <div>
                <p className="text-muted-foreground text-xs">Title</p>
                <p className="font-medium">{selectedTier.title}</p>
              </div>
            )}
            {selectedTier.subtitle && (
              <div>
                <p className="text-muted-foreground text-xs">Subtitle</p>
                <p className="font-medium">{selectedTier.subtitle}</p>
              </div>
            )}
            {selectedTier.category && (
              <div>
                <p className="text-muted-foreground text-xs">Category</p>
                <p className="font-medium">{selectedTier.category}</p>
              </div>
            )}
            {selectedTier.price !== undefined && (
              <div>
                <p className="text-muted-foreground text-xs">Price</p>
                <p className="font-medium">
                  {selectedTier.currency} ${selectedTier.price.toFixed(2)}
                </p>
              </div>
            )}
            {selectedTier.daysInPass !== undefined && (
              <div>
                <p className="text-muted-foreground text-xs">Days in Pass</p>
                <p className="font-medium">{selectedTier.daysInPass} days</p>
              </div>
            )}
            {selectedTier.priceByWeekInPass !== undefined && (
              <div>
                <p className="text-muted-foreground text-xs">Price per Week</p>
                <p className="font-medium">
                  {selectedTier.currency} $
                  {selectedTier.priceByWeekInPass.toFixed(2)}
                </p>
              </div>
            )}
            {selectedTier.isClub !== undefined && (
              <div>
                <p className="text-muted-foreground text-xs">Club Tier</p>
                <p className="font-medium">
                  {selectedTier.isClub ? "Yes" : "No"}
                </p>
              </div>
            )}
          </div>
          {selectedTier.description && (
            <div className="pt-2 border-t border-slate-200">
              <p className="text-muted-foreground text-xs mb-1">Description</p>
              <p className="text-sm text-slate-700">
                {selectedTier.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
