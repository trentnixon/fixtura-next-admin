"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { AccountInfoSidebarProps } from "./types";
import { cn } from "@/lib/utils";

/**
 * AccountInfoSidebar Component
 *
 * A reusable sidebar component for displaying account information.
 * Shows account avatar/logo, name, type, sport, contact email, and a view button.
 * Supports loading and error states.
 *
 * @example
 * ```tsx
 * <AccountInfoSidebar
 *   account={accountData}
 *   accountId={accountId}
 *   showViewButton
 *   isLoading={isLoading}
 *   error={error}
 * />
 * ```
 */
export function AccountInfoSidebar({
  account,
  accountId,
  showViewButton = true,
  className,
  isLoading = false,
  error = null,
  actionButtons,
}: AccountInfoSidebarProps) {
  // Generate account holder initials for avatar fallback
  const firstNameInitial = account?.FirstName?.[0]?.toUpperCase() || "";
  const lastNameInitial = account?.LastName?.[0]?.toUpperCase() || "";
  const initials = firstNameInitial + lastNameInitial;

  // Get account type label
  const accountTypeLabel =
    account?.account_type === 1
      ? "Club"
      : account?.account_type === 2
      ? "Association"
      : "—";

  // Generate view account URL
  const viewAccountUrl =
    account?.account_type === 1
      ? `/dashboard/accounts/club/${accountId}`
      : account?.account_type === 2
      ? `/dashboard/accounts/association/${accountId}`
      : `/dashboard/accounts`;

  return (
    <SectionContainer
      title="Account Information"
      description="Account details for this invoice"
      className={cn("col-span-1", className)}
    >
      {error ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-destructive">
            Error loading account information
          </p>
        </div>
      ) : isLoading || !account ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">
            Loading account information...
          </p>
        </div>
      ) : (
        <>
          {/* Account Name with Avatar/Logo */}
          <div className="flex items-center gap-3 pb-2">
            <Avatar className="h-16 w-16 border-2 border-border">
              {account.accountOrganisationDetails?.ParentLogo ? (
                <AvatarImage
                  src={account.accountOrganisationDetails.ParentLogo}
                  alt={
                    account.accountOrganisationDetails?.Name || "Account Logo"
                  }
                  className="object-contain p-1"
                />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {initials || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base truncate">
                {account.FirstName} {account.LastName || ""}
              </p>
              {account.accountOrganisationDetails?.Name && (
                <p className="text-sm text-muted-foreground truncate">
                  {account.accountOrganisationDetails.Name}
                </p>
              )}
              <p className="text-xs text-muted-foreground">Account Holder</p>
            </div>
          </div>

          <Separator />

          {/* Account Details */}
          <div className="space-y-2 text-sm">
            {account.account_type && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Account Type</span>
                <span className="font-medium">{accountTypeLabel}</span>
              </div>
            )}
            {account.Sport && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sport</span>
                <span className="font-medium">{account.Sport}</span>
              </div>
            )}
          </div>

          {/* Contact Email */}
          {account.DeliveryAddress && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">
                    Contact Email
                  </p>
                  <a
                    href={`mailto:${account.DeliveryAddress}`}
                    className="text-sm font-medium text-primary hover:underline break-all"
                  >
                    {account.DeliveryAddress}
                  </a>
                </div>
              </div>
            </>
          )}

          {/* View Account Button */}
          {showViewButton && (
            <>
              <Separator />
              <Button variant="primary" className="w-full" asChild>
                <Link href={viewAccountUrl}>View Account</Link>
              </Button>
            </>
          )}

          {/* Action Buttons (e.g., Cancel, Save Changes) */}
          {actionButtons && (
            <>
              <Separator />
              <div className="space-y-2">{actionButtons}</div>
            </>
          )}
        </>
      )}
    </SectionContainer>
  );
}
