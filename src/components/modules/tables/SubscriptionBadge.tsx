"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckIcon, AlertTriangle } from "lucide-react";

interface SubscriptionBadgeProps {
  hasActiveOrder: boolean;
  daysLeftOnSubscription: number | null;
}

/**
 * Enhanced subscription badge component with color coding and expiring soon indicator
 * Includes tooltip showing exact days remaining
 */
export function SubscriptionBadge({
  hasActiveOrder,
  daysLeftOnSubscription,
}: SubscriptionBadgeProps) {
  // Inactive subscription
  if (!hasActiveOrder) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="destructive"
              className="flex items-center gap-1 cursor-help"
            >
              <span>Inactive</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>No active subscription</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Active but no days info
  if (daysLeftOnSubscription === null) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="default"
              className="flex items-center gap-1 bg-green-600 cursor-help"
            >
              <CheckIcon className="w-3 h-3" />
              <span>Active</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Active subscription (days remaining unknown)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Expiring soon (less than 30 days)
  if (daysLeftOnSubscription <= 30) {
    const tooltipText =
      daysLeftOnSubscription === 0
        ? "Subscription expires today"
        : daysLeftOnSubscription === 1
        ? "Subscription expires in 1 day"
        : `Subscription expires in ${daysLeftOnSubscription} days`;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-yellow-500 text-yellow-700 bg-yellow-50 cursor-help"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>
                {daysLeftOnSubscription === 0
                  ? "Expires today"
                  : daysLeftOnSubscription === 1
                  ? "1 day left"
                  : `${daysLeftOnSubscription} days left`}
              </span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Active with more than 30 days
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="default"
            className="flex items-center gap-1 bg-green-600 cursor-help"
          >
            <CheckIcon className="w-3 h-3" />
            <span>Active</span>
            <span className="text-xs opacity-75 ml-1">
              ({daysLeftOnSubscription} days)
            </span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Active subscription with {daysLeftOnSubscription}{" "}
            {daysLeftOnSubscription === 1 ? "day" : "days"} remaining
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
