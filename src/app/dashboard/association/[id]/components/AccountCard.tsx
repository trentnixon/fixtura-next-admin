"use client";

import { Mail, User, CreditCard, CheckCircle2, XCircle, ShoppingCart } from "lucide-react";
import { AccountDetail } from "@/types/associationDetail";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";

/**
 * AccountCard Component
 *
 * Individual account card displaying:
 * - Name (firstName, lastName), email
 * - Account type, subscription tier
 * - Active status, setup status
 * - Active order indicator
 */
interface AccountCardProps {
  account: AccountDetail;
}

export default function AccountCard({ account }: AccountCardProps) {
  const {
    firstName,
    lastName,
    email,
    accountType,
    subscriptionTier,
    isActive,
    isSetup,
    hasActiveOrder,
  } = account;

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Unnamed Account";

  return (
    <Card>
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">
              {fullName}
            </h3>
            {email && (
              <a
                href={`mailto:${email}`}
                className="text-sm text-primary hover:underline inline-flex items-center gap-1.5 break-all"
              >
                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{email}</span>
              </a>
            )}
          </div>
          {hasActiveOrder && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-green-50 border-green-500 text-green-700 flex-shrink-0"
            >
              <ShoppingCart className="h-3 w-3" />
              <span className="text-xs">Order</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {/* Account Type & Subscription Tier */}
        <div className="flex flex-wrap gap-2">
          {accountType && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <User className="h-3 w-3" />
              <span>{accountType.name}</span>
            </Badge>
          )}
          {subscriptionTier && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <CreditCard className="h-3 w-3" />
              <span>{subscriptionTier.name}</span>
            </Badge>
          )}
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <StatusBadge
            status={isActive}
            trueLabel="Active"
            falseLabel="Inactive"
            variant={isActive ? "default" : "error"}
          />
          <div className="flex items-center gap-1.5">
            {isSetup ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                <span className="text-xs text-muted-foreground">Setup Complete</span>
              </>
            ) : (
              <>
                <XCircle className="h-3.5 w-3.5 text-yellow-600" />
                <span className="text-xs text-muted-foreground">Setup Pending</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

